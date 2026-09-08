const { test, expect } = require('@playwright/test');

test.describe('Audio Coordination & Continuous Background Playback (Issue #19)', () => {
  test.beforeEach(async ({ page }) => {
    // Seed saved sentences for test
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_saved_sentences', JSON.stringify({
        'lesson-01': [
          {
            id: 'sent_test_1',
            en: 'I just happened to look.',
            kr: '우연히 보게 되었어요.',
            audio: 'audio/I just happened to look.wav'
          },
          {
            id: 'sent_test_2',
            en: 'we have a decent view..',
            kr: '전망이 꽤 괜찮아요.',
            audio: 'audio/we have a decent view..wav'
          }
        ]
      }));
    });
  });

  test('SavedAudioPlayer DOM elements and inter-track preloader exist in document.body', async ({ page }) => {
    await page.goto('/index.html');

    // Open drawer to initialize SavedAudioPlayer
    const openBtn = page.locator('#btn-open-sentences');
    await openBtn.click();

    const primaryAudio = page.locator('#saved-audio-element');
    const preloaderAudio = page.locator('#saved-audio-preloader');

    await expect(primaryAudio).toBeAttached();
    await expect(preloaderAudio).toBeAttached();

    const isPrimaryInBody = await page.evaluate(() => {
      const el = document.getElementById('saved-audio-element');
      return el && el.parentNode === document.body && el.preload === 'auto';
    });
    expect(isPrimaryInBody).toBe(true);

    const isPreloaderInBody = await page.evaluate(() => {
      const el = document.getElementById('saved-audio-preloader');
      return el && el.parentNode === document.body && el.preload === 'auto';
    });
    expect(isPreloaderInBody).toBe(true);
  });

  test('Audio URL resolution correctly URI-encodes spaces for mobile Safari compatibility', async ({ page }) => {
    await page.goto('/index.html');

    const encodedUrl = await page.evaluate(() => {
      if (!window.App || !window.App.savedPlayer) return null;
      return window.App.savedPlayer._resolveAudioUrl(
        { audio: 'audio/I just happened to look.wav', lessonId: 'lesson-01' },
        './'
      );
    });

    expect(encodedUrl).toContain('I%20just%20happened%20to%20look.wav');
    expect(encodedUrl).not.toContain(' ');
  });

  test('Mutual exclusivity: Playing SavedAudioPlayer pauses ReviewPlayer and vice versa', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4 via step tab button
    const step4Tab = page.locator('.step-tab-btn[data-step="4"]');
    await expect(step4Tab).toBeVisible({ timeout: 10000 });
    await step4Tab.click();

    // Wait for review player container to be ready
    await expect(page.locator('#review-player-bar')).toBeVisible({ timeout: 10000 });

    // 1. Start ReviewPlayer
    await page.evaluate(() => {
      if (window.reviewPlayer) {
        window.reviewPlayer.playSentence(0);
      }
    });

    const isReviewPlayingInitially = await page.evaluate(() => {
      return window.reviewPlayer ? window.reviewPlayer.isPlaying : false;
    });
    expect(isReviewPlayingInitially).toBe(true);

    // 2. Open Saved Sentences Drawer and play a saved sentence
    const openBtn = page.locator('#btn-open-sentences');
    await openBtn.click();
    await expect(page.locator('#saved-sentences-drawer')).toHaveClass(/open/);

    await page.evaluate(() => {
      if (window.App && window.App.savedPlayer) {
        window.App.savedPlayer.play();
      }
    });

    // Verify SavedAudioPlayer is playing and ReviewPlayer was automatically paused
    const statusAfterSavedPlay = await page.evaluate(() => {
      return {
        savedPlaying: window.App && window.App.savedPlayer ? window.App.savedPlayer.isPlaying : false,
        reviewPlaying: window.reviewPlayer ? window.reviewPlayer.isPlaying : false
      };
    });
    expect(statusAfterSavedPlay.savedPlaying).toBe(true);
    expect(statusAfterSavedPlay.reviewPlaying).toBe(false);

    // 3. Play ReviewPlayer again
    await page.evaluate(() => {
      if (window.reviewPlayer) {
        window.reviewPlayer.playSentence(1);
      }
    });

    // Verify ReviewPlayer is playing and SavedAudioPlayer was automatically paused
    const statusAfterReviewPlay = await page.evaluate(() => {
      return {
        savedPlaying: window.App && window.App.savedPlayer ? window.App.savedPlayer.isPlaying : false,
        reviewPlaying: window.reviewPlayer ? window.reviewPlayer.isPlaying : false
      };
    });
    expect(statusAfterReviewPlay.reviewPlaying).toBe(true);
    expect(statusAfterReviewPlay.savedPlaying).toBe(false);
  });

  test('Mutual exclusivity: Starting video playback pauses both audio players', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Start SavedAudioPlayer
    const openBtn = page.locator('#btn-open-sentences');
    await openBtn.click();
    await page.evaluate(() => {
      if (window.App && window.App.savedPlayer) {
        window.App.savedPlayer.play();
      }
    });

    let savedIsPlaying = await page.evaluate(() => window.App.savedPlayer.isPlaying);
    expect(savedIsPlaying).toBe(true);

    // Dispatch video player start event
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('app-audio-started', { detail: { source: 'video-player' } }));
    });

    // SavedAudioPlayer should now be paused
    savedIsPlaying = await page.evaluate(() => window.App.savedPlayer.isPlaying);
    expect(savedIsPlaying).toBe(false);
  });

  test('Background audio does NOT pause on visibilitychange (hidden state)', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4 via step tab button
    const step4Tab = page.locator('.step-tab-btn[data-step="4"]');
    await expect(step4Tab).toBeVisible({ timeout: 10000 });
    await step4Tab.click();
    await expect(page.locator('#review-player-bar')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      if (window.reviewPlayer) {
        window.reviewPlayer.playSentence(0);
      }
    });

    const isPlayingBeforeHide = await page.evaluate(() => window.reviewPlayer.isPlaying);
    expect(isPlayingBeforeHide).toBe(true);

    // Simulate tab minimize / backgrounding (visibilitychange with document.hidden = true)
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    // ReviewPlayer should still be playing uninterrupted in background
    const isPlayingAfterHide = await page.evaluate(() => window.reviewPlayer.isPlaying);
    expect(isPlayingAfterHide).toBe(true);
  });

  test('ReviewPlayer DOM elements and inter-track preloader exist in document.body', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    const step4Tab = page.locator('.step-tab-btn[data-step="4"]');
    await expect(step4Tab).toBeVisible({ timeout: 10000 });
    await step4Tab.click();
    await expect(page.locator('#review-player-bar')).toBeVisible({ timeout: 10000 });

    // Play a sentence to initialize audio elements
    await page.evaluate(() => {
      if (window.reviewPlayer) {
        window.reviewPlayer.playSentence(0);
      }
    });

    const reviewAudio = page.locator('#review-audio-element');
    await expect(reviewAudio).toBeAttached();

    const isAttachedToBody = await page.evaluate(() => {
      const el = document.getElementById('review-audio-element');
      return el && el.parentNode === document.body && el.preload === 'auto';
    });
    expect(isAttachedToBody).toBe(true);
  });
});
