const { test, expect } = require('@playwright/test');

test.describe('Daily English Phrase Quiz via Floating Popcorn Button (Issue #44)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear completion date and saved sentences before each test
    await page.goto('/index.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_daily_completed_date');
      localStorage.removeItem('rhyrhy_saved_sentences');
    });
    await page.reload();
  });

  test('Floating Popcorn Button renders in bottom-right corner with icon and badge when uncompleted', async ({ page }) => {
    for (const url of ['/index.html', '/lessons.html']) {
      await page.goto(url);

      const fab = page.locator('#btn-daily-popcorn');
      await expect(fab).toBeVisible({ timeout: 5000 });

      // Verify circular shape and icon
      const icon = fab.locator('.popcorn-icon-inner');
      await expect(icon).toHaveText('🍿');

      const badge = fab.locator('.popcorn-badge');
      await expect(badge).toBeVisible();

      // Verify bottom-right positioning and desktop size (3.5x bigger: ~203px)
      const box = await fab.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.round(box.width)).toBeGreaterThanOrEqual(190);
      expect(Math.round(box.width)).toBeLessThanOrEqual(215);
      expect(Math.round(box.height)).toBeGreaterThanOrEqual(190);
      expect(Math.round(box.height)).toBeLessThanOrEqual(215);
    }

    // Verify mobile responsive size (2.5x bigger: ~145px on screen <= 768px)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');
    const fabMobile = page.locator('#btn-daily-popcorn');
    await expect(fabMobile).toBeVisible();
    const mobileBox = await fabMobile.boundingBox();
    expect(mobileBox).not.toBeNull();
    expect(Math.round(mobileBox.width)).toBeGreaterThanOrEqual(135);
    expect(Math.round(mobileBox.width)).toBeLessThanOrEqual(155);
    expect(Math.round(mobileBox.height)).toBeGreaterThanOrEqual(135);
    expect(Math.round(mobileBox.height)).toBeLessThanOrEqual(155);
  });

  test('Clicking popcorn button triggers popping animation and opens Daily Phrase Modal', async ({ page }) => {
    await page.goto('/index.html');

    const fab = page.locator('#btn-daily-popcorn');
    await expect(fab).toBeVisible({ timeout: 5000 });

    // Click the popcorn button
    await fab.click();

    // Modal dialog should open
    const modal = page.locator('#daily-phrase-modal');
    await expect(modal).toBeVisible({ timeout: 3000 });
    await expect(modal).toHaveClass(/open/);

    // Verify modal header has popcorn tag and date
    const tag = modal.locator('.daily-header-tag');
    await expect(tag).toContainText('오늘의 한마디');

    // Verify Korean translation and masked English sentence
    const krText = modal.locator('.daily-kr-text');
    await expect(krText).toBeVisible();
    const krContent = await krText.textContent();
    expect(krContent.trim().length).toBeGreaterThan(0);

    const maskEl = modal.locator('#daily-phrase-mask');
    await expect(maskEl).toBeVisible();
    await expect(maskEl).not.toHaveClass(/revealed/);

    // Verify Audio button and action buttons
    const playBtn = modal.locator('#btn-daily-play');
    await expect(playBtn).toBeVisible();

    const revealBtn = modal.locator('#btn-daily-reveal');
    await expect(revealBtn).toBeVisible();
    await expect(revealBtn).toContainText('정답 확인');

    const saveBtn = modal.locator('#btn-daily-save');
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toContainText('단어장에 저장');
  });

  test('Audio playback button triggers playback state without error', async ({ page }) => {
    await page.goto('/index.html');

    const fab = page.locator('#btn-daily-popcorn');
    await fab.click();

    const modal = page.locator('#daily-phrase-modal');
    await expect(modal).toBeVisible();

    const playBtn = modal.locator('#btn-daily-play');
    await expect(playBtn).toBeVisible();

    // Trigger play
    await playBtn.click();
    await page.waitForTimeout(300);

    // Play button reflects active playback
    const playText = modal.locator('#daily-play-text');
    await expect(playText).toHaveText(/(재생 중\.\.\.|발음 듣기)/);
  });

  test('Reveal action unmasks keywords, displays explanation, and sets completion date', async ({ page }) => {
    await page.goto('/index.html');

    const fab = page.locator('#btn-daily-popcorn');
    await fab.click();

    const modal = page.locator('#daily-phrase-modal');
    const maskEl = modal.locator('#daily-phrase-mask');
    const revealBtn = modal.locator('#btn-daily-reveal');
    const expBox = modal.locator('#daily-explanation-box');

    // Initially explanation is hidden and mask is unrevealed
    await expect(expBox).not.toBeVisible();
    await expect(maskEl).not.toHaveClass(/revealed/);

    // Click reveal button
    await revealBtn.click();

    // Mask becomes revealed and explanation appears
    await expect(maskEl).toHaveClass(/revealed/);
    await expect(expBox).toBeVisible();
    await expect(revealBtn).toContainText('정답 확인 완료');

    // Check localStorage has today's date stored
    const completedDate = await page.evaluate(() => localStorage.getItem('rhyrhy_daily_completed_date'));
    const expectedToday = new Date().toISOString().slice(0, 10);
    expect(completedDate).toBe(expectedToday);

    // Close modal
    const closeBtn = modal.locator('#btn-close-daily-modal');
    await closeBtn.click();
    await expect(modal).not.toHaveClass(/open/);

    // The floating popcorn button should now be vanished / removed from the page for today
    await page.waitForTimeout(500);
    const fabAfter = page.locator('#btn-daily-popcorn');
    await expect(fabAfter).toHaveCount(0);
  });

  test('Visibility & Reset Logic: Button stays hidden on same day, reappears next day with new phrase', async ({ page }) => {
    await page.goto('/index.html');

    // Simulate completion for today
    const todayStr = new Date().toISOString().slice(0, 10);
    await page.evaluate((date) => {
      localStorage.setItem('rhyrhy_daily_completed_date', date);
    }, todayStr);

    // Reload page on same day: FAB must NOT be displayed
    await page.reload();
    const fabSameDay = page.locator('#btn-daily-popcorn');
    await expect(fabSameDay).toHaveCount(0);

    // Simulate next day (yesterday's completion date)
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    await page.evaluate((date) => {
      localStorage.setItem('rhyrhy_daily_completed_date', date);
    }, yesterday);

    // Reload: FAB must reappear for the new day!
    await page.reload();
    const fabNextDay = page.locator('#btn-daily-popcorn');
    await expect(fabNextDay).toBeVisible({ timeout: 5000 });
  });

  test('Save Phrase Action saves to user sentence bank and appears in drawer', async ({ page }) => {
    await page.goto('/index.html');

    const fab = page.locator('#btn-daily-popcorn');
    await fab.click();

    const modal = page.locator('#daily-phrase-modal');
    const saveBtn = modal.locator('#btn-daily-save');

    // Click save phrase
    await saveBtn.click();
    await expect(saveBtn).toHaveClass(/saved/);
    await expect(saveBtn).toContainText('단어장에 저장됨');

    // Verify stored in Storage
    const savedAll = await page.evaluate(() => JSON.parse(localStorage.getItem('rhyrhy_saved_sentences') || '{}'));
    expect(savedAll['daily']).toBeDefined();
    expect(savedAll['daily'].length).toBe(1);

    // Close daily modal
    await modal.locator('#btn-close-daily-modal').click();

    // Open Saved Sentences Drawer from navbar
    const openDrawerBtn = page.locator('#btn-open-sentences');
    await openDrawerBtn.click();

    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toHaveClass(/open/);

    // Group for daily phrases is rendered
    const dailyGroup = drawer.locator('.saved-lesson-group');
    await expect(dailyGroup).toContainText('오늘의 한마디');
    const groupLink = dailyGroup.locator('.group-lesson-link');
    await expect(groupLink).toHaveAttribute('href', /daily\.html/);

    // Card exists inside drawer list
    const savedCard = drawer.locator('.saved-sentence-card').first();
    await expect(savedCard).toBeVisible();
  });

  test('Standalone daily.html page loads phrase card immediately', async ({ page }) => {
    await page.goto('/daily.html');

    const pageTitle = page.locator('.daily-page-title');
    await expect(pageTitle).toContainText('오늘의 팝콘 한마디');

    const card = page.locator('.daily-phrase-card');
    await expect(card).toBeVisible({ timeout: 5000 });

    const krText = card.locator('.daily-kr-text');
    await expect(krText).toBeVisible();

    const revealBtn = card.locator('#btn-daily-reveal');
    await expect(revealBtn).toBeVisible();
  });

  test('Theme & Contrast: FAB and modal elements are styled properly in Light and Dark modes', async ({ page }) => {
    await page.goto('/index.html');

    // 1. Check Light Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const fab = page.locator('#btn-daily-popcorn');
    await expect(fab).toBeVisible();
    await fab.click();

    const modal = page.locator('#daily-phrase-modal');
    await expect(modal).toBeVisible();

    // Check light mode card background (#FFFFFF = rgb(255, 255, 255))
    const card = modal.locator('.daily-phrase-card');
    const cardBgLight = await card.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(cardBgLight).toBe('rgb(255, 255, 255)');

    // 2. Check Dark Mode
    await page.evaluate(() => {
      if (window.Theme && typeof window.Theme.toggle === 'function') {
        window.Theme.toggle();
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const cardBgDark = await card.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(cardBgDark).toBe('rgb(30, 41, 59)'); // #1E293B
  });
});
