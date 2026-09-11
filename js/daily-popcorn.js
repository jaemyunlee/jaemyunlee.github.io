/**
 * RhyRhy English - Daily Popcorn English Feature
 * Manages bite-sized Markdown conversation lessons,
 * "이 표현을 아시나요?" knowledge check, multi-audio dialogue playback,
 * target expression highlighting, translation reveal, and centralized Saved integration.
 */

const DailyPopcornManager = {
  currentMetadata: [],
  currentLesson: null,
  activeLineIndex: -1,
  audioElement: null,
  isPlayingAll: false,
  _isTransitioning: false,
  _audioCache: {},

  async init() {
    const isDailyPage = window.location.pathname.endsWith('/daily.html') || window.location.pathname.endsWith('/daily');
    if (isDailyPage) {
      await this.initStandalonePage();
    }
  },

  /**
   * Handle Popcorn Transition Animation (for navbar button or "다음 팝콘 표현 뽑기" button):
   * Popcorn icon flies from button to screen center, grows bigger, pops with particles and sound,
   * then navigates to destination URL or executes completion callback.
   * @param {HTMLElement} btn
   * @param {string|Function} [destOrCallback]
   */
  triggerPopcornTransition(btn, destOrCallback) {
    if (this._isTransitioning) return;
    this._isTransitioning = true;

    this._playPopSound();

    const base = this._getBasePath();
    const iconEl = btn ? (btn.querySelector('.nav-popcorn-icon') || btn) : null;
    const rect = iconEl ? iconEl.getBoundingClientRect() : { left: window.innerWidth - 60, top: 20, width: 24, height: 24 };
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2;

    const backdrop = document.createElement('div');
    backdrop.className = 'popcorn-flyer-backdrop';
    document.body.appendChild(backdrop);

    const flyer = document.createElement('div');
    flyer.className = 'popcorn-nav-flyer';
    flyer.innerHTML = `<img src="${base}assets/img/popcorn/popcorn-box-hd.png" alt="Popcorn" class="popcorn-flyer-hd-img">`;
    flyer.style.left = `${startX}px`;
    flyer.style.top = `${startY}px`;
    document.body.appendChild(flyer);

    requestAnimationFrame(() => {
      backdrop.classList.add('active');
      flyer.classList.add('flying-to-center');
      flyer.style.left = `${targetX}px`;
      flyer.style.top = `${targetY}px`;
    });

    setTimeout(() => {
      flyer.classList.remove('flying-to-center');
      flyer.classList.add('pop-burst');
      this._playPopSound();
      this._spawnCenterBurst(targetX, targetY);
    }, 380);

    setTimeout(() => {
      flyer.remove();
      backdrop.remove();
      this._isTransitioning = false;
      if (typeof destOrCallback === 'function') {
        destOrCallback();
      } else if (typeof destOrCallback === 'string' && destOrCallback) {
        window.location.href = destOrCallback;
      }
    }, 620);
  },

  /**
   * Spawn explosion particles outward from screen center using realistic popcorn images (Issue #47)
   */
  _spawnCenterBurst(centerX, centerY) {
    const base = this._getBasePath();
    const kernelImages = [
      `${base}assets/img/popcorn/popcorn-kernel-1.png`,
      `${base}assets/img/popcorn/popcorn-kernel-2.png`,
      `${base}assets/img/popcorn/popcorn-kernel-3.png`,
      `${base}assets/img/popcorn/popcorn-kernel-1.png`,
      `${base}assets/img/popcorn/popcorn-kernel-2.png`,
      `${base}assets/img/popcorn/popcorn-kernel-3.png`,
      `${base}assets/img/popcorn/popcorn-kernel-1.png`,
      `${base}assets/img/popcorn/popcorn-kernel-2.png`
    ];

    kernelImages.forEach((imgSrc, i) => {
      const el = document.createElement('span');
      el.className = 'popcorn-particle';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = 'Popcorn Particle';
      img.className = 'popcorn-particle-img';
      el.appendChild(img);

      const angle = (i / kernelImages.length) * (Math.PI * 2) + (Math.random() * 0.3 - 0.15);
      const distance = 90 + Math.random() * 95;
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
   * Synthesize cheerful Web Audio "pop" sound
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
   * Initialize standalone daily.html page
   */
  async initStandalonePage() {
    const container = document.getElementById('daily-page-container');
    if (!container) return;

    // 1. Fetch metadata.json
    try {
      const base = this._getBasePath();
      const res = await fetch(`${base}popcorn/metadata.json?t=${Date.now()}`, { cache: 'no-cache' });
      if (res.ok) {
        this.currentMetadata = await res.json();
      }
    } catch (e) {
      console.warn('Could not load popcorn/metadata.json, checking fallbacks', e);
    }

    // 2. Determine lesson to display
    await this.pickNextLesson(container);
  },

  /**
   * Pick and load the next eligible popcorn lesson
   * @param {HTMLElement} [container]
   * @param {string} [specificId]
   * @param {string} [excludeId]
   */
  async pickNextLesson(container, specificId, excludeId) {
    container = container || document.getElementById('daily-page-container');
    if (!container) return;

    this.stopAudio();

    // Check URL param if not specifically provided and not explicitly picking a new/random lesson
    if (!specificId && !excludeId && typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('id')) {
        specificId = params.get('id');
      }
    }

    // 1. Check if daily study limit of 10 has been reached (unless overriding with ?id=...)
    if (!specificId && Storage.isPopcornDailyLimitReached(10)) {
      this._renderCompletionState(container, 'daily_limit');
      return;
    }

    let candidate = null;

    if (specificId && this.currentMetadata.length > 0) {
      candidate = this.currentMetadata.find(item => item.id === specificId);
    }

    if (!candidate && this.currentMetadata.length > 0) {
      // Filter candidates using 30-day cooldown and permanent known skip
      let available = Storage.getAvailablePopcornLessons(this.currentMetadata);

      // If excludeId is provided (e.g., clicking navbar icon or next button to get a *new* lesson),
      // avoid picking the exact same lesson if there are alternatives
      if (excludeId && available.length > 1) {
        const alternatives = available.filter(item => item.id !== excludeId);
        if (alternatives.length > 0) {
          available = alternatives;
        }
      }

      if (available.length > 0) {
        candidate = available[Math.floor(Math.random() * available.length)];
      } else {
        // All lessons are completed / in cooldown / known
        this._renderCompletionState(container, 'all_exhausted');
        return;
      }
    }

    // Fallback if no candidate from metadata (legacy phrase support)
    if (!candidate) {
      const phrases = typeof DAILY_PHRASES !== 'undefined' ? DAILY_PHRASES : [];
      if (phrases.length > 0) {
        const fallbackPhrase = Storage.getTodayDailyPhrase(phrases);
        this._renderLegacyPhrase(container, fallbackPhrase);
        return;
      }
      this._renderCompletionState(container);
      return;
    }

    // Fetch and parse candidate Markdown file
    try {
      const base = this._getBasePath();
      const mdRes = await fetch(`${base}popcorn/${candidate.file}?t=${Date.now()}`, { cache: 'no-cache' });
      if (!mdRes.ok) throw new Error(`HTTP ${mdRes.status}`);
      const mdText = await mdRes.text();

      if (typeof PopcornParser !== 'undefined') {
        this.currentLesson = PopcornParser.parse(mdText);
      } else {
        throw new Error('PopcornParser is not loaded');
      }

      if (!this.currentLesson) throw new Error('Failed to parse lesson');
      this.currentLesson.id = candidate.id;
      this.currentLesson.metadata = candidate;

      // Start at Stage 1: Knowledge Check ("이 표현을 아시나요?")
      this.renderStage1KnowledgeCheck(container);
    } catch (err) {
      console.error('Failed to load popcorn lesson markdown:', err);
      container.innerHTML = `
        <div class="popcorn-error-card">
          <p>⚠️ 팝콘 레슨을 불러오는 중 오류가 발생했습니다.</p>
          <button type="button" class="btn-popcorn-action" onclick="DailyPopcornManager.pickNextLesson()">다시 시도</button>
        </div>
      `;
    }
  },

  /**
   * Render Stage 1: "이 표현을 아시나요?" Knowledge Check Card
   */
  renderStage1KnowledgeCheck(container) {
    const lesson = this.currentLesson;
    if (!lesson || !container) return;

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    container.innerHTML = `
      <div class="popcorn-check-card" id="popcorn-check-card">
        <div class="popcorn-check-content">
          <span class="popcorn-check-prompt">${lesson.prompt || '이 표현을 아시나요?'}</span>
          <h2 class="popcorn-expression-banner">"${lesson.expression}"</h2>
        </div>

        <div class="popcorn-check-actions">
          <button type="button" class="btn-popcorn-action btn-popcorn-known" id="btn-popcorn-known" title="이 표현을 알고 있어요 (2달 뒤 복습 / 2회 연속 마스터)">
            <span>👍 알아요</span>
          </button>
          <button type="button" class="btn-popcorn-action btn-popcorn-learn" id="btn-popcorn-learn" title="이 표현을 학습할래요">
            <span>🚀 몰라요 (학습하기)</span>
          </button>
        </div>
      </div>
    `;

    // Bind Stage 1 buttons (Issue #47)
    const knownBtn = document.getElementById('btn-popcorn-known');
    if (knownBtn) {
      knownBtn.addEventListener('click', () => {
        const res = Storage.recordPopcornKnow(lesson.id);
        Storage.recordPopcornAction(lesson.id, lesson.expression, 'skip');
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackPopcornAction === 'function') {
          Analytics.trackPopcornAction(lesson.id, lesson.expression, 'skip');
        }

        this._playPopSound();
        if (res.isPermanent) {
          this._showToast(`'${lesson.expression}' 표현을 마스터 목록에 보관했어요! 다시 표시되지 않습니다 👍`);
        } else {
          this._showToast(`'${lesson.expression}' 표현을 2달 뒤에 다시 복습할 수 있도록 예약했어요 👍`);
        }

        // Clean query parameter when moving to next lesson
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
        this.pickNextLesson(container, null, lesson.id);
      });
    }

    const learnBtn = document.getElementById('btn-popcorn-learn');
    if (learnBtn) {
      learnBtn.addEventListener('click', async () => {
        // Clicking "몰라요" resets streak if on second play (Issue #47)
        Storage.recordPopcornLearn(lesson.id);
        Storage.recordPopcornAction(lesson.id, lesson.expression, 'learn');
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackPopcornAction === 'function') {
          Analytics.trackPopcornAction(lesson.id, lesson.expression, 'learn');
        }

        // "몰라요" counts towards the 10 quick lessons daily limit
        Storage.incrementPopcornDailyStudyCount();
        learnBtn.disabled = true;
        learnBtn.innerHTML = '<span>⏳ 대화 준비 중...</span>';
        await this.preloadLessonAudio(lesson);
        this.renderStage2ConversationStudy(container);
      });
    }
  },

  /**
   * Render Stage 2: Conversation Study Experience with Multi-Audio Dialogue
   */
  renderStage2ConversationStudy(container) {
    const lesson = this.currentLesson;
    if (!lesson || !container) return;

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const isTargetSaved = this._isTargetSentenceSaved(lesson);

    // Identify unique speakers to assign distinctive styles
    const uniqueSpeakers = [];
    (lesson.dialogue || []).forEach(line => {
      const s = (line.speaker || '').trim();
      if (s && !uniqueSpeakers.includes(s)) uniqueSpeakers.push(s);
    });

    // Build dialogue list HTML
    const dialogueHtml = (lesson.dialogue || []).map((line, idx) => {
      const speakerIdx = uniqueSpeakers.indexOf((line.speaker || '').trim());
      const isSpeakerA = speakerIdx <= 0;
      const speakerClass = isSpeakerA ? 'speaker-a' : 'speaker-b';
      const speakerShort = (line.speaker || 'A').trim().charAt(0).toUpperCase();
      const highlightClass = line.hasExpression ? 'has-target-expression' : '';
      const avatarUrl = this._resolveAvatarPath(line.avatar || (isSpeakerA ? 'wayne.jpeg' : 'kelly.jpg'));

      return `
        <div class="dialogue-bubble ${speakerClass} ${highlightClass}" id="dialogue-bubble-${idx}" data-line-index="${idx}">
          <div class="dialogue-bubble-header">
            <div class="speaker-tag">
              ${avatarUrl ? `
                <img src="${avatarUrl}" alt="${line.speaker}" class="speaker-avatar-img" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='inline-flex';">
                <span class="speaker-avatar-fallback" style="display:none;">${speakerShort}</span>
              ` : `
                <span class="speaker-avatar">${speakerShort}</span>
              `}
              <span class="speaker-name">${line.speaker}</span>
            </div>
            <button type="button" class="btn-line-audio" data-line-index="${idx}" title="이 문장 듣기" aria-label="이 문장 듣기">
              <svg class="line-audio-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
              </svg>
            </button>
          </div>

          <div class="dialogue-text-en">
            ${line.formattedText}
          </div>

          <div class="dialogue-text-kr">
            ${line.korean}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="popcorn-conversation-card" id="popcorn-conversation-card">
        <!-- Master Audio Bar -->
        <div class="popcorn-audio-bar">
          <button type="button" class="btn-popcorn-play-all" id="btn-popcorn-play-all" aria-label="대화 전체 듣기">
            <span id="popcorn-play-all-icon">▶</span>
            <span id="popcorn-play-all-text">대화 전체 듣기</span>
          </button>
          <div class="popcorn-audio-equalizer" id="popcorn-equalizer">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>

        <!-- Dialogue Bubble List -->
        <div class="popcorn-dialogue-container" id="popcorn-dialogue-container">
          ${dialogueHtml}
        </div>

        <!-- Explanation Card (Hidden until revealed) -->
        <div class="popcorn-explanation-card" id="popcorn-explanation-card">
          <div class="popcorn-explanation-header">
            <span>💡</span>
            <span>원어민 실전 뉘앙스 해설</span>
          </div>
          <div class="popcorn-explanation-body">
            ${lesson.explanation}
          </div>
        </div>

        <!-- Bottom Action Controls -->
        <div class="popcorn-study-actions">
          <button type="button" class="btn-popcorn-action btn-popcorn-reveal" id="btn-popcorn-reveal">
            <span>💡 한국어 번역 & 뉘앙스 해설 보기</span>
          </button>

          <button type="button" class="btn-popcorn-action btn-popcorn-save ${isTargetSaved ? 'saved' : ''}" id="btn-popcorn-save">
            <span>${isTargetSaved ? '✓ Saved에 저장됨' : '🔖 문장 저장하기'}</span>
          </button>

          <button type="button" class="btn-popcorn-action btn-popcorn-next" id="btn-popcorn-next">
            <span>다음 팝콘 표현 뽑기 🍿</span>
          </button>
        </div>
      </div>
    `;

    this._bindStage2Events(container, lesson);
  },

  /**
   * Bind Stage 2 conversation events
   */
  _bindStage2Events(container, lesson) {
    // 1. Play all toggle
    const playAllBtn = document.getElementById('btn-popcorn-play-all');
    if (playAllBtn) {
      playAllBtn.addEventListener('click', () => {
        if (this.isPlayingAll) {
          this.stopAudio();
        } else {
          this.playFullConversation(lesson);
        }
      });
    }

    // 2. Line-level audio: click entire sentence card or audio button
    container.querySelectorAll('.dialogue-bubble').forEach(bubble => {
      bubble.addEventListener('click', () => {
        const lineIdx = parseInt(bubble.getAttribute('data-line-index'), 10);
        if (!isNaN(lineIdx) && lesson.dialogue[lineIdx]) {
          this.playSingleLine(lesson.dialogue[lineIdx], lineIdx);
        }
      });
    });

    container.querySelectorAll('.btn-line-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lineIdx = parseInt(btn.getAttribute('data-line-index'), 10);
        if (!isNaN(lineIdx) && lesson.dialogue[lineIdx]) {
          this.playSingleLine(lesson.dialogue[lineIdx], lineIdx);
        }
      });
    });

    // 3. Reveal button (reveals Korean translations and detailed explanation - Issue #47: 14-day interval)
    const revealBtn = document.getElementById('btn-popcorn-reveal');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        const card = document.getElementById('popcorn-conversation-card');
        if (card) card.classList.add('revealed');
        revealBtn.classList.add('revealed');
        revealBtn.innerHTML = '<span>✓ 해설 확인 완료</span>';

        // Mark as studied (14-day interval - Issue #47)
        if (lesson.id) {
          Storage.recordPopcornStudied(lesson.id, 14);
        }

        this._playPopSound();
      });
    }

    // 4. Save sentence button (saves target expression sentence into centralized Saved page)
    const saveBtn = document.getElementById('btn-popcorn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this._toggleSaveTargetSentence(lesson, saveBtn);
      });
    }

    // 5. Next expression button: Enforce 14-day spaced repetition interval & daily limit check with popcorn flying animation
    const nextBtn = document.getElementById('btn-popcorn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this._isTransitioning) return;

        const currentId = lesson && lesson.id ? lesson.id : null;

        // Enforce 14-day spaced repetition interval on the current lesson (Issue #47)
        if (currentId) {
          Storage.recordPopcornStudied(currentId, 14);
        }

        // Clean query parameter when picking next lesson
        if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', window.location.pathname);
        }

        // Trigger delightful popcorn flying animation and then advance, scrolling to top
        this.triggerPopcornTransition(nextBtn, () => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          if (Storage.isPopcornDailyLimitReached(10)) {
            this._renderCompletionState(container, 'daily_limit');
          } else {
            this.pickNextLesson(container, null, currentId);
          }
        });
      });
    }
  },

  /**
   * Play the full conversation sequentially line by line (Person A -> Person B -> Person A)
   */
  playFullConversation(lesson) {
    if (!lesson || !lesson.dialogue || lesson.dialogue.length === 0) return;

    this.stopAudio();
    this.isPlayingAll = true;
    this._setPlayAllButtonState(true);

    let currentIndex = 0;

    const playNext = () => {
      if (!this.isPlayingAll) return;

      if (currentIndex >= lesson.dialogue.length) {
        // Conversation finished
        this.stopAudio();
        return;
      }

      const line = lesson.dialogue[currentIndex];
      this._highlightSpeakingBubble(currentIndex);

      this._playAudioOrTts(line, () => {
        currentIndex++;
        // Short pause between speaker turns
        setTimeout(playNext, 400);
      });
    };

    playNext();
  },

  /**
   * Play a single dialogue line
   */
  playSingleLine(line, lineIndex) {
    this.stopAudio();
    this._highlightSpeakingBubble(lineIndex);

    this._playAudioOrTts(line, () => {
      this._clearSpeakingBubbleHighlight();
    });
  },

  /**
   * Internal helper: play line audio or fallback to Web Speech API TTS
   */
  _playAudioOrTts(line, onEnded) {
    if (!line) {
      if (onEnded) onEnded();
      return;
    }

    const audioUrl = this._resolveAudioPath(line);

    if (audioUrl) {
      if (this.audioElement) {
        try {
          this.audioElement.pause();
          this.audioElement.onended = null;
          this.audioElement.onerror = null;
        } catch (_) { }
      }

      if (this._audioCache && this._audioCache[audioUrl]) {
        this.audioElement = this._audioCache[audioUrl];
      } else {
        this.audioElement = new Audio(audioUrl);
      }

      let handled = false;
      const finish = () => {
        if (!handled) {
          handled = true;
          if (this.audioElement) {
            this.audioElement.onended = null;
            this.audioElement.onerror = null;
          }
          if (onEnded) onEnded();
        }
      };

      const onError = (e) => {
        if (!handled) {
          handled = true;
          console.warn('Popcorn audio playback failed or not found, falling back to TTS:', audioUrl, e);
          if (this.audioElement) {
            this.audioElement.onended = null;
            this.audioElement.onerror = null;
          }
          this._speakTtsWithVoice(line.rawText, line.speaker, onEnded);
        }
      };

      this.audioElement.onended = finish;
      this.audioElement.onerror = onError;
      this.audioElement.currentTime = 0;

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(onError);
      }
    } else {
      this._speakTtsWithVoice(line.rawText, line.speaker, onEnded);
    }
  },

  /**
   * Resilient TTS fallback with distinct pitch/rate for Person A vs Person B
   */
  _speakTtsWithVoice(text, speaker, onEnded) {
    const wordCount = (text || '').split(/\s+/).length;
    const fallbackDuration = Math.max(1200, wordCount * 280);

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => {
        if (onEnded) onEnded();
      }, fallbackDuration);
      return;
    }

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-US';
    utt.rate = 0.95;

    // Pitch differentiation: Person A slightly deeper, Person B slightly brighter
    if (/Person\s*B/i.test(speaker)) {
      utt.pitch = 1.15;
    } else {
      utt.pitch = 1.0;
    }

    let handled = false;
    const finish = () => {
      if (!handled) {
        handled = true;
        if (onEnded) onEnded();
      }
    };

    // Safety timeout in case speech engine in headless browser hangs or completes too fast
    const timer = setTimeout(finish, fallbackDuration);
    utt.onend = () => {
      clearTimeout(timer);
      finish();
    };
    utt.onerror = () => {
      clearTimeout(timer);
      finish();
    };

    try {
      window.speechSynthesis.speak(utt);
    } catch (_) {
      clearTimeout(timer);
      finish();
    }
  },

  /**
   * Stop audio playback
   */
  stopAudio() {
    this.isPlayingAll = false;
    this._setPlayAllButtonState(false);
    this._clearSpeakingBubbleHighlight();

    if (this.audioElement) {
      try {
        this.audioElement.onended = null;
        this.audioElement.onerror = null;
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch (_) { }
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  },

  _highlightSpeakingBubble(index) {
    this._clearSpeakingBubbleHighlight();
    const bubble = document.getElementById(`dialogue-bubble-${index}`);
    if (bubble) {
      bubble.classList.add('playing');
      bubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  },

  _clearSpeakingBubbleHighlight() {
    document.querySelectorAll('.dialogue-bubble.playing').forEach(el => {
      el.classList.remove('playing');
    });
  },

  _setPlayAllButtonState(isPlaying) {
    const btn = document.getElementById('btn-popcorn-play-all');
    const icon = document.getElementById('popcorn-play-all-icon');
    const text = document.getElementById('popcorn-play-all-text');
    const eq = document.getElementById('popcorn-equalizer');

    if (btn) btn.classList.toggle('playing', isPlaying);
    if (icon) icon.textContent = isPlaying ? '⏸' : '▶';
    if (text) text.textContent = isPlaying ? '일시 정지' : '대화 전체 듣기';
    if (eq) eq.classList.toggle('active', isPlaying);
  },

  /**
   * Check if target sentence of lesson is saved in centralized Saved page
   */
  _isTargetSentenceSaved(lesson) {
    if (!lesson || !lesson.targetSentence) return false;
    const all = Storage.getAllSavedSentences();
    const list = all['popcorn'] || [];
    return list.some(s => s.id === lesson.targetSentence.id || s.en.trim().toLowerCase() === lesson.targetSentence.en.trim().toLowerCase());
  },

  /**
   * Toggle save target sentence into centralized Saved page
   */
  _toggleSaveTargetSentence(lesson, saveBtn) {
    if (!lesson || !lesson.targetSentence) return;
    const isSaved = this._isTargetSentenceSaved(lesson);

    if (isSaved) {
      Storage.removeSavedSentence('popcorn', lesson.targetSentence.id);
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = '<span>🔖 문장 저장하기</span>';
      this._showToast('Saved에서 삭제되었습니다.');
    } else {
      Storage.saveSentence('popcorn', {
        id: lesson.targetSentence.id,
        en: lesson.targetSentence.en,
        kr: lesson.targetSentence.kr,
        audio: lesson.targetSentence.audio,
        expression: lesson.targetSentence.expression || lesson.expression,
        speaker: lesson.targetSentence.speaker || '',
        avatar: lesson.targetSentence.avatar || '',
        lessonId: lesson.id,
        timestamp: 0
      });
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = '<span>✓ Saved에 저장됨</span>';
      this._showToast('Saved에 저장되었습니다! 🔖');
    }

    // Refresh navbar counter badge
    if (typeof App !== 'undefined' && typeof App.updateSentenceBadge === 'function') {
      App.updateSentenceBadge();
    }
  },

  /**
   * Render completion state when daily limit (10) is reached or all lessons are known/in cooldown
   * @param {HTMLElement} container
   * @param {'daily_limit'|'all_exhausted'} [reason='daily_limit']
   */
  _renderCompletionState(container, reason = 'daily_limit') {
    const base = this._getBasePath();
    const count = Storage.getPopcornDailyStudyCount();
    const isDailyLimit = reason === 'daily_limit' || count >= 10;

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    const badgeText = isDailyLimit ? `🍿 오늘 팝콘 완료 (${count} / 10)` : '✨ 모든 표현 마스터';
    const descText = isDailyLimit
      ? '오늘 준비된 10개의 팝콘 표현을 모두 맛있게 학습했어요! 🍿<br>새로운 팝콘 표현은 내일 다시 준비될거에요.'
      : '현재 학습 가능한 모든 팝콘 표현을 마스터하셨어요!';

    // Track GA event when user reaches the 10-lesson daily limit
    if (isDailyLimit) {
      try {
        const today = (typeof Storage !== 'undefined' && typeof Storage.getLocalDateString === 'function')
          ? Storage.getLocalDateString()
          : new Date().toISOString().split('T')[0];
        const trackingKey = `rhyrhy_popcorn_limit_tracked_${today}`;
        if (typeof sessionStorage !== 'undefined') {
          if (!sessionStorage.getItem(trackingKey)) {
            sessionStorage.setItem(trackingKey, '1');
            if (typeof Analytics !== 'undefined' && typeof Analytics.trackPopcornDailyLimitReached === 'function') {
              Analytics.trackPopcornDailyLimitReached(count, 10, reason);
            }
          }
        } else if (typeof Analytics !== 'undefined' && typeof Analytics.trackPopcornDailyLimitReached === 'function') {
          Analytics.trackPopcornDailyLimitReached(count, 10, reason);
        }
      } catch (err) {
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackPopcornDailyLimitReached === 'function') {
          Analytics.trackPopcornDailyLimitReached(count, 10, reason);
        }
      }
    }

    container.innerHTML = `
      <div class="popcorn-completion-card" id="popcorn-completion-card">
        <div class="popcorn-empty-illustration">
          <img src="${base}assets/img/popcorn-empty.jpg" alt="빈 팝콘 상자" class="popcorn-empty-img" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='block';">
          <div class="popcorn-empty-fallback" style="display: none;">🍿</div>
        </div>

        <div class="popcorn-completion-header">
          <div class="popcorn-badge completion-badge">${badgeText}</div>
          <h2 class="completion-title">내일 다시 팝콘이 준비될거에요</h2>
          <p class="completion-desc">${descText}</p>
        </div>
      </div>
    `;

    const resetBtn = document.getElementById('btn-reset-popcorn-cooldown');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Storage.resetPopcornPreferences();
        try {
          const today = (typeof Storage !== 'undefined' && typeof Storage.getLocalDateString === 'function')
            ? Storage.getLocalDateString()
            : new Date().toISOString().split('T')[0];
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(`rhyrhy_popcorn_limit_tracked_${today}`);
          }
        } catch (_) { }
        this._showToast('팝콘 쿨다운과 일일 제한이 초기화되었습니다! 🍿');
        this.pickNextLesson(container);
      });
    }
  },

  /**
   * Render fallback legacy phrase
   */
  _renderLegacyPhrase(container, phrase) {
    if (!phrase) return;
    container.innerHTML = `
      <div class="popcorn-check-card">
        <div class="popcorn-badge">🍿 Popcorn English</div>
        <h2 class="popcorn-expression-banner">"${phrase.mask || phrase.en}"</h2>
        <p class="popcorn-check-hint">${phrase.kr}</p>
        <button type="button" class="btn-popcorn-action btn-popcorn-learn" onclick="DailyPopcornManager.pickNextLesson()">다음 표현 보기</button>
      </div>
    `;
  },

  /**
   * Preload all dialogue audio files for a lesson
   */
  async preloadLessonAudio(lesson) {
    if (!lesson || !lesson.dialogue || lesson.dialogue.length === 0) return;
    if (!this._audioCache) this._audioCache = {};

    const loadPromises = lesson.dialogue.map(line => {
      const audioUrl = this._resolveAudioPath(line);
      if (!audioUrl) return Promise.resolve(null);

      if (this._audioCache[audioUrl]) {
        return Promise.resolve(this._audioCache[audioUrl]);
      }

      return new Promise(resolve => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.src = audioUrl;

        let resolved = false;
        const finish = () => {
          if (!resolved) {
            resolved = true;
            this._audioCache[audioUrl] = audio;
            resolve(audio);
          }
        };

        audio.addEventListener('canplaythrough', finish, { once: true });
        audio.addEventListener('loadeddata', finish, { once: true });
        audio.addEventListener('error', () => {
          if (!resolved) {
            resolved = true;
            resolve(null);
          }
        }, { once: true });

        audio.load();
        setTimeout(finish, 1200); // safety timeout
      });
    });

    await Promise.all(loadPromises);
  },

  /**
   * Helper: Resolve relative audio path
   */
  _resolveAudioPath(item) {
    if (!item || !item.audio) return null;
    const base = this._getBasePath();
    let p = item.audio.trim();
    if (p.startsWith('./')) p = p.substring(2);
    if (p.startsWith('/')) p = p.substring(1);

    if (p.startsWith('popcorn/')) {
      return encodeURI(`${base}${p}`);
    }
    if (p.startsWith('conversation/')) {
      return encodeURI(`${base}popcorn/${p}`);
    }
    if (p.startsWith('audio/')) {
      return encodeURI(`${base}popcorn/conversation/${p}`);
    }
    return encodeURI(`${base}popcorn/conversation/${p}`);
  },

  /**
   * Helper: Resolve avatar image path
   */
  _resolveAvatarPath(avatar) {
    if (!avatar) return null;
    const base = this._getBasePath();
    let p = avatar.trim();
    if (p.startsWith('./')) p = p.substring(2);
    if (p.startsWith('/')) p = p.substring(1);

    if (p.startsWith('assets/')) {
      return `${base}${p}`;
    }
    return `${base}assets/img/avatars/${p}`;
  },

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
   * Generate Top 10 unfamiliar quick lessons report in browser console (Issue #47)
   * @param {number} [limit=10]
   */
  generateUnfamiliarityReport(limit = 10) {
    if (typeof Storage !== 'undefined' && typeof Storage.getTopUnfamiliarLessons === 'function') {
      const rep = Storage.getTopUnfamiliarLessons(limit, this.currentMetadata);
      console.table ? console.table(rep) : console.log(rep);
      return rep;
    }
    return [];
  }
};

if (typeof window !== 'undefined') {
  window.DailyPopcornManager = DailyPopcornManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyPopcornManager;
}
