import { test, expect } from '@playwright/test';

test.describe('Quiz Hint Contrast & Theming (Issue #25)', () => {
  test('Light Mode: Hints have high contrast, warm amber theme, and clear legibility', async ({ page }) => {
    // Seed light theme and jump to fill-in-the-blank question (Quiz 11)
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_theme', 'light');
      localStorage.setItem('rhyrhy_progress_lesson-01', JSON.stringify({
        currentQuestionIndex: 10
      }));
    });

    await page.goto('/lessons/lesson-01/index.html');

    // Ensure theme is light
    const htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(htmlTheme).toBe('light');

    // Click hint button
    const hintBtn = page.locator('#btn-hint');
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();

    const hintBox = page.locator('#quiz-hint-box');
    await expect(hintBox).toBeVisible();

    // Verify hint box has light amber background and border
    const hintBoxStyles = await page.evaluate(() => {
      const box = document.querySelector('.quiz-hint-box');
      return {
        bg: window.getComputedStyle(box).backgroundColor,
        border: window.getComputedStyle(box).borderColor,
      };
    });
    expect(hintBoxStyles.bg).toBe('rgb(254, 243, 199)'); // #FEF3C7

    // Verify revealed characters have deep high-contrast amber color (not washed-out light yellow)
    const revealedChar = page.locator('.hint-char.revealed').first();
    await expect(revealedChar).toBeVisible();
    const revealedColor = await revealedChar.evaluate((el) => window.getComputedStyle(el).color);
    expect(revealedColor).toBe('rgb(146, 64, 14)'); // #92400E (contrast 8:1 on white, passes WCAG AAA)

    // Verify blank placeholders have high-contrast dark slate color
    const blankChar = page.locator('.hint-char.blank').first();
    await expect(blankChar).toBeVisible();
    const blankColor = await blankChar.evaluate((el) => window.getComputedStyle(el).color);
    expect(blankColor).toBe('rgb(51, 65, 85)'); // #334155 (contrast 9.6:1 on white)

    // Verify hint word pill has solid white background
    const hintWord = page.locator('.hint-word').first();
    await expect(hintWord).toBeVisible();
    const wordBg = await hintWord.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(wordBg).toBe('rgb(255, 255, 255)');

    // Verify hint label is deep amber
    const hintLabel = page.locator('.hint-label');
    await expect(hintLabel).toBeVisible();
    const labelColor = await hintLabel.evaluate((el) => window.getComputedStyle(el).color);
    expect(labelColor).toBe('rgb(146, 64, 14)');
  });

  test('Light Mode: Multiple choice sub-hint text has accessible high contrast', async ({ page }) => {
    // Seed light theme and Quiz 1 (multiple-choice)
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_theme', 'light');
      localStorage.setItem('rhyrhy_progress_lesson-01', JSON.stringify({
        currentQuestionIndex: 0
      }));
    });

    await page.goto('/lessons/lesson-01/index.html');

    const subHint = page.locator('.sub-hint-text');
    await expect(subHint).toBeVisible();
    await expect(subHint).toContainText('알맞은 보기를 선택하면');

    const subHintColor = await subHint.evaluate((el) => window.getComputedStyle(el).color);
    expect(subHintColor).toBe('rgb(71, 85, 105)'); // #475569 (contrast 5.8:1, passes WCAG AA)
  });

  test('Dark Mode: Hints preserve golden-amber glow and proper styling', async ({ page }) => {
    // Seed dark theme and jump to fill-in-the-blank question (Quiz 11)
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_theme', 'dark');
      localStorage.setItem('rhyrhy_progress_lesson-01', JSON.stringify({
        currentQuestionIndex: 10
      }));
    });

    await page.goto('/lessons/lesson-01/index.html');

    const hintBtn = page.locator('#btn-hint');
    await expect(hintBtn).toBeVisible();
    await hintBtn.click();

    const revealedChar = page.locator('.hint-char.revealed').first();
    await expect(revealedChar).toBeVisible();
    const revealedColor = await revealedChar.evaluate((el) => window.getComputedStyle(el).color);
    expect(revealedColor).toBe('rgb(254, 240, 138)'); // #FEF08A (bright gold on dark surface)
  });
});
