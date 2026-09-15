const { test, expect } = require('@playwright/test');
const {
  LessonPublicationStatus,
  LessonProgressState,
  LessonStep,
  LessonStatusHelper,
  LessonStatus
} = require('../js/lesson-status.js');

test.describe('Lesson Status & State Static Enums (js/lesson-status.js)', () => {

  test('LessonPublicationStatus contains frozen constants', () => {
    expect(LessonPublicationStatus.PUBLISHED).toBe('published');
    expect(LessonPublicationStatus.COMING_SOON).toBe('coming-soon');
    expect(LessonPublicationStatus.HIDDEN).toBe('hidden');

    expect(Object.isFrozen(LessonPublicationStatus)).toBe(true);
    expect(() => {
      LessonPublicationStatus.NEW_PROP = 'fail';
    }).toThrow();
  });

  test('LessonProgressState contains frozen constants', () => {
    expect(LessonProgressState.NOT_STARTED).toBe('not-started');
    expect(LessonProgressState.IN_PROGRESS).toBe('in-progress');
    expect(LessonProgressState.COMPLETED).toBe('completed');

    expect(Object.isFrozen(LessonProgressState)).toBe(true);
  });

  test('LessonStep contains the sequential interactive steps and optional deep-dive', () => {
    expect(LessonStep.QUIZ).toBe(1);
    expect(LessonStep.KEY_SENTENCES).toBe(2);
    expect(LessonStep.DEEP_DIVE).toBe('deep-dive');
    expect(LessonStep.FULL_VIDEO).toBe(3);
    expect(LessonStep.WRITING).toBe(4);

    expect(Object.isFrozen(LessonStep)).toBe(true);
  });

  test('LessonStatusHelper accurately evaluates publication status', () => {
    // isPublished
    expect(LessonStatusHelper.isPublished('published')).toBe(true);
    expect(LessonStatusHelper.isPublished(undefined)).toBe(true);
    expect(LessonStatusHelper.isPublished('')).toBe(true);
    expect(LessonStatusHelper.isPublished(null)).toBe(true);
    expect(LessonStatusHelper.isPublished('coming-soon')).toBe(false);
    expect(LessonStatusHelper.isPublished('hidden')).toBe(false);

    // isComingSoon
    expect(LessonStatusHelper.isComingSoon('coming-soon')).toBe(true);
    expect(LessonStatusHelper.isComingSoon('published')).toBe(false);
    expect(LessonStatusHelper.isComingSoon(undefined)).toBe(false);

    // isHidden
    expect(LessonStatusHelper.isHidden('hidden')).toBe(true);
    expect(LessonStatusHelper.isHidden('published')).toBe(false);
    expect(LessonStatusHelper.isHidden('coming-soon')).toBe(false);
    expect(LessonStatusHelper.isHidden(undefined)).toBe(false);
  });

  test('LessonStatus exports comprehensive unified namespace', () => {
    expect(LessonStatus.Publication).toBe(LessonPublicationStatus);
    expect(LessonStatus.Progress).toBe(LessonProgressState);
    expect(LessonStatus.Step).toBe(LessonStep);
    expect(LessonStatus.Helper).toBe(LessonStatusHelper);
    expect(LessonStatus.PUBLISHED).toBe('published');
    expect(LessonStatus.COMING_SOON).toBe('coming-soon');
    expect(LessonStatus.HIDDEN).toBe('hidden');
  });

  test('LessonStatus is available on window in browser environment', async ({ page }) => {
    await page.goto('/lessons.html');

    const browserStatus = await page.evaluate(() => {
      return {
        hasGlobalStatus: typeof window.LessonStatus !== 'undefined',
        hasPubStatus: typeof window.LessonPublicationStatus !== 'undefined',
        hasProgressState: typeof window.LessonProgressState !== 'undefined',
        hasStep: typeof window.LessonStep !== 'undefined',
        hasHelper: typeof window.LessonStatusHelper !== 'undefined',
        published: window.LessonPublicationStatus.PUBLISHED,
        comingSoon: window.LessonPublicationStatus.COMING_SOON,
        hidden: window.LessonPublicationStatus.HIDDEN,
        isPublishedDefault: window.LessonStatusHelper.isPublished(undefined),
        isPublishedExplicit: window.LessonStatusHelper.isPublished('published'),
        isComingSoon: window.LessonStatusHelper.isComingSoon('coming-soon')
      };
    });

    expect(browserStatus.hasGlobalStatus).toBe(true);
    expect(browserStatus.hasPubStatus).toBe(true);
    expect(browserStatus.hasProgressState).toBe(true);
    expect(browserStatus.hasStep).toBe(true);
    expect(browserStatus.hasHelper).toBe(true);
    expect(browserStatus.published).toBe('published');
    expect(browserStatus.comingSoon).toBe('coming-soon');
    expect(browserStatus.hidden).toBe('hidden');
    expect(browserStatus.isPublishedDefault).toBe(true);
    expect(browserStatus.isPublishedExplicit).toBe(true);
    expect(browserStatus.isComingSoon).toBe(true);
  });

});
