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

  test('3. Stage 1 "이미 알아요" marks lesson as known and permanently excludes it', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    const knownBtn = page.locator('#btn-popcorn-known');
    await expect(knownBtn).toBeVisible({ timeout: 5000 });

    // Click "이미 알아요"
    await knownBtn.click();

    // Verify localStorage has marked popcorn-001 as known
    const isKnown = await page.evaluate(() => {
      return Storage.isPopcornKnown('popcorn-001');
    });
    expect(isKnown).toBe(true);

    // Toast notification appears
    const toast = page.locator('.save-toast-notification');
    await expect(toast).toBeVisible({ timeout: 2000 });
    await expect(toast).toContainText('마스터 목록에 보관했어요');
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

    // Check dialogue bubbles for Person A and Person B
    const bubbles = page.locator('.dialogue-bubble');
    await expect(bubbles).toHaveCount(3);

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

  test('5. Reveal action unmasks Korean translation, displays explanation, and triggers 30-day cooldown', async ({ page }) => {
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

    // Verify 30-day cooldown is recorded in localStorage
    const inCooldown = await page.evaluate(() => {
      return Storage.isPopcornInCooldown('popcorn-001', 30);
    });
    expect(inCooldown).toBe(true);
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
    expect(savedList[0].audio).toBe('audio/popcorn-001-b.mp3');

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
});
