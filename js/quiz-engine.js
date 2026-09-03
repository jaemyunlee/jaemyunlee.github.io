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
    this.quizzes = options.quizzes || [];
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
    }

    this.container.innerHTML = `
      <div class="quiz-card" role="region" aria-label="Lesson Quiz Question">
        <div class="quiz-header">
          <div class="quiz-step-info">
            <span class="quiz-badge">Quiz ${currentNum} of ${total}</span>
            <span class="quiz-type-tag">${this._getTypeBadge(q.type)}</span>
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

    this._bindEvents(q);

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

    const optionsHtml = (q.options || []).map((opt, idx) => `
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

  _bindEvents(q) {
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
        if (e.key === 'Enter') {
          e.preventDefault();
          this._handleCheck(q);
        }
      });
    }

    // Check button click
    if (checkBtn) {
      checkBtn.addEventListener('click', () => this._handleCheck(q));
    }

    // Hint button click
    if (hintBtn && hintBox) {
      hintBtn.addEventListener('click', () => {
        hintBox.style.display = 'block';
        hintBox.innerHTML = `
          <div class="hint-content">
            <span class="hint-label">💡 힌트:</span>
            <span class="hint-letters">${this._escapeHtml(q.hint)}</span>
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

    // Listening speaker button
    if (q.type === 'listening') {
      const speakerBtn = this.container.querySelector('#speaker-play-btn');
      if (speakerBtn) {
        speakerBtn.addEventListener('click', () => {
          this.playAudio(q.audio, q.english.replace(/\[|\]/g, ''));
        });
      }
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

  _recordResult(index, isCorrect) {
    if (!this.state.questionResults) {
      this.state.questionResults = {};
    }
    this.state.questionResults[index] = !!isCorrect;
    Storage.saveProgress(this.lessonId, this.state);
  }

  _handleCheck(q) {
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
      this._recordResult(this.currentIndex, passedFirstAttempt);
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
    const input = this.container.querySelector('#quiz-blank-input');
    if (input) {
      input.value = q.answer;
      input.classList.add('correct');
      input.disabled = true;
    }

    this.questionFailed = true;
    this._recordResult(this.currentIndex, false);
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
      this._recordResult(this.currentIndex, passedFirstAttempt);
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
        setTimeout(() => nextBtn.focus(), 50);
        nextBtn.addEventListener('click', () => {
          if (isLast) {
            this.completeAll();
          } else {
            this.nextQuestion();
          }
        });
      }
    }

    // Allow user to hit Enter key to advance comfortably
    const handleNextKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.removeEventListener('keydown', handleNextKey);
        if (isLast) {
          this.completeAll();
        } else {
          this.nextQuestion();
        }
      }
    };
    document.addEventListener('keydown', handleNextKey, { once: true });
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
    const total = this.quizzes.length;
    const results = this.state.questionResults || {};
    let correctCount = 0;
    for (let i = 0; i < total; i++) {
      if (results[i] === true) {
        correctCount++;
      }
    }
    // Fallback if completed previously without detailed results
    if (Object.keys(results).length === 0 && this.state.completed) {
      correctCount = total;
    }

    const wrongCount = Math.max(0, total - correctCount);
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 100;

    let scoreTitle = '모든 퀴즈 완료! 🎓';
    let scoreDesc = '이번 레슨의 핵심 어휘와 표현 퀴즈를 모두 마쳤습니다.';
    if (percent === 100) {
      scoreTitle = '완벽합니다! 100점 만점! 🏆';
      scoreDesc = '모든 문제를 첫 시도에 완벽하게 맞히셨습니다! 대단해요!';
    } else if (percent >= 80) {
      scoreTitle = '훌륭한 성적입니다! 🌟';
      scoreDesc = '대부분의 핵심 표현을 첫 시도에 잘 맞히셨습니다!';
    } else {
      scoreTitle = '퀴즈 완료! 다시 도전해보세요! 💪';
      scoreDesc = '틀린 문제를 다시 복습하여 100점에 도전해보세요!';
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
            <span class="quiz-score-sublabel">첫 시도에 맞힌 문제 (${percent}%)</span>
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
          <!-- Replay Button replaces 영상 시청 & 스크립트 학습 버튼 -->
          <button type="button" class="btn btn-primary btn-replay-quiz" id="btn-replay-quiz">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            <span>퀴즈 다시 풀기 (Replay)</span>
          </button>
          <button type="button" class="btn-step2-secondary" id="btn-goto-video" title="Step 2: 영상 시청 & 스크립트 학습으로 이동">
            <span>영상 & 대본 보러가기 ▶</span>
          </button>
        </div>
      </div>
    `;

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }

    const replayBtn = this.container.querySelector('#btn-replay-quiz');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.restartQuiz();
      });
    }

    const videoBtn = this.container.querySelector('#btn-goto-video');
    if (videoBtn) {
      videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof this.onStartVideo === 'function') {
          this.onStartVideo();
        } else {
          const step2Tab = document.querySelector('.step-tab-btn[data-step="2"]');
          if (step2Tab) {
            step2Tab.click();
          } else {
            const quizSection = document.getElementById('quiz-section');
            const videoSection = document.getElementById('video-section');
            if (quizSection) quizSection.style.display = 'none';
            if (videoSection) {
              videoSection.style.display = 'block';
              videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      });
    }
  }

  restartQuiz() {
    this.currentIndex = 0;
    this.questionFailed = false;
    this.state.completed = false;
    this.state.currentQuestionIndex = 0;
    this.state.questionResults = {};
    Storage.saveProgress(this.lessonId, this.state);
    this.renderCurrentQuestion();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
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
  module.exports = QuizEngine;
}

