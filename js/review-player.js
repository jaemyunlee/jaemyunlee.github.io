/**
 * ReviewPlayer - Step 4 Quiz Sentences Review & Continuous Music-Style Audio Player
 * Displays all quiz sentences with key expressions highlighted, provides individual
 * play buttons, and features a music player bar with continuous "Play All" playback.
 */
class ReviewPlayer {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;

    this.lessonId = options.lessonId || 'lesson-01';
    this.quizzes = options.quizzes || [];
    this.audioBaseUrl = options.audioBaseUrl || './audio/';
    this.audioFiles = options.audioFiles || []; // Optional explicit list of audio filenames
    this.celebrationManager = options.celebrationManager;
    this.speakerName = options.speakerName || 'Kelly';
    this.speakerAvatar = options.speakerAvatar || '../../assets/img/avatars/kelly.jpg';

    this.currentIndex = 0;
    this.isPlaying = false;
    this.isPlayAll = false;
    this.isLoop = false;
    this.playbackRate = 1.0;

    this.currentAudio = null;
    this.autoAdvanceTimer = null;
    this.progressInterval = null;
  }

  init() {
    if (!this.container) return;
    this.render();
    this._bindControls();
  }

  setQuizzes(quizzes, audioFiles = null) {
    this.quizzes = quizzes || [];
    if (audioFiles) this.audioFiles = audioFiles;
    this.render();
    this._bindControls();
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  _getCleanSentence(english, answer) {
    if (!english) return '';
    if (/\[[^\]]+\]/.test(english)) {
      return english.replace(/\[[^\]]+\]/, answer || '').replace(/\s+/g, ' ').trim();
    }
    return english.replace(/\s+/g, ' ').trim();
  }

  _formatHighlightedSentence(english, answer) {
    if (!english) return '';
    const cleanAnswer = (answer || '').trim();

    if (/\[[^\]]+\]/.test(english)) {
      return this._escapeHtml(english).replace(
        /\[[^\]]+\]/,
        `<mark class="quiz-vocab-highlight">${this._escapeHtml(cleanAnswer)}</mark>`
      );
    }

    if (cleanAnswer) {
      const regex = new RegExp(`(${this._escapeRegex(cleanAnswer)})`, 'gi');
      return this._escapeHtml(english).replace(regex, `<mark class="quiz-vocab-highlight">$1</mark>`);
    }

    return this._escapeHtml(english);
  }

  _resolveAudioUrl(index) {
    const quiz = this.quizzes[index];
    if (!quiz) return null;

    let path = null;

    // 1. Explicit quiz.audio property
    if (quiz.audio) {
      if (quiz.audio.startsWith('http') || quiz.audio.startsWith('/') || quiz.audio.startsWith('./')) {
        path = quiz.audio;
      } else {
        const cleanAudio = quiz.audio.replace(/^audio\//, '');
        path = `${this.audioBaseUrl}${cleanAudio}`;
      }
    } else if (this.audioFiles && this.audioFiles[index]) {
      // 2. Explicit audioFiles array provided in constructor
      path = `${this.audioBaseUrl}${this.audioFiles[index]}`;
    }

    if (path) {
      return encodeURI(path);
    }

    return null;
  }

  render() {
    if (!this.quizzes || this.quizzes.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <p>복습할 퀴즈 문장 데이터를 불러오는 중입니다...</p>
        </div>
      `;
      return;
    }

    const firstSentence = this._getCleanSentence(this.quizzes[0].english, this.quizzes[0].answer);

    this.container.innerHTML = `
      <div class="review-player-section">
        <!-- Top Sticky Music Player Bar -->
        <div class="review-player-bar" id="review-player-bar">
          <div class="player-bar-top">
            <!-- Left: Current Track Details -->
            <div class="player-track-info">
              <div class="sound-wave-box" aria-hidden="true">
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
              </div>
              <div class="player-text-details">
                <span class="player-track-badge" id="player-track-badge">
                  01/${this.quizzes.length.toString().padStart(2, '0')}
                </span>
                <div class="player-track-title" id="player-track-title" title="${this._escapeHtml(firstSentence)}">
                  ${this._escapeHtml(firstSentence)}
                </div>
              </div>
            </div>

            <!-- Center: Audio Playback Controls -->
            <div class="player-controls-main">
              <button type="button" class="btn-player-step" id="btn-player-prev" title="이전 문장 (|◀)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button type="button" class="btn-player-toggle" id="btn-player-toggle" title="재생 / 일시정지">
                <svg class="icon-play" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <svg class="icon-pause" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="display: none;">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              </button>

              <button type="button" class="btn-player-step" id="btn-player-next" title="다음 문장 (▶|)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            <!-- Right: Play All, Loop & Speed Modes -->
            <div class="player-controls-side">
              <button type="button" class="btn-play-all-toggle active" id="btn-player-playall" title="전체 재생 켜짐 (클릭 시 끄기)">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                </svg>
                <span class="playall-text">전체</span>
              </button>

              <button type="button" class="btn-speed-toggle" id="btn-player-speed" title="재생 속도 조절">
                1.0x
              </button>
            </div>
          </div>

          <!-- Bottom: Scrubber & Time Display -->
          <div class="player-progress-row">
            <span class="player-time-label" id="player-current-time">0:00</span>
            <div class="player-progress-track" id="player-progress-track">
              <div class="player-progress-fill" id="player-progress-fill"></div>
            </div>
            <span class="player-time-label" id="player-total-time">0:00</span>
          </div>
        </div>

        <!-- Section Intro & Guidance -->
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">
            퀴즈 핵심 문장 총복습 (Sentence Review) 🎧
          </h3>
          <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.55;">
            오늘 퀴즈에서 학습한 핵심 표현이 형광펜으로 강조되어 있습니다. 상단의 <strong>[전체 연속 재생]</strong> 버튼을 눌러 음악 앱처럼 편안하게 귀로 듣고 따라 말해보세요!
          </p>
        </div>

        <!-- List of Sentences -->
        <div class="review-sentence-list" id="review-sentence-list">
          ${this.quizzes.map((quiz, idx) => {
      const cleanEn = this._getCleanSentence(quiz.english, quiz.answer);
      const isSaved = Storage.isSentenceSaved(this.lessonId, cleanEn);
      const highlightedEn = this._formatHighlightedSentence(quiz.english, quiz.answer);
      const keyword = quiz.answer || '';
      const meaning = quiz.korean || '';
      const explanation = quiz.explanation || '';

      return `
              <div class="quiz-sentence-card ${idx === 0 ? 'active' : ''}" data-index="${idx}" id="quiz-card-${idx}">
                <!-- Speaker Avatar Column (Kelly is talking to you) -->
                <div class="sentence-speaker-col">
                  <div class="sentence-speaker-avatar-wrap">
                    <img src="${this._escapeHtml(this.speakerAvatar)}" alt="${this._escapeHtml(this.speakerName)}" class="sentence-speaker-avatar" loading="lazy" />
                    <span class="speaker-online-dot" aria-hidden="true"></span>
                  </div>
                  <span class="sentence-speaker-name">${this._escapeHtml(this.speakerName)}</span>
                </div>

                <div class="sentence-card-content">
                  <div class="sentence-card-header">
                    <span class="sentence-index-pill">Sentence ${(idx + 1).toString().padStart(2, '0')}</span>
                    ${keyword ? `<span class="sentence-keyword-badge">💡 ${this._escapeHtml(keyword)}</span>` : ''}
                  </div>

                  <div class="sentence-en-text">
                    ${highlightedEn}
                  </div>

                  <div class="sentence-kr-text">
                    ${this._escapeHtml(meaning)}
                  </div>

                  ${explanation ? `
                    <div class="sentence-explanation-text">
                      ${this._escapeHtml(explanation)}
                    </div>
                  ` : ''}
                </div>

                <div class="sentence-card-actions">
                  <button type="button" class="btn-card-play" data-play-index="${idx}" title="이 문장 듣기">
                    <svg class="card-play-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>듣기</span>
                  </button>

                  <button type="button" class="btn-card-bookmark ${isSaved ? 'saved' : ''}" data-bookmark-index="${idx}" title="${isSaved ? '저장된 문장 (단어장에서 제거)' : '단어장에 문장 저장'}">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="${isSaved ? '#F59E0B' : 'none'}" stroke="${isSaved ? '#F59E0B' : 'currentColor'}" stroke-width="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;

    // Initialize isPlayAll by default as active
    this.isPlayAll = true;
  }

  _bindControls() {
    // Play/Pause Main Toggle
    const toggleBtn = this.container.querySelector('#btn-player-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pause();
        } else {
          this.playSentence(this.currentIndex);
        }
      });
    }

    // Prev Button
    const prevBtn = this.container.querySelector('#btn-player-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prev();
      });
    }

    // Next Button
    const nextBtn = this.container.querySelector('#btn-player-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.next();
      });
    }

    // Play All ("전체") Toggle (Activate / Deactivate)
    const playAllBtn = this.container.querySelector('#btn-player-playall');
    if (playAllBtn) {
      playAllBtn.addEventListener('click', () => {
        this.isPlayAll = !this.isPlayAll;
        this._updatePlayAllButtonUI();
        if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
          App.showToast(this.isPlayAll ? '전체 재생 켜짐' : '전체 재생 꺼짐');
        }
      });
    }

    // Speed Toggle (0.8x -> 1.0x -> 1.2x)
    const speedBtn = this.container.querySelector('#btn-player-speed');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (this.playbackRate === 1.0) this.playbackRate = 1.2;
        else if (this.playbackRate === 1.2) this.playbackRate = 0.8;
        else this.playbackRate = 1.0;

        speedBtn.textContent = `${this.playbackRate}x`;
        if (this.currentAudio) {
          this.currentAudio.playbackRate = this.playbackRate;
        }
      });
    }

    // Individual Sentence Card Play Buttons
    const playBtns = this.container.querySelectorAll('[data-play-index]');
    playBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.playIndex, 10);
        if (this.isPlaying && this.currentIndex === idx) {
          this.pause();
        } else {
          this.playSentence(idx);
        }
      });
    });

    // Bookmark / Save Sentence Buttons
    const bookmarkBtns = this.container.querySelectorAll('[data-bookmark-index]');
    bookmarkBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.bookmarkIndex, 10);
        this._bookmarkSentence(idx, btn);
      });
    });

    // Keep bookmark icons synchronized if modified externally (e.g. drawer)
    window.addEventListener('saved-sentences-updated', () => {
      this._syncBookmarkButtons();
    });
  }

  _syncBookmarkButtons() {
    if (!this.container) return;
    const bookmarkBtns = this.container.querySelectorAll('[data-bookmark-index]');
    bookmarkBtns.forEach(btn => {
      const idx = parseInt(btn.dataset.bookmarkIndex, 10);
      const quiz = this.quizzes[idx];
      if (!quiz) return;
      const cleanEn = this._getCleanSentence(quiz.english, quiz.answer);
      const isSaved = Storage.isSentenceSaved(this.lessonId, cleanEn);
      btn.classList.toggle('saved', isSaved);
      btn.title = isSaved ? '저장된 문장 (단어장에서 제거)' : '단어장에 문장 저장';
      btn.innerHTML = isSaved ? `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#F59E0B" stroke="#F59E0B" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      ` : `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      `;
    });
  }

  _updatePlayAllButtonUI() {
    const playAllBtn = this.container.querySelector('#btn-player-playall');
    if (!playAllBtn) return;

    if (this.isPlayAll) {
      playAllBtn.classList.add('active');
      playAllBtn.title = '전체 재생 켜짐 (클릭 시 끄기)';
    } else {
      playAllBtn.classList.remove('active');
      playAllBtn.title = '전체 재생 꺼짐 (클릭 시 켜기)';
    }
  }

  playSentence(index) {
    if (index < 0 || index >= this.quizzes.length) return;

    this.stopAudio();
    this.currentIndex = index;
    this.isPlaying = true;

    const quiz = this.quizzes[index];
    const cleanEn = this._getCleanSentence(quiz.english, quiz.answer);
    const audioUrl = this._resolveAudioUrl(index);

    this._updatePlayerUI(index, cleanEn);

    if (audioUrl) {
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.playbackRate = this.playbackRate;

      this.currentAudio.addEventListener('timeupdate', () => {
        this._updateProgress(this.currentAudio.currentTime, this.currentAudio.duration);
      });

      this.currentAudio.addEventListener('ended', () => {
        this._onSentenceAudioEnded();
      });

      this.currentAudio.addEventListener('error', (e) => {
        console.warn('Audio file error, falling back to Web Speech Synthesis:', audioUrl, e);
        this._playWithSpeechSynthesis(cleanEn);
      });

      const playPromise = this.currentAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback prevented or failed, using speech synthesis:', err);
          this._playWithSpeechSynthesis(cleanEn);
        });
      }
    } else {
      this._playWithSpeechSynthesis(cleanEn);
    }
  }

  _playWithSpeechSynthesis(text) {
    if (!('speechSynthesis' in window)) {
      this._onSentenceAudioEnded();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = this.playbackRate;

    // Simulate progress timer
    const estimatedDuration = Math.max(2, (text.split(' ').length / 2.5) / this.playbackRate);
    let elapsed = 0;
    clearInterval(this.progressInterval);
    this.progressInterval = setInterval(() => {
      elapsed += 0.2;
      this._updateProgress(elapsed, estimatedDuration);
      if (elapsed >= estimatedDuration) {
        clearInterval(this.progressInterval);
      }
    }, 200);

    utterance.onend = () => {
      clearInterval(this.progressInterval);
      this._onSentenceAudioEnded();
    };

    utterance.onerror = () => {
      clearInterval(this.progressInterval);
      this._onSentenceAudioEnded();
    };

    window.speechSynthesis.speak(utterance);
  }

  _onSentenceAudioEnded() {
    this._updateProgress(1, 1);

    if (this.isPlayAll) {
      // Natural 700ms speaking pause before next sentence
      clearTimeout(this.autoAdvanceTimer);
      this.autoAdvanceTimer = setTimeout(() => {
        if (!this.isPlaying) return;

        if (this.currentIndex < this.quizzes.length - 1) {
          this.playSentence(this.currentIndex + 1);
        } else if (this.isLoop) {
          this.playSentence(0);
        } else {
          this.pause();
          if (typeof App !== 'undefined' && App.showToast) {
            App.showToast('🎉 모든 문장 연속 복습을 마쳤습니다!');
          }
        }
      }, 700);
    } else {
      this.pause();
    }
  }

  pause() {
    this.isPlaying = false;
    this.stopAudio();

    const playerBar = this.container.querySelector('#review-player-bar');
    if (playerBar) playerBar.classList.remove('is-playing');

    const toggleBtn = this.container.querySelector('#btn-player-toggle');
    if (toggleBtn) {
      const iconPlay = toggleBtn.querySelector('.icon-play');
      const iconPause = toggleBtn.querySelector('.icon-pause');
      if (iconPlay) iconPlay.style.display = 'block';
      if (iconPause) iconPause.style.display = 'none';
    }

    const cards = this.container.querySelectorAll('.quiz-sentence-card');
    cards.forEach(c => c.classList.remove('playing'));
  }

  stopAudio() {
    clearTimeout(this.autoAdvanceTimer);
    clearInterval(this.progressInterval);

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (_) { }
      this.currentAudio = null;
    }

    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (_) { }
    }
  }

  prev() {
    const target = this.currentIndex > 0 ? this.currentIndex - 1 : this.quizzes.length - 1;
    this.playSentence(target);
  }

  next() {
    const target = this.currentIndex < this.quizzes.length - 1 ? this.currentIndex + 1 : 0;
    this.playSentence(target);
  }

  _updatePlayerUI(index, cleanEn) {
    const playerBar = this.container.querySelector('#review-player-bar');
    if (playerBar) playerBar.classList.add('is-playing');

    const badge = this.container.querySelector('#player-track-badge');
    if (badge) {
      const cur = (index + 1).toString().padStart(2, '0');
      const total = this.quizzes.length.toString().padStart(2, '0');
      badge.textContent = `${cur}/${total}`;
    }

    const title = this.container.querySelector('#player-track-title');
    if (title) {
      title.textContent = cleanEn;
      title.title = cleanEn;
    }

    const toggleBtn = this.container.querySelector('#btn-player-toggle');
    if (toggleBtn) {
      const iconPlay = toggleBtn.querySelector('.icon-play');
      const iconPause = toggleBtn.querySelector('.icon-pause');
      if (iconPlay) iconPlay.style.display = 'none';
      if (iconPause) iconPause.style.display = 'block';
    }

    // Update active card styling and position at the TOP of the review section
    const cards = this.container.querySelectorAll('.quiz-sentence-card');
    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('playing');

        // Scroll to TOP of the section (accounting for sticky navigation & player bar)
        const playerBarHeight = playerBar ? playerBar.offsetHeight : 54;
        const navHeight = 64;
        const topMargin = 16;
        const totalStickyOffset = navHeight + playerBarHeight + topMargin;

        const cardRect = card.getBoundingClientRect();
        const absoluteCardTop = window.pageYOffset + cardRect.top;
        const targetScrollY = Math.max(0, absoluteCardTop - totalStickyOffset);

        try {
          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
          });
        } catch (_) {
          window.scrollTo(0, targetScrollY);
        }
      } else {
        card.classList.remove('playing');
      }
    });
  }

  _updateProgress(currentTime, duration) {
    const currentLabel = this.container.querySelector('#player-current-time');
    const totalLabel = this.container.querySelector('#player-total-time');
    const fill = this.container.querySelector('#player-progress-fill');

    if (currentLabel) currentLabel.textContent = this._formatTime(currentTime);
    if (totalLabel && duration && !isNaN(duration)) {
      totalLabel.textContent = this._formatTime(duration);
    }

    if (fill && duration && duration > 0) {
      const percent = Math.min(100, Math.max(0, (currentTime / duration) * 100));
      fill.style.width = `${percent}%`;
    }
  }

  _formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  _bookmarkSentence(index, btn) {
    const quiz = this.quizzes[index];
    if (!quiz) return;

    const cleanEn = this._getCleanSentence(quiz.english, quiz.answer);
    const kr = quiz.korean || '';
    const currentlySaved = Storage.isSentenceSaved(this.lessonId, cleanEn);

    if (currentlySaved) {
      Storage.removeSavedSentenceByText(this.lessonId, cleanEn);

      if (btn) {
        btn.classList.remove('saved');
        btn.title = '단어장에 문장 저장';
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        `;
      }

      if (typeof App !== 'undefined') {
        App.updateSentenceBadge();
        if (typeof App.showToast === 'function') {
          App.showToast('단어장에서 문장이 제거되었습니다.');
        }
      }
      window.dispatchEvent(new CustomEvent('saved-sentences-updated'));
    } else {
      Storage.saveSentence(this.lessonId, {
        en: cleanEn,
        kr: kr,
        timestamp: 0
      });

      if (btn) {
        btn.classList.add('saved');
        btn.title = '저장된 문장 (단어장에서 제거)';
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#F59E0B" stroke="#F59E0B" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        `;
      }

      if (typeof App !== 'undefined') {
        App.updateSentenceBadge();
        if (typeof App.showToast === 'function') {
          App.showToast('⭐ 단어장에 문장이 저장되었습니다!', 'success');
        }
        if (typeof App.checkFirstSentenceSaveNotice === 'function') {
          App.checkFirstSentenceSaveNotice();
        }
      }
      window.dispatchEvent(new CustomEvent('saved-sentences-updated'));
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReviewPlayer;
}

