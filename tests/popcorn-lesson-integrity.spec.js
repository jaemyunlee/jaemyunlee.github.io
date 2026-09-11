const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const PopcornParser = require('../js/popcorn-parser.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const METADATA_PATH = path.join(ROOT_DIR, 'popcorn', 'metadata.json');

test.describe('Popcorn Quick Lesson Integrity, GA Daily Limit & Local Suppression', () => {

  test('1. Every Popcorn Lesson in metadata.json parses successfully with valid fields', () => {
    expect(fs.existsSync(METADATA_PATH)).toBe(true);
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
    expect(metadata.length).toBeGreaterThanOrEqual(25);

    metadata.forEach((item, idx) => {
      expect(item.id).toBeTruthy();
      expect(item.type).toBe('conversation');
      expect(item.expression).toBeTruthy();
      expect(item.file).toBeTruthy();

      const lessonPath = path.join(ROOT_DIR, 'popcorn', item.file);
      expect(fs.existsSync(lessonPath), `Markdown file missing for ${item.id}: ${lessonPath}`).toBe(true);

      const rawMarkdown = fs.readFileSync(lessonPath, 'utf-8');
      const parsed = PopcornParser.parse(rawMarkdown);

      expect(parsed, `PopcornParser failed to parse ${item.file}`).not.toBeNull();
      expect(parsed.id, `Parsed ID mismatch in ${item.file}`).toBe(item.id);
      expect(parsed.type).toBe('conversation');
      expect(parsed.expression.toLowerCase()).toBe(item.expression.toLowerCase());
      expect(parsed.title).toBeTruthy();
      expect(parsed.dialogue.length).toBeGreaterThanOrEqual(2);
      expect(parsed.rawExplanation).toBeTruthy();
      expect(parsed.explanation).toBeTruthy();
    });
  });

  test('2. Every Popcorn Lesson dialogue contains highlighted expression & valid targetSentence', () => {
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));

    metadata.forEach((item) => {
      const lessonPath = path.join(ROOT_DIR, 'popcorn', item.file);
      const rawMarkdown = fs.readFileSync(lessonPath, 'utf-8');
      const parsed = PopcornParser.parse(rawMarkdown);

      // Check dialogue line expression highlight
      const expressionLines = parsed.dialogue.filter(d => d.hasExpression);
      expect(
        expressionLines.length,
        `Lesson ${item.id} (${item.expression}) must have at least 1 dialogue line with hasExpression=true`
      ).toBeGreaterThanOrEqual(1);

      // Verify formattedText wraps expression in <mark class="popcorn-highlight">
      expressionLines.forEach(line => {
        expect(
          line.formattedText,
          `Lesson ${item.id} dialogue formattedText must contain <mark class="popcorn-highlight">`
        ).toContain('<mark class="popcorn-highlight">');
      });

      // Check targetSentence for saving to user sentence bank
      expect(parsed.targetSentence, `Lesson ${item.id} must have a valid targetSentence`).not.toBeNull();
      expect(parsed.targetSentence.id).toBeTruthy();
      expect(parsed.targetSentence.en).toBeTruthy();
      expect(parsed.targetSentence.kr).toBeTruthy();
      expect(parsed.targetSentence.audio).toBeTruthy();
      expect(parsed.targetSentence.speaker).toBeTruthy();
      expect(parsed.targetSentence.expression.toLowerCase()).toBe(item.expression.toLowerCase());
    });
  });

  test('3. Audio file exists on filesystem and is non-empty for every dialogue line', () => {
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
    let totalAudioChecked = 0;

    metadata.forEach((item) => {
      const lessonPath = path.join(ROOT_DIR, 'popcorn', item.file);
      const rawMarkdown = fs.readFileSync(lessonPath, 'utf-8');
      const parsed = PopcornParser.parse(rawMarkdown);

      parsed.dialogue.forEach((line, lineIdx) => {
        expect(line.audio, `Lesson ${item.id} line ${lineIdx + 1} missing audio field`).toBeTruthy();

        // Audio path in markdown is relative to popcorn/conversation/
        const audioDiskPath = path.join(ROOT_DIR, 'popcorn', 'conversation', line.audio);
        expect(
          fs.existsSync(audioDiskPath),
          `Audio file not found on disk: ${audioDiskPath} (Lesson: ${item.id}, line ${lineIdx + 1})`
        ).toBe(true);

        const stats = fs.statSync(audioDiskPath);
        expect(
          stats.size,
          `Audio file is empty (0 bytes): ${audioDiskPath}`
        ).toBeGreaterThan(0);

        totalAudioChecked++;
      });
    });

    expect(totalAudioChecked).toBeGreaterThanOrEqual(75); // At least 25 lessons * ~3 lines
  });

  test('4. Character persona honorific protocol (Wayne & Kelly) is respected across Korean translations', () => {
    const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));

    metadata.forEach((item) => {
      const lessonPath = path.join(ROOT_DIR, 'popcorn', item.file);
      const rawMarkdown = fs.readFileSync(lessonPath, 'utf-8');
      const parsed = PopcornParser.parse(rawMarkdown);

      parsed.dialogue.forEach((line, lineIdx) => {
        const kr = line.korean.trim();
        const speaker = line.speaker.toLowerCase();

        if (speaker === 'kelly') {
          // Kelly must use polite honorific speech (존댓말) to Uncle Wayne:
          // ends with 요, 죠, 니다, 삼촌, or polite particle
          const hasPoliteEnding = /[요죠다삼촌\?!\.]$/.test(kr) && !/[해했어잖야자라]$/.test(kr.replace(/[\.!\?~]/g, ''));
          expect(
            hasPoliteEnding,
            `Kelly must speak in polite Korean (존댓말) to Wayne in ${item.id} line ${lineIdx + 1}: "${kr}"`
          ).toBe(true);
        } else if (speaker === 'wayne') {
          // Wayne speaks in warm informal Korean (반말) to niece Kelly:
          // should not use highly formal honorifics like 습니다, 하세요, 드려요
          const hasFormalEnding = /(습니다|하십니까|하세요|드렸|주셨습니다)/.test(kr);
          expect(
            hasFormalEnding,
            `Wayne must speak in warm informal Korean (반말) to Kelly in ${item.id} line ${lineIdx + 1}: "${kr}"`
          ).toBe(false);
        }
      });
    });
  });

  test('5. Local Environment GA Suppression: Zero network requests to Google Analytics or Tag Manager', async ({ page }) => {
    const externalGaRequests = [];

    page.on('request', req => {
      const url = req.url();
      if (url.includes('googletagmanager.com') || url.includes('google-analytics.com')) {
        externalGaRequests.push(url);
      }
    });

    await page.goto('/daily.html');

    // Wait for page hydration
    await page.waitForSelector('#daily-page-container', { timeout: 5000 });

    // Assert that NO network requests were dispatched to GA or GTM
    expect(
      externalGaRequests,
      `GA or GTM network requests should not be made in local environment: ${JSON.stringify(externalGaRequests)}`
    ).toEqual([]);

    // Assert that GA disable flags are active in the browser window
    const gaState = await page.evaluate(() => ({
      disableDefault: window['ga-disable-G-6Z1RWQ4CN2'],
      isLocal: typeof Analytics !== 'undefined' ? Analytics.isLocalEnvironment() : null,
      analyticsLocal: typeof Analytics !== 'undefined' ? Analytics.isLocal : null
    }));

    expect(gaState.disableDefault).toBe(true);
    expect(gaState.isLocal).toBe(true);
    expect(gaState.analyticsLocal).toBe(true);
  });

  test('6. Google Analytics tracks popcorn_daily_limit_reached when 10 lessons limit is hit', async ({ page }) => {
    await page.goto('/daily.html');

    // Reset popcorn storage
    await page.evaluate(() => {
      if (typeof Storage !== 'undefined') {
        Storage.resetPopcornPreferences();
        sessionStorage.clear();
      }
    });

    // Simulate studying 10 popcorn quick lessons
    await page.evaluate(() => {
      // Simulate today's study count reaching 10
      for (let i = 0; i < 10; i++) {
        Storage.incrementPopcornDailyStudyCount();
      }
    });

    // Reload page or pick next lesson
    await page.goto('/daily.html');

    // Daily limit completion card should now be rendered
    const completionCard = page.locator('#popcorn-completion-card');
    await expect(completionCard).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.completion-badge')).toContainText('오늘 팝콘 완료 (10 / 10)');

    // Verify GA event was recorded locally in dataLayer and Analytics
    const trackedEvent = await page.evaluate(() => {
      const layer = window.dataLayer || [];
      const limitEvents = layer.filter(e => e.event === 'popcorn_daily_limit_reached');
      const last = (typeof Analytics !== 'undefined' && Analytics.lastTrackedEvent) ? Analytics.lastTrackedEvent : null;
      return {
        limitEvents,
        last
      };
    });

    expect(trackedEvent.limitEvents.length).toBe(1);
    expect(trackedEvent.limitEvents[0].study_count).toBe(10);
    expect(trackedEvent.limitEvents[0].max_threshold).toBe(10);
  });

  test('7. Browser UI correctly renders dialogue, expression highlights, and audio buttons for lessons', async ({ page }) => {
    // Test lesson 005 (near and dear to my heart)
    await page.goto('/daily.html?id=popcorn-005');

    // Advance through knowledge check to dialogue
    const learnBtn = page.locator('#btn-popcorn-learn');
    await expect(learnBtn).toBeVisible({ timeout: 5000 });
    await learnBtn.click();

    // Verify conversation container appears
    const dialogueSection = page.locator('#popcorn-dialogue-container');
    await expect(dialogueSection).toBeVisible({ timeout: 5000 });

    // Verify expression is highlighted in dialogue
    const highlightedMark = page.locator('.popcorn-highlight');
    await expect(highlightedMark).toBeVisible();
    await expect(highlightedMark).toHaveText(/near and dear to my heart/i);

    // Verify dialogue audio buttons exist
    const audioButtons = page.locator('.btn-line-audio');
    const audioBtnCount = await audioButtons.count();
    expect(audioBtnCount).toBeGreaterThanOrEqual(2);
  });

  test('8. Saving target sentence for the first time displays multi-device local storage notice popup', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Ensure completely clean storage state
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto('/daily.html?id=popcorn-001');

    // Advance through knowledge check to dialogue
    const learnBtn = page.locator('#btn-popcorn-learn');
    await expect(learnBtn).toBeVisible({ timeout: 5000 });
    await learnBtn.click();

    // Click save sentence button
    const saveBtn = page.locator('#btn-popcorn-save');
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click();

    // Expect save toast
    await expect(page.locator('.save-toast-notification')).toBeVisible();

    // Verify first-save storage notice popup appears
    const modalOverlay = page.locator('#first-save-storage-modal');
    await expect(modalOverlay).toBeVisible({ timeout: 5000 });

    // Verify popup notifications regarding local storage vs multi-device persistence
    const modalCard = page.locator('.first-visit-modal-card');
    await expect(modalCard).toContainText('첫 번째 문장이 단어장에 저장되었습니다!');
    await expect(modalCard).toContainText('현재 기기 브라우저 캐시에 안전하게 보관됩니다');
    await expect(modalCard).toContainText('모든 기기 클라우드 동기화가 필요하신가요?');

    // Dismiss modal via confirmation button
    const dismissBtn = page.locator('#btn-dismiss-first-save');
    await expect(dismissBtn).toBeVisible();
    await dismissBtn.click();
    await expect(modalOverlay).not.toBeAttached();

    // Verify seen flag in localStorage
    const noticeSeen = await page.evaluate(() => window.localStorage.getItem('rhyrhy_first_save_notice_seen'));
    expect(noticeSeen).toBe('true');

    // Navigate to another popcorn lesson and save: modal should NOT appear again
    await page.goto('/daily.html?id=popcorn-002');
    await page.click('#btn-popcorn-learn');
    await page.click('#btn-popcorn-save');
    await page.waitForTimeout(500);
    await expect(page.locator('#first-save-storage-modal')).not.toBeAttached();
  });

  test('9. Saved sentences from Popcorn quick lessons display key expression highlighted in saved drawer', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-002');

    // Set up clean storage with notice seen so popup does not block
    await page.evaluate(() => {
      window.localStorage.clear();
      window.localStorage.setItem('rhyrhy_first_save_notice_seen', 'true');
    });

    await page.goto('/daily.html?id=popcorn-002');

    // Advance to dialogue and save target sentence (make a day of it)
    await page.click('#btn-popcorn-learn');
    const saveBtn = page.locator('#btn-popcorn-save');
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click();
    await expect(saveBtn).toContainText('Saved에 저장됨');

    // Open Saved Sentences Drawer from navbar
    const savedNavBtn = page.locator('#btn-open-sentences');
    await expect(savedNavBtn).toBeVisible();
    await savedNavBtn.click();

    // Verify drawer opens
    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toHaveClass(/open/);

    // Locate popcorn saved card in the drawer
    const popcornGroup = page.locator('.saved-lesson-group[data-lesson="popcorn"]');
    await expect(popcornGroup).toBeVisible();

    const savedCard = popcornGroup.locator('.saved-sentence-card').first();
    await expect(savedCard).toBeVisible();

    // Verify key expression is highlighted inside .saved-en
    const highlightedEl = savedCard.locator('.saved-en mark');
    await expect(highlightedEl).toBeVisible();
    await expect(highlightedEl).toHaveText(/make a day of it/i);
    await expect(highlightedEl).toHaveClass(/popcorn-highlight/);

    // Verify avatar image is removed to keep consistent with other saved cards
    const avatarImg = savedCard.locator('.saved-speaker-avatar');
    await expect(avatarImg).toHaveCount(0);
    const anyImg = savedCard.locator('img');
    await expect(anyImg).toHaveCount(0);
  });

});

