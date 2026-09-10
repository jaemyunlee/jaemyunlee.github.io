const { test, expect } = require('@playwright/test');

test.describe('First Save Local Storage Warning Popup Theming (Issue #48)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure first save notice can trigger
    await page.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test('Popup card has clean white background and high-contrast text in Light Mode', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Light Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Trigger the first-save modal
    await page.evaluate(() => {
      if (typeof App !== 'undefined' && App._renderFirstSaveNoticeModal) {
        App._renderFirstSaveNoticeModal();
      }
    });

    const modalOverlay = page.locator('#first-save-storage-modal');
    await expect(modalOverlay).toBeVisible();

    const modalCard = page.locator('.first-visit-modal-card');
    await expect(modalCard).toBeVisible();

    // Verify modal card background is pure white (rgb(255, 255, 255)) and NOT dark slate #181E2E (rgb(24, 30, 46))
    const cardBg = await modalCard.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(cardBg).toBe('rgb(255, 255, 255)');
    expect(cardBg).not.toBe('rgb(24, 30, 46)');

    // Verify title text color is deep slate navy (rgb(15, 23, 42))
    const title = page.locator('#first-save-title');
    const titleColor = await title.evaluate((el) => window.getComputedStyle(el).color);
    expect(titleColor).toBe('rgb(15, 23, 42)');

    // Verify badge in light mode uses accessible dark indigo text
    const badge = page.locator('.first-visit-badge');
    const badgeColor = await badge.evaluate((el) => window.getComputedStyle(el).color);
    expect(badgeColor).toBe('rgb(67, 56, 202)'); // #4338CA

    // Verify request point card title has high contrast dark indigo
    const requestTitle = page.locator('.first-visit-point-card.request .point-title');
    const requestTitleColor = await requestTitle.evaluate((el) => window.getComputedStyle(el).color);
    expect(requestTitleColor).toBe('rgb(55, 48, 163)'); // #3730A3

    // Wait for modal entrance animation (350ms) to complete
    await page.waitForTimeout(450);

    // Capture screenshot for walkthrough
    await page.screenshot({ path: '/Users/jaemyun/.gemini/antigravity-ide/brain/fa432653-be2a-4f63-ad51-eae34b9fe00c/light_mode_storage_modal.png' });

    // Verify top-right close button is visible and has accessible label
    const closeBtn = page.locator('#btn-close-first-save');
    await expect(closeBtn).toBeVisible();
    await expect(closeBtn).toHaveAttribute('aria-label', '팝업 닫기');

    // Test dismiss via top-right close button
    await closeBtn.click();
    await expect(modalOverlay).not.toBeAttached();
  });

  test('Popup card preserves dark styling in Dark Mode', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Explicitly set Dark Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (typeof Storage !== 'undefined') {
        Storage.setTheme('dark');
      }
    });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Trigger the first-save modal
    await page.evaluate(() => {
      if (typeof App !== 'undefined' && App._renderFirstSaveNoticeModal) {
        App._renderFirstSaveNoticeModal();
      }
    });

    const modalOverlay = page.locator('#first-save-storage-modal');
    await expect(modalOverlay).toBeVisible();

    const modalCard = page.locator('.first-visit-modal-card');
    await expect(modalCard).toBeVisible();

    // In dark mode, card background must be dark #181E2E (rgb(24, 30, 46))
    const cardBg = await modalCard.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(cardBg).toBe('rgb(24, 30, 46)');

    // Wait for modal entrance animation (350ms) to complete
    await page.waitForTimeout(450);

    // Capture screenshot for walkthrough
    await page.screenshot({ path: '/Users/jaemyun/.gemini/antigravity-ide/brain/fa432653-be2a-4f63-ad51-eae34b9fe00c/dark_mode_storage_modal.png' });

    // Dismiss via main action button
    const dismissBtn = page.locator('#btn-dismiss-first-save');
    await dismissBtn.click();
    await expect(modalOverlay).not.toBeAttached();
  });

  test('First sentence bookmark triggers modal and records seen state in localStorage', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Light Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Switch to Step 2 (핵심 문장)
    const step2Tab = page.locator('.step-tab-btn[data-step="2"]');
    await expect(step2Tab).toBeVisible({ timeout: 5000 });
    await step2Tab.click();

    // Save the first sentence
    const firstBookmarkBtn = page.locator('.btn-card-bookmark').first();
    await expect(firstBookmarkBtn).toBeVisible({ timeout: 5000 });
    await firstBookmarkBtn.click();

    // Verify first-save storage notice modal pops up
    const modalOverlay = page.locator('#first-save-storage-modal');
    await expect(modalOverlay).toBeVisible({ timeout: 4000 });

    // Verify storage flag is recorded in localStorage
    const noticeSeen = await page.evaluate(() => window.localStorage.getItem('rhyrhy_first_save_notice_seen'));
    expect(noticeSeen).toBe('true');

    // Dismiss modal by clicking outside
    await modalOverlay.click({ position: { x: 5, y: 5 } });
    await expect(modalOverlay).not.toBeAttached();
  });
});
