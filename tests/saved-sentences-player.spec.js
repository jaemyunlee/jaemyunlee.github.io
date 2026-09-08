const { test, expect } = require('@playwright/test');

test.describe('Saved Sentences Audio Player & Background Playback (Issue #13)', () => {
  test('Empty state: when no sentences are saved, player bar is hidden', async ({ page }) => {
    await page.goto('/index.html');

    // Open saved sentences drawer
    const openBtn = page.locator('#btn-open-sentences');
    await expect(openBtn).toBeVisible({ timeout: 5000 });
    await openBtn.click();

    // Drawer opens
    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toHaveClass(/open/);

    // Empty state is shown
    const emptyState = page.locator('.drawer-empty-state');
    await expect(emptyState).toBeVisible();

    // Player bar is hidden
    const playerBar = page.locator('#saved-player-bar');
    await expect(playerBar).toBeHidden();
  });

  test('Player bar displays, controls playback, advances tracks, changes speed, and highlights cards', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // Seed saved sentences
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
          },
          {
            id: 'sent_test_3',
            en: 'And then go to the concert and spend the night.',
            kr: '그리고 콘서트에 가서 하룻밤을 보낼 거예요.',
            audio: 'audio/And then go to the concert and spend the night.wav'
          }
        ]
      }));
    });

    await page.goto('/index.html');

    // Verify badge shows count 3
    const badge = page.locator('#nav-saved-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('3');

    // Open drawer
    const openBtn = page.locator('#btn-open-sentences');
    await openBtn.click();

    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toHaveClass(/open/);

    // Verify player bar is now visible
    const playerBar = page.locator('#saved-player-bar');
    await expect(playerBar).toBeVisible();

    // Check track badge (01/03)
    const trackBadge = page.locator('#saved-player-badge');
    await expect(trackBadge).toHaveText('01/03');

    // Check track title contains first sentence
    const trackTitle = page.locator('#saved-player-title');
    await expect(trackTitle).toHaveText('I just happened to look.');

    // Verify Step 4 review-player styling parity (Issue #17)
    await expect(playerBar).toHaveClass(/review-player-bar/);
    const waveBox = page.locator('#saved-wave-box');
    await expect(waveBox).toBeVisible();
    await expect(waveBox.locator('.wave-bar')).toHaveCount(4);

    const currentTime = page.locator('#saved-player-current-time');
    const totalTime = page.locator('#saved-player-total-time');
    const progressTrack = page.locator('#saved-player-progress-track');
    const progressBar = page.locator('#saved-player-progress-bar');
    await expect(currentTime).toBeVisible();
    await expect(totalTime).toBeVisible();
    await expect(progressTrack).toHaveClass(/player-progress-track/);
    await expect(progressBar).toHaveClass(/player-progress-fill/);

    // Verify expression highlights (Step 4 Parity)
    const card1Highlight = page.locator('#saved-card-sent_test_1 .quiz-vocab-highlight');
    await expect(card1Highlight).toBeVisible();
    await expect(card1Highlight).toHaveText('happened to');

    const card2Highlight = page.locator('#saved-card-sent_test_2 .quiz-vocab-highlight');
    await expect(card2Highlight).toBeVisible();
    await expect(card2Highlight).toHaveText('decent');

    // Verify compact card play button (24px to give more space to sentences)
    const cardPlayBtn = page.locator('#saved-card-sent_test_1 .btn-card-play');
    const btnBox = await cardPlayBtn.boundingBox();
    expect(btnBox.width).toBeLessThanOrEqual(28);
    expect(btnBox.height).toBeLessThanOrEqual(28);

    // 1. Play track 1
    const toggleBtn = page.locator('#btn-saved-toggle');
    await toggleBtn.click();

    // Player bar has .is-playing
    await expect(playerBar).toHaveClass(/is-playing/);
    const card1 = page.locator('#saved-card-sent_test_1');
    await expect(card1).toHaveClass(/is-playing/);

    // 2. Next track button
    const nextBtn = page.locator('#btn-saved-next');
    await nextBtn.click();

    await expect(trackBadge).toHaveText('02/03');
    await expect(trackTitle).toHaveText('we have a decent view..');
    const card2 = page.locator('#saved-card-sent_test_2');
    await expect(card2).toHaveClass(/is-playing/);
    await expect(card1).not.toHaveClass(/is-playing/);

    // 3. Speed button cycles
    const speedBtn = page.locator('#btn-saved-speed');
    await expect(speedBtn).toHaveText('1.0x');
    await speedBtn.click();
    await expect(speedBtn).toHaveText('1.25x');

    // 4. Play specific card via inline card play button
    const card3PlayBtn = page.locator('#saved-card-sent_test_3 .btn-card-play');
    await card3PlayBtn.click();

    await expect(trackBadge).toHaveText('03/03');
    await expect(trackTitle).toHaveText('And then go to the concert and spend the night.');
    const card3 = page.locator('#saved-card-sent_test_3');
    await expect(card3).toHaveClass(/is-playing/);

    // 5. Test seeking on progress track
    await progressTrack.click({ position: { x: 50, y: 3 } });

    // 6. Test light mode theme compatibility (Issue #2 & Issue #17)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect(playerBar).toHaveClass(/is-playing/);
    await expect(card3).toHaveClass(/is-playing/);

    // 7. Pause playback
    await toggleBtn.click();
    await expect(playerBar).not.toHaveClass(/is-playing/);
    await expect(card3).not.toHaveClass(/is-playing/);

    // No uncaught exceptions
    expect(pageErrors).toHaveLength(0);
  });

  test('Check saved-sentence-card and play button styles on desktop and mobile', async ({ page }) => {
    // Seed saved sentences
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_saved_sentences', JSON.stringify({
        'lesson-01': [
          {
            id: 'sent_test_1',
            en: 'What happened to your arm?',
            kr: '팔은 어쩌다가 다치셨어요?',
            expression: 'happened to',
            audio: 'audio/sent-05.wav'
          },
          {
            id: 'sent_test_2',
            en: 'We have a decent view of the stage.',
            kr: '무대가 꽤 잘 보이는 자리예요.',
            expression: 'decent',
            audio: 'audio/sent-04.wav'
          }
        ]
      }));
    });

    // 1. Desktop test on /lessons/lesson-01/index.html
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/lessons/lesson-01/index.html');
    await page.click('#btn-open-sentences');
    await page.waitForSelector('#saved-sentences-drawer.open');

    // Click play on track 1 to see playing state
    await page.click('#btn-saved-toggle');
    await page.waitForTimeout(300);

    await page.screenshot({
      path: '/Users/jaemyun/.gemini/antigravity-ide/brain/c1ecb1ce-624f-4492-9271-d6e858f7b792/desktop_lesson_playing_card.png'
    });

    const desktopCardInfo = await page.evaluate(() => {
      const card = document.querySelector('#saved-card-sent_test_1');
      const btn = card.querySelector('.btn-card-play');
      const csBtn = window.getComputedStyle(btn);
      const playIcon = btn.querySelector('.icon-card-play');
      const pauseIcon = btn.querySelector('.icon-card-pause');
      return {
        cardWidth: card.getBoundingClientRect().width,
        btnWidth: btn.getBoundingClientRect().width,
        btnHeight: btn.getBoundingClientRect().height,
        padding: csBtn.padding,
        display: csBtn.display,
        playIconDisplay: playIcon ? window.getComputedStyle(playIcon).display : null,
        pauseIconDisplay: pauseIcon ? window.getComputedStyle(pauseIcon).display : null
      };
    });
    console.log('DESKTOP CARD INFO:', JSON.stringify(desktopCardInfo));

    // 2. Mobile test on /lessons/lesson-01/index.html (width: 390)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // Save light mode screenshot
    await page.screenshot({
      path: '/Users/jaemyun/.gemini/antigravity-ide/brain/c1ecb1ce-624f-4492-9271-d6e858f7b792/saved_player_light.png'
    });

    // Toggle dark mode and save screenshot
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(200);
    await page.screenshot({
      path: '/Users/jaemyun/.gemini/antigravity-ide/brain/c1ecb1ce-624f-4492-9271-d6e858f7b792/saved_player_dark.png'
    });

    const mobileCardInfo = await page.evaluate(() => {
      const card = document.querySelector('#saved-card-sent_test_1');
      const btn = card.querySelector('.btn-card-play');
      const csBtn = window.getComputedStyle(btn);
      return {
        cardWidth: card.getBoundingClientRect().width,
        btnWidth: btn.getBoundingClientRect().width,
        btnHeight: btn.getBoundingClientRect().height,
        flex: csBtn.flex,
        padding: csBtn.padding
      };
    });

    expect(mobileCardInfo.btnWidth).toBe(28);
    expect(mobileCardInfo.btnHeight).toBe(28);
    expect(desktopCardInfo.btnWidth).toBe(28);
    expect(desktopCardInfo.btnHeight).toBe(28);
  });
});
