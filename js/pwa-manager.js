/**
 * RhyRhy English - PWA Installation Manager (Issue #9)
 *
 * Provides smart, polite PWA installation prompts for mobile users:
 * 1. Strictly ONE-TIME in the user's lifetime on that device.
 * 2. Triggers after completing all 4 steps of their very first lesson.
 * 3. Verifies platform compatibility (Android OS + Chrome / Samsung Internet / compatible browser).
 * 4. Checks that the user is not already running in standalone/installed mode.
 * 5. Persists a permanent lock in localStorage ('rhyrhy_pwa_prompt_shown') so users are never bothered again.
 */

(function () {
  'use strict';

  const STORAGE_KEY_PROMPT_SHOWN = 'rhyrhy_pwa_prompt_shown';
  const STORAGE_KEY_INSTALLED = 'rhyrhy_pwa_installed';

  const PWAManager = {
    deferredPrompt: null,
    isReadyToInstall: false,
    modalElement: null,

    /**
     * Initialize early window listeners for PWA installation
     */
    init() {
      // 1. Capture the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        this.deferredPrompt = e;
        this.isReadyToInstall = true;
        console.log('[PWA] beforeinstallprompt captured and ready.');
      });

      // 2. Track when the app has been successfully installed
      window.addEventListener('appinstalled', () => {
        console.log('[PWA] Application successfully installed.');
        this.deferredPrompt = null;
        this.isReadyToInstall = false;
        try {
          localStorage.setItem(STORAGE_KEY_INSTALLED, 'true');
          localStorage.setItem(STORAGE_KEY_PROMPT_SHOWN, 'true');
        } catch (_) {}

        if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
          Analytics.trackEvent('pwa_installed');
        }

        this.closeModal();
      });
    },

    /**
     * Check if the user is already running inside the installed PWA
     * @returns {boolean}
     */
    isAlreadyInstalled() {
      try {
        if (localStorage.getItem(STORAGE_KEY_INSTALLED) === 'true') {
          return true;
        }
      } catch (_) {}

      const isStandaloneMedia = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = window.navigator && window.navigator.standalone === true;
      return Boolean(isStandaloneMedia || isNavigatorStandalone);
    },

    /**
     * Check if the install prompt has already been shown in this device's lifetime
     * @returns {boolean}
     */
    hasBeenShownBefore() {
      try {
        return localStorage.getItem(STORAGE_KEY_PROMPT_SHOWN) === 'true';
      } catch (_) {
        return false;
      }
    },

    /**
     * Permanently mark the prompt as shown in localStorage so it never displays again
     */
    markPromptShown() {
      try {
        localStorage.setItem(STORAGE_KEY_PROMPT_SHOWN, 'true');
      } catch (_) {}
    },

    _getUserAgent() {
      const nav = (typeof window !== 'undefined' && window.navigator) || (typeof navigator !== 'undefined' ? navigator : {});
      return String(nav.userAgent || nav.vendor || (typeof window !== 'undefined' && window.opera) || '').toLowerCase();
    },

    _getUserAgentPlatform() {
      const nav = (typeof window !== 'undefined' && window.navigator) || (typeof navigator !== 'undefined' ? navigator : {});
      return (nav.userAgentData && nav.userAgentData.platform) || '';
    },

    /**
     * Verify if the user's platform is supported (Android)
     * @returns {boolean}
     */
    isSupportedPlatform() {
      const ua = this._getUserAgent();
      const platform = this._getUserAgentPlatform();
      const isAndroid = /android/i.test(ua);
      const isAndroidPlatform = /android/i.test(platform);
      return Boolean(isAndroid || isAndroidPlatform);
    },

    /**
     * Verify if the browser is compatible (Chrome, Samsung Internet, Chromium, or beforeinstallprompt ready)
     * @returns {boolean}
     */
    isCompatibleBrowser() {
      const ua = this._getUserAgent();
      const isSamsung = /samsungbrowser/i.test(ua);
      const isChrome = /chrome|crios/i.test(ua) && !/edg/i.test(ua);
      const isChromium = /chromium/i.test(ua);

      // If beforeinstallprompt already fired, the browser has confirmed full compatibility
      if (this.isReadyToInstall && this.deferredPrompt) {
        return true;
      }

      return Boolean(isChrome || isSamsung || isChromium);
    },

    /**
     * Check all criteria and trigger the prompt if eligible:
     * - Must not have been shown before (Strict lifetime rule)
     * - Must not be running in standalone mode already
     * - Must be on a supported platform (Android)
     * - Must be on a compatible browser (Chrome, Samsung Internet, etc.)
     *
     * @param {string} lessonId
     * @returns {boolean} Whether the prompt was shown
     */
    checkAndPrompt(lessonId = 'lesson-01') {
      // 1. Strict lifetime check: never bother users more than once
      if (this.hasBeenShownBefore()) {
        console.log('[PWA] Prompt skipped: already shown previously on this device.');
        return false;
      }

      // 2. Do not show if already running as installed standalone app
      if (this.isAlreadyInstalled()) {
        console.log('[PWA] Prompt skipped: app already running in standalone mode.');
        this.markPromptShown();
        return false;
      }

      // 3. Platform & Browser Verification
      if (!this.isSupportedPlatform() || !this.isCompatibleBrowser()) {
        console.log('[PWA] Prompt skipped: platform or browser is not supported.');
        return false;
      }

      // 4. Lock immediately so no other component can re-trigger it
      this.markPromptShown();

      // 5. Small reassuring delay (600ms) after lesson completion so user feels celebration first
      setTimeout(() => {
        this._renderAndShowModal(lessonId);
      }, 600);

      return true;
    },

    /**
     * Render the PWA Installation Modal
     * @private
     */
    _renderAndShowModal(lessonId) {
      if (document.getElementById('pwa-install-modal')) {
        return;
      }

      const modal = document.createElement('div');
      modal.id = 'pwa-install-modal';
      modal.className = 'pwa-install-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'pwa-modal-title');

      modal.innerHTML = `
        <div class="pwa-install-card">
          <!-- Top Badge & Dismiss Cross -->
          <div class="pwa-card-header">
            <span class="pwa-celebration-pill">🎉 첫 번째 레슨 완강 축하합니다!</span>
            <button type="button" class="pwa-close-btn" id="btn-pwa-close" aria-label="닫기">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- App Icon & Title -->
          <div class="pwa-app-profile">
            <div class="pwa-app-icon-wrap">
              <img src="../../assets/icons/icon.svg" alt="현서네 리얼 영어 앱 아이콘" class="pwa-app-icon" />
              <span class="pwa-app-badge-free">FREE</span>
            </div>
            <div class="pwa-app-info">
              <h3 id="pwa-modal-title" class="pwa-app-name">현서네 리얼 영어</h3>
              <p class="pwa-app-tagline">홈 화면에 바로가기 앱으로 설치하기</p>
            </div>
          </div>

          <!-- Value Proposition Description -->
          <p class="pwa-app-desc">
            매번 브라우저를 열어 검색할 필요 없이, <strong>휴대폰 홈 화면에서 터치 한 번</strong>으로 네이티브 앱처럼 바로 이어서 학습하세요!
          </p>

          <!-- Feature Highlights -->
          <div class="pwa-features-grid">
            <div class="pwa-feature-item">
              <div class="pwa-feature-icon">⚡</div>
              <div class="pwa-feature-text">
                <strong>1초 바로 실행</strong>
                <span>홈 화면에서 터치 즉시 학습</span>
              </div>
            </div>
            <div class="pwa-feature-item">
              <div class="pwa-feature-icon">🎧</div>
              <div class="pwa-feature-text">
                <strong>오프라인 지원</strong>
                <span>인터넷 없이도 복습 플레이어 실행</span>
              </div>
            </div>
            <div class="pwa-feature-item">
              <div class="pwa-feature-icon">📱</div>
              <div class="pwa-feature-text">
                <strong>전체 화면 몰입감</strong>
                <span>주소창 없는 깔끔한 전체 화면 앱</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pwa-actions-group">
            <button type="button" class="btn-pwa-install" id="btn-pwa-install-action">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>📲 홈 화면에 바로가기 앱 설치</span>
            </button>
            <button type="button" class="btn-pwa-dismiss" id="btn-pwa-dismiss-action">
              나중에 할게요
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      this.modalElement = modal;

      // Animate in safely
      const raf = (typeof window !== 'undefined' && window.requestAnimationFrame) ? window.requestAnimationFrame : ((cb) => setTimeout(cb, 16));
      raf(() => {
        modal.classList.add('active');
      });

      // Track prompt impression in GA4
      if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
        Analytics.trackEvent('pwa_prompt_shown', {
          lesson_id: lessonId
        });
      }

      // Bind actions
      const installBtn = modal.querySelector('#btn-pwa-install-action');
      const dismissBtn = modal.querySelector('#btn-pwa-dismiss-action');
      const closeBtn = modal.querySelector('#btn-pwa-close');

      if (installBtn) {
        installBtn.addEventListener('click', () => this.handleInstallClick());
      }
      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => this.handleDismissClick());
      }
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.handleDismissClick());
      }

      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.handleDismissClick();
        }
      });
    },

    /**
     * User clicked the install action button
     */
    async handleInstallClick() {
      if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
        Analytics.trackEvent('pwa_prompt_clicked');
      }

      if (this.deferredPrompt) {
        try {
          // Trigger native browser install dialog
          this.deferredPrompt.prompt();
          const choiceResult = await this.deferredPrompt.userChoice;

          if (choiceResult && choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted the installation.');
            if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
              Analytics.trackEvent('pwa_install_accepted');
            }
          } else {
            console.log('[PWA] User dismissed the installation dialog.');
            if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
              Analytics.trackEvent('pwa_install_dismissed');
            }
          }
        } catch (err) {
          console.warn('[PWA] Installation prompt error:', err);
        } finally {
          this.deferredPrompt = null;
          this.isReadyToInstall = false;
        }
      } else {
        // Fallback for browsers where beforeinstallprompt already resolved
        if (typeof App !== 'undefined' && typeof App.showToast === 'function') {
          App.showToast('브라우저 메뉴 (⋮) ➔ [홈 화면에 추가]를 눌러주세요.');
        }
      }

      this.closeModal();
    },

    /**
     * User clicked dismiss or close
     */
    handleDismissClick() {
      if (typeof Analytics !== 'undefined' && typeof Analytics.trackEvent === 'function') {
        Analytics.trackEvent('pwa_prompt_dismissed');
      }
      this.closeModal();
    },

    /**
     * Animate out and remove modal
     */
    closeModal() {
      if (!this.modalElement) {
        const el = document.getElementById('pwa-install-modal');
        if (el) el.remove();
        return;
      }

      this.modalElement.classList.remove('active');
      setTimeout(() => {
        if (this.modalElement) {
          this.modalElement.remove();
          this.modalElement = null;
        }
      }, 300);
    }
  };

  // Initialize immediately to capture beforeinstallprompt event as early as possible
  PWAManager.init();

  // Export to window
  if (typeof window !== 'undefined') {
    window.PWAManager = PWAManager;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
  }
})();
