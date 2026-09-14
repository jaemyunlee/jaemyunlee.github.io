const { test, expect } = require('@playwright/test');

test.describe('Lesson Hidden Status & Popcorn Daily Limit Bypass', () => {

  test('Hidden status default: Lesson 04 is omitted from catalog and index, count is 3', async ({ page }) => {
    // Clear storage to test clean state
    await page.goto('http://localhost:8855/lessons.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_show_hidden_lessons');
      localStorage.removeItem('rhyrhy_ignore_popcorn_limit');
    });
    await page.reload();

    // 1. Check lessons.html catalog
    const card04 = page.locator('#card-lesson-04');
    await expect(card04).toHaveCount(0);

    const countEl = page.locator('#total-lessons-count');
    await expect(countEl).toHaveText('3');

    // 2. Check index.html latest lessons grid
    await page.goto('http://localhost:8855/index.html');
    const indexCard04 = page.locator('#lessons-cards-container #card-lesson-04');
    await expect(indexCard04).toHaveCount(0);
  });

  test('Navbar red N badge: Hidden lesson does not trigger new lesson indicator', async ({ page }) => {
    await page.goto('http://localhost:8855/index.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_show_hidden_lessons');
      // Mark lessons 1, 2, 3 as seen
      localStorage.setItem('rhyrhy_seen_lessons', JSON.stringify(['lesson-01', 'lesson-02', 'lesson-03']));
    });
    await page.reload();

    const badge = page.locator('#nav-lessons-badge');
    await expect(badge).toHaveCount(0);
  });

  test('Direct URL access works cleanly for hidden lesson', async ({ page }) => {
    await page.goto('http://localhost:8855/lessons/lesson-04/index.html');

    // Header badge and elements load properly
    const headerSection = page.locator('.lesson-header-section');
    await expect(headerSection).toBeVisible();
    await expect(headerSection).toContainText('Lesson 04');

    const quizSection = page.locator('#quiz-section');
    await expect(quizSection).toBeVisible();

    const quizContainer = page.locator('#quiz-container');
    await expect(quizContainer).toBeVisible();
  });

  test('Hidden status bypass via localStorage: Lesson 04 appears with [비공개 (테스트)] badge', async ({ page }) => {
    await page.goto('http://localhost:8855/lessons.html');
    await page.evaluate(() => {
      localStorage.setItem('rhyrhy_show_hidden_lessons', 'true');
    });
    await page.reload();

    const card04 = page.locator('#card-lesson-04');
    await expect(card04).toBeVisible();

    const hiddenBadge = card04.locator('.badge-hidden');
    await expect(hiddenBadge).toBeVisible();
    await expect(hiddenBadge).toContainText('비공개 (테스트)');

    const countEl = page.locator('#total-lessons-count');
    await expect(countEl).toHaveText('4');
  });

  test('Hidden status bypass via query parameter ?show_hidden=true', async ({ page }) => {
    await page.goto('http://localhost:8855/lessons.html?show_hidden=true');

    const card04 = page.locator('#card-lesson-04');
    await expect(card04).toBeVisible();
    await expect(card04.locator('.badge-hidden')).toBeVisible();
  });

  test('App.enableDevTesting() and App.disableDevTesting() dynamically toggle hidden lessons and count', async ({ page }) => {
    await page.goto('http://localhost:8855/lessons.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_show_hidden_lessons');
      localStorage.removeItem('rhyrhy_ignore_popcorn_limit');
    });
    await page.reload();

    // Default: card 04 not visible
    await expect(page.locator('#card-lesson-04')).toHaveCount(0);
    await expect(page.locator('#total-lessons-count')).toHaveText('3');

    // Turn ON dev mode dynamically
    await page.evaluate(() => window.App.enableDevTesting());

    await expect(page.locator('#card-lesson-04')).toBeVisible();
    await expect(page.locator('#total-lessons-count')).toHaveText('4');

    // Turn OFF dev mode dynamically
    await page.evaluate(() => window.App.disableDevTesting());

    await expect(page.locator('#card-lesson-04')).toHaveCount(0);
    await expect(page.locator('#total-lessons-count')).toHaveText('3');
  });

  test('Popcorn daily limit bypass via localStorage (rhyrhy_ignore_popcorn_limit)', async ({ page }) => {
    await page.goto('http://localhost:8855/daily.html');

    // Simulate hitting the daily 10-lesson limit
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_ignore_popcorn_limit');
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('rhyrhy_popcorn_daily_study', JSON.stringify({
        date: today,
        count: 10
      }));
    });
    await page.reload();

    // Limit screen should be shown
    const completionCard = page.locator('.popcorn-completion-card');
    await expect(completionCard).toBeVisible();

    // Enable bypass flag
    await page.evaluate(() => {
      localStorage.setItem('rhyrhy_ignore_popcorn_limit', 'true');
    });
    await page.reload();

    // With bypass, quiz check card should be rendered instead of completion card
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
  });

  test('Popcorn daily limit bypass via URL query param ?ignore_popcorn_limit=true', async ({ page }) => {
    await page.goto('http://localhost:8855/daily.html');
    await page.evaluate(() => {
      localStorage.removeItem('rhyrhy_ignore_popcorn_limit');
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem('rhyrhy_popcorn_daily_study', JSON.stringify({
        date: today,
        count: 10
      }));
    });

    // Navigating with query param bypasses the limit
    await page.goto('http://localhost:8855/daily.html?ignore_popcorn_limit=true');
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
  });

  test('Badge hidden contrast in dark and light modes', async ({ page }) => {
    await page.goto('http://localhost:8855/lessons.html?show_hidden=true');

    const badge = page.locator('#card-lesson-04 .badge-hidden');
    await expect(badge).toBeVisible();

    // Dark mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const darkColor = await badge.evaluate(el => window.getComputedStyle(el).color);
    expect(darkColor).toBeTruthy();

    // Light mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const lightColor = await badge.evaluate(el => window.getComputedStyle(el).color);
    expect(lightColor).toBeTruthy();
  });

});
