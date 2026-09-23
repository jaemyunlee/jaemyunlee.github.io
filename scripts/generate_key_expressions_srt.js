#!/usr/bin/env node
/**
 * Generates lesson-XX-key-expressions.srt for lessons.
 * Extracts key expressions and concise Korean explanations from quiz.md,
 * maps them to precise timestamp ranges from lesson-XX-eng.srt,
 * and writes a clean, synchronized key-expressions SRT file.
 *
 * Usage:
 *   node scripts/generate_key_expressions_srt.js [lesson-id]
 *   (e.g., node scripts/generate_key_expressions_srt.js lesson-04)
 *   If no lesson-id is passed, it processes all lessons in lessons/
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const LESSONS_DIR = path.join(ROOT_DIR, 'lessons');

const { CONCISE_DEFINITIONS, extractConciseDefinition } = require('./key_expression_definitions.js');

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseSrt(srtContent) {
  const clean = srtContent.replace(/^\uFEFF/, '').trim();
  const rawBlocks = clean.split(/\r?\n\r?\n/);
  const blocks = [];

  for (const b of rawBlocks) {
    const lines = b.trim().split(/\r?\n/);
    if (lines.length < 2) continue;
    const num = parseInt(lines[0], 10);
    const timingMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
    if (!timingMatch) continue;
    const timing = lines[1].trim();
    const text = lines.slice(2).join(' ').trim();
    blocks.push({
      num,
      start: timingMatch[1],
      end: timingMatch[2],
      timing,
      text
    });
  }
  return blocks;
}

function parseQuizMarkdown(content) {
  const blocks = content.split(/##\s*Quiz\s*\d+/i).slice(1);
  return blocks.map((block, i) => {
    const typeM = block.match(/-\s*\*\*Type\*\*:\s*([^\n]+)/i);
    const enM = block.match(/-\s*\*\*English\*\*:\s*([^\n]+)/i);
    const koM = block.match(/-\s*\*\*Korean\*\*:\s*([^\n]+)/i);
    const ansM = block.match(/-\s*\*\*Answer\*\*:\s*([^\n]+)/i);
    const expM = block.match(/-\s*\*\*Explanation\*\*:\s*([^\n]+)/i);

    const typeStr = typeM ? typeM[1].trim().toLowerCase() : 'multiple-choice';
    const english = enM ? enM[1].trim() : '';
    const korean = koM ? koM[1].trim() : '';
    let answer = ansM ? ansM[1].trim() : '';
    const explanation = expM ? expM[1].trim() : '';

    const bracketM = english.match(/\[(.*?)\]/);
    if (bracketM && !answer) {
      if (typeStr.includes('multiple') || typeStr.includes('choice')) {
        const parts = bracketM[1].split(',').map(s => s.trim());
        answer = parts[0] || '';
      } else {
        answer = bracketM[1].trim();
      }
    }

    return {
      num: i + 1,
      english,
      korean,
      answer,
      explanation
    };
  });
}

function generateLessonKeyExpressionsSrt(lessonId) {
  const lessonDir = path.join(LESSONS_DIR, lessonId);
  if (!fs.existsSync(lessonDir)) {
    console.warn(`[KeyExpressionsSRT] Lesson dir not found: ${lessonDir}`);
    return null;
  }

  const quizPath = path.join(lessonDir, 'quiz.md');
  if (!fs.existsSync(quizPath)) {
    console.log(`[KeyExpressionsSRT] No quiz.md found for ${lessonId}, skipping.`);
    return null;
  }

  // Find candidate SRT file in lesson directory
  const files = fs.readdirSync(lessonDir);
  const srtFile = files.find(f => f.endsWith('-eng.srt')) || files.find(f => f.endsWith('.srt') && !f.includes('key-expressions'));
  if (!srtFile) {
    console.log(`[KeyExpressionsSRT] No English SRT found for ${lessonId}, skipping.`);
    return null;
  }

  const srtPath = path.join(lessonDir, srtFile);
  const srtContent = fs.readFileSync(srtPath, 'utf8');
  const srtBlocks = parseSrt(srtContent);

  const quizContent = fs.readFileSync(quizPath, 'utf8');
  const quizzes = parseQuizMarkdown(quizContent);

  const matchedEntries = [];

  for (const q of quizzes) {
    const target = q.answer.trim();
    const normTarget = normalize(target);
    const cleanEn = q.english.replace(/\[.*?\]/, target);
    const normCleanEn = normalize(cleanEn);

    // 1. First priority: Exact sentence match with SRT blocks (must have meaningful length/word count)
    let matchedBlock = srtBlocks.find(b => {
      const normB = normalize(b.text);
      if (normB.length >= 12 && normB.split(' ').length >= 3) {
        if (normCleanEn.includes(normB) || normB.includes(normCleanEn)) {
          return true;
        }
      }
      return false;
    });

    // 2. Second priority: Block contains the target expression
    if (!matchedBlock) {
      // Find candidate blocks containing the expression
      const candidates = srtBlocks.filter(b => {
        const normB = normalize(b.text);
        return normB.includes(normTarget);
      });
      if (candidates.length === 1) {
        matchedBlock = candidates[0];
      } else if (candidates.length > 1) {
        // Pick candidate with highest sentence word overlap
        let maxOverlap = -1;
        const targetWords = normCleanEn.split(' ');
        for (const c of candidates) {
          const cWords = normalize(c.text).split(' ');
          const overlap = targetWords.filter(w => cWords.includes(w) && w.length > 3).length;
          if (overlap > maxOverlap) {
            maxOverlap = overlap;
            matchedBlock = c;
          }
        }
      }
    }

    // 3. Third priority: Fuzzy word overlap
    if (!matchedBlock) {
      let maxScore = 0;
      const targetWords = normCleanEn.split(' ');
      for (const b of srtBlocks) {
        const bWords = normalize(b.text).split(' ');
        const overlap = targetWords.filter(w => bWords.includes(w) && w.length > 3).length;
        if (overlap > maxScore) {
          maxScore = overlap;
          matchedBlock = b;
        }
      }
    }

    if (matchedBlock) {
      matchedEntries.push({
        timing: matchedBlock.timing,
        start: matchedBlock.start,
        expression: target,
        korean: extractConciseDefinition(q)
      });
    }
  }

  // Special case adjustments for Lesson 04:
  // Ensure Block 8 ("00:00:27,560 --> 00:00:32,250") with "standing out" is also represented
  if (lessonId === 'lesson-04') {
    const hasStandingOut = matchedEntries.some(e => e.timing.includes('00:00:27,560'));
    if (!hasStandingOut) {
      matchedEntries.push({
        timing: '00:00:27,560 --> 00:00:32,250',
        start: '00:00:27,560',
        expression: 'standing out',
        korean: CONCISE_DEFINITIONS['standing out'] || '유독 눈에 띄다, 두드러지다'
      });
    }
  }

  // Deduplicate and sort chronologically by start time
  const uniqueMap = new Map();
  for (const entry of matchedEntries) {
    const key = `${entry.start}_${entry.expression}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, entry);
    }
  }

  const sortedEntries = Array.from(uniqueMap.values()).sort((a, b) => a.start.localeCompare(b.start));

  // Build SRT formatted text
  let srtOutput = '';
  sortedEntries.forEach((entry, idx) => {
    srtOutput += `${idx + 1}\n${entry.timing}\n${entry.expression}\n${entry.korean}\n\n`;
  });

  const outFileName = `${lessonId}-key-expressions.srt`;
  const outPath = path.join(lessonDir, outFileName);
  fs.writeFileSync(outPath, srtOutput.trim() + '\n', 'utf8');

  console.log(`✅ Generated ${outFileName} (${sortedEntries.length} entries) at ${outPath}`);

  // Automatically generate / synchronize youtube-description.txt
  try {
    const { generateLessonYouTubeDescription } = require('./generate_youtube_description.js');
    generateLessonYouTubeDescription(lessonId);
  } catch (err) {
    console.warn(`⚠️ Could not auto-generate youtube-description for ${lessonId}:`, err.message);
  }

  return outPath;
}

function main() {
  const targetLesson = process.argv[2];
  if (targetLesson) {
    generateLessonKeyExpressionsSrt(targetLesson);
  } else {
    console.log('🔍 Generating key-expressions SRT for all available lessons...');
    const entries = fs.readdirSync(LESSONS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('lesson-')) {
        generateLessonKeyExpressionsSrt(entry.name);
      }
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateLessonKeyExpressionsSrt,
  CONCISE_DEFINITIONS,
  extractConciseDefinition
};
