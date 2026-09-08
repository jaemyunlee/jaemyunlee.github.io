const { test, expect } = require('@playwright/test');

test.describe('Subtitle Display Controls & Light Mode Contrast (Issue #43)', () => {
  test.beforeEach(async ({ page }) => {
    // Reset local storage / theme
    await page.goto('/lessons/lesson-01/index.html');
  });

  test('Lesson 01 & Lesson 02 display "자막" title, text labels (Both, EN, KR) and off icon button', async ({ page }) => {
    for (const url of ['/lessons/lesson-01/index.html', '/lessons/lesson-02/index.html']) {
      await page.goto(url);

      // Navigate to Step 3 (영상 & 쉐도잉 / VideoScriptPlayer)
      const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
      await expect(step3Tab).toBeVisible({ timeout: 5000 });
      await step3Tab.click();

      // Verify title displays "자막" instead of "Interactive Script"
      const headerTitle = page.locator('.script-header-title');
      await expect(headerTitle).toContainText('자막');
      await expect(headerTitle).not.toContainText('Interactive Script');

      const toggleGroup = page.locator('.script-sub-toggle-group');
      await expect(toggleGroup).toBeVisible();

      const buttons = toggleGroup.locator('button.btn-toggle-sub');
      await expect(buttons).toHaveCount(4);

      // Verify modes and contents
      const bothBtn = buttons.nth(0);
      await expect(bothBtn).toHaveAttribute('data-subtitle-mode', 'both');
      await expect(bothBtn).toHaveText('Both');

      const enBtn = buttons.nth(1);
      await expect(enBtn).toHaveAttribute('data-subtitle-mode', 'en');
      await expect(enBtn).toHaveText('EN');

      const krBtn = buttons.nth(2);
      await expect(krBtn).toHaveAttribute('data-subtitle-mode', 'kr');
      await expect(krBtn).toHaveText('KR');

      const offBtn = buttons.nth(3);
      await expect(offBtn).toHaveAttribute('data-subtitle-mode', 'off');
      await expect(offBtn.locator('svg.sub-icon-off')).toBeVisible();

      // Verify default active is 'both'
      const activeBtn = toggleGroup.locator('button.btn-toggle-sub.active');
      await expect(activeBtn).toHaveAttribute('data-subtitle-mode', 'both');
    }
  });

  test('Switching subtitle modes updates container classes and visibility of English/Korean subtitles', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
    await expect(step3Tab).toBeVisible({ timeout: 5000 });
    await step3Tab.click();

    const container = page.locator('#script-list-container');
    await expect(container).toBeVisible();

    // Wait for script items to load
    const firstCard = page.locator('.script-sentence-card').first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });
    const enText = firstCard.locator('.sentence-en');
    const krText = firstCard.locator('.sentence-kr');

    // 1. Default: Both
    await expect(container).toHaveClass(/mode-both/);
    await expect(enText).toBeVisible();
    await expect(krText).toBeVisible();

    // 2. Click 'en'
    const enBtn = page.locator('button[data-subtitle-mode="en"]');
    await enBtn.click();
    await expect(enBtn).toHaveClass(/active/);
    await expect(container).toHaveClass(/mode-en-only/);
    await expect(enText).toBeVisible();
    await expect(krText).toBeHidden();

    // 3. Click 'kr'
    const krBtn = page.locator('button[data-subtitle-mode="kr"]');
    await krBtn.click();
    await expect(krBtn).toHaveClass(/active/);
    await expect(container).toHaveClass(/mode-kr-only/);
    await expect(enText).toBeHidden();
    await expect(krText).toBeVisible();

    // 4. Click 'off' (Listening mode)
    const offBtn = page.locator('button[data-subtitle-mode="off"]');
    await offBtn.click();
    await expect(offBtn).toHaveClass(/active/);
    await expect(container).toHaveClass(/mode-off/);
    await expect(enText).toBeHidden();
    await expect(krText).toBeHidden();

    // 5. Click 'both' again
    const bothBtn = page.locator('button[data-subtitle-mode="both"]');
    await bothBtn.click();
    await expect(bothBtn).toHaveClass(/active/);
    await expect(container).toHaveClass(/mode-both/);
    await expect(enText).toBeVisible();
    await expect(krText).toBeVisible();
  });

  test('Light Mode contrast: Track has slate background and active button has high contrast white background and primary border', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Light Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'light') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Navigate to Step 3
    const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
    await expect(step3Tab).toBeVisible({ timeout: 5000 });
    await step3Tab.click();

    const toggleGroup = page.locator('.script-sub-toggle-group');
    await expect(toggleGroup).toBeVisible();

    // Verify track background in light mode (#E2E8F0 = rgb(226, 232, 240))
    const trackBg = await toggleGroup.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(trackBg).toBe('rgb(226, 232, 240)');

    // Verify active button has crisp white background (#FFFFFF = rgb(255, 255, 255))
    const activeBtn = toggleGroup.locator('button.btn-toggle-sub.active');
    const activeBg = await activeBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(activeBg).toBe('rgb(255, 255, 255)');

    // Verify active button has primary border (#4F46E5 = rgb(79, 70, 229))
    const activeBorderColor = await activeBtn.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(activeBorderColor).toBe('rgb(79, 70, 229)');

    // Inactive button has transparent background
    const inactiveBtn = toggleGroup.locator('button[data-subtitle-mode="en"]');
    const inactiveBg = await inactiveBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(inactiveBg).toBe('rgba(0, 0, 0, 0)');
  });

  test('Dark Mode styling: Track and active button maintain dark theme palette with purple glow/accent', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Dark Mode
    const themeBtn = page.locator('#btn-toggle-theme');
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (initialTheme !== 'dark') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Navigate to Step 3
    const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
    await expect(step3Tab).toBeVisible({ timeout: 5000 });
    await step3Tab.click();

    const toggleGroup = page.locator('.script-sub-toggle-group');
    await expect(toggleGroup).toBeVisible();

    // Verify active button in dark mode has elevated surface (#334155 = rgb(51, 65, 85))
    const activeBtn = toggleGroup.locator('button.btn-toggle-sub.active');
    const activeBg = await activeBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(activeBg).toBe('rgb(51, 65, 85)');

    // Verify active button border in dark mode uses primary light (#818CF8 = rgb(129, 140, 248))
    const activeBorderColor = await activeBtn.evaluate(el => window.getComputedStyle(el).borderColor);
    expect(activeBorderColor).toBe('rgb(129, 140, 248)');
  });
});
