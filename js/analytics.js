/**
 * Analytics Module for RhyRhy English
 * Powered by Google Analytics 4 (GA4).
 *
 * Tracks:
 * 1. Lesson views & cumulative access counts per user
 * 2. 4-step completion funnel (Step 1 Quiz -> Step 2 Video/Script -> Step 3 Writing/Comment -> Step 4 Review)
 * 3. Active foreground study duration (excluding background tabs) using VisibilityStateEntry & VisibilityChange
 * 4. Site dwell time, unique visitors, DAU, and MAU (handled natively by GA4)
 */
const Analytics = {
  DEFAULT_MEASUREMENT_ID: 'G-6Z1RWQ4CN2',

  measurementId: null,
  initialized: false,
  isDebug: false,

  // Session timer state for active foreground study tracking
  currentLessonId: null,
  currentStep: 1,
  activeStepStartTime: null,
  stepAccumulatedSeconds: 0,
  visibilityStateHistorySupported: false,

  STEP_NAMES: {
    1: '1_quiz',
    2: '2_video_script',
    3: '3_writing_comment',
    4: '4_sentence_review'
  },

  /**
   * Initialize GA4 gtag.js script and set up visibility observers
   * @param {string} [measurementId] Optional override for measurement ID
   */
  init(measurementId = null) {
    if (this.initialized) return;

    try {
      this.measurementId = measurementId || window.GA_MEASUREMENT_ID || this.DEFAULT_MEASUREMENT_ID;

      const isLocalhost = Boolean(
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:'
      );
      this.isDebug = isLocalhost || Boolean(window.DEBUG_ANALYTICS);

      // Check support for VisibilityStateEntry performance API
      if (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function') {
        const entries = performance.getEntriesByType('visibility-state');
        this.visibilityStateHistorySupported = Array.isArray(entries);
      }

      // Initialize gtag dataLayer
      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
      }

      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
      });

      // Inject gtag.js script tag dynamically if not already present
      const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.measurementId)}`;
      const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = scriptSrc;
        document.head.appendChild(script);
      }

      // Listen for tab visibility changes to pause/resume foreground dwell tracking
      this._bindVisibilityListeners();

      this.initialized = true;

      if (this.isDebug) {
        console.debug(`%c[GA4 📊]%c Initialized with ID: ${this.measurementId} (Debug Mode)`, 'color: #10B981; font-weight: bold;', 'color: inherit;');
      }
    } catch (err) {
      console.warn('[Analytics] Initialization error:', err);
    }
  },

  /**
   * Safely dispatch an event to GA4 gtag
   * @param {string} eventName
   * @param {object} params
   */
  trackEvent(eventName, params = {}) {
    try {
      if (!this.initialized) {
        this.init();
      }

      if (this.isDebug) {
        console.debug(`%c[GA4 📊 Event: ${eventName}]%c`, 'color: #3B82F6; font-weight: bold;', 'color: inherit;', params);
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
      }
    } catch (err) {
      console.warn('[Analytics] trackEvent error:', err);
    }
  },

  /**
   * Track when a user visits a lesson page and record cumulative access count
   * @param {string} lessonId
   * @param {string} lessonTitle
   */
  trackLessonView(lessonId, lessonTitle = '') {
    if (!lessonId) return;

    this.currentLessonId = lessonId;

    // Increment and get local cumulative visit count for this lesson
    let accessCount = 1;
    if (typeof Storage !== 'undefined' && typeof Storage.incrementLessonAccessCount === 'function') {
      accessCount = Storage.incrementLessonAccessCount(lessonId);
    }

    this.trackEvent('lesson_view', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      access_count: accessCount
    });

    // Start study duration timer for this lesson
    this._startStudyTimer(lessonId, this.currentStep);
  },

  /**
   * Track funnel step entry (Step 1 -> 4)
   * @param {string} lessonId
   * @param {number} stepNumber
   * @param {string} [customStepName]
   */
  trackStepView(lessonId, stepNumber, customStepName = '') {
    const step = parseInt(stepNumber, 10) || 1;
    const stepName = customStepName || this.STEP_NAMES[step] || `step_${step}`;

    // Flush study duration accumulated on the previous step
    this._flushStudyDuration();

    this.currentLessonId = lessonId;
    this.currentStep = step;
    this.activeStepStartTime = Date.now();
    this.stepAccumulatedSeconds = 0;

    this.trackEvent('lesson_funnel_step', {
      lesson_id: lessonId,
      step_number: step,
      step_name: stepName
    });
  },

  /**
   * Track completion of an individual lesson step
   * @param {string} lessonId
   * @param {number} stepNumber
   * @param {object} [metadata]
   */
  trackStepComplete(lessonId, stepNumber, metadata = {}) {
    const step = parseInt(stepNumber, 10) || 1;
    const stepName = this.STEP_NAMES[step] || `step_${step}`;

    // Also record duration for this step
    const elapsedSeconds = this._flushStudyDuration();

    this.trackEvent('lesson_step_complete', {
      lesson_id: lessonId,
      step_number: step,
      step_name: stepName,
      step_duration_seconds: elapsedSeconds,
      ...metadata
    });
  },

  /**
   * Track complete lesson finish (all 4 steps completed)
   * @param {string} lessonId
   * @param {object} [metadata]
   */
  trackLessonComplete(lessonId, metadata = {}) {
    this._flushStudyDuration();

    let totalLessonStudySeconds = 0;
    if (typeof Storage !== 'undefined' && typeof Storage.getStudyTime === 'function') {
      totalLessonStudySeconds = Storage.getStudyTime(lessonId);
    }

    this.trackEvent('lesson_complete', {
      lesson_id: lessonId,
      total_study_seconds: totalLessonStudySeconds,
      ...metadata
    });
  },

  /**
   * Track when a lesson card is clicked in the catalog
   * @param {string} lessonId
   * @param {string} lessonTitle
   */
  trackLessonCardClick(lessonId, lessonTitle = '') {
    this.trackEvent('lesson_click', {
      lesson_id: lessonId,
      lesson_title: lessonTitle
    });
  },

  /**
   * Start study session foreground timer
   * @private
   */
  _startStudyTimer(lessonId, stepNumber = 1) {
    this.currentLessonId = lessonId;
    this.currentStep = stepNumber;
    if (!document.hidden) {
      this.activeStepStartTime = Date.now();
    }
  },

  /**
   * Calculate and flush foreground study duration for active step
   * @private
   * @returns {number} Flushed seconds
   */
  _flushStudyDuration() {
    if (!this.currentLessonId) return 0;

    let seconds = this.stepAccumulatedSeconds;
    if (this.activeStepStartTime && !document.hidden) {
      const now = Date.now();
      const currentChunk = Math.round((now - this.activeStepStartTime) / 1000);
      if (currentChunk > 0) {
        seconds += currentChunk;
      }
      this.activeStepStartTime = now;
    }

    this.stepAccumulatedSeconds = 0;

    if (seconds > 0) {
      // Record locally in Storage
      if (typeof Storage !== 'undefined' && typeof Storage.recordStudyTime === 'function') {
        Storage.recordStudyTime(this.currentLessonId, seconds);
      }

      // Send to GA4
      this.trackEvent('study_duration', {
        lesson_id: this.currentLessonId,
        step_number: this.currentStep,
        step_name: this.STEP_NAMES[this.currentStep] || `step_${this.currentStep}`,
        study_duration_seconds: seconds
      });
    }

    return seconds;
  },

  /**
   * Bind page visibility and pagehide listeners to track true foreground engagement
   * @private
   */
  _bindVisibilityListeners() {
    // 1. Tab visibility changes (switched tabs, minimized browser)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab went into background: accumulate active foreground time and pause timer
        if (this.activeStepStartTime) {
          const now = Date.now();
          const chunk = Math.round((now - this.activeStepStartTime) / 1000);
          if (chunk > 0) {
            this.stepAccumulatedSeconds += chunk;
          }
          this.activeStepStartTime = null;
        }
      } else {
        // Tab returned to foreground: restart active timer
        this.activeStepStartTime = Date.now();
      }
    });

    // 2. Page unloading / navigating away: flush any remaining foreground duration
    const flushOnExit = () => {
      this._flushStudyDuration();
    };

    window.addEventListener('pagehide', flushOnExit);
    window.addEventListener('beforeunload', flushOnExit);
  }
};

// Auto-register to window
if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}
