const { test, expect } = require('@playwright/test');

test.describe('Quiz Share Functionality (Issue #11)', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('Quiz share button exists, is clickable, and shows feedback without runtime error', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/lessons/lesson-01/index.html');

    // Wait for quiz container to load
    const shareBtn = page.locator('#quiz-share-btn');
    await expect(shareBtn).toBeVisible({ timeout: 5000 });

    // Initial state check
    await expect(shareBtn).toContainText('공유하기');

    // Click the share button
    await shareBtn.click();

    // Verify no unhandled exceptions occurred (e.g. ReferenceError: text is not defined)
    expect(pageErrors).toHaveLength(0);

    // Verify visual button feedback
    await expect(shareBtn).toHaveClass(/copied/);
    await expect(shareBtn).toContainText('복사됨! ✓');

    // Verify toast notification appears
    const toast = page.locator('.toast-notification, .save-toast-notification');
    await expect(toast).toBeVisible({ timeout: 3000 });
    await expect(toast).toContainText('퀴즈 공유 링크가 복사되었습니다');

    // Verify clipboard content
    const clipboardText = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (_) {
        return '';
      }
    });
    if (clipboardText) {
      expect(clipboardText).toMatch(/\/quiz\/lesson-01\/q1\.html/);
    }
  });

  test('All question types have working share buttons across multiple questions', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/lessons/lesson-01/index.html');

    // Question 1: Multiple choice
    const shareBtn = page.locator('#quiz-share-btn');
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();
    expect(pageErrors).toHaveLength(0);
    await expect(shareBtn).toHaveClass(/copied/);

    // Answer Quiz 1 to advance or click next
    // Answer Quiz 1 (select any choice to advance or answer correctly)
    const choiceBtn = page.locator('.choice-btn').first();
    await choiceBtn.click();

    // If check answer is required or next button appears
    const nextBtn = page.locator('#btn-next-question');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // Question 2: Verify share button exists and works
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();
    expect(pageErrors).toHaveLength(0);
    await expect(shareBtn).toHaveClass(/copied/);
  });

  test('Standalone quiz page share button works properly', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/quiz/lesson-01/q3.html');

    const standaloneShareBtn = page.locator('#btn-page-share');
    await expect(standaloneShareBtn).toBeVisible({ timeout: 5000 });

    await standaloneShareBtn.click();
    expect(pageErrors).toHaveLength(0);

    // Verify button visual feedback
    await expect(standaloneShareBtn).toHaveClass(/copied/);
    await expect(standaloneShareBtn).toContainText('복사됨! ✓');

    // Verify toast
    const toast = page.locator('.save-toast-notification');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('복사되었습니다');
  });
});
