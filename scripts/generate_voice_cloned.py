#!/usr/bin/env python3
"""
Zero-Shot Voice Cloning Generator using Chatterbox TTS by Resemble AI.
License: MIT (Free for Commercial Use)

This script clones a voice from a reference audio clip (MP3, WAV, etc.) 
and generates high-quality text-to-speech audio. It supports:
1. ChatterboxTTS (Original expressive model with fine-grained emotional controls)
2. ChatterboxTurboTTS (Turbo model with support for paralinguistic tags like [laugh], [sigh])
"""

import os
import sys
import warnings
import re
import uuid
import argparse

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
    from chatterbox.tts_turbo import ChatterboxTurboTTS
except ImportError:
    print("Error: 'chatterbox-tts' package is not installed.")
    print("Please install it using: pip install chatterbox-tts")
    sys.exit(1)


def preprocess_reference_audio(audio_path):
    """
    Loads and normalizes the reference audio to ensure it is:
    - Single channel (mono)
    - float32 dtype (prevents PyTorch float vs double/float64 mismatch)
    - Saved as a clean WAV file
    """
    print(f"Preprocessing reference audio '{audio_path}'...")
    try:
        waveform, sr = torchaudio.load(audio_path)
        
        # 1. Convert to float32
        waveform = waveform.to(torch.float32)
        
        # 2. Convert to mono if stereo
        if waveform.shape[0] > 1:
            print("  Converting stereo reference to mono...")
            waveform = torch.mean(waveform, dim=0, keepdim=True)
            
        # 3. Save as a temporary normalized WAV file
        temp_path = "temp_reference_normalized.wav"
        torchaudio.save(temp_path, waveform, sr)
        print(f"  Normalized reference audio ready.")
        return temp_path
    except Exception as e:
        print(f"Warning: Failed to normalize reference audio: {e}")
        print("Using original reference audio file directly.")
        return audio_path


def parse_markdown_sentences(file_path):
    """
    Reads sentences from a markdown file, splits by line changes,
    and strips common markdown formatting elements.
    Preserves words inside vocabulary brackets [word] for natural speech.
    """
    sentences = []
    if not os.path.exists(file_path):
        return sentences
        
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            # Clean typical markdown formatting
            # 1. Strip headers
            line = re.sub(r'^#+\s+', '', line)
            # 2. Strip bullet points or numbered lists (e.g., "- ", "* ", "1. ")
            line = re.sub(r'^(?:\-\s+|\*\s+|\d+\.\s+)', '', line)
            # 3. Strip bold/italic/code markup
            line = re.sub(r'[\*_`~]', '', line)
            
            # Extract target vocabulary word inside brackets if present
            target_match = re.search(r'\[(.*?)\]', line)
            target = target_match.group(1).strip() if target_match else ''
            
            # Remove the brackets themselves, but preserve the inner word for TTS
            spoken_text = re.sub(r'[\[\]]', '', line).strip()
            
            if spoken_text:
                sentences.append({
                    'text': spoken_text,
                    'raw': line,
                    'target': target
                })
    return sentences


def sanitize_filename(name):
    """
    Sanitizes a string to make it safe for use as a filename.
    Removes invalid characters, strips paralinguistic tags, and preserves sentence words.
    """
    # Remove paralinguistic tags like [laugh], [sigh] from the filename
    cleaned = re.sub(r'\[(laugh|sigh|cough|gasp|yawn|chuckle)\]', '', name, flags=re.IGNORECASE)
    # Remove bracket characters
    cleaned = re.sub(r'[\[\]]', '', cleaned)
    # Keep alphanumeric, spaces, hyphens, underscores, dots
    cleaned = re.sub(r'[^\w\s\-\.]', '', cleaned)
    # Replace multiple spaces with a single space
    cleaned = re.sub(r'\s+', ' ', cleaned)
    cleaned = cleaned.strip()
    # Truncate to maximum of 120 characters to avoid path length issues
    if len(cleaned) > 120:
        cleaned = cleaned[:117] + "..."
    if not cleaned:
        cleaned = "sentence"
    return cleaned


def compute_sentence_settings(text):
    """
    Automatically calculates speech generation parameters (exaggeration, cfg_weight, temperature)
    for ChatterboxTTS (Model 1) based on sentence tone, punctuation, and length.
    """
    text_clean = text.strip().lower()
    
    # Base defaults for expressive natural voice
    exaggeration = 0.52
    cfg_weight = 0.50
    temperature = 0.75
    
    # 1. Questions (conversational inflection)
    if '?' in text_clean:
        exaggeration = 0.60
        cfg_weight = 0.55
        temperature = 0.78
    # 2. Exclamations / strong assertions / arguments
    elif '!' in text_clean or any(k in text_clean for k in ['stubborn', 'strong-willed', 'pull over', 'push my buttons', 'arguing', 'police']):
        exaggeration = 0.58
        cfg_weight = 0.52
        temperature = 0.75
    # 3. Reflective / warm family memories
    elif any(k in text_clean for k in ['hard', 'wonderful', 'grandchildren', 'diapers', 'backpack', 'santa', 'kissed']):
        exaggeration = 0.48
        cfg_weight = 0.50
        temperature = 0.72
    # 4. Short phrases (< 5 words)
    elif len(text_clean.split()) < 5:
        exaggeration = 0.50
        cfg_weight = 0.50
        temperature = 0.70
        
    return {
        'exaggeration': round(exaggeration, 2),
        'cfg_weight': round(cfg_weight, 2),
        'temperature': round(temperature, 2)
    }


def main():
    parser = argparse.ArgumentParser(description="Zero-Shot Commercial-Friendly Voice Cloner")
    parser.add_argument("--markdown", "-m", default="lessons/lesson-03/README.md", help="Path to markdown file with sentences")
    parser.add_argument("--reference", "-r", default="assets/voice/pati.mp3", help="Path to reference audio file (WAV/MP3)")
    parser.add_argument("--output-dir", "-o", default="", help="Output directory for generated audio files")
    parser.add_argument("--model-type", choices=["1", "2", "original", "turbo"], default="1", help="Model type: 1/original or 2/turbo")
    parser.add_argument("--exaggeration", type=float, default=None, help="Fixed exaggeration (overrides auto settings)")
    parser.add_argument("--cfg-weight", type=float, default=None, help="Fixed cfg_weight (overrides auto settings)")
    parser.add_argument("--temperature", type=float, default=None, help="Fixed temperature (overrides auto settings)")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive prompt mode")
    parser.add_argument("--force", action="store_true", help="Force re-generation of existing files")
    args = parser.parse_args()

    print("--- 🎙️ Zero-Shot Commercial-Friendly Voice Cloner ---")
    
    # 1. Configuration
    if args.interactive:
        default_ref = args.reference if os.path.exists(args.reference) else "assets/voice/pati.mp3"
        reference_audio = input(f"Enter reference audio file (MP3/WAV) [Default: '{default_ref}']: ").strip() or default_ref
        choice = input("Select model type (1. Original, 2. Turbo) [Default: 1]: ").strip() or "1"
        model_type = "original" if choice in ["1", "original"] else "turbo"
        default_md = args.markdown if os.path.exists(args.markdown) else "lessons/lesson-03/README.md"
        markdown_path = input(f"Enter path to markdown file [Default: '{default_md}']: ").strip() or default_md
        output_dir = input("Enter output directory (leave blank for automatic): ").strip()
    else:
        reference_audio = args.reference
        model_type = "original" if args.model_type in ["1", "original"] else "turbo"
        markdown_path = args.markdown
        output_dir = args.output_dir

    if not os.path.exists(reference_audio):
        print(f"Error: Reference audio file '{reference_audio}' not found.")
        sys.exit(1)
        
    if not os.path.exists(markdown_path):
        print(f"Error: Markdown file '{markdown_path}' not found.")
        sys.exit(1)

    # Determine output directory automatically if not provided
    if not output_dir:
        md_dir = os.path.dirname(os.path.abspath(markdown_path))
        if os.path.basename(md_dir).startswith("lesson-"):
            output_dir = os.path.join(md_dir, "audio")
        else:
            output_dir = f"audio_{uuid.uuid4().hex}"
            
    os.makedirs(output_dir, exist_ok=True)
    print(f"Reference Audio : {reference_audio}")
    print(f"Markdown Source : {markdown_path}")
    print(f"Output Directory: {output_dir}")
    print(f"Model Selection : {model_type.upper()} (Model 1 = ChatterboxTTS Original)")

    # Preprocess/normalize reference audio
    processed_reference = preprocess_reference_audio(reference_audio)

    # Device selection (CPU on macOS for float32 precision safety)
    if torch.cuda.is_available():
        device = "cuda"
    else:
        device = "cpu"
    print(f"Using compute device: {device}")

    # Load model
    if model_type == "turbo":
        print("\nLoading Chatterbox-Turbo model (350M parameters)...")
        model = ChatterboxTurboTTS.from_pretrained(device=device)
    else:
        print("\nLoading Chatterbox-Original model (500M parameters)...")
        model = ChatterboxTTS.from_pretrained(device=device)

    parsed_items = parse_markdown_sentences(markdown_path)
    if not parsed_items:
        print(f"Error: No valid sentences found in '{markdown_path}'.")
        sys.exit(1)

    print(f"\nFound {len(parsed_items)} sentences to process.")
    metadata_path = os.path.join(output_dir, "metadata.txt")

    try:
        existing_names = set()
        with open(metadata_path, 'w', encoding='utf-8') as meta_file:
            for i, item in enumerate(parsed_items, 1):
                text = item['text']
                base_name = sanitize_filename(text)
                filename = f"{base_name}.wav"
                
                # Handle potential duplicate filenames in the batch
                counter = 1
                while filename in existing_names:
                    filename = f"{base_name}_{counter}.wav"
                    counter += 1
                existing_names.add(filename)
                
                output_path = os.path.join(output_dir, filename)

                if not args.force and os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
                    print(f"\n[{i}/{len(parsed_items)}] ⏭️ Already exists: {filename}")
                    meta_file.write(f"{filename}|{text}\n")
                    meta_file.flush()
                    continue

                # Calculate automatic parameters per sentence if not fixed
                settings = compute_sentence_settings(text)
                exaggeration = args.exaggeration if args.exaggeration is not None else settings['exaggeration']
                cfg_weight = args.cfg_weight if args.cfg_weight is not None else settings['cfg_weight']
                temperature = args.temperature if args.temperature is not None else settings['temperature']

                print(f"\n[{i}/{len(parsed_items)}] Generating audio for: \"{text}\"")
                print(f"  Target Vocab: [{item['target']}] | Settings: exaggeration={exaggeration}, cfg={cfg_weight}, temp={temperature}")
                
                if model_type == "turbo":
                    wav = model.generate(text, audio_prompt_path=processed_reference)
                else:
                    wav = model.generate(
                        text,
                        audio_prompt_path=processed_reference,
                        exaggeration=exaggeration,
                        cfg_weight=cfg_weight,
                        temperature=temperature
                    )

                wav = wav.cpu()
                torchaudio.save(output_path, wav, model.sr)
                print(f"  Saved: {output_path}")
                
                meta_file.write(f"{filename}|{text}\n")
                meta_file.flush()

        print(f"\n🎉 Success! All {len(parsed_items)} audio files successfully generated.")
        print(f"Outputs saved in: '{output_dir}'")
        print(f"Mapping stored in: '{metadata_path}'")

        if os.path.exists(processed_reference) and "temp_reference_normalized.wav" in processed_reference:
            try:
                os.remove(processed_reference)
                print("Cleaned up temporary normalized reference audio.")
            except Exception:
                pass

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error during generation: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
