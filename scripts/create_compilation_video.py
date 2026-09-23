#!/usr/bin/env python3
"""
scripts/create_compilation_video.py

Generates a video compilation from Lessons 01 to 05:
1. Extracts key expression video clips from clean source videos (video/lesson-XX-clean-version.mp4).
2. Each key expression repeats 3 times:
   - 1st play: 0.85x speed with Korean sentence subtitles and top badge '[ 0.85x ] 느린 속도 · 한국어 자막'
   - 2nd play: 1.0x (normal) speed with dual Korean + English subtitles and top badge '[ 1.0x ] 정상 속도 · 한/영 자막'
   - 3rd play: 1.0x (normal) speed with key expression explanation at the bottom in a larger font, plus English subtitles with the key expression highlighted in yellow, and top badge '[ 1.0x ] 핵심 표현 · 영어 자막'
3. Hardsubs the beautifully styled subtitles directly into the MP4 via FFmpeg and libass.
4. Generates matching synchronized master .srt files.
5. Produces both per-lesson compilation videos and a master combined compilation video.

Usage:
  python3 scripts/create_compilation_video.py [--lessons lesson-01 lesson-02 ...] [--force] [--speed 0.85]
"""

import os
import sys
import re
import json
import argparse
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
LESSONS_DIR = ROOT_DIR / "lessons"
VIDEO_DIR = ROOT_DIR / "video"
DEFAULT_OUTPUT_DIR = VIDEO_DIR / "output"

def format_srt_time(seconds: float) -> str:
    """Format seconds into SRT timestamp: HH:MM:SS,mmm"""
    if seconds < 0:
        seconds = 0
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    if millis >= 1000:
        secs += 1
        millis -= 1000
    if secs >= 60:
        mins += 1
        secs -= 60
    if mins >= 60:
        hrs += 1
        mins -= 60
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

def format_ass_time(seconds: float) -> str:
    """Format seconds into ASS timestamp: H:MM:SS.cc (centiseconds)"""
    if seconds < 0:
        seconds = 0
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    centis = int(round((seconds - int(seconds)) * 100))
    if centis >= 100:
        secs += 1
        centis -= 100
    if secs >= 60:
        mins += 1
        secs -= 60
    if mins >= 60:
        hrs += 1
        mins -= 60
    return f"{hrs:d}:{mins:02d}:{secs:02d}.{centis:02d}"

def parse_key_expressions_srt(path: Path) -> list:
    """Parse lesson-XX-key-expressions.srt into structured entries."""
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        content = f.read().strip()
    blocks = re.split(r"\r?\n\r?\n", content)
    entries = []
    for b in blocks:
        lines = b.strip().split("\n")
        if len(lines) >= 4:
            timing = lines[1].strip()
            expr = lines[2].strip()
            ko_def = lines[3].strip()
            m = re.match(
                r"(\d+):(\d+):(\d+)[,\.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,\.](\d+)", timing
            )
            if m:
                s = (
                    int(m.group(1)) * 3600
                    + int(m.group(2)) * 60
                    + int(m.group(3))
                    + int(m.group(4)) / 1000
                )
                e = (
                    int(m.group(5)) * 3600
                    + int(m.group(6)) * 60
                    + int(m.group(7))
                    + int(m.group(8)) / 1000
                )
                entries.append({
                    "start": s,
                    "end": e,
                    "expression": expr,
                    "definition": ko_def,
                    "timing": timing
                })
    return entries

def parse_quiz_md(path: Path) -> list:
    """Parse quiz.md into structured quiz objects."""
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    blocks = re.split(r"##\s*Quiz\s*\d+", content)[1:]
    quizzes = []
    for b in blocks:
        en_m = re.search(r"-\s*\*\*English\*\*:\s*([^\n]+)", b)
        ans_m = re.search(r"-\s*\*\*Answer\*\*:\s*([^\n]+)", b)
        kr_m = re.search(r"-\s*\*\*Korean\*\*:\s*([^\n]+)", b)
        exp_m = re.search(r"-\s*\*\*Explanation\*\*:\s*([^\n]+)", b)
        en_str = en_m.group(1).strip() if en_m else ""
        ans_str = ans_m.group(1).strip() if ans_m else ""
        kr_str = kr_m.group(1).strip() if kr_m else ""
        exp_str = exp_m.group(1).strip() if exp_m else ""

        if not ans_str and "[" in en_str:
            bm = re.search(r"\[(.*?)\]", en_str)
            if bm:
                ans_str = bm.group(1).split(",")[0].strip()

        quizzes.append({
            "english": en_str,
            "answer": ans_str,
            "korean": kr_str,
            "explanation": exp_str
        })
    return quizzes

def parse_script_json(path: Path) -> list:
    """Parse script.json into sentence objects."""
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def clean_sentence_from_quiz(quiz: dict) -> tuple:
    """
    Returns (cloze_sentence, full_sentence, korean_sentence) from a quiz.
    Example:
      cloze: 'It was when the [ ? ].'
      full:  'It was when the new song came out.'
      korean: '신곡이 나왔을 때였어요.'
    """
    en = quiz.get("english", "")
    ans = quiz.get("answer", "")
    kr = quiz.get("korean", "")

    # Replace bracketed blanks with [ ? ]
    cloze = re.sub(r"\[.*?\]", "[ ? ]", en)

    # Unwrap brackets with correct answer
    def replace_bracket(m):
        content = m.group(1)
        if "," in content:
            return ans if ans else content.split(",")[0].strip()
        return ans if ans else content.strip()

    full = re.sub(r"\[(.*?)\]", replace_bracket, en)
    return cloze.strip(), full.strip(), kr.strip()

def highlight_expression_in_sentence(sentence: str, expr: str) -> str:
    """Highlights key expression in bright yellow within the English sentence for ASS."""
    if not expr:
        return sentence
    clean_expr = expr.strip()
    pat = re.escape(clean_expr)
    if re.search(pat, sentence, re.IGNORECASE):
        m = re.search(pat, sentence, re.IGNORECASE)
        matched_str = m.group(0)
        return re.sub(
            pat,
            f"{{\\\\c&H44E5FF&}}{matched_str}{{\\\\c&HFFFFFF&}}",
            sentence,
            count=1,
            flags=re.IGNORECASE
        )
    # Fallback 1: clean non-alphanumeric for resilient matching
    words_expr = re.sub(r"[^a-zA-Z0-9\s]", "", clean_expr).strip()
    if words_expr and re.search(re.escape(words_expr), sentence, re.IGNORECASE):
        m = re.search(re.escape(words_expr), sentence, re.IGNORECASE)
        matched_str = m.group(0)
        return re.sub(
            re.escape(words_expr),
            f"{{\\\\c&H44E5FF&}}{matched_str}{{\\\\c&HFFFFFF&}}",
            sentence,
            count=1,
            flags=re.IGNORECASE
        )
    # Fallback 2: flexible whitespace/hyphen matching (e.g. "second guess" vs "secondguess")
    tokens = [re.escape(t) for t in re.split(r"[\s\-]+", clean_expr) if t]
    if len(tokens) > 1:
        flex_pat = r"[\s\-]??".join(tokens)
        if re.search(flex_pat, sentence, re.IGNORECASE):
            return re.sub(
                flex_pat,
                lambda m: f"{{\\c&H44E5FF&}}{m.group(0)}{{\\c&HFFFFFF&}}",
                sentence,
                count=1,
                flags=re.IGNORECASE
            )
    return sentence

def build_ass_content(
    dur_p1: float,
    dur_p2: float,
    dur_p3: float,
    kr_sentence: str,
    full_sentence: str,
    expression: str,
    definition: str,
    speed_factor: float = 0.85
) -> str:
    """Build Advanced SubStation Alpha (.ass) subtitle script for a single 3-repeat clip."""
    t0 = format_ass_time(0.0)
    t1 = format_ass_time(dur_p1)
    t2 = format_ass_time(dur_p1 + dur_p2)
    t3 = format_ass_time(dur_p1 + dur_p2 + dur_p3)

    # Escape backslashes in text for ASS
    safe_kr = kr_sentence.replace("\\", "")
    safe_full = full_sentence.replace("\\", "")
    safe_expr = expression.replace("\\", "")
    safe_def = definition.replace("\\", "")

    highlighted_en = highlight_expression_in_sentence(safe_full, safe_expr)

    ass_text = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: MainSub,Apple SD Gothic Neo,64,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,14,0,2,50,50,75,1
Style: DualSub,Apple SD Gothic Neo,56,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,14,0,2,50,50,75,1
Style: FocusSub,Apple SD Gothic Neo,54,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,14,0,2,50,50,75,1
Style: Badge,Apple SD Gothic Neo,44,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,10,0,8,40,40,45,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,{t0},{t1},Badge,,0,0,0,,{{\\an8\\c&H42E2F7&}}[ {speed_factor:.2f}x ] 느린 속도 · 한국어 자막
Dialogue: 0,{t0},{t1},MainSub,,0,0,0,,{safe_kr}
Dialogue: 0,{t1},{t2},Badge,,0,0,0,,{{\\an8\\c&H5CE68E&}}[ 1.0x ] 정상 속도 · 한/영 자막
Dialogue: 0,{t1},{t2},DualSub,,0,0,0,,{highlighted_en}\\N{{\\fs48\\c&HE0E0E0&}}{safe_kr}
Dialogue: 0,{t2},{t3},Badge,,0,0,0,,{{\\an8\\c&HFFB84D&}}[ 1.0x ] 핵심 표현 · 영어 자막
Dialogue: 0,{t2},{t3},FocusSub,,0,0,0,,{highlighted_en}\\N{{\\fs64\\c&H44E5FF&}}{safe_expr} {{\\c&HFFFFFF&}}: {safe_def}
"""
    return ass_text

def get_video_duration(video_path: str) -> float:
    """Get accurate duration of video file in seconds."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        video_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def process_single_clip(
    src_video: str,
    start_time: float,
    end_time: float,
    speed_factor: float,
    ass_path: str,
    out_clip_path: str,
    use_hwaccel: bool = True
) -> float:
    """
    Renders a 3-repeat video clip with burned-in ASS subtitles:
    - Play 1: speed_factor (0.7x)
    - Play 2: 1.0x normal
    - Play 3: 1.0x normal
    Returns actual output duration.
    """
    raw_dur = end_time - start_time
    dur_p1 = raw_dur / speed_factor
    dur_p2 = raw_dur
    dur_p3 = raw_dur

    filter_complex = (
        f"[0:v]trim=start=0:end={raw_dur:.4f},setpts=PTS-STARTPTS[cut_v];"
        f"[0:a]atrim=start=0:end={raw_dur:.4f},asetpts=PTS-STARTPTS[cut_a];"
        "[cut_v]split=3[v_raw1][v_raw2][v_raw3];"
        "[cut_a]asplit=3[a_raw1][a_raw2][a_raw3];"
        f"[v_raw1]setpts=PTS/{speed_factor:.2f}[v1];"
        f"[a_raw1]atempo={speed_factor:.2f}[a1];"
        "[v_raw2]setpts=PTS[v2];"
        "[a_raw2]anull[a2];"
        "[v_raw3]setpts=PTS[v3];"
        "[a_raw3]anull[a3];"
        "[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[v_cat][a_out];"
        f"[v_cat]ass='{ass_path}'[v_out]"
    )

    vcodec = "h264_videotoolbox" if use_hwaccel else "libx264"
    cmd = [
        "ffmpeg", "-y",
        "-ss", f"{start_time:.3f}",
        "-to", f"{end_time:.3f}",
        "-i", src_video,
        "-filter_complex", filter_complex,
        "-map", "[v_out]",
        "-map", "[a_out]",
        "-c:v", vcodec,
        "-b:v", "6000k",
        "-c:a", "aac",
        "-b:a", "192k",
        out_clip_path
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        # Fallback to libx264 if hardware encoder fails
        if use_hwaccel:
            print("    ⚠️ VideoToolbox encoder failed, falling back to libx264...")
            cmd[cmd.index("h264_videotoolbox")] = "libx264"
            cmd.insert(cmd.index("libx264") + 1, "-preset")
            cmd.insert(cmd.index("libx264") + 2, "fast")
            res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"FFmpeg failed for {out_clip_path}:\n{res.stderr[-800:]}")

    return get_video_duration(out_clip_path)

def concat_clips(clip_paths: list, output_path: str):
    """Concatenate multiple rendered MP4 clips losslessly using concat demuxer."""
    list_txt = output_path + ".txt"
    with open(list_txt, "w", encoding="utf-8") as f:
        for c in clip_paths:
            escaped = os.path.abspath(c).replace("'", "'\\''")
            f.write(f"file '{escaped}'\n")

    cmd = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", list_txt,
        "-c", "copy",
        output_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(list_txt):
        os.remove(list_txt)

    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg concat failed:\n{res.stderr[-800:]}")

def write_srt_file(srt_path: str, subtitle_entries: list):
    """Writes subtitle entries to an SRT file."""
    with open(srt_path, "w", encoding="utf-8") as f:
        for idx, entry in enumerate(subtitle_entries, start=1):
            start_str = format_srt_time(entry["start"])
            end_str = format_srt_time(entry["end"])
            f.write(f"{idx}\n")
            f.write(f"{start_str} --> {end_str}\n")
            f.write(f"{entry['text']}\n\n")

def process_lesson(
    lesson_id: str,
    output_dir: Path,
    speed: float = 0.85,
    force_rebuild: bool = False,
    hwaccel: bool = True
) -> dict:
    """Process all key expressions for a given lesson."""
    lesson_dir = LESSONS_DIR / lesson_id
    video_path = VIDEO_DIR / f"{lesson_id}-clean-version.mp4"

    if not video_path.exists():
        print(f"❌ Video not found: {video_path}")
        return None

    srt_path = lesson_dir / f"{lesson_id}-key-expressions.srt"
    quiz_path = lesson_dir / "quiz.md"
    script_path = lesson_dir / "script.json"

    entries = parse_key_expressions_srt(srt_path)
    quizzes = parse_quiz_md(quiz_path)
    scripts = parse_script_json(script_path)

    if not entries:
        print(f"⚠️ No key expressions found for {lesson_id}")
        return None

    clips_dir = output_dir / "clips" / lesson_id
    clips_dir.mkdir(parents=True, exist_ok=True)

    print(f"\n========================================================")
    print(f"📂 Processing {lesson_id} ({len(entries)} key expressions)")
    print(f"   Video:  {video_path.name}")
    print(f"   Clips:  {clips_dir}")
    print(f"========================================================")

    lesson_clips = []
    lesson_srt_entries = []
    current_timeline_time = 0.0

    for idx, entry in enumerate(entries, start=1):
        expr = entry["expression"]
        ko_def = entry["definition"]
        start_t = entry["start"]
        end_t = entry["end"]

        # Priority 1: Match with script.json (for accurate spoken dialogue and translations)
        expr_clean = re.sub(r"[^a-z0-9]", "", expr.lower())
        matched_script = None
        for s in scripts:
            if abs(s.get("start", 0) - start_t) < 0.25 and abs(s.get("end", 0) - end_t) < 0.25:
                matched_script = s
                break
        if not matched_script:
            candidates = [s for s in scripts if expr_clean in re.sub(r"[^a-z0-9]", "", s.get("en", "").lower())]
            if candidates:
                matched_script = min(candidates, key=lambda s: abs(s.get("start", 0) - start_t))

        if matched_script:
            full_s = matched_script.get("en", expr).strip()
            kr_s = matched_script.get("kr", ko_def).strip()
        else:
            # Priority 2: Fallback to quiz.md
            matched_quiz = None
            for q in quizzes:
                q_clean = re.sub(r"[^a-z0-9]", "", q["answer"].lower())
                if q_clean == expr_clean or (len(q_clean) > 3 and q_clean in expr_clean):
                    matched_quiz = q
                    break
            if matched_quiz:
                _, full_s, kr_s = clean_sentence_from_quiz(matched_quiz)
            else:
                full_s = expr
                kr_s = ko_def

        raw_dur = end_t - start_t
        dur_p1 = raw_dur / speed
        dur_p2 = raw_dur
        dur_p3 = raw_dur
        expected_clip_dur = dur_p1 + dur_p2 + dur_p3

        slug = re.sub(r"[^a-z0-9]+", "_", expr.lower())[:30].strip("_")
        clip_filename = f"{idx:02d}_{slug}.mp4"
        clip_path = clips_dir / clip_filename
        ass_path = clips_dir / f"{idx:02d}_{slug}.ass"

        print(f"[{idx:02d}/{len(entries):02d}] {expr} : {ko_def} ({start_t:.2f}s -> {end_t:.2f}s, dur: {raw_dur:.2f}s)")
        print(f"   Sentence: {full_s}")
        print(f"   Korean:   {kr_s}")

        # Check if already processed
        clip_dur = None
        if clip_path.exists() and not force_rebuild:
            try:
                clip_dur = get_video_duration(str(clip_path))
                if abs(clip_dur - expected_clip_dur) < 0.5:
                    print(f"   ⏩ Cached clip exists ({clip_dur:.2f}s), skipping encode.")
            except Exception:
                clip_dur = None

        if clip_dur is None:
            # Generate ASS subtitle file
            ass_content = build_ass_content(
                dur_p1=dur_p1,
                dur_p2=dur_p2,
                dur_p3=dur_p3,
                kr_sentence=kr_s,
                full_sentence=full_s,
                expression=expr,
                definition=ko_def,
                speed_factor=speed
            )
            with open(ass_path, "w", encoding="utf-8") as f:
                f.write(ass_content)

            # Render 3-repeat hardsubbed clip
            clip_dur = process_single_clip(
                src_video=str(video_path),
                start_time=start_t,
                end_time=end_t,
                speed_factor=speed,
                ass_path=str(ass_path),
                out_clip_path=str(clip_path),
                use_hwaccel=hwaccel
            )
            print(f"   ✅ Rendered: {clip_filename} ({clip_dur:.2f}s)")

        lesson_clips.append(str(clip_path))

        # Build SRT subtitle entries for this clip
        scale = clip_dur / expected_clip_dur if expected_clip_dur > 0 else 1.0
        p1_len = dur_p1 * scale
        p2_len = dur_p2 * scale
        p3_len = dur_p3 * scale

        # Accumulate subtitle entries into lesson timeline
        lesson_srt_entries.append({
            "start": current_timeline_time,
            "end": current_timeline_time + p1_len,
            "text": f"[ {speed:.2f}x ] {kr_s}"
        })
        lesson_srt_entries.append({
            "start": current_timeline_time + p1_len,
            "end": current_timeline_time + p1_len + p2_len,
            "text": f"{full_s}\n{kr_s}"
        })
        lesson_srt_entries.append({
            "start": current_timeline_time + p1_len + p2_len,
            "end": current_timeline_time + clip_dur,
            "text": f"{full_s}\n{expr} : {ko_def}"
        })

        current_timeline_time += clip_dur

    # Concatenate lesson clips into lesson compilation
    lesson_video_out = str(output_dir / f"{lesson_id}_compilation.mp4")
    lesson_srt_out = str(output_dir / f"{lesson_id}_compilation.srt")

    print(f"\n🔄 Combining {len(lesson_clips)} clips for {lesson_id}...")
    concat_clips(lesson_clips, lesson_video_out)
    write_srt_file(lesson_srt_out, lesson_srt_entries)

    print(f"🎉 Generated: {lesson_video_out} (Total duration: {format_srt_time(current_timeline_time)})")
    print(f"🎉 Generated: {lesson_srt_out}")

    return {
        "lesson_id": lesson_id,
        "clips": lesson_clips,
        "srt_entries": lesson_srt_entries,
        "duration": current_timeline_time,
        "video_path": lesson_video_out,
        "srt_path": lesson_srt_out
    }

def main():
    parser = argparse.ArgumentParser(
        description="Create 3-repeat hardsubbed compilation video for Lessons 01 to 05."
    )
    parser.add_argument(
        "--lessons",
        nargs="+",
        default=["lesson-01", "lesson-02", "lesson-03", "lesson-04", "lesson-05"],
        help="List of lesson IDs to process (default: lesson-01 through lesson-05)"
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help=f"Output directory (default: {DEFAULT_OUTPUT_DIR})"
    )
    parser.add_argument(
        "--speed",
        type=float,
        default=0.85,
        help="Slow speed factor for Play 1 (default: 0.85)"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force re-render clips even if cached"
    )
    parser.add_argument(
        "--no-hwaccel",
        action="store_true",
        help="Disable VideoToolbox hardware acceleration and use libx264"
    )

    args = parser.parse_args()
    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("=================================================================")
    print("🎬 RhyRhy English - Master Video Compilation Generator")
    print(f"   Target Lessons: {args.lessons}")
    print(f"   Play 1 Speed:   {args.speed}x")
    print(f"   Output Dir:     {out_dir}")
    print(f"   Hardware Accel: {not args.no_hwaccel} (h264_videotoolbox)")
    print("=================================================================")

    all_lesson_results = []
    for lid in args.lessons:
        res = process_lesson(
            lesson_id=lid,
            output_dir=out_dir,
            speed=args.speed,
            force_rebuild=args.force,
            hwaccel=not args.no_hwaccel
        )
        if res:
            all_lesson_results.append(res)

    # If multiple lessons processed, create master combined compilation
    if len(all_lesson_results) > 1:
        print("\n=================================================================")
        print("🌟 Assembling Master Compilation Video (Lessons 01 to 05)...")
        print("=================================================================")

        all_clips = []
        master_srt_entries = []
        master_timeline_time = 0.0

        for l_res in all_lesson_results:
            all_clips.extend(l_res["clips"])
            # Re-offset lesson SRT entries into master timeline
            for entry in l_res["srt_entries"]:
                master_srt_entries.append({
                    "start": entry["start"] + master_timeline_time,
                    "end": entry["end"] + master_timeline_time,
                    "text": entry["text"]
                })
            master_timeline_time += l_res["duration"]

        master_video_out = str(out_dir / "lessons_01_to_05_compilation.mp4")
        master_srt_out = str(out_dir / "lessons_01_to_05_compilation.srt")

        concat_clips(all_clips, master_video_out)
        write_srt_file(master_srt_out, master_srt_entries)

        print(f"\n🎉 MASTER COMPILATION VIDEO: {master_video_out}")
        print(f"   Total Clips:    {len(all_clips)} key expression clips")
        print(f"   Total Duration: {format_srt_time(master_timeline_time)}")
        print(f"🎉 MASTER SUBTITLES:        {master_srt_out}\n")

    print("✨ All compilation videos and subtitles generated successfully!")

    # Auto-generate YouTube description files and timeline chapters
    try:
        import sys
        if str(ROOT_DIR) not in sys.path:
            sys.path.insert(0, str(ROOT_DIR))
        from scripts.generate_compilation_descriptions import main as gen_descriptions
        gen_descriptions()
    except Exception as e:
        print(f"⚠️ Note: Could not generate description files automatically: {e}")

if __name__ == "__main__":
    main()
