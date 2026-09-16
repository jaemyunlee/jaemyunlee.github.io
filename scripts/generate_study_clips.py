#!/usr/bin/env python3
"""
generate_study_clips.py

Automates video editing for English study clips:
1. Cuts specific sentence parts from a lesson video based on script.json timestamps.
2. Repeats each sentence 3 times:
   - 1st time: 0.7x speed (both video and audio slowed down via atempo=0.7)
   - 2nd time: 1.0x normal speed
   - 3rd time: 1.0x normal speed
3. Generates synchronized .srt subtitle files:
   - 1st repeat: "자막 없이 듣기"
   - 2nd repeat: English subtitle only
   - 3rd repeat: English + Korean subtitles together
4. Outputs individual clip MP4 + SRT files and an optional combined master practice video + SRT.
"""

import os
import sys
import json
import argparse
import subprocess
import re
from pathlib import Path

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

def normalize_text(text: str) -> str:
    """Normalize text for fuzzy matching: lowercase, strip punctuation and extra whitespace."""
    text = re.sub(r"[^\w\s]", " ", text.lower())
    return " ".join(text.split())

def find_sentence_in_script(script_data, query):
    """
    Find matching sentence in script.json by:
    1. Exact id match ('s6', '6')
    2. Substring match in normalized 'en'
    """
    query_str = str(query).strip()

    # 1. Match by ID
    id_candidate = query_str if query_str.startswith('s') else f"s{query_str}"
    for item in script_data:
        if item.get('id') == id_candidate or item.get('id') == query_str:
            return item

    # 2. Match by text substring
    norm_query = normalize_text(query_str)
    best_match = None
    best_len_diff = float('inf')

    for item in script_data:
        norm_en = normalize_text(item.get('en', ''))
        if norm_query in norm_en:
            len_diff = abs(len(norm_en) - len(norm_query))
            if len_diff < best_len_diff:
                best_len_diff = len_diff
                best_match = item

    if best_match:
        return best_match

    # 3. Keyword token overlap
    query_tokens = set(norm_query.split())
    if len(query_tokens) >= 3:
        best_score = 0
        for item in script_data:
            en_tokens = set(normalize_text(item.get('en', '')).split())
            common = query_tokens.intersection(en_tokens)
            score = len(common) / len(query_tokens)
            if score > best_score and score >= 0.7:
                best_score = score
                best_match = item
        if best_match:
            return best_match

    return None

def process_single_clip(video_path: str, start: float, end: float, output_path: str,
                        speed_first: float = 0.7, padding_start: float = 0.0,
                        padding_end: float = 0.0) -> float:
    """
    Cuts video from (start - padding_start) to (end + padding_end).
    Generates 3 repeats:
      1: speed_first (e.g. 0.7x)
      2: 1.0x
      3: 1.0x
    Returns the total duration in seconds of the generated clip.
    """
    actual_start = max(0.0, start - padding_start)
    actual_end = end + padding_end
    clip_dur = actual_end - actual_start

    # Use fast keyframe seek with a 3-second margin for speed and frame-accurate trimming
    seek_margin = min(3.0, actual_start)
    fast_seek = actual_start - seek_margin
    rel_start = actual_start - fast_seek
    rel_end = actual_end - fast_seek

    # Video pts speed factor: PTS / speed_first
    # Audio atempo filter: speed_first (0.5 <= atempo <= 2.0)
    filter_complex = (
        f"[0:v]trim=start={rel_start:.3f}:end={rel_end:.3f},setpts=PTS-STARTPTS,split=3[v1_raw][v2][v3];"
        f"[0:a]atrim=start={rel_start:.3f}:end={rel_end:.3f},asetpts=PTS-STARTPTS,asplit=3[a1_raw][a2][a3];"
        f"[v1_raw]setpts=PTS/{speed_first:.3f}[v1];"
        f"[a1_raw]atempo={speed_first:.3f}[a1];"
        f"[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[outv][outa]"
    )

    cmd = [
        'ffmpeg', '-y',
        '-ss', f"{fast_seek:.3f}",
        '-i', video_path,
        '-filter_complex', filter_complex,
        '-map', '[outv]', '-map', '[outa]',
        '-c:v', 'libx264', '-crf', '20', '-preset', 'fast',
        '-c:a', 'aac', '-b:a', '192k',
        output_path
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg failed (code {result.returncode}):\n{result.stderr[-800:]}")

    # Inspect exact output duration
    probe_cmd = [
        'ffprobe', '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json', output_path
    ]
    probe_res = subprocess.run(probe_cmd, capture_output=True, text=True)
    probe_data = json.loads(probe_res.stdout)
    return float(probe_data['format']['duration'])

def write_srt_file(srt_path: str, subtitle_entries: list):
    """
    Writes a list of subtitle entries to an SRT file.
    Each entry is a dict: {'start': float, 'end': float, 'text': str}
    """
    with open(srt_path, 'w', encoding='utf-8') as f:
        for idx, entry in enumerate(subtitle_entries, start=1):
            start_str = format_srt_time(entry['start'])
            end_str = format_srt_time(entry['end'])
            f.write(f"{idx}\n")
            f.write(f"{start_str} --> {end_str}\n")
            f.write(f"{entry['text']}\n\n")

def combine_clips(clip_paths: list, output_path: str):
    """Concatenate multiple MP4 files using FFmpeg concat demuxer without re-encoding."""
    list_file_path = output_path + ".txt"
    with open(list_file_path, 'w', encoding='utf-8') as f:
        for clip in clip_paths:
            # Escape single quotes in file paths for ffmpeg concat
            escaped_path = os.path.abspath(clip).replace("'", "'\\''")
            f.write(f"file '{escaped_path}'\n")

    cmd = [
        'ffmpeg', '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', list_file_path,
        '-c', 'copy',
        output_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(list_file_path):
        os.remove(list_file_path)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg concat failed:\n{result.stderr[-800:]}")

def main():
    parser = argparse.ArgumentParser(description="Generate 3-repeat study clips (0.7x + 1.0x + 1.0x) and synchronized SRT subtitles.")
    parser.add_argument('--video', required=True, help="Path to source video file (e.g. video/lesson-01/lesson-01-orginal.mov)")
    parser.add_argument('--script', required=True, help="Path to lesson script.json (e.g. lessons/lesson-01/script.json)")
    parser.add_argument('--sentences', nargs='+', required=True, help="List of sentences or IDs to process")
    parser.add_argument('--output-dir', default="./video/output", help="Directory to save generated clips and SRTs")
    parser.add_argument('--speed', type=float, default=0.7, help="Speed factor for 1st playback (default: 0.7)")
    parser.add_argument('--first-sub', default="자막 없이 듣기", help="Subtitle text for 1st playback (default: '자막 없이 듣기')")
    parser.add_argument('--padding-start', type=float, default=0.0, help="Extra padding seconds before speech start")
    parser.add_argument('--padding-end', type=float, default=0.0, help="Extra padding seconds after speech end")
    parser.add_argument('--no-combine', action='store_true', help="Do not create combined compilation video")

    args = parser.parse_args()

    video_path = os.path.abspath(args.video)
    if not os.path.exists(video_path):
        print(f"❌ Video not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    script_path = os.path.abspath(args.script)
    if not os.path.exists(script_path):
        print(f"❌ script.json not found: {script_path}", file=sys.stderr)
        sys.exit(1)

    with open(script_path, 'r', encoding='utf-8') as f:
        script_data = json.load(f)

    out_dir = Path(args.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"🎬 Processing {len(args.sentences)} target sentences from:\n   Video: {video_path}\n   Script: {script_path}\n   Output: {out_dir}\n")

    matched_items = []
    for query in args.sentences:
        item = find_sentence_in_script(script_data, query)
        if not item:
            print(f"⚠️ Warning: Could not find match in script for query: '{query}'")
            continue
        matched_items.append((query, item))

    if not matched_items:
        print("❌ No matching sentences found. Exiting.", file=sys.stderr)
        sys.exit(1)

    generated_clips = []
    combined_subtitles = []
    current_combined_time = 0.0

    for idx, (query, item) in enumerate(matched_items, start=1):
        s_id = item.get('id', f"item_{idx}")
        start = float(item['start'])
        end = float(item['end'])
        en_text = item.get('en', '').strip()
        kr_text = item.get('kr', '').strip()
        raw_dur = (end + args.padding_end) - max(0.0, start - args.padding_start)

        safe_slug = re.sub(r'[^a-zA-Z0-9]+', '_', en_text[:35].lower()).strip('_')
        clip_filename = f"{idx:02d}_{s_id}_{safe_slug}.mp4"
        srt_filename = f"{idx:02d}_{s_id}_{safe_slug}.srt"
        clip_path = str(out_dir / clip_filename)
        srt_path = str(out_dir / srt_filename)

        print(f"[{idx}/{len(matched_items)}] Processing {s_id}: [{start:.2f}s -> {end:.2f}s] (dur: {raw_dur:.2f}s)")
        print(f"    EN: {en_text}")
        print(f"    KR: {kr_text}")

        # Render 3-repeat video
        total_dur = process_single_clip(
            video_path=video_path,
            start=start,
            end=end,
            output_path=clip_path,
            speed_first=args.speed,
            padding_start=args.padding_start,
            padding_end=args.padding_end
        )

        # Calculate exact segment durations
        dur_first = raw_dur / args.speed
        dur_second = raw_dur
        dur_third = raw_dur

        # Adjust slightly if actual output duration has slight container padding
        measured_sum = dur_first + dur_second + dur_third
        scale_ratio = total_dur / measured_sum if measured_sum > 0 else 1.0
        dur_first *= scale_ratio
        dur_second *= scale_ratio
        dur_third *= scale_ratio

        # Generate individual SRT entries
        individual_subtitles = [
            {
                'start': 0.0,
                'end': dur_first,
                'text': args.first_sub
            },
            {
                'start': dur_first,
                'end': dur_first + dur_second,
                'text': en_text
            },
            {
                'start': dur_first + dur_second,
                'end': dur_first + dur_second + dur_third,
                'text': f"{en_text}\n{kr_text}"
            }
        ]
        write_srt_file(srt_path, individual_subtitles)

        # Accumulate into combined SRT
        combined_subtitles.extend([
            {
                'start': current_combined_time,
                'end': current_combined_time + dur_first,
                'text': args.first_sub
            },
            {
                'start': current_combined_time + dur_first,
                'end': current_combined_time + dur_first + dur_second,
                'text': en_text
            },
            {
                'start': current_combined_time + dur_first + dur_second,
                'end': current_combined_time + dur_first + dur_second + dur_third,
                'text': f"{en_text}\n{kr_text}"
            }
        ])
        current_combined_time += total_dur

        generated_clips.append(clip_path)
        print(f"    ✅ Generated clip: {clip_filename} ({total_dur:.2f}s)")
        print(f"    ✅ Generated SRT:  {srt_filename}\n")

    # Generate combined video + SRT if requested
    if not args.no_combine and len(generated_clips) > 1:
        combined_video_path = str(out_dir / "study_clips_combined.mp4")
        combined_srt_path = str(out_dir / "study_clips_combined.srt")

        print("🔄 Generating concatenated practice video + master SRT...")
        combine_clips(generated_clips, combined_video_path)
        write_srt_file(combined_srt_path, combined_subtitles)

        print(f"🎉 Master Combined Video: {combined_video_path}")
        print(f"🎉 Master Combined SRT:   {combined_srt_path}\n")

    print("✨ All study clips and SRT subtitles generated successfully!")

if __name__ == '__main__':
    main()
