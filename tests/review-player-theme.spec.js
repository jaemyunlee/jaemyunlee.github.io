const { test, expect } = require('@playwright/test');

test.describe('Step 4 Review Player Theming (Issue #10)', () => {
  test('Playing sentence card has light styling in light mode without dark slate background', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4 via step tab button
    const step4Tab = page.locator('.step-tab-btn[data-step="4"]');
    await expect(step4Tab).toBeVisible({ timeout: 5000 });
    await step4Tab.click();

    // Verify Step 4 review player container is visible
    const reviewList = page.locator('.review-sentence-list');
    await expect(reviewList).toBeVisible();

    // Get the first sentence card
    const firstCard = page.locator('.quiz-sentence-card').first();
    await expect(firstCard).toBeVisible();

    // Ensure we transition to light mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Ensure the card has playing state for playback visual inspection
    await firstCard.evaluate(el => el.classList.add('playing'));
    await expect(firstCard).toHaveClass(/playing/);

    // Assert computed background in light mode does not use dark slate (rgb(30, 41, 59))
    const cardBg = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage || window.getComputedStyle(el).backgroundColor;
    });

    // In light mode, the gradient must NOT contain rgb(30, 41, 59)
    expect(cardBg).not.toContain('30, 41, 59');

    // Allow CSS transition to finish
    await page.waitForTimeout(250);

    // Verify speaker name in light mode has high-contrast emerald styling
    const speakerName = firstCard.locator('.sentence-speaker-name');
    const speakerColor = await speakerName.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    // In light mode, it should be rgb(5, 150, 105) for --accent-emerald, not pale mint rgb(52, 211, 153)
    expect(speakerColor).toBe('rgb(5, 150, 105)');

    // Now switch back to dark mode and verify dark playback style is preserved
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await firstCard.evaluate(el => el.classList.add('playing'));
    const darkBg = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage || window.getComputedStyle(el).backgroundColor;
    });
    expect(darkBg).toContain('30, 41, 59');
  });
});
