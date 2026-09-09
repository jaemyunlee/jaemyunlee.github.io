const { test, expect } = require('@playwright/test');

test.describe('Daily English Phrase Popcorn on Navbar & Dedicated Page (Issue #44)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear completion date, popcorn states, and saved sentences before each test
    await page.goto('/index.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_daily_completed_date');
      localStorage.removeItem('rhyrhy_saved_sentences');
      localStorage.removeItem('rhyrhy_popcorn_known');
      localStorage.removeItem('rhyrhy_popcorn_studied');
    });
    await page.reload();
  });

  test('Navbar Popcorn Button renders to the left of Lesson icon with text on desktop and icon-only on mobile', async ({ page }) => {
    // 1. Desktop Viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');

    const popcornBtn = page.locator('#btn-nav-popcorn');
    const lessonsBtn = page.locator('#btn-nav-lessons');
    await expect(popcornBtn).toBeVisible({ timeout: 5000 });
    await expect(lessonsBtn).toBeVisible();

    // Verify button is to the left of lessons button
    const popcornBox = await popcornBtn.boundingBox();
    const lessonsBox = await lessonsBtn.boundingBox();
    expect(popcornBox).not.toBeNull();
    expect(lessonsBox).not.toBeNull();
    expect(popcornBox.x).toBeLessThan(lessonsBox.x);

    // Desktop: Popcorn button shows icon and label text
    const icon = popcornBtn.locator('.nav-popcorn-icon');
    await expect(icon).toHaveText('🍿');
    const label = popcornBtn.locator('.nav-btn-label');
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Popcorn');

    // Desktop: Lessons and Saved buttons show colorful icons and labels
    const lessonsIcon = lessonsBtn.locator('.nav-lessons-icon');
    await expect(lessonsIcon).toHaveText('📖');
    const savedBtn = page.locator('#btn-open-sentences');
    const savedIcon = savedBtn.locator('.nav-saved-icon');
    await expect(savedIcon).toHaveText('🔖');

    // Desktop: Brand displays "RhyRhy English"
    const brandName = page.locator('.brand-name');
    await expect(brandName).toBeVisible();
    const brandEnglish = page.locator('.brand-english');
    await expect(brandEnglish).toBeVisible();

    // 2. Mobile Viewport (<= 768px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    const mobilePopcornBtn = page.locator('#btn-nav-popcorn');
    await expect(mobilePopcornBtn).toBeVisible();

    // Mobile: Text label is hidden; only colorful icons are shown
    const mobileLabel = mobilePopcornBtn.locator('.nav-btn-label');
    await expect(mobileLabel).not.toBeVisible();
    await expect(mobilePopcornBtn.locator('.nav-popcorn-icon')).toBeVisible();
    await expect(page.locator('#btn-nav-lessons .nav-lessons-icon')).toBeVisible();
    await expect(page.locator('#btn-open-sentences .nav-saved-icon')).toBeVisible();

    // Mobile: Brand shows only "RhyRhy"; "English" is hidden
    const mobileBrandEnglish = page.locator('.brand-english');
    await expect(mobileBrandEnglish).not.toBeVisible();

    // Mobile: BETA tag is visible with small font styling
    const betaTag = page.locator('.nav-beta-tag');
    await expect(betaTag).toBeVisible();
    const betaFontSize = await betaTag.evaluate(el => window.getComputedStyle(el).fontSize);
    expect(parseFloat(betaFontSize)).toBeLessThanOrEqual(12);
  });

  test('Clicking navbar popcorn button triggers flyer animation, pop burst, and navigates to dedicated daily.html page', async ({ page }) => {
    await page.goto('/index.html');

    const popcornBtn = page.locator('#btn-nav-popcorn');
    await expect(popcornBtn).toBeVisible({ timeout: 5000 });

    // Click navbar popcorn button
    await popcornBtn.click();

    // Flyer animation element appears in the DOM
    const flyer = page.locator('.popcorn-nav-flyer');
    await expect(flyer).toBeVisible({ timeout: 2000 });

    // Page smoothly navigates to /daily.html
    await page.waitForURL('**/daily.html', { timeout: 5000 });
    expect(page.url()).toContain('daily.html');

    // On daily.html, the popcorn check card is rendered in #daily-page-container
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
    await expect(checkCard.locator('.popcorn-check-prompt')).toContainText('이 표현을 아시나요?');

    // Popcorn button in navbar is active on daily.html
    const navPopcornDaily = page.locator('#btn-nav-popcorn');
    await expect(navPopcornDaily).toHaveClass(/active/);
  });

  test('Daily phrase card on daily.html supports audio playback, conversation study, and nuance explanation', async ({ page }) => {
    await page.goto('/daily.html');

    // 1. Stage 1: Knowledge Check
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });

    const expressionEl = checkCard.locator('.popcorn-expression-banner');
    await expect(expressionEl).toBeVisible();
    const expressionText = (await expressionEl.textContent()).trim();
    expect(expressionText.length).toBeGreaterThan(0);

    // Proceed to Stage 2: Click "몰라요 (학습하기)"
    const learnBtn = checkCard.locator('#btn-popcorn-learn');
    await expect(learnBtn).toBeVisible();
    await learnBtn.click();

    // 2. Stage 2: Conversation Study
    const convCard = page.locator('#popcorn-conversation-card');
    await expect(convCard).toBeVisible({ timeout: 5000 });

    // Verify target expression banner and highlight
    const targetWord = convCard.locator('.target-word');
    await expect(targetWord).toBeVisible();
    const highlightedMarks = convCard.locator('.popcorn-highlight');
    await expect(highlightedMarks.first()).toBeVisible();

    // Verify dialogue bubbles
    const bubbles = convCard.locator('.dialogue-bubble');
    expect(await bubbles.count()).toBeGreaterThanOrEqual(2);

    // Verify audio controls
    const playAllBtn = convCard.locator('#btn-popcorn-play-all');
    await expect(playAllBtn).toBeVisible();
    await playAllBtn.click();
    await page.waitForTimeout(300);

    // Verify reveal action
    const expCard = convCard.locator('#popcorn-explanation-card');
    const revealBtn = convCard.locator('#btn-popcorn-reveal');
    await expect(revealBtn).toBeVisible();

    await revealBtn.click();

    // Conversation card receives revealed class and explanation is visible
    await expect(convCard).toHaveClass(/revealed/);
    await expect(expCard).toBeVisible();
    await expect(revealBtn).toContainText('해설 확인 완료');

    // Cooldown is set in localStorage
    const studiedList = await page.evaluate(() => JSON.parse(localStorage.getItem('rhyrhy_popcorn_studied') || '{}'));
    expect(Object.keys(studiedList).length).toBeGreaterThan(0);
  });

  test('Reset Logic: Completion date persists on same day, resets next day', async ({ page }) => {
    await page.goto('/index.html');

    // Simulate completion for today
    const todayStr = new Date().toISOString().slice(0, 10);
    await page.evaluate((date) => {
      localStorage.setItem('rhyrhy_daily_completed_date', date);
    }, todayStr);

    const isCompletedToday = await page.evaluate(() => Storage.isDailyPhraseCompletedToday());
    expect(isCompletedToday).toBe(true);

    // Simulate next day (completion was yesterday)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    await page.evaluate((date) => {
      localStorage.setItem('rhyrhy_daily_completed_date', date);
    }, yesterday);

    const isCompletedNewDay = await page.evaluate(() => Storage.isDailyPhraseCompletedToday());
    expect(isCompletedNewDay).toBe(false);
  });

  test('Save Phrase Action on daily.html saves to user sentence bank and appears in drawer', async ({ page }) => {
    await page.goto('/daily.html');

    // Advance to Stage 2
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
    await checkCard.locator('#btn-popcorn-learn').click();

    const convCard = page.locator('#popcorn-conversation-card');
    await expect(convCard).toBeVisible({ timeout: 5000 });

    const saveBtn = convCard.locator('#btn-popcorn-save');
    await expect(saveBtn).toBeVisible();

    // Click save phrase
    await saveBtn.click();
    await expect(saveBtn).toHaveClass(/saved/);
    await expect(saveBtn).toContainText('저장됨');

    // Verify stored in Storage under 'popcorn' group
    const savedAll = await page.evaluate(() => JSON.parse(localStorage.getItem('rhyrhy_saved_sentences') || '{}'));
    expect(savedAll['popcorn']).toBeDefined();
    expect(savedAll['popcorn'].length).toBe(1);

    // Open Saved Sentences Drawer from navbar
    const openDrawerBtn = page.locator('#btn-open-sentences');
    await openDrawerBtn.click();

    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toHaveClass(/open/);

    // Group for popcorn is rendered and links to daily.html
    const popcornGroup = drawer.locator('.saved-lesson-group');
    await expect(popcornGroup).toContainText('팝콘 영어');
    const groupLink = popcornGroup.locator('.group-lesson-link');
    await expect(groupLink).toHaveAttribute('href', /daily\.html/);

    // Card exists inside drawer list
    const savedCard = drawer.locator('.saved-sentence-card').first();
    await expect(savedCard).toBeVisible();
  });

  test('Theme & Contrast: Navbar and phrase card are styled properly in Light and Dark modes', async ({ page }) => {
    await page.goto('/daily.html');

    // 1. Light Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });

    // Light mode card background (#FFFFFF = rgb(255, 255, 255))
    const cardBgLight = await checkCard.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(cardBgLight).toBe('rgb(255, 255, 255)');

    // 2. Dark Mode
    await page.evaluate(() => {
      if (window.Theme && typeof window.Theme.toggle === 'function') {
        window.Theme.toggle();
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const cardBgDark = await checkCard.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(cardBgDark).toBe('rgb(30, 41, 59)'); // #1E293B
  });
});
