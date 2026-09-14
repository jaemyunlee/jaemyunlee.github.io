const { test, expect } = require('@playwright/test');

test.describe('Lesson Step Tabs Mobile Click & Focus Contrast (Issue #65)', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to prevent cross-test state leakage
    await page.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('Light mode step tab remains vibrant indigo with white text when clicked/focused on mobile', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to light mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Verify initial active tab (Step 1)
    const step1Btn = page.locator('.step-tab-btn[data-step="1"]');
    await expect(step1Btn).toHaveClass(/active/);

    const step1Bg = await step1Btn.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    const step1Color = await step1Btn.evaluate((el) => window.getComputedStyle(el).color);
    expect(step1Bg).toBe('rgb(79, 70, 229)'); // --primary in light mode
    expect(step1Color).toBe('rgb(255, 255, 255)');

    // Verify inactive tab (Step 2) step-num badge has visible background, not white-on-white
    const step2Btn = page.locator('.step-tab-btn[data-step="2"]');
    const step2NumBg = await step2Btn.locator('.step-num').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(step2NumBg).toBe('rgba(15, 23, 42, 0.08)');

    // Tap Step 2 on mobile
    await step2Btn.tap();
    await expect(step2Btn).toHaveClass(/active/);

    // Allow 0.2s CSS transition to finish
    await page.waitForTimeout(250);

    // After tap on mobile, hover/focus states are applied.
    // Ensure background does NOT revert to light slate (#F1F5F9 / rgb(241, 245, 249))
    const tappedStyles = await step2Btn.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const numCs = window.getComputedStyle(el.querySelector('.step-num'));
      return {
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        numBg: numCs.backgroundColor,
        numColor: numCs.color,
      };
    });

    expect(tappedStyles.backgroundColor).toBe('rgb(79, 70, 229)'); // NOT rgb(241, 245, 249)
    expect(tappedStyles.color).toBe('rgb(255, 255, 255)');
    expect(tappedStyles.numBg).toBe('rgb(255, 255, 255)');
    expect(tappedStyles.numColor).toBe('rgb(79, 70, 229)');

    // Now step 1 is inactive. Verify its number badge has proper subtle dark-tint pill
    const step1NewNumBg = await step1Btn.locator('.step-num').evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(step1NewNumBg).toBe('rgba(15, 23, 42, 0.08)');
  });

  test('Dark mode step tab retains primary background and white text when clicked/focused', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Ensure dark mode
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'dark') {
      await page.locator('#btn-toggle-theme').click();
      await expect(page.locator('body')).not.toHaveClass(/theme-transitioning/);
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Tap Step 3
    const step3Btn = page.locator('.step-tab-btn[data-step="3"]');
    await step3Btn.tap();
    await expect(step3Btn).toHaveClass(/active/);

    // Allow CSS transition to finish
    await page.waitForTimeout(300);

    const darkStyles = await step3Btn.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      const numCs = window.getComputedStyle(el.querySelector('.step-num'));
      return {
        backgroundColor: cs.backgroundColor,
        color: cs.color,
        numBg: numCs.backgroundColor,
        numColor: numCs.color,
      };
    });

    expect(darkStyles.backgroundColor).toBe('rgb(99, 102, 241)'); // --primary in dark mode
    expect(darkStyles.color).toBe('rgb(255, 255, 255)');
    expect(darkStyles.numBg).toBe('rgb(255, 255, 255)');
    expect(darkStyles.numColor).toBe('rgb(99, 102, 241)');
  });
});
