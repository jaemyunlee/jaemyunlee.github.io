const { test, expect } = require('@playwright/test');

test.describe('Lesson Icon Navigation Animation & Step 2 Wake Lock (Issue #49)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('Navbar lesson button triggers flying 3D book animation with "자투리 시간에 공부해요" caption and navigates to lessons.html', async ({ page }) => {
    const lessonsBtn = page.locator('#btn-nav-lessons');
    await expect(lessonsBtn).toBeVisible({ timeout: 5000 });

    // Click the lesson icon in the navbar
    await lessonsBtn.click();

    // Flyer animation and backdrop elements appear in DOM
    const backdrop = page.locator('.lesson-flyer-backdrop');
    const flyer = page.locator('.lesson-nav-flyer');
    await expect(backdrop).toBeVisible({ timeout: 2000 });
    await expect(flyer).toBeVisible({ timeout: 2000 });

    // Verify HD image source and caption text
    const hdImg = flyer.locator('.lesson-flyer-hd-img');
    await expect(hdImg).toBeVisible();
    await expect(hdImg).toHaveAttribute('src', /assets\/img\/lesson-book-hd\.png$/);

    const caption = flyer.locator('.lesson-flyer-caption');
    await expect(caption).toBeVisible();
    await expect(caption).toHaveText('자투리 시간에 공부해요');

    // Smooth navigation proceeds to lessons.html
    await page.waitForURL('**/lessons.html', { timeout: 5000 });
    expect(page.url()).toContain('lessons.html');

    // On lessons.html, the lessons nav button has active class
    const activeLessonsNav = page.locator('#btn-nav-lessons');
    await expect(activeLessonsNav).toHaveClass(/active/);
  });

  test('Clicking navbar lesson button on lessons.html triggers transition animation and scrolls to top', async ({ page }) => {
    await page.goto('/lessons.html');

    // Scroll down the page first
    await page.evaluate(() => window.scrollTo(0, 500));
    const initialScrollY = await page.evaluate(() => window.scrollY);
    expect(initialScrollY).toBeGreaterThan(0);

    const lessonsBtn = page.locator('#btn-nav-lessons');
    await expect(lessonsBtn).toBeVisible();
    await lessonsBtn.click();

    // Verify transition flyer is created
    const flyer = page.locator('.lesson-nav-flyer');
    await expect(flyer).toBeVisible({ timeout: 2000 });
    const caption = flyer.locator('.lesson-flyer-caption');
    await expect(caption).toHaveText('자투리 시간에 공부해요');

    // Wait for flyer transition and smooth scroll animation to finish reaching top
    await page.waitForFunction(() => window.scrollY === 0, { timeout: 4000 });
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);
  });

  test('Caption badge respects Dark and Light theme styling with WCAG AA contrast', async ({ page }) => {
    // 1. Dark Mode check
    await page.goto('/index.html');
    const themeBtn = page.locator('#btn-toggle-theme');
    const currentTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    if (currentTheme !== 'dark') {
      await themeBtn.click();
    }
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Trigger transition programmatically or via click to inspect styles
    await page.evaluate(() => {
      const btn = document.getElementById('btn-nav-lessons');
      if (typeof App !== 'undefined') {
        App.triggerLessonsTransition(btn, null);
      }
    });

    const darkCaption = page.locator('.lesson-flyer-caption');
    await expect(darkCaption).toBeVisible();
    const darkTextColor = await darkCaption.evaluate(el => window.getComputedStyle(el).color);
    expect(darkTextColor).toBe('rgb(255, 255, 255)');

    // 2. Light Mode check
    await page.waitForTimeout(700); // Wait for previous flyer to finish
    await themeBtn.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.evaluate(() => {
      const btn = document.getElementById('btn-nav-lessons');
      if (typeof App !== 'undefined') {
        App.triggerLessonsTransition(btn, null);
      }
    });

    const lightCaption = page.locator('.lesson-flyer-caption');
    await expect(lightCaption).toBeVisible();
    const lightTextColor = await lightCaption.evaluate(el => window.getComputedStyle(el).color);
    // In light mode, high-contrast dark slate text is #0F172A (rgb(15, 23, 42))
    expect(lightTextColor).toBe('rgb(15, 23, 42)');
  });

  test('Step 2 ReviewPlayer acquires screen wake lock during audio playback and releases on pause/stop', async ({ page }) => {
    // Inject mock wakeLock before page scripts run
    await page.addInitScript(() => {
      window.__wakeLockRequests = [];
      window.__wakeLockReleasedCount = 0;

      const mockSentinel = {
        released: false,
        release: async function() {
          this.released = true;
          window.__wakeLockReleasedCount++;
          if (typeof this.onrelease === 'function') this.onrelease();
          this.dispatchEvent(new Event('release'));
        },
        addEventListener: function(type, listener) {
          if (type === 'release') {
            this._listener = listener;
          }
        },
        dispatchEvent: function(event) {
          if (this._listener) this._listener(event);
        }
      };

      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: async function(type) {
            window.__wakeLockRequests.push(type);
            mockSentinel.released = false;
            return mockSentinel;
          }
        },
        configurable: true,
        writable: true
      });
    });

    // Navigate to lesson-01 Step 2
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 2 (핵심 문장 / ReviewPlayer)
    const step2Tab = page.locator('.step-tab-btn[data-step="2"]');
    await expect(step2Tab).toBeVisible({ timeout: 5000 });
    await step2Tab.click();

    // Verify ReviewPlayer container is visible
    const reviewList = page.locator('.review-sentence-list');
    await expect(reviewList).toBeVisible();

    // Click first sentence card play button to start playback
    const firstPlayBtn = page.locator('.btn-card-play[data-play-index="0"]');
    await expect(firstPlayBtn).toBeVisible();
    await firstPlayBtn.click();

    // Assert wakeLock.request('screen') was called
    await page.waitForFunction(() => (window.__wakeLockRequests || []).length > 0, { timeout: 3000 });
    const requestsAfterPlay = await page.evaluate(() => window.__wakeLockRequests);
    expect(requestsAfterPlay).toContain('screen');

    // Pause audio playback via pause button
    const toggleBtn = page.locator('#btn-player-toggle');
    await expect(toggleBtn).toBeVisible();
    await toggleBtn.click();

    // Assert wakeLock sentinel release was invoked
    await page.waitForFunction(() => window.__wakeLockReleasedCount > 0, { timeout: 3000 });
    const releasesAfterPause = await page.evaluate(() => window.__wakeLockReleasedCount);
    expect(releasesAfterPause).toBeGreaterThanOrEqual(1);
  });

  test('Step 2 ReviewPlayer re-requests wake lock when tab visibility becomes visible during active playback', async ({ page }) => {
    await page.addInitScript(() => {
      window.__wakeLockRequests = [];
      window.__wakeLockReleasedCount = 0;

      const mockSentinel = {
        released: false,
        release: async function() {
          this.released = true;
          window.__wakeLockReleasedCount++;
        },
        addEventListener: function() {}
      };

      Object.defineProperty(navigator, 'wakeLock', {
        value: {
          request: async function(type) {
            window.__wakeLockRequests.push(type);
            return mockSentinel;
          }
        },
        configurable: true,
        writable: true
      });
    });

    await page.goto('/lessons/lesson-01/index.html');

    // Go to Step 2
    const step2Tab = page.locator('.step-tab-btn[data-step="2"]');
    await step2Tab.click();

    // Play first sentence via play button
    const firstPlayBtn = page.locator('.btn-card-play[data-play-index="0"]');
    await expect(firstPlayBtn).toBeVisible();
    await firstPlayBtn.click();

    await page.waitForFunction(() => (window.__wakeLockRequests || []).length > 0, { timeout: 3000 });
    const initialRequestCount = await page.evaluate(() => window.__wakeLockRequests.length);
    expect(initialRequestCount).toBeGreaterThanOrEqual(1);

    // Simulate tab becoming visible again while isPlaying is true
    await page.evaluate(() => {
      // Clear previous wakeLock instance to simulate system release on backgrounding
      if (window.reviewPlayer) {
        window.reviewPlayer._wakeLock = null;
      }
      // Dispatch visibilitychange event with visible state
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page.waitForFunction((count) => window.__wakeLockRequests.length > count, initialRequestCount, { timeout: 3000 });
    const requestsAfterVisible = await page.evaluate(() => window.__wakeLockRequests.length);
    expect(requestsAfterVisible).toBeGreaterThan(initialRequestCount);
  });
});
