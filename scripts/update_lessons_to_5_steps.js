const fs = require('fs');
const path = require('path');

const lessons = [
  {
    id: 'lesson-02',
    num: '02',
    titleBadge: 'Lesson 02',
    hasDeepDive: true,
    speakerName: 'Wayne',
    speakerAvatar: '../../assets/img/avatars/wayne.jpeg',
    deepDiveTitle: '추억을 회상하는 3가지 표현 (would, used to, get to)'
  },
  {
    id: 'lesson-03',
    num: '03',
    titleBadge: 'Lesson 03',
    hasDeepDive: false,
    speakerName: 'Pati',
    speakerAvatar: '../../assets/img/avatars/pati.jpeg'
  },
  {
    id: 'lesson-04',
    num: '04',
    titleBadge: 'Lesson 04',
    hasDeepDive: true,
    speakerName: 'Kelly',
    speakerAvatar: '../../assets/img/avatars/kelly.jpg',
    deepDiveTitle: '왜 turns out은 현재형일까?'
  },
  {
    id: 'lesson-05',
    num: '05',
    titleBadge: 'Lesson 05',
    hasDeepDive: false,
    speakerName: 'Kelly',
    speakerAvatar: '../../assets/img/avatars/kelly.jpg'
  },
  {
    id: 'lesson-06',
    num: '06',
    titleBadge: 'Lesson 06',
    hasDeepDive: false,
    speakerName: 'Gene',
    speakerAvatar: '../../assets/img/avatars/gene.jpeg',
    isComingSoonConfig: true
  },
  {
    id: 'lesson-07',
    num: '07',
    titleBadge: 'Lesson 07',
    hasDeepDive: false,
    speakerName: 'Kelly',
    speakerAvatar: '../../assets/img/avatars/kelly.jpg'
  }
];

function generateHtml(cfg) {
  const lessonDir = path.join(__dirname, '..', 'lessons', cfg.id);
  const oldHtml = fs.readFileSync(path.join(lessonDir, 'index.html'), 'utf8');

  // Extract LESSON_XX_AUDIO_FILES
  const audioFilesMatch = oldHtml.match(/const\s+LESSON_\w+_AUDIO_FILES\s*=\s*\[([\s\S]*?)\];/);
  if (!audioFilesMatch) {
    throw new Error(`Could not find audio files array in ${cfg.id}/index.html`);
  }
  const audioFilesCode = audioFilesMatch[0];

  // Extract Deep Dive section if applicable
  let deepDiveSectionHtml = '';
  if (cfg.hasDeepDive) {
    const ddMatch = oldHtml.match(/<!-- Deep Dive: 심화 학습 Section -->[\s\S]*?<\/section>/);
    if (!ddMatch) {
      throw new Error(`Could not find deep dive section in ${cfg.id}/index.html`);
    }
    deepDiveSectionHtml = ddMatch[0];
  }

  // Extract Coming Soon Banner if applicable (for lesson-06)
  let comingSoonBannerHtml = '';
  if (cfg.isComingSoonConfig) {
    comingSoonBannerHtml = `
    <!-- Coming Soon Notification Banner -->
    <div class="coming-soon-banner" id="coming-soon-banner" role="status" style="display: none;">
      <div class="coming-soon-banner-icon" aria-hidden="true">📅</div>
      <div class="coming-soon-banner-text">
        <div class="coming-soon-banner-title">
          본영상 공개 예정
          <span class="coming-soon-badge-pill">사전 공개</span>
        </div>
        <div class="coming-soon-banner-desc">
          현재 사전 공개(Pre-release) 기간입니다. 장인어른 진(Gene)의 생생한 목소리 오디오와 23개의 퀴즈를 미리 학습해보세요!
        </div>
      </div>
    </div>`;
  }

  // Navigation tabs
  let navTabsHtml = '';
  if (cfg.hasDeepDive) {
    navTabsHtml = `
    <!-- Step Navigation Tabs (1, 2, Deep Dive, 3, 4, 5, Writing) -->
    <nav class="lesson-step-tabs" id="lesson-step-tabs" aria-label="학습 단계 이동">
      <button type="button" class="step-tab-btn active" data-step="1">
        <span class="step-num">1</span>
        <span class="step-label">퀴즈</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="2">
        <span class="step-num">2</span>
        <span class="step-label">핵심 문장</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="deep-dive" id="step-tab-deep-dive" title="심화 학습: ${cfg.deepDiveTitle}">
        <span class="step-icon" aria-hidden="true">🥜</span>
        <span class="step-label">심화 학습</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="3" id="step-tab-3">
        <span class="step-num">3</span>
        <span class="step-label">전체 영상</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="4" id="step-tab-4">
        <span class="step-num">4</span>
        <span class="step-label">받아쓰기</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="5" id="step-tab-5">
        <span class="step-num">5</span>
        <span class="step-label">스피킹 퀴즈</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="writing" id="step-tab-writing" title="보너스: 영작 및 유튜브 댓글 작성">
        <span class="step-icon" aria-hidden="true">✍️</span>
        <span class="step-label">영작하기</span>
      </button>
    </nav>`;
  } else {
    navTabsHtml = `
    <!-- Step Navigation Tabs (1, 2, 3, 4, 5, Writing) -->
    <nav class="lesson-step-tabs" id="lesson-step-tabs" aria-label="학습 단계 이동">
      <button type="button" class="step-tab-btn active" data-step="1">
        <span class="step-num">1</span>
        <span class="step-label">퀴즈</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="2">
        <span class="step-num">2</span>
        <span class="step-label">핵심 문장</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="3" id="step-tab-3">
        <span class="step-num">3</span>
        <span class="step-label">전체 영상</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="4" id="step-tab-4">
        <span class="step-num">4</span>
        <span class="step-label">받아쓰기</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="5" id="step-tab-5">
        <span class="step-num">5</span>
        <span class="step-label">스피킹 퀴즈</span>
      </button>
      <button type="button" class="step-tab-btn" data-step="writing" id="step-tab-writing" title="보너스: 영작 및 유튜브 댓글 작성">
        <span class="step-icon" aria-hidden="true">✍️</span>
        <span class="step-label">영작하기</span>
      </button>
    </nav>`;
  }

  // Deep dive JS handlers (if hasDeepDive)
  const deepDiveJsLogic = cfg.hasDeepDive ? `
      // Deep Dive Share handler
      const shareDeepDive = () => {
        const origin = window.location.origin || 'https://rhyrhyenglish.site';
        const shareUrl = \`\${origin}/lessons/\${LESSON_ID}/deep-dive.html\`;
        const title = \`[현서네 리얼 영어] 심화 학습: \${metadata.title || ''}\`;
        const text = '영어 공부하는 다른 사람에게도 알려주세요!';

        if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
          Analytics.trackEvent('deep_dive_share', { lesson_id: LESSON_ID });
        }

        const shareBtns = document.querySelectorAll('#btn-deep-dive-share, #btn-deep-dive-share-nudge');
        const setFeedback = () => {
          shareBtns.forEach(btn => {
            btn.classList.add('copied');
            const span = btn.querySelector('span');
            if (span && !span.dataset.orig) span.dataset.orig = span.textContent;
            if (span) span.textContent = '복사됨! ✓';
            setTimeout(() => {
              btn.classList.remove('copied');
              if (span && span.dataset.orig) span.textContent = span.dataset.orig;
            }, 1800);
          });
        };

        const copyFallback = () => {
          let copied = false;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(() => {
              setFeedback();
              if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
                App.showToast('📋 링크가 복사되었습니다! 영어 공부하는 다른 사람에게도 알려주세요.', 'success');
              }
            }).catch(() => fallbackTextarea());
          } else {
            fallbackTextarea();
          }

          function fallbackTextarea() {
            try {
              const ta = document.createElement('textarea');
              ta.value = shareUrl;
              ta.style.position = 'fixed';
              ta.style.left = '-999999px';
              document.body.appendChild(ta);
              ta.focus();
              ta.select();
              copied = document.execCommand('copy');
              ta.remove();
            } catch (_) {}
            if (copied) {
              setFeedback();
              if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
                App.showToast('📋 링크가 복사되었습니다! 영어 공부하는 다른 사람에게도 알려주세요.', 'success');
              }
            } else {
              prompt('심화 학습 공유 링크를 복사하세요:', shareUrl);
            }
          }
        };

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
        if (isMobile && navigator.share) {
          navigator.share({
            title,
            text,
            url: shareUrl
          }).then(() => {
            setFeedback();
          }).catch((err) => {
            if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
              return;
            }
            copyFallback();
          });
        } else {
          copyFallback();
        }
      };

      // Click timestamp to jump to video step and seek
      document.querySelectorAll('.deep-dive-time-badge').forEach(badge => {
        badge.addEventListener('click', () => {
          const timeText = badge.textContent.replace('⏱', '').trim();
          const parts = timeText.split(':');
          if (parts.length === 2) {
            const seconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
            showStep(3, true);
            if (videoPlayer && videoPlayer.seekTo) {
              setTimeout(() => videoPlayer.seekTo(seconds, true), 300);
            }
          }
        });
      });
` : '';

  // Click delegation additions
  const clickDelegationDeepDive = cfg.hasDeepDive ? `
        } else if (e.target.closest('#btn-goto-deep-dive')) {
          e.preventDefault();
          showStep('deep-dive', true);
        } else if (e.target.closest('#btn-deep-dive-next')) {
          e.preventDefault();
          showStep(3, true);
        } else if (e.target.closest('#btn-deep-dive-share') || e.target.closest('#btn-deep-dive-share-nudge')) {
          e.preventDefault();
          shareDeepDive();` : '';

  const stepsSeqStr = cfg.hasDeepDive ? `[1, 2, 'deep-dive', 3, 4, 5, 'writing']` : `[1, 2, 3, 4, 5, 'writing']`;

  const tabsScrollLogic = cfg.hasDeepDive ? `
            let targetLeft = 0;
            if (step === 1 || step === 2) targetLeft = 0;
            else if (step === 'deep-dive') targetLeft = Math.round(maxScroll * 0.25);
            else if (step === 3) targetLeft = Math.round(maxScroll * 0.5);
            else if (step === 4) targetLeft = Math.round(maxScroll * 0.75);
            else targetLeft = maxScroll;
            tabsNav.scrollTo({ left: targetLeft, behavior: scroll ? 'smooth' : 'auto' });` : `
            let targetLeft = 0;
            if (step === 1 || step === 2) targetLeft = 0;
            else if (step === 3) targetLeft = Math.round(maxScroll * 0.33);
            else if (step === 4) targetLeft = Math.round(maxScroll * 0.66);
            else targetLeft = maxScroll;
            tabsNav.scrollTo({ left: targetLeft, behavior: scroll ? 'smooth' : 'auto' });`;

  const statusBadgeDeepDiveText = cfg.hasDeepDive ? `else if (step === 'deep-dive') statusBadge.textContent = '🥜 심화 학습';\n          ` : '';

  const reviewPlayerCompleteAction = cfg.hasDeepDive ? `showStep('deep-dive', true);` : (cfg.isComingSoonConfig ? `if (isComingSoon) { if (celebrationManager) celebrationManager._launchConfettiParticles(); } else { showStep(3, true); }` : `showStep(3, true);`);

  const initialStepParser = cfg.hasDeepDive ? `
        const initialStep = (paramStep === 'deep-dive' || hashStep === 'deep-dive' || paramStep === 'writing' || hashStep === 'writing')
          ? (paramStep || hashStep)
          : (paramStep ? parseInt(paramStep, 10) : (hashStep ? parseInt(hashStep, 10) : Storage.getCurrentStep(LESSON_ID)));` : `
        const initialStep = (paramStep === 'writing' || hashStep === 'writing')
          ? (paramStep || hashStep)
          : (paramStep ? parseInt(paramStep, 10) : (hashStep ? parseInt(hashStep, 10) : Storage.getCurrentStep(LESSON_ID)));`;

  const comingSoonConfigJs = cfg.isComingSoonConfig ? `
      const isComingSoon = LessonStatusHelper.isComingSoon(metadata.status);
      const comingSoonBanner = document.getElementById('coming-soon-banner');
      if (comingSoonBanner) {
        comingSoonBanner.style.display = isComingSoon ? 'flex' : 'none';
      }
      const lockedTabs = [
        document.getElementById('step-tab-3'),
        document.getElementById('step-tab-4'),
        document.getElementById('step-tab-5'),
        document.getElementById('step-tab-writing')
      ];
      if (isComingSoon) {
        lockedTabs.forEach(tab => {
          if (tab) {
            tab.classList.add('deactivated');
            tab.setAttribute('disabled', 'true');
            tab.setAttribute('aria-disabled', 'true');
            tab.setAttribute('title', metadata.scheduledDateText ? \`\${metadata.scheduledDateText} 본영상 공개 예정\` : '본영상 공개 예정');
            if (!tab.querySelector('.step-lock-icon')) {
              const lockSpan = document.createElement('span');
              lockSpan.className = 'step-lock-icon';
              lockSpan.setAttribute('aria-hidden', 'true');
              lockSpan.textContent = '🔒';
              tab.appendChild(lockSpan);
            }
          }
        });
      }
` : '';

  const comingSoonGuardInShowStep = cfg.isComingSoonConfig ? `
        if (isComingSoon && (step === 3 || step === 4 || step === 5 || step === 'writing')) {
          step = 2;
        }
` : '';

  return `<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>RhyRhy English - ${cfg.titleBadge}</title>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">
  <script>
    (function () {
      var saved = localStorage.getItem('rhyrhy_theme');
      var theme = saved || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    })();
  </script>
  <!-- Google tag (gtag.js) -->
  <script>
    (function() {
      var isLocal = (
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '0.0.0.0' ||
        (window.location.hostname && window.location.hostname.indexOf('.local') !== -1) ||
        window.location.protocol === 'file:'
      );
      if (isLocal) {
        window['ga-disable-G-6Z1RWQ4CN2'] = true;
      }
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      if (!isLocal) {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=G-6Z1RWQ4CN2';
        document.head.appendChild(s);
        gtag('js', new Date());
      }
    })();
  </script>
  <link rel="stylesheet" href="../../css/main.css">
  <link rel="stylesheet" href="../../css/navigation.css">
  <link rel="stylesheet" href="../../css/quiz.css">
  <link rel="stylesheet" href="../../css/video-script.css">
  <link rel="stylesheet" href="../../css/modal.css">
  <link rel="stylesheet" href="../../css/review-player.css">
  <link rel="stylesheet" href="../../css/dictation.css">
  <link rel="stylesheet" href="../../css/review-quiz.css">
</head>

<body>

  <!-- Navigation Bar -->
  <header class="main-nav" id="main-nav"></header>

  <main class="app-container">
    <!-- Lesson Header (Only Badges) -->
    <section class="lesson-header-section" style="margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge badge-primary">${cfg.titleBadge}</span>
        <span class="badge badge-emerald" id="lesson-status-badge">Step 1: 퀴즈</span>
      </div>
    </section>${comingSoonBannerHtml}${navTabsHtml}

    <!-- Step 1: Pre-Video Quizzes Section -->
    <section class="quiz-section-wrapper" id="quiz-section" aria-label="Step 1: Quizzes">
      <div id="quiz-container">
        <!-- Rendered dynamically by QuizEngine -->
        <div style="text-align: center; padding: 40px;">
          <p>퀴즈 데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    </section>

    <!-- Step 2: Key Sentences & Audio Player Section -->
    <section class="review-section-wrapper" id="review-section" aria-label="Step 2: Key Sentences and Audio Player"
      style="display: none;">
      <div id="review-player-container"></div>
    </section>
${deepDiveSectionHtml}
    <!-- Step 3: Video & Interactive Script Section -->
    <section class="video-section" id="video-section" aria-label="Step 3: Video and Interactive Script"
      style="display: none; margin-top: 24px;">

      <div class="video-script-grid" id="video-script-grid">
        <!-- Video Player Column (Top on mobile, Left on desktop) -->
        <div class="video-player-column" id="video-player-col">
          <div class="video-frame-wrapper">
            <div id="youtube-player-container"></div>
          </div>

          <!-- Video Controls Toolbar -->
          <div class="video-toolbar">
            <button type="button" class="btn-ctrl" id="btn-play-pause-toggle" title="재생 / 일시정지">
              <span id="play-pause-icon">▶ 재생</span>
            </button>

            <div class="video-speed-controls">
              <span class="speed-label">Speed:</span>
              <button type="button" class="btn-speed" data-speed="0.75">0.75x</button>
              <button type="button" class="btn-speed active" data-speed="1.0">1.0x</button>
              <button type="button" class="btn-speed" data-speed="1.25">1.25x</button>
            </div>

            <a href="https://www.youtube.com/@happyfamily8" target="_blank" rel="noopener noreferrer"
              class="btn-yt-direct" id="btn-yt-direct" title="YouTube 새 창에서 직접 보기">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#FF0000">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Interactive Script Panel (Bottom on mobile, Right on desktop) -->
        <div class="script-panel-column" id="script-panel-main">
          <div class="script-panel-header has-actions">
            <div class="script-header-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <strong>자막</strong>
            </div>

            <div class="script-header-actions">
              <button type="button" class="btn-filter-flagged" id="btn-filter-flagged" aria-pressed="false" title="내가 표시한 어려운 문장만 보기 및 연속 재생">
                <svg class="icon-flag" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
                <span>어려운 문장만</span>
                <span class="flagged-count-badge" id="flagged-count-badge">0</span>
              </button>

              <div class="script-sub-toggle-group" role="group" aria-label="Subtitle Language">
                <button type="button" class="btn-toggle-sub active" data-subtitle-mode="both" title="한/영 자막 동시 보기 (Both Subtitles)" aria-label="한영 자막 동시 보기">Both</button>
                <button type="button" class="btn-toggle-sub" data-subtitle-mode="en" title="영어 자막만 보기 (English Only)" aria-label="영어 자막만 보기">EN</button>
                <button type="button" class="btn-toggle-sub" data-subtitle-mode="kr" title="한국어 자막만 보기 (Korean Only)" aria-label="한국어 자막만 보기">KR</button>
                <button type="button" class="btn-toggle-sub" data-subtitle-mode="off" title="자막 숨기기 / 리스닝 집중 모드 (Subtitles Off)" aria-label="자막 숨기기">
                  <svg class="sub-icon sub-icon-off" viewBox="0 0 20 14" width="20" height="14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="18" height="12" rx="2.5" stroke="currentColor" stroke-width="1.3" fill="none"/>
                    <line x1="4.5" y1="5.2" x2="15.5" y2="5.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    <line x1="4.5" y1="8.8" x2="11.5" y2="8.8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                    <line x1="2.5" y1="12" x2="17.5" y2="2" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="script-list-container mode-both" id="script-list-container" role="feed" aria-label="Bilingual Script Lines">
            <!-- Rendered dynamically -->
          </div>
        </div>
      </div>
    </section>

    <!-- Step 4: Dictation Practice Section -->
    <section class="dictation-wrapper" id="dictation-section" aria-label="Step 4: Dictation Practice" style="display: none; margin-top: 24px;">
      <div id="dictation-container"></div>
    </section>

    <!-- Step 5: Review Quiz Section -->
    <section class="review-quiz-wrapper" id="review-quiz-section" aria-label="Step 5: Review Quiz" style="display: none; margin-top: 24px;">
      <div id="review-quiz-container"></div>
    </section>

    <!-- Step Bonus: Writing & Commenting Section -->
    <section class="reflection-wrapper" id="reflection-section" aria-label="Writing and Commenting" style="display: none;">
      <div id="reflection-container"></div>
    </section>
  </main>

  <div class="celebration-overlay" id="celebration-overlay" aria-hidden="true"></div>

  <!-- Notification Toast Container -->
  <div class="toast-container" id="toast-container" aria-live="polite"></div>

  <!-- Core Scripts -->
  <script src="../../assets/vendor/lottie.min.js"></script>
  <script src="../../js/lesson-status.js"></script>
  <script src="../../js/storage.js"></script>
  <script src="../../js/analytics.js"></script>
  <script src="../../js/markdown-quiz-parser.js"></script>
  <script src="../../js/quiz-engine.js"></script>
  <script src="../../js/video-script.js"></script>
  <script src="../../js/celebration.js"></script>
  <script src="../../js/youtube-comment.js?v=step4"></script>
  <script src="../../js/review-player.js"></script>
  <script src="../../js/dictation-engine.js"></script>
  <script src="../../js/review-quiz-engine.js"></script>
  <script src="../../js/pwa-manager.js"></script>
  <script src="../../js/app.js"></script>

  <script>
    // Initialize ${cfg.titleBadge}
    document.addEventListener('DOMContentLoaded', async () => {
      const LESSON_ID = '${cfg.id}';

      // 1. Initialize Global App Shell (Navbar, Sentence Drawer, History Drawer, Offline detection)
      App.init(LESSON_ID);

      // 2. Initialize Managers
      const celebrationManager = new CelebrationManager({
        lottiePath: '../../assets/lottie/celebration.json'
      });

      const quizSection = document.getElementById('quiz-section');
      const lessonHeader = document.querySelector('.lesson-header-section');
      const videoSection = document.getElementById('video-section');
      const dictationSection = document.getElementById('dictation-section');
      const reviewQuizSection = document.getElementById('review-quiz-section');
      const reflectionSection = document.getElementById('reflection-section');
      const reviewSection = document.getElementById('review-section');
      const deepDiveSection = document.getElementById('deep-dive-section');
      const statusBadge = document.getElementById('lesson-status-badge');

      // Pre-matched audio files for ${cfg.titleBadge}
      ${audioFilesCode}

      let metadata = {};
      let scriptData = [];
      let keySentencesData = [];
      let loadedQuizzes = [];
      let loadedReviewQuizzes = [];
      let videoPlayer = null;
      let reviewPlayer = null;
      let dictationEngine = null;
      let reviewQuizEngine = null;

      try {
        const metaRes = await fetch('./metadata.json');
        if (metaRes.ok) metadata = await metaRes.json();
      } catch (e) {
        console.warn('Could not load metadata.json', e);
      }

      try {
        const scriptRes = await fetch('./script.json');
        if (scriptRes.ok) scriptData = await scriptRes.json();
      } catch (e) {
        console.warn('Could not load script.json', e);
      }

      try {
        const ksRes = await fetch('./key-sentences.json');
        if (ksRes.ok) keySentencesData = await ksRes.json();
      } catch (e) {
        console.warn('Could not load key-sentences.json', e);
      }

      // Initialize Analytics for ${cfg.titleBadge}
      if (typeof Analytics !== 'undefined') {
        Analytics.init();
        Analytics.trackLessonView(LESSON_ID, metadata.title || '${cfg.titleBadge}');
      }

      const commentManager = new YouTubeCommentManager({
        lessonId: LESSON_ID,
        youtubeId: metadata.youtubeId || '',
        lessonMetadata: metadata,
        celebrationManager: celebrationManager,
        container: '#reflection-container',
        nextLessonUrl: (typeof App !== 'undefined' && App.getNextLessonUrl) ? App.getNextLessonUrl(LESSON_ID) : '/lessons.html',
        onComplete: () => {
          showStep(4, false);
        }
      });
      commentManager.init();
${comingSoonConfigJs}
      // Unified Step Navigation (${cfg.hasDeepDive ? '1, 2, deep-dive, 3, 4, 5, writing' : '1, 2, 3, 4, 5, writing'}) with LocalStorage Memory
      let currentActiveStep = 1;
      const showStep = (stepNumber, scroll = true) => {
        let step = stepNumber;
        if (step !== 'deep-dive' && step !== 'writing') {
          step = Math.min(5, Math.max(1, parseInt(stepNumber, 10) || 1));
        }
${comingSoonGuardInShowStep}
        currentActiveStep = step;
        Storage.setCurrentStep(LESSON_ID, step);

        if (typeof Analytics !== 'undefined') {
          Analytics.trackStepView(LESSON_ID, step);
        }

        const nudgeModal = document.getElementById('step4-nudge-modal') || document.getElementById('step3-nudge-modal');
        if (nudgeModal) nudgeModal.style.display = 'none';

        // Pause audio if leaving steps
        if (step !== 2 && reviewPlayer) reviewPlayer.pause();
        if (step !== 3 && videoPlayer) videoPlayer.pause();
        if (step !== 4 && dictationEngine) {
          if (typeof dictationEngine.pauseAudio === 'function') dictationEngine.pauseAudio();
        }
        if (step !== 5 && reviewQuizEngine) {
          if (reviewQuizEngine.isListening) reviewQuizEngine.toggleSpeechRecognition();
          if (typeof reviewQuizEngine.pauseAudio === 'function') reviewQuizEngine.pauseAudio();
        }

        // Manage Section Displays
        if (quizSection) quizSection.style.display = (step === 1) ? 'block' : 'none';
        if (reviewSection) reviewSection.style.display = (step === 2) ? 'block' : 'none';
        if (deepDiveSection) deepDiveSection.style.display = (step === 'deep-dive') ? 'block' : 'none';
        if (videoSection) videoSection.style.display = (step === 3) ? 'block' : 'none';
        if (dictationSection) dictationSection.style.display = (step === 4) ? 'block' : 'none';
        if (reviewQuizSection) reviewQuizSection.style.display = (step === 5) ? 'block' : 'none';
        if (reflectionSection) reflectionSection.style.display = (step === 'writing') ? 'block' : 'none';

        // Update Step Tab Buttons
        const tabBtns = document.querySelectorAll('.step-tab-btn');
        tabBtns.forEach(btn => {
          const raw = btn.dataset.step;
          const s = (raw === 'deep-dive' || raw === 'writing') ? raw : parseInt(raw, 10);
          btn.classList.toggle('active', s === step);
        });

        // Horizontally scroll tabs
        const tabsNav = document.getElementById('lesson-step-tabs');
        if (tabsNav) {
          const maxScroll = tabsNav.scrollWidth - tabsNav.clientWidth;
          if (maxScroll > 0) {${tabsScrollLogic}
          }
        }

        // Update Status Badge
        if (statusBadge) {
          statusBadge.className = 'badge badge-emerald';
          if (step === 1) statusBadge.textContent = 'Step 1: 퀴즈';
          else if (step === 2) statusBadge.textContent = 'Step 2: 핵심 문장';
          ${statusBadgeDeepDiveText}else if (step === 3) statusBadge.textContent = 'Step 3: 전체 영상';
          else if (step === 4) statusBadge.textContent = 'Step 4: 받아쓰기';
          else if (step === 5) statusBadge.textContent = 'Step 5: 스피킹 퀴즈';
          else if (step === 'writing') statusBadge.textContent = '✍️ 영작하기';
        }

        // Lazy-init Review Player on Step 2 (핵심 문장)
        if (step === 2 && (keySentencesData.length > 0 || loadedQuizzes.length > 0)) {
          if (!reviewPlayer) {
            const step2Sentences = keySentencesData.length > 0 ? keySentencesData : loadedQuizzes;
            reviewPlayer = new ReviewPlayer({
              container: '#review-player-container',
              lessonId: LESSON_ID,
              quizzes: step2Sentences,
              audioBaseUrl: './audio/',
              audioFiles: LESSON_${cfg.num}_AUDIO_FILES,
              speakerName: metadata?.speaker?.name || '${cfg.speakerName}',
              speakerAvatar: metadata?.speaker?.avatar || '${cfg.speakerAvatar}',
              hasDeepDive: ${cfg.hasDeepDive ? 'true' : 'false'},
              showSaveButton: false, // Save button removed (Issue #108)
              celebrationManager: celebrationManager,
              onComplete: () => {
                ${reviewPlayerCompleteAction}
              }
            });
            reviewPlayer.init();
            window.reviewPlayer = reviewPlayer;
          }
        }

        // Lazy-init Video Player on Step 3 (전체 영상)
        if (step === 3) {
          if (!videoPlayer) {
            videoPlayer = new VideoScriptPlayer({
              lessonId: LESSON_ID,
              youtubeId: metadata.youtubeId || '',
              scriptData: scriptData,
              onVideoEnd: () => {
                if (typeof Analytics !== 'undefined') {
                  Analytics.trackStepComplete(LESSON_ID, 3, { trigger: 'video_end' });
                }
                showStep4Nudge();
              },
              onScriptComplete: () => {
                if (typeof Analytics !== 'undefined') {
                  Analytics.trackStepComplete(LESSON_ID, 3, { trigger: 'script_complete' });
                }
                showStep4Nudge();
              }
            });
            videoPlayer.init();
            window.videoPlayer = videoPlayer;
          } else {
            videoPlayer.onStepShow();
          }
        }

        // Lazy-init Dictation Engine on Step 4 (받아쓰기)
        if (step === 4 && (keySentencesData.length > 0 || loadedQuizzes.length > 0)) {
          if (!dictationEngine) {
            const step4Sentences = keySentencesData.length > 0 ? keySentencesData : loadedQuizzes;
            const keySentences = step4Sentences.map((q, idx) => ({
              id: \`key-\${idx + 1}\`,
              segmentId: q.segmentId,
              segmentAudio: q.segmentAudio || (q.segmentId ? \`segments/\${q.segmentId}.mp3\` : null),
              audioUrl: q.segmentAudio ? \`./audio/\${q.segmentAudio}\` : (q.segmentId ? \`./audio/segments/\${q.segmentId}.mp3\` : (LESSON_${cfg.num}_AUDIO_FILES[idx] ? \`./audio/\${encodeURIComponent(LESSON_${cfg.num}_AUDIO_FILES[idx])}\` : null)),
              segmentEn: q.segmentEn,
              en: q.segmentEn || (q.english ? q.english.replace(/\\[.*?\\]/, q.answer || q.keyExpression || '').replace(/\\s+/g, ' ').trim() : ''),
              kr: q.segmentKr || q.korean,
              target: q.target || q.keyExpression || q.answer || '',
              keyExpression: q.keyExpression || q.answer || '',
              audioFile: LESSON_${cfg.num}_AUDIO_FILES[idx]
            }));

            dictationEngine = new DictationEngine({
              container: '#dictation-container',
              lessonId: LESSON_ID,
              keySentences: keySentences,
              audioBaseUrl: './audio/',
              onNextStep: () => showStep(5, true),
              onComplete: (info) => {
                if (typeof Analytics !== 'undefined' && (!info || !info.alreadyCompleted)) {
                  Analytics.trackStepComplete(LESSON_ID, 4, { trigger: 'dictation_complete' });
                }
              }
            });
            dictationEngine.init();
            window.dictationEngine = dictationEngine;
          } else {
            dictationEngine.refreshQueue();
          }
        }

        // Lazy-init Review Quiz Engine on Step 5 (스피킹 퀴즈)
        if (step === 5) {
          if (!reviewQuizEngine) {
            reviewQuizEngine = new ReviewQuizEngine({
              container: '#review-quiz-container',
              lessonId: LESSON_ID,
              quizzes: loadedReviewQuizzes,
              audioBaseUrl: './audio/',
              celebrationManager: celebrationManager,
              onComplete: (info) => {
                if (typeof Analytics !== 'undefined' && (!info || !info.alreadyCompleted)) {
                  Analytics.trackStepComplete(LESSON_ID, 5, { trigger: 'review_quiz_complete' });
                }
              }
            });
            reviewQuizEngine.init();
            window.reviewQuizEngine = reviewQuizEngine;
          }
        }

        // Uniform Scroll to fit active contents section across all steps
        if (scroll) {
          try {
            let targetSection = null;
            if (step === 1) targetSection = quizSection;
            else if (step === 2) targetSection = reviewSection;
            ${cfg.hasDeepDive ? `else if (step === 'deep-dive') targetSection = deepDiveSection;\n            ` : ''}else if (step === 3) targetSection = videoSection;
            else if (step === 4) targetSection = dictationSection;
            else if (step === 5) targetSection = reviewQuizSection;
            else if (step === 'writing') targetSection = document.getElementById('reflection-card') || reflectionSection;

            if (targetSection) {
              const navHeight = 70;
              const y = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
              window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } catch (_) {
            window.scrollTo(0, 0);
          }
        }
      };
      window.showStep = showStep;

      // Step Navigation Tabs Click Binding
      document.querySelectorAll('.step-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled || btn.classList.contains('deactivated')) return;
          const raw = btn.dataset.step;
          const s = (raw === 'deep-dive' || raw === 'writing') ? raw : parseInt(raw, 10);
          showStep(s, true);
        });
      });

      // Swipe Left / Right to Navigate Steps on Touch Devices
      const appMain = document.querySelector('main.app-container') || document.body;
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;

      appMain.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) return;
        if (e.target.closest('input, textarea, select, button, iframe, .video-toolbar, .plyr, .audio-player-card, a')) {
          touchStartX = 0;
          return;
        }
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }, { passive: true });

      appMain.addEventListener('touchend', (e) => {
        if (!touchStartX) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const duration = Date.now() - touchStartTime;

        const stepsSeq = ${stepsSeqStr};
        const currentIndex = stepsSeq.indexOf(currentActiveStep);
        if (Math.abs(diffX) >= 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5 && duration <= 600) {
          if (diffX < 0 && currentIndex < stepsSeq.length - 1) {
            showStep(stepsSeq[currentIndex + 1], true);
          } else if (diffX > 0 && currentIndex > 0) {
            showStep(stepsSeq[currentIndex - 1], true);
          }
        }
        touchStartX = 0;
      }, { passive: true });

      // Pause video playback if user switches tabs or minimizes browser (audio continues in background)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (videoPlayer) videoPlayer.pause();
        }
      });
${deepDiveJsLogic}
      // Global click delegation
      document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-goto-video') || e.target.closest('#btn-goto-sentences')) {
          e.preventDefault();
          showStep(2, true);
        } else if (e.target.closest('#btn-goto-step3')) {
          e.preventDefault();
          showStep(3, true);${clickDelegationDeepDive}
        }
      });

      // Step 4 Nudge Popup Modal
      const step4Modal = document.getElementById('step4-nudge-modal') || document.getElementById('step3-nudge-modal');
      const btnModalGotoStep4 = document.getElementById('btn-modal-goto-step4') || document.getElementById('btn-modal-goto-step3');
      const btnModalCloseNudge = document.getElementById('btn-modal-close-nudge');

      const showStep4Nudge = () => {
        if (step4Modal) {
          step4Modal.style.display = 'flex';
        }
      };

      if (btnModalGotoStep4) {
        btnModalGotoStep4.addEventListener('click', () => {
          if (typeof Analytics !== 'undefined') {
            Analytics.trackStepComplete(LESSON_ID, 3, { trigger: 'modal_button' });
          }
          showStep(4, true);
        });
      }
      if (btnModalCloseNudge) {
        btnModalCloseNudge.addEventListener('click', () => {
          if (step4Modal) step4Modal.style.display = 'none';
        });
      }

      // Script list completion banner click
      document.addEventListener('click', (e) => {
        if (e.target.closest('#btn-banner-goto-step4') || e.target.closest('#btn-banner-goto-step3')) {
          if (typeof Analytics !== 'undefined') {
            Analytics.trackStepComplete(LESSON_ID, 3, { trigger: 'banner_button' });
          }
          showStep(4, true);
        }
      });

      // Load Quizzes from Markdown
      try {
        const quizzes = await MarkdownQuizParser.loadFromUrl('./quiz.md');
        loadedQuizzes = quizzes;
        commentManager.setQuizzes(quizzes);

        let quizPool = null;
        try {
          const poolRes = await fetch('./quiz-pool.json');
          if (poolRes.ok) quizPool = await poolRes.json();
        } catch (_) {}

        try {
          const rqRes = await fetch('./review-quiz.json');
          if (rqRes.ok) loadedReviewQuizzes = await rqRes.json();
        } catch (_) {}

        if (!keySentencesData || keySentencesData.length === 0) {
          try {
            const ksRes = await fetch('./key-sentences.json');
            if (ksRes.ok) keySentencesData = await ksRes.json();
          } catch (_) {}
        }

        if ((currentActiveStep === 2 && !reviewPlayer) || (currentActiveStep === 4 && !dictationEngine)) {
          showStep(currentActiveStep, false);
        }

        // Resume active step: URL query param, hash, or LocalStorage
        const urlParams = new URLSearchParams(window.location.search);
        const paramStep = urlParams.get('step');
        const hashStep = window.location.hash ? window.location.hash.replace('#', '') : null;${initialStepParser}
        showStep(initialStep, false);

        const quizEngine = new QuizEngine({
          container: '#quiz-container',
          lessonId: LESSON_ID,
          quizzes: quizzes,
          quizPool: quizPool,
          onComplete: (info) => {
            if (typeof Analytics !== 'undefined') {
              Analytics.trackStepComplete(LESSON_ID, 1, {
                alreadyCompleted: !!info.alreadyCompleted,
                totalQuizzes: (quizzes && quizzes.length) || 0
              });
            }
            if (!info.alreadyCompleted && celebrationManager) {
              celebrationManager._launchConfettiParticles();
            }
          },
          onStartVideo: () => {
            showStep(2, true);
          }
        });
        quizEngine.init();
        window.quizEngine = quizEngine;
      } catch (err) {
        console.error('Failed to load quiz markdown:', err);
        document.getElementById('quiz-container').innerHTML = \`
          <div class="quiz-feedback error">Failed to load quiz.md. Please check the file path.</div>
        \`;
      }
    });
  </script>

  <!-- Step 4 Nudge Popup Modal -->
  <div class="nudge-modal-overlay" id="step4-nudge-modal" style="display: none;" role="dialog" aria-modal="true"
    aria-labelledby="nudge-modal-title">
    <div class="nudge-modal-card">
      <div class="nudge-modal-icon">🎧</div>
      <h3 class="nudge-modal-title" id="nudge-modal-title">전체 영상 & 대본 학습 완료!</h3>
      <p class="nudge-modal-desc">
        영상과 대본을 모두 집중해서 학습하셨습니다.<br>
        이제 오늘 배운 핵심 문장들을 <strong>귀로 듣고 직접 써보는 받아쓰기(Step 4)</strong>를 시작해보세요!
      </p>
      <div class="nudge-modal-actions">
        <button type="button" class="btn btn-primary btn-modal-step4" id="btn-modal-goto-step4">
          <span>🎧 받아쓰기 연습 시작하기</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <button type="button" class="btn-modal-dismiss" id="btn-modal-close-nudge">
          <span>대본 더 복습하기</span>
        </button>
      </div>
    </div>
  </div>
</body>

</html>
`;
}

lessons.forEach(cfg => {
  const html = generateHtml(cfg);
  const targetPath = path.join(__dirname, '..', 'lessons', cfg.id, 'index.html');
  fs.writeFileSync(targetPath, html, 'utf8');
  console.log(`[Success] Updated ${targetPath}`);
});
