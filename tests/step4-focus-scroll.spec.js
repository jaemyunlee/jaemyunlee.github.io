const { test, expect } = require('@playwright/test');

test.describe('Button Focus and Scroll Behavior on Step 4 (Issue #27)', () => {
  test('Step 4: Clicking Copy Button scrolls smoothly to show reflection feedback description rather than scrolling to the top', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await tab4.click();

    const reflectionCard = page.locator('#reflection-card');
    const textarea = page.locator('#user-reflection-sentence');
    const copyBtn = page.locator('#btn-copy-sentence');
    const feedback = page.locator('#reflection-feedback');

    await expect(reflectionCard).toBeVisible();

    // Mock clipboard
    await page.evaluate(() => {
      window.__copiedText = null;
      navigator.clipboard.writeText = async (text) => {
        window.__copiedText = text;
        return true;
      };
    });

    // Enter a sentence to activate copy button
    await textarea.fill('Every morning, I practice English with RhyRhy English!');
    await expect(copyBtn).toBeEnabled();

    // Click copy button
    await copyBtn.click();
    await expect(feedback).toBeVisible();

    // Wait for smooth scroll animation to settle
    await page.waitForTimeout(600);

    // Verify feedback is visible in viewport and window did not scroll to top of card
    const feedbackRect = await feedback.boundingBox();
    expect(feedbackRect).not.toBeNull();
    // Feedback top should be within reasonable distance of navbar (around 70px - 150px)
    expect(feedbackRect.y).toBeLessThan(350);
    expect(feedbackRect.y).toBeGreaterThan(30);

    const scrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
    expect(scrollY).toBeGreaterThan(50); // Did not scroll to y=0 or top of page
  });

  test('Step 4: Clicking YouTube link button before copying scrolls to show encouragement description', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await tab4.click();

    const youtubeBtn = page.locator('#btn-post-comment');
    const feedback = page.locator('#reflection-feedback');

    // Mock window.open
    await page.evaluate(() => {
      window.__openedUrls = [];
      window.open = (url) => { window.__openedUrls.push(url); };
    });

    await youtubeBtn.click();
    await expect(feedback).toBeVisible();

    // Wait for smooth scroll animation to settle
    await page.waitForTimeout(600);

    const feedbackRect = await feedback.boundingBox();
    expect(feedbackRect).not.toBeNull();
    expect(feedbackRect.y).toBeLessThan(350);
    expect(feedbackRect.y).toBeGreaterThan(30);

    const scrollY = await page.evaluate(() => window.scrollY || document.documentElement.scrollTop);
    expect(scrollY).toBeGreaterThan(50);
  });

  test('Light Mode: Buttons maintain accessible high contrast across default, hover, and focus states', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Force light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('rhyrhy_theme', 'light');
    });

    // Switch to Step 4
    await page.locator('.step-tab-btn[data-step="4"]').click();

    const copyBtn = page.locator('#btn-copy-sentence');
    const youtubeBtn = page.locator('#btn-post-comment');

    // 1. Primary button (#btn-post-comment) text must be crisp white (#FFFFFF) in default and focus
    const ytColor = await youtubeBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(ytColor).toBe('rgb(255, 255, 255)');

    await youtubeBtn.focus();
    const ytFocusColor = await youtubeBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(ytFocusColor).toBe('rgb(255, 255, 255)');

    // 2. Disabled copy button text contrast in light mode
    await expect(copyBtn).toBeDisabled();
    const disabledColor = await copyBtn.evaluate((el) => window.getComputedStyle(el).color);
    // Should have subtle slate color (rgb(100, 116, 139) / var(--text-subtle)), not washed out
    expect(disabledColor).toBe('rgb(100, 116, 139)');

    // 3. Enabled copy button text contrast in light mode
    const textarea = page.locator('#user-reflection-sentence');
    await textarea.fill('Having high contrast makes buttons accessible.');
    await expect(copyBtn).toBeEnabled();

    await copyBtn.focus();
    const copyFocusColor = await copyBtn.evaluate((el) => window.getComputedStyle(el).color);
    // Should be dark slate or primary purple, never white-on-light or default purple visited
    expect(copyFocusColor).not.toBe('rgb(255, 255, 255)');
    expect(copyFocusColor).not.toBe('rgb(85, 26, 139)'); // Not browser default visited purple

    // 4. Feedback action links contrast in light mode
    await copyBtn.click();
    const nextLessonBtn = page.locator('#btn-goto-next-lesson');
    const ytCommentBtn = page.locator('#btn-goto-youtube-comment');

    await expect(nextLessonBtn).toBeVisible();
    await expect(ytCommentBtn).toBeVisible();

    const nextBtnColor = await nextLessonBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(nextBtnColor).toBe('rgb(255, 255, 255)'); // Primary button is white text

    await ytCommentBtn.focus();
    const ytCommentColor = await ytCommentBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(ytCommentColor).not.toBe('rgb(85, 26, 139)'); // Not purple visited
  });

  test('Mobile UX: pageshow event clears sticky focus from active button', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4
    await page.locator('.step-tab-btn[data-step="4"]').click();

    const youtubeBtn = page.locator('#btn-post-comment');
    await youtubeBtn.focus();

    // Verify button initially has focus
    const isFocusedBefore = await youtubeBtn.evaluate((el) => document.activeElement === el);
    expect(isFocusedBefore).toBe(true);

    // Simulate returning via back button (pageshow event from bfcache)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('pageshow'));
    });

    // Verify focus is cleared from button
    const isFocusedAfter = await youtubeBtn.evaluate((el) => document.activeElement === el);
    expect(isFocusedAfter).toBe(false);
  });
});
