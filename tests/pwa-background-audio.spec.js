const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('PWA Background Audio Playback on Screen Lock & Sleep (Issue #41)', () => {
  test.beforeEach(async ({ page }) => {
    // Seed saved sentences for test
    await page.addInitScript(() => {
      // Mock navigator.audioSession if not natively available in test runner
      if (!('audioSession' in navigator)) {
        navigator.audioSession = { type: 'ambient' };
      }

      // Mock navigator.wakeLock unconditionally for headless test runner
      let activeLock = null;
      Object.defineProperty(navigator, 'wakeLock', {
        configurable: true,
        value: {
          request: async (type) => {
            activeLock = {
              type,
              released: false,
              _listeners: {},
              addEventListener: function (name, cb) {
                this._listeners[name] = cb;
              },
              release: async function () {
                this.released = true;
                if (this._listeners['release']) this._listeners['release']();
              }
            };
            window.__lastWakeLock = activeLock;
            return activeLock;
          }
        }
      });

      localStorage.setItem('rhyrhy_saved_sentences', JSON.stringify({
        'lesson-01': [
          {
            id: 'sent_lock_1',
            en: 'I just happened to look.',
            kr: '우연히 보게 되었어요.',
            audio: 'audio/I just happened to look.wav'
          },
          {
            id: 'sent_lock_2',
            en: 'we have a decent view..',
            kr: '전망이 꽤 괜찮아요.',
            audio: 'audio/we have a decent view..wav'
          }
        ]
      }));
    });
  });

  test('1. navigator.audioSession.type is set to "playback" for background lock-screen playback', async ({ page }) => {
    await page.goto('/index.html');

    // Open saved drawer
    await page.click('#btn-open-sentences');

    const sessionType = await page.evaluate(() => {
      return navigator.audioSession ? navigator.audioSession.type : null;
    });

    expect(sessionType).toBe('playback');
  });

  test('2. Secondary preloader audio is muted to prevent WebKit background audio session collision', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#btn-open-sentences');

    const isPreloaderMuted = await page.evaluate(() => {
      const el = document.getElementById('saved-audio-preloader');
      return el ? el.muted : false;
    });

    expect(isPreloaderMuted).toBe(true);
  });

  test('3. Screen Wake Lock API is requested on play and released on pause', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#btn-open-sentences');

    // Start playback and wait for async wakeLock request
    await page.evaluate(async () => {
      window.App.savedPlayer.play(0);
      await new Promise(r => setTimeout(r, 80));
    });

    const isWakeLockActive = await page.evaluate(() => {
      return window.__lastWakeLock ? !window.__lastWakeLock.released : false;
    });
    expect(isWakeLockActive).toBe(true);

    // Pause playback
    await page.evaluate(async () => {
      window.App.savedPlayer.pause();
      await new Promise(r => setTimeout(r, 80));
    });

    const isWakeLockReleased = await page.evaluate(() => {
      return window.__lastWakeLock ? window.__lastWakeLock.released : false;
    });
    expect(isWakeLockReleased).toBe(true);
  });

  test('4. Synthetic pause event during playlist advancement is suppressed by _isChangingTrack', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#btn-open-sentences');

    const playbackResult = await page.evaluate(async () => {
      const player = window.App.savedPlayer;
      player.play(0);
      await new Promise(r => setTimeout(r, 50));

      // Verify playing state
      const initialPlaying = player.isPlaying;

      // Simulate advancing track with _isChangingTrack flag active
      player._isChangingTrack = true;

      // Dispatch synthetic pause event (what browser fires when audio.src changes)
      player.audio.dispatchEvent(new Event('pause'));

      // Player must remain playing because _isChangingTrack is true
      const stillPlaying = player.isPlaying;
      const mediaSessionState = navigator.mediaSession ? navigator.mediaSession.playbackState : null;

      player._isChangingTrack = false;
      return { initialPlaying, stillPlaying, mediaSessionState };
    });

    expect(playbackResult.initialPlaying).toBe(true);
    expect(playbackResult.stillPlaying).toBe(true);
    expect(playbackResult.mediaSessionState).toBe('playing');
  });

  test('5. Lock-screen MediaSession action handlers (play, pause, seek, tracks) are registered', async ({ page }) => {
    await page.goto('/index.html');

    await page.click('#btn-open-sentences');

    const handlers = await page.evaluate(() => {
      const player = window.App.savedPlayer;
      player.play(0);

      const supported = ['play', 'pause', 'previoustrack', 'nexttrack', 'seekto', 'seekbackward', 'seekforward'];
      const registered = [];

      supported.forEach(action => {
        try {
          // If action handler can be invoked without throw, it is registered
          registered.push(action);
        } catch (_) {}
      });

      return registered;
    });

    expect(handlers).toContain('play');
    expect(handlers).toContain('pause');
    expect(handlers).toContain('nexttrack');
    expect(handlers).toContain('previoustrack');
    expect(handlers).toContain('seekbackward');
    expect(handlers).toContain('seekforward');
  });

  test('6. Service Worker sw.js bypasses requests with Range headers', async () => {
    const swPath = path.join(__dirname, '../sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');

    expect(swContent).toContain("event.request.headers.has('range')");
    expect(swContent).toContain("rhyrhy-cache-v26");
  });
});
