/**
 * Markdown Quiz Parser for RhyRhy English
 * Parses markdown quiz files into structured question objects.
 */
const MarkdownQuizParser = {
  /**
   * Parse raw markdown string into an array of quiz question objects.
   * @param {string} markdownText
   * @returns {Array<object>}
   */
  parse(markdownText) {
    if (!markdownText || typeof markdownText !== 'string') return [];

    const lines = markdownText.split(/\r?\n/);
    const quizzes = [];
    let currentQuiz = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check for quiz header: "## Quiz 1" or similar
      const quizHeaderMatch = line.match(/^##\s+(?:Quiz\s*\d*|Question\s*\d*|Q\d+)(.*)/i);
      if (quizHeaderMatch) {
        if (currentQuiz && currentQuiz.type) {
          this._finalizeQuiz(currentQuiz);
          quizzes.push(currentQuiz);
        }
        currentQuiz = {
          title: quizHeaderMatch[1].trim() || `Question ${quizzes.length + 1}`,
          type: '',
          korean: '',
          english: '',
          audio: '',
          answer: '',
          options: [],
          explanation: ''
        };
        continue;
      }

      if (!currentQuiz) continue;

      // Match key-value items like: "- **Type**: fill-in-the-blank" or "* Type: fill-in-the-blank"
      const kvMatch = line.match(/^[-*]\s+\*{0,2}(Type|Korean|English|Audio|Answer|Explanation)\*{0,2}\s*:\s*(.*)/i);
      if (kvMatch) {
        const key = kvMatch[1].toLowerCase();
        const val = kvMatch[2].trim();

        if (key === 'type') {
          currentQuiz.type = this._normalizeType(val);
        } else if (key === 'korean') {
          currentQuiz.korean = val;
        } else if (key === 'english') {
          currentQuiz.english = val;
        } else if (key === 'audio') {
          currentQuiz.audio = val;
        } else if (key === 'answer') {
          currentQuiz.answer = val;
        } else if (key === 'explanation') {
          currentQuiz.explanation = val;
        }
      }
    }

    if (currentQuiz && currentQuiz.type) {
      this._finalizeQuiz(currentQuiz);
      quizzes.push(currentQuiz);
    }

    return quizzes;
  },

  /**
   * Fetch and parse a markdown quiz file by URL
   * @param {string} url
   * @returns {Promise<Array<object>>}
   */
  async loadFromUrl(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load quiz markdown from ${url}: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    return this.parse(text);
  },

  _normalizeType(typeStr) {
    const t = typeStr.toLowerCase().replace(/[^a-z]/g, '');
    if (t.includes('drag') || t.includes('drop') || t.includes('order')) return 'drag-and-drop';
    if (t.includes('multiple') || t.includes('choice')) return 'multiple-choice';
    if (t.includes('listen')) return 'listening';
    return 'fill-in-the-blank';
  },

  _finalizeQuiz(quiz) {
    // For fill-in-the-blank quizzes, decompose words from brackets into individual blanks without mutating english
    if (quiz.type === 'fill-in-the-blank') {
      const allBracketMatches = [...quiz.english.matchAll(/\[(.*?)\]/g)].map(m => m[1].trim());
      quiz.blanks = allBracketMatches.flatMap(b => {
        if (b.includes(',')) return [b];
        return b.split(/\s+/).filter(Boolean);
      });
      if (!quiz.answer) {
        quiz.answer = quiz.blanks.join(' ');
      }
      quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/g, '_____');

      if (quiz.blanks && quiz.blanks.length > 1) {
        quiz.hints = quiz.blanks.map(b => this.generateFillInHint(b));
        quiz.hint = quiz.hints.join('   /   ');
      } else {
        quiz.hint = this.generateFillInHint(quiz.answer);
      }
      return;
    }

    // Extract bracketed content [content] from the English sentence
    const allBracketMatches = [...quiz.english.matchAll(/\[(.*?)\]/g)];

    if (allBracketMatches.length > 0) {
      const inside = allBracketMatches[0][1].trim();

      if (quiz.type === 'drag-and-drop') {
        // Words can be comma-separated: [that's, all, I, got] or space-separated: [that's all I got]
        let tokens = [];
        if (inside.includes(',')) {
          tokens = inside.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          tokens = inside.split(/\s+/).map(s => s.trim()).filter(Boolean);
        }
        quiz.tokens = tokens;
        quiz.options = tokens;
        if (!quiz.answer) {
          quiz.answer = tokens.join(' ');
        }
        quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/, '_____');
      } else if (quiz.type === 'multiple-choice') {
        // Options may be comma-separated: [cats, dogs, trees, water]
        const rawOptions = inside.split(',').map(s => s.trim()).filter(Boolean);
        quiz.options = rawOptions;
        if (!quiz.answer && rawOptions.length > 0) {
          // If answer not explicitly set, default to first option
          quiz.answer = rawOptions[0];
        }
        // Sentence template with a slot placeholder
        quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/, '_____');
      } else {
        // Listening
        if (allBracketMatches.length > 1) {
          quiz.blanks = allBracketMatches.map(m => m[1].trim());
          if (!quiz.answer) {
            quiz.answer = quiz.blanks.join(', ');
          }
          quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/g, '_____');
        } else {
          quiz.blanks = [inside];
          if (!quiz.answer) {
            quiz.answer = inside;
          }
          quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/, '_____');
        }
      }
    } else if (!quiz.sentenceTemplate) {
      quiz.sentenceTemplate = quiz.english;
    }

    // Prepare hints based on quiz type
    if (quiz.type === 'listening') {
      quiz.hint = this.generateListeningHint(quiz.answer);
    } else if (quiz.type === 'drag-and-drop') {
      quiz.hint = (quiz.tokens && quiz.tokens.length > 0) ? `첫 단어 힌트: "${quiz.tokens[0]}"` : '';
    }
  },

  /**
   * Generates hint for Fill-in-the-blank:
   * First and last letter of each word (e.g. "cats" -> "c _ _ s", "early bird" -> "e _ _ _ y   b _ _ d")
   * @param {string} text
   * @returns {string}
   */
  generateFillInHint(text) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.map(word => {
      const match = word.match(/^(.*?)([.,!?;:]*)$/);
      const clean = match ? match[1] : word;
      const punct = match ? match[2] : '';

      const alphaIndices = [];
      for (let i = 0; i < clean.length; i++) {
        if (/[a-zA-Z0-9]/.test(clean[i])) {
          alphaIndices.push(i);
        }
      }

      if (alphaIndices.length <= 1) {
        return clean + punct;
      }

      const revealed = alphaIndices.length === 2
        ? new Set([alphaIndices[0]])
        : new Set([alphaIndices[0], alphaIndices[alphaIndices.length - 1]]);

      let res = '';
      for (let i = 0; i < clean.length; i++) {
        if (revealed.has(i)) {
          res += (res && res[res.length - 1] !== ' ' && res[res.length - 1] !== '-' ? ' ' : '') + clean[i];
        } else if (/[a-zA-Z0-9]/.test(clean[i])) {
          res += (res && res[res.length - 1] !== ' ' && res[res.length - 1] !== '-' ? ' ' : '') + '_';
        } else {
          res += clean[i];
        }
      }
      return res + punct;
    }).join('   ');
  },

  /**
   * Generates hint for Listening & Fill-in-the-blank:
   * First two letters of each word kept together without artificial space (e.g. "cats" -> "ca _ _", "pastry" -> "pa _ _ _ _")
   * @param {string} text
   * @returns {string}
   */
  generateListeningHint(text) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.map(word => {
      const match = word.match(/^(.*?)([.,!?;:]*)$/);
      const clean = match ? match[1] : word;
      const punct = match ? match[2] : '';

      const alphaIndices = [];
      for (let i = 0; i < clean.length; i++) {
        if (/[a-zA-Z0-9]/.test(clean[i])) {
          alphaIndices.push(i);
        }
      }

      const cutoff = alphaIndices.length <= 2 ? alphaIndices.length : 2;
      const revealed = new Set(alphaIndices.slice(0, cutoff));

      let res = '';
      for (let i = 0; i < clean.length; i++) {
        if (revealed.has(i)) {
          res += clean[i];
        } else if (/[a-zA-Z0-9]/.test(clean[i])) {
          res += (res && res[res.length - 1] !== ' ' && res[res.length - 1] !== '-' ? ' ' : '') + '_';
        } else {
          res += clean[i];
        }
      }
      return res + punct;
    }).join('   ');
  },

  /**
   * Check if user's typed input matches answer (case-insensitive, trims punctuation)
   * @param {string} input
   * @param {string} answer
   * @returns {boolean}
   */
  checkAnswer(input, answer) {
    if (!input || !answer) return false;
    const normalize = (s) => s.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '').replace(/\s+/g, ' ').trim();
    return normalize(input) === normalize(answer);
  }
};

if (typeof window !== 'undefined') {
  window.MarkdownQuizParser = MarkdownQuizParser;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownQuizParser;
}

