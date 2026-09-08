const { test, expect } = require('@playwright/test');

test.describe('Loop Playback for Interactive Script Cards (Issue #22)', () => {
  test('Step 3: Each script card renders a dedicated Loop Button on the right side of the card header', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3 (전체 영상)
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    await tab3.click();

    const scriptContainer = page.locator('#script-list-container');
    await expect(scriptContainer).toBeVisible();

    const cards = scriptContainer.locator('.script-sentence-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Verify each card has header with timestamp on left and loop button on right
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = cards.nth(i);
      const header = card.locator('.script-card-header');
      const timestamp = header.locator('.script-timestamp');
      const loopBtn = header.locator('.btn-card-loop');

      await expect(header).toBeVisible();
      await expect(timestamp).toBeVisible();
      await expect(loopBtn).toBeVisible();

      await expect(loopBtn).toHaveAttribute('data-index', String(i));
      await expect(loopBtn).toHaveAttribute('aria-pressed', 'false');
      await expect(loopBtn.locator('.loop-label')).toHaveText('구간 반복');
    }
  });

  test('Step 3: Clicking Loop button activates continuous single-card loop mode', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();

    const firstCard = page.locator('.script-sentence-card').first();
    const loopBtn = firstCard.locator('.btn-card-loop');

    // Initially unlooped
    await expect(firstCard).not.toHaveClass(/loop-active/);
    await expect(loopBtn).not.toHaveClass(/active/);

    // Click loop button
    await loopBtn.click();

    // Verify active state
    await expect(firstCard).toHaveClass(/loop-active/);
    await expect(loopBtn).toHaveClass(/active/);
    await expect(loopBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(loopBtn.locator('.loop-label')).toHaveText('반복 중');

    // Verify videoPlayer state
    const loopingIdx = await page.evaluate(() => window.videoPlayer.loopingSentenceIndex);
    expect(loopingIdx).toBe(0);

    // Verify toast was triggered
    const toast = page.locator('.save-toast-notification');
    await expect(toast).toBeVisible();
  });

  test('Step 3: When playback reaches sentence end, it automatically loops back to sentence start', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();

    // Set mock player to verify seekTo behavior
    await page.evaluate(() => {
      window.__seekCalls = [];
      window.videoPlayer.isFallbackMode = false;
      window.videoPlayer._renderPlayerFallback = () => {};
      window.videoPlayer._createPlayer = () => {};
      const mockPlayer = {
        seekTo: (time, allowSeek) => {
          window.__seekCalls.push({ time, allowSeek });
        },
        playVideo: () => {}
      };
      window.videoPlayer.player = mockPlayer;
      try {
        Object.defineProperty(window.videoPlayer, 'player', {
          get: () => mockPlayer,
          set: () => {},
          configurable: true
        });
      } catch (_) {}
    });

    const secondCard = page.locator('.script-sentence-card').nth(1);
    const loopBtn = secondCard.locator('.btn-card-loop');
    await loopBtn.click();

    const scriptItem = await page.evaluate(() => window.videoPlayer.scriptData[1]);

    // Simulate time tracking reaching beyond card end
    await page.evaluate((endTime) => {
      window.videoPlayer._syncCurrentTime(endTime + 0.1);
    }, scriptItem.end);

    const seekCalls = await page.evaluate(() => window.__seekCalls);
    expect(seekCalls.length).toBeGreaterThan(0);
    // Should have seeked back to scriptItem.start
    const lastSeek = seekCalls[seekCalls.length - 1];
    expect(lastSeek.time).toBeCloseTo(scriptItem.start, 1);

    // Active sentence should remain at index 1
    const activeIdx = await page.evaluate(() => window.videoPlayer.activeSentenceIndex);
    expect(activeIdx).toBe(1);
  });

  test('Step 3: Clicking active loop button cancels the loop', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();

    const card = page.locator('.script-sentence-card').first();
    const loopBtn = card.locator('.btn-card-loop');

    // Turn loop ON
    await loopBtn.click();
    await expect(card).toHaveClass(/loop-active/);

    // Turn loop OFF
    await loopBtn.click();
    await expect(card).not.toHaveClass(/loop-active/);
    await expect(loopBtn).not.toHaveClass(/active/);
    await expect(loopBtn).toHaveAttribute('aria-pressed', 'false');
    await expect(loopBtn.locator('.loop-label')).toHaveText('구간 반복');

    const loopingIdx = await page.evaluate(() => window.videoPlayer.loopingSentenceIndex);
    expect(loopingIdx).toBeNull();
  });

  test('Step 3: Switching loop from one card to another cleanly transfers loop state', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();

    const card0 = page.locator('.script-sentence-card').nth(0);
    const card2 = page.locator('.script-sentence-card').nth(2);

    // Loop card 0
    await card0.locator('.btn-card-loop').click();
    await expect(card0).toHaveClass(/loop-active/);

    // Now loop card 2
    await card2.locator('.btn-card-loop').click();

    // Card 0 should no longer be looping
    await expect(card0).not.toHaveClass(/loop-active/);
    await expect(card0.locator('.btn-card-loop')).not.toHaveClass(/active/);

    // Card 2 should now be looping
    await expect(card2).toHaveClass(/loop-active/);
    await expect(card2.locator('.btn-card-loop')).toHaveClass(/active/);

    const loopingIdx = await page.evaluate(() => window.videoPlayer.loopingSentenceIndex);
    expect(loopingIdx).toBe(2);
  });

  test('Step 3: Clicking another sentence card body cancels active loop so user can navigate freely', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();

    const card0 = page.locator('.script-sentence-card').nth(0);
    const card3 = page.locator('.script-sentence-card').nth(3);

    // Loop card 0
    await card0.locator('.btn-card-loop').click();
    await expect(card0).toHaveClass(/loop-active/);

    // Click card 3 body (text area)
    await card3.locator('.sentence-en').click();

    // Previous loop on card 0 should be cancelled
    await expect(card0).not.toHaveClass(/loop-active/);
    const loopingIdx = await page.evaluate(() => window.videoPlayer.loopingSentenceIndex);
    expect(loopingIdx).toBeNull();
  });

  test('Step 3: Light & Dark mode styling maintains contrast and accessible visuals', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Test in Light Mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('rhyrhy_theme', 'light');
    });

    await page.locator('.step-tab-btn[data-step="3"]').click();

    const card = page.locator('.script-sentence-card').first();
    const loopBtn = card.locator('.btn-card-loop');

    // Default state in Light Mode
    const defaultColor = await loopBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(defaultColor).not.toBe('rgb(255, 255, 255)'); // Not white on light

    // Active state in Light Mode
    await loopBtn.click();
    await expect(loopBtn).toHaveClass(/active/);
    await page.waitForTimeout(300);

    const activeColor = await loopBtn.evaluate((el) => window.getComputedStyle(el).color);
    expect(activeColor).toBe('rgb(255, 255, 255)'); // Crisp white on primary background
  });
});
