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
    FIRST_SAVE_NOTICE: 'rhyrhy_first_save_notice_seen'
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
      quizzesPassed: true
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
      const exists = all[lessonId].some(s => s.en.trim().toLowerCase() === sentence.en.trim().toLowerCase());
      if (exists) return false;

      all[lessonId].push({
        id: sentence.id || 'sent_' + Date.now(),
        en: sentence.en,
        kr: sentence.kr,
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
      return localStorage.getItem(this.KEYS.LAST_LESSON) || 'lesson-01';
    } catch (_) {
      return 'lesson-01';
    }
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
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
}

