const { test, expect } = require('@playwright/test');

test.describe('Lesson 02 Scaffolding & Integration', () => {

  test('Lesson 02 page loads and displays header badges and 4-step navigation tabs', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 02');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Step navigation tabs
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');
  });

  test('Lesson 02 loads all 19 quizzes with 70% multiple-choice, 20% fill-in-the-blank, and 10% listening', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Wait for quiz container to render first question
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible({ timeout: 5000 });

    // Inspect quizzes loaded in window/App/commentManager
    const quizDistribution = await page.evaluate(async () => {
      const res = await fetch('./quiz.md');
      const text = await res.text();
      const quizzes = window.MarkdownQuizParser.parse(text);
      const counts = { 'multiple-choice': 0, 'fill-in-the-blank': 0, 'listening': 0 };
      quizzes.forEach(q => {
        counts[q.type] = (counts[q.type] || 0) + 1;
      });
      return { total: quizzes.length, counts, sampleQ1: quizzes[0], sampleQ5: quizzes[4], sampleQ15: quizzes[14], sampleQ18: quizzes[17] };
    });

    expect(quizDistribution.total).toBe(19);
    expect(quizDistribution.counts['multiple-choice']).toBe(14); // ~73.7% (70%)
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(3);  // ~15.8% (20%)
    expect(quizDistribution.counts['listening']).toBe(2);          // ~10.5% (10%)

    // Check sample multiple choice
    expect(quizDistribution.sampleQ1.answer).toBe('property');
    expect(quizDistribution.sampleQ1.options).toContain('property');

    // Check newly added Q5 multiple choice
    expect(quizDistribution.sampleQ5.answer).toBe('passed');
    expect(quizDistribution.sampleQ5.options).toContain('passed');

    // Check sample fill-in-the-blank
    expect(quizDistribution.sampleQ15.answer).toBe('moldy');

    // Check sample listening
    expect(quizDistribution.sampleQ18.answer).toBe('mining');
    expect(quizDistribution.sampleQ18.audio).toContain('mining equipment');
  });

  test('Step navigation switches between Step 1, Step 2, Step 3, and Step 4', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Switch to Step 2 (핵심 문장)
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');

    // Verify review sentence drawer cards exist
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards.first()).toBeVisible({ timeout: 5000 });
    const count = await sentenceCards.count();
    expect(count).toBe(19);

    // Switch to Step 3 (전체 영상)
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    await tab3.click();

    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');

    // Verify interactive script has all 103 lines
    const scriptCards = page.locator('.script-sentence-card');
    await expect(scriptCards.first()).toBeVisible({ timeout: 5000 });
    const scriptCount = await scriptCards.count();
    expect(scriptCount).toBe(103);

    // Switch to Step 4 (영작하기)
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await tab4.click();

    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 4: 영작하기');
  });

  test('Catalog (lessons.html) and Homepage (index.html) display Lesson 02 card', async ({ page }) => {
    // Check lessons catalog
    await page.goto('/lessons.html');
    const lesson02Card = page.locator('#card-lesson-02');
    await expect(lesson02Card).toBeVisible({ timeout: 5000 });
    await expect(lesson02Card).toContainText('웨인 삼촌의 산골 오두막 이야기');
    await expect(lesson02Card).toContainText('5:48');
    await expect(lesson02Card).toContainText('19 퀴즈');

    // Check home page latest lessons
    await page.goto('/index.html');
    const homeLesson02 = page.locator('#card-lesson-02');
    await expect(homeLesson02).toBeVisible({ timeout: 5000 });
    await expect(homeLesson02).toContainText('웨인 삼촌의 산골 오두막 이야기');
  });

  test('SavedAudioPlayer resolves audio URLs for Lesson 02', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    const audioUrl = await page.evaluate(() => {
      const item = {
        lessonId: 'lesson-02',
        en: 'There was nothing here on the property.',
        audio: 'audio/There was nothing here on the property..wav'
      };
      return window.App.savedPlayer._resolveAudioUrl(item, window.App._getBasePath());
    });

    expect(audioUrl).toContain('lessons/lesson-02/audio/There%20was%20nothing%20here%20on%20the%20property..wav');
  });

});
