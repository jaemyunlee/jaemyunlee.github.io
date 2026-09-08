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
    this.isCopied = false;
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
            <button type="button" class="btn btn-outline btn-copy-sentence" id="btn-copy-sentence" disabled title="문장을 작성하면 활성화됩니다">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span id="copy-btn-text">✍️ 문장을 작성하면 활성화됩니다</span>
            </button>

            <button type="button" class="btn btn-primary btn-post-comment" id="btn-post-comment">
              <svg class="yt-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span id="youtube-btn-text">🎬 유튜브 영상 바로가기 ↗</span>
            </button>
          </div>
        </div>

        <div class="reflection-feedback" id="reflection-feedback" style="display: none;"></div>
      </div>
    `;
  }

  _bindEvents() {
    const postBtn = this.container.querySelector('#btn-post-comment');
    const copyBtn = this.container.querySelector('#btn-copy-sentence');
    const copyBtnText = this.container.querySelector('#copy-btn-text');
    const textarea = this.container.querySelector('#user-reflection-sentence');

    // Update copyBtn state based on textarea input
    const updateCopyBtnState = () => {
      if (copyBtn && textarea) {
        const hasText = textarea.value.trim().length > 0;
        copyBtn.disabled = !hasText;
        if (copyBtnText) {
          if (hasText) {
            copyBtnText.textContent = this.isCopied ? '📋 문장 다시 복사하기' : '📋 문장 클립보드에 복사';
            copyBtn.removeAttribute('title');
          } else {
            copyBtnText.textContent = '✍️ 문장을 작성하면 활성화됩니다';
            copyBtn.setAttribute('title', '문장을 작성하면 활성화됩니다');
          }
        }
      }
    };

    if (textarea) {
      textarea.addEventListener('input', updateCopyBtnState);
      updateCopyBtnState();
    }

    // Bind vocab pick chips to insert into textarea
    const chips = this.container.querySelectorAll('.vocab-pick-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const phrase = chip.dataset.phrase;
        if (phrase) {
          this._insertPhraseToTextarea(phrase);
          updateCopyBtnState();
        }
      });
    });

    // Copy sentence button handler
    // Behavior: Copies sentence to clipboard, updates lesson status to completed,
    // and displays the description encouraging YouTube comment & community support.
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const sentence = textarea ? textarea.value.trim() : '';
        if (!sentence) return;

        const formatted = `${sentence}\n\n(현서네 리얼 영어 3분 챌린지로 작성된 문장입니다 ✨)`;
        let copied = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(formatted);
            copied = true;
          } catch (err) {
            console.warn('Clipboard write failed:', err);
          }
        }

        this.isCopied = true;

        if (copyBtnText) {
          copyBtnText.textContent = '✓ 문장 복사 완료!';
          setTimeout(() => {
            if (copyBtnText && textarea && textarea.value.trim().length > 0) {
              copyBtnText.textContent = '📋 문장 다시 복사하기';
            }
          }, 2500);
        }

        // 1. Mark lesson completed in Storage
        Storage.setLessonCompleted(this.lessonId, true);
        Storage.recordLessonCompletion(this.lessonId, this.lessonMetadata);

        // 2. Track Step 4 & Lesson completion in Analytics
        if (typeof Analytics !== 'undefined') {
          Analytics.trackStepComplete(this.lessonId, 4, {
            action: 'sentence_copied',
            hasSentence: true,
            copied: true
          });
          Analytics.trackLessonComplete(this.lessonId);
        }

        // 3. Launch celebratory confetti burst
        if (this.celebrationManager && typeof this.celebrationManager._launchConfettiParticles === 'function') {
          this.celebrationManager._launchConfettiParticles();
        }

        // 4. Toast notification
        if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
          App.showToast('📋 작성하신 문장이 클립보드에 복사되었으며 레슨이 완료되었습니다!', 'success');
        }

        // 5. Display the encouragement/completion description
        this.renderCompletionFeedback({ copied: true });

        // 6. Notify complete callback
        if (this.onComplete) {
          this.onComplete();
        }

        // 7. Check PWA installation prompt
        if (typeof PWAManager !== 'undefined') {
          PWAManager.checkAndPrompt(this.lessonId);
        }
      });
    }

    // YouTube link button (always active)
    // Behavior:
    // - If the user has already clicked the copy button, take them to the link immediately.
    // - If the user has not clicked the copy button yet, display the same encouragement/completion description instead.
    if (postBtn) {
      postBtn.addEventListener('click', () => {
        const ytUrl = `https://www.youtube.com/watch?v=${this.youtubeId}`;

        if (this.isCopied) {
          // Already copied -> immediately open YouTube
          window.open(ytUrl, '_blank', 'noopener,noreferrer');
        } else {
          // Not copied yet -> display encouragement/completion description instead
          const sentence = textarea ? textarea.value.trim() : '';

          // Mark lesson completed in Storage
          Storage.setLessonCompleted(this.lessonId, true);
          Storage.recordLessonCompletion(this.lessonId, this.lessonMetadata);

          if (typeof Analytics !== 'undefined') {
            Analytics.trackStepComplete(this.lessonId, 4, {
              action: 'youtube_btn_clicked_before_copy',
              hasSentence: !!sentence,
              copied: false
            });
            Analytics.trackLessonComplete(this.lessonId);
          }

          if (this.celebrationManager && typeof this.celebrationManager._launchConfettiParticles === 'function') {
            this.celebrationManager._launchConfettiParticles();
          }

          if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
            App.showToast('🏆 축하합니다! 오늘의 레슨을 완료하셨습니다!', 'success');
          }

          // Display encouragement/completion description
          this.renderCompletionFeedback({ copied: false });

          // Mark isCopied as true so next click takes user directly to YouTube
          this.isCopied = true;

          const ytBtnText = postBtn.querySelector('#youtube-btn-text') || postBtn.querySelector('span');
          if (ytBtnText) {
            ytBtnText.textContent = '🎬 유튜브 영상으로 이동하기 ↗';
          }

          if (this.onComplete) {
            this.onComplete();
          }

          if (typeof PWAManager !== 'undefined') {
            PWAManager.checkAndPrompt(this.lessonId);
          }
        }
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

  renderCompletionFeedback(options = {}) {
    const feedback = this.container.querySelector('#reflection-feedback');
    if (!feedback) return;

    const copied = Boolean(options.copied);
    const ytUrl = `https://www.youtube.com/watch?v=${this.youtubeId}`;
    const nextLessonUrl = this.getNextLessonUrl();

    feedback.style.display = 'block';
    feedback.className = 'reflection-feedback success';
    feedback.innerHTML = `
      <div class="feedback-inner">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#10B981" stroke-width="2.5" style="flex-shrink: 0; margin-top: 2px;">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <div>
          <strong style="color: var(--accent-emerald); font-size: 1.18rem; display: block; margin-bottom: 6px;">
            🏆 축하합니다! 오늘의 레슨을 모두 완주하셨습니다!
          </strong>
          <p style="margin: 6px 0 12px; color: var(--text-main); line-height: 1.6; font-size: 0.95rem;">
            ${copied 
              ? '작성하신 멋진 문장이 <strong>클립보드에 복사</strong>되었습니다! 🎉<br>새 창으로 열린 유튜브 영상 댓글창에서 <strong>붙여넣기(Ctrl+V / Cmd+V)</strong>하여 나만의 영어 문장을 남겨보세요.' 
              : '오늘 배운 표현으로 만든 나만의 영어 문장을 유튜브 영상에 댓글로 남겨보세요! ✨'}
            <br>여러분의 따뜻한 댓글과 응원은 <strong>현서네 리얼 영어</strong>가 지속적으로 양질의 무료 서비스를 이어가는 데 가장 큰 힘이 됩니다. 💖
          </p>

          <div class="community-notice-box">
            <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6;">
              💬 오늘 학습은 어떠셨나요? 여러분의 소중한 학습 후기와 피드백을 
              <a href="https://www.youtube.com/@happyfamily8/posts" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 700; text-decoration: underline;">
                현서네 유튜브 커뮤니티 게시판
              </a>
              에도 자유롭게 들려주세요! 함께 격려하며 더 즐겁게 영어를 배울 수 있습니다.
            </p>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 14px;">
            <a href="${nextLessonUrl}" class="btn btn-primary" id="btn-goto-next-lesson" style="padding: 10px 22px; font-size: 0.92rem; font-weight: 700; border-radius: var(--radius-full);">
              <span>다음 레슨 공부하기 ▶</span>
            </a>
            <a href="${ytUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" id="btn-goto-youtube-comment" style="padding: 10px 20px; font-size: 0.9rem; font-weight: 600; border-radius: var(--radius-full);">
              <span>🎬 유튜브 영상 댓글 남기러 가기 ↗</span>
            </a>
          </div>
        </div>
      </div>
    `;

    // Smoothly scroll directly to show the completion & encouragement description
    setTimeout(() => {
      try {
        const navHeight = 70;
        const rect = feedback.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetY = rect.top + scrollTop - navHeight - 16;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      } catch (_) {
        feedback.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  async openYouTubeAndComplete(sentence = '') {
    const textarea = this.container.querySelector('#user-reflection-sentence');
    const textToUse = (typeof sentence === 'string' && sentence.trim())
      ? sentence.trim()
      : (textarea ? textarea.value.trim() : '');

    let copied = false;
    if (textToUse) {
      const formattedComment = `${textToUse}\n\n(현서네 리얼 영어 3분 챌린지로 작성된 문장입니다 ✨)`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(formattedComment);
          copied = true;
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }
    }

    this.isCopied = true;

    // 1. Mark entire lesson complete in storage
    Storage.setLessonCompleted(this.lessonId, true);
    Storage.recordLessonCompletion(this.lessonId, this.lessonMetadata);

    // 2. Track Step 4 & Lesson completion in Analytics
    if (typeof Analytics !== 'undefined') {
      Analytics.trackStepComplete(this.lessonId, 4, {
        action: 'youtube_opened',
        hasSentence: !!textToUse,
        copied: copied
      });
      Analytics.trackLessonComplete(this.lessonId);
    }

    // 3. Open YouTube video in new tab
    const ytUrl = `https://www.youtube.com/watch?v=${this.youtubeId}`;
    window.open(ytUrl, '_blank', 'noopener,noreferrer');

    // 4. Update Button UI
    const postBtn = this.container.querySelector('#btn-post-comment');
    if (postBtn) {
      postBtn.innerHTML = `<span>✓ 학습 완료 (유튜브 영상 열림)</span>`;
    }

    // 5. Show completion feedback
    this.renderCompletionFeedback({ copied });

    if (this.onComplete) {
      this.onComplete();
    }

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('🏆 축하합니다! 오늘의 레슨을 모두 완료했습니다!', 'success');
    }

    // Trigger celebratory confetti burst
    if (this.celebrationManager && typeof this.celebrationManager._launchConfettiParticles === 'function') {
      this.celebrationManager._launchConfettiParticles();
    }

    // Check PWA installation prompt upon lesson complete
    if (typeof PWAManager !== 'undefined') {
      PWAManager.checkAndPrompt(this.lessonId);
    }
  }

  // Alias for backward compatibility
  postComment(sentence) {
    return this.openYouTubeAndComplete(sentence);
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
