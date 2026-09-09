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
   * Handle Popcorn Navbar Button click:
   * Popcorn icon moves from navbar to screen center, grows bigger, pops with particles and sound,
   * then navigates to dedicated daily.html page.
   */
  triggerPopcornTransition(btn, destUrl) {
    if (this._isTransitioning) return;
    this._isTransitioning = true;

    this._playPopSound();

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
    flyer.textContent = '🍿';
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
      if (destUrl) {
        window.location.href = destUrl;
      }
    }, 620);
  },

  /**
   * Spawn explosion particles outward from screen center
   */
  _spawnCenterBurst(centerX, centerY) {
    const particles = ['🍿', '✨', '⭐', '💛', '🍿', '🎉', '🍿', '✨'];
    particles.forEach((emoji, i) => {
      const el = document.createElement('span');
      el.className = 'popcorn-particle';
      el.textContent = emoji;

      const angle = (i / particles.length) * (Math.PI * 2) + (Math.random() * 0.3 - 0.15);
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
      const res = await fetch(`${base}popcorn/metadata.json`);
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
   */
  async pickNextLesson(container, specificId) {
    container = container || document.getElementById('daily-page-container');
    if (!container) return;

    this.stopAudio();

    // Check URL param if not specifically provided
    if (!specificId && typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('id')) {
        specificId = params.get('id');
      }
    }

    let candidate = null;

    if (specificId && this.currentMetadata.length > 0) {
      candidate = this.currentMetadata.find(item => item.id === specificId);
    }

    if (!candidate && this.currentMetadata.length > 0) {
      // Filter candidates using 30-day cooldown and permanent known skip
      const available = Storage.getAvailablePopcornLessons(this.currentMetadata);
      if (available.length > 0) {
        candidate = available[Math.floor(Math.random() * available.length)];
      } else {
        // All lessons are completed / in cooldown / known
        this._renderCompletionState(container);
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
      const mdRes = await fetch(`${base}popcorn/${candidate.file}`);
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

    container.innerHTML = `
      <div class="popcorn-check-card" id="popcorn-check-card">
        <div class="popcorn-check-content">
          <span class="popcorn-check-prompt">${lesson.prompt || '이 표현을 아시나요?'}</span>
          <h2 class="popcorn-expression-banner">"${lesson.expression}"</h2>
        </div>

        <div class="popcorn-check-actions">
          <button type="button" class="btn-popcorn-action btn-popcorn-known" id="btn-popcorn-known" title="이 표현은 이미 알고 있어요 (다시 표시되지 않음)">
            <span>👍 이미 알아요</span>
          </button>
          <button type="button" class="btn-popcorn-action btn-popcorn-learn" id="btn-popcorn-learn" title="이 표현을 학습할래요">
            <span>🚀 몰라요 (학습하기)</span>
          </button>
        </div>
      </div>
    `;

    // Bind Stage 1 buttons
    const knownBtn = document.getElementById('btn-popcorn-known');
    if (knownBtn) {
      knownBtn.addEventListener('click', () => {
        Storage.setPopcornKnown(lesson.id, true);
        this._playPopSound();
        this._showToast(`'${lesson.expression}' 표현을 마스터 목록에 보관했어요! 다시 표시되지 않습니다 👍`);
        this.pickNextLesson(container);
      });
    }

    const learnBtn = document.getElementById('btn-popcorn-learn');
    if (learnBtn) {
      learnBtn.addEventListener('click', async () => {
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
              <span class="line-audio-icon">🔊</span>
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

    // 2. Line-level audio buttons
    container.querySelectorAll('.btn-line-audio').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lineIdx = parseInt(btn.getAttribute('data-line-index'), 10);
        if (!isNaN(lineIdx) && lesson.dialogue[lineIdx]) {
          this.playSingleLine(lesson.dialogue[lineIdx], lineIdx);
        }
      });
    });

    // 3. Reveal button (reveals Korean translations and detailed explanation)
    const revealBtn = document.getElementById('btn-popcorn-reveal');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        const card = document.getElementById('popcorn-conversation-card');
        if (card) card.classList.add('revealed');
        revealBtn.classList.add('revealed');
        revealBtn.innerHTML = '<span>✓ 해설 확인 완료</span>';

        // Mark as studied (30-day cooldown)
        if (lesson.id) {
          Storage.setPopcornStudied(lesson.id);
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

    // 5. Next expression button
    const nextBtn = document.getElementById('btn-popcorn-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.pickNextLesson(container);
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
   * Render completion state when all available lessons are completed or in cooldown
   */
  _renderCompletionState(container) {
    container.innerHTML = `
      <div class="popcorn-completion-card" id="popcorn-completion-card">
        <div class="completion-icon">🎉</div>
        <h2 class="completion-title">모든 팝콘 표현을 마스터하셨습니다!</h2>
        <p class="completion-desc">
          현재 등록된 표현을 모두 학습하셨거나 이미 알고 계신 표현으로 등록되었습니다.<br>
          한 달 동안 장기 기억을 위한 복습 쿨다운이 유지됩니다.
        </p>
        <div class="completion-actions">
          <button type="button" class="btn-popcorn-action btn-popcorn-reset" id="btn-reset-popcorn-cooldown">
            <span>🔄 복습하기 (쿨다운 초기화)</span>
          </button>
        </div>
      </div>
    `;

    const resetBtn = document.getElementById('btn-reset-popcorn-cooldown');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        Storage.resetPopcornPreferences();
        this._showToast('쿨다운이 초기화되었습니다! 🍿');
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
  }
};

if (typeof window !== 'undefined') {
  window.DailyPopcornManager = DailyPopcornManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyPopcornManager;
}
