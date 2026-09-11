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
  isLocal: false,
  lastTrackedEvent: null,
  eventLog: [],

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
   * Helper: Check if running in a local, test, or development environment
   * @returns {boolean}
   */
  isLocalEnvironment() {
    if (typeof window === 'undefined') return true;
    const hostname = (window.location && window.location.hostname) || '';
    const protocol = (window.location && window.location.protocol) || '';
    return Boolean(
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      protocol === 'file:' ||
      (typeof window.DISABLE_GA !== 'undefined' && window.DISABLE_GA)
    );
  },

  /**
   * Initialize GA4 gtag.js script and set up visibility observers
   * @param {string} [measurementId] Optional override for measurement ID
   */
  init(measurementId = null) {
    if (this.initialized) return;

    try {
      this.measurementId = measurementId || (typeof window !== 'undefined' && window.GA_MEASUREMENT_ID) || this.DEFAULT_MEASUREMENT_ID;
      this.isLocal = this.isLocalEnvironment();
      this.isDebug = this.isLocal || (typeof window !== 'undefined' && Boolean(window.DEBUG_ANALYTICS)) || (typeof window !== 'undefined' && window.location && window.location.search && window.location.search.includes('debug'));

      // In local or test environments, immediately disable Google Analytics measurement
      if (this.isLocal && typeof window !== 'undefined') {
        window[`ga-disable-${this.measurementId}`] = true;
        window[`ga-disable-${this.DEFAULT_MEASUREMENT_ID}`] = true;
      }

      // Initialize gtag dataLayer & stub
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== 'function') {
          window.gtag = function () {
            window.dataLayer.push(arguments);
          };
        }
      }

      // Check support for VisibilityStateEntry performance API
      if (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function') {
        const entries = performance.getEntriesByType('visibility-state');
        this.visibilityStateHistorySupported = Array.isArray(entries);
      }

      // ONLY inject external gtag script and configure GA in non-local production environments
      if (!this.isLocal && typeof document !== 'undefined') {
        const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.measurementId)}`;
        const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
        if (!existingScript) {
          const script = document.createElement('script');
          script.async = true;
          script.src = scriptSrc;
          document.head.appendChild(script);
        }

        if (typeof window.gtag === 'function') {
          window.gtag('js', new Date());
          window.gtag('config', this.measurementId, {
            send_page_view: true,
            debug_mode: this.isDebug
          });
        }
      }

      // Listen for tab visibility changes to pause/resume foreground dwell tracking
      this._bindVisibilityListeners();

      this.initialized = true;

      if (this.isDebug) {
        console.debug(`%c[GA4 📊]%c Initialized with ID: ${this.measurementId} (Local: ${this.isLocal}, Debug: ${this.isDebug})`, 'color: #10B981; font-weight: bold;', 'color: inherit;');
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

      // Sanitize parameters for GA4 (convert booleans to 1/0, stringify objects, drop undefined)
      const sanitized = {};
      for (const [key, val] of Object.entries(params)) {
        if (typeof val === 'boolean') {
          sanitized[key] = val ? 1 : 0;
        } else if (val !== undefined && val !== null) {
          sanitized[key] = typeof val === 'object' ? JSON.stringify(val) : val;
        }
      }

      const payload = {
        transport_type: 'beacon',
        ...sanitized
      };

      if (this.isDebug) {
        payload.debug_mode = true;
        console.debug(`%c[GA4 📊 Event: ${eventName}]%c`, 'color: #3B82F6; font-weight: bold;', 'color: inherit;', payload);
      }

      this.lastTrackedEvent = { eventName, payload };
      if (!this.eventLog) this.eventLog = [];
      this.eventLog.push({ eventName, payload, timestamp: Date.now() });

      // In local environments, record locally to dataLayer without sending network requests to Google servers
      if (this.isLocal) {
        if (typeof window !== 'undefined' && window.dataLayer && Array.isArray(window.dataLayer)) {
          window.dataLayer.push({ event: eventName, ...payload });
        }
        return;
      }

      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', eventName, payload);
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

    // 1. Custom lesson_view event
    this.trackEvent('lesson_view', {
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      access_count: accessCount
    });

    // 2. Standard GA4 view_item event (recognized natively in all GA4 standard reports)
    this.trackEvent('view_item', {
      item_id: lessonId,
      item_name: lessonTitle || lessonId,
      item_category: 'lesson'
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

    // 1. Custom funnel event
    this.trackEvent('lesson_funnel_step', {
      lesson_id: lessonId,
      step_number: step,
      step_name: stepName
    });

    // 2. If Step 1: standard GA4 tutorial_begin
    if (step === 1) {
      this.trackEvent('tutorial_begin', {
        item_id: lessonId
      });
    }
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

    // 1. Custom completion event
    this.trackEvent('lesson_step_complete', {
      lesson_id: lessonId,
      step_number: step,
      step_name: stepName,
      step_duration_seconds: elapsedSeconds,
      ...metadata
    });

    // 2. Standard GA4 level_up event
    this.trackEvent('level_up', {
      level: step,
      character: lessonId
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

    // 1. Custom completion event
    this.trackEvent('lesson_complete', {
      lesson_id: lessonId,
      total_study_seconds: totalLessonStudySeconds,
      ...metadata
    });

    // 2. Standard GA4 tutorial_complete event
    this.trackEvent('tutorial_complete', {
      item_id: lessonId
    });
  },

  /**
   * Track when a lesson card is clicked in the catalog
   * @param {string} lessonId
   * @param {string} lessonTitle
   */
  trackLessonCardClick(lessonId, lessonTitle = '') {
    // 1. Custom event
    this.trackEvent('lesson_click', {
      lesson_id: lessonId,
      lesson_title: lessonTitle
    });

    // 2. Standard GA4 select_content event
    this.trackEvent('select_content', {
      content_type: 'lesson',
      item_id: lessonId
    });
  },

  /**
   * Track quiz sharing action
   * @param {string} lessonId
   * @param {number} questionNum
   */
  trackQuizShare(lessonId, questionNum = 1) {
    // 1. Custom event
    this.trackEvent('quiz_share', {
      lesson_id: lessonId,
      question_num: questionNum
    });

    // 2. Standard GA4 share event
    this.trackEvent('share', {
      method: 'web_share',
      content_type: 'quiz',
      item_id: `${lessonId}_q${questionNum}`
    });
  },

  /**
   * Track Popcorn quick lesson action ("알아요" vs "몰라요")
   * Measures skip-to-learn ratio and unfamiliarity index
   * @param {string} lessonId
   * @param {string} expression
   * @param {'skip'|'learn'} action
   */
  trackPopcornAction(lessonId, expression = '', action = 'learn') {
    if (!lessonId) return;
    const actionType = (action === 'skip') ? 'skip' : 'learn';
    const actionKorean = (actionType === 'skip') ? '알아요' : '몰라요';

    // 1. Custom GA4 popcorn_action event
    this.trackEvent('popcorn_action', {
      lesson_id: lessonId,
      expression: expression || lessonId,
      action: actionType,
      action_korean: actionKorean
    });

    // 2. Standard GA4 select_content event
    this.trackEvent('select_content', {
      content_type: 'popcorn',
      item_id: lessonId,
      item_name: expression || lessonId,
      action: actionType
    });
  },

  /**
   * Track when a user reaches the 10-lesson daily maximum study limit
   * @param {number} studyCount
   * @param {number} [maxThreshold=10]
   * @param {string} [source='next_lesson']
   */
  trackPopcornDailyLimitReached(studyCount = 10, maxThreshold = 10, source = 'next_lesson') {
    // 1. Custom GA4 event
    this.trackEvent('popcorn_daily_limit_reached', {
      study_count: studyCount,
      max_threshold: maxThreshold,
      source: source
    });

    // 2. Standard GA4 achievement / unlock event for standard reports
    this.trackEvent('unlock_achievement', {
      achievement_id: 'popcorn_daily_limit_10'
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
    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
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
    }

    // 2. Page unloading / navigating away: flush any remaining foreground duration
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      const flushOnExit = () => {
        this._flushStudyDuration();
      };

      window.addEventListener('pagehide', flushOnExit);
      window.addEventListener('beforeunload', flushOnExit);
    }
  }
};

// Auto-register to window
if (typeof window !== 'undefined') {
  window.Analytics = Analytics;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Analytics;
}
