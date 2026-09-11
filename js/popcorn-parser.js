/**
 * Popcorn Lesson Markdown Parser for RhyRhy English
 * Parses bite-sized multi-audio conversation lessons into structured interactive lesson data.
 */
const PopcornParser = {
  /**
   * Parse a raw Markdown string of a popcorn lesson
   * @param {string} markdownText
   * @returns {object}
   */
  parse(markdownText) {
    if (!markdownText || typeof markdownText !== 'string') {
      return null;
    }

    const lesson = {
      id: '',
      type: 'conversation',
      expression: '',
      title: '',
      prompt: '이 표현을 아시나요?',
      dialogue: [],
      explanation: '',
      targetSentence: null
    };

    const lines = markdownText.split(/\r?\n/);
    let currentSection = 'header';
    let currentLine = null;
    const explanationLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check section headers
      if (/^##\s+Expression\s*Check/i.test(trimmed)) {
        currentSection = 'expression_check';
        continue;
      } else if (/^##\s+Dialogue/i.test(trimmed)) {
        currentSection = 'dialogue';
        continue;
      } else if (/^##\s+Explanation/i.test(trimmed)) {
        currentSection = 'explanation';
        continue;
      }

      // 1. Header & Expression Check metadata
      if (currentSection === 'header' || currentSection === 'expression_check') {
        const titleMatch = trimmed.match(/^#\s+(.*)/);
        if (titleMatch && !lesson.title) {
          lesson.title = titleMatch[1].replace(/^Popcorn\s*English:\s*/i, '').trim();
        }

        const kvMatch = trimmed.match(/^[-*]\s+\*{0,2}(ID|Type|Expression|Title|Prompt)\*{0,2}\s*:\s*(.*)/i);
        if (kvMatch) {
          const key = kvMatch[1].toLowerCase();
          const val = kvMatch[2].trim();
          if (key === 'id') lesson.id = val;
          else if (key === 'type') lesson.type = val.toLowerCase();
          else if (key === 'expression') lesson.expression = val;
          else if (key === 'title') lesson.title = val;
          else if (key === 'prompt') lesson.prompt = val;
        }
        continue;
      }

      // 2. Dialogue Section
      if (currentSection === 'dialogue') {
        // Speaker line: "- **Wayne**: Hello..." or "- **Kelly**: ..." or "- **Person A**: ..."
        const speakerMatch = trimmed.match(/^[-*]\s+\*{0,2}(Person\s+[A-Z]|Speaker\s+\d+|[A-Za-z0-9_\s]+)\*{0,2}\s*:\s*(.*)/i);
        if (speakerMatch && !/^(Audio|Korean|Translation|Avatar)$/i.test(speakerMatch[1])) {
          if (currentLine) {
            this._finalizeDialogueLine(currentLine, lesson.expression);
            lesson.dialogue.push(currentLine);
          }

          const speaker = speakerMatch[1].trim();
          const englishText = speakerMatch[2].trim();

          currentLine = {
            speaker,
            avatar: '',
            text: englishText,
            rawText: englishText.replace(/\[(.*?)\]/g, '$1'),
            audio: '',
            korean: '',
            hasExpression: false
          };
          continue;
        }

        // Nested attributes: "  - **Audio**: ..." or "  - **Korean**: ..." or "  - **Avatar**: ..."
        if (currentLine) {
          const nestedMatch = trimmed.match(/^[-*]\s+\*{0,2}(Audio|Korean|Translation|Avatar)\*{0,2}\s*:\s*(.*)/i);
          if (nestedMatch) {
            const key = nestedMatch[1].toLowerCase();
            const val = nestedMatch[2].trim();
            if (key === 'audio') {
              currentLine.audio = val;
            } else if (key === 'korean' || key === 'translation') {
              currentLine.korean = val;
            } else if (key === 'avatar') {
              currentLine.avatar = val;
            }
          }
        }
        continue;
      }

      // 3. Explanation Section (Preserve line hierarchy and indentations for nested markdown lists)
      if (currentSection === 'explanation') {
        explanationLines.push(line);
      }
    }

    if (currentLine) {
      this._finalizeDialogueLine(currentLine, lesson.expression);
      lesson.dialogue.push(currentLine);
    }

    const rawExplanation = explanationLines.join('\n').trim();
    lesson.rawExplanation = rawExplanation;
    lesson.explanation = this.renderMarkdown(rawExplanation);

    // Identify target sentence for saving into centralized Saved Sentences Bank (only sentence with expression)
    const target = lesson.dialogue.find(d => d.hasExpression);
    if (target) {
      lesson.targetSentence = {
        id: (lesson.id ? lesson.id + '_target' : 'popcorn_' + Date.now()),
        en: target.rawText,
        kr: target.korean,
        audio: target.audio,
        avatar: target.avatar,
        speaker: target.speaker,
        expression: lesson.expression,
        matchedExpression: target.matchedExpression || lesson.expression,
        timestamp: 0
      };
    } else {
      lesson.targetSentence = null;
    }

    return lesson;
  },

  /**
   * Render markdown explanation text into semantic, accessible HTML blocks
   * Supports:
   * - Headings (###, ####)
   * - Bold (**text**), Italic (*text* or _text_)
   * - Inline code (`text`)
   * - Nested bullet lists (- item, * item, indented sub-bullets)
   * - Paragraphs
   * @param {string} mdText
   * @returns {string} HTML
   */
  renderMarkdown(mdText) {
    if (!mdText || typeof mdText !== 'string') return '';

    const lines = mdText.split(/\r?\n/);
    const blocks = [];
    let currentList = null;
    let currentParagraph = [];

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const pText = currentParagraph.join(' ').trim();
        if (pText) {
          blocks.push(`<p class="popcorn-exp-paragraph">${this._renderInline(pText)}</p>`);
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList && currentList.items.length > 0) {
        let listHtml = '<ul class="popcorn-exp-list">';
        currentList.items.forEach(item => {
          listHtml += `<li class="popcorn-exp-item">${this._renderInline(item.text)}`;
          if (item.subItems && item.subItems.length > 0) {
            listHtml += '<ul class="popcorn-exp-sublist">';
            item.subItems.forEach(sub => {
              listHtml += `<li class="popcorn-exp-subitem">${this._renderInline(sub)}</li>`;
            });
            listHtml += '</ul>';
          }
          listHtml += '</li>';
        });
        listHtml += '</ul>';
        blocks.push(listHtml);
      }
      currentList = null;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        continue;
      }

      // Headings (##, ### or ####)
      const headingMatch = trimmed.match(/^(#{2,5})\s+(.*)/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        const level = headingMatch[1].length;
        blocks.push(`<h${level} class="popcorn-exp-heading popcorn-exp-h${level}">${this._renderInline(headingMatch[2].trim())}</h${level}>`);
        continue;
      }

      // Check if it's a list item (- or *)
      const listMatch = line.match(/^(\s*)([-*])\s+(.*)/);
      if (listMatch) {
        flushParagraph();
        const indent = listMatch[1].length;
        const itemContent = listMatch[3].trim();

        if (indent >= 2 && currentList && currentList.items.length > 0) {
          // Sub-item of last list item
          const lastItem = currentList.items[currentList.items.length - 1];
          lastItem.subItems = lastItem.subItems || [];
          lastItem.subItems.push(itemContent);
        } else {
          // Top-level list item
          if (!currentList) {
            currentList = { items: [] };
          }
          currentList.items.push({ text: itemContent, subItems: [] });
        }
        continue;
      }

      // Regular paragraph line
      flushList();
      currentParagraph.push(trimmed);
    }

    flushParagraph();
    flushList();

    return blocks.join('\n');
  },

  /**
   * Helper to render inline markdown styles
   * @param {string} text
   * @returns {string}
   */
  _renderInline(text) {
    if (!text) return '';
    let res = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Inline code: `code`
    res = res.replace(/`([^`]+)`/g, '<code class="popcorn-exp-code">$1</code>');

    // Bold: **text**
    res = res.replace(/\*\*([^*]+)\*\*/g, '<strong class="popcorn-exp-bold">$1</strong>');

    // Italic: *text* (avoiding match within bold)
    res = res.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em class="popcorn-exp-em">$2</em>$3');

    return res;
  },

  /**
   * Helper to finalize formatting and expression detection for a dialogue line
   */
  _finalizeDialogueLine(line, targetExpression) {
    if (!line) return;

    // Default avatar based on speaker name if not specified
    if (!line.avatar) {
      if (/wayne/i.test(line.speaker)) {
        line.avatar = 'wayne.jpeg';
      } else if (/kelly/i.test(line.speaker)) {
        line.avatar = 'kelly.jpg';
      }
    }

    // Check for explicit bracket notation: e.g. [Just so you know]
    const bracketRegex = /\[(.*?)\]/;
    const hasBrackets = bracketRegex.test(line.text);

    if (hasBrackets) {
      const match = line.text.match(bracketRegex);
      line.matchedExpression = match ? match[1] : '';
      line.hasExpression = true;
      line.formattedText = line.text.replace(/\[(.*?)\]/g, '<mark class="popcorn-highlight">$1</mark>');
      line.rawText = line.text.replace(/\[(.*?)\]/g, '$1');
    } else if (targetExpression && line.text.toLowerCase().includes(targetExpression.toLowerCase())) {
      line.hasExpression = true;
      line.matchedExpression = targetExpression;
      const regex = new RegExp(`(${this._escapeRegExp(targetExpression)})`, 'gi');
      line.formattedText = line.text.replace(regex, '<mark class="popcorn-highlight">$1</mark>');
      line.rawText = line.text;
    } else {
      line.formattedText = line.text;
      line.rawText = line.text;
    }
  },

  _escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
};

if (typeof window !== 'undefined') {
  window.PopcornParser = PopcornParser;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PopcornParser;
}
