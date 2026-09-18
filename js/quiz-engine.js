/**
 * Quiz Engine for RhyRhy English
 * Manages quiz state, hints, skips, animations, audio playback, and gating.
 */
class QuizEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    this.lessonId = options.lessonId;
    this.originalQuizzes = (options.quizzes || []).map((q, idx) => ({
      ...q,
      _origIndex: typeof q._origIndex === 'number' ? q._origIndex : idx
    }));
    this.quizzes = [...this.originalQuizzes];
    this.onComplete = options.onComplete || (() => { });
    this.onProgressChange = options.onProgressChange || (() => { });
    this.onStartVideo = options.onStartVideo || null;

    this.currentIndex = 0;
    this.questionFailed = false;
    this.state = Storage.getProgress(this.lessonId);
    this.state.questionResults = this.state.questionResults || {};
    this.audioElement = null;
    this.speechSynth = window.speechSynthesis || null;

    if (this.state && typeof this.state.currentQuestionIndex === 'number') {
      this.currentIndex = Math.min(this.state.currentQuestionIndex, Math.max(0, this.quizzes.length - 1));
    }
  }

  init() {
    if (!this.container) {
      console.error('Quiz container not found');
      return;
    }

    // Check if quizzes were already completed previously
    if (this.state.completed) {
      this.renderCompletedState();
      this.onComplete({ alreadyCompleted: true });
      return;
    }

    this.renderCurrentQuestion();
  }

  getCurrentQuestion() {
    return this.quizzes[this.currentIndex];
  }

  renderCurrentQuestion() {
    this.questionFailed = false;
    const q = this.getCurrentQuestion();
    if (!q) {
      this.completeAll();
      return;
    }

    const total = this.quizzes.length;
    const currentNum = this.currentIndex + 1;
    const progressPercent = Math.round(((currentNum - 1) / total) * 100);

    let contentHtml = '';

    if (q.type === 'fill-in-the-blank') {
      contentHtml = this._renderFillInTheBlank(q);
    } else if (q.type === 'multiple-choice') {
      contentHtml = this._renderMultipleChoice(q);
    } else if (q.type === 'listening') {
      contentHtml = this._renderListening(q);
    } else if (q.type === 'drag-and-drop') {
      contentHtml = this._renderDragAndDrop(q);
    }

    this.container.innerHTML = `
      <div class="quiz-card" role="region" aria-label="Lesson Quiz Question">
        <div class="quiz-header">
          <div class="quiz-step-info">
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <span class="quiz-badge">Quiz ${currentNum} of ${total}</span>
              <span class="quiz-type-tag">${this._getTypeBadge(q.type)}</span>
            </div>
            <button type="button" class="quiz-share-btn" id="quiz-share-btn" aria-label="이 퀴즈 공유하기" title="이 문제 링크 공유하기">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span>공유하기</span>
            </button>
          </div>
          <div class="quiz-progress-track" aria-hidden="true">
            <div class="quiz-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <div class="quiz-prompt-card">
          <div class="quiz-korean-sentence">${this._escapeHtml(q.korean)}</div>
        </div>

        <div class="quiz-body">
          ${contentHtml}
        </div>

        <div class="quiz-feedback" id="quiz-feedback" aria-live="polite"></div>

        <div class="quiz-actions" id="quiz-actions">
          ${this._renderActionButtons(q)}
        </div>
      </div>
    `;

    this._bindEvents(q, currentNum);

    // Ensure page scrolls to top when moving to a new quiz
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  _getTypeBadge(type) {
    if (type === 'multiple-choice') return '객관식 퀴즈';
    if (type === 'listening') return '리스닝 퀴즈';
    if (type === 'drag-and-drop') return '단어 배열 퀴즈';
    return '빈칸 채우기';
  }

  _renderFillInTheBlank(q) {
    // Replace the slot with an interactive input
    const parts = q.english.split(/\[.*?\]/);
    const beforeText = parts[0] || '';
    const afterText = parts[1] || '';

    return `
      <div class="sentence-builder-box">
        <span class="sentence-text">${this._escapeHtml(beforeText)}</span>
        <span class="blank-input-wrapper">
          <input 
            type="text" 
            id="quiz-blank-input" 
            class="quiz-input" 
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="none" 
            spellcheck="false" 
            placeholder="정답을 입력하세요..."
            aria-label="Missing word"
          />
        </span>
        <span class="sentence-text">${this._escapeHtml(afterText)}</span>
      </div>
      <div class="quiz-hint-box" id="quiz-hint-box" style="display: none;"></div>
    `;
  }

  _renderMultipleChoice(q) {
    const parts = q.english.split(/\[.*?\]/);
    const beforeText = parts[0] || '';
    const afterText = parts[1] || '';

    // Randomize option order so the correct answer is not always the first option (Option A)
    if (!q._shuffledOptions) {
      q._shuffledOptions = this._shuffleArray(q.options || []);
    }
    const displayOptions = q._shuffledOptions;

    const optionsHtml = displayOptions.map((opt, idx) => `
      <button 
        type="button" 
        class="choice-btn" 
        data-option="${this._escapeHtml(opt)}" 
        data-index="${idx}"
      >
        <span class="choice-marker">${String.fromCharCode(65 + idx)}</span>
        <span class="choice-label">${this._escapeHtml(opt)}</span>
      </button>
    `).join('');

    return `
      <div class="sentence-builder-box">
        <span class="sentence-text">${this._escapeHtml(beforeText)}</span>
        <span class="choice-slot-preview" id="choice-slot-preview">[ 아래에서 알맞은 표현을 선택하세요 ]</span>
        <span class="sentence-text">${this._escapeHtml(afterText)}</span>
      </div>
      <div class="multiple-choice-grid" role="group" aria-label="Answer options">
        ${optionsHtml}
      </div>
    `;
  }

  _renderDragAndDrop(q) {
    const parts = q.english.split(/\[.*?\]/);
    const beforeText = parts[0] || '';
    const afterText = parts[1] || '';

    // Initialize and shuffle tokens if not already prepared
    if (!q._shuffledTokens) {
      let tokens = [...(q.tokens || (q.options && q.options.length > 0 ? q.options : (q.answer ? q.answer.split(/\s+/) : [])))];
      let shuffled = this._shuffleArray(tokens);
      if (tokens.length > 1 && shuffled.join(' ') === tokens.join(' ')) {
        shuffled = [shuffled[shuffled.length - 1], ...shuffled.slice(0, shuffled.length - 1)];
      }
      q._shuffledTokens = shuffled;
    }

    const bankHtml = q._shuffledTokens.map((tok, idx) => `
      <button 
        type="button" 
        class="drag-word-chip" 
        draggable="true" 
        data-word="${this._escapeHtml(tok)}" 
        data-token-id="chip-token-${idx}"
        id="chip-token-${idx}"
        aria-label="단어 ${this._escapeHtml(tok)}"
      >
        <span class="drag-handle" aria-hidden="true">⠿</span>
        <span class="chip-text">${this._escapeHtml(tok)}</span>
      </button>
    `).join('');

    return `
      <div class="sentence-builder-box">
        <span class="sentence-text">${this._escapeHtml(beforeText)}</span>
        <div class="word-drop-zone" id="word-drop-zone" role="region" aria-label="단어 배치 영역">
          <span class="word-drop-placeholder" id="word-drop-placeholder">단어를 끌어다 놓거나 탭하여 순서대로 완성하세요</span>
        </div>
        <span class="sentence-text">${this._escapeHtml(afterText)}</span>
      </div>

      <div class="word-bank-wrapper">
        <div class="word-bank-header">
          <span class="word-bank-title">🔤 단어들을 올바른 순서로 끌어다 놓거나 탭하세요</span>
          <button type="button" class="word-reset-btn" id="word-reset-btn" title="모든 단어 초기화">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span>초기화</span>
          </button>
        </div>
        <div class="word-bank-grid" id="word-bank-grid" role="group" aria-label="단어 보관함">
          ${bankHtml}
        </div>
      </div>
      <div class="quiz-hint-box" id="quiz-hint-box" style="display: none;"></div>
    `;
  }

  _renderListening(q) {
    const parts = q.english.split(/\[.*?\]/);
    const beforeText = parts[0] || '';
    const afterText = parts[1] || '';

    return `
      <div class="listening-control-box">
        <button type="button" class="speaker-play-btn" id="speaker-play-btn" aria-label="음성 듣기">
          <svg class="speaker-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          <span class="speaker-btn-text">탭하여 듣기</span>
          <span class="audio-waves" aria-hidden="true">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </span>
        </button>
        <p class="listening-instructions">원어민 발음을 잘 듣고 빈칸에 들어갈 알맞은 단어/표현을 적어보세요.</p>
      </div>

      <div class="sentence-builder-box">
        <span class="sentence-text">${this._escapeHtml(beforeText)}</span>
        <span class="blank-input-wrapper">
          <input 
            type="text" 
            id="quiz-blank-input" 
            class="quiz-input" 
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="none" 
            spellcheck="false" 
            placeholder="발음을 듣고 정답을 입력하세요..."
            aria-label="Missing word from audio"
          />
        </span>
        <span class="sentence-text">${this._escapeHtml(afterText)}</span>
      </div>
      <div class="quiz-hint-box" id="quiz-hint-box" style="display: none;"></div>
    `;
  }

  _renderActionButtons(q) {
    if (q.type === 'multiple-choice') {
      return `
        <div class="actions-row">
          <div class="sub-hint-text">알맞은 보기를 선택하면 다음 문제로 넘어갑니다</div>
        </div>
      `;
    }

    return `
      <div class="actions-row">
        <div class="actions-left">
          <button type="button" class="btn btn-secondary btn-hint" id="btn-hint" title="철자 힌트 보기">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18h6m-4 3h2a9 9 0 1 1 6-6c0 2.5-2 3.5-2 5"/>
            </svg>
            힌트
          </button>
          <button type="button" class="btn btn-secondary btn-skip" id="btn-skip" title="정답 확인 후 넘어가기">
            건너뛰기
          </button>
        </div>
        <div class="actions-right">
          <button type="button" class="btn btn-primary btn-check" id="btn-check">
            정답 확인
          </button>
        </div>
      </div>
    `;
  }

  _bindEvents(q, currentNum) {
    const qNum = typeof currentNum === 'number' ? currentNum : (typeof q._origIndex === 'number' ? q._origIndex + 1 : this.currentIndex + 1);
    const input = this.container.querySelector('#quiz-blank-input');
    const hintBtn = this.container.querySelector('#btn-hint');
    const skipBtn = this.container.querySelector('#btn-skip');
    const checkBtn = this.container.querySelector('#btn-check');
    const hintBox = this.container.querySelector('#quiz-hint-box');
    const feedbackBox = this.container.querySelector('#quiz-feedback');

    // Focus input on load for desktop/tablet convenience without forcing viewport scroll
    if (input && window.innerWidth > 640) {
      setTimeout(() => {
        try {
          input.focus({ preventScroll: true });
        } catch (_) { }
      }, 150);
    }

    // Fill-in & Listening: Enter key submission
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          e.stopPropagation();
          input.blur();
          // Defer checking slightly so the virtual keyboard dismissal and Enter event cycle finish completely
          setTimeout(() => {
            this._handleCheck(q);
          }, 80);
        }
      });
    }

    // Check button click
    if (checkBtn) {
      checkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (input) input.blur();
        this._handleCheck(q);
      });
    }

    // Hint button click
    if (hintBtn && hintBox) {
      hintBtn.addEventListener('click', () => {
        hintBox.style.display = 'block';
        hintBox.innerHTML = `
          <div class="hint-content">
            <span class="hint-label">💡 힌트:</span>
            ${this._renderHintHtml(q)}
          </div>
        `;
        if (input) input.focus();
      });
    }

    // Skip button click
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this._handleSkip(q);
      });
    }

    // Multiple Choice buttons
    if (q.type === 'multiple-choice') {
      const choiceButtons = this.container.querySelectorAll('.choice-btn');
      choiceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = btn.dataset.option;
          this._handleChoiceSelect(btn, selected, q);
        });
      });
    }

    // Quiz share button click
    const shareBtn = this.container.querySelector('#quiz-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._shareQuiz(q, qNum);
      });
    }

    // Listening speaker button
    if (q.type === 'listening') {
      const speakerBtn = this.container.querySelector('#speaker-play-btn');
      if (speakerBtn) {
        speakerBtn.addEventListener('click', () => {
          this.playAudio(q.audio, q.english.replace(/\[|\]/g, ''));
        });
      }
    }

    // Drag-and-Drop Word Reorder bindings
    if (q.type === 'drag-and-drop') {
      this._bindDragAndDropEvents(q);
    }
  }

  _bindDragAndDropEvents(q) {
    const dropZone = this.container.querySelector('#word-drop-zone');
    const bankGrid = this.container.querySelector('#word-bank-grid');
    const resetBtn = this.container.querySelector('#word-reset-btn');
    if (!dropZone || !bankGrid) return;

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const chips = Array.from(dropZone.querySelectorAll('.drag-word-chip'));
        chips.forEach(chip => {
          chip.classList.remove('placed');
          bankGrid.appendChild(chip);
        });
        this._updateDropZonePlaceholder(dropZone);
      });
    }

    // Chips events (HTML5 Drag, Touch, Tap)
    const chips = this.container.querySelectorAll('.drag-word-chip');
    chips.forEach(chip => {
      chip.addEventListener('dragstart', (e) => {
        chip.classList.add('dragging');
        e.dataTransfer.setData('text/plain', chip.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      chip.addEventListener('dragend', () => {
        chip.classList.remove('dragging');
        dropZone.classList.remove('drag-over');
        bankGrid.classList.remove('drag-over');
        this._updateDropZonePlaceholder(dropZone);
      });

      // Tap to place / return
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        this._toggleChipLocation(chip, dropZone, bankGrid);
      });

      // Touch Drag handling for mobile/tablet
      let touchStartX = 0;
      let touchStartY = 0;
      let isTouchDragging = false;
      let touchGhost = null;

      chip.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isTouchDragging = false;
      }, { passive: true });

      chip.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        const curX = e.touches[0].clientX;
        const curY = e.touches[0].clientY;
        const dist = Math.hypot(curX - touchStartX, curY - touchStartY);

        if (!isTouchDragging && dist > 8) {
          isTouchDragging = true;
          chip.classList.add('dragging');
          touchGhost = document.createElement('div');
          touchGhost.className = 'drag-touch-ghost';
          touchGhost.textContent = chip.dataset.word;
          document.body.appendChild(touchGhost);
        }

        if (isTouchDragging && touchGhost) {
          e.preventDefault();
          touchGhost.style.left = `${curX}px`;
          touchGhost.style.top = `${curY}px`;

          const elemBelow = document.elementFromPoint(curX, curY);
          const overDrop = elemBelow && (elemBelow.closest('#word-drop-zone') || elemBelow === dropZone);
          const overBank = elemBelow && (elemBelow.closest('#word-bank-grid') || elemBelow === bankGrid);

          dropZone.classList.toggle('drag-over', !!overDrop);
          bankGrid.classList.toggle('drag-over', !!overBank);
        }
      }, { passive: false });

      chip.addEventListener('touchend', (e) => {
        if (isTouchDragging) {
          chip.classList.remove('dragging');
          if (touchGhost && touchGhost.parentNode) {
            touchGhost.parentNode.removeChild(touchGhost);
            touchGhost = null;
          }
          dropZone.classList.remove('drag-over');
          bankGrid.classList.remove('drag-over');

          const touch = e.changedTouches[0];
          const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
          const targetDrop = elemBelow && (elemBelow.closest('#word-drop-zone') || elemBelow === dropZone);
          const targetBank = elemBelow && (elemBelow.closest('#word-bank-grid') || elemBelow === bankGrid);

          if (targetDrop) {
            const afterElement = this._getDragAfterElement(dropZone, touch.clientX);
            if (!afterElement) {
              dropZone.appendChild(chip);
            } else {
              dropZone.insertBefore(chip, afterElement);
            }
            chip.classList.add('placed');
          } else if (targetBank) {
            chip.classList.remove('placed');
            bankGrid.appendChild(chip);
          }
          this._updateDropZonePlaceholder(dropZone);
        }
        isTouchDragging = false;
      });
    });

    // Dropzone Drag Events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      dropZone.classList.add('drag-over');
      const afterElement = this._getDragAfterElement(dropZone, e.clientX);
      const draggingChip = this.container.querySelector('.drag-word-chip.dragging');
      if (draggingChip) {
        if (!afterElement) {
          dropZone.appendChild(draggingChip);
        } else {
          dropZone.insertBefore(draggingChip, afterElement);
        }
      }
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const chip = document.getElementById(id);
      if (chip) {
        chip.classList.add('placed');
        const afterElement = this._getDragAfterElement(dropZone, e.clientX);
        if (!afterElement) {
          dropZone.appendChild(chip);
        } else {
          dropZone.insertBefore(chip, afterElement);
        }
      }
      this._updateDropZonePlaceholder(dropZone);
    });

    // Word Bank Drag Events
    bankGrid.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      bankGrid.classList.add('drag-over');
    });

    bankGrid.addEventListener('dragleave', () => {
      bankGrid.classList.remove('drag-over');
    });

    bankGrid.addEventListener('drop', (e) => {
      e.preventDefault();
      bankGrid.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const chip = document.getElementById(id);
      if (chip) {
        chip.classList.remove('placed');
        bankGrid.appendChild(chip);
      }
      this._updateDropZonePlaceholder(dropZone);
    });
  }

  _toggleChipLocation(chip, dropZone, bankGrid) {
    if (chip.disabled) return;
    if (dropZone.contains(chip)) {
      chip.classList.remove('placed');
      bankGrid.appendChild(chip);
    } else {
      chip.classList.add('placed');
      dropZone.appendChild(chip);
    }
    this._updateDropZonePlaceholder(dropZone);
  }

  _updateDropZonePlaceholder(dropZone) {
    if (!dropZone) return;
    const placeholder = dropZone.querySelector('#word-drop-placeholder');
    const chips = dropZone.querySelectorAll('.drag-word-chip');
    if (placeholder) {
      placeholder.style.display = chips.length === 0 ? '' : 'none';
    }
  }

  _getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll('.drag-word-chip:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  _shareQuiz(q, questionNum) {
    const qNum = typeof questionNum === 'number' ? questionNum : (typeof q._origIndex === 'number' ? q._origIndex + 1 : this.currentIndex + 1);
    const origin = window.location.origin || 'https://rhyrhyenglish.site';
    const shareUrl = `${origin}/quiz/${this.lessonId}/q${qNum}.html`;
    const title = `[현서네 리얼 영어] Quiz ${qNum} - "${q.korean}"`;
    const text = '원어민 실생활 영어 퀴즈에 도전해보세요!';

    if (typeof Analytics !== 'undefined' && typeof Analytics.trackQuizShare === 'function') {
      Analytics.trackQuizShare(this.lessonId, qNum);
    }

    const shareBtn = this.container.querySelector('#quiz-share-btn');
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
          if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
            App.showToast('📋 퀴즈 공유 링크가 복사되었습니다!', 'success');
          }
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
          if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
            App.showToast('📋 퀴즈 공유 링크가 복사되었습니다!', 'success');
          }
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
        url: shareUrl
      }).then(() => {
        setButtonFeedback();
      }).catch((err) => {
        // Only skip fallback if the user cancelled the system share sheet
        if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
          return;
        }
        copyFallback();
      });
    } else {
      copyFallback();
    }
  }

  playAudio(audioPath, fallbackText = '') {
    const speakerBtn = this.container.querySelector('#speaker-play-btn');
    if (speakerBtn) speakerBtn.classList.add('playing');

    const donePlaying = () => {
      if (speakerBtn) speakerBtn.classList.remove('playing');
    };

    // Try HTML5 Audio with relative path
    if (audioPath) {
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      }
      try {
        const encoded = encodeURI(audioPath);
        this.audioElement = new Audio(encoded);
        this.audioElement.play()
          .then(() => {
            this.audioElement.onended = donePlaying;
          })
          .catch(err => {
            console.warn('Audio file play failed, falling back to speech synth:', err);
            this._playSpeechSynthesis(fallbackText, donePlaying);
          });
        return;
      } catch (e) {
        console.warn('Audio element error:', e);
      }
    }

    // Fallback: SpeechSynthesis
    this._playSpeechSynthesis(fallbackText, donePlaying);
  }

  _playSpeechSynthesis(text, onEnd) {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(onEnd, 1200);
    }
  }

  _recordResult(indexOrQuiz, isCorrect) {
    if (!this.state.questionResults) {
      this.state.questionResults = {};
    }
    let targetIndex = this.currentIndex;
    if (typeof indexOrQuiz === 'object' && indexOrQuiz !== null) {
      if (typeof indexOrQuiz._origIndex === 'number') {
        targetIndex = indexOrQuiz._origIndex;
      } else if (Array.isArray(this.originalQuizzes)) {
        const found = this.originalQuizzes.findIndex(oq => oq === indexOrQuiz || (oq.korean === indexOrQuiz.korean && oq.answer === indexOrQuiz.answer));
        if (found !== -1) targetIndex = found;
      }
    } else if (typeof indexOrQuiz === 'number') {
      const q = this.quizzes[indexOrQuiz];
      if (q && typeof q._origIndex === 'number') {
        targetIndex = q._origIndex;
      } else {
        targetIndex = indexOrQuiz;
      }
    }
    this.state.questionResults[targetIndex] = !!isCorrect;
    Storage.saveProgress(this.lessonId, this.state);
  }

  _handleCheck(q) {
    if (q.type === 'drag-and-drop') {
      const dropZone = this.container.querySelector('#word-drop-zone');
      const feedbackBox = this.container.querySelector('#quiz-feedback');
      if (!dropZone) return;

      const placedChips = Array.from(dropZone.querySelectorAll('.drag-word-chip'));
      if (placedChips.length === 0) {
        dropZone.classList.add('shake');
        setTimeout(() => dropZone.classList.remove('shake'), 500);
        if (feedbackBox) {
          feedbackBox.className = 'quiz-feedback error';
          feedbackBox.innerHTML = `
            <div class="feedback-inner">
              <div class="feedback-status-line">
                <span>단어를 먼저 올바른 순서로 끌어다 놓거나 탭해주세요!</span>
              </div>
            </div>
          `;
        }
        return;
      }

      const userSentence = placedChips.map(c => c.dataset.word).join(' ');
      const isCorrect = MarkdownQuizParser.checkAnswer(userSentence, q.answer);

      if (isCorrect) {
        dropZone.classList.add('correct');
        placedChips.forEach(c => {
          c.setAttribute('draggable', 'false');
          c.disabled = true;
        });
        const passedFirstAttempt = !this.questionFailed;
        this._recordResult(q, passedFirstAttempt);
        this._showNextStep(q, passedFirstAttempt, false);
      } else {
        this.questionFailed = true;
        dropZone.classList.add('shake', 'error');
        if (feedbackBox) {
          feedbackBox.className = 'quiz-feedback error';
          feedbackBox.innerHTML = `
            <div class="feedback-inner">
              <div class="feedback-status-line">
                <span>아쉽네요, 단어 순서를 다시 확인해보세요! (첫 시도 실패로 채점됩니다. 도움이 필요하면 💡 힌트를 눌러보세요)</span>
              </div>
            </div>
          `;
        }
        setTimeout(() => {
          dropZone.classList.remove('shake');
        }, 500);
      }
      return;
    }

    const input = this.container.querySelector('#quiz-blank-input');
    const feedbackBox = this.container.querySelector('#quiz-feedback');
    if (!input) return;

    const val = input.value.trim();
    if (!val) {
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
      return;
    }

    const isCorrect = MarkdownQuizParser.checkAnswer(val, q.answer);

    if (isCorrect) {
      input.classList.add('correct');
      input.disabled = true;
      const passedFirstAttempt = !this.questionFailed;
      this._recordResult(q, passedFirstAttempt);
      this._showNextStep(q, passedFirstAttempt, false);
    } else {
      this.questionFailed = true;
      input.classList.add('shake', 'error');
      feedbackBox.className = 'quiz-feedback error';
      feedbackBox.innerHTML = `
        <div class="feedback-inner">
          <div class="feedback-status-line">
            <span>아쉽네요, 다시 한 번 도전해보세요! (첫 시도 실패로 채점됩니다. 도움이 필요하면 💡 힌트를 눌러보세요)</span>
          </div>
        </div>
      `;
      setTimeout(() => {
        input.classList.remove('shake');
      }, 500);
    }
  }

  _handleSkip(q) {
    if (q.type === 'drag-and-drop') {
      const dropZone = this.container.querySelector('#word-drop-zone');
      const bankGrid = this.container.querySelector('#word-bank-grid');
      if (dropZone && bankGrid) {
        const allChips = Array.from(this.container.querySelectorAll('.drag-word-chip'));
        const chipMap = new Map();
        allChips.forEach(c => chipMap.set(c.dataset.word, c));

        const tokens = q.tokens || (q.answer ? q.answer.split(/\s+/) : []);
        tokens.forEach(tok => {
          const chip = chipMap.get(tok) || allChips.find(c => c.dataset.word.toLowerCase() === tok.toLowerCase() && !dropZone.contains(c));
          if (chip) {
            dropZone.appendChild(chip);
            chip.classList.add('placed');
            chip.setAttribute('draggable', 'false');
            chip.disabled = true;
          }
        });
        dropZone.classList.add('correct');
        this._updateDropZonePlaceholder(dropZone);
      }

      this.questionFailed = true;
      this._recordResult(q, false);
      this._showNextStep(q, false, true);
      return;
    }

    const input = this.container.querySelector('#quiz-blank-input');
    if (input) {
      input.value = q.answer;
      input.classList.add('correct');
      input.disabled = true;
    }

    this.questionFailed = true;
    this._recordResult(q, false);
    this._showNextStep(q, false, true);
  }

  _handleChoiceSelect(btn, selectedOption, q) {
    const preview = this.container.querySelector('#choice-slot-preview');
    const feedbackBox = this.container.querySelector('#quiz-feedback');
    const isCorrect = MarkdownQuizParser.checkAnswer(selectedOption, q.answer);

    if (isCorrect) {
      btn.classList.add('correct');
      if (preview) {
        preview.textContent = selectedOption;
        preview.classList.add('filled');
      }

      // Disable all choices
      const allBtns = this.container.querySelectorAll('.choice-btn');
      allBtns.forEach(b => b.disabled = true);

      // Multiple choice is failed if user could not make right choice at first!
      const passedFirstAttempt = !this.questionFailed;
      this._recordResult(q, passedFirstAttempt);
      this._showNextStep(q, passedFirstAttempt, false);
    } else {
      // Mark as failed at first attempt!
      this.questionFailed = true;
      btn.classList.add('shake', 'fade-out', 'disabled');
      btn.disabled = true;

      feedbackBox.className = 'quiz-feedback error';
      feedbackBox.innerHTML = `
        <div class="feedback-inner">
          <div class="feedback-status-line">
            <span>"${this._escapeHtml(selectedOption)}"은(는) 오답입니다. (첫 시도 실패로 채점됩니다) 다른 보기를 선택해보세요!</span>
          </div>
        </div>
      `;

      setTimeout(() => {
        btn.classList.remove('shake');
      }, 500);
    }
  }

  _showNextStep(q, isCorrect, isSkipped = false) {
    const isLast = this.currentIndex >= this.quizzes.length - 1;

    const feedbackBox = this.container.querySelector('#quiz-feedback');
    const actionsBox = this.container.querySelector('#quiz-actions');

    // 1. Render comprehensive feedback with answer and explanation
    if (feedbackBox) {
      feedbackBox.className = `quiz-feedback ${isCorrect ? 'success' : 'skip-info'}`;
      let statusText = '정답입니다! 🎉';
      if (isSkipped) {
        statusText = '정답을 확인하세요 💡 (건너뜀)';
      } else if (!isCorrect) {
        statusText = '정답을 맞혔습니다! (첫 시도 실패로 기록됨)';
      }

      feedbackBox.innerHTML = `
        <div class="feedback-inner">
          <div class="feedback-status-line">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5">
              ${isCorrect ? '<polyline points="20 6 9 17 4 12"/>' : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'}
            </svg>
            <span>${statusText}</span>
            <span style="margin-left: auto; font-size: 0.9rem; font-weight: 600; opacity: 0.95;">정답: <strong>${this._escapeHtml(q.answer)}</strong></span>
          </div>
          ${q.explanation ? `
            <div class="feedback-explanation-box">
              <span class="explanation-title">💡 학습 팁 & 해설</span>
              <p class="explanation-text">${this._escapeHtml(q.explanation)}</p>
            </div>
          ` : ''}
        </div>
      `;
    }

    // 2. Render prominent next-question button or view result button
    if (actionsBox) {
      const nextBtnLabel = isLast ? '🎉 퀴즈 결과 확인하기' : '다음 문제로 이동';
      actionsBox.innerHTML = `
        <div class="actions-row actions-next-step" style="width: 100%;">
          <button type="button" class="btn btn-primary btn-next-question" id="btn-next-question">
            <span>${nextBtnLabel}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      `;

      const nextBtn = actionsBox.querySelector('#btn-next-question');
      if (nextBtn) {
        // Prevent any trailing virtual keyboard Enter key or touch bounce from advancing automatically
        let canAdvance = false;
        setTimeout(() => {
          canAdvance = true;
        }, 400);

        nextBtn.addEventListener('click', (e) => {
          if (!canAdvance) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          if (isLast) {
            this.completeAll();
          } else {
            this.nextQuestion();
          }
        });
      }
    }

    // Smoothly ensure result and explanation are visible so mobile user can review before manually clicking next
    if (feedbackBox) {
      setTimeout(() => {
        try {
          feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (_) { }
      }, 100);
    }
  }

  _disableActions() {
    const buttons = this.container.querySelectorAll('.btn');
    buttons.forEach(b => b.disabled = true);
  }

  nextQuestion() {
    this.currentIndex++;

    // Save progress to localStorage
    this.state.currentQuestionIndex = this.currentIndex;
    Storage.saveProgress(this.lessonId, this.state);
    this.onProgressChange(this.currentIndex, this.quizzes.length);

    if (this.currentIndex >= this.quizzes.length) {
      this.completeAll();
    } else {
      this.renderCurrentQuestion();
    }
  }

  completeAll() {
    this.state.completed = true;
    this.state.currentQuestionIndex = this.quizzes.length;
    Storage.saveProgress(this.lessonId, this.state);
    Storage.completeQuizzes(this.lessonId);

    this.renderCompletedState();
    this.onComplete({ alreadyCompleted: false });
  }

  renderCompletedState() {
    // Dismiss any active celebration overlay to ensure smooth interaction
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    const masterQuizzes = (this.originalQuizzes && this.originalQuizzes.length > 0)
      ? this.originalQuizzes
      : this.quizzes;
    const total = masterQuizzes.length;
    const results = this.state.questionResults || {};
    let correctCount = 0;
    const failedQuizzes = [];

    masterQuizzes.forEach((q, idx) => {
      const qIndex = typeof q._origIndex === 'number' ? q._origIndex : idx;
      if (results[qIndex] === true) {
        correctCount++;
      } else {
        failedQuizzes.push(q);
      }
    });

    // Fallback if completed previously without detailed results
    if (Object.keys(results).length === 0 && this.state.completed) {
      correctCount = total;
      failedQuizzes.length = 0;
    }

    const wrongCount = failedQuizzes.length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 100;

    let scoreTitle = '모든 퀴즈 완료! 🎓';
    let scoreDesc = '이번 레슨의 핵심 어휘와 표현 퀴즈를 모두 마쳤습니다.';
    if (percent === 100) {
      scoreTitle = '완벽합니다! 100점 만점! 🏆';
      scoreDesc = '모든 문제를 완벽하게 맞히셨습니다! 대단해요!';
    } else if (percent >= 80) {
      scoreTitle = '훌륭한 성적입니다! 🌟';
      scoreDesc = '대부분의 핵심 표현을 잘 맞히셨습니다!';
    } else {
      scoreTitle = '퀴즈 완료! 다시 도전해보세요! 💪';
      scoreDesc = '틀린 문제를 다시 복습하여 100점에 도전해보세요!';
    }

    let actionsHtml = '';
    if (wrongCount > 0) {
      actionsHtml = `
        <button type="button" class="btn btn-primary btn-replay-quiz" id="btn-replay-failed" title="틀린 ${wrongCount}문제만 모아서 다시 풉니다">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          <span>틀린 문제 다시 풀기 (${wrongCount}문제)</span>
        </button>
        <button type="button" class="btn-step2-secondary" id="btn-replay-all" title="처음부터 모든 퀴즈 다시 풀기">
          <span>전체 다시 풀기</span>
        </button>
        <button type="button" class="btn-goto-step2" id="btn-goto-video" title="Step 2: 핵심 문장 학습으로 이동">
          <span>핵심 문장 보러가기 🎧</span>
        </button>
      `;
    } else {
      actionsHtml = `
        <button type="button" class="btn-step2-secondary" id="btn-replay-all" title="처음부터 모든 퀴즈 다시 풀기">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <polyline points="23 20 23 14 17 14"></polyline>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
          </svg>
          <span>전체 퀴즈 다시 풀기 (Replay All)</span>
        </button>
        <button type="button" class="btn-goto-step2" id="btn-goto-video" title="Step 2: 핵심 문장 학습으로 이동">
          <span>핵심 문장 보러가기 🎧</span>
        </button>
      `;
    }

    this.container.innerHTML = `
      <div class="quiz-completed-card animate-fade-in" role="region" aria-label="Quizzes Completed">
        <div class="quiz-completed-badge">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#10B981" stroke-width="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 class="quiz-completed-title">${scoreTitle}</h2>
        <p class="quiz-completed-desc">${scoreDesc}</p>

        <!-- Quiz Score Summary Card -->
        <div class="quiz-score-summary">
          <div class="quiz-score-main">
            <span class="quiz-score-number">${correctCount} / ${total}</span>
            <span class="quiz-score-sublabel">맞힌 문제 (${percent}%)</span>
          </div>

          <div class="quiz-score-grid">
            <div class="quiz-score-stat-box correct">
              <span class="stat-box-num">${correctCount}</span>
              <span class="stat-box-label">정답</span>
            </div>
            <div class="quiz-score-stat-box wrong">
              <span class="stat-box-num">${wrongCount}</span>
              <span class="stat-box-label">오답 / 재시도</span>
            </div>
            <div class="quiz-score-stat-box rate">
              <span class="stat-box-num">${percent}%</span>
              <span class="stat-box-label">정답률</span>
            </div>
          </div>
        </div>

        <div class="quiz-completed-actions" style="margin-top: 24px;">
          ${actionsHtml}
        </div>
      </div>
    `;

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }

    const replayFailedBtn = this.container.querySelector('#btn-replay-failed');
    if (replayFailedBtn) {
      replayFailedBtn.addEventListener('click', () => {
        this.restartQuiz(true);
      });
    }

    const replayAllBtn = this.container.querySelector('#btn-replay-all');
    if (replayAllBtn) {
      replayAllBtn.addEventListener('click', () => {
        this.restartQuiz(false);
      });
    }

    const videoBtn = this.container.querySelector('#btn-goto-video');
    if (videoBtn) {
      videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const overlay = document.getElementById('celebration-overlay');
        if (overlay) {
          overlay.classList.remove('active');
          overlay.setAttribute('aria-hidden', 'true');
        }
        if (typeof this.onStartVideo === 'function') {
          this.onStartVideo();
        }
        const step2Tab = document.querySelector('.step-tab-btn[data-step="2"]');
        if (step2Tab && !step2Tab.classList.contains('active')) {
          step2Tab.click();
        }
      });
    }
  }

  restartQuiz(onlyFailed = false) {
    const overlay = document.getElementById('celebration-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    if (onlyFailed) {
      const results = this.state.questionResults || {};
      const failed = this.originalQuizzes.filter(q => results[q._origIndex] !== true);
      if (failed.length > 0) {
        this.quizzes = failed;
        failed.forEach(q => {
          delete this.state.questionResults[q._origIndex];
        });
      } else {
        this.quizzes = [...this.originalQuizzes];
        this.state.questionResults = {};
      }
    } else {
      this.quizzes = [...this.originalQuizzes];
      this.state.questionResults = {};
    }

    this.currentIndex = 0;
    this.questionFailed = false;
    this.state.completed = false;
    this.state.currentQuestionIndex = 0;
    Storage.saveProgress(this.lessonId, this.state);
    this.renderCurrentQuestion();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }

  _renderHintHtml(q) {
    if (!q) return '';
    if (q.type === 'drag-and-drop') {
      const tokens = q.tokens || (q.answer ? q.answer.split(/\s+/) : []);
      const firstWord = tokens[0] || '';
      return `<span class="hint-letters">첫 번째 단어는 <strong>"${this._escapeHtml(firstWord)}"</strong> 입니다.</span>`;
    }
    const answer = (q.answer || '').trim();
    if (!answer) {
      return `<span class="hint-letters">${this._escapeHtml(q.hint || '')}</span>`;
    }

    const words = answer.split(/\s+/);
    const isListening = q.type === 'listening';

    const wordsHtml = words.map(word => {
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
        const p = punct ? `<span class="hint-char punct">${this._escapeHtml(punct)}</span>` : '';
        return `<span class="hint-word" aria-label="${this._escapeHtml(word)}"><span class="hint-char revealed">${this._escapeHtml(clean)}</span>${p}</span>`;
      }

      let revealed;
      if (isListening) {
        const cutoff = alphaIndices.length <= 2 ? alphaIndices.length : 2;
        revealed = new Set(alphaIndices.slice(0, cutoff));
      } else {
        revealed = alphaIndices.length === 2
          ? new Set([alphaIndices[0]])
          : new Set([alphaIndices[0], alphaIndices[alphaIndices.length - 1]]);
      }

      let charsHtml = '';
      let i = 0;
      while (i < clean.length) {
        if (revealed.has(i)) {
          // Group consecutive revealed letters so syllable letters remain unified
          let seg = clean[i];
          while (i + 1 < clean.length && revealed.has(i + 1)) {
            i++;
            seg += clean[i];
          }
          charsHtml += `<span class="hint-char revealed">${this._escapeHtml(seg)}</span>`;
        } else if (/[a-zA-Z0-9]/.test(clean[i])) {
          charsHtml += `<span class="hint-char blank">_</span>`;
        } else {
          charsHtml += `<span class="hint-char symbol">${this._escapeHtml(clean[i])}</span>`;
        }
        i++;
      }

      if (punct) {
        charsHtml += `<span class="hint-char punct">${this._escapeHtml(punct)}</span>`;
      }

      return `<span class="hint-word" aria-label="${this._escapeHtml(word)}">${charsHtml}</span>`;
    }).join('');

    return `<div class="hint-words-container">${wordsHtml}</div>`;
  }

  _escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  _shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizEngine;
}

