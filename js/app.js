/**
 * Main App Script for RhyRhy English
 * Initializes global navigation, lesson switcher, saved sentences drawer,
 * offline status notifications, and PWA service worker.
 */
/**
 * AudioPlayerComponent - Reusable Audio Player UI Component
 * Guarantees 100% visual and structural parity across Saved Sentences Drawer
 * (both mobile & desktop viewports) and Step 4 Review Player.
 */
const AudioPlayerComponent = {
  render(options = {}) {
    const {
      containerId = 'review-player-bar',
      idPrefix = 'player', // 'player' or 'saved'
      badgeText = '01/01',
      titleText = '',
      variant = 'standard', // 'standard' (responsive) or 'mobile' (compact single row)
      extraClasses = '',
      isPlayAll = true,
      speed = '1.0x',
      style = ''
    } = options;

    const isSaved = idPrefix === 'saved';
    const badgeId = isSaved ? 'saved-player-badge' : 'player-track-badge';
    const titleId = isSaved ? 'saved-player-title' : 'player-track-title';
    const waveBoxId = isSaved ? 'saved-wave-box' : '';
    const prevBtnId = `btn-${idPrefix}-prev`;
    const toggleBtnId = `btn-${idPrefix}-toggle`;
    const nextBtnId = `btn-${idPrefix}-next`;
    const playallBtnId = `btn-${idPrefix}-playall`;
    const speedBtnId = `btn-${idPrefix}-speed`;
    const curTimeId = isSaved ? 'saved-player-current-time' : 'player-current-time';
    const progressTrackId = isSaved ? 'saved-player-progress-track' : 'player-progress-track';
    const progressFillId = isSaved ? 'saved-player-progress-bar' : 'player-progress-fill';
    const totalTimeId = isSaved ? 'saved-player-total-time' : 'player-total-time';

    const variantClass = variant === 'mobile' ? 'player-variant-mobile' : '';
    const classes = ['review-player-bar', variantClass, extraClasses].filter(Boolean).join(' ');
    const safeTitle = (titleText || '').replace(/"/g, '&quot;');

    return `
      <div class="${classes}" id="${containerId}" ${style ? `style="${style}"` : ''}>
        <div class="player-bar-top">
          <!-- Left: Current Track Details -->
          <div class="player-track-info">
            <div class="sound-wave-box" ${waveBoxId ? `id="${waveBoxId}"` : ''} aria-hidden="true">
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
              <span class="wave-bar"></span>
            </div>
            <div class="player-text-details">
              ${isSaved ? `<div class="player-track-header-row"><span class="player-track-badge" id="${badgeId}">${badgeText}</span><span class="saved-player-status" id="saved-player-status" style="display:none;">READY</span></div>` : `<span class="player-track-badge" id="${badgeId}">${badgeText}</span>`}
              <div class="player-track-title" id="${titleId}" title="${safeTitle}">
                ${titleText || ''}
              </div>
            </div>
          </div>

          <!-- Center: Audio Playback Controls -->
          <div class="player-controls-main">
            <button type="button" class="btn-player-step" id="${prevBtnId}" title="이전 문장 (|◀)" aria-label="이전 문장">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
              </svg>
            </button>

            <button type="button" class="btn-player-toggle" id="${toggleBtnId}" title="재생 / 일시정지" aria-label="재생 / 일시정지">
              <svg class="icon-play" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg class="icon-pause" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style="display: none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>

            <button type="button" class="btn-player-step" id="${nextBtnId}" title="다음 문장 (▶|)" aria-label="다음 문장">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
              </svg>
            </button>
          </div>

          <!-- Right: Play All, Loop & Speed Modes -->
          <div class="player-controls-side">
            <button type="button" class="btn-play-all-toggle ${isPlayAll ? 'active' : ''}" id="${playallBtnId}" title="전체 연속 재생 켜짐 (클릭 시 끄기)" aria-label="전체 재생">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span class="playall-text">전체</span>
            </button>

            <button type="button" class="btn-speed-toggle" id="${speedBtnId}" title="재생 속도 조절" aria-label="재생 속도">
              ${speed}
            </button>
          </div>
        </div>

        <!-- Scrubber & Time Display -->
        <div class="player-progress-row">
          <span class="player-time-label" id="${curTimeId}">0:00</span>
          <div class="player-progress-track" id="${progressTrackId}">
            <div class="player-progress-fill" id="${progressFillId}"></div>
          </div>
          <span class="player-time-label" id="${totalTimeId}">0:00</span>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.AudioPlayerComponent = AudioPlayerComponent;
}

const App = {
  lessons: [
    {
      id: 'lesson-01',
      shortTitle: 'Lesson 1',
      topic: 'Big Bang Concert',
      icon: '🎤',
      title: '미국에서 빅뱅 콘서트를 간다고?',
      subtitle: '아침 일과부터 콘서트 티켓팅, 실생활 표현까지 원어민 대화로 마스터하기',
      duration: '6:38',
      vocabCount: 21,
      path: 'lessons/lesson-01/'
    }
  ],

  init(currentLessonId = null) {
    this.currentLessonId = currentLessonId;

    if (typeof Analytics !== 'undefined') {
      Analytics.init();
    }

    this._renderNavigationBar();
    this.initTheme();
    this._renderSavedSentencesDrawer();
    this._initOfflineDetection();
    this._registerServiceWorker();
    this.updateSentenceBadge();
    if (this.savedPlayer) {
      this.savedPlayer.init(this);
      this.savedPlayer.updatePlaylist();
    }
    this._renderFooter();

    // Render lessons cards catalog if container exists on page
    if (this.currentLessonId === 'lessons-list') {
      this.initLessonsListPage();
    } else {
      // Landing page: show 5 latest lessons from latest on top
      this.renderLessonsCatalog('#lessons-cards-container', { sort: 'desc', limit: 5 });
    }

    // Global delegation for lesson card clicks in catalog
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.lesson-catalog-card');
      if (card && e.target.closest('a')) {
        const id = card.id ? card.id.replace('card-', '') : '';
        const lessonObj = this.lessons.find(l => l.id === id);
        if (typeof Analytics !== 'undefined' && id) {
          Analytics.trackLessonCardClick(id, lessonObj ? lessonObj.title : '');
        }
      }
    });

    // Clean up any stale leftover modal overlays from previous sessions
    const staleModal = document.getElementById('first-visit-storage-modal');
    if (staleModal) staleModal.remove();
  },

  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  formatHighlightedSentence(english, expression) {
    if (!english) return '';
    let expr = (expression || '').trim();

    // If expression not explicitly stored, detect known lesson expressions
    if (!expr) {
      const known = [
        'what year that came out', 'new song came out', 'spend the night',
        'went on sale', 'grow on me', 'turned out', 'happened to',
        'in a cast', 'started to', 'ended up', 'obstructed',
        'Obviously', 'nosebleed', 'At least', 'unlikely',
        'no way', 'decent', 'around', 'mind', 'due'
      ];
      // Sort by length descending so longer phrases match first
      known.sort((a, b) => b.length - a.length);
      const found = known.find(k => english.toLowerCase().includes(k.toLowerCase()));
      if (found) {
        const match = english.match(new RegExp(found.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
        expr = match ? match[0] : found;
      }
    }

    if (/\[[^\]]+\]/.test(english)) {
      return this._escapeHtml(english).replace(
        /\[[^\]]+\]/,
        `<mark class="quiz-vocab-highlight">${this._escapeHtml(expr)}</mark>`
      );
    }

    if (expr) {
      const escaped = expr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return this._escapeHtml(english).replace(regex, `<mark class="quiz-vocab-highlight">$1</mark>`);
    }

    return this._escapeHtml(english);
  },

  _getBasePath() {
    if (typeof window !== 'undefined' && window.location) {
      const pathname = window.location.pathname || '';
      // If in /quiz/lesson-XX/qYY/ (depth 3)
      if (pathname.includes('/quiz/') && /\/quiz\/[^/]+\/[^/]+\//.test(pathname)) {
        return '../../../';
      }
      // If in /quiz/lesson-XX/qYY.html or /lessons/lesson-XX/ (depth 2)
      if (pathname.includes('/quiz/') || pathname.includes('/lessons/')) {
        return '../../';
      }
    }
    return (this.currentLessonId && (this.currentLessonId.startsWith('lesson-') || this.currentLessonId.startsWith('quiz-'))) ? '../../' : './';
  },

  _renderNavigationBar() {
    const navContainer = document.getElementById('main-nav');
    if (!navContainer) return;

    const base = this._getBasePath();
    const historyUnlocked = Storage.isHistoryUnlocked();

    const currentLesson = this.lessons.find(l => l.id === this.currentLessonId);

    navContainer.innerHTML = `
      <div class="nav-inner">
        <a href="${base}index.html" class="nav-brand" title="RhyRhy English - Home">
          <div class="brand-logo" aria-label="RhyRhy English">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="42" height="42">
              <defs>
                <linearGradient id="navFamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#4F46E5"/>
                  <stop offset="100%" stop-color="#7C3AED"/>
                </linearGradient>
                <filter id="navFamShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.3"/>
                </filter>
              </defs>
              <rect width="100" height="100" rx="22" fill="url(#navFamGrad)"/>

              <!-- ================= DAD (Black Hair, Back Left) ================= -->
              <g id="nav-dad">
                <path d="M12 58 C12 50 20 46 29 46 C38 46 46 50 46 58 L46 66 L12 66 Z" fill="#2563EB"/>
                <path d="M25 46 L29 52 L33 46 Z" fill="#FFFFFF"/>
                <rect x="25" y="40" width="8" height="8" rx="2" fill="#FBD4B4"/>
                <ellipse cx="29" cy="30" rx="11" ry="12" fill="#FBD4B4"/>
                <path d="M17 30 C16 19 21 14 30 14 C39 14 42 17 42 24 C40 23 37 22 31 23 C25 24 20 27 19 32 Z" fill="#111827"/>
                <path d="M17 28 Q17 22 23 18 Q31 15 41 22 Q40 26 39 29 Q37 24 30 22 Q22 21 17 28 Z" fill="#1F2937"/>
                <ellipse cx="24.5" cy="29.5" rx="1.2" ry="1.5" fill="#111827"/>
                <ellipse cx="33.5" cy="29.5" rx="1.2" ry="1.5" fill="#111827"/>
                <path d="M26 34.5 Q29 38 32 34.5" fill="none" stroke="#9A3412" stroke-width="1.2" stroke-linecap="round"/>
              </g>

              <!-- ================= MOM (Blonde Hair, Back Right) ================= -->
              <g id="nav-mom">
                <path d="M55 33 C53 18 60 12 70 12 C82 12 87 19 86 34 C86 44 82 52 79 54 L61 54 C57 50 55 43 55 33 Z" fill="#F59E0B"/>
                <path d="M52 58 C52 50 61 46 70 46 C79 46 88 50 88 58 L88 66 L52 66 Z" fill="#EC4899"/>
                <rect x="66" y="40" width="8" height="8" rx="2" fill="#FDE2D1"/>
                <ellipse cx="70" cy="30" rx="10.5" ry="11.5" fill="#FDE2D1"/>
                <path d="M56 28 C57 17 65 13 72 13 C80 13 84 17 84 25 C79 19 72 18 64 21 C60 23 58 26 56 28 Z" fill="#FBBF24"/>
                <path d="M80 23 C83 30 83 38 81 44 C79 42 79 35 77 29 Z" fill="#FDE68A"/>
                <path d="M56 25 C54 31 55 39 58 43 C59 39 59 32 58 27 Z" fill="#FDE68A"/>
                <ellipse cx="66" cy="29.5" rx="1.2" ry="1.4" fill="#1E293B"/>
                <ellipse cx="74" cy="29.5" rx="1.2" ry="1.4" fill="#1E293B"/>
                <path d="M64 27.5 L66.5 28.5" stroke="#1E293B" stroke-width="0.7" stroke-linecap="round"/>
                <path d="M76 27.5 L73.5 28.5" stroke="#1E293B" stroke-width="0.7" stroke-linecap="round"/>
                <circle cx="63" cy="32.5" r="1.8" fill="#F43F5E" opacity="0.35"/>
                <circle cx="77" cy="32.5" r="1.8" fill="#F43F5E" opacity="0.35"/>
                <path d="M67.5 34.5 Q70 38 72.5 34.5" fill="none" stroke="#BE123C" stroke-width="1.2" stroke-linecap="round"/>
              </g>

              <!-- ================= 5-YEAR-OLD BOY (Brown Hair, Front Left) ================= -->
              <g id="nav-boy-5yo" filter="url(#navFamShadow)">
                <path d="M10 98 C10 82 20 75 31 75 C42 75 52 82 52 98 Z" fill="#10B981"/>
                <path d="M27 75 L31 81 L35 75 Z" fill="#D1FAE5"/>
                <rect x="27" y="69" width="8" height="8" rx="2" fill="#FBD4B4"/>
                <ellipse cx="31" cy="59" rx="10.5" ry="11" fill="#FBD4B4"/>
                <path d="M19 59 C18 47 23 41 32 41 C41 41 45 47 44 55 C41 49 36 48 30 49 C24 50 20 53 19 59 Z" fill="#78350F"/>
                <path d="M22 50 Q26 44 34 44 Q41 44 42 50 Q36 46 30 46 Q25 46 22 50 Z" fill="#92400E"/>
                <ellipse cx="26.5" cy="58" rx="1.3" ry="1.5" fill="#111827"/>
                <ellipse cx="35.5" cy="58" rx="1.3" ry="1.5" fill="#111827"/>
                <circle cx="26.9" cy="57.6" r="0.4" fill="#FFFFFF"/>
                <circle cx="35.9" cy="57.6" r="0.4" fill="#FFFFFF"/>
                <circle cx="23.5" cy="61" r="1.6" fill="#F43F5E" opacity="0.3"/>
                <circle cx="38.5" cy="61" r="1.6" fill="#F43F5E" opacity="0.3"/>
                <path d="M27.5 63.5 Q31 68 34.5 63.5" fill="none" stroke="#9A3412" stroke-width="1.4" stroke-linecap="round"/>
              </g>

              <!-- ================= 1-YEAR-OLD BABY BOY (Brown Hair Tuft, Front Right) ================= -->
              <g id="nav-baby-1yo" filter="url(#navFamShadow)">
                <path d="M50 98 C50 85 58 79 68 79 C78 79 86 85 86 98 Z" fill="#38BDF8"/>
                <path d="M60 80 Q68 88 76 80 Q74 91 68 91 Q62 91 60 80 Z" fill="#FEF08A"/>
                <polygon points="68,83 69,85.5 71.5,85.5 69.5,87 70.5,89.5 68,88 65.5,89.5 66.5,87 64.5,85.5 67,85.5" fill="#F59E0B"/>
                <rect x="65" y="74" width="6" height="6" rx="2" fill="#FDE2D1"/>
                <ellipse cx="68" cy="67" rx="8.5" ry="8.5" fill="#FDE2D1"/>
                <circle cx="61.5" cy="68.5" r="3.2" fill="#FDE2D1"/>
                <circle cx="74.5" cy="68.5" r="3.2" fill="#FDE2D1"/>
                <path d="M62 61 C61 55 64 53 68 53 C72 53 75 55 74 61 C72 57 69 56 66 57 Z" fill="#78350F"/>
                <path d="M67 53 Q69 48 72 50 Q73 53 69 52 Z" fill="#92400E"/>
                <circle cx="64.5" cy="66" r="1.6" fill="#0F172A"/>
                <circle cx="71.5" cy="66" r="1.6" fill="#0F172A"/>
                <circle cx="65" cy="65.3" r="0.6" fill="#FFFFFF"/>
                <circle cx="72" cy="65.3" r="0.6" fill="#FFFFFF"/>
                <circle cx="60.5" cy="69" r="2.2" fill="#FB7185" opacity="0.45"/>
                <circle cx="75.5" cy="69" r="2.2" fill="#FB7185" opacity="0.45"/>
                <path d="M65.5 70.5 Q68 74.5 70.5 70.5 Z" fill="#BE123C"/>
              </g>
            </svg>
          </div>
          <div class="brand-text-wrap">
            <span class="brand-name">RhyRhy <strong>English</strong></span>
            <span class="nav-beta-tag">BETA</span>
          </div>
        </a>

        <div class="nav-right-actions">
          <!-- Lessons on Nav Bar (moves to exclusive page showing all lessons with cards view) -->
          <a href="${base}lessons.html" class="btn-nav-action ${this.currentLessonId === 'lessons-list' ? 'active' : ''}" id="btn-nav-lessons" title="전체 레슨 목록 (Lessons)" aria-label="Lessons">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span class="nav-btn-label">Lessons</span>
          </a>

          <!-- Saved Sentences Bank Button -->
          <button type="button" class="btn-nav-action" id="btn-open-sentences" title="Open Saved Sentence Bank" aria-label="Open Saved Sentence Bank">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="nav-btn-label">Saved</span>
            <span class="nav-badge" id="nav-saved-badge">0</span>
          </button>

          <!-- Dark / Light Theme Toggle Button -->
          <button type="button" class="btn-theme-toggle" id="btn-toggle-theme" title="다크 모드 / 라이트 모드 전환" aria-label="Toggle theme">
            <span class="theme-icon-sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            </span>
            <span class="theme-icon-moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      <!-- Offline Notice Banner -->
      <div class="offline-banner" id="offline-banner" style="display: none;" role="status">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
        </svg>
        <span>You are currently offline. Quizzes & Interactive Scripts work offline! (YouTube requires an internet connection).</span>
      </div>
    `;

    this._bindNavEvents();
  },

  _getLessonTitle(lessonId) {
    const l = this.lessons.find(item => item.id === lessonId);
    return l ? l.title : lessonId;
  },

  _bindNavEvents() {
    const lessonsBtn = document.getElementById('btn-nav-lessons');
    if (lessonsBtn) {
      lessonsBtn.addEventListener('click', (e) => {
        // Close saved page drawer immediately if open on top of the page
        this.closeSavedSentencesDrawer();

        if (this.currentLessonId === 'lessons-list') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    // Also close saved drawer if brand logo is clicked
    const brandLink = document.querySelector('.nav-brand');
    if (brandLink) {
      brandLink.addEventListener('click', () => {
        this.closeSavedSentencesDrawer();
      });
    }

    // Global listener: whenever a lesson icon or link is selected while saved drawer is open, close drawer
    document.addEventListener('click', (e) => {
      const lessonTarget = e.target.closest('#btn-nav-lessons, a[href*="lesson"], .step-tab-btn');
      if (lessonTarget) {
        const drawer = document.getElementById('saved-sentences-drawer');
        if (drawer && drawer.classList.contains('open')) {
          this.closeSavedSentencesDrawer();
        }
      }
    });
  },

  /**
   * Initialize theme (light/dark) from Storage or system preference, and bind toggle
   */
  initTheme() {
    const currentTheme = Storage.getTheme();
    this._applyTheme(currentTheme, false);

    // Listen for system theme changes if user hasn't explicitly chosen one in localStorage
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const userChosen = localStorage.getItem(Storage.KEYS.THEME);
        if (!userChosen) {
          this._applyTheme(e.matches ? 'dark' : 'light', true);
        }
      });
    }

    // Bind toggle button click
    const btn = document.getElementById('btn-toggle-theme');
    if (btn) {
      btn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  },

  /**
   * Toggle between dark and light themes
   */
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || Storage.getTheme();
    const nextTheme = (current === 'light') ? 'dark' : 'light';
    Storage.setTheme(nextTheme);
    this._applyTheme(nextTheme, true);

    // Log theme change to Analytics
    if (typeof Analytics !== 'undefined') {
      Analytics.trackEvent('theme_change', { theme: nextTheme });
    }
  },

  /**
   * Apply theme attribute to document and update button state
   * @private
   */
  _applyTheme(theme, animate = true) {
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, 350);
    }

    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('btn-toggle-theme');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? '다크 모드로 전환 (Switch to dark mode)' : '라이트 모드로 전환 (Switch to light mode)');
      btn.title = theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환';
    }

    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  },

  _renderFooter() {
    let footer = document.getElementById('main-footer');
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'main-footer';
      footer.className = 'app-footer';
      document.body.appendChild(footer);
    }

    const currentYear = new Date().getFullYear();

    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo-row">
              <span class="footer-logo-icon">✨</span>
              <span class="footer-title">RhyRhy English</span>
              <span class="footer-badge">Beta</span>
            </div>
            <p class="footer-tagline">현서네 리얼 영어 • 원어민 실전 대화로 배우는 3분 영어 챌린지</p>
          </div>
          <div class="footer-license-box">
            <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="license noopener noreferrer" class="cc-license-badge" title="Creative Commons Attribution-NonCommercial 4.0 International License">
              <svg class="cc-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5h1.5c0 1.66-1.34 3-3 3s-3-1.34-3-3v-3c0-1.66 1.34-3 3-3s3 1.34 3 3h-1.5zm7 0c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v3c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5h1.5c0 1.66-1.34 3-3 3s-3-1.34-3-3v-3c0-1.66 1.34-3 3-3s3 1.34 3 3h-1.5z"/>
              </svg>
              <span>CC BY-NC 4.0</span>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="footer-license-text">
            본 사이트의 교육 콘텐츠, 퀴즈 및 오디오 자료는 별도 명시가 없는 한 <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="license noopener noreferrer">Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)</a> 라이선스에 따라 비영리 목적으로 자유롭게 공유 및 활용할 수 있습니다 (출처 표기 필수: <strong>현서네 리얼 영어 - RhyRhy English</strong>, 상업적 이용 금지).
          </p>
          <p class="footer-copyright">
            © ${currentYear} RhyRhy English (현서네 리얼 영어). All rights reserved.
          </p>
        </div>
      </div>
    `;
  },

  renderLessonsCatalog(containerSelector = '#lessons-cards-container', options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const base = this._getBasePath();
    const sort = options.sort || 'desc'; // 'desc' (latest on top) | 'asc'
    const limit = options.limit || null;

    // Helper to get numeric lesson number for accurate sorting
    const getLessonNum = (id) => {
      const match = (id || '').match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    let list = [...this.lessons];
    if (sort === 'asc') {
      list.sort((a, b) => getLessonNum(a.id) - getLessonNum(b.id));
    } else {
      list.sort((a, b) => getLessonNum(b.id) - getLessonNum(a.id));
    }

    if (limit && typeof limit === 'number' && limit > 0) {
      list = list.slice(0, limit);
    }

    container.innerHTML = list.map(les => {
      const isCompleted = Storage.isLessonCompleted(les.id);
      const prog = Storage.getProgress(les.id);
      const inProgress = !isCompleted && (prog.currentQuestionIndex > 0 || (prog.currentStep && prog.currentStep > 1));

      let statusBadgeHtml = `<span class="badge badge-emerald">100% 무료</span>`;
      let actionBtnText = `<span>학습 시작하기</span>`;
      let actionBtnClass = `btn-primary`;

      if (isCompleted) {
        statusBadgeHtml = `<span class="badge badge-completed"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> 학습 완료</span>`;
        actionBtnText = `<span>다시 복습하기 ✓</span>`;
        actionBtnClass = `btn-outline`;
      } else if (inProgress) {
        statusBadgeHtml = `<span class="badge badge-primary">학습 진행 중</span>`;
        actionBtnText = `<span>이어서 학습하기 ▶</span>`;
        actionBtnClass = `btn-primary`;
      }

      return `
        <article class="lesson-catalog-card ${isCompleted ? 'completed' : ''}" id="card-${les.id}">
          <div class="lesson-card-top">
            <div class="lesson-card-badges">
              <span class="badge badge-primary">${les.shortTitle}</span>
              ${statusBadgeHtml}
            </div>
            <div class="lesson-card-icon" aria-hidden="true">${les.icon}</div>
          </div>

          <div class="lesson-card-content">
            <h3 class="lesson-card-title">${les.title}</h3>
            <p class="lesson-card-desc">${les.subtitle}</p>
          </div>

          <div class="lesson-card-meta">
            <span class="meta-pill" title="영상 길이">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              ${les.duration}
            </span>
            <span class="meta-pill" title="퀴즈 수">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              ${les.vocabCount} 퀴즈
            </span>
            <span class="meta-pill" title="실제 대화 스크립트">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              영상 & 스크립트
            </span>
          </div>

          <a href="${base}${les.path}index.html" class="btn ${actionBtnClass} lesson-card-btn">
            ${actionBtnText}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </article>
      `;
    }).join('');
  },

  /**
   * Initializes sorting controls and card list on lessons.html
   */
  initLessonsListPage() {
    const sortKey = 'rhyrhy_lesson_sort';
    let currentSort = 'desc';
    try {
      currentSort = localStorage.getItem(sortKey) || 'desc';
    } catch (_) { }

    const countEl = document.getElementById('total-lessons-count');
    if (countEl) {
      countEl.textContent = this.lessons.length;
    }

    const sortButtons = document.querySelectorAll('.btn-sort-pill');
    const updateSort = (sortOrder) => {
      currentSort = sortOrder;
      try {
        localStorage.setItem(sortKey, sortOrder);
      } catch (_) { }

      sortButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortOrder);
      });

      this.renderLessonsCatalog('#lessons-cards-container', { sort: sortOrder });
    };

    sortButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const order = btn.dataset.sort;
        if (order) updateSort(order);
      });
    });

    // Initial render with saved preference or default (desc: latest first)
    updateSort(currentSort);
  },

  _renderSavedSentencesDrawer() {
    let drawer = document.getElementById('saved-sentences-drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'saved-sentences-drawer';
      drawer.className = 'app-drawer';
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="drawer-backdrop" id="sentences-drawer-backdrop"></div>
        <div class="drawer-panel">
          <div class="drawer-header">
            <div class="drawer-title-group">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <h3>My Sentence Bank</h3>
            </div>
            <button type="button" class="btn-drawer-close" id="btn-close-sentences" aria-label="Close drawer">✕</button>
          </div>

          <!-- Sticky Audio Player Bar for Saved Sentences (Issue #13 & #17: Step 4 Review Style) -->
          ${AudioPlayerComponent.render({
            containerId: 'saved-player-bar',
            idPrefix: 'saved',
            badgeText: '01/01',
            titleText: '저장된 문장 연속 재생',
            variant: 'mobile',
            extraClasses: 'saved-player-bar',
            style: 'display: none;',
            isPlayAll: true,
            speed: '1.0x'
          })}

          <div class="drawer-body" id="saved-sentences-list">
            <!-- Rendered dynamically -->
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    if (this.savedPlayer) {
      this.savedPlayer.init(this);
    }

    const openBtn = document.getElementById('btn-open-sentences');
    const closeBtn = drawer.querySelector('#btn-close-sentences');
    const backdrop = drawer.querySelector('#sentences-drawer-backdrop');
    const panel = drawer.querySelector('.drawer-panel');

    // Toggle on Bookmark icon click: collapses if already open!
    if (openBtn && !openBtn._boundClick) {
      openBtn._boundClick = true;
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (drawer.classList.contains('open')) {
          this.closeSavedSentencesDrawer();
        } else {
          this.openSavedSentencesDrawer();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeSavedSentencesDrawer());
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeSavedSentencesDrawer());
    }

    // Swipe to Right to Collapse / Close Drawer
    if (panel) {
      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let isSwiping = false;

      panel.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        isSwiping = false;
      }, { passive: true });

      panel.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const diffY = Math.abs(e.touches[0].clientY - startY);

        // Only track rightward swipe if horizontal motion exceeds vertical
        if (diffX > 8 && diffX > diffY) {
          isSwiping = true;
          panel.style.transform = `translateX(${Math.max(0, diffX)}px)`;
          panel.style.transition = 'none';
        }
      }, { passive: true });

      panel.addEventListener('touchend', () => {
        if (isSwiping) {
          panel.style.transition = '';
          const diffX = currentX - startX;
          // If swiped right by more than 45px, collapse!
          if (diffX > 45) {
            panel.style.transform = '';
            this.closeSavedSentencesDrawer();
          } else {
            // Snap back open
            panel.style.transform = '';
          }
          isSwiping = false;
        }
      }, { passive: true });
    }
  },

  openSavedSentencesDrawer() {
    const drawer = document.getElementById('saved-sentences-drawer');
    const list = document.getElementById('saved-sentences-list');
    const openBtn = document.getElementById('btn-open-sentences');
    if (!drawer || !list) return;

    const base = this._getBasePath();
    const allSentences = Storage.getAllSavedSentences();
    const lessonKeys = Object.keys(allSentences);
    const totalCount = Storage.getTotalSavedSentenceCount();

    try {
      if (totalCount === 0) {
        list.innerHTML = `
          <div class="drawer-empty-state">
            <div class="empty-icon">🔖</div>
            <h4>아직 저장된 문장이 없습니다</h4>
            <p>Step 4 문장 총복습 화면에서 책갈피(북마크) 아이콘을 눌러 중요한 문장을 나만의 단어장에 저장해보세요!</p>
          </div>
        `;
      } else {
        let globalIndex = 0;
        list.innerHTML = lessonKeys.map(lesId => {
          const items = allSentences[lesId] || [];
          if (items.length === 0) return '';
          const title = this._getLessonTitle(lesId);
          const lesObj = this.lessons.find(l => l.id === lesId);
          const lesPath = lesObj ? `${base}${lesObj.path}index.html` : `${base}lessons.html`;

          return `
            <div class="saved-lesson-group">
              <h4 class="group-lesson-title">
                <a href="${lesPath}" class="group-lesson-link" title="${title} 레슨 바로가기">
                  <span>${title}</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </a>
              </h4>
              <div class="saved-sentences-sublist">
                ${items.map(item => {
                  const trackIdx = globalIndex++;
                  return `
                    <div class="saved-sentence-card" id="saved-card-${item.id}" data-id="${item.id}" data-index="${trackIdx}">
                      <button 
                        type="button" 
                        class="btn-card-play btn-saved-card-play" 
                        data-index="${trackIdx}" 
                        data-id="${item.id}" 
                        title="이 문장 듣기"
                        aria-label="이 문장 듣기"
                      >
                        <svg class="icon-card-play" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="icon-card-pause" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="display: none;">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      </button>
                      <div class="saved-card-text">
                        <p class="saved-en">${this.formatHighlightedSentence(item.en, item.expression)}</p>
                        <p class="saved-kr">${this._escapeHtml(item.kr)}</p>
                      </div>
                      <button 
                        type="button" 
                        class="btn-delete-sentence" 
                        data-lesson="${lesId}" 
                        data-id="${item.id}" 
                        data-index="${trackIdx}"
                        title="Remove sentence"
                        aria-label="Remove sentence"
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('');

        // Bind card play buttons
        list.querySelectorAll('.btn-card-play').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index, 10);
            if (this.savedPlayer && this.savedPlayer.isPlaying && this.savedPlayer.currentIndex === idx) {
              this.savedPlayer.pause();
            } else if (this.savedPlayer) {
              this.savedPlayer.play(idx);
            }
          });
        });

        // Clicking on card text also triggers playback
        list.querySelectorAll('.saved-card-text').forEach(textEl => {
          textEl.addEventListener('click', () => {
            const card = textEl.closest('.saved-sentence-card');
            if (!card || !this.savedPlayer) return;
            const idx = parseInt(card.dataset.index, 10);
            if (!isNaN(idx)) {
              if (this.savedPlayer.isPlaying && this.savedPlayer.currentIndex === idx) {
                this.savedPlayer.pause();
              } else {
                this.savedPlayer.play(idx);
              }
            }
          });
        });

        // Bind delete events
        list.querySelectorAll('.btn-delete-sentence').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const lId = btn.dataset.lesson;
            const sId = btn.dataset.id;
            const idx = parseInt(btn.dataset.index, 10);
            if (this.savedPlayer && this.savedPlayer.currentIndex === idx) {
              this.savedPlayer.pause();
            }
            Storage.removeSavedSentence(lId, sId);
            this.updateSentenceBadge();
            window.dispatchEvent(new CustomEvent('saved-sentences-updated'));
            this.openSavedSentencesDrawer(); // re-render
          });
        });
      }
    } catch (renderErr) {
      console.error('Error rendering saved sentences drawer:', renderErr);
    }

    if (this.savedPlayer) {
      this.savedPlayer.updatePlaylist();
    }

    const panel = drawer.querySelector('.drawer-panel');
    if (panel) panel.style.transform = '';

    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.classList.add('active');
  },

  closeSavedSentencesDrawer() {
    const drawer = document.getElementById('saved-sentences-drawer');
    const openBtn = document.getElementById('btn-open-sentences');
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      const panel = drawer.querySelector('.drawer-panel');
      if (panel) panel.style.transform = '';
    }
    if (openBtn) openBtn.classList.remove('active');
  },

  updateSentenceBadge() {
    const badge = document.getElementById('nav-saved-badge');
    if (badge) {
      const count = Storage.getTotalSavedSentenceCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
  },

  /**
   * Show global notification toast message
   * @param {string} message
   * @param {string} type 'info' | 'success'
   * @param {number} duration
   */
  showToast(message, type = 'info', duration = 2400) {
    const existing = document.querySelector('.save-toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'save-toast-notification animate-slide-up';
    toast.innerHTML = `
      <div class="toast-icon ${type === 'success' ? 'success' : 'info'}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="toast-content">
        <div class="toast-title" style="font-weight: 600; font-size: 0.95rem; color: var(--text-main);">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 350);
    }, duration);
  },

  /**
   * Check if user is saving a sentence for the very first time.
   * If so, display a notification modal informing that all data is persisted
   * in the local browser cache, and link to the YouTube community posts for cloud storage requests.
   */
  checkFirstSentenceSaveNotice() {
    if (typeof Storage === 'undefined') return;
    if (Storage.isFirstSaveNoticeSeen()) return;
    Storage.setFirstSaveNoticeSeen();

    // Small delay so user sees initial saved toast smoothly
    setTimeout(() => {
      this._renderFirstSaveNoticeModal();
    }, 300);
  },

  _renderFirstSaveNoticeModal() {
    if (document.getElementById('first-save-storage-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'first-save-storage-modal';
    overlay.className = 'first-visit-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'first-save-title');

    overlay.innerHTML = `
      <div class="first-visit-modal-card">
        <div class="first-visit-header">
          <div class="first-visit-icon-wrap" aria-hidden="true">
            ⭐
          </div>
          <div>
            <span class="first-visit-badge">단어장 저장 안내 • Local Storage</span>
          </div>
          <h3 class="first-visit-title" id="first-save-title">
            첫 번째 문장이 단어장에 저장되었습니다!
          </h3>
        </div>

        <div class="first-visit-points">
          <div class="first-visit-point-card">
            <span class="point-icon" aria-hidden="true">💾</span>
            <div class="point-content">
              <h4 class="point-title">현재 기기 브라우저 캐시에 안전하게 보관됩니다</h4>
              <p class="point-desc">
                저장하신 문장들은 현재 사용 중인 기기의 <strong>브라우저 캐시(로컬 저장소)</strong>에 안전하게 보관됩니다. 브라우저 캐시를 완전히 삭제하지 않는 한 언제든 복습하실 수 있습니다.
              </p>
            </div>
          </div>

          <div class="first-visit-point-card request">
            <span class="point-icon" aria-hidden="true">☁️</span>
            <div class="point-content">
              <h4 class="point-title">모든 기기 클라우드 동기화가 필요하신가요?</h4>
              <p class="point-desc">
                스마트폰, 태블릿, PC 등 여러 기기에서 실시간으로 단어장을 연동하고 영구 보관할 수 있는 <strong>클라우드 서버 기능</strong>이 필요하시다면, 유튜브 채널 커뮤니티에 의견을 남겨주세요!
              </p>
            </div>
          </div>
        </div>

        <div class="first-visit-actions">
          <a href="https://www.youtube.com/@happyfamily8/posts" target="_blank" rel="noopener noreferrer" class="btn-request-sync-button" id="btn-request-cloud-sync" title="현서네 유튜브 커뮤니티 새 창으로 열기">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color: #EF4444; flex-shrink: 0;">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>유튜브 커뮤니티에 클라우드 기능 요청하기 ↗</span>
          </a>

          <button type="button" class="btn btn-primary btn-dismiss-storage-notice" id="btn-dismiss-first-save">
            확인 (계속 학습하기)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => {
      overlay.classList.add('closing');
      setTimeout(() => overlay.remove(), 250);
      document.removeEventListener('keydown', onKeyDown);
    };

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    const dismissBtn = overlay.querySelector('#btn-dismiss-first-save');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', closeModal);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', onKeyDown);
  },

  _initOfflineDetection() {
    const banner = document.getElementById('offline-banner');
    const updateStatus = () => {
      if (!navigator.onLine) {
        if (banner) banner.style.display = 'flex';
      } else {
        if (banner) banner.style.display = 'none';
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // In local development (localhost / 127.0.0.1), unregister service workers
      // so live-reload and source updates work cleanly without caching conflicts
      const isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '[::1]'
      );

      if (isLocalhost && !window.location.search.includes('pwa=true')) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const reg of registrations) {
            reg.unregister();
            console.log('[Dev] Unregistered ServiceWorker on localhost for live reload');
          }
        });
        return;
      }

      window.addEventListener('load', () => {
        // Calculate root sw.js path
        const swPath = this._getBasePath() + 'sw.js';
        navigator.serviceWorker.register(swPath)
          .then(reg => {
            console.log('RhyRhy PWA ServiceWorker registered with scope:', reg.scope);

            // Proactively check for newer service worker on every load
            if (typeof reg.update === 'function') {
              reg.update().catch(() => {});
            }

            // When an updated SW activates and claims clients, refresh to load fresh code
            const hadController = Boolean(navigator.serviceWorker.controller);
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (!refreshing && hadController) {
                refreshing = true;
                window.location.reload();
              }
            });
          })
          .catch(err => {
            console.log('RhyRhy ServiceWorker registration failed:', err);
          });
      });
    }
  }
};

// Known audio files for Lesson 01 (maps keyword to WAV audio filename in lessons/lesson-01/audio/)
const LESSON_01_AUDIO_MAP = [
  { key: 'just happened to look', file: 'I just happened to look.wav' },
  { key: 'watch the kids', file: 'obviously Jaemyun cant go with me because someone has to watch the kids..wav' },
  { key: 'nosebleed', file: 'We got tickets that are pretty much in the back the nosebleed section..wav' },
  { key: 'decent view', file: 'we have a decent view..wav' },
  { key: 'weird or obstructed angle', file: 'Its not like its on the side or like at a weird or obstructed angle or anything.wav' },
  { key: 'compared to what we paid', file: 'Compared to what we paid in Korea for tickets its decent.wav' },
  { key: 'at least thats what i understood', file: 'At least thats what I understood.wav' },
  { key: 'started to like it a lot', file: 'I started to like it a lot and listening to it..wav' },
  { key: 'cast up past your knee', file: 'you were in a cast up past your knee to your thigh like all the way down.wav' },
  { key: 'getting up to those seats', file: 'there was no way you were getting up to those seats.wav' },
  { key: 'only going to two cities', file: 'it turned out theyre only going to two citiesOakland and New Jersey.wav' },
  { key: 'concert and spend the night', file: 'And then go to the concert and spend the night.wav' },
  { key: 'amy doesnt mind', file: 'Hopefully Amy doesnt mind..wav' },
  { key: 'seemed like everything was sold', file: 'I dont know when they officially went on sale but it seemed like everything was sold..wav' },
  { key: 'what year that came out', file: 'I dont know what year that came out.wav' },
  { key: 'around there', file: 'i think it was around there.wav' },
  { key: 'grow on me', file: 'The first time I heard it I didnt love it but it did grow on me quite a lot..wav' },
  { key: 'assignments due sunday', file: 'because I have a lot of assignments due Sunday.wav' },
  { key: 'when the new song came out', file: 'it was when the new song came out.wav' },
  { key: 'unlikely that i would get to go', file: 'So I thought it was pretty unlikely that I would get to go and find someone..wav' },
  { key: 'handicap seats', file: 'but they finally just put us in to one of the handicap seats which ended up having an amazing view.wav' }
];

const SavedAudioPlayer = {
  app: null,
  audio: null,
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  isPlayAll: true,
  playbackRate: 1.0,

  init(app) {
    this.app = app;
    if (this._initialized) return;
    this._initialized = true;

    // Attach primary Audio element to DOM to preserve WebKit background audio session privilege
    if (!this.audio) {
      this.audio = document.createElement('audio');
      this.audio.id = 'saved-audio-element';
      this.audio.preload = 'auto';
      this.audio.style.display = 'none';
      if (document.body) {
        document.body.appendChild(this.audio);
      }
    }

    // Secondary preloader audio element to eliminate inter-track gap in background
    if (!this.preloaderAudio) {
      this.preloaderAudio = document.createElement('audio');
      this.preloaderAudio.id = 'saved-audio-preloader';
      this.preloaderAudio.preload = 'auto';
      this.preloaderAudio.style.display = 'none';
      if (document.body) {
        document.body.appendChild(this.preloaderAudio);
      }
    }

    this._bindAudioEvents();
    this._bindUiEvents();
    this._initMediaSession();

    window.addEventListener('saved-sentences-updated', () => {
      this.updatePlaylist();
    });

    // Global audio coordination: pause when any other player starts
    window.addEventListener('app-audio-started', (e) => {
      if (e.detail && e.detail.source !== 'saved-player' && this.isPlaying) {
        this.pause();
      }
    });

    window.addEventListener('review-player-started', () => {
      if (this.isPlaying) {
        this.pause();
      }
    });

    window.addEventListener('video-player-started', () => {
      if (this.isPlaying) {
        this.pause();
      }
    });
  },

  _formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  _bindAudioEvents() {
    this.audio.addEventListener('timeupdate', () => {
      const curLabel = document.getElementById('saved-player-current-time');
      const totalLabel = document.getElementById('saved-player-total-time');
      const bar = document.getElementById('saved-player-progress-bar');

      if (curLabel) curLabel.textContent = this._formatTime(this.audio.currentTime);

      if (this.audio.duration && !isNaN(this.audio.duration)) {
        if (totalLabel) totalLabel.textContent = this._formatTime(this.audio.duration);
        const pct = Math.min(100, Math.max(0, (this.audio.currentTime / this.audio.duration) * 100));
        if (bar) bar.style.width = `${pct}%`;
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      const totalLabel = document.getElementById('saved-player-total-time');
      if (totalLabel && this.audio.duration && !isNaN(this.audio.duration)) {
        totalLabel.textContent = this._formatTime(this.audio.duration);
      }
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this._updateVisualState(true);
      this._setMediaSessionPlaybackState('playing');
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this._updateVisualState(false);
      this._setMediaSessionPlaybackState('paused');
    });

    this.audio.addEventListener('ended', () => {
      const bar = document.getElementById('saved-player-progress-bar');
      if (bar) bar.style.width = '100%';
      this._onTrackEnded();
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio error on saved sentence, falling back to TTS:', e);
      this._fallbackTts();
    });
  },

  _bindUiEvents() {
    const prevBtn = document.getElementById('btn-saved-prev');
    const toggleBtn = document.getElementById('btn-saved-toggle');
    const nextBtn = document.getElementById('btn-saved-next');
    const playAllBtn = document.getElementById('btn-saved-playall');
    const speedBtn = document.getElementById('btn-saved-speed');
    const progressTrack = document.getElementById('saved-player-progress-track');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (toggleBtn) toggleBtn.addEventListener('click', () => this.togglePlayPause());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (playAllBtn) playAllBtn.addEventListener('click', () => this.togglePlayAll());
    if (speedBtn) speedBtn.addEventListener('click', () => this.cycleSpeed());

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        if (!this.audio || !this.audio.duration || isNaN(this.audio.duration)) return;
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        this.audio.currentTime = ratio * this.audio.duration;
      });
    }
  },

  _initMediaSession() {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.setActionHandler('play', () => this.resume());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details && details.seekTime !== undefined && this.audio && this.audio.duration) {
            this.audio.currentTime = details.seekTime;
          }
        });
      } catch (err) {
        console.warn('MediaSession handler error:', err);
      }
    }
  },

  _setMediaSessionPlaybackState(state) {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = state;
      } catch (_) {}
    }
  },

  updatePlaylist() {
    if (typeof Storage === 'undefined') return;
    const all = Storage.getAllSavedSentences();
    const list = [];

    Object.entries(all).forEach(([lesId, items]) => {
      if (Array.isArray(items)) {
        items.forEach(item => {
          list.push({
            ...item,
            lessonId: lesId
          });
        });
      }
    });

    this.playlist = list;

    const bar = document.getElementById('saved-player-bar');
    if (!bar) return;

    if (this.playlist.length === 0) {
      this.pause();
      bar.style.display = 'none';
      return;
    }

    bar.style.display = 'flex';

    if (this.currentIndex >= this.playlist.length) {
      this.currentIndex = Math.max(0, this.playlist.length - 1);
    }

    this._updateTrackInfo();
    this._highlightActiveCard(this.isPlaying);
  },

  _updateTrackInfo() {
    if (this.playlist.length === 0) return;
    const item = this.playlist[this.currentIndex];
    if (!item) return;

    const badge = document.getElementById('saved-player-badge');
    const title = document.getElementById('saved-player-title');
    const status = document.getElementById('saved-player-status');

    const curNum = (this.currentIndex + 1).toString().padStart(2, '0');
    const totalNum = this.playlist.length.toString().padStart(2, '0');

    if (badge) badge.textContent = `${curNum}/${totalNum}`;
    if (title) {
      title.textContent = item.en;
      title.title = `${item.en} (${item.kr})`;
    }
    if (status) {
      status.textContent = this.isPlaying ? 'PLAYING' : 'READY';
      status.className = `saved-player-status ${this.isPlaying ? 'playing' : ''}`;
    }
  },

  _updateVisualState(shouldScroll = false) {
    const bar = document.getElementById('saved-player-bar');
    const toggleBtn = document.getElementById('btn-saved-toggle');
    const status = document.getElementById('saved-player-status');
    const waveBox = document.getElementById('saved-wave-box');

    if (bar) {
      bar.classList.toggle('is-playing', this.isPlaying);
    }

    if (toggleBtn) {
      const playIcon = toggleBtn.querySelector('.icon-play');
      const pauseIcon = toggleBtn.querySelector('.icon-pause');
      if (playIcon) playIcon.style.display = this.isPlaying ? 'none' : 'block';
      if (pauseIcon) pauseIcon.style.display = this.isPlaying ? 'block' : 'none';
      toggleBtn.setAttribute('title', this.isPlaying ? '일시정지' : '재생');
      toggleBtn.setAttribute('aria-label', this.isPlaying ? '일시정지' : '재생');
    }

    if (status) {
      status.textContent = this.isPlaying ? 'PLAYING' : 'PAUSED';
      status.className = `saved-player-status ${this.isPlaying ? 'playing' : ''}`;
    }

    if (waveBox) {
      waveBox.classList.toggle('playing', this.isPlaying);
    }

    this._highlightActiveCard(shouldScroll);
  },

  _highlightActiveCard(shouldScroll = false) {
    const cards = document.querySelectorAll('.saved-sentence-card');
    const activeItem = this.playlist[this.currentIndex];
    let activeCard = null;

    cards.forEach(card => {
      const cardId = card.getAttribute('data-id') || (card.id ? card.id.replace('saved-card-', '') : '');
      const isCurrent = activeItem && cardId === activeItem.id;

      card.classList.toggle('is-playing', Boolean(isCurrent && this.isPlaying));
      card.classList.toggle('is-selected', Boolean(isCurrent));

      const playIcon = card.querySelector('.icon-card-play');
      const pauseIcon = card.querySelector('.icon-card-pause');
      if (playIcon && pauseIcon) {
        if (isCurrent && this.isPlaying) {
          playIcon.style.display = 'none';
          pauseIcon.style.display = 'block';
        } else {
          playIcon.style.display = 'block';
          pauseIcon.style.display = 'none';
        }
      }

      if (isCurrent) {
        activeCard = card;
      }
    });

    if (shouldScroll && activeCard && this.isPlaying) {
      requestAnimationFrame(() => {
        this._scrollToActiveCard(activeCard);
      });
    }
  },

  _scrollToActiveCard(card) {
    if (!card) return;
    const list = document.getElementById('saved-sentences-list');
    if (!list) return;

    if (this.currentIndex === 0) {
      try {
        list.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (_) {
        list.scrollTop = 0;
      }
      return;
    }

    const listRect = list.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const relativeOffset = cardRect.top - listRect.top;
    const targetScrollTop = Math.max(0, list.scrollTop + relativeOffset - 12);

    try {
      list.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    } catch (_) {
      list.scrollTop = targetScrollTop;
    }
  },

  play(index = null) {
    if (this.playlist.length === 0) return;

    if (index !== null) {
      this.currentIndex = Math.max(0, Math.min(this.playlist.length - 1, index));
    }

    const item = this.playlist[this.currentIndex];
    if (!item) return;

    // Pause any other page players (e.g. Step 4 ReviewPlayer, Step 2 VideoPlayer)
    window.dispatchEvent(new CustomEvent('app-audio-started', { detail: { source: 'saved-player' } }));
    window.dispatchEvent(new CustomEvent('saved-player-started'));

    const base = this.app ? this.app._getBasePath() : './';
    const audioUrl = this._resolveAudioUrl(item, base);

    this.isPlaying = true;
    this._updateTrackInfo();
    this._updateVisualState(true);
    this._updateMediaSession(item, base);

    const curLabel = document.getElementById('saved-player-current-time');
    const totalLabel = document.getElementById('saved-player-total-time');
    const progressBar = document.getElementById('saved-player-progress-bar');
    if (curLabel) curLabel.textContent = '0:00';
    if (totalLabel) totalLabel.textContent = '0:00';
    if (progressBar) progressBar.style.width = '0%';

    if (audioUrl) {
      if (this.audio.src !== audioUrl) {
        this.audio.src = audioUrl;
      }
      this.audio.playbackRate = this.playbackRate;
      this.audio.currentTime = 0;
      const p = this.audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(err => {
          console.warn('Audio play prevented or error:', err);
          this._fallbackTts();
        });
      }

      // Preload the next sentence in background to eliminate inter-track gap
      if (this.playlist.length > 1 && this.isPlayAll) {
        const nextIdx = (this.currentIndex + 1) % this.playlist.length;
        const nextItem = this.playlist[nextIdx];
        const nextUrl = this._resolveAudioUrl(nextItem, base);
        if (nextUrl && this.preloaderAudio) {
          this.preloaderAudio.src = nextUrl;
          this.preloaderAudio.load();
        }
      }
    } else {
      this._fallbackTts();
    }
  },

  _fallbackTts() {
    const item = this.playlist[this.currentIndex];
    if (!item) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(item.en);
      u.lang = 'en-US';
      u.rate = this.playbackRate * 0.92;
      u.onstart = () => {
        this.isPlaying = true;
        this._updateVisualState(true);
        this._setMediaSessionPlaybackState('playing');
      };
      u.onend = () => {
        this._onTrackEnded();
      };
      u.onerror = (err) => {
        console.warn('TTS speech synthesis error:', err);
        setTimeout(() => this._onTrackEnded(), 1200);
      };
      window.speechSynthesis.speak(u);
    } else {
      setTimeout(() => this._onTrackEnded(), 1800);
    }
  },

  _onTrackEnded() {
    if (this.isPlayAll) {
      if (this.currentIndex < this.playlist.length - 1) {
        this.next();
      } else {
        // Loop back to start
        this.currentIndex = 0;
        this.play(0);
      }
    } else {
      this.isPlaying = false;
      this._updateVisualState(false);
      this._setMediaSessionPlaybackState('paused');
    }
  },

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this._updateVisualState(false);
    this._setMediaSessionPlaybackState('paused');
  },

  resume() {
    if (this.playlist.length === 0) return;
    window.dispatchEvent(new CustomEvent('app-audio-started', { detail: { source: 'saved-player' } }));
    window.dispatchEvent(new CustomEvent('saved-player-started'));
    if (this.audio && this.audio.src && !this.audio.ended && this.audio.currentTime > 0) {
      this.audio.playbackRate = this.playbackRate;
      this.isPlaying = true;
      this._updateVisualState(true);
      this.audio.play().catch(() => this.play(this.currentIndex));
    } else {
      this.play(this.currentIndex);
    }
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  },

  next() {
    if (this.playlist.length === 0) return;
    const nextIdx = (this.currentIndex + 1) % this.playlist.length;
    this.play(nextIdx);
  },

  prev() {
    if (this.playlist.length === 0) return;
    const prevIdx = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.play(prevIdx);
  },

  cycleSpeed() {
    const rates = [1.0, 1.25, 0.85];
    const curIdx = rates.indexOf(this.playbackRate);
    const nextIdx = (curIdx + 1) % rates.length;
    this.playbackRate = rates[nextIdx];

    if (this.audio) {
      this.audio.playbackRate = this.playbackRate;
    }

    const btn = document.getElementById('btn-saved-speed');
    if (btn) btn.textContent = `${this.playbackRate.toFixed(2).replace(/\.00$/, '.0')}x`;
  },

  togglePlayAll() {
    this.isPlayAll = !this.isPlayAll;
    const btn = document.getElementById('btn-saved-playall');
    if (btn) {
      btn.classList.toggle('active', this.isPlayAll);
      btn.title = this.isPlayAll ? '전체 연속 재생 켜짐 (클릭 시 끄기)' : '전체 연속 재생 꺼짐 (한 문장만 재생)';
    }
  },

  _updateMediaSession(item, base) {
    if ('mediaSession' in navigator && item) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: item.en,
          artist: '현서네 리얼 영어 (RhyRhy English)',
          album: 'My Saved Sentences',
          artwork: [
            { src: `${base}assets/icons/icon-192.png`, sizes: '192x192', type: 'image/png' },
            { src: `${base}assets/icons/icon-512.png`, sizes: '512x512', type: 'image/png' }
          ]
        });
      } catch (err) {
        console.warn('MediaSession metadata error:', err);
      }
    }
  },

  _resolveAudioUrl(item, base) {
    if (!item) return null;

    // 1. Explicit item.audio property
    if (item.audio) {
      if (item.audio.startsWith('http') || item.audio.startsWith('data:')) {
        return item.audio;
      }
      if (item.audio.startsWith('./') || item.audio.startsWith('/')) {
        return item.audio;
      }
      const clean = item.audio.replace(/^audio\//, '');
      return encodeURI(`${base}lessons/${item.lessonId || 'lesson-01'}/audio/${clean}`);
    }

    // 2. Map lookup for Lesson 01
    const lesId = item.lessonId || 'lesson-01';
    if (lesId === 'lesson-01') {
      const cleanText = (item.en || '').toLowerCase().replace(/['".,!?;:\-]/g, '').trim();
      for (const mapItem of LESSON_01_AUDIO_MAP) {
        if (cleanText.includes(mapItem.key) || mapItem.key.includes(cleanText)) {
          return encodeURI(`${base}lessons/lesson-01/audio/${mapItem.file}`);
        }
      }
    }

    return null;
  }
};

App.savedPlayer = SavedAudioPlayer;
App.AudioPlayerComponent = AudioPlayerComponent;

if (typeof window !== 'undefined') {
  window.App = App;
  window.SavedAudioPlayer = SavedAudioPlayer;
  window.AudioPlayerComponent = AudioPlayerComponent;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
  module.exports.AudioPlayerComponent = AudioPlayerComponent;
  module.exports.SavedAudioPlayer = SavedAudioPlayer;
}
