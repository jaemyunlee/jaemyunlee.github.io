const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

test.describe('Bite-Sized Popcorn Conversation Lessons & Scaffolding Engine', () => {

  test.beforeEach(async ({ page }) => {
    // Reset test storage
    await page.goto('/daily.html');
    await page.evaluate(() => {
      if (typeof Storage !== 'undefined') {
        Storage.resetPopcornPreferences();
        localStorage.removeItem('rhyrhy_saved_sentences');
      }
    });
  });

  test('1. CLI Scaffolding Tool generates conversation lesson and updates metadata.json', async () => {
    const rootDir = path.resolve(__dirname, '..');
    const metadataPath = path.join(rootDir, 'popcorn', 'metadata.json');

    const beforeRaw = fs.readFileSync(metadataPath, 'utf-8');
    const beforeMetadata = JSON.parse(beforeRaw);

    // Run scaffolding command
    execSync('node scripts/scaffold-popcorn.js --type conversation --expression "test expression"', {
      cwd: rootDir,
      stdio: 'pipe'
    });

    const afterRaw = fs.readFileSync(metadataPath, 'utf-8');
    const afterMetadata = JSON.parse(afterRaw);

    expect(afterMetadata.length).toBe(beforeMetadata.length + 1);

    const newLesson = afterMetadata[afterMetadata.length - 1];
    expect(newLesson.type).toBe('conversation');
    expect(newLesson.expression).toBe('test expression');
    expect(newLesson.file).toMatch(/^conversation\/popcorn-\d+\.md$/);

    const generatedFilePath = path.join(rootDir, 'popcorn', newLesson.file);
    expect(fs.existsSync(generatedFilePath)).toBe(true);

    const content = fs.readFileSync(generatedFilePath, 'utf-8');
    expect(content).toContain('Popcorn English: test expression');
    expect(content).toContain('- **Type**: conversation');
    expect(content).toContain('## Expression Check');
    expect(content).toContain('## Dialogue');

    // Clean up temporary generated file from test
    fs.unlinkSync(generatedFilePath);
    const generatedAudioDir = path.join(rootDir, 'popcorn', 'conversation', 'audio', newLesson.id);
    if (fs.existsSync(generatedAudioDir)) {
      fs.rmdirSync(generatedAudioDir);
    }
    fs.writeFileSync(metadataPath, JSON.stringify(beforeMetadata, null, 2) + '\n', 'utf-8');
  });

  test('2. Stage 1 Knowledge Check displays "이 표현을 아시나요?" with Known & Learn actions', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });

    // Check expression banner
    const banner = page.locator('.popcorn-expression-banner');
    await expect(banner).toContainText('just so you know');

    // Check prompt
    const prompt = page.locator('.popcorn-check-prompt');
    await expect(prompt).toHaveText('이 표현을 아시나요?');

    // Check action buttons
    const knownBtn = page.locator('#btn-popcorn-known');
    const learnBtn = page.locator('#btn-popcorn-learn');
    await expect(knownBtn).toBeVisible();
    await expect(learnBtn).toBeVisible();
  });

  test('3. Stage 1 "알아요": 1st click schedules 2 months, 2nd consecutive click permanently excludes it', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    const knownBtn = page.locator('#btn-popcorn-known');
    await expect(knownBtn).toBeVisible({ timeout: 5000 });

    // 1st click: "알아요"
    await knownBtn.click();

    // Verify 1st click: scheduled for 2 months (~60 days), streak is 1, not permanently excluded yet
    const state1 = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep()['popcorn-001'];
      return {
        isKnown: Storage.isPopcornKnown('popcorn-001'),
        inCooldown: Storage.isPopcornInCooldown('popcorn-001', 59),
        streak: rep ? rep.s : 0
      };
    });
    expect(state1.isKnown).toBe(false);
    expect(state1.inCooldown).toBe(true);
    expect(state1.streak).toBe(1);

    // Toast notification for 2-month reschedule
    const toast1 = page.locator('.save-toast-notification');
    await expect(toast1).toBeVisible({ timeout: 2000 });
    await expect(toast1).toContainText('2달 뒤에 다시 복습할 수 있도록 예약했어요');

    // Simulate 61 days later: cooldown elapsed
    await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - 1000;
      Storage.savePopcornSpacedRep(rep);
    });

    // 2nd play: open popcorn-001 again and click "알아요" for the 2nd consecutive time
    await page.goto('/daily.html?id=popcorn-001');
    const knownBtn2 = page.locator('#btn-popcorn-known');
    await expect(knownBtn2).toBeVisible({ timeout: 5000 });
    await knownBtn2.click();

    // Verify 2nd consecutive click permanently excludes popcorn-001
    const isKnown2 = await page.evaluate(() => {
      return Storage.isPopcornKnown('popcorn-001');
    });
    expect(isKnown2).toBe(true);

    const toast2 = page.locator('.save-toast-notification');
    await expect(toast2).toBeVisible({ timeout: 2000 });
    await expect(toast2).toContainText('마스터 목록에 보관했어요');
  });

  test('4. Stage 1 "몰라요" advances to Stage 2 Conversation Study View with multi-audio & highlighted expression', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    const learnBtn = page.locator('#btn-popcorn-learn');
    await expect(learnBtn).toBeVisible({ timeout: 5000 });

    // Click "몰라요"
    await learnBtn.click();

    // Stage 2 Conversation card appears
    const convCard = page.locator('#popcorn-conversation-card');
    await expect(convCard).toBeVisible({ timeout: 3000 });

    // Check dialogue bubbles for Wayne and Kelly
    const bubbles = page.locator('.dialogue-bubble');
    await expect(bubbles).toHaveCount(3);

    // Check speaker avatar images and names
    const avatars = page.locator('.speaker-avatar-img');
    await expect(avatars).toHaveCount(3);
    await expect(avatars.first()).toHaveAttribute('src', /assets\/img\/avatars\/wayne\.jpeg/);
    await expect(avatars.nth(1)).toHaveAttribute('src', /assets\/img\/avatars\/kelly\.jpg/);

    const speakerNames = page.locator('.speaker-name');
    await expect(speakerNames.first()).toHaveText('Wayne');
    await expect(speakerNames.nth(1)).toHaveText('Kelly');

    // Check target expression highlight
    const highlight = page.locator('.popcorn-highlight');
    await expect(highlight).toBeVisible();
    await expect(highlight).toContainText('Just so you know');

    // Check multi-audio play all button & line audio buttons
    const playAllBtn = page.locator('#btn-popcorn-play-all');
    await expect(playAllBtn).toBeVisible();

    const lineAudioBtns = page.locator('.btn-line-audio');
    await expect(lineAudioBtns).toHaveCount(3);

    // Click master play all button
    await playAllBtn.click();
    await page.waitForTimeout(300);

    // Verify first dialogue bubble gets playing highlight
    const firstBubble = page.locator('#dialogue-bubble-0');
    await expect(firstBubble).toHaveClass(/playing/);
  });

  test('5. Reveal action unmasks Korean translation, displays explanation, and triggers 14-day interval', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Advance to study
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Korean translation is initially hidden
    const krText = page.locator('#dialogue-bubble-0 .dialogue-text-kr');
    await expect(krText).not.toBeVisible();

    // Click reveal button
    const revealBtn = page.locator('#btn-popcorn-reveal');
    await revealBtn.click();

    // Korean translation becomes visible
    await expect(krText).toBeVisible();

    // Detailed explanation card is revealed
    const expCard = page.locator('#popcorn-explanation-card');
    await expect(expCard).toBeVisible();
    await expect(expCard).toContainText('참고로 말하자면');

    // Reveal button updates text
    await expect(revealBtn).toHaveText('✓ 해설 확인 완료');

    // Verify 14-day interval is recorded in localStorage
    const inCooldown = await page.evaluate(() => {
      return Storage.isPopcornInCooldown('popcorn-001', 14);
    });
    expect(inCooldown).toBe(true);

    // Simulated 15 days later: interval expired
    const after15Days = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - (15 * 24 * 60 * 60 * 1000);
      Storage.savePopcornSpacedRep(rep);
      const studied = JSON.parse(localStorage.getItem('rhyrhy_popcorn_studied') || '{}');
      studied['popcorn-001'] = Date.now() - (15 * 24 * 60 * 60 * 1000);
      localStorage.setItem('rhyrhy_popcorn_studied', JSON.stringify(studied));
      return Storage.isPopcornInCooldown('popcorn-001', 14);
    });
    expect(after15Days).toBe(false);
  });

  test('6. "문장 저장하기" saves target sentence with audio directly into centralized Saved page', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Advance to study
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    const saveBtn = page.locator('#btn-popcorn-save');
    await expect(saveBtn).toBeVisible();
    await expect(saveBtn).toHaveText('🔖 문장 저장하기');

    // Click Save button
    await saveBtn.click();

    // Button updates state
    await expect(saveBtn).toHaveText('✓ Saved에 저장됨');
    await expect(saveBtn).toHaveClass(/saved/);

    // Verify saved in Storage under 'popcorn'
    const savedList = await page.evaluate(() => {
      return Storage.getSavedSentences('popcorn');
    });
    expect(savedList.length).toBe(1);
    expect(savedList[0].en).toContain('Just so you know');
    expect(savedList[0].audio).toBe('audio/popcorn-001/02.wav');

    // Open centralized Saved Sentences drawer from navbar
    const openDrawerBtn = page.locator('#btn-open-sentences');
    await openDrawerBtn.click();

    const drawer = page.locator('#saved-sentences-drawer');
    await expect(drawer).toBeVisible({ timeout: 3000 });

    // Verify group header for Popcorn English
    const groupHeader = page.locator('.saved-lesson-group');
    await expect(groupHeader).toContainText('🍿 팝콘 영어');

    // Verify sentence card is listed in Saved drawer
    const savedCard = drawer.locator('.saved-sentence-card');
    await expect(savedCard).toBeVisible();
    await expect(savedCard).toContainText('Just so you know');
  });

  test('7. High contrast theme check in Dark and Light modes', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Check Dark Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const bannerDark = page.locator('.popcorn-expression-banner');
    await expect(bannerDark).toBeVisible();

    // Check Light Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const bannerLight = page.locator('.popcorn-expression-banner');
    await expect(bannerLight).toBeVisible();
  });

  test('8. Clicking "다음 팝콘 표현 뽑기" button sets 14-day spaced repetition interval', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Proceed to Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Verify initially not in cooldown
    const initialCooldown = await page.evaluate(() => Storage.isPopcornInCooldown('popcorn-001', 14));
    expect(initialCooldown).toBe(false);

    // Click "다음 팝콘 표현 뽑기"
    const nextBtn = page.locator('#btn-popcorn-next');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    // Popcorn flyer animation element appears during the transition
    const flyer = page.locator('.popcorn-nav-flyer');
    await expect(flyer).toBeVisible({ timeout: 2000 });

    // Interval must be recorded for 14 days
    const isCooldownNow = await page.evaluate(() => Storage.isPopcornInCooldown('popcorn-001', 14));
    expect(isCooldownNow).toBe(true);

    // Simulated 15 days later: interval expires for spaced repetition
    const after15Days = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - (15 * 24 * 60 * 60 * 1000);
      Storage.savePopcornSpacedRep(rep);
      const studied = JSON.parse(localStorage.getItem('rhyrhy_popcorn_studied') || '{}');
      studied['popcorn-001'] = Date.now() - (15 * 24 * 60 * 60 * 1000);
      localStorage.setItem('rhyrhy_popcorn_studied', JSON.stringify(studied));
      return Storage.isPopcornInCooldown('popcorn-001', 14);
    });
    expect(after15Days).toBe(false);
  });

  test('9. Daily study limit of 10 max: "몰라요" increments daily count, "이미 알아요" does not', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Initial count is 0
    let count = await page.evaluate(() => Storage.getPopcornDailyStudyCount());
    expect(count).toBe(0);

    // Clicking "이미 알아요" does NOT increment daily count
    await page.click('#btn-popcorn-known');
    await page.waitForTimeout(300);

    count = await page.evaluate(() => Storage.getPopcornDailyStudyCount());
    expect(count).toBe(0);

    // Reopen lesson and click "몰라요" -> DOES increment count
    await page.goto('/daily.html?id=popcorn-001');
    await page.click('#btn-popcorn-learn');
    await page.waitForTimeout(300);

    count = await page.evaluate(() => Storage.getPopcornDailyStudyCount());
    expect(count).toBe(1);
  });

  test('10. Reaching 10 daily lessons shows empty popcorn bucket image and "내일 다시 팝콘이 준비될거에요"', async ({ page }) => {
    await page.goto('/daily.html');

    // Simulate 10 lessons completed for today
    await page.evaluate(() => {
      const today = Storage.getLocalDateString();
      localStorage.setItem('rhyrhy_popcorn_daily_study', JSON.stringify({
        date: today,
        count: 10
      }));
    });

    // Reload daily.html
    await page.reload();

    // Completion card must be visible
    const completionCard = page.locator('#popcorn-completion-card');
    await expect(completionCard).toBeVisible({ timeout: 5000 });

    // Empty popcorn bucket image is displayed
    const emptyImg = completionCard.locator('.popcorn-empty-img');
    await expect(emptyImg).toBeVisible();
    await expect(emptyImg).toHaveAttribute('src', /assets\/img\/popcorn-empty\.jpg/);

    // Exact required message
    const title = completionCard.locator('.completion-title');
    await expect(title).toHaveText('내일 다시 팝콘이 준비될거에요');

    // Badge indicates 10 / 10
    const badge = completionCard.locator('.completion-badge');
    await expect(badge).toContainText('10 / 10');

    // Test in Light and Dark mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect(title).toBeVisible();
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await expect(title).toBeVisible();
  });

  test('11. Popcorn-002 ("make a [noun] of it") renders dialogue, avatars, audio, and target expression', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-002');

    // Stage 1 Knowledge Check
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.popcorn-expression-banner')).toContainText('make a [noun] of it');

    // Proceed to Stage 2
    await page.click('#btn-popcorn-learn');
    const convCard = page.locator('#popcorn-conversation-card');
    await expect(convCard).toBeVisible({ timeout: 5000 });

    // Dialogue bubbles count
    const bubbles = convCard.locator('.dialogue-bubble');
    await expect(bubbles).toHaveCount(3);

    // First speaker: Wayne
    await expect(bubbles.first().locator('.speaker-name')).toHaveText('Wayne');
    await expect(bubbles.first().locator('.dialogue-text-en')).toContainText('dentist appointment');

    // Second speaker: Kelly with target expression
    await expect(bubbles.nth(1).locator('.speaker-name')).toHaveText('Kelly');
    await expect(bubbles.nth(1).locator('.popcorn-highlight')).toHaveText('make a day of it');

    // Third speaker: Wayne
    await expect(bubbles.nth(2).locator('.speaker-name')).toHaveText('Wayne');
    await expect(bubbles.nth(2).locator('.dialogue-text-en')).toContainText('Smart move');

    // Audio playback check: click Kelly's sentence card
    await bubbles.nth(1).click();
    await expect(bubbles.nth(1)).toHaveClass(/playing/);

    // Reveal explanation check: contains general pattern and context
    await page.click('#btn-popcorn-reveal');
    const expCard = page.locator('#popcorn-explanation-card');
    await expect(expCard).toBeVisible();
    await expect(expCard).toContainText('make a [noun] of it');
    await expect(expCard).toContainText('make a night of it');
  });

  test('12. Clicking "다음 팝콘 표현 뽑기" button scrolls viewport to top upon transitioning to next lesson', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Advance to Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible({ timeout: 10000 });

    // Scroll down to simulate user viewing conversation and actions at bottom
    await page.evaluate(() => window.scrollTo(0, 400));
    const scrolledY = await page.evaluate(() => window.scrollY);
    expect(scrolledY).toBeGreaterThan(0);

    // Click "다음 팝콘 표현 뽑기"
    const nextBtn = page.locator('#btn-popcorn-next');
    await nextBtn.click();

    // Wait for transition to finish and stage 1 check card to display
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });

    // Verify page is scrolled back to top
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);
  });

  test('13. Clicking navbar popcorn button while on daily.html loads a new random quick lesson and scrolls to top', async ({ page }) => {
    // Clear storage so all lessons are available
    await page.goto('/daily.html?id=popcorn-001');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.goto('/daily.html?id=popcorn-001');

    // Advance to Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 350));
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    // Click navbar popcorn button
    const navPopcornBtn = page.locator('#btn-nav-popcorn');
    await expect(navPopcornBtn).toBeVisible();
    await navPopcornBtn.click();

    // Verify flyer animation element appears
    const flyer = page.locator('.popcorn-nav-flyer');
    await expect(flyer).toBeVisible({ timeout: 2000 });

    // Verify new Stage 1 check card appears and page is scrolled to top
    const checkCard = page.locator('#popcorn-check-card');
    await expect(checkCard).toBeVisible({ timeout: 5000 });
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBe(0);

    // Since popcorn-001 was the active lesson and storage is fresh, it should pick the other lesson (popcorn-002: make a [noun] of it)
    await expect(page.locator('.popcorn-expression-banner')).toContainText('make a [noun] of it');
  });
});


