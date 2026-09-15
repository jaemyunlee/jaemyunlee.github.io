const { test, expect } = require('@playwright/test');

test.describe('Lesson 03 Scaffolding & Integration', () => {

  test('Lesson 03 page loads and displays header badges and 4-step navigation tabs', async ({ page }) => {
    await page.goto('/lessons/lesson-03/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 03');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Step navigation tabs: all 4 steps active and enabled in published mode
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');
  });

  test('Lesson 03 loads all 13 quizzes with multiple-choice, fill-in-the-blank, and listening', async ({ page }) => {
    await page.goto('/lessons/lesson-03/index.html');

    // Wait for quiz container to render first question
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible({ timeout: 5000 });

    const quizDistribution = await page.evaluate(async () => {
      const parser = window.MarkdownQuizParser;
      const quizzes = await parser.loadFromUrl('./quiz.md');
      const counts = { 'multiple-choice': 0, 'fill-in-the-blank': 0, 'listening': 0 };
      quizzes.forEach(q => counts[q.type] = (counts[q.type] || 0) + 1);
      return {
        total: quizzes.length,
        counts: counts,
        sampleQ1: quizzes[0],
        sampleQ6: quizzes[5],
        sampleQ8: quizzes[7],
        sampleQ9: quizzes[8],
        sampleQ10: quizzes[9],
        sampleQ12: quizzes[11],
        sampleQ13: quizzes[12]
      };
    });

    expect(quizDistribution.total).toBe(13);
    expect(quizDistribution.counts['multiple-choice']).toBe(9); // ~69.2% (~70%)
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(3);  // ~23.1% (~20%)
    expect(quizDistribution.counts['listening']).toBe(1);          // ~7.7% (~10%)

    // Check sample multiple choice
    expect(quizDistribution.sampleQ1.answer).toBe('strong-willed');
    expect(quizDistribution.sampleQ1.options).toContain('strong-willed');

    // Check Q8 is multiple-choice
    expect(quizDistribution.sampleQ8.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ8.answer).toBe('leash');
    expect(quizDistribution.sampleQ8.options).toContain('leash');

    // Check Q9 is fill-in-the-blank
    expect(quizDistribution.sampleQ9.type).toBe('fill-in-the-blank');
    expect(quizDistribution.sampleQ9.answer).toBe('stubborn');

    // Check Q12 is multiple-choice
    expect(quizDistribution.sampleQ12.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ12.answer).toBe('going off');
    expect(quizDistribution.sampleQ12.options).toContain('going off');

    // Check sample fill-in-the-blank
    expect(quizDistribution.sampleQ6.answer).toBe('ended up');

    // Check sample listening
    expect(quizDistribution.sampleQ10.answer).toBe('diapers');

    // Check last quiz Q13 is fill-in-the-blank
    expect(quizDistribution.sampleQ13.type).toBe('fill-in-the-blank');
    expect(quizDistribution.sampleQ13.answer).toBe('son in law');
  });

  test('Published status displays all 4 steps with Pati avatar, full video, and writing unlocked', async ({ page }) => {
    await page.goto('/lessons/lesson-03/index.html');

    // Step 1 is active initially
    const quizSection = page.locator('#quiz-section');
    await expect(quizSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 1: 퀴즈');

    // Switch to Step 2 (핵심 문장)
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');

    // Verify review sentence drawer cards exist and use Pati avatar
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards.first()).toBeVisible({ timeout: 5000 });
    const count = await sentenceCards.count();
    expect(count).toBe(13);

    // Verify avatar is pati.jpeg
    const avatarImg = sentenceCards.first().locator('.sentence-speaker-avatar');
    await expect(avatarImg).toBeVisible();
    const avatarSrc = await avatarImg.getAttribute('src');
    expect(avatarSrc).toContain('pati.jpeg');
    const avatarAlt = await avatarImg.getAttribute('alt');
    expect(avatarAlt).toBe('Pati');

    // Verify completion card shows full video transition button
    const completeCard = page.locator('#step2-complete-card');
    await expect(completeCard).toContainText('2단계 핵심 문장 완료');
    const gotoStep3Btn = completeCard.locator('#btn-goto-step3');
    await expect(gotoStep3Btn).toBeVisible();

    // Verify Step 3 and Step 4 tabs are enabled and unlocked
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();

    // Navigate to Step 3
    await tab3.click();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');
    await expect(page.locator('#video-section')).toBeVisible();

    // Navigate to Step 4
    await tab4.click();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 4: 영작하기');
    await expect(page.locator('#reflection-section')).toBeVisible();
  });

  test('Catalog (lessons.html) and Homepage (index.html) display Lesson 03 card with Published status', async ({ page }) => {
    // Check lessons catalog
    await page.goto('/lessons.html');
    const lesson03Card = page.locator('#card-lesson-03');
    await expect(lesson03Card).toBeVisible({ timeout: 5000 });
    await expect(lesson03Card).toContainText('장모님이 기억하는 켈리의 어린 시절');
    await expect(lesson03Card).toContainText('3:18');
    await expect(lesson03Card).toContainText('13 퀴즈');

    // Verify published (not coming-soon)
    await expect(lesson03Card).not.toHaveClass(/coming-soon/);
    const notStartedBadge = lesson03Card.locator('.badge-not-started');
    await expect(notStartedBadge).toBeVisible();
    const actionBtn = lesson03Card.locator('.lesson-card-btn');
    await expect(actionBtn).toHaveClass(/btn-primary/);
    await expect(actionBtn).toContainText('학습 시작하기');

    // Check in-progress state displays "이어서 학습하기"
    await page.evaluate(() => {
      localStorage.setItem('rhyrhy_step_lesson-03', '2');
    });
    await page.reload();
    const actionBtnInProgress = page.locator('#card-lesson-03 .lesson-card-btn');
    await expect(actionBtnInProgress).toContainText('이어서 학습하기');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_step_lesson-03');
    });

    // Check home page latest lessons
    await page.goto('/index.html');
    const homeLesson03 = page.locator('#card-lesson-03');
    await expect(homeLesson03).toBeVisible({ timeout: 5000 });
    await expect(homeLesson03).toContainText('장모님이 기억하는 켈리의 어린 시절');
    await expect(homeLesson03).not.toHaveClass(/coming-soon/);
    const homeActionBtn = homeLesson03.locator('.lesson-card-btn');
    await expect(homeActionBtn).toHaveClass(/btn-primary/);
    await expect(homeActionBtn).toContainText('학습 시작하기');
  });

  test('SavedAudioPlayer resolves audio URLs for Lesson 03', async ({ page }) => {
    await page.goto('/lessons/lesson-03/index.html');

    const audioUrl = await page.evaluate(() => {
      const item = {
        lessonId: 'lesson-03',
        en: 'Kelly is a very strong-willed person.',
        audio: 'audio/Kelly is a very strong-willed person..wav'
      };
      return window.App.savedPlayer._resolveAudioUrl(item, window.App._getBasePath());
    });

    expect(audioUrl).toContain('lessons/lesson-03/audio/Kelly%20is%20a%20very%20strong-willed%20person..wav');
  });

  test('Header and tabs maintain high contrast in both Dark and Light modes', async ({ page }) => {
    await page.goto('/lessons/lesson-03/index.html');

    // Dark mode check (default)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const statusBadgeDark = page.locator('#lesson-status-badge');
    await expect(statusBadgeDark).toBeVisible();

    // Light mode check
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const statusBadgeLight = page.locator('#lesson-status-badge');
    await expect(statusBadgeLight).toBeVisible();

    // Check catalog light mode with clean storage
    await page.goto('/lessons.html');
    await page.evaluate(() => {
      localStorage.clear();
      document.documentElement.setAttribute('data-theme', 'light');
    });
    await page.reload();
    const cardBadgeLight = page.locator('#card-lesson-03 .badge-not-started');
    await expect(cardBadgeLight).toBeVisible();
    const cardBtnLight = page.locator('#card-lesson-03 .btn-primary');
    await expect(cardBtnLight).toBeVisible();
  });

  test('Navbar Lessons button displays red N badge when new lesson exists, and disappears on click', async ({ page }) => {
    // 1. Clear seen lessons in storage to simulate fresh/unseen state
    await page.goto('/index.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_seen_lessons');
    });
    await page.reload();

    // 2. On homepage (index.html), verify #nav-lessons-badge exists with red styling and 'N'
    const newBadge = page.locator('#nav-lessons-badge');
    await expect(newBadge).toBeVisible();
    await expect(newBadge).toHaveClass(/nav-badge-red/);
    await expect(newBadge).toHaveText('N');

    // 3. On mobile viewport, verify #nav-lessons-badge remains visible
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(newBadge).toBeVisible();
    await expect(newBadge).toHaveText('N');

    // 4. Click the Lessons menu button -> badge disappears immediately and lessons are marked seen
    const lessonsBtn = page.locator('#btn-nav-lessons');
    await lessonsBtn.click();
    await expect(page.locator('#nav-lessons-badge')).toHaveCount(0);

    // 5. Verify seen lessons are saved in localStorage
    const seenLessons = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('rhyrhy_seen_lessons') || '[]');
    });
    expect(seenLessons).toContain('lesson-03');

    // 6. Navigate to index.html again -> badge stays gone
    await page.goto('/index.html');
    await expect(page.locator('#nav-lessons-badge')).toHaveCount(0);
  });

  test('On bigger screen, lesson-step-tabs width matches Lesson 01 and all 4 step buttons are displayed', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    // Measure Lesson 01 tabs width
    await page.goto('/lessons/lesson-01/index.html');
    const lesson01Tabs = page.locator('#lesson-step-tabs');
    await expect(lesson01Tabs).toBeVisible();
    const box01 = await lesson01Tabs.boundingBox();

    // Measure Lesson 03 tabs width
    await page.goto('/lessons/lesson-03/index.html');
    const lesson03Tabs = page.locator('#lesson-step-tabs');
    await expect(lesson03Tabs).toBeVisible();
    const box03 = await lesson03Tabs.boundingBox();

    // The widths should be identical (within 2px rounding)
    expect(Math.abs(box03.width - box01.width)).toBeLessThanOrEqual(2);
    expect(box03.width).toBeGreaterThan(600);

    // Step 1, 2, 3, and 4 buttons are all visible and enabled
    await expect(page.locator('.step-tab-btn[data-step="1"]')).toBeVisible();
    await expect(page.locator('.step-tab-btn[data-step="2"]')).toBeVisible();
    await expect(page.locator('.step-tab-btn[data-step="3"]')).toBeVisible();
    await expect(page.locator('.step-tab-btn[data-step="4"]')).toBeVisible();
    await expect(page.locator('.step-tab-btn[data-step="3"]')).toBeEnabled();
    await expect(page.locator('.step-tab-btn[data-step="4"]')).toBeEnabled();
  });

});
