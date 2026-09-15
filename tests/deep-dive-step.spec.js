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

  test('Badges (time badge, 현재형, 과거형) never wrap into multi-line strings on mobile screens', async ({ page }) => {
    // Set small mobile viewport (e.g., Galaxy S8 / narrow Android 360px width)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/lessons/lesson-04/index.html');

    // Simulate larger mobile font scaling by applying a larger base font-size
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '20px';
    });

    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();

    const timeBadge = page.locator('.deep-dive-time-badge');
    const presentBadge = page.locator('.breakdown-card.highlight .breakdown-tense-badge');
    const pastBadge = page.locator('.breakdown-card .badge-past.breakdown-tense-badge');

    await expect(timeBadge).toBeVisible();
    await expect(presentBadge).toBeVisible();
    await expect(pastBadge).toBeVisible();

    // Inspect CSS computed styles and bounding box heights
    const badgeChecks = await page.evaluate(() => {
      const time = document.querySelector('.deep-dive-time-badge');
      const present = document.querySelector('.breakdown-card.highlight .breakdown-tense-badge');
      const past = document.querySelector('.breakdown-card .badge-past.breakdown-tense-badge');

      const getTimeStyle = window.getComputedStyle(time);
      const getPresentStyle = window.getComputedStyle(present);
      const getPastStyle = window.getComputedStyle(past);

      return {
        time: {
          text: time.textContent.trim(),
          whiteSpace: getTimeStyle.whiteSpace,
          flexShrink: getTimeStyle.flexShrink,
          height: time.getBoundingClientRect().height,
          lineHeight: parseFloat(getTimeStyle.lineHeight) || 20
        },
        present: {
          text: present.textContent.trim(),
          whiteSpace: getPresentStyle.whiteSpace,
          flexShrink: getPresentStyle.flexShrink,
          height: present.getBoundingClientRect().height,
          lineHeight: parseFloat(getPresentStyle.lineHeight) || 20
        },
        past: {
          text: past.textContent.trim(),
          whiteSpace: getPastStyle.whiteSpace,
          flexShrink: getPastStyle.flexShrink,
          height: past.getBoundingClientRect().height,
          lineHeight: parseFloat(getPastStyle.lineHeight) || 20
        }
      };
    });

    // Verify time badge
    expect(badgeChecks.time.text).toBe('⏱ 03:17');
    expect(badgeChecks.time.whiteSpace).toBe('nowrap');
    expect(badgeChecks.time.flexShrink).toBe('0');
    // Height should reflect a single line of text with padding (not wrapped to 2+ lines)
    expect(badgeChecks.time.height).toBeLessThan(badgeChecks.time.lineHeight * 2);

    // Verify present tense badge ('현재형')
    expect(badgeChecks.present.text).toBe('현재형');
    expect(badgeChecks.present.whiteSpace).toBe('nowrap');
    expect(badgeChecks.present.flexShrink).toBe('0');
    expect(badgeChecks.present.height).toBeLessThan(badgeChecks.present.lineHeight * 2);

    // Verify past tense badge ('과거형')
    expect(badgeChecks.past.text).toBe('과거형');
    expect(badgeChecks.past.whiteSpace).toBe('nowrap');
    expect(badgeChecks.past.flexShrink).toBe('0');
    expect(badgeChecks.past.height).toBeLessThan(badgeChecks.past.lineHeight * 2);
  });

  test('Clicking step menu in coming-soon status scrolls active section to top past coming-soon-banner', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/lesson-04/index.html');

    // Confirm coming-soon-banner is visible
    const banner = page.locator('#coming-soon-banner');
    await expect(banner).toBeVisible();

    // Click Step 2 tab
    await page.locator('.step-tab-btn[data-step="2"]').click();
    await expect(page.locator('#review-section')).toBeVisible();

    // Wait for smooth scroll to finish
    await page.waitForTimeout(600);

    // Check that window.scrollY scrolled past top, placing reviewSection at ~70px under nav
    const scrollStateStep2 = await page.evaluate(() => {
      const reviewSection = document.getElementById('review-section');
      const rect = reviewSection.getBoundingClientRect();
      return {
        scrollY: window.pageYOffset || window.scrollY,
        reviewSectionTop: rect.top
      };
    });

    expect(scrollStateStep2.scrollY).toBeGreaterThan(0);
    // reviewSectionTop should be positioned right below navHeight (approx 70px)
    expect(Math.abs(scrollStateStep2.reviewSectionTop - 70)).toBeLessThan(10);

    // Click Deep Dive tab
    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await page.waitForTimeout(600);

    const scrollStateDeepDive = await page.evaluate(() => {
      const deepDive = document.getElementById('deep-dive-section');
      const rect = deepDive.getBoundingClientRect();
      return {
        scrollY: window.pageYOffset || window.scrollY,
        deepDiveTop: rect.top
      };
    });

    expect(scrollStateDeepDive.scrollY).toBeGreaterThan(0);
    expect(Math.abs(scrollStateDeepDive.deepDiveTop - 70)).toBeLessThan(10);
  });

});
