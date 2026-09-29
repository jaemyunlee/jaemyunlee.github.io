/**
 * Review / Recall Quiz Engine for RhyRhy English (Issue #108 - Step 5)
 * Supports:
 * 1. Fill-in-the-Blank Quiz
 * 2. Speaking Quiz with in-browser Speech-to-Text (STT) and >=85% similarity evaluation
 * Automatically completes the lesson upon passing Step 5.
 */
class ReviewQuizEngine {
  constructor(options = {}) {
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
    this.lessonId = options.lessonId;
    this.quizzes = options.quizzes || [];
    this.onComplete = options.onComplete || (() => {});
    this.celebrationManager = options.celebrationManager || null;

    this.currentIndex = 0;
    this.results = {}; // index -> { passed: boolean, score: number, userText: string }
    this.isListening = false;
    this.recognition = null;
    this.sttSupported = this._initSTT();
    this.showManualInput = false;
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
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this._updateMicButton(true);
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcriptDisplay = this.container.querySelector('#spoken-transcript-live');
        if (transcriptDisplay) {
          transcriptDisplay.textContent = finalTranscript || interimTranscript || '말씀을 듣고 있습니다...';
        }

        if (finalTranscript) {
          this.evaluateSpokenAnswer(finalTranscript);
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

        <!-- Interactive Area -->
        ${interactiveHtml}

        <!-- Evaluation Feedback Box -->
        <div class="review-feedback-box" id="review-feedback-box" style="display: none;"></div>
      </div>
    `;

    this._bindEvents(q);
  }

  _bindEvents(q) {
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

  _normalizeString(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[.,!?;:"'’`~()[\]{}]/g, '')
      .replace(/\bgonna\b/g, 'going to')
      .replace(/\bwanna\b/g, 'want to')
      .replace(/\bkinda\b/g, 'kind of')
      .replace(/\bdon't\b/g, 'do not')
      .replace(/\bdid't\b/g, 'did not')
      .replace(/\bcan't\b/g, 'cannot')
      .replace(/\bi'm\b/g, 'i am')
      .replace(/\bit's\b/g, 'it is')
      .replace(/\s+/g, ' ')
      .trim();
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

    // Substring match: if user spoken phrase contains the target phrase
    if (normCandidate.includes(normTarget)) {
      return 1.0;
    }

    // Direct Levenshtein similarity
    const maxLen = Math.max(normTarget.length, normCandidate.length);
    const dist = this._levenshteinDistance(normTarget, normCandidate);
    const charSim = Math.max(0, 1 - (dist / maxLen));

    // Word-level token search in candidate
    const targetWords = normTarget.split(' ');
    const candidateWords = normCandidate.split(' ');

    let bestWindowSim = 0;
    if (candidateWords.length >= targetWords.length) {
      for (let i = 0; i <= candidateWords.length - targetWords.length; i++) {
        const windowStr = candidateWords.slice(i, i + targetWords.length).join(' ');
        const wDist = this._levenshteinDistance(normTarget, windowStr);
        const wMax = Math.max(normTarget.length, windowStr.length);
        const wSim = Math.max(0, 1 - (wDist / wMax));
        if (wSim > bestWindowSim) bestWindowSim = wSim;
      }
    }

    // Word-by-word alignment similarity (handles spoken inflections e.g. happen to vs happened to)
    let tokenSim = 0;
    if (targetWords.length > 0 && candidateWords.length > 0) {
      let totalWordScore = 0;
      for (const tWord of targetWords) {
        let bestWScore = 0;
        for (const cWord of candidateWords) {
          const wDist = this._levenshteinDistance(tWord, cWord);
          const wMax = Math.max(tWord.length, cWord.length);
          const score = wMax > 0 ? (1 - wDist / wMax) : 0;
          if (score > bestWScore) bestWScore = score;
        }
        totalWordScore += bestWScore;
      }
      tokenSim = totalWordScore / targetWords.length;
    }

    return Math.max(charSim, bestWindowSim, tokenSim);
  }

  evaluateSpokenAnswer(spokenText) {
    const q = this.quizzes[this.currentIndex];
    if (!q) return;

    const target = q.target || q.keyExpression || q.answer || '';
    const similarity = this.calculateSimilarity(target, spokenText);
    const passThreshold = 0.85; // 85% requirement from Issue #108
    const isPassed = similarity >= passThreshold;
    const percentScore = Math.round(similarity * 100);

    const feedbackBox = this.container.querySelector('#review-feedback-box');
    const slot = this.container.querySelector('#sentence-blank-slot');

    if (slot) {
      slot.textContent = `[ ${target} ]`;
      slot.classList.add(isPassed ? 'slot-correct' : 'slot-wrong');
    }

    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      if (isPassed) {
        this.results[this.currentIndex] = { passed: true, score: percentScore, userText: spokenText };
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
            <span>조금 아쉬워요! 다시 소리 내어 말해보세요 (일치율: ${percentScore}%, 합격 기준: 85%)</span>
          </div>
          <p class="feedback-comparison">
            <strong>정답 표현:</strong> "${this._escapeHtml(target)}"<br>
            <strong>인식된 발음:</strong> "${this._escapeHtml(spokenText)}"
          </p>
          <div class="feedback-actions">
            <button type="button" class="btn btn-secondary" id="btn-retry-speaking">
              <span>다시 말하기 🎙️</span>
            </button>
            <button type="button" class="btn btn-primary" id="btn-pass-speaking">
              <span>정답 확인하고 넘어가기 ▶</span>
            </button>
          </div>
        `;

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
            this.advanceNext();
          });
        }
      }
    }
  }

  advanceNext() {
    this.showManualInput = false;
    this.currentIndex++;
    this.render();
  }

  renderCompletedState() {
    const total = this.quizzes.length;
    let passedCount = 0;
    let speakingCount = 0;
    let blankCount = 0;

    this.quizzes.forEach((q, idx) => {
      const res = this.results[idx];
      if (res && res.passed) passedCount++;
      if (q.type === 'speaking') speakingCount++;
      else blankCount++;
    });

    const percent = Math.round((passedCount / total) * 100);

    // Complete the lesson permanently in Storage!
    if (typeof Storage !== 'undefined' && typeof Storage.setLessonCompleted === 'function') {
      Storage.setLessonCompleted(this.lessonId, true);
    }

    if (this.celebrationManager && typeof this.celebrationManager._launchConfettiParticles === 'function') {
      this.celebrationManager._launchConfettiParticles();
    }

    this.container.innerHTML = `
      <div class="review-quiz-card completed animate-fade-in" role="region" aria-label="Review Quiz Completed">
        <div class="review-complete-icon">🏆</div>
        <h3 class="review-complete-title">모든 5단계 학습 완료!</h3>
        <p class="review-complete-desc">
          축하합니다! 퀴즈, 핵심 문장, 전체 영상, 딕테이션, 그리고 복습 퀴즈까지<br>
          <strong>5단계 학습을 모두 완벽하게 마스터</strong>하셨습니다!
        </p>

        <div class="review-stats-grid">
          <div class="review-stat-box">
            <span class="stat-value">${passedCount} / ${total}</span>
            <span class="stat-name">맞힌 문제 (${percent}%)</span>
          </div>
          <div class="review-stat-box">
            <span class="stat-value">${speakingCount}개</span>
            <span class="stat-name">스피킹 퀴즈</span>
          </div>
          <div class="review-stat-box">
            <span class="stat-value">${blankCount}개</span>
            <span class="stat-name">빈칸 퀴즈</span>
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
            <span>복습 퀴즈 다시 풀기 ↺</span>
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
        this.currentIndex = 0;
        this.results = {};
        this.render();
      });
    }

    this.onComplete({ total, passedCount, percent });
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
