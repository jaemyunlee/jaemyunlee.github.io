/**
 * RhyRhy English - Standalone Quiz Share Runner
 * Issue #6: Handles standalone quiz execution, interactive answering, and post-answer referral modal.
 */

(function () {
  'use strict';

  class QuizShareRunner {
    constructor() {
      this.lessonId = 'lesson-01';
      this.qNum = 1;
      this.quizData = null;
      this.answered = false;
      this.audioPlayer = null;

      this.init();
    }

    async init() {
      if (typeof App !== 'undefined') {
        App.init('quiz-share');
      }
      this.resolveParams();
      await this.loadQuizData();
      this.render();
      this.bindEvents();

      if (typeof Analytics !== 'undefined') {
        Analytics.init();
        Analytics.trackEvent('quiz_view', {
          lesson_id: this.lessonId,
          question_num: this.qNum
        });
      }
    }

    resolveParams() {
      // 1. Embedded JSON script tag
      const embeddedScript = document.getElementById('quiz-data');
      if (embeddedScript && embeddedScript.textContent.trim()) {
        try {
          const parsed = JSON.parse(embeddedScript.textContent);
          this.lessonId = parsed.lessonId || this.lessonId;
          this.qNum = parseInt(parsed.num || 1, 10);
          this.quizData = parsed;
          return;
        } catch (e) {
          console.warn('Failed to parse embedded quiz data:', e);
        }
      }

      // 2. URL Search params (?lesson=lesson-01&q=3)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('lesson')) {
        this.lessonId = urlParams.get('lesson');
      }
      if (urlParams.has('q')) {
        this.qNum = parseInt(urlParams.get('q'), 10) || 1;
      }

      // 3. Path matching (/quiz/lesson-01/q3.html or /quiz/lesson-01/3)
      const match = window.location.pathname.match(/quiz\/(lesson-\d+)\/(?:q)?(\d+)/);
      if (match) {
        this.lessonId = match[1];
        this.qNum = parseInt(match[2], 10) || 1;
      }
    }

    async loadQuizData() {
      if (this.quizData) return;

      try {
        const mdUrl = `/lessons/${this.lessonId}/quiz.md`;
        const res = await fetch(mdUrl);
        if (!res.ok) throw new Error(`Quiz file not found: ${res.status}`);
        const mdText = await res.text();
        const quizzes = MarkdownQuizParser.parse(mdText);
        const target = quizzes[this.qNum - 1] || quizzes[0];
        if (target) {
          this.quizData = {
            lessonId: this.lessonId,
            num: this.qNum,
            ...target
          };
        }
      } catch (err) {
        console.error('Error loading quiz data:', err);
      }
    }

    render() {
      const container = document.getElementById('quiz-share-container');
      if (!container) return;

      if (!this.quizData) {
        container.innerHTML = `
          <div class="quiz-standalone-card" style="text-align: center; padding: 48px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">⚠️</div>
            <h2 style="font-size: 1.3rem; margin-bottom: 8px;">퀴즈를 불러올 수 없습니다</h2>
            <p style="color: var(--text-muted); margin-bottom: 24px;">요청하신 퀴즈가 존재하지 않거나 주소가 올바르지 않습니다.</p>
            <a href="/lessons.html" class="btn btn-primary" style="display: inline-flex; padding: 10px 20px; border-radius: var(--radius-md); text-decoration: none; color: #fff;">전체 레슨 목록 보기</a>
          </div>
        `;
        return;
      }

      const q = this.quizData;
      const lessonDisplayNum = this.lessonId.replace('lesson-', '').replace(/^0+/, '');

      // Render type badge & meta
      const typeLabel = q.type === 'multiple-choice'
        ? '객관식 퀴즈'
        : (q.type === 'listening' ? '리스닝 퀴즈' : (q.type === 'drag-and-drop' ? '단어 배열 퀴즈' : '빈칸 채우기'));

      // Prepare sentence cloze
      const clozeHtml = this.formatSentenceForDisplay(q);

      // Question body
      let bodyHtml = '';
      if (q.type === 'multiple-choice') {
        if (!q._shuffledOptions) {
          q._shuffledOptions = this.shuffleArray(q.options || []);
        }
        const options = q._shuffledOptions;
        const optionsHtml = options.map((opt, idx) => `
          <button type="button" class="standalone-choice-btn" data-answer="${this.escapeHtml(opt)}">
            <span class="standalone-choice-marker">${String.fromCharCode(65 + idx)}</span>
            <span class="standalone-choice-text">${this.escapeHtml(opt)}</span>
          </button>
        `).join('');

        bodyHtml = `
          <div class="standalone-choices-grid" id="standalone-choices-grid">
            ${optionsHtml}
          </div>
        `;
      } else if (q.type === 'drag-and-drop') {
        if (!q._shuffledTokens) {
          let tokens = [...(q.tokens || (q.options && q.options.length > 0 ? q.options : (q.answer ? q.answer.split(/\s+/) : [])))];
          let shuffled = this.shuffleArray(tokens);
          if (tokens.length > 1 && shuffled.join(' ') === tokens.join(' ')) {
            shuffled = [shuffled[shuffled.length - 1], ...shuffled.slice(0, shuffled.length - 1)];
          }
          q._shuffledTokens = shuffled;
        }

        const chipsHtml = q._shuffledTokens.map((tok, idx) => `
          <button 
            type="button" 
            class="drag-word-chip" 
            draggable="true" 
            data-word="${this.escapeHtml(tok)}" 
            id="share-chip-${idx}"
          >
            <span class="drag-handle" aria-hidden="true">⠿</span>
            <span class="chip-text">${this.escapeHtml(tok)}</span>
          </button>
        `).join('');

        bodyHtml = `
          <div class="word-bank-wrapper">
            <div class="word-bank-header">
              <span class="word-bank-title">🔤 단어들을 빈칸으로 끌어다 놓거나 탭하여 순서대로 맞추세요</span>
              <button type="button" class="word-reset-btn" id="word-reset-btn" title="모든 단어 초기화">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
                <span>초기화</span>
              </button>
            </div>
            <div class="word-bank-grid" id="word-bank-grid" role="group" aria-label="단어 보관함">
              ${chipsHtml}
            </div>
          </div>
          <div style="text-align: center; margin-top: 16px;">
            <button type="button" id="standalone-submit-btn" class="standalone-submit-btn">정답 확인</button>
          </div>
        `;
      } else {
        const bracketMatches = [...(q.english || '').matchAll(/\[(.*?)\]/g)].map(m => m[1].trim());
        const wordBlanks = (q.type !== 'listening')
          ? ((q.blanks && q.blanks.length > 0) ? q.blanks : bracketMatches.flatMap(b => (b.includes(',') ? [b] : b.split(/\s+/).filter(Boolean))))
          : bracketMatches;

        if (wordBlanks.length > 1) {
          const inputsHtml = wordBlanks.map((b, idx) => {
            const targetLen = b.length;
            const style = targetLen <= 3 
              ? 'min-width:52px;max-width:75px;text-align:center;' 
              : (targetLen <= 6 ? 'min-width:74px;max-width:115px;text-align:center;' : 'min-width:105px;max-width:160px;');
            return `
              <input type="text" id="${idx === 0 ? 'standalone-input' : `standalone-input-${idx}`}" class="standalone-text-input standalone-multi-input" data-index="${idx}" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" enterkeyhint="${idx < wordBlanks.length - 1 ? 'next' : 'done'}" style="${style}" />
            `;
          }).join('');
          bodyHtml = `
            <div class="standalone-input-row multi-input-row" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;align-items:center;">
              ${inputsHtml}
              <button type="button" id="standalone-submit-btn" class="standalone-submit-btn">정답 확인</button>
            </div>
          `;
        } else {
          bodyHtml = `
            <div class="standalone-input-row">
              <input type="text" id="standalone-input" class="standalone-text-input" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" />
              <button type="button" id="standalone-submit-btn" class="standalone-submit-btn">정답 확인</button>
            </div>
          `;
        }
      }

      // Audio section if audio file or listening
      let audioHtml = '';
      if (q.audio || q.type === 'listening') {
        audioHtml = `
          <div class="standalone-audio-row">
            <button type="button" class="btn-audio-listen" id="btn-audio-listen">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <span>발음 듣기</span>
            </button>
          </div>
        `;
      }

      container.innerHTML = `
        <div class="quiz-share-meta-bar">
          <div class="quiz-meta-pill">
            <span>Lesson ${lessonDisplayNum}</span>
            <span>•</span>
            <span>Quiz ${q.num}</span>
            <span>•</span>
            <span>${typeLabel}</span>
          </div>
          <button type="button" class="quiz-share-action-btn" id="btn-page-share" title="이 퀴즈 공유하기">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            <span>공유하기</span>
          </button>
        </div>

        <div class="quiz-standalone-card">
          <div class="quiz-invitation-badge">
            <span>★</span> 현서네 리얼 영어 챌린지
          </div>
          <h1 class="standalone-korean-title">${this.escapeHtml(q.korean)}</h1>

          ${audioHtml}

          <div class="standalone-cloze-box">
            ${clozeHtml}
          </div>

          ${bodyHtml}
        </div>

        <div class="quiz-share-footer">
          <p class="quiz-share-lesson-lead">이 퀴즈의 원본 영상과 전체 대화를 학습하고 싶으신가요?</p>
          <a href="/lessons/${this.lessonId}/index.html" class="btn-inline-lesson-link">
            <span>Lesson ${lessonDisplayNum} 전체 레슨 보기</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </a>
        </div>
      `;
    }

    formatSentenceForDisplay(q) {
      if (!q.english) return '';
      if (q.type === 'drag-and-drop') {
        const tokens = q.tokens || (q.options && q.options.length > 0 ? q.options : (q.answer ? q.answer.split(/\s+/) : []));
        const slotsHtml = tokens.map((_, idx) => `
          <div 
            class="word-slot" 
            data-slot-index="${idx}" 
            id="share-slot-${idx}" 
            role="region" 
            aria-label="빈칸 ${idx + 1}"
          ></div>
        `).join('');

        const parts = q.english.split(/\[.*?\]/);
        const beforeText = parts[0] || '';
        const afterText = parts[1] || '';

        return `
          <span class="sentence-text sentence-before">${this.escapeHtml(beforeText)}</span>
          <span class="sentence-text sentence-drag-preview" id="sentence-drag-preview" aria-live="polite">[ ＿＿＿＿ ]</span>
          <div class="word-slots-container word-drop-zone" id="word-drop-zone" role="group" aria-label="단어 빈칸 영역" data-slot-count="${tokens.length}">
            ${slotsHtml}
          </div>
          <span class="sentence-text sentence-after">${this.escapeHtml(afterText)}</span>
        `;
      }
      // Replace [options or word] with attractive placeholder slot(s)
      let blankIdx = 0;
      const replaced = q.english.replace(/\[(.*?)\]/g, (match, inside) => {
        if (q.type === 'fill-in-the-blank') {
          const words = inside.trim().split(/\s+/).filter(Boolean);
          if (words.length > 1) {
            return words.map(() => {
              const idStr = blankIdx === 0 ? 'id="cloze-slot"' : `id="cloze-slot-${blankIdx}"`;
              const span = `<span class="standalone-blank-slot cloze-slot" ${idStr} data-blank-index="${blankIdx}">[ ? ]</span>`;
              blankIdx++;
              return span;
            }).join(' ');
          }
        }
        const idStr = blankIdx === 0 ? 'id="cloze-slot"' : `id="cloze-slot-${blankIdx}"`;
        const span = `<span class="standalone-blank-slot cloze-slot" ${idStr} data-blank-index="${blankIdx}">[ ? ]</span>`;
        blankIdx++;
        return span;
      });
      return replaced;
    }

    bindEvents() {
      // Multiple Choice Clicks
      const choicesGrid = document.getElementById('standalone-choices-grid');
      if (choicesGrid) {
        choicesGrid.querySelectorAll('.standalone-choice-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            if (this.answered) return;
            const selected = btn.getAttribute('data-answer');
            this.handleAnswer(selected, btn);
          });
        });
      }

      // Drag and Drop Word Reorder
      if (this.quizData && this.quizData.type === 'drag-and-drop') {
        const dropZone = document.getElementById('word-drop-zone');
        const bankGrid = document.getElementById('word-bank-grid');
        const resetBtn = document.getElementById('word-reset-btn');
        const submitBtn = document.getElementById('standalone-submit-btn');

        if (!dropZone || !bankGrid) return;

        const slots = Array.from(dropZone.querySelectorAll('.word-slot'));

        const updateSentenceDragPreview = () => {
          const previewEl = document.getElementById('sentence-drag-preview');
          if (!previewEl) return;
          const placedWords = [];
          slots.forEach(slot => {
            const chip = slot.querySelector('.drag-word-chip');
            if (chip && chip.dataset.word) {
              placedWords.push(chip.dataset.word);
            }
          });
          if (placedWords.length === 0) {
            previewEl.textContent = '[ ＿＿＿＿ ]';
          } else {
            previewEl.textContent = `[ ${placedWords.join(' ')} ]`;
          }
        };

        updateSentenceDragPreview();

        const placeChipInSlot = (chip, targetSlot) => {
          if (!chip || !targetSlot) return;
          const sourceSlot = chip.closest('.word-slot');
          const existingChip = targetSlot.querySelector('.drag-word-chip');

          if (existingChip && existingChip !== chip) {
            if (sourceSlot && sourceSlot !== targetSlot) {
              sourceSlot.appendChild(existingChip);
              sourceSlot.classList.add('filled');
              existingChip.classList.add('placed');
            } else {
              existingChip.classList.remove('placed');
              bankGrid.appendChild(existingChip);
            }
          }

          targetSlot.appendChild(chip);
          chip.classList.add('placed');
          targetSlot.classList.add('filled');
          targetSlot.classList.remove('error', 'shake');

          if (sourceSlot && sourceSlot !== targetSlot && !sourceSlot.querySelector('.drag-word-chip')) {
            sourceSlot.classList.remove('filled');
          }

          updateSentenceDragPreview();
        };

        const toggleChip = (chip) => {
          if (this.answered || chip.disabled) return;
          const currentSlot = chip.closest('.word-slot');
          if (currentSlot) {
            chip.classList.remove('placed');
            bankGrid.appendChild(chip);
            currentSlot.classList.remove('filled', 'error', 'shake');
            updateSentenceDragPreview();
          } else {
            const emptySlot = dropZone.querySelector('.word-slot:not(.filled)');
            if (emptySlot) {
              placeChipInSlot(chip, emptySlot);
            } else {
              dropZone.classList.add('shake');
              setTimeout(() => dropZone.classList.remove('shake'), 400);
            }
          }
        };

        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (this.answered) return;
            slots.forEach(slot => {
              const chip = slot.querySelector('.drag-word-chip');
              if (chip) {
                chip.classList.remove('placed');
                bankGrid.appendChild(chip);
              }
              slot.classList.remove('filled', 'correct', 'error', 'shake', 'drag-over');
            });
            dropZone.classList.remove('correct', 'error', 'shake');
            updateSentenceDragPreview();
          });
        }

        let activeDraggedChip = null;

        // Bind slots
        slots.forEach(slot => {
          slot.addEventListener('dragover', (e) => {
            if (this.answered) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            slot.classList.add('drag-over');
          });

          slot.addEventListener('dragleave', (e) => {
            if (!slot.contains(e.relatedTarget)) {
              slot.classList.remove('drag-over');
            }
          });

          slot.addEventListener('drop', (e) => {
            if (this.answered) return;
            e.preventDefault();
            e.stopPropagation();
            slot.classList.remove('drag-over');
            const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
            const chip = (id ? document.getElementById(id) : null) || activeDraggedChip || document.querySelector('.drag-word-chip.dragging');
            if (chip) placeChipInSlot(chip, slot);
          });

          slot.addEventListener('click', (e) => {
            if (this.answered) return;
            const chip = slot.querySelector('.drag-word-chip');
            if (chip && e.target === slot) {
              toggleChip(chip);
            }
          });
        });

        // Bind chips
        const chips = document.querySelectorAll('.drag-word-chip');
        chips.forEach(chip => {
          chip.addEventListener('dragstart', (e) => {
            if (this.answered) return;
            activeDraggedChip = chip;
            chip.classList.add('dragging');
            if (e.dataTransfer) {
              e.dataTransfer.setData('text/plain', chip.id);
              e.dataTransfer.effectAllowed = 'move';
            }
          });

          chip.addEventListener('dragend', () => {
            chip.classList.remove('dragging');
            activeDraggedChip = null;
            dropZone.classList.remove('drag-over');
            slots.forEach(s => s.classList.remove('drag-over'));
            bankGrid.classList.remove('drag-over');
          });

          chip.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleChip(chip);
          });
        });

        // Dropzone container drop
        dropZone.addEventListener('dragover', (e) => {
          if (this.answered) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        });

        dropZone.addEventListener('drop', (e) => {
          if (this.answered) return;
          e.preventDefault();
          const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
          const chip = (id ? document.getElementById(id) : null) || activeDraggedChip || document.querySelector('.drag-word-chip.dragging');
          if (!chip) return;
          const targetSlot = e.target.closest('.word-slot') || dropZone.querySelector('.word-slot:not(.filled)') || slots[slots.length - 1];
          if (targetSlot) placeChipInSlot(chip, targetSlot);
        });

        // Bank Grid drop
        bankGrid.addEventListener('dragover', (e) => {
          if (this.answered) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          bankGrid.classList.add('drag-over');
        });

        bankGrid.addEventListener('dragleave', () => {
          bankGrid.classList.remove('drag-over');
        });

        bankGrid.addEventListener('drop', (e) => {
          if (this.answered) return;
          e.preventDefault();
          bankGrid.classList.remove('drag-over');
          const id = e.dataTransfer ? e.dataTransfer.getData('text/plain') : null;
          const chip = (id ? document.getElementById(id) : null) || activeDraggedChip || document.querySelector('.drag-word-chip.dragging');
          if (chip) {
            const sourceSlot = chip.closest('.word-slot');
            chip.classList.remove('placed');
            bankGrid.appendChild(chip);
            if (sourceSlot) sourceSlot.classList.remove('filled');
          }
        });

        // Submit
        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            if (this.answered) return;
            const emptySlots = slots.filter(s => !s.querySelector('.drag-word-chip'));
            if (emptySlots.length > 0) {
              emptySlots.forEach(s => {
                s.classList.add('error', 'shake');
                setTimeout(() => s.classList.remove('shake'), 400);
              });
              return;
            }
            const placed = slots.map(s => s.querySelector('.drag-word-chip')).filter(Boolean);
            const val = placed.map(c => c.dataset.word).join(' ');
            this.handleAnswer(val);
          });
        }
      }

      // Fill-in Submit
      const submitBtn = document.getElementById('standalone-submit-btn');
      const textInput = document.getElementById('standalone-input');
      const multiInputs = Array.from(document.querySelectorAll('.standalone-multi-input'));

      if (submitBtn && multiInputs.length > 1) {
        const onCheckMulti = () => {
          if (this.answered) return;
          let hasEmpty = false;
          multiInputs.forEach(inp => {
            if (!inp.value.trim()) {
              inp.focus();
              hasEmpty = true;
            }
          });
          if (hasEmpty) return;
          const userVals = multiInputs.map(inp => inp.value.trim());
          this.handleMultiAnswer(userVals);
        };
        submitBtn.addEventListener('click', onCheckMulti);
        multiInputs.forEach((inp, idx) => {
          inp.addEventListener('input', () => {
            if (multiInputs.length > 1 && inp.value.includes(' ')) {
              const words = inp.value.trim().split(/\s+/).filter(Boolean);
              if (words.length > 1) {
                words.forEach((w, wIdx) => {
                  const targetIdx = idx + wIdx;
                  if (targetIdx < multiInputs.length) {
                    multiInputs[targetIdx].value = w;
                  }
                });
                const nextIdx = Math.min(idx + words.length, multiInputs.length - 1);
                multiInputs[nextIdx].focus();
              }
            }
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.keyCode === 32) {
              if (idx < multiInputs.length - 1 && inp.value.trim().length > 0) {
                e.preventDefault();
                multiInputs[idx + 1].focus();
                return;
              }
            }
            if (e.key === 'Backspace' && idx > 0 && !inp.value) {
              multiInputs[idx - 1].focus();
            }
            if (e.key === 'Enter' || e.keyCode === 13) {
              e.preventDefault();
              e.stopPropagation();
              if (idx < multiInputs.length - 1) {
                multiInputs[idx + 1].focus();
              } else {
                onCheckMulti();
              }
            }
          });
        });
      } else if (submitBtn && textInput && (!this.quizData || this.quizData.type !== 'drag-and-drop')) {
        const onCheck = () => {
          if (this.answered) return;
          const val = textInput.value.trim();
          if (!val) {
            textInput.focus();
            return;
          }
          this.handleAnswer(val);
        };
        submitBtn.addEventListener('click', onCheck);
        textInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') onCheck();
        });
      }

      // Audio Play
      const audioBtn = document.getElementById('btn-audio-listen');
      if (audioBtn) {
        audioBtn.addEventListener('click', () => this.playAudio());
      }

      // Share Button
      const shareBtn = document.getElementById('btn-page-share');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => this.shareCurrentQuiz());
      }

      // Modal Close Button
      const modalCloseBtn = document.getElementById('modal-close-btn');
      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => this.closeReferralModal());
      }

      // Close modal on backdrop click
      const backdrop = document.getElementById('quiz-referral-modal');
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            this.closeReferralModal();
          }
        });
      }
    }

    playAudio() {
      if (!this.quizData) return;
      const q = this.quizData;
      const audioBtn = document.getElementById('btn-audio-listen');

      if (audioBtn) audioBtn.classList.add('playing');

      if (q.audio) {
        const audioSrc = `/lessons/${this.lessonId}/${q.audio}`;
        if (this.audioPlayer) {
          this.audioPlayer.pause();
        }
        this.audioPlayer = new Audio(audioSrc);
        this.audioPlayer.play().catch(() => this.playTTS(q.english));
        this.audioPlayer.onended = () => {
          if (audioBtn) audioBtn.classList.remove('playing');
        };
      } else {
        this.playTTS(q.english, () => {
          if (audioBtn) audioBtn.classList.remove('playing');
        });
      }
    }

    playTTS(text, onEnd) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Remove bracket contents or placeholder for clean spoken English
        const cleanSpoken = text.replace(/\[(.*?)\]/, '$1');
        const utterance = new SpeechSynthesisUtterance(cleanSpoken);
        utterance.lang = 'en-US';
        utterance.rate = 0.92;
        if (onEnd) utterance.onend = onEnd;
        window.speechSynthesis.speak(utterance);
      } else if (onEnd) {
        onEnd();
      }
    }

    normalizeText(str) {
      return (str || '')
        .toLowerCase()
        .replace(/['".,!?;:\-]/g, '')
        .trim();
    }

    handleMultiAnswer(userVals) {
      if (this.answered || !this.quizData) return;
      this.answered = true;

      const q = this.quizData;
      const bracketMatches = [...(q.english || '').matchAll(/\[(.*?)\]/g)].map(m => m[1].trim());
      const expectedAnswers = (q.blanks && q.blanks.length > 0)
        ? q.blanks
        : bracketMatches.flatMap(b => (b.includes(',') ? [b] : b.split(/\s+/).filter(Boolean)));

      let isCorrect = true;
      userVals.forEach((uVal, idx) => {
        const exp = expectedAnswers[idx] || '';
        if (this.normalizeText(uVal) !== this.normalizeText(exp)) {
          isCorrect = false;
        }
      });

      // Update slots
      expectedAnswers.forEach((ans, idx) => {
        const slot = document.getElementById(idx === 0 ? 'cloze-slot' : `cloze-slot-${idx}`);
        if (slot) {
          slot.textContent = ans;
          slot.style.color = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
          slot.style.borderBottomColor = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        }
      });

      // Disable inputs
      document.querySelectorAll('.standalone-multi-input').forEach(inp => inp.disabled = true);
      const submitBtn = document.getElementById('standalone-submit-btn');
      if (submitBtn) submitBtn.disabled = true;

      this.playAudio();

      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('quiz_answer', {
          lesson_id: this.lessonId,
          question_num: this.qNum,
          correct: isCorrect,
          answer: userVals.join(', ')
        });
      }

      setTimeout(() => {
        this.openReferralModal(isCorrect);
      }, 550);
    }

    handleAnswer(userAns, clickedBtn = null) {
      if (this.answered || !this.quizData) return;
      this.answered = true;

      const q = this.quizData;
      const correctAns = q.answer || (q.options && q.options[0]) || '';
      const isCorrect = this.normalizeText(userAns) === this.normalizeText(correctAns);

      // Visual updates on card
      const slot = document.getElementById('cloze-slot');
      if (slot) {
        slot.textContent = correctAns;
        slot.style.color = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
        slot.style.borderBottomColor = isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)';
      }

      // Button styles
      if (clickedBtn) {
        clickedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');
      }

      // Disable inputs / options
      document.querySelectorAll('.standalone-choice-btn').forEach(btn => btn.disabled = true);
      const textInput = document.getElementById('standalone-input');
      if (textInput) textInput.disabled = true;
      const submitBtn = document.getElementById('standalone-submit-btn');
      if (submitBtn) submitBtn.disabled = true;

      // Word bank chips
      document.querySelectorAll('.drag-word-chip').forEach(chip => {
        chip.disabled = true;
        chip.setAttribute('draggable', 'false');
      });

      // Play audio on answer
      this.playAudio();

      if (typeof Analytics !== 'undefined') {
        Analytics.trackEvent('quiz_answer', {
          lesson_id: this.lessonId,
          question_num: this.qNum,
          correct: isCorrect ? 1 : 0
        });
      }

      // Show Post-Answer Referral Modal after a small delay
      setTimeout(() => {
        this.openReferralModal(isCorrect);
      }, 550);
    }

    openReferralModal(isCorrect) {
      const modal = document.getElementById('quiz-referral-modal');
      if (!modal || !this.quizData) return;

      const q = this.quizData;

      // Full sentence with highlight for all blanks
      let fullSentenceHtml = (q.english || '').replace(
        /\[(.*?)\]/g,
        (match, p1) => `<mark>${this.escapeHtml(p1.trim())}</mark>`
      );

      // Result Badge & Subtext
      const headerEl = document.getElementById('modal-result-header');
      if (headerEl) {
        headerEl.innerHTML = isCorrect
          ? `
            <div class="result-badge correct">🎉 정답입니다!</div>
            <div class="modal-result-subtext">원어민이 실생활에서 즐겨 쓰는 생생한 표현이에요!</div>
          `
          : `
            <div class="result-badge incorrect">💡 아쉬워요!</div>
            <div class="modal-result-subtext">정답 표현을 확인하고 원어민 영상에서 복습해보세요.</div>
          `;
      }

      // Sentence Details
      const sentenceCard = document.getElementById('modal-sentence-card');
      if (sentenceCard) {
        sentenceCard.innerHTML = `
          <div class="modal-sentence-en">${fullSentenceHtml}</div>
          <div class="modal-sentence-ko">${this.escapeHtml(q.korean)}</div>
        `;
      }

      // Explanation
      const expCard = document.getElementById('modal-exp-card');
      if (expCard) {
        if (q.explanation) {
          expCard.style.display = 'block';
          expCard.innerHTML = `
            <div class="modal-exp-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>해설 및 뉘앙스</span>
            </div>
            <div class="modal-exp-text">${this.escapeHtml(q.explanation)}</div>
          `;
        } else {
          expCard.style.display = 'none';
        }
      }

      // Action Button: EXACTLY ONE Action button as strictly specified by user
      const fullLessonBtn = document.getElementById('btn-full-lesson');
      if (fullLessonBtn) {
        fullLessonBtn.href = `/lessons/${this.lessonId}/index.html`;
        fullLessonBtn.textContent = '🚀 전체 레슨 바로 학습하기';
        fullLessonBtn.onclick = () => {
          if (typeof Analytics !== 'undefined') {
            Analytics.trackEvent('quiz_referral_click', {
              lesson_id: this.lessonId,
              question_num: this.qNum
            });
          }
        };
      }

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }

    closeReferralModal() {
      const modal = document.getElementById('quiz-referral-modal');
      if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    }

    shareCurrentQuiz() {
      const shareUrl = window.location.href;
      const title = this.quizData
        ? `[현서네 리얼 영어] "${this.quizData.korean}" 영어 퀴즈`
        : '현서네 리얼 영어 퀴즈';
      const text = '현서네 리얼 영어 실생활 영어 퀴즈에 도전해보세요!';

      if (typeof Analytics !== 'undefined' && typeof Analytics.trackQuizShare === 'function') {
        Analytics.trackQuizShare(this.lessonId, this.qNum);
      }

      const shareBtn = document.getElementById('btn-page-share');
      const setButtonFeedback = () => {
        if (!shareBtn) return;
        shareBtn.classList.add('copied');
        const span = shareBtn.querySelector('span');
        const origText = span ? span.textContent : '';
        if (span) span.textContent = '복사됨! ✓';
        setTimeout(() => {
          shareBtn.classList.remove('copied');
          if (span) span.textContent = origText || '공유하기';
        }, 1600);
      };

      const copyFallback = () => {
        let copied = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).then(() => {
            setButtonFeedback();
            this.showToast('퀴즈 링크가 복사되었습니다!');
          }).catch(() => {
            fallbackTextarea();
          });
        } else {
          fallbackTextarea();
        }

        function fallbackTextarea() {
          try {
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            copied = document.execCommand('copy');
            textArea.remove();
          } catch (_) {}

          if (copied) {
            setButtonFeedback();
            this.showToast('퀴즈 링크가 복사되었습니다!');
          } else {
            prompt('퀴즈 공유 링크를 복사하세요:', shareUrl);
          }
        }
      };

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
      if (isMobile && navigator.share) {
        navigator.share({
          title,
          text,
          url: shareUrl,
        }).then(() => {
          setButtonFeedback();
        }).catch((err) => {
          if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
            return;
          }
          copyFallback();
        });
      } else {
        copyFallback();
      }
    }

    showToast(message) {
      const existing = document.querySelector('.save-toast-notification');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'save-toast-notification';
      toast.innerHTML = `
        <div class="toast-icon success">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div class="toast-content">
          <div class="toast-title" style="font-weight: 600; font-size: 0.92rem; color: var(--text-main);">${message}</div>
        </div>
      `;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 350);
      }, 2200);
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    shuffleArray(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new QuizShareRunner());
  } else {
    new QuizShareRunner();
  }
})();
