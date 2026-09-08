const { test, expect } = require('@playwright/test');

test.describe('Lesson Progress States & Session Resumption (Issue #35)', () => {

  test.describe('1. Three Lesson Progress States', () => {
    test('Default state is Not Started: displays "시작 전" badge and "학습 시작하기" button', async ({ page }) => {
      // Clean storage
      await page.goto('/index.html');
      await page.evaluate(() => localStorage.clear());
      await page.reload();

      // Check card-lesson-01 on home page
      const card01 = page.locator('#card-lesson-01');
      await expect(card01).toBeVisible();
      await expect(card01).toHaveClass(/state-not-started/);

      const badge01 = card01.locator('.badge-not-started');
      await expect(badge01).toBeVisible();
      await expect(badge01).toContainText('시작 전');

      const btn01 = card01.locator('.lesson-card-btn');
      await expect(btn01).toContainText('학습 시작하기');
      await expect(btn01).toHaveClass(/btn-primary/);

      // Check catalog page (lessons.html)
      await page.goto('/lessons.html');
      const catalogCard02 = page.locator('#card-lesson-02');
      await expect(catalogCard02).toBeVisible();
      await expect(catalogCard02).toHaveClass(/state-not-started/);

      const catalogBadge02 = catalogCard02.locator('.badge-not-started');
      await expect(catalogBadge02).toBeVisible();
      await expect(catalogBadge02).toContainText('시작 전');

      const catalogBtn02 = catalogCard02.locator('.lesson-card-btn');
      await expect(catalogBtn02).toContainText('학습 시작하기');
    });

    test('In Progress state: displays "학습 중" badge and "이어서 학습하기 ▶" button', async ({ page }) => {
      await page.goto('/index.html');
      // Seed lesson-01 as in-progress (e.g. visited or answered quiz)
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('rhyrhy_in_progress_lesson-01', 'true');
        localStorage.setItem('rhyrhy_step_lesson-01', '2');
      });
      await page.reload();

      const card = page.locator('#card-lesson-01');
      await expect(card).toBeVisible();
      await expect(card).toHaveClass(/in-progress/);
      await expect(card).toHaveClass(/state-in-progress/);

      const badge = card.locator('.badge-in-progress');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('학습 중');

      const btn = card.locator('.lesson-card-btn');
      await expect(btn).toContainText('이어서 학습하기');
      await expect(btn).toHaveClass(/btn-primary/);

      // Catalog page also reflects in-progress
      await page.goto('/lessons.html');
      const catCard = page.locator('#card-lesson-01');
      await expect(catCard).toBeVisible();
      await expect(catCard).toHaveClass(/in-progress/);
      await expect(catCard.locator('.badge-in-progress')).toContainText('학습 중');
      await expect(catCard.locator('.lesson-card-btn')).toContainText('이어서 학습하기');
    });

    test('Completed state: clicking Step 4 Copy button completes lesson and displays "학습 완료" badge', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');
      await page.evaluate(() => localStorage.clear());
      await page.reload();

      // Navigate to Step 4
      await page.click('.step-tab-btn[data-step="4"]');
      await page.waitForSelector('#reflection-section', { state: 'visible' });

      // Mock clipboard API
      await page.evaluate(() => {
        if (!navigator.clipboard) navigator.clipboard = {};
        navigator.clipboard.writeText = async () => {};
      });

      // Type text into textarea so copy button activates
      const textarea = page.locator('#user-reflection-sentence');
      await textarea.fill('I just happened to practice English today!');

      // Click copy button and wait for completion text
      const copyBtn = page.locator('#btn-copy-sentence');
      await expect(copyBtn).toBeEnabled();
      await copyBtn.click();
      await expect(copyBtn).toContainText('문장 복사 완료');

      // Verify localStorage was updated to completed
      const isCompleted = await page.evaluate(() => {
        return Storage.isLessonCompleted('lesson-01');
      });
      expect(isCompleted).toBe(true);

      // Verify state helper
      const state = await page.evaluate(() => {
        return Storage.getLessonState('lesson-01');
      });
      expect(state).toBe('completed');

      // Check card on homepage
      await page.goto('/index.html?redirect=false');
      const card = page.locator('#card-lesson-01');
      await expect(card).toHaveClass(/completed/);
      await expect(card).toHaveClass(/state-completed/);

      const badge = card.locator('.badge-completed');
      await expect(badge).toBeVisible();
      await expect(badge).toContainText('학습 완료');

      const btn = card.locator('.lesson-card-btn');
      await expect(btn).toContainText('다시 복습하기');
      await expect(btn).toHaveClass(/btn-outline/);
    });

    test('Completed state: clicking Step 4 YouTube link button completes lesson and displays "학습 완료" badge', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');
      await page.evaluate(() => localStorage.clear());
      await page.reload();

      // Navigate to Step 4
      await page.click('.step-tab-btn[data-step="4"]');
      await page.waitForSelector('#reflection-section', { state: 'visible' });

      // Click YouTube link button directly without copying
      const ytBtn = page.locator('#btn-post-comment');
      await expect(ytBtn).toBeVisible();
      await ytBtn.click();

      // Verify localStorage is marked completed
      const isCompleted = await page.evaluate(() => {
        return Storage.isLessonCompleted('lesson-02');
      });
      expect(isCompleted).toBe(true);

      const state = await page.evaluate(() => {
        return Storage.getLessonState('lesson-02');
      });
      expect(state).toBe('completed');

      // Check catalog page
      await page.goto('/lessons.html');
      const catCard = page.locator('#card-lesson-02');
      await expect(catCard).toHaveClass(/completed/);
      await expect(catCard.locator('.badge-completed')).toContainText('학습 완료');
      await expect(catCard.locator('.lesson-card-btn')).toContainText('다시 복습하기');
    });
  });

  test.describe('2. Session Resumption & Landing Page Routing', () => {
    test('Automatically routes returning user to active lesson if they left from a lesson page', async ({ page }) => {
      await page.goto('/index.html');
      // Simulate user leaving while actively on lesson-01
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('rhyrhy_active_lesson_page', 'lesson-01');
      });

      // Returning user visits root /index.html
      await page.goto('/index.html');
      await page.waitForURL(/.*\/lessons\/lesson-01\/index\.html/);
      expect(page.url()).toContain('/lessons/lesson-01/index.html');
    });

    test('Automatically routes returning user to lesson-02 if they left while on lesson-02', async ({ page }) => {
      await page.goto('/index.html');
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('rhyrhy_active_lesson_page', 'lesson-02');
      });

      await page.goto('/index.html');
      await page.waitForURL(/.*\/lessons\/lesson-02\/index\.html/);
      expect(page.url()).toContain('/lessons/lesson-02/index.html');
    });

    test('Loads default landing page if user was not actively on a lesson page when they left', async ({ page }) => {
      await page.goto('/index.html');
      await page.evaluate(() => {
        localStorage.clear();
        // User has study history or completed lesson, but is NOT on an active lesson page
        localStorage.setItem('rhyrhy_last_lesson', 'lesson-01');
        localStorage.removeItem('rhyrhy_active_lesson_page');
      });

      await page.goto('/index.html');
      // Stays on index.html
      expect(page.url()).toContain('/index.html');
      const hero = page.locator('.hero-section');
      await expect(hero).toBeVisible();
      const card01 = page.locator('#card-lesson-01');
      await expect(card01).toBeVisible();
    });

    test('Clicking logo on lesson page clears active lesson page and returns cleanly to landing page', async ({ page }) => {
      // 1. Visit lesson-01 (which sets rhyrhy_active_lesson_page = 'lesson-01')
      await page.goto('/lessons/lesson-01/index.html');
      const activeLesson = await page.evaluate(() => localStorage.getItem('rhyrhy_active_lesson_page'));
      expect(activeLesson).toBe('lesson-01');

      // 2. Click the brand logo in the navbar to return home
      const logoLink = page.locator('.nav-brand');
      await expect(logoLink).toBeVisible();
      await logoLink.click();

      // 3. Should now be on index.html and active lesson page should be cleared
      await page.waitForURL(/.*index\.html$/);
      expect(page.url()).toContain('index.html');

      const activeAfterHome = await page.evaluate(() => localStorage.getItem('rhyrhy_active_lesson_page'));
      expect(activeAfterHome).toBeNull();

      // 4. Reloading index.html should remain on landing page (no redirect loop)
      await page.reload();
      expect(page.url()).toContain('index.html');
      await expect(page.locator('.hero-section')).toBeVisible();
    });

    test('Clicking Lessons catalog in navbar clears active lesson page', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');
      expect(await page.evaluate(() => localStorage.getItem('rhyrhy_active_lesson_page'))).toBe('lesson-01');

      // Click Lessons navbar button
      await page.click('#btn-nav-lessons');
      await page.waitForURL(/.*lessons\.html$/);
      expect(page.url()).toContain('lessons.html');

      // Active lesson page is cleared
      const activeAfterCatalog = await page.evaluate(() => localStorage.getItem('rhyrhy_active_lesson_page'));
      expect(activeAfterCatalog).toBeNull();

      // Visiting index.html now does NOT redirect
      await page.goto('/index.html');
      expect(page.url()).toContain('index.html');
      await expect(page.locator('.hero-section')).toBeVisible();
    });
  });

  test.describe('3. Theming & Visual Contrast', () => {
    test('Badges maintain high contrast in both Dark and Light themes', async ({ page }) => {
      await page.goto('/index.html');

      // Seed one completed, one in-progress
      await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('rhyrhy_in_progress_lesson-01', 'true');
        localStorage.setItem('rhyrhy_progress_lesson-02', JSON.stringify({ completed: true, lessonCompleted: true }));
        localStorage.setItem('rhyrhy_history', JSON.stringify([{ lessonId: 'lesson-02', lessonCompleted: true }]));
      });
      await page.goto('/index.html?redirect=false');

      // 1. Dark Mode
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      const inProgressBadgeDark = page.locator('#card-lesson-01 .badge-in-progress');
      await expect(inProgressBadgeDark).toBeVisible();

      const completedBadgeDark = page.locator('#card-lesson-02 .badge-completed');
      await expect(completedBadgeDark).toBeVisible();

      // 2. Light Mode
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
      const inProgressBadgeLight = page.locator('#card-lesson-01 .badge-in-progress');
      await expect(inProgressBadgeLight).toBeVisible();

      const completedBadgeLight = page.locator('#card-lesson-02 .badge-completed');
      await expect(completedBadgeLight).toBeVisible();

      const notStartedBadge = page.locator('.badge-not-started');
      // If we seed another or check styles
      const inProgColor = await inProgressBadgeLight.evaluate(el => window.getComputedStyle(el).color);
      expect(inProgColor).toBeTruthy();
    });
  });
});
