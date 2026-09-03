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
    if (t.includes('multiple') || t.includes('choice')) return 'multiple-choice';
    if (t.includes('listen')) return 'listening';
    return 'fill-in-the-blank';
  },

  _finalizeQuiz(quiz) {
    // Extract bracketed content [content] from the English sentence
    const bracketMatch = quiz.english.match(/\[(.*?)\]/);

    if (bracketMatch) {
      const inside = bracketMatch[1].trim();

      if (quiz.type === 'multiple-choice') {
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
        // Fill-in-the-blank or Listening: inside is the correct answer
        quiz.answer = inside;
        quiz.sentenceTemplate = quiz.english.replace(/\[(.*?)\]/, '_____');
      }
    } else if (!quiz.sentenceTemplate) {
      quiz.sentenceTemplate = quiz.english;
    }

    // Prepare hints based on quiz type
    if (quiz.type === 'fill-in-the-blank') {
      quiz.hint = this.generateFillInHint(quiz.answer);
    } else if (quiz.type === 'listening') {
      quiz.hint = this.generateListeningHint(quiz.answer);
    }
  },

  /**
   * Generates hint for Fill-in-the-blank:
   * First and last letter of each word (e.g. "cats" -> "c _ _ s", "early bird" -> "e _ _ _ y  b _ _ d")
   * @param {string} text
   * @returns {string}
   */
  generateFillInHint(text) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.map(word => {
      // Preserve punctuation
      const clean = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const punct = word.slice(clean.length);

      if (clean.length <= 1) {
        return clean + punct;
      }
      if (clean.length === 2) {
        return `${clean[0]} _${punct}`;
      }
      // First letter + underscores + last letter
      const middleUnderscores = Array(clean.length - 2).fill('_').join(' ');
      return `${clean[0]} ${middleUnderscores} ${clean[clean.length - 1]}${punct}`;
    }).join('   ');
  },

  /**
   * Generates hint for Listening & Fill-in-the-blank:
   * First two letters of each word (e.g. "cats" -> "c a _ _", "pastry" -> "p a _ _ _ _")
   * @param {string} text
   * @returns {string}
   */
  generateListeningHint(text) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    return words.map(word => {
      const clean = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
      const punct = word.slice(clean.length);

      if (clean.length <= 2) {
        return clean + punct;
      }
      const firstTwo = clean.slice(0, 2);
      const remainingUnderscores = Array(clean.length - 2).fill('_').join(' ');
      return `${firstTwo[0]} ${firstTwo[1]} ${remainingUnderscores}${punct}`;
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownQuizParser;
}

