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

// Concise definition overrides for key expressions to ensure crystal-clear subtitle definitions
const CONCISE_DEFINITIONS = {
  // Lesson 01
  'trying to': '~하려고 애쓰다, 노력하다',
  'try to': '~하려고 애쓰다, 노력하다',
  'all the way': '끝까지, 내내, 쭉',
  'at once': '한꺼번에, 동시에',
  'in advance': '미리, 사전에',
  'ahead of time': '미리, 시간 여유를 두고',

  // Lesson 02
  'used to': '예전에 ~하곤 했다 (지금은 아님)',
  "that's all I got": '제가 준비한 이야기는 여기까지예요',
  'thats all I got': '제가 준비한 이야기는 여기까지예요',

  // Lesson 03
  'strong-willed': '의지가 강한, 자기주관이 뚜렷한',
  'picked her up': '차로 데리러 가다, 태우러 가다',
  'kept on going': '계속해서 나아가다, 끊임없이 계속하다',
  'push my buttons': '속을 뒤집어놓다, 발끈하게 만들다',
  'pull over': '차를 길가에 대다, 정차하다',
  'ended up': '결국 ~하게 되다',
  'walk along': '~을 따라 걷다, 산책하다',
  'leash': '미아 방지 끈, 하네스',
  'stubborn': '완고한, 고집 센',
  'diapers': '기저귀를 찬, 배변 훈련 전인',
  'at a time': '한 번에, 연달아',
  'going off': '(대학 등으로) 떠나다, 진학하러 가다',
  'son in law': '사위',

  // Lesson 04
  'stood out': '유독 눈에 띄다, 두드러지다',
  'standing out': '유독 눈에 띄다, 두드러지다',
  'fit': '(분위기·상황에) 어울리다, 꼭 맞다',
  'quite a few': '꽤 많은, 상당수',
  'merch sections': '굿즈 판매 구역, 굿즈 코너',
  'odd time': '애매한 시간대, 특이한 시간',
  'nosebleed seats': '하늘석, 맨 꼭대기 좌석',
  'open air stadium': '야외 경기장, 지붕 없는 스타디움',
  'scripted setup': '대본대로 짜인 연출, 각본 설정',
  'up to us': '우리에게 달린, 우리가 할 몫인',
  'up to': '우리에게 달린, 우리가 할 몫인',
  'played that up': '분위기를 띄우다, 능청스럽게 장난치다',
  'appearance': '외모, 생김새',
  'turns out': '알고 보니 ~이다, 드러나다',
  'came across': '~한 느낌으로 다가오다, 전달되다',
  'turned into': '~로 변하다, 바뀌다',
  'felt random': '뜬금없게 느껴지다, 생뚱맞다',
  'get in line': '줄을 서다, 차례를 기다리다',
  'first in line': '맨 먼저 줄을 선, 첫 번째 순서의',
  'by the time': '~할 무렵에는, ~할 때쯤에',
  'throughout': '~내내, 줄곧',
  'wondering if': '~인지 궁금해하다',
  'at the end': '마지막에, 끝 무렵에',

  // Lesson 05
  'my brain is mush': '머리가 멍하다, 생각이 안 돌아가다',
  'minors': '부전공 (대학 부전공 이수)',
  'had to do with': '~와 관련이 있다, 상관이 있다',
  'have to do with': '~와 관련이 있다, 상관이 있다',
  'get into': '(학교·프로그램에) 들어가다, 입학하다',
  'transcript': '성적 증명서, 학업 이수 기록',
  'suit their requirements': '요구 조건/자격 요건에 부합하다',
  'covers': '(과목·주제를) 다루다, 포함하다',
  'cover': '(과목·주제를) 다루다, 대체 인정받다',
  'prerequisite': '선수 과목, 필수 선행 요건',
  'waived': '(수업·요건 등이) 면제된',
  'as well': '또한, 마찬가지로, 역시',
  'come up': '(시험 등에) 문제로 나오다, 언급되다',
  'multiple choice': '객관식 (선택형 문제)',
  'second guess': '자신의 결정을 뒤늦게 의심하다, 재고하다',
  'secondguess': '자신의 결정을 뒤늦게 의심하다, 재고하다',
  'decently': '나름 괜찮게, 꽤 준수하게',
  'out of the three': '3점 만점 중에서, 셋 중에서',
  'come up with': '(아이디어·답변 등을) 생각해내다, 짜내다',
  'opened my eyes': '새로운 사실에 눈을 뜨게 하다, 깨닫게 하다',
  'in-depth': '심도 있는, 상세하고 깊이 있는',
  'indepth': '심도 있는, 상세하고 깊이 있는',
  'fell into': '우연히 시작하다, 어쩌다 발을 들이다',
  'fall into': '우연히 시작하다, 어쩌다 발을 들이다',

  // Lesson 06
  'ended up': '결국 ~하게 되다',
  'hang around': '어슬렁거리다, 서성거리다',
  'practical': '실용적인, 현실적인',
  'went out to dinner': '저녁 외식을 하러 가다',
  'looped': '술에 취한, 알딸딸한',
  'pushing the peppers aside': '고추를 한쪽으로 치워두다',
  'pushing, aside': '고추를 한쪽으로 쓱 치워두다',
  'pushing': '옆으로 밀어두다, 치우다',
  'show off': '과시하다, 뽐내다, 허세 부리다',
  'being around': '~와 함께 어울리는 시간을 좋아하다',
  'enjoyed being around': '~와 함께 어울리는 시간을 좋아하다',
  'taken to the bar': '술집에 데려가 지다',
  'one of the times': '그 여러 번 중 한 번',
  'early in the relationship': '연애 초기에',
  'all the way from, to': 'A에서 B까지 줄곧 내내',
  'all the way from': '줄곧, 내내 끝까지',
  'all the way from martinez to lafayette': '마티네즈에서 라피엣까지 줄곧 내내',
  'went around a corner': '코너(모퉁이)를 돌다',
  'the time of year': '연중 시기, 계절',
  'take a nap': '낮잠을 자다',
  'dull moment': '지루할 틈, 심심한 순간',
  'backing out': '(나사가) 헐거워져 삐져나오다',
  "it's a pain": '성가신 일, 골칫거리',
  'its a pain': '성가신 일, 골칫거리',
  'way back': '아주 먼 옛날에, 훨씬 전에',
  'it was surprising that': '~라는 점이 놀라웠다',
  'disturbed': '방해받은, 심기가 불편해진',
  'sightings': '(야생동물 등의) 목격, 출몰',
  'got to': '~해야만 한다',
  "you've got to": '~해야만 한다',
  'youve got to': '~해야만 한다',
  'have got to': '~해야만 한다',
  'figuring out': '방법을 알아내다, 파악하다'
};

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

function extractConciseDefinition(quiz) {
  if (CONCISE_DEFINITIONS[quiz.answer.toLowerCase()]) {
    return CONCISE_DEFINITIONS[quiz.answer.toLowerCase()];
  }
  // Try extracting from explanation quotes e.g. "strong-willed"는 "의지가 강한..."
  if (quiz.explanation) {
    const quoteMatches = [...quiz.explanation.matchAll(/"([^"]+)"/g)];
    if (quoteMatches.length >= 2) {
      const def = quoteMatches[1][1];
      if (def && def.length <= 30 && !def.includes(' ')) {
        return def;
      }
    }
  }
  // Fallback to Korean sentence truncated or simplified
  return quiz.korean.replace(/[.?!]$/, '');
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"“”]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

    // 1. First priority: Exact sentence match with SRT blocks
    let matchedBlock = srtBlocks.find(b => {
      const normB = normalize(b.text);
      return normCleanEn.includes(normB) || normB.includes(normCleanEn);
    });

    // 2. Second priority: Block contains the target expression
    if (!matchedBlock) {
      matchedBlock = srtBlocks.find(b => {
        const normB = normalize(b.text);
        return normB.includes(normTarget);
      });
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

module.exports = { generateLessonKeyExpressionsSrt };
