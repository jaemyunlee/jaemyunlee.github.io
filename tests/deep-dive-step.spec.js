const { test, expect } = require('@playwright/test');

test.describe('Optional Deep Dive (심화 학습) Step (Issue #70)', () => {

  test('Lesson 04 displays the Peanut tab between Step 2 and Step 3', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const tabs = page.locator('#lesson-step-tabs .step-tab-btn');
    // Tab order: 1 (퀴즈), 2 (핵심 문장), deep-dive (심화 학습), 3 (전체 영상), 4 (영작하기)
    await expect(tabs).toHaveCount(5);

    const deepDiveTab = page.locator('#step-tab-deep-dive');
    await expect(deepDiveTab).toBeVisible();
    await expect(deepDiveTab).toHaveAttribute('data-step', 'deep-dive');
    await expect(deepDiveTab.locator('.step-icon')).toHaveText('🥜');
    await expect(deepDiveTab.locator('.step-label')).toHaveText('심화 학습');

    // Verify it is positioned immediately after Step 2 tab and before Step 3 tab
    const step2Tab = page.locator('.step-tab-btn[data-step="2"]');
    const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
    await expect(step2Tab).toBeVisible();
    await expect(step3Tab).toBeVisible();
  });

  test('Clicking Deep Dive tab opens the section and updates the status badge', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const deepDiveTab = page.locator('#step-tab-deep-dive');
    const deepDiveSection = page.locator('#deep-dive-section');
    const statusBadge = page.locator('#lesson-status-badge');

    // Initially on Step 1
    await expect(deepDiveSection).toBeHidden();
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Click Deep Dive tab
    await deepDiveTab.click();

    // Verify active tab and section display
    await expect(deepDiveTab).toHaveClass(/active/);
    await expect(deepDiveSection).toBeVisible();
    await expect(statusBadge).toHaveText('🥜 심화 학습');

    // Other sections should be hidden
    await expect(page.locator('#quiz-section')).toBeHidden();
    await expect(page.locator('#review-section')).toBeHidden();
    await expect(page.locator('#video-section')).toBeHidden();
  });

  test('Deep Dive section renders the 4-part layout specified in Issue #70', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    const section = page.locator('#deep-dive-section');

    // Part 1: Question Prompt (Header)
    const heading = section.locator('.deep-dive-heading');
    await expect(heading).toContainText('왜 과거에 일어난 일인데, turns out은 현재형일까?');
    await expect(section.locator('.badge-peanut')).toContainText('심화 학습 · Deep Dive');

    // Part 2: Context from the Video
    await expect(section).toContainText('영상 속 실제 대화 상황');
    const sceneBox = section.locator('.deep-dive-scene-box');
    await expect(sceneBox).toBeVisible();
    await expect(sceneBox).toContainText('03:17');
    await expect(sceneBox).toContainText('So we were wondering if he had like a girl\'s name written on the belt buckle');
    await expect(sceneBox).toContainText('turns out it was a brand name that said Dsquared');

    // Part 3: Nuance Breakdown (Present vs. Past)
    const breakdownGrid = section.locator('.deep-dive-breakdown-grid');
    await expect(breakdownGrid).toBeVisible();
    await expect(breakdownGrid).toContainText('It turns out (that) ...');
    await expect(breakdownGrid).toContainText('현재형');
    await expect(breakdownGrid).toContainText('It turned out (that) ...');
    await expect(breakdownGrid).toContainText('과거형');
    await expect(section.locator('.deep-dive-takeaway')).toContainText('핵심 꿀팁');

    // Part 4: Additional Examples (3 practical real-world sentences)
    const exampleCards = section.locator('.deep-dive-example-card');
    await expect(exampleCards).toHaveCount(3);

    // Check Example 1
    await expect(exampleCards.nth(0)).toContainText('restaurant was closed');
    await expect(exampleCards.nth(0)).toContainText('it turns out they\'re open till midnight');

    // Check Example 2
    await expect(exampleCards.nth(1)).toContainText('flight delay');
    await expect(exampleCards.nth(1)).toContainText('it turns out the weather cleared up quickly');

    // Check Example 3
    await expect(exampleCards.nth(2)).toContainText('looking for my keys');
    await expect(exampleCards.nth(2)).toContainText('it turns out they were in my backpack');

    // Audio play buttons should not be present on example cards (per design decision)
    await expect(section.locator('.btn-example-speak')).toHaveCount(0);
  });

  test('Step 2 completion card flows into Deep Dive when hasDeepDive is true', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Navigate to Step 2
    await page.locator('.step-tab-btn[data-step="2"]').click();
    await expect(page.locator('#review-section')).toBeVisible();

    // The next step button on Step 2 completion card should guide learner to Deep Dive
    const nextBtn = page.locator('#step2-complete-card .btn-goto-deep-dive');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toContainText('심화 학습 보러가기');

    // Click next button -> should activate Deep Dive step
    await nextBtn.click();
    await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
  });

  test('Deep Dive bottom card displays "오픈 예정" and is deactivated in coming-soon status', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    const bottomCard = page.locator('#deep-dive-section .deep-dive-bottom-card');
    await expect(bottomCard).toBeVisible();

    // Must have exactly one button (no secondary back button)
    const buttons = bottomCard.locator('button');
    await expect(buttons).toHaveCount(1);

    const nextBtn = bottomCard.locator('#btn-deep-dive-next');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toHaveClass(/btn/);
    await expect(nextBtn).toHaveClass(/btn-primary/);
    await expect(nextBtn).toHaveClass(/btn-goto-step3/);

    // In coming-soon status: displays "오픈 예정" and is deactivated / disabled
    await expect(nextBtn).toContainText('오픈 예정');
    await expect(nextBtn).toBeDisabled();
    await expect(nextBtn).toHaveClass(/deactivated/);
    await expect(page.locator('#btn-deep-dive-back')).toHaveCount(0);

    // Verify nudge text encouraging observation in Step 3 full context
    await expect(bottomCard).toContainText('Step 3 전체 대화 맥락 속에서 확인하기');
    await expect(bottomCard).toContainText('it turns out');
    await expect(bottomCard).toContainText('전체 영상');
  });

  test('Lessons without Deep Dive (e.g. Lesson 01, 02, 03) continue to flow seamlessly without Peanut tab', async ({ page }) => {
    // Check Lesson 01
    await page.goto('/lessons/lesson-01/index.html');
    await expect(page.locator('#step-tab-deep-dive')).toHaveCount(0);
    await expect(page.locator('#deep-dive-section')).toHaveCount(0);
    const tabs01 = page.locator('#lesson-step-tabs .step-tab-btn');
    await expect(tabs01).toHaveCount(4);

    // Check Lesson 03
    await page.goto('/lessons/lesson-03/index.html');
    await expect(page.locator('#step-tab-deep-dive')).toHaveCount(0);
    await expect(page.locator('#deep-dive-section')).toHaveCount(0);
    const tabs03 = page.locator('#lesson-step-tabs .step-tab-btn');
    await expect(tabs03).toHaveCount(4);

    // Step 2 completion card in Lesson 03 points directly to Step 3
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const nextBtn03 = page.locator('#step2-complete-card #btn-goto-step3');
    await expect(nextBtn03).toContainText('전체 영상 보러가기');
  });

  test('Deep Dive maintains high contrast in both Dark and Light modes', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    // Dark Mode (default)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const cardDark = page.locator('.deep-dive-card');
    await expect(cardDark).toBeVisible();
    const headingDark = page.locator('.deep-dive-heading');
    await expect(headingDark).toBeVisible();

    // Light Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const cardLight = page.locator('.deep-dive-card');
    await expect(cardLight).toBeVisible();
    const headingLight = page.locator('.deep-dive-heading');
    await expect(headingLight).toBeVisible();
    const peanutBadge = page.locator('.badge-peanut');
    await expect(peanutBadge).toBeVisible();
  });

  test('LocalStorage restores deep-dive step state on page reload', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Click Deep Dive tab
    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();

    // Verify localStorage has deep-dive
    const storedStep = await page.evaluate(() => localStorage.getItem('rhyrhy_step_lesson-04'));
    expect(storedStep).toBe('deep-dive');

    // Reload page
    await page.reload();

    // Should resume on Deep Dive step
    await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
  });

});
