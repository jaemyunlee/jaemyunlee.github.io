const fs = require('fs');
const path = require('path');

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function buildKeySentencesAndReviewQuizzes() {
  for (let l = 2; l <= 7; l++) {
    const pad = String(l).padStart(2, '0');
    const lessonId = `lesson-${pad}`;
    const lessonDir = path.join(__dirname, '..', 'lessons', lessonId);
    const quizMdPath = path.join(lessonDir, 'quiz.md');
    const scriptPath = path.join(lessonDir, 'script.json');
    const indexPath = path.join(lessonDir, 'index.html');

    if (!fs.existsSync(quizMdPath) || !fs.existsSync(scriptPath) || !fs.existsSync(indexPath)) {
      console.warn(`[Skip] Missing files for ${lessonId}`);
      continue;
    }

    const quizMd = fs.readFileSync(quizMdPath, 'utf8');
    const script = JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
    const html = fs.readFileSync(indexPath, 'utf8');

    const audioMatch = html.match(new RegExp(`const\\s+LESSON_${pad}_AUDIO_FILES\\s*=\\s*\\[([\\s\\S]*?)\\];`));
    const audioFiles = audioMatch ? eval('[' + audioMatch[1] + ']') : [];

    const blocks = quizMd.split(/##\s*Quiz\s*\d+/i).slice(1);

    const keySentences = [];
    const reviewQuizzes = [];

    blocks.forEach((b, idx) => {
      const enM = b.match(/-\s*\*\*English\*\*:\s*([^\n]+)/i);
      const koM = b.match(/-\s*\*\*Korean\*\*:\s*([^\n]+)/i);
      const ansM = b.match(/-\s*\*\*Answer\*\*:\s*([^\n]+)/i);
      const expM = b.match(/-\s*\*\*Explanation\*\*:\s*([^\n]+)/i);

      const rawEnglish = enM ? enM[1].trim() : '';
      const korean = koM ? koM[1].trim() : '';
      let answer = ansM ? ansM[1].trim() : '';
      const explanation = expM ? expM[1].trim() : '';

      const bracketM = rawEnglish.match(/\[(.*?)\]/);
      if (!answer && bracketM) {
        answer = bracketM[1].split(',')[0].trim();
      }
      const target = answer;

      const cleanEn = rawEnglish.replace(/\[(.*?)\]/, (m, p1) => p1.split(',')[0].trim());
      const reviewEnglish = rawEnglish.replace(/\[(.*?)\]/, (m, p1) => `[${p1.split(',')[0].trim()}]`);
      const normClean = normalize(cleanEn);

      let bestSeg = null;
      let bestScore = 0;
      for (const seg of script) {
        const normSeg = normalize(seg.en);
        if (normSeg === normClean || normSeg.includes(normClean) || normClean.includes(normSeg)) {
          bestSeg = seg;
          break;
        }
        const segWords = new Set(normSeg.split(' '));
        const cleanWords = normClean.split(' ');
        const overlap = cleanWords.filter(w => segWords.has(w)).length;
        const score = overlap / Math.max(cleanWords.length, segWords.size);
        if (score > bestScore && score > 0.4) {
          bestScore = score;
          bestSeg = seg;
        }
      }

      let clozeSentence = bestSeg ? bestSeg.en : cleanEn;
      const escTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const targetRegex = new RegExp(`\\b${escTarget}\\b`, 'i');
      if (targetRegex.test(clozeSentence)) {
        clozeSentence = clozeSentence.replace(targetRegex, '[ ______ ]');
      } else {
        const lowerCloze = clozeSentence.toLowerCase();
        const lowerTarget = target.toLowerCase();
        const pos = lowerCloze.indexOf(lowerTarget);
        if (pos >= 0) {
          clozeSentence = clozeSentence.substring(0, pos) + '[ ______ ]' + clozeSentence.substring(pos + target.length);
        }
      }

      keySentences.push({
        id: idx + 1,
        keyExpression: target,
        answer: target,
        english: rawEnglish,
        korean: korean,
        explanation: explanation,
        audioFile: audioFiles[idx] || null,
        target: target,
        segmentId: bestSeg ? bestSeg.id : null,
        segmentAudio: bestSeg ? `segments/${bestSeg.id}.mp3` : null,
        segmentEn: bestSeg ? bestSeg.en : '',
        segmentKr: bestSeg ? bestSeg.kr : '',
        clozeSentence: clozeSentence
      });

      reviewQuizzes.push({
        id: idx + 1,
        type: 'speaking',
        keyExpression: target,
        target: target,
        english: reviewEnglish,
        korean: korean,
        explanation: explanation,
        segmentId: bestSeg ? bestSeg.id : null,
        segmentAudio: bestSeg ? `segments/${bestSeg.id}.mp3` : null,
        segmentEn: bestSeg ? bestSeg.en : '',
        segmentKr: bestSeg ? bestSeg.kr : ''
      });
    });

    const ksOutPath = path.join(lessonDir, 'key-sentences.json');
    fs.writeFileSync(ksOutPath, JSON.stringify(keySentences, null, 2), 'utf8');
    console.log(`[Success] Written: ${ksOutPath} (${keySentences.length} items)`);

    const rqOutPath = path.join(lessonDir, 'review-quiz.json');
    fs.writeFileSync(rqOutPath, JSON.stringify(reviewQuizzes, null, 2), 'utf8');
    console.log(`[Success] Written: ${rqOutPath} (${reviewQuizzes.length} items)`);
  }
}

if (require.main === module) {
  buildKeySentencesAndReviewQuizzes();
}

module.exports = { buildKeySentencesAndReviewQuizzes };
