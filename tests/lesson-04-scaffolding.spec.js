const { test, expect } = require('@playwright/test');

test.describe('Lesson 04 Scaffolding & Integration', () => {

  test('Lesson 04 page loads and displays header badges and 4-step navigation tabs', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 04');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Coming soon badge in header
    const comingSoonBadge = page.locator('#lesson-coming-soon-badge');
    await expect(comingSoonBadge).toBeVisible();
    await expect(comingSoonBadge).toContainText('9월 20일 본영상 공개 예정');

    // Coming soon notification banner
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeVisible();
    await expect(comingSoonBanner).toContainText('9월 20일 본영상 정식 오픈 예정');
    await expect(comingSoonBanner).toContainText('사전 공개');

    // Step navigation tabs: Step 1 and 2 active, Step 3 and 4 deactivated in coming-soon mode
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab3).toHaveClass(/deactivated/);
    await expect(tab4).toHaveClass(/deactivated/);
    await expect(tab3).toBeDisabled();
    await expect(tab4).toBeDisabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
  });

  test('Lesson 04 loads all 15 quizzes with multiple-choice, fill-in-the-blank, and listening', async ({ page }) => {
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
        sampleQ11: quizzes[10],
        sampleQ12: quizzes[11],
        sampleQ14: quizzes[13],
        sampleQ15: quizzes[14]
      };
    });

    expect(quizDistribution.total).toBe(15);
    expect(quizDistribution.counts['multiple-choice']).toBe(12); // 80.0%
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(1);  // ~6.7%
    expect(quizDistribution.counts['listening']).toBe(2);          // ~13.3%

    // Check sample multiple choice
    expect(quizDistribution.sampleQ1.answer).toBe('stood out');
    expect(quizDistribution.sampleQ1.options).toContain('stood out');

    // Check Q4 is multiple-choice
    expect(quizDistribution.sampleQ4.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ4.answer).toBe('merch sections');
    expect(quizDistribution.sampleQ4.options).toContain('merch sections');

    // Check Q6 is multiple-choice
    expect(quizDistribution.sampleQ6.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ6.answer).toBe('nosebleed seats');
    expect(quizDistribution.sampleQ6.options).toContain('nosebleed seats');

    // Check Q7 is multiple-choice
    expect(quizDistribution.sampleQ7.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ7.answer).toBe('open air stadium');
    expect(quizDistribution.sampleQ7.options).toContain('open air stadium');

    // Check Q11 is listening
    expect(quizDistribution.sampleQ11.type).toBe('listening');
    expect(quizDistribution.sampleQ11.answer).toBe('appearance');

    // Check Q12 is multiple-choice
    expect(quizDistribution.sampleQ12.type).toBe('multiple-choice');
    expect(quizDistribution.sampleQ12.answer).toBe('turns out');
    expect(quizDistribution.sampleQ12.options).toContain('turns out');

    // Check Q14 is fill-in-the-blank
    expect(quizDistribution.sampleQ14.type).toBe('fill-in-the-blank');
    expect(quizDistribution.sampleQ14.answer).toBe('turned into');

    // Check Q15 is listening
    expect(quizDistribution.sampleQ15.type).toBe('listening');
    expect(quizDistribution.sampleQ15.answer).toBe('felt random');
  });

  test('Coming-soon status displays Step 1 and Step 2 with Kelly avatar, and hides Step 3 and Step 4', async ({ page }) => {
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

    // Verify review sentence drawer cards exist and use Kelly avatar
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards.first()).toBeVisible({ timeout: 5000 });
    const count = await sentenceCards.count();
    expect(count).toBe(15);

    // Verify avatar is kelly.jpg
    const avatarImg = sentenceCards.first().locator('.sentence-speaker-avatar');
    await expect(avatarImg).toBeVisible();
    const avatarSrc = await avatarImg.getAttribute('src');
    expect(avatarSrc).toContain('kelly.jpg');
    const avatarAlt = await avatarImg.getAttribute('alt');
    expect(avatarAlt).toBe('Kelly');

    // Verify completion card shows pre-release completion info and scheduled date
    const completeCard = page.locator('#step2-complete-card');
    await expect(completeCard).toContainText('사전 공개 학습 완료');
    await expect(completeCard).toContainText('9월 20일');

    // Verify Step 3 and Step 4 tabs are visible but deactivated and disabled
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab3).toHaveClass(/deactivated/);
    await expect(tab4).toHaveClass(/deactivated/);
    await expect(tab3).toBeDisabled();
    await expect(tab4).toBeDisabled();

    // Verify clicking deactivated Step 3 tab does not navigate
    await tab3.click({ force: true });
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');
    await expect(page.locator('#video-section')).toBeHidden();

    // Verify calling showStep(3) or showStep(4) is prevented/clamped to 2
    await page.evaluate(() => window.showStep(3));
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');
    await expect(page.locator('#video-section')).toBeHidden();

    await page.evaluate(() => window.showStep(4));
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');
    await expect(page.locator('#reflection-section')).toBeHidden();
  });

  test('Catalog (lessons.html) and Homepage (index.html) hide Lesson 04 by default and show it when hidden flag is enabled', async ({ page }) => {
    // 1. By default: Lesson 04 is hidden from catalog
    await page.goto('/lessons.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_show_hidden_lessons');
    });
    await page.reload();
    await expect(page.locator('#card-lesson-04')).toHaveCount(0);

    // 2. By default: Lesson 04 is hidden from homepage
    await page.goto('/index.html');
    await expect(page.locator('#lessons-cards-container #card-lesson-04')).toHaveCount(0);

    // 3. When show_hidden is enabled, Lesson 04 appears in catalog with badge-hidden
    await page.goto('/lessons.html?show_hidden=true');
    const lesson04Card = page.locator('#card-lesson-04');
    await expect(lesson04Card).toBeVisible({ timeout: 5000 });
    await expect(lesson04Card).toContainText('오클랜드 빅뱅 콘서트 직관기');
    await expect(lesson04Card).toContainText('5:05');
    await expect(lesson04Card).toContainText('15 퀴즈');

    // Verify hidden-status class, badge, and button
    await expect(lesson04Card).toHaveClass(/hidden-status/);
    const hiddenBadge = lesson04Card.locator('.badge-hidden');
    await expect(hiddenBadge).toBeVisible();
    await expect(hiddenBadge).toContainText('비공개 (테스트)');
    const actionBtn = lesson04Card.locator('.lesson-card-btn');
    await expect(actionBtn).toContainText('테스트 학습하기');
  });

  test('SavedAudioPlayer resolves audio URLs for Lesson 04', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const audioUrl = await page.evaluate(() => {
      const item = {
        lessonId: 'lesson-04',
        en: 'I felt like Amy kind of stood out because she was wearing a white dress.',
        audio: 'audio/I felt like Amy kind of stood out because she was wearing a white dress..wav'
      };
      return window.App.savedPlayer._resolveAudioUrl(item, window.App._getBasePath());
    });

    expect(audioUrl).toContain('lessons/lesson-04/audio/I%20felt%20like%20Amy%20kind%20of%20stood%20out%20because%20she%20was%20wearing%20a%20white%20dress..wav');
  });

  test('Coming Soon elements maintain high contrast in both Dark and Light modes', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Dark mode check (default)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const bannerDark = page.locator('#coming-soon-banner');
    await expect(bannerDark).toBeVisible();
    const badgeDark = page.locator('#lesson-coming-soon-badge');
    await expect(badgeDark).toBeVisible();

    // Light mode check
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const bannerLight = page.locator('#coming-soon-banner');
    await expect(bannerLight).toBeVisible();
    const badgeLight = page.locator('#lesson-coming-soon-badge');
    await expect(badgeLight).toBeVisible();

    // Check catalog light mode with show_hidden enabled
    await page.goto('/lessons.html?show_hidden=true');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const cardBadgeLight = page.locator('#card-lesson-04 .badge-hidden');
    await expect(cardBadgeLight).toBeVisible();
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

    // Verify key expressions from quiz
    expect(content).toContain('stood out');
    expect(content).toContain('fit');
    expect(content).toContain('quite a few');
    expect(content).toContain('merch sections');
    expect(content).toContain('odd time');
    expect(content).toContain('nosebleed seats');
    expect(content).toContain('open air stadium');
    expect(content).toContain('scripted setup');
    expect(content).toContain('up to us');
    expect(content).toContain('played that up');
    expect(content).toContain('appearance');
    expect(content).toContain('turns out');
    expect(content).toContain('came across');
    expect(content).toContain('turned into');
    expect(content).toContain('felt random');

    // Verify Korean definitions
    expect(content).toContain('유독 눈에 띄다, 두드러지다');
    expect(content).toContain('하늘석, 맨 꼭대기 좌석');
    expect(content).toContain('알고 보니 ~이다, 드러나다');
  });

});
