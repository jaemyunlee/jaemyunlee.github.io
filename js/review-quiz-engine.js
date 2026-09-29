/**
 * Review / Recall Quiz Engine for RhyRhy English (Issue #108 - Step 5)
 * Supports:
 * 1. Fill-in-the-Blank Quiz
 * 2. Speaking Quiz with in-browser Speech-to-Text (STT) and >=85% similarity evaluation
 * Automatically completes the lesson upon passing Step 5.
 */

// Comprehensive English homophone clusters for Speech-to-Text phonetic alignment
const HOMOPHONE_SETS = [
  ['due', 'do', 'dew'],
  ['to', 'too', 'two'],
  ['their', 'there', 'theyre', 'theyd'],
  ['by', 'buy', 'bye'],
  ['right', 'write', 'rite'],
  ['hear', 'here'],
  ['see', 'sea'],
  ['weather', 'whether'],
  ['for', 'four', 'fore'],
  ['in', 'inn'],
  ['no', 'know'],
  ['new', 'knew'],
  ['our', 'hour'],
  ['one', 'won'],
  ['passed', 'past'],
  ['piece', 'peace'],
  ['some', 'sum'],
  ['wait', 'weight'],
  ['whole', 'hole'],
  ['break', 'brake'],
  ['meet', 'meat'],
  ['road', 'rode', 'rowed'],
  ['role', 'roll'],
  ['sight', 'site', 'cite'],
  ['scene', 'seen'],
  ['plain', 'plane'],
  ['pair', 'pear'],
  ['fair', 'fare'],
  ['bare', 'bear'],
  ['tail', 'tale'],
  ['stare', 'stair'],
  ['waste', 'waist'],
  ['weak', 'week'],
  ['would', 'wood'],
  ['wear', 'where', 'ware'],
  ['which', 'witch'],
  ['son', 'sun'],
  ['ate', 'eight'],
  ['bored', 'board'],
  ['allowed', 'aloud'],
  ['threw', 'through'],
  ['blew', 'blue'],
  ['cell', 'sell'],
  ['flour', 'flower'],
  ['heal', 'heel'],
  ['idle', 'idol'],
  ['knight', 'night'],
  ['knot', 'not'],
  ['mail', 'male'],
  ['main', 'mane'],
  ['none', 'nun'],
  ['pain', 'pane'],
  ['poor', 'pour', 'pore'],
  ['pray', 'prey'],
  ['real', 'reel'],
  ['root', 'route'],
  ['sail', 'sale'],
  ['sole', 'soul'],
  ['steal', 'steel'],
  ['sweet', 'suite'],
  ['toe', 'tow'],
  ['way', 'weigh']
];

const HOMOPHONE_LOOKUP = {};
HOMOPHONE_SETS.forEach((group, gid) => {
  group.forEach(w => {
    HOMOPHONE_LOOKUP[w.toLowerCase().replace(/[^a-z]/g, '')] = gid;
  });
});

class ReviewQuizEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    this.lessonId = options.lessonId;
    this.quizzes = (options.quizzes || []).map(q => ({ ...q, type: 'speaking' }));
    this.audioBaseUrl = options.audioBaseUrl || './audio/';
    this.onComplete = options.onComplete || (() => {});
    this.celebrationManager = options.celebrationManager || null;

    this.currentIndex = 0;
    this.results = {}; // index -> { passed: boolean, score: number, userText: string }

    this.state = (typeof Storage !== 'undefined' && typeof Storage.getReviewQuizProgress === 'function')
      ? Storage.getReviewQuizProgress(this.lessonId)
      : { completed: false, currentIndex: 0, results: {} };

    if (this.state && typeof this.state.currentIndex === 'number') {
      this.currentIndex = this.state.currentIndex;
    }
    if (this.state && this.state.results) {
      this.results = { ...this.state.results };
    }

    this.isListening = false;
    this.recognition = null;
    this.sttSupported = this._initSTT();
    this.showManualInput = false;

    // Segment audio player
    this.audio = null;
    this.isPlaying = false;
    this.playbackRate = 1.0;
  }

  _resolveAudioUrl(q) {
    if (!q) return null;
    if (q.audioUrl) return q.audioUrl;
    if (q.segmentAudio) {
      return `${this.audioBaseUrl}${q.segmentAudio}`;
    }
    if (q.segmentId) {
      return `${this.audioBaseUrl}segments/${q.segmentId}.mp3`;
    }
    if (q.audioFile) {
      return `${this.audioBaseUrl}${encodeURIComponent(q.audioFile)}`;
    }
    return null;
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  playAudio() {
    const q = this.quizzes[this.currentIndex];
    if (!q) return;

    const audioUrl = this._resolveAudioUrl(q);
    if (!audioUrl) return;

    // Stop speech recognition if active to avoid recording speaker output
    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
      this._updateMicButton(false);
    }

    const targetSrc = typeof window !== 'undefined'
      ? new URL(audioUrl, window.location.href).href
      : audioUrl;

    if (!this.audio || this.audio.src !== targetSrc) {
      if (this.audio) {
        this.audio.pause();
      }
      this.audio = new Audio(audioUrl);
      this.audio.playbackRate = this.playbackRate;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this._updateAudioButtonState(true);
      });
      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this._updateAudioButtonState(false);
      });
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this._updateAudioButtonState(false);
      });
    }

    this.audio.playbackRate = this.playbackRate;
    this.audio.play().catch(err => {
      console.warn('Audio play error in ReviewQuizEngine:', err);
    });
  }

  pauseAudio() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this._updateAudioButtonState(false);
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

  _updateAudioButtonState(isPlaying) {
    const playBtn = this.container.querySelector('#btn-review-audio-play');
    if (!playBtn) return;

    if (isPlaying) {
      playBtn.classList.add('playing');
      playBtn.innerHTML = `
        <svg class="icon-pause" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <span class="play-label">일시 정지</span>
      `;
    } else {
      playBtn.classList.remove('playing');
      playBtn.innerHTML = `
        <svg class="icon-play" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span class="play-label">원문 소리 듣기</span>
      `;
    }
  }

  _initSTT() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser. Falling back to typing mode.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 5;

      this.recognition.onstart = () => {
        this.isListening = true;
        this._updateMicButton(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        const finalCandidateMap = {};

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            for (let alt = 0; alt < res.length; alt++) {
              if (res[alt] && res[alt].transcript) {
                finalCandidateMap[alt] = (finalCandidateMap[alt] ? finalCandidateMap[alt] + ' ' : '') + res[alt].transcript.trim();
              }
            }
          } else if (res[0] && res[0].transcript) {
            interimTranscript += res[0].transcript;
          }
        }

        const finalCandidates = Object.values(finalCandidateMap);

        const transcriptDisplay = this.container.querySelector('#spoken-transcript-live');
        if (transcriptDisplay) {
          transcriptDisplay.textContent = finalCandidates[0] || interimTranscript || '말씀을 듣고 있습니다...';
        }

        if (finalCandidates.length > 0) {
          this.evaluateSpokenAnswer(finalCandidates);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        this.isListening = false;
        this._updateMicButton(false);
        const transcriptDisplay = this.container.querySelector('#spoken-transcript-live');
        if (transcriptDisplay && event.error !== 'no-speech') {
          transcriptDisplay.textContent = `음성 인식 알림: ${event.error === 'not-allowed' ? '마이크 권한이 필요합니다.' : '다시 시도해주세요.'}`;
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this._updateMicButton(false);
      };

      return true;
    } catch (e) {
      console.warn('Failed to initialize SpeechRecognition:', e);
      return false;
    }
  }

  init() {
    if (!this.container) return;
    if (this.state && this.state.completed) {
      this.renderCompletedState(true);
      return;
    }
    if (this.currentIndex >= this.quizzes.length && this.quizzes.length > 0) {
      this.currentIndex = Math.max(0, this.quizzes.length - 1);
    }
    this.render();
  }

  render() {
    if (!this.container) return;

    if (this.quizzes.length === 0) {
      this.container.innerHTML = `
        <div class="review-quiz-card empty-state">
          <p>복습 퀴즈 데이터가 없습니다.</p>
        </div>
      `;
      return;
    }

    if (this.currentIndex >= this.quizzes.length) {
      this.renderCompletedState();
      return;
    }

    const q = this.quizzes[this.currentIndex];
    const total = this.quizzes.length;
    const currentNum = this.currentIndex + 1;
    const progressPercent = Math.round(((currentNum - 1) / total) * 100);

    const isSpeaking = q.type === 'speaking';
    const typeBadge = isSpeaking
      ? `<span class="review-pill speaking">🎙️ 스피킹 퀴즈</span>`
      : `<span class="review-pill blank">✍️ 빈칸 채우기</span>`;

    const parts = q.english.split(/\[.*?\]/);
    const beforeText = parts[0] || '';
    const afterText = parts[1] || '';
    const audioUrl = this._resolveAudioUrl(q);

    let interactiveHtml = '';

    if (isSpeaking) {
      interactiveHtml = `
        <div class="speaking-prompt-container">
          <p class="speaking-guide-text">
            🎙️ 마이크 버튼을 누르고 빈칸에 들어갈 영어 표현을 <strong>직접 소리 내어 말해보세요!</strong>
          </p>

          <div class="speaking-mic-wrapper">
            <button type="button" class="btn-speaking-mic" id="btn-speaking-mic" aria-label="음성으로 말하기">
              <div class="mic-wave-ring" aria-hidden="true"></div>
              <svg class="icon-mic" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>
            <span class="mic-status-label" id="mic-status-label">말하기 시작</span>
          </div>

          <div class="spoken-transcript-box" id="spoken-transcript-box">
            <span class="transcript-label">인식된 음성:</span>
            <p class="spoken-text" id="spoken-transcript-live">마이크를 누르고 말씀해보세요...</p>
          </div>

          <div class="manual-input-toggle">
            <button type="button" class="btn-text-fallback" id="btn-toggle-manual">
              <span>⌨️ 마이크가 안 되나요? 직접 입력하기</span>
            </button>
          </div>

          <div class="manual-input-box" id="manual-input-box" style="display: ${this.showManualInput ? 'block' : 'none'};">
            <input 
              type="text" 
              class="review-blank-input manual-speaking-input" 
              id="manual-speaking-input" 
              placeholder="표현을 직접 입력하세요..."
              autocomplete="off"
            />
            <button type="button" class="btn btn-primary" id="btn-submit-manual">확인</button>
          </div>
        </div>
      `;
    } else {
      // Fill-in-the-blank
      interactiveHtml = `
        <div class="blank-prompt-container">
          <p class="blank-guide-text">
            ✍️ 문맥에 맞는 알맞은 영어 표현을 빈칸에 입력하세요:
          </p>

          <div class="blank-input-row">
            <input 
              type="text" 
              class="review-blank-input" 
              id="blank-text-input" 
              placeholder="정답 입력..." 
              autocomplete="off"
              autocorrect="off"
              autocapitalize="none"
              spellcheck="false"
              aria-label="Missing expression"
            />
            <button type="button" class="btn btn-primary btn-check-blank" id="btn-check-blank">
              <span>확인 (Enter)</span>
            </button>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="review-quiz-card animate-fade-in" role="region" aria-label="Review Quiz">
        <!-- Header -->
        <div class="review-quiz-header">
          <div class="review-quiz-meta">
            <span class="review-quiz-badge">복습 퀴즈 ${currentNum} / ${total}</span>
            ${typeBadge}
          </div>
          <div class="review-progress-track" aria-hidden="true">
            <div class="review-progress-bar" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <!-- Korean Meaning -->
        <div class="review-korean-prompt">
          <span class="prompt-icon">💡</span>
          <p class="korean-text">${this._escapeHtml(q.korean)}</p>
        </div>

        <!-- Sentence Box with Blank -->
        <div class="review-sentence-box">
          <span class="sentence-part">${this._escapeHtml(beforeText)}</span>
          <span class="sentence-blank-slot" id="sentence-blank-slot">[ ? ]</span>
          <span class="sentence-part">${this._escapeHtml(afterText)}</span>
        </div>

        <!-- Segment Audio Player Section (원문 듣기) -->
        ${audioUrl ? `
          <div class="review-audio-box" id="review-audio-box">
            <button type="button" class="btn-review-audio-play ${this.isPlaying ? 'playing' : ''}" id="btn-review-audio-play" aria-label="원문 소리 듣기 / 일시 정지">
              ${this.isPlaying ? `
                <svg class="icon-pause" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <span class="play-label">일시 정지</span>
              ` : `
                <svg class="icon-play" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span class="play-label">원문 소리 듣기</span>
              `}
            </button>

            <div class="review-audio-controls">
              <button type="button" class="btn-audio-ctrl" id="btn-review-audio-replay" title="처음부터 다시 듣기">
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
        ` : ''}

        <!-- Interactive Area -->
        ${interactiveHtml}

        <!-- Evaluation Feedback Box -->
        <div class="review-feedback-box" id="review-feedback-box" style="display: none;"></div>
      </div>
    `;

    this._bindEvents(q);
  }

  _bindEvents(q) {
    const playAudioBtn = this.container.querySelector('#btn-review-audio-play');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', () => {
        this.toggleAudio();
      });
    }

    const replayAudioBtn = this.container.querySelector('#btn-review-audio-replay');
    if (replayAudioBtn) {
      replayAudioBtn.addEventListener('click', () => {
        this.replayAudio();
      });
    }

    const speedBtns = this.container.querySelectorAll('.review-audio-controls .btn-speed-opt');
    speedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed) || 1.0;
        this.setPlaybackRate(speed);
        speedBtns.forEach(b => b.classList.toggle('active', parseFloat(b.dataset.speed) === speed));
      });
    });

    if (q.type === 'speaking') {
      const micBtn = this.container.querySelector('#btn-speaking-mic');
      if (micBtn) {
        micBtn.addEventListener('click', () => {
          this.toggleSpeechRecognition();
        });
      }

      const toggleManualBtn = this.container.querySelector('#btn-toggle-manual');
      const manualBox = this.container.querySelector('#manual-input-box');
      if (toggleManualBtn && manualBox) {
        toggleManualBtn.addEventListener('click', () => {
          this.showManualInput = !this.showManualInput;
          manualBox.style.display = this.showManualInput ? 'flex' : 'none';
          if (this.showManualInput) {
            const mInput = manualBox.querySelector('#manual-speaking-input');
            if (mInput) mInput.focus();
          }
        });
      }

      const manualSubmitBtn = this.container.querySelector('#btn-submit-manual');
      const manualInput = this.container.querySelector('#manual-speaking-input');
      if (manualSubmitBtn && manualInput) {
        manualSubmitBtn.addEventListener('click', () => {
          this.evaluateSpokenAnswer(manualInput.value);
        });
        manualInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.evaluateSpokenAnswer(manualInput.value);
          }
        });
      }
    } else {
      // Fill-in-the-blank
      const checkBtn = this.container.querySelector('#btn-check-blank');
      const input = this.container.querySelector('#blank-text-input');

      if (checkBtn && input) {
        checkBtn.addEventListener('click', () => {
          this.evaluateBlankAnswer(input.value);
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.evaluateBlankAnswer(input.value);
          }
        });
        setTimeout(() => input.focus(), 150);
      }
    }
  }

  toggleSpeechRecognition() {
    if (this.isPlaying) {
      this.pauseAudio();
    }

    if (!this.sttSupported || !this.recognition) {
      const transcriptDisplay = this.container.querySelector('#spoken-transcript-live');
      if (transcriptDisplay) {
        transcriptDisplay.textContent = '이 브라우저는 음성 인식을 지원하지 않습니다. 아래 직접 입력하기를 이용해주세요.';
      }
      this.showManualInput = true;
      const mBox = this.container.querySelector('#manual-input-box');
      if (mBox) mBox.style.display = 'flex';
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
      this.isListening = false;
      this._updateMicButton(false);
    } else {
      try {
        this.recognition.start();
        this.isListening = true;
        this._updateMicButton(true);
      } catch (err) {
        console.warn('Speech recognition start error:', err);
      }
    }
  }

  _updateMicButton(isListening) {
    const micBtn = this.container.querySelector('#btn-speaking-mic');
    const statusLabel = this.container.querySelector('#mic-status-label');
    if (!micBtn) return;

    if (isListening) {
      micBtn.classList.add('listening');
      if (statusLabel) statusLabel.textContent = '듣고 있습니다... 말씀하세요 🔴';
    } else {
      micBtn.classList.remove('listening');
      if (statusLabel) statusLabel.textContent = '말하기 시작';
    }
  }

  _areHomophones(w1, w2) {
    if (!w1 || !w2) return false;
    const clean1 = w1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = w2.toLowerCase().replace(/[^a-z]/g, '');
    if (clean1 === clean2) return true;
    const g1 = HOMOPHONE_LOOKUP[clean1];
    const g2 = HOMOPHONE_LOOKUP[clean2];
    return g1 !== undefined && g1 === g2;
  }

  _toPhoneticCode(word) {
    if (!word) return '';
    let w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return '';

    // Silent consonants at word start
    w = w.replace(/^kn/, 'n')
         .replace(/^wr/, 'r')
         .replace(/^ps/, 's')
         .replace(/^pn/, 'n')
         .replace(/^gn/, 'n');

    // Consonant cluster normalization
    w = w.replace(/ph/g, 'f')
         .replace(/ck/g, 'k')
         .replace(/qu/g, 'kw')
         .replace(/c(?=[eiy])/g, 's')
         .replace(/c/g, 'k')
         .replace(/dg(?=[eiy])/g, 'j')
         .replace(/tch/g, 'ch')
         .replace(/z/g, 's');

    // Deduplicate consecutive identical consonants
    w = w.replace(/([a-z])\1+/g, '$1');

    return w;
  }

  _wordMatchScore(tWord, cWord) {
    if (!tWord || !cWord) return 0;
    if (tWord === cWord) return 1.0;

    // Direct homophone match
    if (this._areHomophones(tWord, cWord)) return 1.0;

    // Past tense -ed elision / connected speech reduction (e.g. happened -> happen, turned -> turn)
    if (tWord.endsWith('ed') && (tWord.slice(0, -2) === cWord || tWord.slice(0, -1) === cWord)) return 1.0;
    if (cWord.endsWith('ed') && (cWord.slice(0, -2) === tWord || cWord.slice(0, -1) === tWord)) return 1.0;

    // Present participle -ing elision / reduction (e.g. trying -> try)
    if (tWord.endsWith('ing') && (tWord.slice(0, -3) === cWord || tWord.slice(0, -3) + 'e' === cWord)) return 1.0;
    if (cWord.endsWith('ing') && (cWord.slice(0, -3) === tWord || cWord.slice(0, -3) + 'e' === tWord)) return 1.0;

    // Plural / 3rd person -s / -es inflection (e.g. seats -> seat)
    if (tWord.length > 3 && tWord.endsWith('s') && (tWord.slice(0, -1) === cWord || (tWord.endsWith('es') && tWord.slice(0, -2) === cWord))) return 1.0;
    if (cWord.length > 3 && cWord.endsWith('s') && (cWord.slice(0, -1) === tWord || (cWord.endsWith('es') && cWord.slice(0, -2) === tWord))) return 1.0;

    // Phonetic code equivalence
    if (Math.abs(tWord.length - cWord.length) <= 2 && this._toPhoneticCode(tWord) === this._toPhoneticCode(cWord)) {
      return 0.95;
    }

    // Levenshtein character similarity fallback
    const dist = this._levenshteinDistance(tWord, cWord);
    const maxLen = Math.max(tWord.length, cWord.length);
    return maxLen > 0 ? Math.max(0, 1 - (dist / maxLen)) : 0;
  }

  _normalizeString(str) {
    if (!str) return '';
    let s = str.toLowerCase();

    // Standard contractions
    s = s.replace(/\bdon't\b/g, 'do not')
         .replace(/\bdidn't\b/g, 'did not')
         .replace(/\bcan't\b/g, 'cannot')
         .replace(/\bi'm\b/g, 'i am')
         .replace(/\bit's\b/g, 'it is')
         .replace(/\bwe're\b/g, 'we are')
         .replace(/\bthey're\b/g, 'they are')
         .replace(/\byou're\b/g, 'you are');

    // Remove punctuation
    s = s.replace(/[.,!?;:"'’`~()[\]{}]/g, ' ');

    // Spoken reductions and linking sound assimilation
    s = s.replace(/\bdo to\b/g, 'due to')
         .replace(/\bdew to\b/g, 'due to')
         .replace(/\bhappen to\b/g, 'happened to')
         .replace(/\bturn out\b/g, 'turned out')
         .replace(/\bcompare to\b/g, 'compared to')
         .replace(/\bstart to\b/g, 'started to')
         .replace(/\buse to\b/g, 'used to')
         .replace(/\bsuppose to\b/g, 'supposed to')
         .replace(/\bgonna\b/g, 'going to')
         .replace(/\bwanna\b/g, 'want to')
         .replace(/\bkinda\b/g, 'kind of')
         .replace(/\bsorta\b/g, 'sort of')
         .replace(/\boutta\b/g, 'out of')
         .replace(/\blotta\b/g, 'lot of')
         .replace(/\bshould of\b|\bshoulda\b|\bshouldve\b/g, 'should have')
         .replace(/\bcould of\b|\bcoulda\b|\bcouldve\b/g, 'could have')
         .replace(/\bwould of\b|\bwoulda\b|\bwouldve\b/g, 'would have')
         .replace(/\bmust of\b|\bmustve\b/g, 'must have')
         .replace(/\bmight of\b|\bmightve\b/g, 'might have')
         .replace(/\bgimme\b/g, 'give me')
         .replace(/\blemme\b/g, 'let me')
         .replace(/\bhafta\b/g, 'have to')
         .replace(/\bhasta\b/g, 'has to')
         .replace(/\balot\b/g, 'a lot')
         .replace(/\balright\b/g, 'all right');

    return s.replace(/\s+/g, ' ').trim();
  }

  _levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    return dp[m][n];
  }

  calculateSimilarity(target, candidate) {
    const normTarget = this._normalizeString(target);
    const normCandidate = this._normalizeString(candidate);

    if (!normTarget || !normCandidate) return 0;
    if (normTarget === normCandidate) return 1.0;

    // Compound word match without spaces (e.g. "nosebleed" vs "nose bleed")
    if (normTarget.replace(/\s+/g, '') === normCandidate.replace(/\s+/g, '')) {
      return 1.0;
    }

    // Direct homophone check for single-word targets
    if (this._areHomophones(normTarget, normCandidate)) {
      return 1.0;
    }

    // Substring match: if user spoken phrase contains the target phrase
    if (normCandidate.includes(normTarget)) {
      return 1.0;
    }

    // Direct Levenshtein similarity
    const maxLen = Math.max(normTarget.length, normCandidate.length);
    const dist = this._levenshteinDistance(normTarget, normCandidate);
    const charSim = Math.max(0, 1 - (dist / maxLen));

    // Word-level token search in candidate
    const targetWords = normTarget.split(' ').filter(Boolean);
    const candidateWords = normCandidate.split(' ').filter(Boolean);

    let bestWindowSim = 0;
    if (candidateWords.length >= targetWords.length) {
      for (let i = 0; i <= candidateWords.length - targetWords.length; i++) {
        let windowScore = 0;
        for (let j = 0; j < targetWords.length; j++) {
          windowScore += this._wordMatchScore(targetWords[j], candidateWords[i + j]);
        }
        const wAvg = windowScore / targetWords.length;
        if (wAvg > bestWindowSim) bestWindowSim = wAvg;
      }
    }

    // Word-by-word alignment similarity (handles spoken inflections e.g. happen to vs happened to)
    let tokenSim = 0;
    if (targetWords.length > 0 && candidateWords.length > 0) {
      let totalWordScore = 0;
      for (const tWord of targetWords) {
        let bestWScore = 0;
        for (const cWord of candidateWords) {
          const score = this._wordMatchScore(tWord, cWord);
          if (score > bestWScore) bestWScore = score;
        }
        totalWordScore += bestWScore;
      }
      tokenSim = totalWordScore / targetWords.length;
    }

    return Math.max(charSim, bestWindowSim, tokenSim);
  }

  evaluateSpokenAnswer(spokenInput) {
    const q = this.quizzes[this.currentIndex];
    if (!q) return;

    const candidates = Array.isArray(spokenInput)
      ? spokenInput.filter(Boolean)
      : [spokenInput].filter(Boolean);

    if (candidates.length === 0) {
      candidates.push('');
    }

    const target = q.target || q.keyExpression || q.answer || '';

    // Evaluate across all candidate transcripts to find the best match
    let bestSimilarity = 0;
    let bestSpokenText = candidates[0] || '';

    for (const cand of candidates) {
      const sim = this.calculateSimilarity(target, cand);
      // Prefer higher similarity, or if equal, prefer exact target match
      if (sim > bestSimilarity || (sim === bestSimilarity && this._normalizeString(cand) === this._normalizeString(target))) {
        bestSimilarity = sim;
        bestSpokenText = cand;
      }
    }

    const similarity = bestSimilarity;
    const spokenText = bestSpokenText;
    const passThreshold = 0.85; // 85% requirement from Issue #108
    const isPassed = similarity >= passThreshold;
    const percentScore = Math.round(similarity * 100);

    const feedbackBox = this.container.querySelector('#review-feedback-box');
    const slot = this.container.querySelector('#sentence-blank-slot');
    const liveDisplay = this.container.querySelector('#spoken-transcript-live');

    if (liveDisplay && spokenText) {
      liveDisplay.textContent = spokenText;
    }

    if (slot) {
      slot.textContent = `[ ${target} ]`;
      slot.classList.add(isPassed ? 'slot-correct' : 'slot-wrong');
    }

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      if (isPassed) {
        this.results[this.currentIndex] = { passed: true, score: percentScore, userText: spokenText };
        this.state.results = this.results;
        this._saveProgress();
        feedbackBox.className = 'review-feedback-box success animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge success">
            <span>🎉 완벽해요! (일치율: ${percentScore}%, 기준 85% 통과)</span>
          </div>
          <p class="feedback-comparison">
            <strong>정답 표현:</strong> "${this._escapeHtml(target)}"<br>
            <strong>인식된 발음:</strong> "${this._escapeHtml(spokenText)}"
          </p>
          ${q.explanation ? `<p class="feedback-explanation">💡 ${this._escapeHtml(q.explanation)}</p>` : ''}
          <div class="feedback-actions">
            <button type="button" class="btn btn-secondary btn-feedback-action audio-btn" id="btn-feedback-listen" title="원문 소리 다시 듣기">
              <span>원문 다시 듣기 🎧</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-next-review-q">
              <span>다음 문제로 ▶</span>
            </button>
          </div>
        `;

        const feedbackListenBtn = feedbackBox.querySelector('#btn-feedback-listen');
        if (feedbackListenBtn) {
          feedbackListenBtn.addEventListener('click', () => this.replayAudio());
        }

        const nextBtn = feedbackBox.querySelector('#btn-next-review-q');
        if (nextBtn) {
          nextBtn.focus();
          nextBtn.addEventListener('click', () => this.advanceNext());
        }
      } else {
        feedbackBox.className = 'review-feedback-box retry animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge mismatch">
            <span>조금 아쉬워요! 다시 소리 내어 말해보세요 (일치율: ${percentScore}%, 합격 기준: 85%)</span>
          </div>
          <p class="feedback-comparison">
            <strong>정답 표현:</strong> "${this._escapeHtml(target)}"<br>
            <strong>인식된 발음:</strong> "${this._escapeHtml(spokenText)}"
          </p>
          <div class="feedback-actions">
            <button type="button" class="btn btn-secondary btn-feedback-action audio-btn" id="btn-feedback-listen" title="원문 소리 듣고 힌트 얻기">
              <span>원문 듣기 🎧</span>
            </button>
            <button type="button" class="btn btn-secondary" id="btn-retry-speaking">
              <span>다시 말하기 🎙️</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-pass-speaking">
              <span>정답 확인하고 넘어가기 ▶</span>
            </button>
          </div>
        `;

        const feedbackListenBtn = feedbackBox.querySelector('#btn-feedback-listen');
        if (feedbackListenBtn) {
          feedbackListenBtn.addEventListener('click', () => this.replayAudio());
        }

        const retryBtn = feedbackBox.querySelector('#btn-retry-speaking');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            feedbackBox.style.display = 'none';
            if (slot) slot.textContent = '[ ? ]';
            this.toggleSpeechRecognition();
          });
        }

        const passBtn = feedbackBox.querySelector('#btn-pass-speaking');
        if (passBtn) {
          passBtn.addEventListener('click', () => {
            this.results[this.currentIndex] = { passed: false, score: percentScore, userText: spokenText };
            this.state.results = this.results;
            this._saveProgress();
            this.advanceNext();
          });
        }
      }
    }
  }

  evaluateBlankAnswer(userText) {
    const q = this.quizzes[this.currentIndex];
    if (!q) return;

    const target = q.target || q.keyExpression || q.answer || '';
    const normTarget = this._normalizeString(target);
    const normUser = this._normalizeString(userText);
    const isPassed = normUser === normTarget;

    const feedbackBox = this.container.querySelector('#review-feedback-box');
    const slot = this.container.querySelector('#sentence-blank-slot');

    if (slot) {
      slot.textContent = `[ ${target} ]`;
      slot.classList.add(isPassed ? 'slot-correct' : 'slot-wrong');
    }

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      if (isPassed) {
        this.results[this.currentIndex] = { passed: true, score: 100, userText };
        this.state.results = this.results;
        this._saveProgress();
        feedbackBox.className = 'review-feedback-box success animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge success">
            <span>🎉 정답입니다! 정확하게 채우셨습니다!</span>
          </div>
          <p class="feedback-comparison">
            <strong>정답:</strong> "${this._escapeHtml(target)}"
          </p>
          ${q.explanation ? `<p class="feedback-explanation">💡 ${this._escapeHtml(q.explanation)}</p>` : ''}
          <div class="feedback-actions">
            <button type="button" class="btn btn-primary" id="btn-next-review-q">
              <span>다음 문제로 ▶</span>
            </button>
          </div>
        `;
        const nextBtn = feedbackBox.querySelector('#btn-next-review-q');
        if (nextBtn) {
          nextBtn.focus();
          nextBtn.addEventListener('click', () => this.advanceNext());
        }
      } else {
        feedbackBox.className = 'review-feedback-box retry animate-fade-in';
        feedbackBox.innerHTML = `
          <div class="feedback-badge mismatch">
            <span>틀렸습니다. 다시 한번 생각해보세요 ✍️</span>
          </div>
          <p class="feedback-comparison">
            <strong>입력한 답:</strong> "${this._escapeHtml(userText)}"<br>
            <strong>정답:</strong> "${this._escapeHtml(target)}"
          </p>
          <div class="feedback-actions">
            <button type="button" class="btn btn-secondary" id="btn-retry-blank">
              <span>다시 시도하기</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-pass-blank">
              <span>정답 확인하고 넘어가기 ▶</span>
            </button>
          </div>
        `;
        const retryBtn = feedbackBox.querySelector('#btn-retry-blank');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            feedbackBox.style.display = 'none';
            if (slot) slot.textContent = '[ ? ]';
            const input = this.container.querySelector('#blank-text-input');
            if (input) {
              input.focus();
              input.select();
            }
          });
        }
        const passBtn = feedbackBox.querySelector('#btn-pass-blank');
        if (passBtn) {
          passBtn.addEventListener('click', () => {
            this.results[this.currentIndex] = { passed: false, score: 0, userText };
            this.state.results = this.results;
            this._saveProgress();
            this.advanceNext();
          });
        }
      }
    }
  }

  advanceNext() {
    this.pauseAudio();
    this.showManualInput = false;
    this.currentIndex++;
    if (this.currentIndex >= this.quizzes.length) {
      this.completeAll();
    } else {
      this.state.currentIndex = this.currentIndex;
      this.state.results = this.results;
      this._saveProgress();
      this.render();
    }
  }

  completeAll() {
    this.state.completed = true;
    this.state.currentIndex = this.quizzes.length;
    this.state.results = this.results;
    this._saveProgress();
    this.renderCompletedState();
  }

  restartQuiz() {
    this.pauseAudio();
    this.currentIndex = 0;
    this.results = {};
    this.state.completed = false;
    this.state.currentIndex = 0;
    this.state.results = {};
    this._saveProgress();
    this.render();
  }

  _saveProgress() {
    if (typeof Storage !== 'undefined' && typeof Storage.saveReviewQuizProgress === 'function') {
      Storage.saveReviewQuizProgress(this.lessonId, this.state);
    }
  }

  renderCompletedState(isInitialLoad = false) {
    this.pauseAudio();
    this.state.completed = true;
    this.state.currentIndex = this.quizzes.length;
    this.state.results = this.results;
    this._saveProgress();

    const total = this.quizzes.length;
    let passedCount = 0;
    this.quizzes.forEach((q, idx) => {
      const res = this.results[idx];
      if (res && res.passed) passedCount++;
    });

    const percent = Math.round((passedCount / total) * 100);

    // Complete the lesson permanently in Storage!
    if (typeof Storage !== 'undefined' && typeof Storage.setLessonCompleted === 'function') {
      Storage.setLessonCompleted(this.lessonId, true);
    }

    if (!isInitialLoad && this.celebrationManager && typeof this.celebrationManager._launchConfettiParticles === 'function') {
      this.celebrationManager._launchConfettiParticles();
    }

    this.container.innerHTML = `
      <div class="review-quiz-card completed animate-fade-in" role="region" aria-label="Review Quiz Completed">
        <div class="review-complete-icon">🏆</div>
        <h3 class="review-complete-title">모든 5단계 학습 완료!</h3>
        <p class="review-complete-desc">
          축하합니다! 퀴즈, 핵심 문장, 전체 영상, 받아쓰기, 그리고 스피킹 퀴즈까지<br>
          <strong>5단계 학습을 모두 완벽하게 마스터</strong>하셨습니다!
        </p>

        <div class="review-stats-grid">
          <div class="review-stat-box">
            <span class="stat-value">${passedCount} / ${total}</span>
            <span class="stat-name">스피킹 통과 (${percent}%)</span>
          </div>
          <div class="review-stat-box">
            <span class="stat-value">${total}개</span>
            <span class="stat-name">스피킹 퀴즈</span>
          </div>
        </div>

        <div class="review-complete-actions">
          <button type="button" class="btn btn-primary btn-goto-writing" id="btn-review-goto-writing">
            <span>✍️ 나만의 문장 영작 & 댓글 남기기 ▶</span>
          </button>
          <a href="/lessons.html" class="btn btn-secondary">
            <span>📚 전체 레슨 목록으로</span>
          </a>
          <button type="button" class="btn btn-ghost" id="btn-restart-review">
            <span>스피킹 퀴즈 다시 풀기 ↺</span>
          </button>
        </div>
      </div>
    `;

    const gotoWritingBtn = this.container.querySelector('#btn-review-goto-writing');
    if (gotoWritingBtn) {
      gotoWritingBtn.addEventListener('click', () => {
        const step4Tab = document.querySelector('.step-tab-btn[data-step="writing"]');
        if (step4Tab) {
          step4Tab.click();
        } else if (typeof showStep === 'function') {
          showStep('writing', true);
        }
      });
    }

    const restartBtn = this.container.querySelector('#btn-restart-review');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.restartQuiz();
      });
    }

    this.onComplete({ total, passedCount, percent, alreadyCompleted: isInitialLoad });
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
  window.ReviewQuizEngine = ReviewQuizEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReviewQuizEngine;
}
