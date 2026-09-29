const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Extracts audio from the lesson MP4 and slices it into individual segment audio clips.
 * @param {string} lessonId - e.g. 'lesson-01'
 */
function extractLessonDictationAudio(lessonId = 'lesson-01') {
  const lessonDir = path.join(ROOT_DIR, 'lessons', lessonId);
  const scriptPath = path.join(lessonDir, 'script.json');
  if (!fs.existsSync(scriptPath)) {
    console.warn(`[extract_dictation_audio] Script file not found for ${lessonId}`);
    return;
  }

  const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));

  // Video source candidates: video/{lessonId}-clean-version.mp4
  const videoCandidates = [
    path.join(ROOT_DIR, 'video', `${lessonId}-clean-version.mp4`),
    path.join(ROOT_DIR, 'video', 'original', `${lessonId}-clean-version.mp4`)
  ];

  let videoSrc = videoCandidates.find(p => fs.existsSync(p));
  if (!videoSrc) {
    console.warn(`[extract_dictation_audio] MP4 not found for ${lessonId}`);
    return;
  }

  const outDir = path.join(lessonDir, 'audio', 'segments');
  fs.mkdirSync(outDir, { recursive: true });

  const scratchDir = path.join(ROOT_DIR, 'scratch');
  fs.mkdirSync(scratchDir, { recursive: true });
  const masterWav = path.join(scratchDir, `${lessonId}-master.wav`);

  console.log(`[extract_dictation_audio] Extracting master audio for ${lessonId}...`);
  if (!fs.existsSync(masterWav)) {
    execSync(`ffmpeg -i "${videoSrc}" -vn -ar 44100 -ac 2 "${masterWav}" -y`, { stdio: 'ignore' });
  }

  console.log(`[extract_dictation_audio] Slicing ${script.length} segments for ${lessonId}...`);
  let count = 0;
  for (const seg of script) {
    const dur = Math.max(0.4, seg.end - seg.start).toFixed(2);
    const outPath = path.join(outDir, `${seg.id}.mp3`);
    if (!fs.existsSync(outPath)) {
      execSync(`ffmpeg -ss ${seg.start} -t ${dur} -i "${masterWav}" -c:a libmp3lame -b:a 128k "${outPath}" -y`, { stdio: 'ignore' });
    }
    count++;
  }
  console.log(`[extract_dictation_audio] Ready: ${count} segments in ${outDir}`);
}

if (require.main === module) {
  const lessonArg = process.argv[2] || 'lesson-01';
  extractLessonDictationAudio(lessonArg);
}

module.exports = { extractLessonDictationAudio };
