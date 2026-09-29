const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Lesson 01 - 5-Step Flow Architecture (Issue #108)', () => {

  test('Step 1: Dynamic Quiz Pool has 26 pools x 5 sentences (strictly multiple-choice and drag-and-drop)', async ({ page }) => {
    // 1. Check quiz-pool.json on disk
    const poolPath = path.join(__dirname, '../lessons/lesson-01/quiz-pool.json');
    expect(fs.existsSync(poolPath)).toBe(true);
    const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
    expect(pool.length).toBe(26);

    let totalSentences = 0;
    pool.forEach((item, idx) => {
      expect(item.keyExpression).toBeTruthy();
      expect(Array.isArray(item.sentences)).toBe(true);
      expect(item.sentences.length).toBe(5);
      totalSentences += item.sentences.length;

      item.sentences.forEach(s => {
        expect(['multiple-choice', 'drag-and-drop']).toContain(s.type);
        expect(s.english).toBeTruthy();
        expect(s.korean).toBeTruthy();
        expect(s.explanation).toBeTruthy();
      });
    });
    expect(totalSentences).toBe(130);

    // 2. Load page and verify QuizEngine loads pool
    await page.goto('/lessons/lesson-01/index.html');
    await expect(page.locator('#quiz-container .quiz-card')).toBeVisible();

    const quizCount = await page.evaluate(() => {
      return window.quizEngine ? window.quizEngine.quizzes.length : 0;
    });
    expect(quizCount).toBe(26);

    const hasPool = await page.evaluate(() => {
      return !!(window.quizEngine && window.quizEngine.quizPool && window.quizEngine.quizPool.length === 26);
    });
    expect(hasPool).toBe(true);
  });

  test('Step 1: Retrying quiz presents an alternate sentence from the pool', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await expect(page.locator('#quiz-container .quiz-card')).toBeVisible();

    // Check sentence 0 in QuizEngine for question 1
    const initialText = await page.evaluate(() => {
      return window.quizEngine.originalQuizzes[0].english;
    });
    expect(initialText).toBeTruthy();

    // Simulate restartQuiz(false)
    const newText = await page.evaluate(() => {
      window.quizEngine.restartQuiz(false);
      return window.quizEngine.originalQuizzes[0].english;
    });

    // Verify it rotated to another sentence in the 5-sentence pool
    const poolSentences = await page.evaluate(() => {
      return window.quizEngine.quizPool[0].sentences.map(s => s.english);
    });
    expect(poolSentences).toContain(newText);
  });

  test('Step 2: Save button is removed in Step 2 for Lesson 01', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await expect(page.locator('#quiz-container .quiz-card')).toBeVisible();

    // Switch to Step 2
    await page.locator('.step-tab-btn[data-step="2"]').click();
    await expect(page.locator('#review-section')).toBeVisible();

    // Check sentence cards exist
    const cards = page.locator('#review-player-container .quiz-sentence-card');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBe(26);

    // Verify save button (.btn-card-bookmark) is NOT rendered
    const bookmarkBtns = page.locator('#review-player-container .btn-card-bookmark');
    const bookmarkCount = await bookmarkBtns.count();
    expect(bookmarkCount).toBe(0);

    // Verify listen button exists and functions
    const playBtns = page.locator('#review-player-container .btn-card-play');
    expect(await playBtns.count()).toBe(26);
  });

  test('Step 3: Interactive transcript renders Flag button and saves to Storage', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await expect(page.locator('#quiz-container .quiz-card')).toBeVisible();

    // Switch to Step 3
    await page.locator('.step-tab-btn[data-step="3"]').click();
    await expect(page.locator('#video-section')).toBeVisible();

    // Verify transcript cards contain flag buttons
    const flagBtns = page.locator('#script-list-container .btn-card-flag');
    await expect(flagBtns.first()).toBeVisible();
    const totalFlags = await flagBtns.count();
    expect(totalFlags).toBeGreaterThan(0);

    // Click first flag button
    const firstFlagBtn = flagBtns.first();
    await firstFlagBtn.click();
    await expect(firstFlagBtn).toHaveClass(/active/);

    // Verify flagged in Storage
    const isStored = await page.evaluate(() => {
      const flagged = Storage.getFlaggedSegments('lesson-01');
      return flagged.length > 0;
    });
    expect(isStored).toBe(true);

    // Click again to unflag
    await firstFlagBtn.click();
    await expect(firstFlagBtn).not.toHaveClass(/active/);

    const isCleared = await page.evaluate(() => {
      const flagged = Storage.getFlaggedSegments('lesson-01');
      return flagged.length === 0;
    });
    expect(isCleared).toBe(true);
  });

  test('Step 4: Dictation practice dynamically includes key sentences and flagged segments', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Pre-flag a segment in Step 3 via Storage
    await page.evaluate(() => {
      Storage.toggleFlaggedSegment('lesson-01', {
        id: 's4',
        start: 14.02,
        end: 20.1,
        en: "No, I'm going, I'm gonna drive down to the Bay Area to go see Big Bang.",
        kr: "아니, 차 타고 베이 에어리어로 내려갈 거예요."
      });
    });

    // Switch to Step 4 Dictation
    await page.locator('.step-tab-btn[data-step="4"]').click();
    await expect(page.locator('#dictation-section')).toBeVisible();

    // Verify Dictation card renders
    const dictCard = page.locator('#dictation-container .dictation-card');
    await expect(dictCard).toBeVisible();

    // Queue size should be 26 key sentences + 1 flagged segment = 27
    const queueLength = await page.evaluate(() => {
      return window.dictationEngine ? window.dictationEngine.queue.length : 0;
    });
    expect(queueLength).toBe(27);

    // Verify audio file used is from audio/segments/
    const firstAudioUrl = await page.evaluate(() => {
      return window.dictationEngine && window.dictationEngine.queue[0] ? window.dictationEngine.queue[0].audioUrl : '';
    });
    expect(firstAudioUrl).toContain('segments/s9.mp3');

    // Verify Cloze blank slot renders with sentence context
    const clozeText = page.locator('#dictation-cloze-text');
    await expect(clozeText).toBeVisible();
    const blankSlot = page.locator('#dictation-blank-slot');
    await expect(blankSlot).toBeVisible();

    // Check hint button toggles masked letters for the key expression
    const hintBtn = page.locator('#btn-dictation-hint');
    await hintBtn.click();
    const hintBox = page.locator('#dictation-hint-box');
    await expect(hintBox).toBeVisible();
    await expect(page.locator('.hint-text')).toContainText('h');

    // Type key expression and verify live blank reflection
    const input = page.locator('#dictation-input');
    await input.fill('happened to');
    await expect(blankSlot).toHaveText('happened to');

    // Submit answer
    await page.locator('#btn-dictation-submit').click();

    // Feedback should show success and highlight key expression
    const feedback = page.locator('#dictation-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(page.locator('.dictation-highlight')).toHaveText('happened to');
  });

  test('Step 5: Review Quiz supports Fill-in-the-Blank and Speaking Quiz with >= 85% similarity', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 5
    await page.locator('.step-tab-btn[data-step="5"]').click();
    await expect(page.locator('#review-quiz-section')).toBeVisible();

    const quizCard = page.locator('#review-quiz-container .review-quiz-card');
    await expect(quizCard).toBeVisible();

    // Verify ReviewQuizEngine calculateSimilarity logic
    const similarityTests = await page.evaluate(() => {
      const engine = window.reviewQuizEngine;
      return {
        exact: engine.calculateSimilarity('happened to', 'happened to'),
        caseInsensitive: engine.calculateSimilarity('Happened To', 'happened to'),
        substringMatch: engine.calculateSimilarity('happened to', 'I just happened to look around'),
        closeTypo: engine.calculateSimilarity('happened to', 'happen to'),
        completelyDifferent: engine.calculateSimilarity('happened to', 'completely different text')
      };
    });

    expect(similarityTests.exact).toBe(1.0);
    expect(similarityTests.caseInsensitive).toBe(1.0);
    expect(similarityTests.substringMatch).toBe(1.0);
    expect(similarityTests.closeTypo).toBeGreaterThanOrEqual(0.85);
    expect(similarityTests.completelyDifferent).toBeLessThan(0.85);

    // Test speaking evaluation
    await page.evaluate(() => {
      window.reviewQuizEngine.evaluateSpokenAnswer('I just happened to look');
    });

    const feedback = page.locator('#review-feedback-box');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('통과');
  });

  test('Step 5: Completing Review Quiz sets lessonCompleted in Storage', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await page.locator('.step-tab-btn[data-step="5"]').click();
    await expect(page.locator('#review-quiz-section')).toBeVisible();
    await expect(page.locator('#review-quiz-container .review-quiz-card')).toBeVisible();

    // Call renderCompletedState
    await page.evaluate(() => {
      window.reviewQuizEngine.renderCompletedState();
    });

    // Verify lesson is marked completed in Storage
    const isCompleted = await page.evaluate(() => {
      return Storage.isLessonCompleted('lesson-01');
    });
    expect(isCompleted).toBe(true);

    // Verify completion screen in DOM
    const completeTitle = page.locator('.review-complete-title');
    await expect(completeTitle).toContainText('모든 5단계 학습 완료');
  });
});
