/**
 * Storage Manager for RhyRhy English
 * Manages quiz progress, completed lessons history, and saved sentences in localStorage.
 */
const Storage = {
  KEYS: {
    PROGRESS_PREFIX: 'rhyrhy_progress_',
    HISTORY: 'rhyrhy_history',
    SAVED_SENTENCES: 'rhyrhy_saved_sentences',
    LAST_LESSON: 'rhyrhy_last_lesson',
    USER_SETTINGS: 'rhyrhy_settings',
    STORAGE_NOTICE: 'rhyrhy_storage_notice_seen',
    FIRST_SAVE_NOTICE: 'rhyrhy_first_save_notice_seen',
    LESSON_ACCESS_PREFIX: 'rhyrhy_access_',
    STUDY_TIME_PREFIX: 'rhyrhy_study_time_',
    ACTIVE_LESSON_PAGE: 'rhyrhy_active_lesson_page',
    IN_PROGRESS_PREFIX: 'rhyrhy_in_progress_',
    THEME: 'rhyrhy_theme',
    DAILY_COMPLETED_DATE: 'rhyrhy_daily_completed_date',
    POPCORN_KNOWN: 'rhyrhy_popcorn_known',
    POPCORN_STUDIED: 'rhyrhy_popcorn_studied',
    POPCORN_DAILY_STUDY: 'rhyrhy_popcorn_daily_study',
    POPCORN_SPACED_REP: 'rhyrhy_popcorn_spaced_rep',
    POPCORN_STATS: 'rhyrhy_popcorn_stats'
  },

  /**
   * Get progress for a specific lesson
   * @param {string} lessonId
   * @returns {{ completed: boolean, currentQuestionIndex: number, answeredQuestions: object }}
   */
  getProgress(lessonId) {
    try {
      const data = localStorage.getItem(this.KEYS.PROGRESS_PREFIX + lessonId);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading progress', e);
    }
    return {
      completed: false,
      currentQuestionIndex: 0,
      answeredQuestions: {}
    };
  },

  /**
   * Save progress for a specific lesson
   * @param {string} lessonId
   * @param {object} progress
   */
  saveProgress(lessonId, progress) {
    try {
      localStorage.setItem(this.KEYS.PROGRESS_PREFIX + lessonId, JSON.stringify(progress));
      this.setLastActiveLesson(lessonId);
    } catch (e) {
      console.warn('LocalStorage error saving progress', e);
    }
  },

  /**
   * Get the current active step (1, 2, 3, or 4) for a lesson
   * @param {string} lessonId
   * @returns {number}
   */
  getCurrentStep(lessonId) {
    try {
      const step = localStorage.getItem('rhyrhy_step_' + lessonId);
      if (step) {
        const num = parseInt(step, 10);
        if (num >= 1 && num <= 4) return num;
      }
    } catch (e) {
      console.warn('LocalStorage error reading current step', e);
    }
    // Fallback: If quizzes are already completed, default to at least step 2
    const prog = this.getProgress(lessonId);
    if (prog && prog.completed) return 2;
    return 1;
  },

  /**
   * Save the current active step (1, 2, 3, or 4) for a lesson
   * @param {string} lessonId
   * @param {number} stepNumber
   */
  setCurrentStep(lessonId, stepNumber) {
    try {
      localStorage.setItem('rhyrhy_step_' + lessonId, String(stepNumber));
      this.setLastActiveLesson(lessonId);
    } catch (e) {
      console.warn('LocalStorage error saving current step', e);
    }
  },

  /**
   * Increment and retrieve cumulative access count for a lesson
   * @param {string} lessonId
   * @returns {number}
   */
  incrementLessonAccessCount(lessonId) {
    try {
      const key = this.KEYS.LESSON_ACCESS_PREFIX + lessonId;
      const count = parseInt(localStorage.getItem(key) || '0', 10) + 1;
      localStorage.setItem(key, String(count));
      return count;
    } catch (e) {
      console.warn('LocalStorage error saving lesson access count', e);
      return 1;
    }
  },

  /**
   * Get cumulative access count for a lesson
   * @param {string} lessonId
   * @returns {number}
   */
  getLessonAccessCount(lessonId) {
    try {
      const key = this.KEYS.LESSON_ACCESS_PREFIX + lessonId;
      return parseInt(localStorage.getItem(key) || '0', 10);
    } catch (e) {
      return 0;
    }
  },

  /**
   * Accumulate foreground study time in seconds for a lesson
   * @param {string} lessonId
   * @param {number} seconds
   */
  recordStudyTime(lessonId, seconds) {
    try {
      if (!seconds || seconds <= 0) return;
      const key = this.KEYS.STUDY_TIME_PREFIX + lessonId;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      localStorage.setItem(key, String(current + Math.round(seconds)));
    } catch (e) {
      console.warn('LocalStorage error recording study time', e);
    }
  },

  /**
   * Get total accumulated study time in seconds for a lesson
   * @param {string} lessonId
   * @returns {number}
   */
  getStudyTime(lessonId) {
    try {
      const key = this.KEYS.STUDY_TIME_PREFIX + lessonId;
      return parseInt(localStorage.getItem(key) || '0', 10);
    } catch (e) {
      return 0;
    }
  },

  /**
   * Get user's preferred theme ('dark' or 'light')
   * Checks localStorage, falls back to system prefers-color-scheme, or defaults to 'dark'
   * @returns {'dark' | 'light'}
   */
  getTheme() {
    try {
      const saved = localStorage.getItem(this.KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch (e) {
      console.warn('LocalStorage error reading theme', e);
    }
    return 'dark';
  },

  /**
   * Set user's preferred theme
   * @param {'dark' | 'light'} theme
   */
  setTheme(theme) {
    try {
      const val = (theme === 'light') ? 'light' : 'dark';
      localStorage.setItem(this.KEYS.THEME, val);
    } catch (e) {
      console.warn('LocalStorage error saving theme', e);
    }
  },

  /**
   * Check if the first-visit storage notice has already been seen
   * @returns {boolean}
   */
  isStorageNoticeSeen() {
    try {
      return localStorage.getItem(this.KEYS.STORAGE_NOTICE) === 'true';
    } catch (e) {
      return false;
    }
  },

  /**
   * Mark the first-visit storage notice as seen
   */
  setStorageNoticeSeen() {
    try {
      localStorage.setItem(this.KEYS.STORAGE_NOTICE, 'true');
    } catch (e) {
      console.warn('LocalStorage error setting notice flag', e);
    }
  },

  /**
   * Check if the first sentence save notice has already been seen
   * @returns {boolean}
   */
  isFirstSaveNoticeSeen() {
    try {
      return localStorage.getItem(this.KEYS.FIRST_SAVE_NOTICE) === 'true';
    } catch (e) {
      return false;
    }
  },

  /**
   * Mark the first sentence save notice as seen
   */
  setFirstSaveNoticeSeen() {
    try {
      localStorage.setItem(this.KEYS.FIRST_SAVE_NOTICE, 'true');
    } catch (e) {
      console.warn('LocalStorage error setting first save notice flag', e);
    }
  },

  /**
   * Mark lesson quizzes as completed
   * @param {string} lessonId
   */
  completeQuizzes(lessonId) {
    const prog = this.getProgress(lessonId);
    prog.completed = true;
    this.saveProgress(lessonId, prog);
  },

  /**
   * Set overall lesson completion status (all 4 steps completed, including writing)
   * @param {string} lessonId
   * @param {boolean} completed
   */
  setLessonCompleted(lessonId, completed = true) {
    const prog = this.getProgress(lessonId);
    prog.lessonCompleted = completed;
    if (completed) prog.completed = true;
    this.saveProgress(lessonId, prog);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lesson-completed-updated', { detail: { lessonId, completed } }));
    }
  },

  /**
   * Check if an entire lesson (all 4 steps) is completed
   * @param {string} lessonId
   * @returns {boolean}
   */
  isLessonCompleted(lessonId) {
    const prog = this.getProgress(lessonId);
    if (prog && prog.lessonCompleted) return true;
    const history = this.getHistory();
    return history.some(h => h.lessonId === lessonId && (h.lessonCompleted || h.quizzesPassed));
  },

  /**
   * Record lesson completion in history
   * @param {string} lessonId
   * @param {object} metadata
   */
  recordLessonCompletion(lessonId, metadata = {}) {
    const history = this.getHistory();
    const existingIndex = history.findIndex(h => h.lessonId === lessonId);
    const entry = {
      lessonId,
      title: metadata.title || lessonId,
      level: metadata.level || 'Intermediate',
      completedAt: new Date().toISOString(),
      quizzesPassed: true,
      lessonCompleted: true
    };

    if (existingIndex >= 0) {
      history[existingIndex] = { ...history[existingIndex], ...entry };
    } else {
      history.unshift(entry);
    }

    try {
      localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage error saving history', e);
    }

    // Also update progress
    this.setLessonCompleted(lessonId, true);
  },

  /**
   * Check if history is unlocked (unlocked after completing all quizzes for at least one lesson)
   * @returns {boolean}
   */
  isHistoryUnlocked() {
    const history = this.getHistory();
    if (history.length > 0) return true;

    // Also check if any lesson progress has completed = true
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.KEYS.PROGRESS_PREFIX)) {
        try {
          const val = JSON.parse(localStorage.getItem(key));
          if (val && val.completed) return true;
        } catch (_) { }
      }
    }
    return false;
  },

  /**
   * Retrieve history list
   * @returns {Array}
   */
  getHistory() {
    try {
      const data = localStorage.getItem(this.KEYS.HISTORY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading history', e);
    }
    return [];
  },

  /**
   * Save a sentence to the user's sentence bank grouped by lesson
   * @param {string} lessonId
   * @param {{ id: string, en: string, kr: string, timestamp?: number }} sentence
   * @returns {boolean} true if newly added, false if already present
   */
  saveSentence(lessonId, sentence) {
    try {
      const all = this.getAllSavedSentences();
      if (!all[lessonId]) {
        all[lessonId] = [];
      }

      // Check for duplicates
      const existingIdx = all[lessonId].findIndex(s => s.id === sentence.id || s.en.trim().toLowerCase() === sentence.en.trim().toLowerCase());
      if (existingIdx !== -1) {
        all[lessonId][existingIdx] = {
          ...all[lessonId][existingIdx],
          expression: sentence.expression || all[lessonId][existingIdx].expression || '',
          speaker: sentence.speaker || all[lessonId][existingIdx].speaker || '',
          avatar: sentence.avatar || all[lessonId][existingIdx].avatar || '',
          audio: sentence.audio || all[lessonId][existingIdx].audio || ''
        };
        localStorage.setItem(this.KEYS.SAVED_SENTENCES, JSON.stringify(all));
        return false;
      }

      all[lessonId].push({
        id: sentence.id || 'sent_' + Date.now(),
        en: sentence.en,
        kr: sentence.kr,
        audio: sentence.audio || '',
        expression: sentence.expression || '',
        speaker: sentence.speaker || '',
        avatar: sentence.avatar || '',
        timestamp: sentence.timestamp || 0,
        savedAt: new Date().toISOString()
      });

      localStorage.setItem(this.KEYS.SAVED_SENTENCES, JSON.stringify(all));
      return true;
    } catch (e) {
      console.warn('LocalStorage error saving sentence', e);
      return false;
    }
  },

  /**
   * Get all saved sentences across all lessons
   * @returns {object} { [lessonId]: Array }
   */
  getAllSavedSentences() {
    try {
      const data = localStorage.getItem(this.KEYS.SAVED_SENTENCES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading saved sentences', e);
    }
    return {};
  },

  /**
   * Get saved sentences for a single lesson
   * @param {string} lessonId
   * @returns {Array}
   */
  getSavedSentences(lessonId) {
    const all = this.getAllSavedSentences();
    return all[lessonId] || [];
  },

  /**
   * Delete a saved sentence
   * @param {string} lessonId
   * @param {string} sentenceId
   */
  removeSavedSentence(lessonId, sentenceId) {
    try {
      const all = this.getAllSavedSentences();
      if (all[lessonId]) {
        all[lessonId] = all[lessonId].filter(s => s.id !== sentenceId);
        localStorage.setItem(this.KEYS.SAVED_SENTENCES, JSON.stringify(all));
      }
    } catch (e) {
      console.warn('LocalStorage error removing sentence', e);
    }
  },

  /**
   * Remove a saved sentence by matching its English text
   * @param {string} lessonId
   * @param {string} enText
   */
  removeSavedSentenceByText(lessonId, enText) {
    try {
      const all = this.getAllSavedSentences();
      if (all[lessonId]) {
        const clean = enText.trim().toLowerCase();
        all[lessonId] = all[lessonId].filter(s => s.en.trim().toLowerCase() !== clean);
        localStorage.setItem(this.KEYS.SAVED_SENTENCES, JSON.stringify(all));
      }
    } catch (e) {
      console.warn('LocalStorage error removing sentence by text', e);
    }
  },

  /**
   * Check if a sentence is saved in the bank
   * @param {string} lessonId
   * @param {string} enText
   * @returns {boolean}
   */
  isSentenceSaved(lessonId, enText) {
    if (!enText) return false;
    const clean = enText.trim().toLowerCase();
    const list = this.getSavedSentences(lessonId);
    return list.some(s => s.en.trim().toLowerCase() === clean);
  },

  /**
   * Total count of all saved sentences
   * @returns {number}
   */
  getTotalSavedSentenceCount() {
    const all = this.getAllSavedSentences();
    let count = 0;
    Object.values(all).forEach(list => {
      if (Array.isArray(list)) count += list.length;
    });
    return count;
  },

  /**
   * Track last active lesson ID
   * @param {string} lessonId
   */
  setLastActiveLesson(lessonId) {
    try {
      localStorage.setItem(this.KEYS.LAST_LESSON, lessonId);
    } catch (_) { }
  },

  /**
   * Retrieve last active lesson ID
   * @returns {string|null}
   */
  getLastActiveLesson() {
    try {
      const last = localStorage.getItem(this.KEYS.LAST_LESSON);
      if (last && last.startsWith('lesson-')) return last;

      const activePage = localStorage.getItem(this.KEYS.ACTIVE_LESSON_PAGE);
      if (activePage && activePage.startsWith('lesson-')) return activePage;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (
          key.startsWith(this.KEYS.IN_PROGRESS_PREFIX) ||
          key.startsWith(this.KEYS.PROGRESS_PREFIX) ||
          key.startsWith('rhyrhy_step_') ||
          key.startsWith(this.KEYS.LESSON_ACCESS_PREFIX)
        ) {
          const match = key.match(/lesson-\d+/);
          if (match) return match[0];
        }
      }
      return 'lesson-01';
    } catch (_) {
      return 'lesson-01';
    }
  },

  /**
   * Set the actively viewed lesson page for session resumption
   * @param {string} lessonId
   */
  setActiveLessonPage(lessonId) {
    try {
      if (lessonId) {
        localStorage.setItem(this.KEYS.ACTIVE_LESSON_PAGE, lessonId);
      }
    } catch (_) { }
  },

  /**
   * Get the actively viewed lesson page
   * @returns {string|null}
   */
  getActiveLessonPage() {
    try {
      return localStorage.getItem(this.KEYS.ACTIVE_LESSON_PAGE) || null;
    } catch (_) {
      return null;
    }
  },

  /**
   * Clear the active lesson page (called on navigating to home/catalog)
   */
  clearActiveLessonPage() {
    try {
      localStorage.removeItem(this.KEYS.ACTIVE_LESSON_PAGE);
    } catch (_) { }
  },

  /**
   * Mark a lesson as in progress
   * @param {string} lessonId
   * @param {boolean} inProgress
   */
  setLessonInProgress(lessonId, inProgress = true) {
    try {
      if (inProgress) {
        localStorage.setItem(this.KEYS.IN_PROGRESS_PREFIX + lessonId, 'true');
      } else {
        localStorage.removeItem(this.KEYS.IN_PROGRESS_PREFIX + lessonId);
      }
    } catch (_) { }
  },

  /**
   * Check if a lesson is in progress (started quizzes or steps 1-3, but not completed)
   * @param {string} lessonId
   * @returns {boolean}
   */
  isLessonInProgress(lessonId) {
    if (this.isLessonCompleted(lessonId)) return false;
    try {
      if (localStorage.getItem(this.KEYS.IN_PROGRESS_PREFIX + lessonId) === 'true') {
        return true;
      }
      const step = localStorage.getItem('rhyrhy_step_' + lessonId);
      if (step !== null) return true;

      const progData = localStorage.getItem(this.KEYS.PROGRESS_PREFIX + lessonId);
      if (progData) {
        const prog = JSON.parse(progData);
        if (prog && (prog.completed || prog.currentQuestionIndex > 0 || (prog.answeredQuestions && Object.keys(prog.answeredQuestions).length > 0))) {
          return true;
        }
      }

      if (this.getLessonAccessCount(lessonId) > 0) return true;
      if (this.getStudyTime(lessonId) > 0) return true;
    } catch (_) { }
    return false;
  },

  /**
   * Get the three-state progress status for a lesson:
   * - 'completed': Triggered by clicking either button on Step 4
   * - 'in-progress': Started quizzes or steps 1-3, but not completed
   * - 'not-started': Default state, neither completed nor in progress
   * @param {string} lessonId
   * @returns {'completed' | 'in-progress' | 'not-started'}
   */
  getLessonState(lessonId) {
    if (this.isLessonCompleted(lessonId)) {
      return 'completed';
    }
    if (this.isLessonInProgress(lessonId)) {
      return 'in-progress';
    }
    return 'not-started';
  },

  /**
   * Check if user has started or played any quiz or video
   * @returns {boolean}
   */
  hasAnyProgress() {
    try {
      const history = this.getHistory();
      if (Array.isArray(history) && history.length > 0) return true;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.KEYS.PROGRESS_PREFIX)) {
          const val = JSON.parse(localStorage.getItem(key));
          if (val && (val.completed || val.currentQuestionIndex > 0 || (val.answeredQuestions && Object.keys(val.answeredQuestions).length > 0))) {
            return true;
          }
        }
      }
    } catch (_) { }
    return false;
  },

  /**
   * Check if user has ever studied or visited any lesson
   * @returns {boolean}
   */
  hasEverStudied() {
    if (this.hasAnyProgress()) return true;
    try {
      if (this.getTotalSavedSentenceCount() > 0) return true;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (
          key.startsWith(this.KEYS.PROGRESS_PREFIX) ||
          key.startsWith(this.KEYS.IN_PROGRESS_PREFIX) ||
          key.startsWith('rhyrhy_step_') ||
          key.startsWith(this.KEYS.LESSON_ACCESS_PREFIX) ||
          key.startsWith(this.KEYS.STUDY_TIME_PREFIX) ||
          key === this.KEYS.LAST_LESSON ||
          key === this.KEYS.ACTIVE_LESSON_PAGE
        ) {
          const val = localStorage.getItem(key);
          if (val && val !== 'null' && val !== 'undefined') {
            return true;
          }
        }
      }
    } catch (_) { }
    return false;
  },

  /**
   * Get the date string (YYYY-MM-DD) on which the daily phrase was last completed
   * @returns {string|null}
   */
  getDailyPhraseCompletedDate() {
    try {
      return localStorage.getItem(this.KEYS.DAILY_COMPLETED_DATE) || null;
    } catch (e) {
      console.warn('LocalStorage error reading daily phrase completion date', e);
      return null;
    }
  },

  /**
   * Check if today's daily phrase is already completed
   * @param {Date} [nowDate] optional date to test with
   * @returns {boolean}
   */
  isDailyPhraseCompletedToday(nowDate) {
    const today = (nowDate || new Date()).toISOString().slice(0, 10);
    return this.getDailyPhraseCompletedDate() === today;
  },

  /**
   * Mark today's daily phrase as completed
   * @param {string} [dateStr] optional date string YYYY-MM-DD
   */
  setDailyPhraseCompletedToday(dateStr) {
    try {
      const today = dateStr || new Date().toISOString().slice(0, 10);
      localStorage.setItem(this.KEYS.DAILY_COMPLETED_DATE, today);
    } catch (e) {
      console.warn('LocalStorage error saving daily phrase completion date', e);
    }
  },

  /**
   * Reset daily phrase completion (useful for testing and admin resets)
   */
  resetDailyPhraseCompletion() {
    try {
      localStorage.removeItem(this.KEYS.DAILY_COMPLETED_DATE);
    } catch (_) { }
  },

  /**
   * Get compact Spaced Repetition data map for all Popcorn quick lessons (Issue #47)
   * Scaling optimized: Compact dictionary storing { [id]: { s: streak, d: dueTimestamp, p: permanent(1|0) } }
   * Consumes < 50KB for 1,000+ lessons with sub-millisecond retrieval.
   * @returns {object}
   */
  getPopcornSpacedRep() {
    try {
      const data = localStorage.getItem(this.KEYS.POPCORN_SPACED_REP);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading popcorn spaced rep', e);
    }
    return {};
  },

  /**
   * Save compact Spaced Repetition data map
   * @param {object} data
   */
  savePopcornSpacedRep(data) {
    try {
      localStorage.setItem(this.KEYS.POPCORN_SPACED_REP, JSON.stringify(data || {}));
    } catch (e) {
      console.warn('LocalStorage error saving popcorn spaced rep', e);
    }
  },

  /**
   * Handle "알아요" (Know/Skip) button action (Issue #47):
   * - 1st click: reschedules the lesson to appear again after 2 months (60 days). Streak = 1.
   * - 2nd consecutive click: permanently stops displaying that quick lesson (p: 1, streak = 2).
   * @param {string} lessonId
   * @returns {{ isPermanent: boolean, streak: number, due: number }}
   */
  recordPopcornKnow(lessonId) {
    if (!lessonId) return { isPermanent: false, streak: 0, due: 0 };
    const rep = this.getPopcornSpacedRep();
    const entry = rep[lessonId] || { s: 0, d: 0, p: 0 };

    if (entry.s >= 1) {
      // Second consecutive "알아요" click -> Permanently stop displaying
      entry.s = 2;
      entry.p = 1;
      entry.d = 0;
      rep[lessonId] = entry;
      this.savePopcornSpacedRep(rep);
      this.setPopcornKnown(lessonId, true);
      return { isPermanent: true, streak: 2, due: 0 };
    } else {
      // First "알아요" click -> Reschedule after 2 months (~60 days)
      const twoMonthsMs = 60 * 24 * 60 * 60 * 1000;
      const due = Date.now() + twoMonthsMs;
      entry.s = 1;
      entry.p = 0;
      entry.d = due;
      rep[lessonId] = entry;
      this.savePopcornSpacedRep(rep);
      return { isPermanent: false, streak: 1, due };
    }
  },

  /**
   * Handle "몰라요" (Don't know/Learn) button action (Issue #47):
   * - Clicking "몰라요" on the second play resets the progress (streak = 0).
   * @param {string} lessonId
   * @returns {{ streak: number }}
   */
  recordPopcornLearn(lessonId) {
    if (!lessonId) return { streak: 0 };
    const rep = this.getPopcornSpacedRep();
    const entry = rep[lessonId] || { s: 0, d: 0, p: 0 };
    if (entry.s > 0) {
      entry.s = 0;
    }
    entry.p = 0;
    rep[lessonId] = entry;
    this.savePopcornSpacedRep(rep);
    return { streak: 0 };
  },

  /**
   * Mark lesson as studied via "한국어 번역" or navigating to next lesson (Issue #47):
   * Sets interval to 14 days (reduced from previous 30 days)
   * @param {string} lessonId
   * @param {number} [intervalDays=14]
   * @param {number} [timestamp=Date.now()]
   */
  recordPopcornStudied(lessonId, intervalDays = 14, timestamp = Date.now()) {
    if (!lessonId) return;
    const rep = this.getPopcornSpacedRep();
    const entry = rep[lessonId] || { s: 0, d: 0, p: 0 };
    entry.s = 0; // Studied: reset skip streak
    entry.d = timestamp + (intervalDays * 24 * 60 * 60 * 1000);
    rep[lessonId] = entry;
    this.savePopcornSpacedRep(rep);

    // Sync legacy storage
    this.setPopcornStudied(lessonId, timestamp);
    return entry;
  },

  /**
   * Check if a popcorn lesson is permanently skipped as already known ("이미 알아요")
   * @param {string} lessonId
   * @returns {boolean}
   */
  isPopcornKnown(lessonId) {
    try {
      const rep = this.getPopcornSpacedRep();
      if (rep[lessonId] && rep[lessonId].p === 1) return true;

      const data = localStorage.getItem(this.KEYS.POPCORN_KNOWN);
      if (data) {
        const obj = JSON.parse(data);
        return Boolean(obj[lessonId]);
      }
    } catch (e) {
      console.warn('LocalStorage error reading popcorn known status', e);
    }
    return false;
  },

  /**
   * Mark a popcorn lesson as permanently known ("이미 알아요")
   * @param {string} lessonId
   * @param {boolean} [isKnown=true]
   */
  setPopcornKnown(lessonId, isKnown = true) {
    try {
      const rep = this.getPopcornSpacedRep();
      if (isKnown) {
        rep[lessonId] = { s: 2, d: 0, p: 1 };
      } else {
        if (rep[lessonId]) {
          rep[lessonId].p = 0;
          rep[lessonId].s = 0;
        }
      }
      this.savePopcornSpacedRep(rep);

      const data = localStorage.getItem(this.KEYS.POPCORN_KNOWN);
      const obj = data ? JSON.parse(data) : {};
      if (isKnown) {
        obj[lessonId] = true;
      } else {
        delete obj[lessonId];
      }
      localStorage.setItem(this.KEYS.POPCORN_KNOWN, JSON.stringify(obj));
    } catch (e) {
      console.warn('LocalStorage error saving popcorn known status', e);
    }
  },

  /**
   * Check if a popcorn lesson was studied or scheduled recently and is in cooldown
   * Default interval for studied lessons is 14 days (Issue #47)
   * @param {string} lessonId
   * @param {number} [cooldownDays=14]
   * @returns {boolean}
   */
  isPopcornInCooldown(lessonId, cooldownDays = 14) {
    try {
      if (this.isPopcornKnown(lessonId)) return false;

      const rep = this.getPopcornSpacedRep();
      if (rep[lessonId] && typeof rep[lessonId].d === 'number' && rep[lessonId].d > 0) {
        return Date.now() < rep[lessonId].d;
      }

      // Legacy fallback
      const data = localStorage.getItem(this.KEYS.POPCORN_STUDIED);
      if (data) {
        const obj = JSON.parse(data);
        const studiedTimestamp = obj[lessonId];
        if (studiedTimestamp) {
          const now = Date.now();
          const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
          return (now - studiedTimestamp) < cooldownMs;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error checking popcorn cooldown', e);
    }
    return false;
  },

  /**
   * Mark a popcorn lesson as studied with current timestamp
   * @param {string} lessonId
   * @param {number} [timestamp=Date.now()]
   */
  setPopcornStudied(lessonId, timestamp = Date.now()) {
    try {
      const data = localStorage.getItem(this.KEYS.POPCORN_STUDIED);
      const obj = data ? JSON.parse(data) : {};
      obj[lessonId] = timestamp;
      localStorage.setItem(this.KEYS.POPCORN_STUDIED, JSON.stringify(obj));
    } catch (e) {
      console.warn('LocalStorage error setting popcorn studied status', e);
    }
  },

  /**
   * Get available popcorn lessons that are neither permanently known nor in cooldown
   * Performance optimized: Loads spaced rep dictionary once for O(1) in-memory lookups
   * @param {Array<object>} metadataList
   * @param {number} [cooldownDays=14]
   * @returns {Array<object>}
   */
  getAvailablePopcornLessons(metadataList, cooldownDays = 14) {
    if (!Array.isArray(metadataList)) return [];
    const rep = this.getPopcornSpacedRep();
    const now = Date.now();
    const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;

    return metadataList.filter(item => {
      if (!item || !item.id) return false;
      const entry = rep[item.id];
      if (entry) {
        if (entry.p === 1) return false;
        if (typeof entry.d === 'number' && entry.d > 0 && now < entry.d) return false;
      }

      // Check legacy if not present in rep
      if (!entry) {
        if (this.isPopcornKnown(item.id)) return false;
        if (this.isPopcornInCooldown(item.id, cooldownDays)) return false;
      }
      return true;
    });
  },

  /**
   * Record action statistics for skip-to-learn ratio measurement (Issue #47)
   * @param {string} lessonId
   * @param {string} expression
   * @param {'skip'|'learn'} action
   */
  recordPopcornAction(lessonId, expression = '', action = 'learn') {
    if (!lessonId) return;
    try {
      const data = localStorage.getItem(this.KEYS.POPCORN_STATS);
      const stats = data ? JSON.parse(data) : {};
      stats[lessonId] = stats[lessonId] || { expression: expression || lessonId, skipCount: 0, learnCount: 0 };
      if (action === 'skip') {
        stats[lessonId].skipCount = (stats[lessonId].skipCount || 0) + 1;
      } else {
        stats[lessonId].learnCount = (stats[lessonId].learnCount || 0) + 1;
      }
      localStorage.setItem(this.KEYS.POPCORN_STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('LocalStorage error recording popcorn action stat', e);
    }
  },

  /**
   * Get all popcorn statistics
   * @returns {object}
   */
  getPopcornStats() {
    try {
      const data = localStorage.getItem(this.KEYS.POPCORN_STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('LocalStorage error reading popcorn stats', e);
    }
    return {};
  },

  /**
   * Get Top N quick lessons where users clicked "Learn" due to unfamiliarity (Issue #47)
   * @param {number} [limit=10]
   * @param {Array<object>} [metadataList]
   * @returns {Array<object>}
   */
  getTopUnfamiliarLessons(limit = 10, metadataList = []) {
    const stats = this.getPopcornStats();
    const list = (metadataList && metadataList.length > 0) 
      ? metadataList 
      : Object.keys(stats).map(id => ({ id, expression: stats[id].expression }));
    
    const evaluated = list.map(item => {
      const stat = stats[item.id] || {};
      const skipCount = stat.skipCount || 0;
      const learnCount = stat.learnCount || 0;
      const total = skipCount + learnCount;
      const skipToLearnRatio = learnCount > 0 ? Number((skipCount / learnCount).toFixed(2)) : (skipCount > 0 ? Infinity : 0);
      const unfamiliarityRate = total > 0 ? Number(((learnCount / total) * 100).toFixed(1)) : 0;
      return {
        id: item.id,
        expression: item.expression || stat.expression || item.id,
        skipCount,
        learnCount,
        total,
        skipToLearnRatio,
        unfamiliarityRate
      };
    });

    evaluated.sort((a, b) => {
      if (b.learnCount !== a.learnCount) return b.learnCount - a.learnCount;
      return b.unfamiliarityRate - a.unfamiliarityRate;
    });

    return evaluated.slice(0, limit).map((entry, idx) => ({
      rank: idx + 1,
      ...entry
    }));
  },

  /**
   * Get formatted local date string (YYYY-MM-DD)
   * @param {Date} [nowDate]
   * @returns {string}
   */
  getLocalDateString(nowDate) {
    const d = nowDate || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Get count of popcorn lessons studied today
   * @param {Date} [nowDate]
   * @returns {number}
   */
  getPopcornDailyStudyCount(nowDate) {
    try {
      const today = this.getLocalDateString(nowDate);
      const data = localStorage.getItem(this.KEYS.POPCORN_DAILY_STUDY);
      if (data) {
        const obj = JSON.parse(data);
        if (obj && obj.date === today && typeof obj.count === 'number') {
          return obj.count;
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading popcorn daily study count', e);
    }
    return 0;
  },

  /**
   * Increment today's popcorn study count by 1
   * @param {Date} [nowDate]
   * @returns {number} new count
   */
  incrementPopcornDailyStudyCount(nowDate) {
    try {
      const today = this.getLocalDateString(nowDate);
      const current = this.getPopcornDailyStudyCount(nowDate);
      const nextCount = current + 1;
      localStorage.setItem(this.KEYS.POPCORN_DAILY_STUDY, JSON.stringify({
        date: today,
        count: nextCount
      }));
      return nextCount;
    } catch (e) {
      console.warn('LocalStorage error incrementing popcorn daily study count', e);
      return 1;
    }
  },

  /**
   * Check if user has reached the maximum daily limit of popcorn quick lessons (default: 10)
   * @param {number} [maxCount=10]
   * @param {Date} [nowDate]
   * @returns {boolean}
   */
  isPopcornDailyLimitReached(maxCount = 10, nowDate) {
    return this.getPopcornDailyStudyCount(nowDate) >= maxCount;
  },

  /**
   * Reset popcorn daily study count (useful for testing or daily reset)
   */
  resetPopcornDailyStudyCount() {
    try {
      localStorage.removeItem(this.KEYS.POPCORN_DAILY_STUDY);
    } catch (_) { }
  },

  /**
   * Reset all popcorn preferences, cooldowns, and daily limits (utility for tests and reset settings)
   */
  resetPopcornPreferences() {
    try {
      localStorage.removeItem(this.KEYS.POPCORN_KNOWN);
      localStorage.removeItem(this.KEYS.POPCORN_STUDIED);
      localStorage.removeItem(this.KEYS.POPCORN_DAILY_STUDY);
      localStorage.removeItem(this.KEYS.POPCORN_SPACED_REP);
      localStorage.removeItem(this.KEYS.POPCORN_STATS);
    } catch (_) { }
  },

  /**
   * Deterministically get today's phrase from the given list
   * @param {Array} phrases
   * @param {Date} [nowDate]
   * @returns {object|null}
   */
  getTodayDailyPhrase(phrases, nowDate) {
    const list = phrases || (typeof DAILY_PHRASES !== 'undefined' ? DAILY_PHRASES : []);
    if (!list || list.length === 0) return null;

    const d = nowDate || new Date();
    // Deterministic day index calculation based on UTC day count
    const daysSinceEpoch = Math.floor(d.getTime() / 86400000);
    const index = Math.abs(daysSinceEpoch) % list.length;
    return list[index];
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}

