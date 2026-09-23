#!/usr/bin/env node
/**
 * Generates youtube-description.txt for lessons.
 * 
 * Extracts:
 * - Lesson metadata (title, speaker, description) from metadata.json
 * - Key expressions & timestamps from lesson-XX-key-expressions.srt
 * - Full sentences & answers from quiz.md (or script.json / README.md)
 * 
 * Formats:
 * - Header with title, description, and link to RhyRhy English lesson page
 * - 00:00 Intro + Timelines / Chapters with full sentence and [expression] tag
 * - Key expressions and Korean definitions list
 * - Relevant hashtags
 * 
 * Writes:
 *   lessons/lesson-XX/youtube-description.txt
 * 
 * Usage:
 *   node scripts/generate_youtube_description.js [lesson-id]
 *   (e.g., node scripts/generate_youtube_description.js lesson-06)
 *   If no lesson-id is provided, generates for all lessons in lessons/
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LESSONS_DIR = path.join(ROOT_DIR, 'lessons');

const { extractConciseDefinition } = require('./key_expression_definitions.js');

// Speaker display titles honoring family relationship guidelines
const SPEAKER_MAP = {
  gene: '장인어른(Gene)',
  patty: '장모님(Pati)',
  pati: '장모님(Pati)',
  wayne: '웨인 삼촌(Wayne)',
  kelly: '켈리(Kelly)',
  jaemyun: '재면(Jaemyun)'
};

// Topic emoji fallback
const LESSON_ICONS = {
  'lesson-01': '🎟️',
  'lesson-02': '🛶',
  'lesson-03': '🏡',
  'lesson-04': '🎤',
  'lesson-05': '🎓',
  'lesson-06': '🌲'
};

/**
 * Clean sentence by un-wrapping brackets and inserting answers
 */
function cleanQuizSentence(english, answer) {
  if (!english) return '';
  const cleanAns = Array.isArray(answer) ? answer.join(' ') : (answer || '').trim();
  const brackets = [...english.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);

  if (brackets.length === 0) {
    return english.replace(/\s+/g, ' ').trim();
  }

  // Bracket contains commas (multiple-choice or drag-and-drop tokens)
  if (brackets.some(b => b.includes(','))) {
    return english.replace(/\[[^\]]+\]/g, cleanAns).replace(/\s+/g, ' ').trim();
  }

  // Individual blanks: unwrap [word] -> word
  return english.replace(/\[([^\]]+)\]/g, '$1').replace(/\s+/g, ' ').trim();
}

/**
 * Parse quiz.md into structured quiz objects
 */
function parseQuizMarkdown(content) {
  const quizzes = [];
  const lines = content.split('\n');
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## Quiz')) {
      if (current) quizzes.push(current);
      current = { id: trimmed.replace(/^##\s*/, ''), english: '', answer: '', korean: '', explanation: '' };
      continue;
    }
    if (!current) continue;

    if (trimmed.startsWith('- **Type**:')) {
      current.type = trimmed.replace(/-\s*\*\*Type\*\*:\s*/, '').trim();
    } else if (trimmed.startsWith('- **English**:')) {
      current.english = trimmed.replace(/-\s*\*\*English\*\*:\s*/, '').trim();
    } else if (trimmed.startsWith('- **Answer**:')) {
      current.answer = trimmed.replace(/-\s*\*\*Answer\*\*:\s*/, '').trim();
    } else if (trimmed.startsWith('- **Korean**:')) {
      current.korean = trimmed.replace(/-\s*\*\*Korean\*\*:\s*/, '').trim();
    } else if (trimmed.startsWith('- **Explanation**:')) {
      current.explanation = trimmed.replace(/-\s*\*\*Explanation\*\*:\s*/, '').trim();
    }
  }

  if (current) quizzes.push(current);

  for (const q of quizzes) {
    if (!q.answer && q.english) {
      const bracketM = q.english.match(/\[(.*?)\]/);
      if (bracketM) {
        const typeStr = (q.type || '').toLowerCase();
        if (typeStr.includes('multiple') || typeStr.includes('choice')) {
          q.answer = bracketM[1].split(',')[0].trim();
        } else {
          q.answer = bracketM[1].replace(/,\s*/g, ' ').trim();
        }
      }
    }
  }

  return quizzes;
}

/**
 * Parse SRT file into entries
 */
function parseKeyExpressionsSrt(content) {
  const entries = [];
  const blocks = content.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length >= 4) {
      const timing = lines[1].trim();
      const match = timing.match(/^(\d{2}):(\d{2}):(\d{2}),\d{3}/);
      const startMinutesSeconds = match ? `${match[2]}:${match[3]}` : '00:00';
      const expression = lines[2].trim();
      const korean = lines.slice(3).join(' ').trim();

      entries.push({
        timing,
        timestamp: startMinutesSeconds,
        expression,
        korean
      });
    }
  }

  return entries;
}

/**
 * Format expression for [bracket] tag in timeline
 */
function formatExpressionTag(expression) {
  if (!expression) return '';
  if (expression.includes('all, the, way') || expression.includes('all the way from')) {
    return 'all the way from ... to';
  }
  return expression.replace(/,\s*/g, ' ').trim();
}

/**
 * Generate YouTube description for a specific lesson directory
 */
function generateLessonYouTubeDescription(lessonId) {
  const lessonDir = path.join(LESSONS_DIR, lessonId);
  if (!fs.existsSync(lessonDir) || !fs.statSync(lessonDir).isDirectory()) {
    console.warn(`⚠️ Lesson directory not found: ${lessonDir}`);
    return null;
  }

  const metadataPath = path.join(lessonDir, 'metadata.json');
  const quizPath = path.join(lessonDir, 'quiz.md');
  const srtPath = path.join(lessonDir, `${lessonId}-key-expressions.srt`);

  if (!fs.existsSync(metadataPath)) {
    console.warn(`⚠️ metadata.json not found for ${lessonId}`);
    return null;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const speakerRaw = typeof metadata.speaker === 'object' ? (metadata.speaker.name || '') : (metadata.speaker || '');
  const speakerKey = speakerRaw.toLowerCase();
  const speakerDisplay = SPEAKER_MAP[speakerKey] || speakerRaw || 'Kelly';

  const icon = metadata.icon || LESSON_ICONS[lessonId] || '✨';
  const title = metadata.title || `Lesson ${lessonId.replace(/^lesson-/, '')}`;
  const description = metadata.description || '';

  let srtEntries = [];
  if (fs.existsSync(srtPath)) {
    srtEntries = parseKeyExpressionsSrt(fs.readFileSync(srtPath, 'utf8'));
  }

  let quizzes = [];
  if (fs.existsSync(quizPath)) {
    quizzes = parseQuizMarkdown(fs.readFileSync(quizPath, 'utf8'));
  }

  // Also check README.md for curated clean sentences if present
  const readmePath = path.join(lessonDir, 'README.md');
  let readmeSentences = [];
  if (fs.existsSync(readmePath)) {
    const readmeLines = fs.readFileSync(readmePath, 'utf8').split('\n');
    readmeSentences = readmeLines
      .filter(l => l.trim().startsWith('-'))
      .map(l => l.replace(/^-\s*/, '').replace(/\[([^\]]+)\]/g, '$1').trim());
  }

  const count = srtEntries.length > 0 ? srtEntries.length : quizzes.length;

  // Construct description sections
  let output = '';

  // 1. Header
  output += `[현서네 리얼 영어] ${title} ${icon}\n\n`;
  if (description) {
    output += `${description}\n\n`;
  } else {
    output += `영상 속 ${speakerDisplay}의 생생한 원어민 실전 영어 표현 ${count}가지를 함께 배워보세요.\n\n`;
  }
  output += `📱 [현서네 리얼 영어 웹앱에서 퀴즈 & 발음 듣기]\n`;
  output += `https://rhyrhyenglish.site/lessons/${lessonId}/\n\n`;

/**
 * Find matching sentence for an SRT expression from README or quizzes
 */
function findMatchingSentence(srtEntry, quizzes, readmeSentences, index, usedSet) {
  const srtExprNorm = (srtEntry.expression || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Try to find a sentence in README.md whose [bracketed] expression matches
  if (readmeSentences && readmeSentences.length > 0) {
    for (let j = 0; j < readmeSentences.length; j++) {
      if (usedSet && usedSet.has(`readme_${j}`)) continue;
      const s = readmeSentences[j];
      const brackets = [...s.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
      for (const b of brackets) {
        const bNorm = b.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (bNorm === srtExprNorm || (bNorm.length > 3 && srtExprNorm.length > 3 && (bNorm.includes(srtExprNorm) || srtExprNorm.includes(bNorm)))) {
          if (usedSet) usedSet.add(`readme_${j}`);
          return s.replace(/\[([^\]]+)\]/g, '$1').trim();
        }
      }
    }
  }

  // 2. Try to find a quiz whose answer matches
  if (quizzes && quizzes.length > 0) {
    for (let j = 0; j < quizzes.length; j++) {
      if (usedSet && usedSet.has(`quiz_${j}`)) continue;
      const q = quizzes[j];
      const ansNorm = (q.answer || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (ansNorm && (ansNorm === srtExprNorm || (ansNorm.length > 3 && srtExprNorm.length > 3 && (ansNorm.includes(srtExprNorm) || srtExprNorm.includes(ansNorm))))) {
        if (usedSet) usedSet.add(`quiz_${j}`);
        return cleanQuizSentence(q.english, q.answer);
      }
    }
  }

  // 3. Fallback to index position
  if (readmeSentences && readmeSentences[index]) {
    if (usedSet) usedSet.add(`readme_${index}`);
    return readmeSentences[index].replace(/\[([^\]]+)\]/g, '$1').trim();
  }
  if (quizzes && quizzes[index]) {
    if (usedSet) usedSet.add(`quiz_${index}`);
    return cleanQuizSentence(quizzes[index].english, quizzes[index].answer);
  }

  return srtEntry.expression || '';
}

  // 2. Timeline / Chapters
  output += `────────────────────────────────────────\n`;
  output += `⏱️ 타임라인 (Timeline & Chapters)\n`;
  output += `────────────────────────────────────────\n`;
  output += `00:00 인트로 (Intro)\n`;

  const usedSet = new Set();
  for (let i = 0; i < count; i++) {
    const num = (i + 1).toString().padStart(2, '0');
    const srt = srtEntries[i] || { timestamp: '00:00', expression: '' };
    const quiz = quizzes[i] || { english: '', answer: '', korean: '' };

    const sentence = findMatchingSentence(srt, quizzes, readmeSentences, i, usedSet);
    const exprTag = formatExpressionTag(srt.expression || quiz.answer);
    output += `${srt.timestamp} ${num}. ${sentence} [${exprTag}]\n`;
  }

  // 3. Key Expressions & Meanings
  output += `\n────────────────────────────────────────\n`;
  output += `💡 핵심 영어 표현 및 의미 (Key Expressions)\n`;
  output += `────────────────────────────────────────\n`;

  for (let i = 0; i < count; i++) {
    const num = (i + 1).toString().padStart(2, '0');
    const srt = srtEntries[i] || { expression: '', korean: '' };
    const quiz = quizzes[i] || { answer: '', korean: '' };

    const expr = (srt.expression || quiz.answer || '').replace(/,\s*/g, ' ').trim();
    let meaning = (srt.korean || '').trim();
    if (extractConciseDefinition) {
      const matchQuiz = quizzes.find(q => (q.answer || '').toLowerCase().trim() === expr.toLowerCase()) || quiz;
      const concise = extractConciseDefinition({ answer: expr, explanation: matchQuiz.explanation, korean: matchQuiz.korean });
      if (concise && concise !== matchQuiz.korean) {
        meaning = concise;
      }
    }
    if (!meaning) {
      meaning = (quiz.korean || '').trim();
    }

    output += `${num}. ${expr} : ${meaning}\n`;
  }

  // 4. Hashtags
  output += `\n#영어회화 #원어민영어 #미국영어 #실전영어 #현서네리얼영어 #영어공부\n`;

  const outPath = path.join(lessonDir, 'youtube-description.txt');
  fs.writeFileSync(outPath, output, 'utf8');
  console.log(`✅ Generated ${lessonId}/youtube-description.txt (${count} expressions)`);
  return outPath;
}

/**
 * Generate youtube-description.txt for all lessons in lessons/
 */
function generateAllYouTubeDescriptions() {
  console.log('📝 Generating YouTube description files for all lessons...');
  const entries = fs.readdirSync(LESSONS_DIR, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('lesson-')) {
      const res = generateLessonYouTubeDescription(entry.name);
      if (res) results.push(res);
    }
  }

  console.log(`✨ Generated ${results.length} YouTube description files successfully.\n`);
  return results;
}

function main() {
  const targetLesson = process.argv[2];
  if (targetLesson) {
    generateLessonYouTubeDescription(targetLesson);
  } else {
    generateAllYouTubeDescriptions();
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateLessonYouTubeDescription,
  generateAllYouTubeDescriptions
};
