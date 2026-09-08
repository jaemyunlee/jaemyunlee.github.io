/**
 * YouTube Comment & Post-Video Reflection Manager for RhyRhy English
 * 100% Safe, Zero-Permission Flow:
 * Nudges user to write their own sentence using target expressions,
 * saves to local sentence bank, copies comment to clipboard,
 * and opens original YouTube video for 1-click comment posting.
 */
class YouTubeCommentManager {
  constructor(options = {}) {
    this.lessonId = options.lessonId;
    this.youtubeId = options.youtubeId;
    this.lessonMetadata = options.lessonMetadata || {};
    this.quizzes = options.quizzes || [];
    this.celebrationManager = options.celebrationManager;
    this.nextLessonUrl = options.nextLessonUrl || null;
    this.onComplete = options.onComplete || null;
    this.container = typeof options.container === 'string'
      ? document.querySelector(options.container)
      : options.container;
  }

  init() {
    if (!this.container) return;
    this.renderReflectionNudge();
    this._bindEvents();
  }

  setQuizzes(quizzes) {
    this.quizzes = quizzes || [];
    this.renderReflectionNudge();
    this._bindEvents();
  }

  _extractVocabItems() {
    if (!this.quizzes || this.quizzes.length === 0) {
      return [];
    }

    const items = [];
    const seen = new Set();

    for (const q of this.quizzes) {
      const phrase = (q.answer || '').trim();
      if (!phrase || seen.has(phrase.toLowerCase())) continue;
      seen.add(phrase.toLowerCase());

      items.push({ phrase });
    }

    return items;
  }

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  renderReflectionNudge() {
    const vocabList = this._extractVocabItems();

    const vocabSectionHtml = vocabList.length > 0 ? `
      <div class="vocab-picks-section">
        <div class="vocab-picks-header">
          <span class="vocab-picks-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
            </svg>
            퀴즈에서 배운 핵심 어휘 & 표현
          </span>
          <span class="vocab-picks-hint">클릭하면 입력창에 단어가 자동으로 쏙 들어가요!</span>
        </div>
        <div class="vocab-chips-container" id="vocab-chips-container">
          ${vocabList.map(item => `
            <button type="button" class="vocab-pick-chip" data-phrase="${this._escapeHtml(item.phrase)}" title="문장에 '${this._escapeHtml(item.phrase)}' 추가하기">
              <span class="chip-plus">+</span>
              <strong class="chip-phrase">${this._escapeHtml(item.phrase)}</strong>
            </button>
          `).join('')}
        </div>
      </div>
    ` : '';

    this.container.innerHTML = `
      <div class="reflection-card" id="reflection-card" role="region" aria-label="Lesson Reflection & YouTube Comment">
        <!-- Header -->
        <div class="reflection-header">
          <div class="reflection-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div>
            <h3 class="reflection-title">오늘 배운 표현으로 나만의 문장 만들기 ✍️</h3>
            <p class="reflection-subtitle">
              영상과 퀴즈에서 배운 표현을 직접 활용해 짧은 한 문장을 영어로 써보세요. 직접 써볼 때 실력이 가장 빠르게 늘어납니다!
            </p>
          </div>
        </div>

        <!-- Vocab & Expression Picks Section -->
        ${vocabSectionHtml}

        <!-- Encouraging Card: Don't be scared to make mistakes! -->
        <div class="mistake-encouragement-card">
          <div class="encouragement-icon-box" aria-hidden="true">🌱</div>
          <div class="encouragement-content">
            <h4 class="encouragement-title">틀려도 정말 괜찮아요! (Don't be afraid to make mistakes)</h4>
            <p class="encouragement-text">
              실수는 영어 실력이 쑥쑥 늘고 있다는 가장 확실한 증거입니다.<br>
              문법이 조금 틀려도 괜찮으니, 오늘 배운 단어 하나만 넣어서 자유롭고 편안하게 한 문장을 만들어보세요. 
              현서네 가족이 여러분의 소중한 도전을 언제나 진심으로 응원합니다! 💛
            </p>
          </div>
        </div>

        <!-- Prompt Input Box -->
        <div class="reflection-prompt-box">
          <label for="user-reflection-sentence" class="reflection-label">
            나만의 영어 문장 작성하기 (My English Sentence):
          </label>
          <textarea 
            id="user-reflection-sentence" 
            class="reflection-textarea" 
            rows="3" 
            placeholder="예시: I just happened to watch this video, and it was so helpful!"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="reflection-actions">
          <div class="api-status-info" id="api-status-info">
            <span class="safe-badge-pill" style="display: inline-flex; align-items: center; gap: 6px; color: var(--accent-emerald); font-weight: 600;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10B981" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>계정 권한 요구 없음 • 100% 안전한 참여</span>
            </span>
          </div>
          <div class="reflection-buttons">
            <button type="button" class="btn btn-primary btn-post-comment" id="btn-post-comment">
              <svg class="yt-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>문장 복사 & 유튜브 댓글 남기기 ↗</span>
            </button>
          </div>
        </div>

        <div class="reflection-feedback" id="reflection-feedback" style="display: none;"></div>
      </div>
    `;
  }

  _bindEvents() {
    const postBtn = this.container.querySelector('#btn-post-comment');
    const textarea = this.container.querySelector('#user-reflection-sentence');

    // Bind vocab pick chips to insert into textarea
    const chips = this.container.querySelectorAll('.vocab-pick-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const phrase = chip.dataset.phrase;
        if (phrase) {
          this._insertPhraseToTextarea(phrase);
        }
      });
    });

    if (postBtn) {
      postBtn.addEventListener('click', () => {
        const sentence = textarea ? textarea.value.trim() : '';
        if (!sentence) {
          textarea.classList.add('shake');
          setTimeout(() => textarea.classList.remove('shake'), 500);
          return;
        }

        this.postComment(sentence);
      });
    }
  }

  _insertPhraseToTextarea(phrase) {
    const textarea = this.container.querySelector('#user-reflection-sentence');
    if (!textarea) return;

    const start = textarea.selectionStart !== undefined ? textarea.selectionStart : textarea.value.length;
    const end = textarea.selectionEnd !== undefined ? textarea.selectionEnd : textarea.value.length;
    const currentVal = textarea.value;

    const needsLeadingSpace = start > 0 && !/\s$/.test(currentVal.substring(0, start));
    const toInsert = (needsLeadingSpace ? ' ' : '') + phrase + ' ';

    textarea.value = currentVal.substring(0, start) + toInsert + currentVal.substring(end);
    textarea.focus();
    const newPos = start + toInsert.length;
    textarea.setSelectionRange(newPos, newPos);

    if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
      App.showToast(`문장에 추가되었습니다: "${phrase}"`);
    }
  }

  async postComment(sentence) {
    const postBtn = this.container.querySelector('#btn-post-comment');
    const feedback = this.container.querySelector('#reflection-feedback');

    // 1. Format sentence with branding hint
    const formattedComment = `${sentence}\n\n(현서네 리얼 영어 3분 챌린지로 작성된 문장입니다 ✨)`;

    // 2. Mark entire lesson complete in storage
    Storage.setLessonCompleted(this.lessonId, true);
    Storage.recordLessonCompletion(this.lessonId, this.lessonMetadata);

    // 3. Copy to clipboard
    let copied = false;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(formattedComment);
        copied = true;
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    }

    // Track Step 4 & Lesson completion in Analytics funnel
    if (typeof Analytics !== 'undefined') {
      Analytics.trackStepComplete(this.lessonId, 4, {
        action: 'comment_submitted',
        copied: copied
      });
      Analytics.trackLessonComplete(this.lessonId);
    }

    // 4. Open YouTube video in new tab
    const ytUrl = `https://www.youtube.com/watch?v=${this.youtubeId}`;
    window.open(ytUrl, '_blank', 'noopener,noreferrer');

    // 5. Update Button UI
    if (postBtn) {
      postBtn.disabled = false;
      postBtn.className = 'btn btn-outline btn-post-comment';
      postBtn.innerHTML = `<span>댓글 복사 완료! ✓ (학습 완료)</span>`;
    }

    const nextLessonUrl = this.getNextLessonUrl();

    // 6. Show clear, reassuring completion feedback
    if (feedback) {
      feedback.style.display = 'block';
      feedback.className = 'reflection-feedback success';
      feedback.innerHTML = `
        <div class="feedback-inner">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10B981" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <strong style="color: var(--accent-emerald); font-size: 1.15rem; display: block; margin-bottom: 4px;">🏆 축하합니다! 오늘의 레슨을 모두 완주하셨습니다!</strong>
            <p style="margin: 6px 0 14px; color: var(--text-muted); line-height: 1.6;">
              ${copied ? '작성하신 문장이 <strong>클립보드에 자동 복사</strong>되었습니다.<br>유튜브 영상 댓글창에서 <strong>붙여넣기(Ctrl+V / Cmd+V)</strong> 후 나만의 멋진 문장을 남겨보세요!' : '유튜브 영상 댓글창으로 이동해 작성한 문장을 댓글로 남겨보세요!'}
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px;">
              <a href="${ytUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" id="btn-goto-youtube-comment" style="padding: 9px 20px; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-full);">
                <span>💬 유튜브에 댓글 남기러 가기 ↗</span>
              </a>
              <a href="${nextLessonUrl}" class="btn btn-outline" id="btn-goto-next-lesson" style="padding: 9px 20px; font-size: 0.9rem; font-weight: 700; border-radius: var(--radius-full);">
                <span>다음 레슨 공부하기 ▶</span>
              </a>
            </div>
          </div>
        </div>
      `;

      if (this.onComplete) {
        this.onComplete();
      }
    }

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('🏆 축하합니다! 오늘의 레슨을 모두 완료했습니다!', 'success');
    }

    // Trigger celebratory confetti burst
    if (this.celebrationManager) {
      if (typeof this.celebrationManager._launchConfettiParticles === 'function') {
        this.celebrationManager._launchConfettiParticles();
      }
    }

    // Check PWA installation prompt upon lesson complete
    if (typeof PWAManager !== 'undefined') {
      PWAManager.checkAndPrompt(this.lessonId);
    }
  }

  getNextLessonUrl() {
    if (this.nextLessonUrl) return this.nextLessonUrl;
    if (typeof App !== 'undefined' && typeof App.getNextLessonUrl === 'function') {
      return App.getNextLessonUrl(this.lessonId);
    }
    const match = (this.lessonId || '').match(/lesson-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      const nextId = `lesson-${String(nextNum).padStart(2, '0')}`;
      if (typeof App !== 'undefined' && Array.isArray(App.lessons)) {
        const found = App.lessons.find(l => l.id === nextId);
        if (found && found.path) {
          const cleanPath = found.path.replace(/^\/+/, '');
          return '/' + cleanPath + (cleanPath.endsWith('/') ? 'index.html' : '/index.html');
        }
      }
    }
    return '/lessons.html';
  }

  nudgeFocus() {
    const card = this.container.querySelector('#reflection-card');
    const textarea = this.container.querySelector('#user-reflection-sentence');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight-nudge');
      setTimeout(() => card.classList.remove('highlight-nudge'), 1500);
      if (textarea) textarea.focus();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = YouTubeCommentManager;
}
