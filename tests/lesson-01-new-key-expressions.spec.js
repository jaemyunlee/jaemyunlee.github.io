const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Lesson 01 Key Expressions Expansion (Issue #78)', () => {

  test('Lesson 01 metadata and quiz.md define exactly 26 vocabulary items', async ({ page }) => {
    // 1. Check metadata.json
    const metaRes = await page.request.get('/lessons/lesson-01/metadata.json');
    expect(metaRes.ok()).toBe(true);
    const metadata = await metaRes.json();
    expect(metadata.vocabCount).toBe(26);

    // 2. Check quiz.md contains Quiz 1 through Quiz 26
    const quizMdPath = path.join(__dirname, '../lessons/lesson-01/quiz.md');
    const quizMd = fs.readFileSync(quizMdPath, 'utf-8');
    for (let i = 1; i <= 26; i++) {
      expect(quizMd).toContain(`## Quiz ${i}`);
    }
  });

  test('Lesson 01 card in catalog and home page displays updated 26 퀴즈 in meta pill', async ({ page }) => {
    // 1. Home page
    await page.goto('/index.html');
    const homeCard = page.locator('#card-lesson-01');
    await expect(homeCard).toBeVisible();
    await expect(homeCard.locator('.lesson-card-meta')).toContainText('26 퀴즈');

    // 2. Lessons catalog page
    await page.goto('/lessons.html');
    const catalogCard = page.locator('#card-lesson-01');
    await expect(catalogCard).toBeVisible();
    await expect(catalogCard.locator('.lesson-card-meta')).toContainText('26 퀴즈');
  });

  test('Lesson 01 loads 26 quizzes and renders Quiz 22-26 correctly in Step 1', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Wait for quiz card to load
    const quizCard = page.locator('#quiz-container .quiz-card');
    await expect(quizCard).toBeVisible({ timeout: 5000 });

    // Verify loadedQuizzes array length is 26
    const quizCount = await page.evaluate(() => {
      return (window.quizEngine && window.quizEngine.quizzes) ? window.quizEngine.quizzes.length : 0;
    });
    expect(quizCount).toBe(26);
  });

  test('Step 2 ReviewPlayer contains 26 sentences with working audio files', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Wait for quiz card to load first to ensure quiz.md fetch completed
    await expect(page.locator('#quiz-container .quiz-card')).toBeVisible({ timeout: 5000 });

    // Switch to Step 2
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    // Verify track badge shows 01/26
    const badge = page.locator('#player-track-badge');
    await expect(badge).toHaveText('01/26');

    // Verify 26 sentence cards exist
    const cards = page.locator('.quiz-sentence-card');
    await expect(cards).toHaveCount(26);

    // Verify the new cards (index 21 to 25 -> Q22 to Q26)
    const card22 = cards.nth(21);
    await expect(card22).toContainText('trying to');

    const card23 = cards.nth(22);
    await expect(card23).toContainText('all the way');

    const card24 = cards.nth(23);
    await expect(card24).toContainText('at once');

    const card25 = cards.nth(24);
    await expect(card25).toContainText('in advance');

    const card26 = cards.nth(25);
    await expect(card26).toContainText('ahead of time');
  });

  test('Dedicated quiz pages (q22.html to q26.html) exist with OG tags and interactive answering', async ({ page }) => {
    const questions = [
      { q: 22, answer: 'trying to', ogImg: 'lesson-01-q22.png', keyword: '애쓰다' },
      { q: 23, answer: 'all the way', ogImg: 'lesson-01-q23.png', keyword: '끝까지' },
      { q: 24, answer: 'at once', ogImg: 'lesson-01-q24.png', keyword: '한꺼번에' },
      { q: 25, answer: 'in advance', ogImg: 'lesson-01-q25.png', keyword: '사전에' },
      { q: 26, answer: 'ahead of time', ogImg: 'lesson-01-q26.png', keyword: '미리' }
    ];

    for (const item of questions) {
      // 1. Verify static pre-rendered file in dist
      const distPath = path.join(__dirname, `../dist/quiz/lesson-01/q${item.q}.html`);
      expect(fs.existsSync(distPath)).toBe(true);
      const htmlContent = fs.readFileSync(distPath, 'utf-8');
      expect(htmlContent).toContain(item.ogImg);
      expect(htmlContent).toContain(item.keyword);

      // 2. Verify interactive answering on page
      await page.goto(`/quiz/lesson-01/q${item.q}.html`);
      const card = page.locator('.quiz-standalone-card');
      await expect(card).toBeVisible({ timeout: 5000 });

      // Click the correct choice button
      const choiceBtn = page.locator(`.standalone-choice-btn[data-answer="${item.answer}"]`);
      await expect(choiceBtn).toBeVisible();
      await choiceBtn.click();

      // Referral modal should be visible
      const modal = page.locator('#quiz-referral-modal');
      await expect(modal).toBeVisible({ timeout: 5000 });
      const fullLessonBtn = modal.locator('#btn-full-lesson');
      await expect(fullLessonBtn).toBeVisible();
      await expect(fullLessonBtn).toHaveAttribute('href', expect.stringContaining('/lessons/lesson-01/index.html'));
    }
  });

  test('Audio files for Q22-Q26 exist on disk and are valid WAV files', () => {
    const audioDir = path.join(__dirname, '../lessons/lesson-01/audio');
    const files = [
      'So trying to find someone to go you know.wav',
      'And then were going to drive all the way down together with her family..wav',
      'All the tickets now its like everyone buys them at once and then sells them resells it..wav',
      'we should have called in advance to say that but we didnt..wav',
      'i should have called ahead of time..wav'
    ];

    for (const f of files) {
      const p = path.join(audioDir, f);
      expect(fs.existsSync(p)).toBe(true);
      const stat = fs.statSync(p);
      expect(stat.size).toBeGreaterThan(50000); // Non-empty audio file
    }
  });

  test('Key expressions SRT file contains synchronized entries for new expressions', () => {
    const srtPath = path.join(__dirname, '../lessons/lesson-01/lesson-01-key-expressions.srt');
    expect(fs.existsSync(srtPath)).toBe(true);
    const srtContent = fs.readFileSync(srtPath, 'utf-8');

    expect(srtContent).toContain('trying to');
    expect(srtContent).toContain('all the way');
    expect(srtContent).toContain('at once');
    expect(srtContent).toContain('in advance');
    expect(srtContent).toContain('ahead of time');
  });

});
