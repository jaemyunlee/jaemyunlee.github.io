/**
 * Video & Interactive Script Sync for RhyRhy English
 * Handles YouTube IFrame API, embed restriction fallbacks, bilingual subtitles,
 * auto-scroll & highlight, jump-to-sentence, and playback speed controls.
 */
class VideoScriptPlayer {
  constructor(options = {}) {
    this.lessonId = options.lessonId;
    this.youtubeId = options.youtubeId || 'N5IqYrNUqmQ';
    this.scriptData = options.scriptData || [];
    this.dragDropManager = options.dragDropManager;
    this.onVideoEnd = options.onVideoEnd || (() => { });
    this.onScriptComplete = options.onScriptComplete || (() => { });
    this.hasCompletedNudgeTriggered = false;

    this.player = null;
    this.playerReady = false;
    this.timeUpdateInterval = null;
    this.activeSentenceIndex = -1;
    this.isUserScrolling = false;
    this.userScrollTimeout = null;
    this.subtitleMode = 'both'; // 'both' | 'en' | 'kr'

    // Fallback sync mode states
    this.isFallbackMode = false;
    this.simTime = 0;
    this.simTimer = null;
    this.simRate = 1.0;
    this.maxDuration = (this.scriptData.length > 0 && this.scriptData[this.scriptData.length - 1].end)
      ? this.scriptData[this.scriptData.length - 1].end
      : 398.32;

    this.scriptListContainer = document.getElementById('script-list-container');
    this.videoContainer = document.getElementById('youtube-player-container');
  }

  init() {
    this.renderScriptItems();
    this.initYouTubePlayer();
    this._bindControls();
  }

  initYouTubePlayer() {
    // Timeout safeguard: If YT API doesn't initialize or connect within 4.5s, fallback
    const initTimeout = setTimeout(() => {
      if (!this.playerReady && !this.player) {
        console.warn('YouTube Iframe API timed out, activating sync player mode');
        this._renderPlayerFallback();
      }
    }, 4500);

    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      clearTimeout(initTimeout);
      this._createPlayer();
    } else {
      const prevTag = document.getElementById('yt-iframe-api-script');
      if (!prevTag) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = () => {
          clearTimeout(initTimeout);
          this._renderPlayerFallback();
        };
        document.head.appendChild(tag);
      }

      const prevOnReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(initTimeout);
        if (prevOnReady) prevOnReady();
        this._createPlayer();
      };
    }
  }

  _createPlayer() {
    if (!document.getElementById('youtube-player-container')) return;

    try {
      const origin = window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')
        ? window.location.origin
        : undefined;

      const playerVars = {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        controls: 1,
        fs: 1,
        enablejsapi: 1,
        cc_load_policy: 0, // Explicitly disable closed captions by default
        iv_load_policy: 3  // Turn off video annotations
      };
      if (origin) {
        playerVars.origin = origin;
      }

      this.player = new window.YT.Player('youtube-player-container', {
        videoId: this.youtubeId,
        playerVars: playerVars,
        events: {
          onReady: () => {
            this.playerReady = true;
            try {
              if (this.player && typeof this.player.unloadModule === 'function') {
                this.player.unloadModule('captions');
                this.player.unloadModule('cc');
              }
            } catch (_) { }
          },
          onStateChange: (event) => {
            this._onPlayerStateChange(event);
          },
          onError: (event) => {
            console.warn('YouTube Player reported error code:', event.data);
            // Error 101 or 150: Embed playback disabled by video owner / copyright restrictions
            // Error 100: Video not found
            // Error 2: Invalid parameter
            // Error 5: HTML5 error
            this._renderPlayerFallback(event.data);
          }
        }
      });
    } catch (e) {
      console.warn('YouTube Player initialization failed, activating sync player', e);
      this._renderPlayerFallback();
    }
  }

  _renderPlayerFallback(errorCode) {
    this.isFallbackMode = true;
    if (this.player && this.player.destroy) {
      try { this.player.destroy(); } catch (_) { }
    }
    this.player = null;

    if (!this.videoContainer) return;
    this.videoContainer.innerHTML = `
      <div class="video-embed-fallback animate-fade-in">
        <div class="fallback-header">
          <div class="fallback-warning-badge">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F59E0B" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <span>YouTube 외부 임베드 재생 안내</span>
          </div>
          <p class="fallback-text">
            이 영상은 유튜브 정책/음원 저작권에 의해 <strong>외부 사이트 임베드가 제한</strong>되어 있습니다.<br>
            아래 버튼을 눌러 <strong>YouTube에서 직접 시청</strong>하시거나 <strong>동기화 플레이어</strong>로 스크립트를 학습해보세요!
          </p>
        </div>

        <div class="fallback-action-box">
          <a href="https://www.youtube.com/watch?v=${this.youtubeId}" target="_blank" rel="noopener noreferrer" class="btn-youtube-watch">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>▶ YouTube에서 영상 열기 (새 창)</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M7 17l9.2-9.2M17 17V8H8"/>
            </svg>
          </a>
        </div>

        <div class="fallback-sync-controller">
          <div class="sync-ctrl-header">
            <span class="sync-badge">🎙️ 스크립트 실시간 동기화 플레이어</span>
            <span class="sync-time-display" id="sync-time-display">0:00 / ${this._formatTimestamp(this.maxDuration)}</span>
          </div>
          <div class="sync-progress-bar-track" id="sync-progress-track" title="클릭하여 원하는 시간대로 이동">
            <div class="sync-progress-bar-fill" id="sync-progress-fill" style="width: 0%;"></div>
          </div>
          <div class="sync-buttons-row">
            <button type="button" class="btn btn-ctrl" id="btn-sync-rewind" title="Rewind 5s">⏪ -5s</button>
            <button type="button" class="btn btn-ctrl btn-primary" id="btn-sync-toggle" style="padding: 0 16px;">▶ 동기화 재생</button>
            <button type="button" class="btn btn-ctrl" id="btn-sync-forward" title="Forward 5s">+5s ⏩</button>
          </div>
        </div>
      </div>
    `;

    this._bindFallbackControls();
  }

  _bindFallbackControls() {
    const toggleBtn = this.videoContainer.querySelector('#btn-sync-toggle');
    const rewindBtn = this.videoContainer.querySelector('#btn-sync-rewind');
    const fwdBtn = this.videoContainer.querySelector('#btn-sync-forward');
    const track = this.videoContainer.querySelector('#sync-progress-track');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.simTimer) {
          this._pauseFallbackSync();
        } else {
          this._startFallbackSync();
        }
      });
    }

    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        this.simTime = Math.max(0, this.simTime - 5);
        this._updateFallbackUI();
      });
    }

    if (fwdBtn) {
      fwdBtn.addEventListener('click', () => {
        this.simTime = Math.min(this.maxDuration, this.simTime + 5);
        this._updateFallbackUI();
      });
    }

    if (track) {
      track.addEventListener('click', (e) => {
        const rect = track.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.simTime = clickRatio * this.maxDuration;
        this._updateFallbackUI();
      });
    }
  }

  _startFallbackSync() {
    this._pauseFallbackSync();
    const toggleBtn = this.videoContainer.querySelector('#btn-sync-toggle');
    if (toggleBtn) toggleBtn.textContent = '⏸ 일시 정지';

    this.simTimer = setInterval(() => {
      this.simTime += 0.2 * this.simRate;
      this._updateFallbackUI();

      if (this.simTime >= this.maxDuration) {
        this._pauseFallbackSync();
        this.onVideoEnd();
      }
    }, 200);
  }

  _pauseFallbackSync() {
    if (this.simTimer) {
      clearInterval(this.simTimer);
      this.simTimer = null;
    }
    const toggleBtn = this.videoContainer.querySelector('#btn-sync-toggle');
    if (toggleBtn) toggleBtn.textContent = '▶ 동기화 재생';
  }

  _updateFallbackUI() {
    this._syncCurrentTime(this.simTime);
    const display = this.videoContainer.querySelector('#sync-time-display');
    const fill = this.videoContainer.querySelector('#sync-progress-fill');

    if (display) {
      display.textContent = `${this._formatTimestamp(this.simTime)} / ${this._formatTimestamp(this.maxDuration)}`;
    }
    if (fill) {
      const pct = Math.min(100, Math.max(0, (this.simTime / (this.maxDuration || 1)) * 100));
      fill.style.width = `${pct}%`;
    }
  }

  _onPlayerStateChange(event) {
    // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === window.YT.PlayerState.PLAYING) {
      this._startTimeTracking();
      this._updatePlayPauseButton(true);
    } else {
      this._stopTimeTracking();
      this._updatePlayPauseButton(false);
      if (event.data === window.YT.PlayerState.ENDED) {
        this.onVideoEnd();
      }
    }
  }

  _updatePlayPauseButton(isPlaying = false) {
    const playPauseIcon = document.getElementById('play-pause-icon');
    if (playPauseIcon) {
      playPauseIcon.textContent = isPlaying ? '⏸ 일시정지' : '▶ 재생';
    }
    const miniPlayPauseIcon = document.getElementById('mini-play-pause-icon');
    if (miniPlayPauseIcon) {
      miniPlayPauseIcon.textContent = isPlaying ? '⏸' : '▶';
    }
    const miniStatusText = document.getElementById('mini-status-text');
    if (miniStatusText) {
      miniStatusText.textContent = isPlaying ? '오디오 재생 중 🎧' : '일시 정지됨';
    }
  }

  togglePlayPause() {
    if (this.isFallbackMode) {
      if (this.simTimer) {
        this._pauseFallbackSync();
        this._updatePlayPauseButton(false);
      } else {
        this._startFallbackSync();
        this._updatePlayPauseButton(true);
      }
    } else if (this.player) {
      try {
        const state = (this.player.getPlayerState && typeof this.player.getPlayerState === 'function')
          ? this.player.getPlayerState()
          : -1;
        if (state === 1) { // 1 = PLAYING
          this.player.pauseVideo();
        } else {
          this.player.playVideo();
        }
      } catch (e) {
        console.warn('Could not toggle play/pause:', e);
      }
    }
  }

  _startTimeTracking() {
    this._stopTimeTracking();
    this.timeUpdateInterval = setInterval(() => {
      if (this.player && this.player.getCurrentTime) {
        const currentTime = this.player.getCurrentTime();
        this._syncCurrentTime(currentTime);

        const duration = this.player.getDuration ? this.player.getDuration() : 0;
        if (duration > 0 && currentTime >= duration - 1) {
          this.onVideoEnd();
          this._triggerScriptComplete();
        }
      }
    }, 120);
  }

  _stopTimeTracking() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  _triggerScriptComplete() {
    if (this.hasCompletedNudgeTriggered) return;
    this.hasCompletedNudgeTriggered = true;
    if (this.onScriptComplete) {
      this.onScriptComplete();
    }
  }

  _syncCurrentTime(currentTime) {
    let activeIdx = -1;
    for (let i = 0; i < this.scriptData.length; i++) {
      const item = this.scriptData[i];
      if (currentTime >= item.start && currentTime <= item.end) {
        activeIdx = i;
        break;
      }
    }

    if (activeIdx !== this.activeSentenceIndex) {
      this.setActiveSentence(activeIdx);

      // If active sentence is the very last one, trigger completion nudge after brief delay
      if (activeIdx === this.scriptData.length - 1 && !this.hasCompletedNudgeTriggered) {
        setTimeout(() => {
          this._triggerScriptComplete();
        }, 3000);
      }
    }
  }

  setActiveSentence(index) {
    this.activeSentenceIndex = index;
    const cards = this.scriptListContainer.querySelectorAll('.script-sentence-card');

    cards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
        card.setAttribute('aria-current', 'true');

        // Smooth scroll active sentence to the TOP of the script section
        if (!this.isUserScrolling && this.scriptListContainer) {
          try {
            const containerRect = this.scriptListContainer.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();
            const targetScrollTop = this.scriptListContainer.scrollTop + (cardRect.top - containerRect.top) - 10;

            this.scriptListContainer.scrollTo({
              top: Math.max(0, targetScrollTop),
              behavior: 'smooth'
            });
          } catch (_) {
            card.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      } else {
        card.classList.remove('active');
        card.removeAttribute('aria-current');
      }
    });
  }

  seekToSentence(index) {
    const item = this.scriptData[index];
    if (!item) return;

    if (this.isFallbackMode) {
      // If clicking the active sentence while playing, pause it
      if (this.activeSentenceIndex === index && this.simTimer) {
        this._pauseFallbackSync();
        this._updatePlayPauseButton(false);
        return;
      }
      this.simTime = item.start;
      this._updateFallbackUI();
      this._startFallbackSync();
      this._updatePlayPauseButton(true);
    } else if (this.player) {
      try {
        const state = (this.player.getPlayerState && typeof this.player.getPlayerState === 'function')
          ? this.player.getPlayerState()
          : -1;
        // If clicking the active playing sentence, pause the video!
        if (this.activeSentenceIndex === index && state === 1) {
          this.player.pauseVideo();
          return;
        }
        this.player.seekTo(item.start, true);
        this.player.playVideo();
      } catch (_) { }
    }
    this.setActiveSentence(index);
  }

  renderScriptItems() {
    if (!this.scriptListContainer) return;

    this.scriptListContainer.innerHTML = '';

    this.scriptData.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'script-sentence-card';
      card.dataset.index = index;
      card.dataset.start = item.start;
      card.dataset.end = item.end;
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Jump to sentence: ${item.en}`);

      const timeFormatted = this._formatTimestamp(item.start);

      card.innerHTML = `
        <div class="script-card-header">
          <span class="script-timestamp" title="Click to jump or play/pause (${timeFormatted})">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            ${timeFormatted}
          </span>
        </div>

        <div class="script-card-body">
          <p class="sentence-en">${this._escapeHtml(item.en)}</p>
          <p class="sentence-kr">${this._escapeHtml(item.kr)}</p>
        </div>
      `;

      // Jump to video or pause on card click
      card.addEventListener('click', () => {
        this.seekToSentence(index);
      });

      // Keyboard navigation (Enter or Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.seekToSentence(index);
        }
      });

      this.scriptListContainer.appendChild(card);
    });

    // Append completion banner at bottom of script list
    const completionBanner = document.createElement('div');
    completionBanner.className = 'script-completion-banner';
    completionBanner.id = 'script-completion-banner';
    completionBanner.innerHTML = `
      <div class="completion-banner-text">
        <span class="banner-badge">🎉 마지막 문장까지 완료!</span>
        <h4>모든 스크립트 학습을 완료하셨습니다!</h4>
        <p>오늘 배운 핵심 어휘와 표현을 활용해 직접 나만의 문장을 영작해볼까요?</p>
      </div>
      <button type="button" class="btn btn-primary btn-goto-step3" id="btn-banner-goto-step3">
        <span>✍️ Step 3: 문장 작성 & 댓글 남기기 ▶</span>
      </button>
    `;
    const bannerBtn = completionBanner.querySelector('#btn-banner-goto-step3');
    if (bannerBtn) {
      bannerBtn.addEventListener('click', () => {
        this._triggerScriptComplete();
      });
    }
    this.scriptListContainer.appendChild(completionBanner);

    // Detect manual scrolling to temporarily avoid jerky auto-scrolling
    this.scriptListContainer.addEventListener('scroll', () => {
      this.isUserScrolling = true;
      clearTimeout(this.userScrollTimeout);
      this.userScrollTimeout = setTimeout(() => {
        this.isUserScrolling = false;
      }, 1800);
    }, { passive: true });
  }

  _bindControls() {
    // PiP Window Collapse / Expand Toggle
    const pipToggleSizeBtn = document.getElementById('btn-pip-toggle-size');
    const pipMiniExpandBtn = document.getElementById('btn-mini-expand');
    const pipMiniPlayPauseBtn = document.getElementById('btn-mini-play-pause');
    const pipWindow = document.getElementById('video-pip-window');

    if (pipToggleSizeBtn && pipWindow) {
      pipToggleSizeBtn.addEventListener('click', () => {
        pipWindow.classList.toggle('collapsed');
      });
    }

    if (pipMiniExpandBtn && pipWindow) {
      pipMiniExpandBtn.addEventListener('click', () => {
        pipWindow.classList.remove('collapsed');
      });
    }

    if (pipMiniPlayPauseBtn) {
      pipMiniPlayPauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    // Play / Pause toggle button
    const playPauseBtn = document.getElementById('btn-play-pause-toggle');
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    // Subtitle toggle buttons: 'both', 'en', 'kr'
    const toggleBtns = document.querySelectorAll('[data-subtitle-mode]');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.subtitleMode;
        this.setSubtitleMode(mode);
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Speed control buttons
    const speedBtns = document.querySelectorAll('[data-speed]');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.dataset.speed);
        this.simRate = rate;
        if (this.player && this.player.setPlaybackRate) {
          try { this.player.setPlaybackRate(rate); } catch (_) { }
        }
        speedBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Rewind / Forward 5s buttons (if present)
    const rewindBtn = document.getElementById('btn-rewind-5');
    if (rewindBtn) {
      rewindBtn.addEventListener('click', () => {
        if (this.isFallbackMode) {
          this.simTime = Math.max(0, this.simTime - 5);
          this._updateFallbackUI();
        } else if (this.player && this.player.getCurrentTime) {
          const t = Math.max(0, this.player.getCurrentTime() - 5);
          this.player.seekTo(t, true);
        }
      });
    }

    const forwardBtn = document.getElementById('btn-forward-5');
    if (forwardBtn) {
      forwardBtn.addEventListener('click', () => {
        if (this.isFallbackMode) {
          this.simTime = Math.min(this.maxDuration, this.simTime + 5);
          this._updateFallbackUI();
        } else if (this.player && this.player.getCurrentTime) {
          const t = this.player.getCurrentTime() + 5;
          this.player.seekTo(t, true);
        }
      });
    }
  }

  setSubtitleMode(mode) {
    this.subtitleMode = mode;
    if (!this.scriptListContainer) return;

    this.scriptListContainer.classList.remove('mode-both', 'mode-en-only', 'mode-kr-only');
    if (mode === 'en') {
      this.scriptListContainer.classList.add('mode-en-only');
    } else if (mode === 'kr') {
      this.scriptListContainer.classList.add('mode-kr-only');
    } else {
      this.scriptListContainer.classList.add('mode-both');
    }
  }

  _formatTimestamp(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoScriptPlayer;
}

