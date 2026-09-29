/**
 * Dictation Engine for RhyRhy English (Issue #108)
 * Step 4: Dictation Practice
 * Supports all key sentences by default + dynamically flagged transcript segments from Step 3.
 * Uses native video segment audio in audio/segments/sXX.mp3.
 * Focuses dictation on key expressions / important phrases rather than typing the entire sentence.
 * Features audio playback, 0.75x/1.0x speed, first-letter masking hints, live blank preview, and word-by-word diff checking.
 */
class DictationEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    this.lessonId = options.lessonId;
    this.keySentences = options.keySentences || [];
    this.audioBaseUrl = options.audioBaseUrl || './audio/';
    this.onComplete = options.onComplete || (() => {});
    this.onNextStep = options.onNextStep || (() => {});

    this.queue = [];
    this.currentIndex = 0;
    this.audio = null;
    this.playbackRate = 1.0;
    this.isPlaying = false;
    this.hintRevealed = false;
    this.checkedState = null; // null | { isCorrect: boolean, diff: Array, userText: string }

    this.state = (typeof Storage !== 'undefined' && typeof Storage.getDictationProgress === 'function')
      ? Storage.getDictationProgress(this.lessonId)
      : { completed: false, currentIndex: 0 };

    if (this.state && typeof this.state.currentIndex === 'number') {
      this.currentIndex = this.state.currentIndex;
    }

    this.buildQueue();
  }

  buildQueue() {
    const queue = [];

    // Key sentences only (flagged segments logic removed per user request)
    this.keySentences.forEach((item, idx) => {
      let audioUrl = item.audioUrl;
      if (!audioUrl) {
        if (item.segmentAudio) {
          audioUrl = `${this.audioBaseUrl}${item.segmentAudio}`;
        } else if (item.segmentId) {
          audioUrl = `${this.audioBaseUrl}segments/${item.segmentId}.mp3`;
        } else if (item.audioFile) {
          audioUrl = `${this.audioBaseUrl}${encodeURIComponent(item.audioFile)}`;
        }
      }

      const en = item.segmentEn || item.en || item.english || '';
      const kr = item.segmentKr || item.kr || item.korean || '';
      const target = item.target || item.keyExpression || item.answer || '';

      queue.push({
        id: `key-${idx + 1}`,
        segmentId: item.segmentId || null,
        type: 'key-sentence',
        en: en,
        kr: kr,
        audioUrl: audioUrl,
        keyExpression: item.keyExpression || target,
        target: target,
        explanation: item.explanation || '',
        isFlagged: false
      });
    });

    this.queue = queue;
  }

  _extractTarget(en) {
    if (!en) return '';
    const clean = en.replace(/\[(.*?)\]/, '$1').trim();
    const words = clean.split(/\s+/);
    if (words.length <= 3) return clean;
    // Fallback: pick first 2-3 words
    return words.slice(0, 2).join(' ');
  }

  refreshQueue() {
    this.buildQueue();
    if (this.state && this.state.completed) {
      this.renderCompletedState(true);
      return;
    }
    const currentItem = this.queue[this.currentIndex];
    if (currentItem) {
      const newIdx = this.queue.findIndex(q => q.id === currentItem.id);
      if (newIdx >= 0) {
        this.currentIndex = newIdx;
      } else {
        this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.queue.length - 1));
      }
    } else if (this.state && typeof this.state.currentIndex === 'number') {
      this.currentIndex = Math.min(this.state.currentIndex, Math.max(0, this.queue.length - 1));
    }
    this.render();
  }

  init() {
    if (!this.container) return;
    if (this.state && this.state.completed) {
      this.renderCompletedState(true);
      return;
    }
    if (this.currentIndex >= this.queue.length && this.queue.length > 0) {
      this.currentIndex = Math.max(0, this.queue.length - 1);
    }
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.queue.length === 0) {
      this.container.innerHTML = `
        <div class="dictation-card empty-state">
          <p>받아쓰기할 문장이 없습니다.</p>
        </div>
      `;
      return;
    }

    if (this.currentIndex >= this.queue.length) {
      this.renderCompletedState();
      return;
    }

    const item = this.queue[this.currentIndex];
    const total = this.queue.length;
    const currentNum = this.currentIndex + 1;
    const progressPercent = Math.round(((currentNum - 1) / total) * 100);

    const typeBadge = item.isFlagged
      ? `<span class="dictation-pill flagged">🚩 내가 표시한 어려운 문장</span>`
      : `<span class="dictation-pill key">✨ 핵심 문장</span>`;

    this.container.innerHTML = `
      <div class="dictation-card animate-fade-in" role="region" aria-label="Dictation Practice">
        <!-- Header -->
        <div class="dictation-header">
          <div class="dictation-meta">
            <span class="dictation-badge">문장 ${currentNum} / ${total}</span>
            ${typeBadge}
          </div>
          <div class="dictation-progress-track" aria-hidden="true">
            <div class="dictation-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Audio Player Section -->
        <div class="dictation-audio-box">
          <button type="button" class="btn-dictation-play" id="btn-dictation-play" aria-label="오디오 재생 / 일시 정지 (스페이스바)">
            <svg class="icon-play" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span class="play-label">소리 듣기</span>
          </button>

          <div class="dictation-audio-controls">
            <button type="button" class="btn-audio-ctrl" id="btn-dictation-replay" title="처음부터 다시 듣기">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>다시 듣기</span>
            </button>

            <div class="speed-selector" role="group" aria-label="Playback Speed">
              <button type="button" class="btn-speed-opt ${this.playbackRate === 0.75 ? 'active' : ''}" data-speed="0.75">0.75x</button>
              <button type="button" class="btn-speed-opt ${this.playbackRate === 1.0 ? 'active' : ''}" data-speed="1.0">1.0x</button>
            </div>
          </div>
        </div>

        <!-- Sentence Cloze Context Box -->
        <div class="dictation-cloze-box">
          <div class="dictation-cloze-card">
            <span class="cloze-badge">📝 핵심 표현 받아쓰기</span>
            <p class="dictation-cloze-text" id="dictation-cloze-text">
              ${this._renderClozeHtml(item.en, item.target)}
            </p>
          </div>
        </div>

        <!-- Korean Meaning Prompt -->
        <div class="dictation-korean-box">
          <span class="korean-icon">💬</span>
          <p class="korean-text">${this._escapeHtml(item.kr)}</p>
        </div>

        <!-- Hint Box (Toggleable) -->
        <div class="dictation-hint-container" id="dictation-hint-box" style="display: ${this.hintRevealed ? 'block' : 'none'};">
          <div class="hint-inner">
            <span class="hint-label">💡 핵심 표현 첫 글자 힌트:</span>
            <span class="hint-text">${this._generateMaskedHint(item.target || item.en)}</span>
          </div>
        </div>

        <!-- Input & Actions Form -->
        <div class="dictation-input-area" id="dictation-input-area">
          <div class="input-wrapper">
            <input 
              type="text"
              id="dictation-input" 
              class="dictation-input" 
              placeholder="들리는 핵심 표현을 입력하세요... (대소문자/구두점 무관)" 
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="none" 
              spellcheck="false"
              aria-label="들리는 핵심 표현 입력"
            />
          </div>

          <div class="dictation-action-buttons">
            <div class="dictation-actions-left">
              <button type="button" class="btn btn-secondary btn-dictation-hint" id="btn-dictation-hint" title="핵심 표현 첫 글자 힌트 보기">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18h6m-4 3h2a9 9 0 1 1 6-6c0 2.5-2 3.5-2 5"/>
                </svg>
                <span>힌트 보기</span>
              </button>
              <button type="button" class="btn btn-secondary btn-dictation-skip" id="btn-dictation-skip" title="정답 확인 후 넘어가기">
                <span>건너뛰기</span>
              </button>
            </div>
            <div class="dictation-actions-right">
              <button type="button" class="btn btn-primary btn-dictation-submit" id="btn-dictation-submit">
                <span>정답 확인</span>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Feedback & Diff Area (Rendered after check) -->
        <div class="dictation-feedback-box" id="dictation-feedback" style="display: none;"></div>
      </div>
    `;

    this._bindEvents();
    // Auto-focus input
    const input = this.container.querySelector('#dictation-input');
    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }

  _renderClozeHtml(en, target, userText = '') {
    if (!en) return '';
    const cleanEn = en.replace(/\s+/g, ' ').trim();
    const cleanTarget = (target || '').trim();

    const blankContent = userText 
      ? this._escapeHtml(userText) 
      : `<span class="blank-placeholder">[ 핵심 표현 ]</span>`;
    const blankHtml = `<span class="dictation-blank-slot ${userText ? 'has-input' : ''}" id="dictation-blank-slot">${blankContent}</span>`;

    // 1. If target exists, search in en
    if (cleanTarget) {
      const lowerEn = cleanEn.toLowerCase();
      const lowerTarget = cleanTarget.toLowerCase();
      const idx = lowerEn.indexOf(lowerTarget);
      if (idx !== -1) {
        const before = cleanEn.substring(0, idx);
        const after = cleanEn.substring(idx + cleanTarget.length);
        return `${this._escapeHtml(before)}${blankHtml}${this._escapeHtml(after)}`;
      }
    }

    // 2. Fallback: check if en contains [ ... ]
    if (cleanEn.includes('[') && cleanEn.includes(']')) {
      return this._escapeHtml(cleanEn).replace(/\[(.*?)\]/, blankHtml);
    }

    // 3. Fallback: append blank at end
    return `${this._escapeHtml(cleanEn)} ${blankHtml}`;
  }

  _highlightTarget(en, target) {
    if (!en) return '';
    const cleanEn = en.replace(/\[|\]/g, '').replace(/\s+/g, ' ').trim();
    const cleanTarget = (target || '').trim();
    if (!cleanTarget) return this._escapeHtml(cleanEn);

    const lowerEn = cleanEn.toLowerCase();
    const lowerTarget = cleanTarget.toLowerCase();
    const idx = lowerEn.indexOf(lowerTarget);
    if (idx !== -1) {
      const before = cleanEn.substring(0, idx);
      const matched = cleanEn.substring(idx, idx + cleanTarget.length);
      const after = cleanEn.substring(idx + cleanTarget.length);
      return `${this._escapeHtml(before)}<mark class="dictation-highlight">${this._escapeHtml(matched)}</mark>${this._escapeHtml(after)}`;
    }
    return this._escapeHtml(cleanEn);
  }

  _bindEvents() {
    const playBtn = this.container.querySelector('#btn-dictation-play');
    if (playBtn) {
      playBtn.addEventListener('click', () => this.toggleAudio());
    }

    const replayBtn = this.container.querySelector('#btn-dictation-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => this.replayAudio());
    }

    const speedBtns = this.container.querySelectorAll('.btn-speed-opt');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        this.setPlaybackRate(speed);
        speedBtns.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.speed) === speed));
      });
    });

    const hintBtn = this.container.querySelector('#btn-dictation-hint');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.hintRevealed = !this.hintRevealed;
        const box = this.container.querySelector('#dictation-hint-box');
        if (box) {
          box.style.display = this.hintRevealed ? 'block' : 'none';
        }
      });
    }

    const skipBtn = this.container.querySelector('#btn-dictation-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        this.revealAndSkip();
      });
    }

    const submitBtn = this.container.querySelector('#btn-dictation-submit');
    const input = this.container.querySelector('#dictation-input');
    const blankSlot = this.container.querySelector('#dictation-blank-slot');

    if (input && blankSlot) {
      input.addEventListener('input', () => {
        const val = input.value.trim();
        if (val) {
          blankSlot.textContent = val;
          blankSlot.classList.add('has-input');
        } else {
          blankSlot.innerHTML = '<span class="blank-placeholder">[ 핵심 표현 ]</span>';
          blankSlot.classList.remove('has-input');
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.checkAnswer();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.checkAnswer();
        }
      });
    }
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  playAudio() {
    const item = this.queue[this.currentIndex];
    if (!item || !item.audioUrl) return;

    if (!this.audio || this.audio.src !== item.audioUrl) {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(item.audioUrl);
      this.audio.playbackRate = this.playbackRate;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this._updatePlayButtonState(true);
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this._updatePlayButtonState(false);
      });
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this._updatePlayButtonState(false);
      });
    }

    this.audio.playbackRate = this.playbackRate;
    this.audio.play().catch(err => {
      console.warn('Audio play error in DictationEngine:', err);
    });
  }

  pauseAudio() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  replayAudio() {
    if (this.audio) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    } else {
      this.playAudio();
    }
  }

  setPlaybackRate(rate) {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  _updatePlayButtonState(isPlaying) {
    const playBtn = this.container.querySelector('#btn-dictation-play');
    if (!playBtn) return;
    const label = playBtn.querySelector('.play-label');
    const icon = playBtn.querySelector('.icon-play');

    if (isPlaying) {
      playBtn.classList.add('playing');
      if (label) label.textContent = '일시 정지';
      if (icon) {
        icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
      }
    } else {
      playBtn.classList.remove('playing');
      if (label) label.textContent = '소리 듣기';
      if (icon) {
        icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      }
    }
  }

  _normalizeText(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[.,!?;:"'’`~()[\]{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  _generateMaskedHint(text) {
    const clean = (text || '').replace(/\[(.*?)\]/, '$1').trim();
    const words = clean.split(/\s+/);
    return words.map(w => {
      const match = w.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9])([a-zA-Z0-9]*)([^a-zA-Z0-9]*)$/);
      if (!match) return w;
      const leadingPunct = match[1];
      const firstLetter = match[2];
      const restLetters = match[3];
      const trailingPunct = match[4];
      const underscores = '_'.repeat(Math.min(restLetters.length, 5));
      return `${leadingPunct}${firstLetter}${underscores}${trailingPunct}`;
    }).join(' ');
  }

  checkAnswer() {
    const item = this.queue[this.currentIndex];
    const input = this.container.querySelector('#dictation-input');
    if (!input || !item) return;

    const userText = input.value.trim();
    if (!userText) {
      input.focus();
      return;
    }

    const normUser = this._normalizeText(userText);
    const normTarget = this._normalizeText(item.target);
    const normFull = this._normalizeText(item.en);

    // Accept if user text matches target, contains target, or equals full sentence
    const isMatch = (normTarget && normUser === normTarget) ||
                    (normTarget && normUser.includes(normTarget)) ||
                    (normFull && normUser === normFull);

    const feedbackBox = this.container.querySelector('#dictation-feedback');
    const inputArea = this.container.querySelector('#dictation-input-area');

    if (isMatch) {
      this.pauseAudio();
      if (inputArea) inputArea.style.display = 'none';
      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'dictation-feedback-box success animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge success">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>정답입니다! 완벽해요 🎉</span>
          </div>
          <div class="feedback-sentence">
            <p class="feedback-en">${this._highlightTarget(item.en, item.target)}</p>
            <p class="feedback-kr">${this._escapeHtml(item.kr)}</p>
          </div>
          <div class="feedback-actions">
            <button type="button" class="btn btn-primary btn-dictation-next" id="btn-dictation-next">
              <span>다음 문장으로 ▶</span>
            </button>
          </div>
        `;
        const nextBtn = feedbackBox.querySelector('#btn-dictation-next');
        if (nextBtn) {
          nextBtn.focus();
          nextBtn.addEventListener('click', () => this.advanceNext());
        }
      }
    } else {
      // Diff feedback on the target expression
      const targetWords = (item.target || item.en).split(/\s+/);
      const userWords = userText.split(/\s+/);

      const diffHtml = targetWords.map((tw, idx) => {
        const uw = userWords[idx] || '';
        const normTw = this._normalizeText(tw);
        const normUw = this._normalizeText(uw);
        if (normTw === normUw) {
          return `<span class="diff-word correct">${this._escapeHtml(tw)}</span>`;
        } else {
          return `<span class="diff-word incorrect" title="내가 입력한 단어: ${this._escapeHtml(uw || '(누락)')}">${this._escapeHtml(tw)}</span>`;
        }
      }).join(' ');

      if (feedbackBox) {
        feedbackBox.style.display = 'block';
        feedbackBox.className = 'dictation-feedback-box try-again animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge mismatch">
            <span>아쉬워요! 핵심 표현을 확인해보세요 ✍️</span>
          </div>
          <div class="diff-comparison">
            <div class="diff-words-container">
              <span class="diff-label">정답 핵심 표현:</span>
              <div class="diff-words">${diffHtml}</div>
            </div>
            <div class="diff-user-text">
              <span class="sub-label">내가 입력한 내용:</span>
              <p>${this._escapeHtml(userText)}</p>
            </div>
          </div>
          <div class="feedback-actions">
            <button type="button" class="btn btn-secondary" id="btn-diff-retry">
              <span>다시 듣고 고치기</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-diff-reveal-next">
              <span>정답 확인하고 넘어가기 ▶</span>
            </button>
          </div>
        `;

        const retryBtn = feedbackBox.querySelector('#btn-diff-retry');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            feedbackBox.style.display = 'none';
            if (input) {
              input.focus();
              this.replayAudio();
            }
          });
        }

        const revealNextBtn = feedbackBox.querySelector('#btn-diff-reveal-next');
        if (revealNextBtn) {
          revealNextBtn.addEventListener('click', () => {
            this.advanceNext();
          });
        }
      }
    }
  }

  revealAndSkip() {
    const item = this.queue[this.currentIndex];
    const feedbackBox = this.container.querySelector('#dictation-feedback');
    const inputArea = this.container.querySelector('#dictation-input-area');

    if (inputArea) inputArea.style.display = 'none';
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = 'dictation-feedback-box skipped animate-fade-in';
      feedbackBox.innerHTML = `
        <div class="feedback-badge skipped">
          <span>정답 확인 👀</span>
        </div>
        <div class="feedback-sentence">
          <p class="feedback-en">${this._highlightTarget(item.en, item.target)}</p>
          <p class="feedback-kr">${this._escapeHtml(item.kr)}</p>
        </div>
        <div class="feedback-actions">
          <button type="button" class="btn btn-primary btn-dictation-next" id="btn-dictation-next">
            <span>다음 문장으로 ▶</span>
          </button>
        </div>
      `;
      const nextBtn = feedbackBox.querySelector('#btn-dictation-next');
      if (nextBtn) {
        nextBtn.focus();
        nextBtn.addEventListener('click', () => this.advanceNext());
      }
    }
  }

  advanceNext() {
    this.pauseAudio();
    this.hintRevealed = false;
    this.currentIndex++;
    if (this.currentIndex >= this.queue.length) {
      this.completeAll();
    } else {
      this.state.currentIndex = this.currentIndex;
      this._saveProgress();
      this.render();
    }
  }

  completeAll() {
    this.state.completed = true;
    this.state.currentIndex = this.queue.length;
    this._saveProgress();
    this.renderCompletedState();
  }

  restartDictation() {
    this.pauseAudio();
    this.currentIndex = 0;
    this.state.completed = false;
    this.state.currentIndex = 0;
    this._saveProgress();
    this.render();
  }

  _saveProgress() {
    if (typeof Storage !== 'undefined' && typeof Storage.saveDictationProgress === 'function') {
      Storage.saveDictationProgress(this.lessonId, this.state);
    }
  }

  renderCompletedState(isInitialLoad = false) {
    this.pauseAudio();
    this.state.completed = true;
    this.state.currentIndex = this.queue.length;
    this._saveProgress();

    const total = this.queue.length;

    this.container.innerHTML = `
      <div class="dictation-card completed animate-fade-in" role="region" aria-label="Dictation Completed">
        <div class="dictation-complete-icon">🎉</div>
        <h3 class="dictation-complete-title">핵심 표현 받아쓰기 완료!</h3>
        <p class="dictation-complete-desc">
          영상 속 원어민 발음으로 핵심 표현 ${total}개를 직접 귀로 듣고 받아쓰셨습니다!
        </p>

        <div class="dictation-stats-card">
          <div class="stat-pill">
            <span class="stat-num">${total}</span>
            <span class="stat-label">완료한 문장</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">${total}</span>
            <span class="stat-label">핵심 표현</span>
          </div>
        </div>

        <div class="dictation-complete-actions">
          <button type="button" class="btn btn-primary btn-dictation-goto-step5" id="btn-goto-step5">
            <span>Step 5: 스피킹 퀴즈 풀러 가기 🎙️</span>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button type="button" class="btn btn-secondary btn-dictation-restart" id="btn-dictation-restart">
            <span>처음부터 다시 연습하기 ↺</span>
          </button>
        </div>
      </div>
    `;

    const gotoStep5Btn = this.container.querySelector('#btn-goto-step5');
    if (gotoStep5Btn) {
      gotoStep5Btn.addEventListener('click', () => {
        this.onNextStep();
      });
    }

    const restartBtn = this.container.querySelector('#btn-dictation-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.restartDictation();
      });
    }

    this.onComplete({ total, keyCount: total, alreadyCompleted: isInitialLoad });
  }

  _escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Universal export
if (typeof window !== 'undefined') {
  window.DictationEngine = DictationEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DictationEngine;
}
