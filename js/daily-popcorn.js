/**
 * RhyRhy English - Daily Popcorn English Phrase Feature (Issue #44)
 * Manages floating popcorn action button, popping particle transitions,
 * daily phrase cloze recall, audio pronunciation, and vocabulary saving.
 */

const DailyPopcornManager = {
  currentPhrase: null,
  audioElement: null,
  isPlaying: false,

  init() {
    // Ensure daily phrases data is available
    const phrases = typeof DAILY_PHRASES !== 'undefined' ? DAILY_PHRASES : [];
    if (!phrases || phrases.length === 0) return;

    this.currentPhrase = Storage.getTodayDailyPhrase(phrases);
    if (!this.currentPhrase) return;

    // Check if user is already on dedicated daily.html page
    const isDailyPage = window.location.pathname.endsWith('/daily.html') || window.location.pathname.endsWith('/daily');
    if (isDailyPage) {
      this.initStandalonePage();
      return;
    }

    // Render floating popcorn button if not completed today
    if (!Storage.isDailyPhraseCompletedToday()) {
      this.renderFloatingButton();
    }
  },

  /**
   * Render the floating popcorn action button in the bottom-right corner
   */
  renderFloatingButton() {
    let btn = document.getElementById('btn-daily-popcorn');
    if (btn) return;

    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'btn-daily-popcorn';
    btn.className = 'floating-popcorn-btn';
    btn.setAttribute('aria-label', '오늘의 팝콘 영어 표현 학습하기');
    btn.setAttribute('title', '🍿 오늘의 팝콘 영어 한마디!');

    btn.innerHTML = `
      <span class="popcorn-icon-inner" aria-hidden="true">🍿</span>
      <span class="popcorn-badge" id="popcorn-badge">NEW</span>
    `;

    btn.addEventListener('click', (e) => {
      this._onPopcornClick(e, btn);
    });

    document.body.appendChild(btn);
  },

  /**
   * Handle popcorn button click: trigger popping burst & transition to modal
   */
  _onPopcornClick(e, btn) {
    if (btn.classList.contains('popping')) return;

    btn.classList.add('popping');
    this._playPopSound();
    this._spawnPopcornBurst(btn);

    setTimeout(() => {
      btn.classList.remove('popping');
      this.openModal(this.currentPhrase);
    }, 380);
  },

  /**
   * Synthesize an authentic, zero-dependency pop sound via Web Audio API
   */
  _playPopSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (_) { }
  },

  /**
   * Spawn popping popcorn kernels and sparkle particles
   */
  _spawnPopcornBurst(btn) {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particles = ['🍿', '✨', '⭐', '💛', '🍿', '✨'];

    particles.forEach((emoji, i) => {
      const el = document.createElement('span');
      el.className = 'popcorn-particle';
      el.textContent = emoji;

      const angle = (i / particles.length) * (Math.PI * 2) + (Math.random() * 0.4 - 0.2);
      const baseDist = (rect.width / 2) + 20;
      const distance = baseDist + Math.random() * (rect.width * 0.35);
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance - 25}px`;
      const rot = `${(Math.random() - 0.5) * 360}deg`;

      el.style.left = `${centerX}px`;
      el.style.top = `${centerY}px`;
      el.style.setProperty('--dx', dx);
      el.style.setProperty('--dy', dy);
      el.style.setProperty('--rot', rot);

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 700);
    });
  },

  /**
   * Open the Daily Phrase Learning Modal
   */
  openModal(phrase) {
    if (!phrase) phrase = this.currentPhrase;
    if (!phrase) return;

    let overlay = document.getElementById('daily-phrase-modal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'daily-phrase-modal';
      overlay.className = 'daily-phrase-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', '오늘의 팝콘 영어 표현');
      document.body.appendChild(overlay);
    }

    const todayStr = this._getFormattedDate();
    const maskedSentence = this._buildMaskedHtml(phrase.en, phrase.mask);
    const isSaved = this._checkIfPhraseSaved(phrase);
    const isCompleted = Storage.isDailyPhraseCompletedToday();
    const lessonLinkHtml = phrase.lessonId ? `
      <a href="${this._getBasePath()}lessons/${phrase.lessonId}/index.html" class="btn-daily-lesson-link">
        <span>🚀 ${phrase.lessonId.toUpperCase()} 전체 레슨 & 비디오 보기</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    ` : '';

    overlay.innerHTML = `
      <div class="daily-phrase-card" id="daily-phrase-card">
        <div class="daily-header">
          <div class="daily-header-left">
            <div class="daily-header-tag">
              <span>🍿</span>
              <span>오늘의 한마디</span>
            </div>
            <span class="daily-header-date">${todayStr}</span>
          </div>
          <button type="button" class="btn-daily-close" id="btn-close-daily-modal" aria-label="닫기">✕</button>
        </div>

        <div class="daily-body">
          <div class="daily-kr-wrap">
            <span class="daily-label">Korean Meaning</span>
            <div class="daily-kr-text">${phrase.kr}</div>
          </div>

          <div class="daily-en-wrap">
            <span class="daily-label">English Sentence</span>
            <div class="daily-en-sentence" id="daily-en-sentence">
              ${maskedSentence}
            </div>
          </div>

          <div class="daily-audio-row">
            <div class="daily-audio-meta">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
              <span>원어민 실생활 발음</span>
            </div>
            <button type="button" class="btn-daily-play" id="btn-daily-play" aria-label="원어민 발음 듣기">
              <span id="daily-play-icon">▶</span>
              <span id="daily-play-text">발음 듣기</span>
            </button>
          </div>

          <div class="daily-explanation-box ${isCompleted ? 'show' : ''}" id="daily-explanation-box">
            <div class="daily-explanation-title">
              <span>💡</span>
              <span>원어민 실전 뉘앙스 팁</span>
            </div>
            <p>${phrase.explanation}</p>
          </div>
        </div>

        <div class="daily-actions">
          <div class="daily-actions-main-row">
            <button type="button" class="btn-daily-reveal ${isCompleted ? 'revealed' : ''}" id="btn-daily-reveal">
              <span>${isCompleted ? '✓ 정답 확인 완료' : '💡 정답 확인 (Reveal)'}</span>
            </button>
            <button type="button" class="btn-daily-save ${isSaved ? 'saved' : ''}" id="btn-daily-save">
              <span>${isSaved ? '✓ 단어장에 저장됨' : '🔖 내 단어장에 저장'}</span>
            </button>
          </div>
          ${lessonLinkHtml}
        </div>
      </div>
    `;

    // Force layout then add open class for smooth transition
    overlay.offsetHeight;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Bind event listeners
    const closeBtn = document.getElementById('btn-close-daily-modal');
    closeBtn.addEventListener('click', () => this.closeModal());

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });

    const playBtn = document.getElementById('btn-daily-play');
    playBtn.addEventListener('click', () => this.playAudio(phrase));

    const maskEl = document.getElementById('daily-phrase-mask');
    if (maskEl) {
      maskEl.addEventListener('click', () => this.revealPhrase(phrase));
    }

    const revealBtn = document.getElementById('btn-daily-reveal');
    revealBtn.addEventListener('click', () => this.revealPhrase(phrase));

    const saveBtn = document.getElementById('btn-daily-save');
    saveBtn.addEventListener('click', () => this.toggleSavePhrase(phrase, saveBtn));

    // If already completed previously, reveal mask directly
    if (isCompleted && maskEl) {
      maskEl.classList.add('revealed');
    }
  },

  /**
   * Close modal dialog
   */
  closeModal() {
    const overlay = document.getElementById('daily-phrase-modal');
    if (overlay) {
      overlay.classList.remove('open');
    }
    document.body.style.overflow = '';
    this.stopAudio();
  },

  /**
   * Reveal the masked phrase, display explanation, and record daily completion
   */
  revealPhrase(phrase) {
    const maskEl = document.getElementById('daily-phrase-mask');
    const expBox = document.getElementById('daily-explanation-box');
    const revealBtn = document.getElementById('btn-daily-reveal');

    if (maskEl) {
      maskEl.classList.add('revealed');
    }

    if (expBox) {
      expBox.classList.add('show');
    }

    if (revealBtn) {
      revealBtn.classList.add('revealed');
      revealBtn.innerHTML = '<span>✓ 정답 확인 완료</span>';
    }

    // Mark as completed for today
    Storage.setDailyPhraseCompletedToday();

    // Trigger celebration sound
    this._playPopSound();

    // Gracefully animate out the floating button on the page
    const fab = document.getElementById('btn-daily-popcorn');
    if (fab) {
      fab.classList.add('vanish');
      setTimeout(() => fab.remove(), 400);
    }
  },

  /**
   * Toggle saving phrase into user's saved vocabulary bank
   */
  toggleSavePhrase(phrase, saveBtn) {
    const isSaved = this._checkIfPhraseSaved(phrase);

    if (isSaved) {
      Storage.removeSavedSentence('daily', phrase.id);
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = '<span>🔖 내 단어장에 저장</span>';
      this._showToast('단어장에서 삭제되었습니다.');
    } else {
      Storage.saveSentence('daily', {
        id: phrase.id,
        en: phrase.en,
        kr: phrase.kr,
        audio: phrase.audio,
        lessonId: phrase.lessonId
      });
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = '<span>✓ 단어장에 저장됨</span>';
      this._showToast('내 단어장에 저장되었습니다! 🔖');
    }
  },

  /**
   * Play sentence audio with native WAV resolution and speech synthesis fallback
   */
  playAudio(phrase) {
    const playBtn = document.getElementById('btn-daily-play');
    const playIcon = document.getElementById('daily-play-icon');
    const playText = document.getElementById('daily-play-text');

    if (this.isPlaying && this.audioElement) {
      this.stopAudio();
      return;
    }

    if (!phrase || !phrase.en) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.addEventListener('ended', () => {
        this.stopAudio();
      });
      this.audioElement.addEventListener('pause', () => {
        if (!this.audioElement.seeking) {
          this.isPlaying = false;
          if (playBtn) playBtn.classList.remove('playing');
          if (playIcon) playIcon.textContent = '▶';
          if (playText) playText.textContent = '발음 듣기';
        }
      });
    }

    const audioUrl = this._resolveAudioPath(phrase);

    if (playBtn) playBtn.classList.add('playing');
    if (playIcon) playIcon.textContent = '⏸';
    if (playText) playText.textContent = '재생 중...';
    this.isPlaying = true;

    if (audioUrl) {
      this.audioElement.src = audioUrl;
      this.audioElement.play().catch(() => {
        this._speakTts(phrase.en);
      });
    } else {
      this._speakTts(phrase.en);
    }
  },

  /**
   * Stop audio playback
   */
  stopAudio() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (_) { }
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;

    const playBtn = document.getElementById('btn-daily-play');
    const playIcon = document.getElementById('daily-play-icon');
    const playText = document.getElementById('daily-play-text');
    if (playBtn) playBtn.classList.remove('playing');
    if (playIcon) playIcon.textContent = '▶';
    if (playText) playText.textContent = '발음 듣기';
  },

  /**
   * Resilient TTS fallback
   */
  _speakTts(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.95;

    utt.onend = () => {
      this.stopAudio();
    };
    utt.onerror = () => {
      this.stopAudio();
    };

    window.speechSynthesis.speak(utt);
  },

  /**
   * Helper: Resolve relative audio path
   */
  _resolveAudioPath(phrase) {
    if (!phrase || !phrase.audio) return null;
    const base = this._getBasePath();
    let p = phrase.audio;

    if (p.startsWith('./')) {
      p = p.substring(2);
    }

    return encodeURI(`${base}${p}`);
  },

  /**
   * Helper: Build masked HTML sentence
   */
  _buildMaskedHtml(en, mask) {
    if (!en || !mask) return en || '';
    const regex = new RegExp(`(${mask.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i');
    return en.replace(regex, `<span class="daily-mask" id="daily-phrase-mask" title="터치하여 정답 확인">$1</span>`);
  },

  /**
   * Helper: Check if phrase already exists in user's saved sentences
   */
  _checkIfPhraseSaved(phrase) {
    if (!phrase) return false;
    const all = Storage.getAllSavedSentences();
    const dailyList = all['daily'] || [];
    return dailyList.some(s => s.id === phrase.id || s.en.trim().toLowerCase() === phrase.en.trim().toLowerCase());
  },

  /**
   * Helper: Get base path based on current URL
   */
  _getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/lessons/lesson-') || path.includes('/quiz/lesson-')) {
      return '../../';
    }
    if (path.includes('/lessons/') || path.includes('/quiz/')) {
      return '../';
    }
    return './';
  },

  /**
   * Helper: Get localized Korean date string (e.g. 2026. 09. 08 (화))
   */
  _getFormattedDate(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[d.getDay()];
    return `${year}. ${month}. ${day} (${dayName})`;
  },

  /**
   * Helper: Show brief animated toast notification
   */
  _showToast(msg) {
    const existing = document.querySelector('.save-toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'save-toast-notification';
    toast.innerHTML = `<span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  },

  /**
   * Initialize standalone daily.html page
   */
  initStandalonePage() {
    const container = document.getElementById('daily-page-container');
    if (!container || !this.currentPhrase) return;

    this.openModal(this.currentPhrase);

    // Make modal look integrated into page
    const overlay = document.getElementById('daily-phrase-modal');
    if (overlay) {
      overlay.style.position = 'relative';
      overlay.style.backdropFilter = 'none';
      overlay.style.background = 'transparent';
      overlay.style.padding = '0';
      overlay.classList.add('open');

      const closeBtn = document.getElementById('btn-close-daily-modal');
      if (closeBtn) {
        closeBtn.innerHTML = '🏠';
        closeBtn.title = '홈으로 돌아가기';
        closeBtn.onclick = (e) => {
          e.stopPropagation();
          window.location.href = './index.html';
        };
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.DailyPopcornManager = DailyPopcornManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyPopcornManager;
}
