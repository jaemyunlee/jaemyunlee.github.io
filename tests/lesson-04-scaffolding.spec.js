const { test, expect } = require('@playwright/test');

test.describe('Lesson 04 Scaffolding & Integration', () => {

  test('Lesson 04 page loads and displays header badges and 4-step navigation tabs in published mode', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 04');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Coming soon notification banner is hidden when published
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeHidden();

    // Step navigation tabs: All tabs active and enabled
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tabDeepDive = page.locator('#step-tab-deep-dive');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tabDeepDive).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();

    await expect(tab3).not.toHaveClass(/deactivated/);
    await expect(tab4).not.toHaveClass(/deactivated/);
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');
  });

  test('Lesson 04 loads all 21 quizzes with multiple-choice, fill-in-the-blank, and listening', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

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
        sampleQ4: quizzes[3],
        sampleQ6: quizzes[5],
        sampleQ7: quizzes[6],
        sampleQ9: quizzes[8],
        sampleQ11: quizzes[10],
        sampleQ12: quizzes[11],
        sampleQ13: quizzes[12],
        sampleQ14: quizzes[13],
        sampleQ15: quizzes[14],
        sampleQ16: quizzes[15],
        sampleQ17: quizzes[16],
        sampleQ18: quizzes[17],
        sampleQ19: quizzes[18],
        sampleQ20: quizzes[19],
        sampleQ21: quizzes[20]
      };
    });

    expect(quizDistribution.total).toBe(21);
    expect(quizDistribution.counts['multiple-choice']).toBe(13);
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(6);
    expect(quizDistribution.counts['listening']).toBe(2);

    // Check sample initial quizzes
    expect(quizDistribution.sampleQ1.answer).toBe('stood out');
    expect(quizDistribution.sampleQ1.options).toContain('stood out');
    expect(quizDistribution.sampleQ4.answer).toBe('merch sections');
    expect(quizDistribution.sampleQ6.answer).toBe('nosebleed seats');
    expect(quizDistribution.sampleQ7.answer).toBe('open air stadium');
    expect(quizDistribution.sampleQ9.answer).toBe('up to');
    expect(quizDistribution.sampleQ11.answer).toBe('appearance');
    expect(quizDistribution.sampleQ12.answer).toBe('turns out');
    expect(quizDistribution.sampleQ13.answer).toBe('came across');
    expect(quizDistribution.sampleQ14.answer).toBe('turned into');
    expect(quizDistribution.sampleQ15.answer).toBe('felt random');

    // Check new target expressions (Q16 - Q21)
    expect(quizDistribution.sampleQ16.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ16.answer).toBe('get in line');
    expect(quizDistribution.sampleQ16.options).toContain('get in line');

    expect(quizDistribution.sampleQ17.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ17.answer).toBe('first in line');
    expect(quizDistribution.sampleQ17.options).toContain('first in line');

    expect(quizDistribution.sampleQ18.type).toBe('fill-in-the-blank');
    expect(quizDistribution.sampleQ18.answer).toBe('by the time');

    expect(quizDistribution.sampleQ19.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ19.answer).toBe('Throughout');
    expect(quizDistribution.sampleQ19.options).toContain('Throughout');

    expect(quizDistribution.sampleQ20.type).toBe('fill-in-the-blank');
    expect(quizDistribution.sampleQ20.answer).toBe('wondering if');

    expect(quizDistribution.sampleQ21.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ21.answer).toBe('at the end');
    expect(quizDistribution.sampleQ21.options).toContain('at the end');
  });

  test('Published status displays all 21 sentences in Step 2 with Kelly avatar, and enables Step 3 and Step 4', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

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

    // Verify review sentence drawer cards exist and all 21 sentences are present
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards.first()).toBeVisible({ timeout: 5000 });
    const count = await sentenceCards.count();
    expect(count).toBe(21);

    // Verify avatar is kelly.jpg
    const avatarImg = sentenceCards.first().locator('.sentence-speaker-avatar');
    await expect(avatarImg).toBeVisible();
    const avatarSrc = await avatarImg.getAttribute('src');
    expect(avatarSrc).toContain('kelly.jpg');
    const avatarAlt = await avatarImg.getAttribute('alt');
    expect(avatarAlt).toBe('Kelly');

    // Verify Step 3 and Step 4 tabs are visible and clickable
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();

    // Verify clicking Step 3 tab navigates to Step 3
    await tab3.click();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');
    await expect(page.locator('#video-section')).toBeVisible();

    // Verify clicking Step 4 tab navigates to Step 4
    await tab4.click();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 4: 영작하기');
    await expect(page.locator('#reflection-section')).toBeVisible();
  });

  test('Catalog (lessons.html) and Homepage (index.html) display Lesson 04 card with Published status and 21 quizzes', async ({ page }) => {
    // 1. Check lessons catalog: Lesson 04 is visible by default with published status
    await page.goto('/lessons.html');
    const lesson04Card = page.locator('#card-lesson-04');
    await expect(lesson04Card).toBeVisible({ timeout: 5000 });
    await expect(lesson04Card).toContainText('오클랜드 빅뱅 콘서트 직관기');
    await expect(lesson04Card).toContainText('5:05');
    await expect(lesson04Card).toContainText('21 퀴즈');

    // Verify NOT coming-soon
    await expect(lesson04Card).not.toHaveClass(/coming-soon/);
    await expect(lesson04Card.locator('.badge-coming-soon')).toHaveCount(0);
    const actionBtn = lesson04Card.locator('.lesson-card-btn');
    await expect(actionBtn).not.toHaveClass(/btn-coming-soon/);
    await expect(actionBtn).toContainText('학습 시작하기');

    // Check in-progress state displays "이어서 학습하기"
    await page.evaluate(() => {
      localStorage.setItem('rhyrhy_step_lesson-04', '2');
    });
    await page.reload();
    const actionBtnInProgress = page.locator('#card-lesson-04 .lesson-card-btn');
    await expect(actionBtnInProgress).toContainText('이어서 학습하기');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_step_lesson-04');
    });

    // 2. Check index.html latest lessons grid
    await page.goto('/index.html');
    const indexCard04 = page.locator('#lessons-cards-container #card-lesson-04');
    await expect(indexCard04).toBeVisible({ timeout: 5000 });
    await expect(indexCard04).toContainText('오클랜드 빅뱅 콘서트 직관기');
    await expect(indexCard04).not.toHaveClass(/coming-soon/);
    await expect(indexCard04.locator('.badge-coming-soon')).toHaveCount(0);
  });

  test('SavedAudioPlayer resolves audio URLs for Lesson 04', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const audioUrl = await page.evaluate(() => {
      const item = {
        lessonId: 'lesson-04',
        en: 'Hopefully we can get in line.',
        audio: 'audio/Hopefully we can get in line..wav'
      };
      return window.App.savedPlayer._resolveAudioUrl(item, window.App._getBasePath());
    });

    expect(audioUrl).toContain('lessons/lesson-04/audio/Hopefully%20we%20can%20get%20in%20line..wav');
  });

  test('lesson-04-key-expressions.srt is generated with accurate timing, key expressions, and Korean definitions', async () => {
    const fs = require('fs');
    const path = require('path');
    const srtPath = path.resolve(__dirname, '../lessons/lesson-04/lesson-04-key-expressions.srt');
    expect(fs.existsSync(srtPath)).toBe(true);

    const content = fs.readFileSync(srtPath, 'utf8');
    // Verify standing out with timing 00:00:27,560 --> 00:00:32,250
    expect(content).toContain('00:00:27,560 --> 00:00:32,250');
    expect(content).toContain('standing out');

    // Verify initial key expressions
    expect(content).toContain('stood out');
    expect(content).toContain('fit');
    expect(content).toContain('quite a few');
    expect(content).toContain('merch sections');
    expect(content).toContain('odd time');
    expect(content).toContain('nosebleed seats');
    expect(content).toContain('open air stadium');
    expect(content).toContain('scripted setup');
    expect(content).toContain('up to');
    expect(content).toContain('played that up');
    expect(content).toContain('appearance');
    expect(content).toContain('turns out');
    expect(content).toContain('came across');
    expect(content).toContain('turned into');
    expect(content).toContain('felt random');

    // Verify new target expressions
    expect(content).toContain('get in line');
    expect(content).toContain('first in line');
    expect(content).toContain('by the time');
    expect(content).toContain('Throughout');
    expect(content).toContain('wondering if');
    expect(content).toContain('at the end');

    // Verify Korean definitions
    expect(content).toContain('유독 눈에 띄다, 두드러지다');
    expect(content).toContain('하늘석, 맨 꼭대기 좌석');
    expect(content).toContain('알고 보니 ~이다, 드러나다');
    expect(content).toContain('줄을 서다, 차례를 기다리다');
    expect(content).toContain('맨 먼저 줄을 선, 첫 번째 순서의');
    expect(content).toContain('~할 무렵에는, ~할 때쯤에');
    expect(content).toContain('~내내, 줄곧');
    expect(content).toContain('~인지 궁금해하다');
    expect(content).toContain('마지막에, 끝 무렵에');
  });

});
