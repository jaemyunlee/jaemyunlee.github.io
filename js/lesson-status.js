/**
 * RhyRhy English - Lesson Status & State Constants (Enums)
 * 
 * Centralized enumerations and helpers for:
 * 1. LessonPublicationStatus: Catalog & metadata lifecycle ('published', 'coming-soon', 'hidden')
 * 2. LessonProgressState: Learner study progress tracked in localStorage ('not-started', 'in-progress', 'completed')
 * 3. LessonStep: The 4 sequential steps within an interactive lesson
 */

const LessonPublicationStatus = Object.freeze({
  PUBLISHED: 'published',
  COMING_SOON: 'coming-soon',
  HIDDEN: 'hidden'
});

const LessonProgressState = Object.freeze({
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
});

const LessonStep = Object.freeze({
  QUIZ: 1,
  KEY_SENTENCES: 2,
  FULL_VIDEO: 3,
  WRITING: 4
});

const LessonStatusHelper = Object.freeze({
  isPublished(status) {
    return !status || status === LessonPublicationStatus.PUBLISHED;
  },
  isComingSoon(status) {
    return status === LessonPublicationStatus.COMING_SOON;
  },
  isHidden(status) {
    return status === LessonPublicationStatus.HIDDEN;
  }
});

// Universal export (Browser and Node.js / CommonJS)
if (typeof window !== 'undefined') {
  window.LessonPublicationStatus = LessonPublicationStatus;
  window.LessonProgressState = LessonProgressState;
  window.LessonStep = LessonStep;
  window.LessonStatusHelper = LessonStatusHelper;
  // Combined namespace
  window.LessonStatus = {
    Publication: LessonPublicationStatus,
    Progress: LessonProgressState,
    Step: LessonStep,
    ...LessonPublicationStatus,
    Helper: LessonStatusHelper
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LessonPublicationStatus,
    LessonProgressState,
    LessonStep,
    LessonStatusHelper,
    LessonStatus: {
      Publication: LessonPublicationStatus,
      Progress: LessonProgressState,
      Step: LessonStep,
      ...LessonPublicationStatus,
      Helper: LessonStatusHelper
    }
  };
}
