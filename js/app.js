/**
 * Main App Script for RhyRhy English
 * Initializes global navigation, lesson switcher, saved sentences drawer,
 * offline status notifications, and PWA service worker.
 */
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
    },
    {
      id: 'lesson-02',
      shortTitle: 'Lesson 2',
      topic: 'Cafe Ordering',
      icon: '☕',
      title: 'Ordering at a Trendy Cafe',
      subtitle: '트렌디한 카페에서 커스텀 음료 주문과 바리스타와의 자연스러운 영어 대화',
      duration: '4:10',
      vocabCount: 3,
      path: 'lessons/lesson-02/'
    },
    {
      id: 'lesson-03',
      shortTitle: 'Lesson 3',
      topic: 'Airport & Travel',
      icon: '✈️',
      title: 'Airport & Travel Essentials',
      subtitle: '해외 여행 공항 체크인, 게이트 안내방송, 수속 필수 표현 완벽 정복',
      duration: '5:15',
      vocabCount: 3,
      path: 'lessons/lesson-03/'
    }
  ],

  init(currentLessonId = null) {
    this.currentLessonId = currentLessonId;
    this._renderNavigationBar();
    this._renderSavedSentencesDrawer();
    this._initOfflineDetection();
    this._registerServiceWorker();
    this.updateSentenceBadge();
    this._renderFooter();

    // Render lessons cards catalog if container exists on page
    if (this.currentLessonId === 'lessons-list') {
      this.initLessonsListPage();
    } else {
      // Landing page: show 5 latest lessons from latest on top
      this.renderLessonsCatalog('#lessons-cards-container', { sort: 'desc', limit: 5 });
    }

    // First-visit browser storage notice popup
    this._checkFirstVisitNotice();
  },

  _getBasePath() {
    // If currentLessonId starts with 'lesson-', we are in /lessons/lesson-XX/ -> '../../'
    // Otherwise at root (index.html, lessons.html) -> './'
    return (this.currentLessonId && this.currentLessonId.startsWith('lesson-')) ? '../../' : './';
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
      const prog = Storage.getProgress(les.id);
      const isCompleted = !!prog.completed;
      const inProgress = !isCompleted && prog.currentQuestionIndex > 0;

      let statusBadgeHtml = `<span class="badge badge-emerald">100% 무료</span>`;
      let actionBtnText = `<span>학습 시작하기</span>`;
      let actionBtnClass = `btn-primary`;

      if (isCompleted) {
        statusBadgeHtml = `<span class="badge badge-emerald">✓ 학습 완료</span>`;
        actionBtnText = `<span>다시 복습하기 ✓</span>`;
        actionBtnClass = `btn-outline`;
      } else if (inProgress) {
        statusBadgeHtml = `<span class="badge badge-primary">Q${prog.currentQuestionIndex + 1}번 푸는 중</span>`;
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

          <div class="drawer-body" id="saved-sentences-list">
            <!-- Rendered dynamically -->
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
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
                ${items.map(item => `
                  <div class="saved-sentence-card" id="saved-card-${item.id}">
                    <div class="saved-card-text">
                      <p class="saved-en">"${item.en}"</p>
                      <p class="saved-kr">${item.kr}</p>
                    </div>
                    <button 
                      type="button" 
                      class="btn-delete-sentence" 
                      data-lesson="${lesId}" 
                      data-id="${item.id}"
                      title="Remove sentence"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('');

        // Bind delete events
        list.querySelectorAll('.btn-delete-sentence').forEach(btn => {
          btn.addEventListener('click', () => {
            const lId = btn.dataset.lesson;
            const sId = btn.dataset.id;
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
        <div class="toast-title" style="font-weight: 600; font-size: 0.95rem; color: #FFFFFF;">${message}</div>
      </div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 350);
    }, duration);
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
      window.addEventListener('load', () => {
        // Calculate root sw.js path
        const swPath = this._getBasePath() + 'sw.js';
        navigator.serviceWorker.register(swPath)
          .then(reg => {
            console.log('RhyRhy PWA ServiceWorker registered with scope:', reg.scope);
          })
          .catch(err => {
            console.log('RhyRhy ServiceWorker registration failed:', err);
          });
      });
    }
  },

  _checkFirstVisitNotice() {
    if (typeof Storage === 'undefined' || Storage.isStorageNoticeSeen()) return;

    // Show popup slightly after initial page render for smooth experience
    setTimeout(() => {
      this._renderFirstVisitModal();
    }, 500);
  },

  _renderFirstVisitModal() {
    if (document.getElementById('first-visit-storage-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'first-visit-storage-modal';
    overlay.className = 'first-visit-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'storage-notice-title');

    overlay.innerHTML = `
      <div class="first-visit-modal-card">
        <div class="first-visit-header">
          <div class="first-visit-icon-wrap" aria-hidden="true">💾</div>
          <div class="first-visit-badge">📌 꼭 확인해주세요!</div>
          <h2 class="first-visit-title" id="storage-notice-title">
            학습 기록 저장 및 보관 안내
          </h2>
        </div>

        <div class="first-visit-points">
          <div class="first-visit-point-card">
            <div class="point-icon">🔒</div>
            <div class="point-content">
              <h4 class="point-title">현재 브라우저에 영구 자동 저장</h4>
              <p class="point-desc">
                별도의 번거로운 회원가입 없이, 퀴즈 진도·북마크한 문장·작성한 영작문 등 모든 학습 내역이 <strong>현재 사용 중인 브라우저(Local Storage)에 영구적으로 안전하게 저장</strong>됩니다.
              </p>
            </div>
          </div>

          <div class="first-visit-point-card warning">
            <div class="point-icon">⚠️</div>
            <div class="point-content">
              <h4 class="point-title">다른 기기/브라우저 접속 시 주의</h4>
              <p class="point-desc">
                서버가 아닌 현재 브라우저에만 저장되므로, <strong>다른 기기(휴대폰 ↔ PC)나 다른 브라우저(Chrome ↔ Safari)</strong>로 접속하시면 기존 학습 기록이 자동으로 연동되지 않습니다.
              </p>
            </div>
          </div>

          <div class="first-visit-point-card request">
            <div class="point-icon">☁️</div>
            <div class="point-content">
              <h4 class="point-title">기기 간 기록 연동을 원하시나요?</h4>
              <p class="point-desc">
                어디서든 끊김 없이 학습 기록을 보관하고 기기 간 동기화할 수 있는 <strong>클라우드 계정 연동 기능</strong>이 필요하시다면 언제든지 편하게 요청해 주세요!
              </p>
            </div>
          </div>
        </div>

        <div class="first-visit-actions">
          <button type="button" class="btn btn-primary btn-dismiss-storage-notice" id="btn-dismiss-storage-notice">
            <span>✓ 확인했습니다 (이 기기에서 시작하기)</span>
          </button>
          <a href="https://www.youtube.com/@happyfamily8" target="_blank" rel="noopener noreferrer" class="btn-request-sync" title="현서네 유튜브 채널에 기능 요청 남기기">
            <span>💬 계정 연동 기능 요청 / 피드백 남기기 →</span>
          </a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('#btn-dismiss-storage-notice');
    const dismissModal = () => {
      Storage.setStorageNoticeSeen();
      overlay.classList.add('closing');
      setTimeout(() => {
        overlay.remove();
      }, 250);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', dismissModal);
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        dismissModal();
      }
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

