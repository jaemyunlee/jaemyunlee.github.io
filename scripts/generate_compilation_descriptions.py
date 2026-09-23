#!/usr/bin/env python3
"""
Generate YouTube Description files with clickable timeline chapters
for Compilation Videos (Lesson 01 to Lesson 05) and Master Compilation.

Creates description files in:
  - video/output/clips/lesson-XX/youtube-description.txt
  - video/output/clips/youtube-description-master.txt
  - video/output/clips/TIMELINE_CHEATSHEET.md
  - video/output/lesson-XX_youtube_description.txt
  - video/output/lessons_01_to_05_youtube_description.txt

Usage:
  python3 scripts/generate_compilation_descriptions.py
"""

import json
import os
import re
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
VIDEO_OUTPUT_DIR = ROOT_DIR / "video" / "output"
CLIPS_DIR = VIDEO_OUTPUT_DIR / "clips"
LESSONS_DIR = ROOT_DIR / "lessons"

LESSON_INFOS = {
    "lesson-01": {
        "title": "[현서네 리얼 영어] 미국에서 빅뱅 콘서트를 간다고? 🎟️ | 핵심 회화 표현 25개 3회 반복 완성 (켈리)",
        "desc": "켈리가 미국에서 열린 빅뱅 콘서트 티켓팅을 하고 사촌과 함께 떠나게 된 생생한 이야기와 함께 실전 영어 표현 25개를 3회 반복(느린 속도 한국어 → 정상 속도 한/영 → 정상 속도 영어+해설)으로 마스터해 보세요!",
        "speaker": "켈리 (Kelly)",
        "url": "https://rhyrhyenglish.site/lessons/lesson-01/"
    },
    "lesson-02": {
        "title": "[현서네 리얼 영어] 웨인 삼촌의 산골 오두막 이야기 🌲 | 핵심 회화 표현 21개 3회 반복 완성 (웨인 삼촌)",
        "desc": "켈리의 삼촌 웨인(Wayne)이 들려주는 1963년부터 이어진 캘리포니아 산속 오두막의 역사와 추억! 전기도 수도도 없던 시절의 생생한 스토리 속에서 원어민들이 매일 쓰는 알짜배기 구동사와 표현 21개를 3회 반복으로 학습해 보세요.",
        "speaker": "웨인 삼촌 (Uncle Wayne)",
        "url": "https://rhyrhyenglish.site/lessons/lesson-02/"
    },
    "lesson-03": {
        "title": "[현서네 리얼 영어] 장모님이 기억하는 켈리의 어린 시절 🏡 | 핵심 회화 표현 13개 3회 반복 완성 (패티 어머님)",
        "desc": "켈리의 어머니(패티 어머님)가 들려주는 줏대 있고 고집 세던 켈리의 유쾌한 하굣길 에피소드! 따뜻한 가족 이야기 속 자연스러운 일상 영어 표현 13개를 3회 반복 시스템으로 확실하게 내 것으로 만들어 보세요.",
        "speaker": "패티 어머님 (Patty)",
        "url": "https://rhyrhyenglish.site/lessons/lesson-03/"
    },
    "lesson-04": {
        "title": "[현서네 리얼 영어] 오클랜드 빅뱅 콘서트 직관기 🎤 | 핵심 회화 표현 22개 3회 반복 완성 (켈리)",
        "desc": "오클랜드 아레나에서 직접 마주한 빅뱅 콘서트의 열기와 멤버들의 유쾌한 멘트 비하인드! 콘서트장 분위기와 감정을 표현하는 실전 생활 영어 표현 22개를 3회 반복으로 귀에 쏙쏙 박히게 익혀보세요.",
        "speaker": "켈리 (Kelly)",
        "url": "https://rhyrhyenglish.site/lessons/lesson-04/"
    },
    "lesson-05": {
        "title": "[현서네 리얼 영어] 켈리의 미국 교사 자격증 도전기 🎓 | 핵심 회화 표현 20개 3회 반복 완성 (켈리)",
        "desc": "대학 부전공부터 한국 영어 교사 경험, 그리고 미국 정교사 자격증 시험 준비까지! 켈리의 도전기 속에서 대학 학사, 시험, 인터뷰에 꼭 쓰이는 고급 실전 영어 표현 20개를 3회 반복으로 완벽 학습해 보세요.",
        "speaker": "켈리 (Kelly)",
        "url": "https://rhyrhyenglish.site/lessons/lesson-05/"
    },
}

def get_video_duration(video_path: Path) -> float:
    """Gets exact duration of an mp4 video file using ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(video_path)
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    return float(res.stdout.strip())

def format_yt_time(seconds: float) -> str:
    """Formats seconds into YouTube chapter time format: MM:SS or HH:MM:SS."""
    total_seconds = int(seconds)
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    if hours > 0:
        return f"{hours:02d}:{minutes:02d}:{secs:02d}"
    return f"{minutes:02d}:{secs:02d}"

def parse_key_expressions_srt(srt_path: Path) -> list:
    """Parses key expressions SRT file."""
    if not srt_path.exists():
        return []
    with open(srt_path, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = re.compile(
        r"(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([^\n]+)\n([^\n]+)"
    )
    entries = []
    for m in pattern.finditer(content):
        entries.append({
            "idx": int(m.group(1)),
            "start_srt": m.group(2),
            "end_srt": m.group(3),
            "expression": m.group(4).strip(),
            "definition": m.group(5).strip(),
        })
    return entries

def parse_script_json(script_path: Path) -> list:
    """Parses script.json file."""
    if not script_path.exists():
        return []
    with open(script_path, "r", encoding="utf-8") as f:
        return json.load(f)

def find_script_sentence(expr: str, scripts: list) -> tuple:
    """Finds matching sentence text and Korean translation in script.json."""
    clean_expr = re.sub(r"[^a-z0-9]", "", expr.lower())
    for s in scripts:
        clean_en = re.sub(r"[^a-z0-9]", "", s.get("en", "").lower())
        if clean_expr in clean_en:
            return s.get("en", "").strip(), s.get("kr", "").strip()
    return "", ""

def build_lesson_description(lesson_id: str, clip_data_list: list) -> str:
    """Builds ready-to-copy YouTube description for a single lesson compilation."""
    info = LESSON_INFOS[lesson_id]
    
    lines = []
    lines.append(f"{info['title']}\n")
    lines.append(f"{info['desc']}\n")
    lines.append("────────────────────────────────────────")
    lines.append("📱 [현서네 리얼 영어 웹앱에서 무료 학습하기]")
    lines.append(f"👉 {info['url']}")
    lines.append("・ 4단계 인터랙티브 학습: 빈칸 퀴즈 → 원어민 발음 듣기 → 전체 영상 대본 → 영작 연습")
    lines.append("・ 복습 플레이어 & 개인 단어장 영구 저장 지원\n")
    lines.append("────────────────────────────────────────")
    lines.append("🎧 [모바일 최적화 3회 반복 학습법]")
    lines.append("・ 1회차 [0.85x]: 느린 속도로 원어민 발음 & 한국어 의미 파악")
    lines.append("・ 2회차 [1.0x]: 정상 속도로 한/영 듀얼 자막 & 핵심 표현 노란색 집중 학습")
    lines.append("・ 3회차 [1.0x]: 정상 속도로 영어 자막 & 대형 하단 핵심 표현 해설 복습\n")
    lines.append("────────────────────────────────────────")
    lines.append("⏱️ 타임라인 (Timeline & Chapters)")
    lines.append("────────────────────────────────────────")
    
    for item in clip_data_list:
        lines.append(f"{item['yt_time']} {item['idx']:02d}. {item['expression']} ({item['definition']})")
    
    lines.append("\n────────────────────────────────────────")
    lines.append("💡 핵심 표현 & 원어민 대화 스크립트 (Key Expressions & Sentences)")
    lines.append("────────────────────────────────────────")
    
    for item in clip_data_list:
        lines.append(f"[{item['idx']:02d}] {item['expression']} : {item['definition']}")
        if item['sentence_en']:
            lines.append(f"   🇺🇸 \"{item['sentence_en']}\"")
        if item['sentence_kr']:
            lines.append(f"   🇰🇷 \"{item['sentence_kr']}\"")
        lines.append("")

    lines.append("────────────────────────────────────────")
    lines.append("#영어회화 #원어민영어 #미국영어 #영어듣기 #영어쉐도잉 #현서네리얼영어 #RhyRhyEnglish")
    
    return "\n".join(lines)

def build_master_description(all_lessons_data: dict) -> str:
    """Builds ready-to-copy YouTube description for the Master Compilation (Lesson 01 to 05)."""
    total_clips = sum(len(clips) for clips in all_lessons_data.values())
    
    lines = []
    lines.append("[현서네 리얼 영어] 원어민 실전 핵심 회화 표현 101개 총정리 모음집 🌟 | Lesson 01~05 3회 반복 완성\n")
    lines.append(f"현서네 가족(켈리, 웨인 삼촌, 패티 어머님)의 리얼한 일상 대화 속 핵심 표현 {total_clips}개를 한 번에 몰아보는 마스터 모음집입니다.")
    lines.append("느린 속도(0.85x)부터 정상 속도 한/영 자막, 핵심 해설까지 3단계 반복으로 자연스럽게 귀가 열리고 입이 트이는 학습을 경험해보세요!\n")
    lines.append("────────────────────────────────────────")
    lines.append("📱 [현서네 리얼 영어 웹앱 바로가기]")
    lines.append("👉 https://rhyrhyenglish.site/lessons/")
    lines.append("・ 퀴즈, 원어민 발음 오디오, 무한 반복 복습 플레이어를 무료로 이용하실 수 있습니다.\n")
    lines.append("────────────────────────────────────────")
    lines.append("🎧 [모바일 최적화 3회 반복 학습 시스템]")
    lines.append("・ 1회차 [0.85x]: 느린 속도로 원어민 발음 & 한국어 의미 파악")
    lines.append("・ 2회차 [1.0x]: 정상 속도로 한/영 듀얼 자막 & 핵심 표현 노란색 집중 학습")
    lines.append("・ 3회차 [1.0x]: 정상 속도로 영어 자막 & 대형 하단 핵심 표현 해설 복습\n")
    lines.append("────────────────────────────────────────")
    lines.append("⏱️ 전체 타임라인 (Timeline & Chapters)")
    lines.append("────────────────────────────────────────")
    
    for lid, clips in all_lessons_data.items():
        info = LESSON_INFOS[lid]
        first_time = clips[0]["master_yt_time"]
        lesson_num = lid.replace("lesson-", "Lesson ")
        lines.append(f"\n[{lesson_num}: {info['title'].split('|')[0].strip()}]")
        for item in clips:
            lines.append(f"{item['master_yt_time']} {item['idx']:02d}. {item['expression']} ({item['definition']})")

    lines.append("\n────────────────────────────────────────")
    lines.append("💡 레슨별 핵심 영어 표현 리스트")
    lines.append("────────────────────────────────────────")
    
    global_idx = 1
    for lid, clips in all_lessons_data.items():
        lesson_num = lid.replace("lesson-", "Lesson ")
        lines.append(f"\n📌 {lesson_num} ({len(clips)}개 표현)")
        for item in clips:
            lines.append(f"{global_idx:03d}. {item['expression']} : {item['definition']}")
            global_idx += 1

    lines.append("\n────────────────────────────────────────")
    lines.append("#영어회화 #원어민영어 #미국영어 #영어듣기 #영어쉐도잉 #현서네리얼영어 #RhyRhyEnglish #영어공부혼자하기")
    
    return "\n".join(lines)

def build_cheatsheet_markdown(all_lessons_data: dict) -> str:
    """Builds a clean markdown cheatsheet for editing and reference."""
    lines = []
    lines.append("# 🎬 RhyRhy English Compilation Videos - Timeline & Clip Reference\n")
    lines.append("This document provides precise clip filenames, durations, local timeline timestamps, and master timeline timestamps for all 101 clips across Lessons 01 to 05.\n")
    
    for lid, clips in all_lessons_data.items():
        info = LESSON_INFOS[lid]
        lesson_num = lid.replace("lesson-", "Lesson ")
        total_dur = sum(c["duration"] for c in clips)
        lines.append(f"## {lesson_num}: {info['title'].split('|')[0].strip()} ({len(clips)} clips, Total: {format_yt_time(total_dur)})\n")
        lines.append("| # | 파일명 | 핵심 표현 | 한국어 의미 | 클립 길이 | 레슨 타임라인 | 마스터 타임라인 |")
        lines.append("| :-: | :--- | :--- | :--- | :-: | :-: | :-: |")
        for item in clips:
            dur_str = f"{item['duration']:.2f}s"
            lines.append(f"| {item['idx']:02d} | `{item['filename']}` | **{item['expression']}** | {item['definition']} | {dur_str} | `{item['yt_time']}` | `{item['master_yt_time']}` |")
        lines.append("")
    
    return "\n".join(lines)

def main():
    print("=================================================================")
    print("📝 Generating YouTube Description Files & Timeline Chapters")
    print("=================================================================")
    
    all_lessons_data = {}
    master_timeline_time = 0.0

    for lid in ["lesson-01", "lesson-02", "lesson-03", "lesson-04", "lesson-05"]:
        lesson_dir = LESSONS_DIR / lid
        clips_dir = CLIPS_DIR / lid
        
        if not clips_dir.exists():
            print(f"⚠️ Clips dir not found: {clips_dir}, skipping.")
            continue
            
        srt_path = lesson_dir / f"{lid}-key-expressions.srt"
        script_path = lesson_dir / "script.json"
        
        srt_entries = parse_key_expressions_srt(srt_path)
        scripts = parse_script_json(script_path)
        
        # Match sorted mp4 clips
        mp4_clips = sorted([f for f in clips_dir.glob("*.mp4")])
        if len(mp4_clips) != len(srt_entries):
            print(f"⚠️ Warning: {lid} has {len(mp4_clips)} mp4 clips but {len(srt_entries)} srt entries!")
        
        clip_data_list = []
        lesson_timeline_time = 0.0
        
        for idx, (clip_file, entry) in enumerate(zip(mp4_clips, srt_entries), start=1):
            dur = get_video_duration(clip_file)
            en_sent, kr_sent = find_script_sentence(entry["expression"], scripts)
            
            yt_time = format_yt_time(lesson_timeline_time)
            master_yt_time = format_yt_time(master_timeline_time)
            
            clip_data_list.append({
                "idx": idx,
                "filename": clip_file.name,
                "path": str(clip_file),
                "duration": dur,
                "expression": entry["expression"],
                "definition": entry["definition"],
                "sentence_en": en_sent,
                "sentence_kr": kr_sent,
                "yt_time": yt_time,
                "master_yt_time": master_yt_time,
            })
            
            lesson_timeline_time += dur
            master_timeline_time += dur
            
        all_lessons_data[lid] = clip_data_list
        
        # Build description for this lesson
        desc_text = build_lesson_description(lid, clip_data_list)
        
        # 1. Write to video/output/clips/lesson-XX/youtube-description.txt
        clip_desc_path = clips_dir / "youtube-description.txt"
        with open(clip_desc_path, "w", encoding="utf-8") as f:
            f.write(desc_text)
        print(f"✅ Generated: {clip_desc_path}")
        
        # 2. Write to video/output/lesson-XX_youtube_description.txt
        out_desc_path = VIDEO_OUTPUT_DIR / f"{lid}_youtube_description.txt"
        with open(out_desc_path, "w", encoding="utf-8") as f:
            f.write(desc_text)
        print(f"✅ Generated: {out_desc_path}")

    # Build Master Description (Lessons 01 to 05)
    master_desc_text = build_master_description(all_lessons_data)
    
    # 1. Write to video/output/clips/youtube-description-master.txt
    master_clips_path = CLIPS_DIR / "youtube-description-master.txt"
    with open(master_clips_path, "w", encoding="utf-8") as f:
        f.write(master_desc_text)
    print(f"🌟 Generated: {master_clips_path}")
    
    # 2. Write to video/output/lessons_01_to_05_youtube_description.txt
    master_out_path = VIDEO_OUTPUT_DIR / "lessons_01_to_05_youtube_description.txt"
    with open(master_out_path, "w", encoding="utf-8") as f:
        f.write(master_desc_text)
    print(f"🌟 Generated: {master_out_path}")
    
    # Build Cheatsheet
    cheatsheet_text = build_cheatsheet_markdown(all_lessons_data)
    cheatsheet_path = CLIPS_DIR / "TIMELINE_CHEATSHEET.md"
    with open(cheatsheet_path, "w", encoding="utf-8") as f:
        f.write(cheatsheet_text)
    print(f"📋 Generated: {cheatsheet_path}")
    
    print("\n✨ All YouTube description and timeline files generated successfully!")

if __name__ == "__main__":
    main()
