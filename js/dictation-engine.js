/**
 * Dictation Engine for RhyRhy English (Issue #108)
 * Step 4: Dictation Practice
 * Supports all key sentences by default + dynamically flagged transcript segments from Step 3.
 * Features audio playback, 0.75x/1.0x speed, first-letter masking hints, word-by-word diff checking.
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

    this.buildQueue();

    // Listen for external flagged segment updates
    if (typeof window !== 'undefined') {
      window.addEventListener('flagged-segments-updated', (e) => {
        if (e.detail && e.detail.lessonId === this.lessonId) {
          this.refreshQueue();
        }
      });
    }
  }

  buildQueue() {
    const queue = [];

    // 1. Key sentences
    this.keySentences.forEach((item, idx) => {
      let audioUrl = item.audioUrl;
      if (!audioUrl && item.audioFile) {
        audioUrl = `${this.audioBaseUrl}${encodeURIComponent(item.audioFile)}`;
      }
      queue.push({
        id: `key-${idx + 1}`,
        type: 'key-sentence',
        en: item.en || item.english || '',
        kr: item.kr || item.korean || '',
        audioUrl: audioUrl,
        keyExpression: item.keyExpression || item.answer || '',
        isFlagged: false
      });
    });

    // 2. Flagged segments from Step 3
    if (typeof Storage !== 'undefined' && typeof Storage.getFlaggedSegments === 'function') {
      const flagged = Storage.getFlaggedSegments(this.lessonId);
      flagged.forEach(seg => {
        const segAudio = `${this.audioBaseUrl}segments/${seg.id}.mp3`;
        queue.push({
          id: `flagged-${seg.id}`,
          type: 'flagged-segment',
          en: seg.en,
          kr: seg.kr,
          audioUrl: segAudio,
          keyExpression: '',
          isFlagged: true
        });
      });
    }

    this.queue = queue;
  }

  refreshQueue() {
    const currentItem = this.queue[this.currentIndex];
    this.buildQueue();
    if (currentItem) {
      const newIdx = this.queue.findIndex(q => q.id === currentItem.id);
      if (newIdx >= 0) {
        this.currentIndex = newIdx;
      } else {
        this.currentIndex = Math.min(this.currentIndex, Math.max(0, this.queue.length - 1));
      }
    }
    this.render();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.queue.length === 0) {
      this.container.innerHTML = `
        <div class="dictation-card empty-state">
          <p>딕테이션할 문장이 없습니다.</p>
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

        <!-- Korean Meaning Prompt -->
        <div class="dictation-korean-box">
          <span class="korean-icon">💬</span>
          <p class="korean-text">${this._escapeHtml(item.kr)}</p>
        </div>

        <!-- Hint Box (Toggleable) -->
        <div class="dictation-hint-container" id="dictation-hint-box" style="display: ${this.hintRevealed ? 'block' : 'none'};">
          <div class="hint-inner">
            <span class="hint-label">💡 첫 글자 힌트:</span>
            <span class="hint-text">${this._generateMaskedHint(item.en)}</span>
          </div>
        </div>

        <!-- Input & Actions Form -->
        <div class="dictation-input-area" id="dictation-input-area">
          <div class="input-wrapper">
            <textarea 
              id="dictation-input" 
              class="dictation-textarea" 
              placeholder="들리는 영어 문장을 입력하세요... (대소문자/구두점 무관)" 
              rows="2"
              autocomplete="off" 
              autocorrect="off" 
              autocapitalize="none" 
              spellcheck="false"
              aria-label="들리는 영어 문장 입력"
            ></textarea>
          </div>

          <div class="dictation-action-buttons">
            <button type="button" class="btn btn-secondary btn-dictation-hint" id="btn-dictation-hint">
              <span>💡 힌트 보기</span>
            </button>
            <button type="button" class="btn btn-secondary btn-dictation-skip" id="btn-dictation-skip">
              <span>건너뛰기</span>
            </button>
            <button type="button" class="btn btn-primary btn-dictation-submit" id="btn-dictation-submit">
              <span>정답 확인 (Enter)</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </button>
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

    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.checkAnswer();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
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
    const words = (text || '').split(/\s+/);
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
    const normTarget = this._normalizeText(item.en);

    const isMatch = normUser === normTarget;
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
            <p class="feedback-en">${this._escapeHtml(item.en)}</p>
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
      // Diff feedback
      const targetWords = item.en.split(/\s+/);
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
            <span>아쉬워요! 틀린 단어를 확인해보세요 ✍️</span>
          </div>
          <div class="diff-comparison">
            <div class="diff-words-container">
              ${diffHtml}
            </div>
            <div class="diff-user-text">
              <span class="sub-label">내가 입력한 문장:</span>
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
          <p class="feedback-en">${this._escapeHtml(item.en)}</p>
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
    this.render();
  }

  renderCompletedState() {
    const total = this.queue.length;
    const flaggedCount = this.queue.filter(q => q.isFlagged).length;
    const keyCount = total - flaggedCount;

    this.container.innerHTML = `
      <div class="dictation-card completed animate-fade-in" role="region" aria-label="Dictation Completed">
        <div class="dictation-complete-icon">🎉</div>
        <h3 class="dictation-complete-title">딕테이션 연습 완료!</h3>
        <p class="dictation-complete-desc">
          핵심 문장 ${keyCount}개${flaggedCount > 0 ? ` 및 어려운 문장 ${flaggedCount}개` : ''}를 귀로 듣고 모두 직접 작성해보셨습니다!
        </p>

        <div class="dictation-stats-card">
          <div class="stat-pill">
            <span class="stat-num">${total}</span>
            <span class="stat-label">완료한 문장</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">${keyCount}</span>
            <span class="stat-label">핵심 문장</span>
          </div>
          ${flaggedCount > 0 ? `
          <div class="stat-pill">
            <span class="stat-num">${flaggedCount}</span>
            <span class="stat-label">복습한 어려운 문장</span>
          </div>
          ` : ''}
        </div>

        <div class="dictation-complete-actions">
          <button type="button" class="btn btn-primary btn-dictation-goto-step5" id="btn-goto-step5">
            <span>Step 5: 복습 퀴즈 풀러 가기 🎯</span>
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
        this.currentIndex = 0;
        this.render();
      });
    }

    this.onComplete({ total, keyCount, flaggedCount });
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
