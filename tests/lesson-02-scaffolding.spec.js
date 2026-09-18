const { test, expect } = require('@playwright/test');

test.describe('Lesson 02 Scaffolding & Integration', () => {

  test('Lesson 02 page loads and displays header badges and 4-step navigation tabs', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 02');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Step navigation tabs
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');
  });

  test('Lesson 02 loads all 21 quizzes including multiple-choice, fill-in-the-blank, listening, and drag-and-drop', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Wait for quiz container to render first question
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible({ timeout: 5000 });

    // Inspect quizzes loaded in window/App/commentManager
    const quizDistribution = await page.evaluate(async () => {
      const res = await fetch('./quiz.md');
      const text = await res.text();
      const quizzes = window.MarkdownQuizParser.parse(text);
      const counts = { 'multiple-choice': 0, 'fill-in-the-blank': 0, 'listening': 0, 'drag-and-drop': 0 };
      quizzes.forEach(q => {
        counts[q.type] = (counts[q.type] || 0) + 1;
      });
      return {
        total: quizzes.length,
        counts,
        sampleQ1: quizzes[0],
        sampleQ5: quizzes[4],
        sampleQ15: quizzes[14],
        sampleQ18: quizzes[17],
        sampleQ20: quizzes[19],
        sampleQ21: quizzes[20]
      };
    });

    expect(quizDistribution.total).toBe(21);
    expect(quizDistribution.counts['multiple-choice']).toBe(14);
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(4);
    expect(quizDistribution.counts['listening']).toBe(2);
    expect(quizDistribution.counts['drag-and-drop']).toBe(1);

    // Check sample multiple choice
    expect(quizDistribution.sampleQ1.answer).toBe('property');
    expect(quizDistribution.sampleQ1.options).toContain('property');

    // Check newly added Q5 multiple choice
    expect(quizDistribution.sampleQ5.answer).toBe('passed');
    expect(quizDistribution.sampleQ5.options).toContain('passed');

    // Check sample fill-in-the-blank
    expect(quizDistribution.sampleQ15.answer).toBe('moldy');

    // Check sample listening
    expect(quizDistribution.sampleQ18.answer).toBe('mining');
    expect(quizDistribution.sampleQ18.audio).toContain('mining equipment');

    // Check Quiz 20 fill-in-the-blank
    expect(quizDistribution.sampleQ20.answer).toBe('used to');
    expect(quizDistribution.sampleQ20.type).toBe('fill-in-the-blank');

    // Check Quiz 21 drag-and-drop
    expect(quizDistribution.sampleQ21.type).toBe('drag-and-drop');
    expect(quizDistribution.sampleQ21.answer).toBe("that's all I got");
    expect(quizDistribution.sampleQ21.tokens).toEqual(["that's", "all", "I", "got"]);
  });

  test('Step navigation switches between Step 1, Step 2, Step 3, and Step 4', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    // Switch to Step 2 (핵심 문장)
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 2: 핵심 문장');

    // Verify review sentence drawer cards exist
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards.first()).toBeVisible({ timeout: 5000 });
    const count = await sentenceCards.count();
    expect(count).toBe(21);

    // Switch to Step 3 (전체 영상)
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    await tab3.click();

    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');

    // Verify interactive script has all 102 lines
    const scriptCards = page.locator('.script-sentence-card');
    await expect(scriptCards.first()).toBeVisible({ timeout: 5000 });
    const scriptCount = await scriptCards.count();
    expect(scriptCount).toBe(102);

    // Switch to Step 4 (영작하기)
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await tab4.click();

    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 4: 영작하기');
  });

  test('Catalog (lessons.html) and Homepage (index.html) display Lesson 02 card with 21 quizzes', async ({ page }) => {
    // Check lessons catalog
    await page.goto('/lessons.html');
    const lesson02Card = page.locator('#card-lesson-02');
    await expect(lesson02Card).toBeVisible({ timeout: 5000 });
    await expect(lesson02Card).toContainText('웨인 삼촌의 산골 오두막 이야기');
    await expect(lesson02Card).toContainText('5:48');
    await expect(lesson02Card).toContainText('21 퀴즈');

    // Check home page latest lessons
    await page.goto('/index.html');
    const homeLesson02 = page.locator('#card-lesson-02');
    await expect(homeLesson02).toBeVisible({ timeout: 5000 });
    await expect(homeLesson02).toContainText('웨인 삼촌의 산골 오두막 이야기');
  });

  test('SavedAudioPlayer resolves audio URLs for Lesson 02', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');

    const audioUrl = await page.evaluate(() => {
      const item = {
        lessonId: 'lesson-02',
        en: 'We used to go exploring up there, some of the old mines and everything.',
        audio: 'audio/We used to go exploring up there some of the old mines and everything..wav'
      };
      return window.App.savedPlayer._resolveAudioUrl(item, window.App._getBasePath());
    });

    expect(audioUrl).toContain('lessons/lesson-02/audio/We%20used%20to%20go%20exploring%20up%20there%20some%20of%20the%20old%20mines%20and%20everything..wav');
  });

  test('Quiz 21 Drag-and-Drop renders 4 blank slots, allows tapping/moving, and checks answer', async ({ page }) => {
    await page.goto('/quiz/lesson-02/q21.html');

    // Verify title and type badge
    await expect(page.locator('.quiz-meta-pill')).toContainText('단어 배열 퀴즈');
    await expect(page.locator('.standalone-korean-title')).toHaveText('어쨌든, 제가 들려드릴 이야기는 여기까지예요.');

    // Verify drop zone and 4 individual blank slots exist with underbar styling and no text
    const dropZone = page.locator('#word-drop-zone');
    await expect(dropZone).toBeVisible();
    const slots = dropZone.locator('.word-slot');
    await expect(slots).toHaveCount(4);

    // Verify slots have underbar styling (border-bottom) and contain no text
    for (let i = 0; i < 4; i++) {
      const slot = slots.nth(i);
      const slotText = await slot.innerText();
      expect(slotText.trim()).toBe('');
      const borderBottomStyle = await slot.evaluate(el => window.getComputedStyle(el).borderBottomStyle);
      expect(borderBottomStyle).toBe('solid');
    }

    // Verify 4 chips in word bank
    const chips = page.locator('#word-bank-grid .drag-word-chip');
    await expect(chips).toHaveCount(4);

    // Tap each chip in order of answer: that's, all, I, got
    const targetWords = ["that's", "all", "I", "got"];
    for (const word of targetWords) {
      const chip = page.locator(`#word-bank-grid .drag-word-chip[data-word="${word}"]`);
      await chip.click();
    }

    // Now all 4 slots should be filled with chips
    for (let i = 0; i < 4; i++) {
      await expect(slots.nth(i)).toHaveClass(/filled/);
      await expect(slots.nth(i).locator('.drag-word-chip')).toHaveAttribute('data-word', targetWords[i]);
    }

    // Submit answer
    const submitBtn = page.locator('#standalone-submit-btn');
    await submitBtn.click();

    // Referral modal should appear indicating success
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#modal-result-header')).toContainText('정답입니다!');
  });

  test('Lesson player Quiz 20 (fill-in-the-blank) accepts correct answer "used to"', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');
    await page.waitForFunction(() => !!window.quizEngine);

    // Jump to question 20
    await page.evaluate(() => {
      window.quizEngine.currentIndex = 19;
      window.quizEngine.renderCurrentQuestion();
    });

    const quizBadge = page.locator('.quiz-badge');
    await expect(quizBadge).toHaveText('Quiz 20 of 21');
    await expect(page.locator('.quiz-type-tag')).toHaveText('빈칸 채우기');

    const input = page.locator('#quiz-blank-input');
    await expect(input).toBeVisible();
    await input.fill('used to');

    const checkBtn = page.locator('#btn-check');
    await checkBtn.click();

    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toContainText('정답입니다!');
  });

  test('Lesson player Quiz 21 (drag-and-drop) allows tapping, resetting, and checks answer', async ({ page }) => {
    await page.goto('/lessons/lesson-02/index.html');
    await page.waitForFunction(() => !!window.quizEngine);

    // Jump to question 21
    await page.evaluate(() => {
      window.quizEngine.currentIndex = 20;
      window.quizEngine.renderCurrentQuestion();
    });

    const quizBadge = page.locator('.quiz-badge');
    await expect(quizBadge).toHaveText('Quiz 21 of 21');
    await expect(page.locator('.quiz-type-tag')).toHaveText('단어 배열 퀴즈');

    const dropZone = page.locator('#word-drop-zone');
    await expect(dropZone).toBeVisible();
    const slots = dropZone.locator('.word-slot');
    await expect(slots).toHaveCount(4);

    // 1. Test clicking "정답 확인" when empty -> shakes and shows prompt
    const checkBtn = page.locator('#btn-check');
    await checkBtn.click();
    await expect(page.locator('#quiz-feedback')).toContainText('모든 빈칸');

    // 2. Tap all chips into blank slots
    const targetWords = ["that's", "all", "I", "got"];
    for (const word of targetWords) {
      await page.locator(`#word-bank-grid .drag-word-chip[data-word="${word}"]`).click();
    }
    await expect(dropZone.locator('.drag-word-chip')).toHaveCount(4);

    // 3. Test Reset button
    const resetBtn = page.locator('#word-reset-btn');
    await resetBtn.click();
    await expect(dropZone.locator('.drag-word-chip')).toHaveCount(0);
    await expect(page.locator('#word-bank-grid .drag-word-chip')).toHaveCount(4);

    // 4. Tap in correct order again and submit
    for (const word of targetWords) {
      await page.locator(`#word-bank-grid .drag-word-chip[data-word="${word}"]`).click();
    }
    await checkBtn.click();

    // 5. Verify success feedback
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toContainText('정답입니다!');
    await expect(dropZone).toHaveClass(/correct/);
  });

  test('Quiz 21 Drag-and-Drop supports dragTo between specific blank slots and word bank', async ({ page }) => {
    await page.goto('/quiz/lesson-02/q21.html');

    const dropZone = page.locator('#word-drop-zone');
    const bankGrid = page.locator('#word-bank-grid');
    const slot0 = page.locator('#share-slot-0');
    const slot1 = page.locator('#share-slot-1');
    const chipThats = page.locator('#word-bank-grid .drag-word-chip[data-word="that\'s"]');

    // Drag that's into specific Slot 0
    await chipThats.dragTo(slot0);
    await expect(slot0.locator('.drag-word-chip')).toHaveCount(1);
    await expect(slot0).toHaveClass(/filled/);

    // Allow CSS layout transition to settle before second drag
    await page.waitForTimeout(200);
    const chipAll = page.locator('#word-bank-grid .drag-word-chip[data-word="all"]');

    // Drag all into specific Slot 1
    await chipAll.dragTo(slot1);
    await expect(slot1.locator('.drag-word-chip')).toHaveCount(1);
    await expect(slot1).toHaveClass(/filled/);

    // Drag all from Slot 1 back to word bank
    const placedAll = slot1.locator('.drag-word-chip[data-word="all"]');
    await placedAll.dragTo(bankGrid);
    await expect(slot1.locator('.drag-word-chip')).toHaveCount(0);
    await expect(slot1).not.toHaveClass(/filled/);
    await expect(bankGrid.locator('.drag-word-chip[data-word="all"]')).toBeVisible();
  });

  test('Quiz 21 Reset button (초기화) stays strictly single-line across mobile viewports', async ({ page }) => {
    const mobileViewports = [
      { width: 320, height: 568 }, // iPhone SE 1st gen
      { width: 360, height: 740 }, // Galaxy S8/S9 / small Android
      { width: 375, height: 667 }, // iPhone SE 2nd/3rd gen
      { width: 390, height: 844 }, // iPhone 13/14
      { width: 414, height: 896 }, // iPhone XR / Plus
    ];

    for (const vp of mobileViewports) {
      await page.setViewportSize(vp);
      await page.goto('/quiz/lesson-02/q21.html');

      const resetBtn = page.locator('#word-reset-btn');
      await expect(resetBtn).toBeVisible();

      // Check CSS properties preventing multiline wrapping
      const metrics = await resetBtn.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        const span = el.querySelector('span');
        const spanCs = span ? window.getComputedStyle(span) : null;
        return {
          whiteSpace: cs.whiteSpace,
          flexShrink: cs.flexShrink,
          btnHeight: el.offsetHeight,
          spanHeight: span ? span.offsetHeight : null,
          spanWhiteSpace: spanCs ? spanCs.whiteSpace : null,
        };
      });

      expect(metrics.whiteSpace).toBe('nowrap');
      expect(metrics.flexShrink).toBe('0');
      expect(metrics.spanWhiteSpace).toBe('nowrap');
      // Button height should represent a single line (<= 36px)
      expect(metrics.btnHeight).toBeLessThanOrEqual(36);
      if (metrics.spanHeight) {
        expect(metrics.spanHeight).toBeLessThanOrEqual(24);
      }

      // Also verify in-lesson player at Quiz 21
      await page.goto('/lessons/lesson-02/index.html');
      await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length >= 21);
      await page.evaluate(() => {
        window.quizEngine.currentIndex = 20;
        window.quizEngine.renderCurrentQuestion();
      });
      const lessonResetBtn = page.locator('#word-reset-btn');
      await expect(lessonResetBtn).toBeVisible();
      const lessonMetrics = await lessonResetBtn.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        const span = el.querySelector('span');
        return {
          whiteSpace: cs.whiteSpace,
          flexShrink: cs.flexShrink,
          btnHeight: el.offsetHeight,
          spanHeight: span ? span.offsetHeight : null,
        };
      });
      expect(lessonMetrics.whiteSpace).toBe('nowrap');
      expect(lessonMetrics.flexShrink).toBe('0');
      expect(lessonMetrics.btnHeight).toBeLessThanOrEqual(36);
    }
  });

  test('Quiz Action Buttons on mobile: 힌트 is above, 건너뛰기 and 정답확인 are on the same line', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/lesson-02/index.html');

    // Wait for quiz engine to be ready
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length > 0);
    // Go to a fill-in-the-blank question (Quiz 20) with action buttons
    await page.evaluate(() => {
      window.quizEngine.currentIndex = 19; // Quiz 20
      window.quizEngine.renderCurrentQuestion();
    });

    const btnHint = page.locator('#btn-hint');
    const btnSkip = page.locator('#btn-skip');
    const btnCheck = page.locator('#btn-check');

    await expect(btnHint).toBeVisible();
    await expect(btnSkip).toBeVisible();
    await expect(btnCheck).toBeVisible();

    const hintBox = await btnHint.boundingBox();
    const skipBox = await btnSkip.boundingBox();
    const checkBox = await btnCheck.boundingBox();

    // 1. 힌트 button should be above 건너뛰기 and 정답확인
    expect(hintBox.y + hintBox.height).toBeLessThanOrEqual(skipBox.y);
    expect(hintBox.y + hintBox.height).toBeLessThanOrEqual(checkBox.y);

    // 2. 건너뛰기 and 정답확인 button are on the same line (same Y position)
    expect(Math.abs(skipBox.y - checkBox.y)).toBeLessThanOrEqual(2);

    // 3. Both 건너뛰기 and 정답확인 have side-by-side positioning
    expect(skipBox.x + skipBox.width).toBeLessThanOrEqual(checkBox.x + 5);
  });

});



