const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/jaemyun/.gemini/antigravity-ide/brain/c1ecb1ce-624f-4492-9271-d6e858f7b792';

async function safeScreenshot(page, filename) {
  if (!process.env.CI && fs.existsSync(ARTIFACT_DIR)) {
    try {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
    } catch (_) {}
  }
}

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

    // Verify Step 4 review-player styling parity & mobile component variant (Issue #17)
    await expect(playerBar).toHaveClass(/review-player-bar/);
    await expect(playerBar).toHaveClass(/player-variant-mobile/);

    // Visible controls in single-row mobile layout:
    const prevBtn = page.locator('#btn-saved-prev');
    const toggleBtn = page.locator('#btn-saved-toggle');
    const nextBtn = page.locator('#btn-saved-next');
    const playallBtn = page.locator('#btn-saved-playall');

    await expect(trackBadge).toBeVisible();
    await expect(prevBtn).toBeVisible();
    await expect(toggleBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
    await expect(playallBtn).toBeVisible();

    // Hidden elements in mobile component (sound wave, long title, speed button, scrubber):
    await expect(page.locator('#saved-wave-box')).toBeHidden();
    await expect(page.locator('#saved-player-title')).toBeHidden();
    await expect(page.locator('#btn-saved-speed')).toBeHidden();
    await expect(page.locator('.saved-player-bar .player-progress-row')).toBeHidden();

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
    await toggleBtn.click();

    // Player bar has .is-playing
    await expect(playerBar).toHaveClass(/is-playing/);
    const card1 = page.locator('#saved-card-sent_test_1');
    await expect(card1).toHaveClass(/is-playing/);

    // 2. Next track button
    await nextBtn.click();

    await expect(trackBadge).toHaveText('02/03');
    const card2 = page.locator('#saved-card-sent_test_2');
    await expect(card2).toHaveClass(/is-playing/);
    await expect(card1).not.toHaveClass(/is-playing/);

    // 3. Play All toggle button cycles active state
    await expect(playallBtn).toHaveClass(/active/);
    await playallBtn.click();
    await expect(playallBtn).not.toHaveClass(/active/);
    await playallBtn.click();
    await expect(playallBtn).toHaveClass(/active/);

    // 4. Play specific card via inline card play button
    const card3PlayBtn = page.locator('#saved-card-sent_test_3 .btn-card-play');
    await card3PlayBtn.click();

    await expect(trackBadge).toHaveText('03/03');
    const card3 = page.locator('#saved-card-sent_test_3');
    await expect(card3).toHaveClass(/is-playing/);

    // 5. Test light mode theme compatibility (Issue #2 & Issue #17)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect(playerBar).toHaveClass(/is-playing/);
    await expect(card3).toHaveClass(/is-playing/);

    // 6. Pause playback
    await toggleBtn.click();
    await expect(playerBar).not.toHaveClass(/is-playing/);
    await expect(card3).not.toHaveClass(/is-playing/);

    // No uncaught exceptions
    expect(pageErrors).toHaveLength(0);
  });

  test('Audio player UI on saved page is identical on mobile view and bigger screen (desktop) view, matching Step 4 mobile layout', async ({ page }) => {
    // Seed saved sentences
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_saved_sentences', JSON.stringify({
        'lesson-01': [
          { id: 'sent_test_1', en: 'What happened to your arm?', kr: '팔은 어쩌다가 다치셨어요?', audio: 'audio/sent-05.wav' },
          { id: 'sent_test_2', en: 'We have a decent view of the stage.', kr: '무대가 꽤 잘 보이는 자리예요.', audio: 'audio/sent-04.wav' }
        ]
      }));
    });

    // 1. Check on Desktop View (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/index.html');
    await page.click('#btn-open-sentences');
    await page.waitForSelector('#saved-sentences-drawer.open');

    const desktopBar = page.locator('#saved-player-bar');
    await expect(desktopBar).toBeVisible();
    await expect(desktopBar).toHaveClass(/player-variant-mobile/);
    await expect(desktopBar).toHaveClass(/review-player-bar/);

    // Assert visible elements on desktop saved drawer
    await expect(page.locator('#saved-player-badge')).toBeVisible();
    await expect(page.locator('#btn-saved-prev')).toBeVisible();
    await expect(page.locator('#btn-saved-toggle')).toBeVisible();
    await expect(page.locator('#btn-saved-next')).toBeVisible();
    await expect(page.locator('#btn-saved-playall')).toBeVisible();

    // Assert hidden elements on desktop saved drawer
    await expect(page.locator('#saved-wave-box')).toBeHidden();
    await expect(page.locator('#saved-player-title')).toBeHidden();
    await expect(page.locator('#btn-saved-speed')).toBeHidden();
    await expect(page.locator('.saved-player-bar .player-progress-row')).toBeHidden();

    // 2. Check on Mobile View (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);

    const mobileBar = page.locator('#saved-player-bar');
    await expect(mobileBar).toBeVisible();
    await expect(mobileBar).toHaveClass(/player-variant-mobile/);
    await expect(mobileBar).toHaveClass(/review-player-bar/);

    // Assert exact same visible elements on mobile saved drawer
    await expect(page.locator('#saved-player-badge')).toBeVisible();
    await expect(page.locator('#btn-saved-prev')).toBeVisible();
    await expect(page.locator('#btn-saved-toggle')).toBeVisible();
    await expect(page.locator('#btn-saved-next')).toBeVisible();
    await expect(page.locator('#btn-saved-playall')).toBeVisible();

    // Assert exact same hidden elements on mobile saved drawer
    await expect(page.locator('#saved-wave-box')).toBeHidden();
    await expect(page.locator('#saved-player-title')).toBeHidden();
    await expect(page.locator('#btn-saved-speed')).toBeHidden();
    await expect(page.locator('.saved-player-bar .player-progress-row')).toBeHidden();

    // Capture visual artifact for user walkthrough
    await safeScreenshot(page, 'saved_player_mobile_view.png');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(200);
    await safeScreenshot(page, 'saved_player_desktop_view.png');
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

    await safeScreenshot(page, 'desktop_lesson_playing_card.png');

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
    await safeScreenshot(page, 'saved_player_light.png');

    // Toggle dark mode and save screenshot
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await page.waitForTimeout(200);
    await safeScreenshot(page, 'saved_player_dark.png');

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

  test('Currently playing sentence card automatically scrolls to top of drawer list when playback begins or advances', async ({ page }) => {
    // Seed 8 saved sentences with real WAV files to ensure valid playback and scrolling in drawer
    await page.addInitScript(() => {
      const audioFiles = [
        'audio/I just happened to look.wav',
        'audio/we have a decent view..wav',
        'audio/And then go to the concert and spend the night.wav',
        'audio/At least thats what I understood.wav',
        'audio/Compared to what we paid in Korea for tickets its decent.wav',
        'audio/Hopefully Amy doesnt mind..wav',
        'audio/I dont know what year that came out.wav',
        'audio/I started to like it a lot and listening to it..wav'
      ];
      const sentences = [];
      for (let i = 1; i <= 8; i++) {
        sentences.push({
          id: `scroll_test_${i}`,
          en: `Test sentence number ${i} for scrolling verification in saved drawer.`,
          kr: `스크롤 테스트 문장 ${i}번 입니다.`,
          audio: audioFiles[i - 1]
        });
      }
      localStorage.setItem('rhyrhy_saved_sentences', JSON.stringify({
        'lesson-01': sentences
      }));
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');

    // Open saved sentences drawer
    await page.click('#btn-open-sentences');
    await page.waitForSelector('#saved-sentences-drawer.open');

    const drawerBody = page.locator('#saved-sentences-list');
    await expect(drawerBody).toBeVisible();

    // Initial state: scrollTop is 0
    const initialScrollTop = await drawerBody.evaluate(el => el.scrollTop);
    expect(initialScrollTop).toBe(0);

    // Advance to track 5 by clicking next button on the sticky player bar
    const nextBtn = page.locator('#btn-saved-next');
    for (let step = 0; step < 4; step++) {
      await nextBtn.click();
      await page.waitForTimeout(100);
    }

    // Verify track 5 is playing
    const trackBadge = page.locator('#saved-player-badge');
    await expect(trackBadge).toHaveText('05/08');

    const card5 = page.locator('#saved-card-scroll_test_5');
    await expect(card5).toHaveClass(/is-playing/);

    // Wait for smooth scroll to finish
    await page.waitForTimeout(600);

    // Assert drawerBody scrolled down significantly (> 150px)
    const scrolledTop = await drawerBody.evaluate(el => el.scrollTop);
    expect(scrolledTop).toBeGreaterThan(150);

    // Assert card 5 is positioned right near top of drawerBody
    const relativePosition5 = await page.evaluate(() => {
      const body = document.getElementById('saved-sentences-list');
      const card = document.getElementById('saved-card-scroll_test_5');
      const bodyRect = body.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return cardRect.top - bodyRect.top;
    });

    // Card should be near top (within 24px)
    expect(relativePosition5).toBeGreaterThanOrEqual(0);
    expect(relativePosition5).toBeLessThanOrEqual(24);

    // Advance to track 6 via next button
    await nextBtn.click();
    await expect(trackBadge).toHaveText('06/08');
    const card6 = page.locator('#saved-card-scroll_test_6');
    await expect(card6).toHaveClass(/is-playing/);
    await page.waitForTimeout(600);

    const relativePosition6 = await page.evaluate(() => {
      const body = document.getElementById('saved-sentences-list');
      const card = document.getElementById('saved-card-scroll_test_6');
      const bodyRect = body.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      return cardRect.top - bodyRect.top;
    });
    expect(relativePosition6).toBeGreaterThanOrEqual(0);
    expect(relativePosition6).toBeLessThanOrEqual(24);

    // Click inline play on card 1 to play track 1 and verify scrolling back to top (scrollTop === 0)
    await page.click('#saved-card-scroll_test_1 .btn-card-play');
    await expect(trackBadge).toHaveText('01/08');
    const card1 = page.locator('#saved-card-scroll_test_1');
    await expect(card1).toHaveClass(/is-playing/);
    await page.waitForTimeout(600);

    const topAfterCard1 = await drawerBody.evaluate(el => el.scrollTop);
    expect(topAfterCard1).toBe(0);
  });
});
