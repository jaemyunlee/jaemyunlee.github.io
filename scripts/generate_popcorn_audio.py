#!/usr/bin/env python3
"""
Popcorn Quick Lesson Conversational Voice Generator using Chatterbox TTS by Resemble AI.
License: MIT (Free for Commercial Use)

Generates separate high-quality text-to-speech audio files for dialogue lines in popcorn conversation markdown files.
Supports multi-speaker voice cloning (Kelly, Pati, Wayne) with dynamic sentence parameter tuning.
"""

import os
import sys
import warnings
import re
import uuid
import argparse
import shutil

# Suppress general python and pytorch warnings
warnings.filterwarnings("ignore")

# Monkeypatch librosa to guarantee float32 arrays and prevent float vs double (float64) errors in PyTorch
try:
    import librosa
    import numpy as np

    _orig_load = librosa.load
    _orig_resample = librosa.resample

    def patched_load(*args, **kwargs):
        wav, sr = _orig_load(*args, **kwargs)
        return wav.astype(np.float32), sr

    def patched_resample(*args, **kwargs):
        res = _orig_resample(*args, **kwargs)
        return res.astype(np.float32)

    librosa.load = patched_load
    librosa.resample = patched_resample
except ImportError:
    pass

try:
    import torch
    import torchaudio
except ImportError:
    print("Error: PyTorch and torchaudio are required.")
    print("Please install them using: pip install torch torchaudio")
    sys.exit(1)

try:
    from chatterbox.tts import ChatterboxTTS
except ImportError:
    print("Error: 'chatterbox-tts' package is not installed.")
    print("Please install it using: pip install chatterbox-tts")
    sys.exit(1)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
POPCORN_CONV_DIR = os.path.join(ROOT_DIR, "popcorn", "conversation")
AUDIO_BASE_DIR = os.path.join(POPCORN_CONV_DIR, "audio")

# Standard character reference voice mappings
DEFAULT_SPEAKER_REFS = {
    "Kelly": os.path.join(ROOT_DIR, "assets", "voice", "kelly.wav"),
    "Pati": os.path.join(ROOT_DIR, "assets", "voice", "pati.mp3"),
    "Wayne": os.path.join(ROOT_DIR, "lessons", "lesson-02", "audio", "its been a treat.wav")
}


def preprocess_reference_audio(audio_path):
    """
    Loads and normalizes the reference audio to ensure it is:
    - Single channel (mono)
    - float32 dtype
    - Saved as a clean WAV file
    """
    print(f"  Preprocessing reference audio '{audio_path}'...")
    try:
        waveform, sr = torchaudio.load(audio_path)
        waveform = waveform.to(torch.float32)
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        unique_id = uuid.uuid4().hex[:8]
        temp_path = os.path.join(ROOT_DIR, f"temp_ref_normalized_{unique_id}.wav")
        torchaudio.save(temp_path, waveform, sr)
        return temp_path
    except Exception as e:
        print(f"  Warning: Failed to normalize reference audio: {e}")
        return audio_path


def analyze_sentence_parameters(text):
    """
    Dynamically analyzes punctuation and sentence style for ChatterboxTTS parameters.
    """
    text_strip = text.strip()

    # 1. High excitement / extreme emphasis
    has_stacked_punc = bool(re.search(r'(\?{2,}|!{2,}|\?!|!\?)', text_strip))
    has_uppercase_words = any(w.isupper() and len(w) >= 3 for w in re.findall(r'\b\w+\b', text_strip))

    if has_stacked_punc or has_uppercase_words:
        return {
            "exaggeration": 1.05,
            "cfg_weight": 0.28,
            "temperature": 0.88,
            "style": "high-intensity emphasis (?!)"
        }

    # 2. Questions
    if text_strip.endswith('?') or '?' in text_strip:
        yes_no_patterns = r'^(?:are|is|do|does|did|can|could|should|would|will|was|were|have|has|had|am|may|might|must)\b'
        is_yes_no = bool(re.match(yes_no_patterns, text_strip, re.IGNORECASE))
        if is_yes_no:
            return {
                "exaggeration": 0.95,
                "cfg_weight": 0.32,
                "temperature": 0.8,
                "style": "yes/no question (rising intonation)"
            }
        else:
            return {
                "exaggeration": 0.75,
                "cfg_weight": 0.4,
                "temperature": 0.8,
                "style": "general question"
            }

    # 3. Exclamations
    if text_strip.endswith('!') or '!' in text_strip:
        return {
            "exaggeration": 0.82,
            "cfg_weight": 0.35,
            "temperature": 0.85,
            "style": "exclamatory emphasis (!)"
        }

    # 4. Pauses / Hesitation
    if '...' in text_strip or '--' in text_strip:
        return {
            "exaggeration": 0.6,
            "cfg_weight": 0.62,
            "temperature": 0.8,
            "style": "hesitation / pause (...)"
        }

    # 5. Standard statement
    return {
        "exaggeration": 0.52,
        "cfg_weight": 0.5,
        "temperature": 0.8,
        "style": "standard statement"
    }


def sanitize_filename(name):
    """
    Sanitizes string for audio filename, matching repo convention.
    """
    cleaned = re.sub(r'\[(.*?)\]', r'\1', name)
    cleaned = re.sub(r'[^\w\s\-\.]', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    if len(cleaned) > 100:
        cleaned = cleaned[:97] + "..."
    if not cleaned:
        cleaned = "sentence"
    return cleaned


def parse_popcorn_markdown(file_path):
    """
    Parses a popcorn conversation markdown file.
    Extracts lesson ID, dialogue lines with speaker, raw text, clean text, and expected audio path.
    """
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract ID
    id_match = re.search(r'\-\s+\*\*ID\*\*:\s*(popcorn-\d+)', content)
    lesson_id = id_match.group(1) if id_match else os.path.basename(file_path).replace(".md", "")

    # Extract dialogue lines
    # Dialogue block starts after ## Dialogue and before ## Explanation
    dialogue_match = re.search(r'## Dialogue\s*(.*?)\s*(?:## Explanation|\Z)', content, re.DOTALL)
    if not dialogue_match:
        return None

    dialogue_text = dialogue_match.group(1)
    lines = []

    # Regex for lines like: - **Kelly**: text...
    # followed by optional attributes: - **Avatar**: ... / - **Audio**: ... / - **Korean**: ...
    raw_blocks = re.split(r'\n(?=-\s+\*\*)', dialogue_text.strip())

    for idx, block in enumerate(raw_blocks, 1):
        spk_match = re.match(r'-\s+\*\*([A-Za-z]+)\*\*:\s*(.+)', block)
        if not spk_match:
            continue
        speaker = spk_match.group(1).strip()
        if speaker in ('Avatar', 'Audio', 'Korean', 'Prompt', 'ID', 'Type', 'Expression'):
            continue
        text_with_brackets = spk_match.group(2).strip()

        # Clean text for TTS by stripping brackets: "[jaw dropping]" -> "jaw dropping"
        clean_text = re.sub(r'\[(.*?)\]', r'\1', text_with_brackets)

        # Check if an audio path is explicitly defined
        audio_match = re.search(r'\s*-\s+\*\*Audio\*\*:\s*(.+)', block)
        explicit_audio = audio_match.group(1).strip() if audio_match else None

        lines.append({
            "index": idx,
            "speaker": speaker,
            "raw_text": text_with_brackets,
            "clean_text": clean_text,
            "explicit_audio": explicit_audio
        })

    return {
        "id": lesson_id,
        "file_path": file_path,
        "lines": lines
    }


def generate_audio_for_lesson(lesson_info, model, preprocessed_refs):
    """
    Generates audio files for each dialogue line in a popcorn lesson.
    """
    lesson_id = lesson_info["id"]
    output_dir = os.path.join(AUDIO_BASE_DIR, lesson_id)
    os.makedirs(output_dir, exist_ok=True)

    print(f"\n==========================================")
    print(f"🎙️ Generating Audio for Lesson: {lesson_id}")
    print(f"📁 Output Directory: {output_dir}")
    print(f"==========================================")

    generated_files = []

    for item in lesson_info["lines"]:
        idx = item["index"]
        speaker = item["speaker"]
        clean_text = item["clean_text"]

        # Determine reference voice
        ref_path = preprocessed_refs.get(speaker)
        if not ref_path:
            # Fallback to Kelly or default
            ref_path = preprocessed_refs.get("Kelly")
            print(f"  Warning: No reference voice found for speaker '{speaker}', falling back to Kelly.")

        # Determine filename
        if item.get("explicit_audio"):
            filename = os.path.basename(item["explicit_audio"])
        else:
            base_name = sanitize_filename(item["raw_text"])
            filename = f"{idx:02d}_{speaker}_{base_name}.wav"
        output_path = os.path.join(output_dir, filename)

        # Skip if file already exists and is non-empty
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            print(f"  [{idx}/{len(lesson_info['lines'])}] ⏭️ Already exists: {filename}")
            generated_files.append((filename, output_path))
            continue

        params = analyze_sentence_parameters(clean_text)
        exaggeration = params["exaggeration"]
        cfg_weight = params["cfg_weight"]
        temperature = params["temperature"]
        style = params["style"]

        print(f"  [{idx}/{len(lesson_info['lines'])}] {speaker}: \"{clean_text}\"")
        print(f"    Style: {style} (exaggeration={exaggeration}, cfg={cfg_weight}, temp={temperature})")

        wav = model.generate(
            clean_text,
            audio_prompt_path=ref_path,
            exaggeration=exaggeration,
            cfg_weight=cfg_weight,
            temperature=temperature
        )

        wav = wav.cpu()
        torchaudio.save(output_path, wav, model.sr)
        print(f"    ✅ Saved: {filename} ({os.path.getsize(output_path)} bytes)")
        generated_files.append((filename, output_path))

    return generated_files


def main():
    parser = argparse.ArgumentParser(description="Generate voice audio for Popcorn Quick Lessons using Chatterbox TTS.")
    parser.add_argument("--file", help="Specific markdown file to process (e.g. popcorn/conversation/popcorn-026.md)")
    parser.add_argument("--id", help="Lesson ID to process (e.g. popcorn-026 or 26)")
    parser.add_argument("--range", nargs=2, type=int, metavar=("START", "END"), help="Range of lesson numbers to process (e.g. 26 40)")
    parser.add_argument("--all", action="store_true", help="Process all available conversation markdown files")
    args = parser.parse_args()

    # Collect target files
    target_files = []

    if args.file:
        target_files.append(os.path.abspath(args.file))
    elif args.id:
        num = args.id.replace("popcorn-", "")
        formatted_id = f"popcorn-{int(num):03d}"
        path = os.path.join(POPCORN_CONV_DIR, f"{formatted_id}.md")
        target_files.append(path)
    elif args.range:
        start_num, end_num = args.range
        for num in range(start_num, end_num + 1):
            path = os.path.join(POPCORN_CONV_DIR, f"popcorn-{num:03d}.md")
            if os.path.exists(path):
                target_files.append(path)
    elif args.all:
        for f in sorted(os.listdir(POPCORN_CONV_DIR)):
            if f.startswith("popcorn-") and f.endswith(".md"):
                target_files.append(os.path.join(POPCORN_CONV_DIR, f))
    else:
        # Default: show help or process latest 26-40
        print("No target specified. Defaulting to range 26 through 40.")
        for num in range(26, 41):
            path = os.path.join(POPCORN_CONV_DIR, f"popcorn-{num:03d}.md")
            if os.path.exists(path):
                target_files.append(path)

    if not target_files:
        print("No valid target markdown files found.")
        sys.exit(1)

    print(f"Target files to process ({len(target_files)}):")
    for tf in target_files:
        print(f"  - {os.path.basename(tf)}")

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"\nCompute device: {device}")
    print("Loading ChatterboxTTS (Original Model)...")
    model = ChatterboxTTS.from_pretrained(device=device)

    temp_files = []
    preprocessed_refs = {}

    try:
        print("\nPreprocessing character reference voices...")
        for speaker, ref_path in DEFAULT_SPEAKER_REFS.items():
            if os.path.exists(ref_path):
                processed = preprocess_reference_audio(ref_path)
                preprocessed_refs[speaker] = processed
                if processed != ref_path:
                    temp_files.append(processed)
                print(f"  Speaker '{speaker}': Ready ({ref_path})")
            else:
                print(f"  Warning: Reference audio for '{speaker}' not found at: {ref_path}")

        for tf in target_files:
            lesson_info = parse_popcorn_markdown(tf)
            if not lesson_info:
                print(f"Warning: Failed to parse '{tf}', skipping.")
                continue
            generate_audio_for_lesson(lesson_info, model, preprocessed_refs)

        print("\n🎉 All requested popcorn conversation audios have been generated successfully!")

    finally:
        if temp_files:
            print("\nCleaning up temporary reference files...")
            for f in temp_files:
                if os.path.exists(f):
                    try:
                        os.remove(f)
                    except Exception:
                        pass


if __name__ == "__main__":
    main()
