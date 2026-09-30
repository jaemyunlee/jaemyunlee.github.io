const { test, expect } = require('@playwright/test');

test.describe('Lesson 06 Scaffolding & Integration', () => {

  test('Lesson 06 page loads and displays header badges and navigation tabs in published mode', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 06');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Coming soon notification banner is hidden
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeHidden();

    // Step navigation tabs: Steps 1, 2, 3, 4, 5, writing all active and enabled
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    const tab5 = page.locator('.step-tab-btn[data-step="5"]');
    const tabWriting = page.locator('.step-tab-btn[data-step="writing"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();
    await expect(tab5).toBeVisible();
    await expect(tabWriting).toBeVisible();

    await expect(tab1).not.toHaveClass(/deactivated/);
    await expect(tab2).not.toHaveClass(/deactivated/);
    await expect(tab3).not.toHaveClass(/deactivated/);
    await expect(tab4).not.toHaveClass(/deactivated/);
    await expect(tab5).not.toHaveClass(/deactivated/);
    await expect(tabWriting).not.toHaveClass(/deactivated/);
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();
    await expect(tab5).toBeEnabled();
    await expect(tabWriting).toBeEnabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('받아쓰기');
    await expect(tab5.locator('.step-label')).toHaveText('스피킹 퀴즈');
    await expect(tabWriting.locator('.step-label')).toHaveText('영작하기');

    // No lock icons in published mode
    await expect(tab3.locator('.step-lock-icon')).toHaveCount(0);
    await expect(tab4.locator('.step-lock-icon')).toHaveCount(0);
    await expect(tab5.locator('.step-lock-icon')).toHaveCount(0);
    await expect(tabWriting.locator('.step-lock-icon')).toHaveCount(0);

    // Clicking Step 3 activates Video & Script section
    await tab3.click();
    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();
    await expect(statusBadge).toHaveText('Step 3: 전체 영상');

    // Clicking Step 4 activates Dictation section
    await tab4.click();
    const dictationSection = page.locator('#dictation-section');
    await expect(dictationSection).toBeVisible();
    await expect(statusBadge).toHaveText('Step 4: 받아쓰기');

    // Clicking Step 5 activates Speaking Quiz section
    await tab5.click();
    const reviewQuizSection = page.locator('#review-quiz-section');
    await expect(reviewQuizSection).toBeVisible();
    await expect(statusBadge).toHaveText('Step 5: 스피킹 퀴즈');

    // Clicking Writing tab activates Reflection section
    await tabWriting.click();
    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();
    await expect(statusBadge).toHaveText('✍️ 영작하기');
  });

  test('Lesson 06 loads all 24 quizzes matching requested types and target expressions', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    const quizDistribution = await page.evaluate(async () => {
      const parser = window.MarkdownQuizParser;
      const quizzes = await parser.loadFromUrl('./quiz.md');
      const counts = { 'drag-and-drop': 0, 'multiple-choice': 0, 'fill-in-the-blank': 0, 'listening': 0 };
      quizzes.forEach(q => counts[q.type] = (counts[q.type] || 0) + 1);
      return {
        total: quizzes.length,
        counts: counts,
        quizzes: quizzes
      };
    });

    expect(quizDistribution.total).toBe(23);
    expect(quizDistribution.counts['multiple-choice']).toBe(23);

    const q = quizDistribution.quizzes;

    // Check sample quizzes
    expect(q[0].answer).toBe('ended up');
    expect(q[1].answer).toBe('hang around');
    expect(q[2].answer).toBe('practical');
    expect(q[3].answer).toBe('went out to dinner');
    expect(q[4].answer).toBe('pushing the peppers aside');
    expect(q[5].answer).toBe('show off');
    expect(q[6].answer).toBe('enjoyed being around');
    expect(q[7].answer).toBe('got taken to the bar');
    expect(q[8].answer).toBe('one of the times');
    expect(q[9].answer).toBe('early in the relationship');
    expect(q[10].answer).toBe('all the way from');
    expect(q[11].answer).toBe('went around a corner');
    expect(q[12].answer).toBe('the time of year');
    expect(q[13].answer).toBe('take a nap');
    expect(q[14].answer).toBe('dull moment');
    expect(q[15].answer).toBe('backing out');
    expect(q[16].answer).toBe("it's a pain");
    expect(q[17].answer).toBe('Way back');
    expect(q[18].answer).toBe('It was surprising that');
    expect(q[19].answer).toBe('disturbed');
    expect(q[20].answer).toBe('sightings');
    expect(q[21].answer).toBe('have got to');
    expect(q[22].answer).toBe('figuring out');
  });

  test('Step 2 Key Sentences Review Player initializes with Gene speaker info and 23 items', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Click Step 2 tab
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    const speakerAvatar = reviewSection.locator('.sentence-speaker-avatar').first();
    await expect(speakerAvatar).toBeVisible();
    await expect(speakerAvatar).toHaveAttribute('src', /gene\.jpeg/);

    const speakerName = reviewSection.locator('.sentence-speaker-name').first();
    await expect(speakerName).toContainText('Gene');

    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards).toHaveCount(23);

    // Sentence 05 (index 4): Verify clean highlighting without residual brackets
    const card5Text = reviewSection.locator('#quiz-card-4 .sentence-en-text');
    await expect(card5Text).toContainText('I was pushing the peppers aside.');
    const card5Marks = card5Text.locator('mark.quiz-vocab-highlight');
    await expect(card5Marks).toHaveCount(2);
    await expect(card5Marks.nth(0)).toHaveText('pushing');
    await expect(card5Marks.nth(1)).toHaveText('aside');
    const card5Raw = await card5Text.innerHTML();
    expect(card5Raw).not.toContain('[');
    expect(card5Raw).not.toContain(']');
    expect(card5Raw).not.toContain('pushing, aside');

    // Sentence 11 (index 10): Verify multi-blank highlighting without residual brackets
    const card11Text = reviewSection.locator('#quiz-card-10 .sentence-en-text');
    await expect(card11Text).toContainText('We carried it all the way from Martinez to Lafayette.');
    const card11Marks = card11Text.locator('mark.quiz-vocab-highlight');
    expect(await card11Marks.count()).toBeGreaterThanOrEqual(2);
    const card11Raw = await card11Text.innerHTML();
    expect(card11Raw).not.toContain('[');
    expect(card11Raw).not.toContain(']');
    expect(card11Raw).not.toContain('all, the, way');
  });

  test('Step 2 Key Sentences Review Player displays btn-speed-toggle, icon-only btn-player-playall, and hides sentence-keyword-badge on mobile view', async ({ page }) => {
    // 1. Mobile viewport test
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/lessons/lesson-06/index.html');

    // Click Step 2 tab
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const speedBtn = page.locator('#btn-player-speed');
    await expect(speedBtn).toBeVisible();
    await expect(speedBtn).toHaveText('1.0x');

    // Click to cycle speed: 1.0x -> 1.2x -> 0.8x -> back to 1.0x (must be 1.0x, never 1x)
    await speedBtn.click();
    await expect(speedBtn).toHaveText('1.2x');
    await speedBtn.click();
    await expect(speedBtn).toHaveText('0.8x');
    await speedBtn.click();
    await expect(speedBtn).toHaveText('1.0x');

    // btn-player-playall: icon-only on mobile (text hidden, compact circular shape, repeat loop icon)
    const playAllBtn = page.locator('#btn-player-playall');
    await expect(playAllBtn).toBeVisible();
    const playAllText = playAllBtn.locator('.playall-text');
    await expect(playAllText).toBeHidden();

    // Verify repeat loop icon SVG path
    const playAllSvg = playAllBtn.locator('svg path');
    const svgPathD = await playAllSvg.getAttribute('d');
    expect(svgPathD).toContain('M7 7h10v3l4-4-4-4v3H5v6h2V7');

    const playAllBox = await playAllBtn.boundingBox();
    expect(playAllBox.width).toBeLessThanOrEqual(42);
    expect(playAllBox.height).toBeLessThanOrEqual(42);

    // sentence-keyword-badge is hidden on mobile
    const keywordBadge = page.locator('.sentence-keyword-badge').first();
    await expect(keywordBadge).toBeHidden();

    // 2. Desktop viewport test: playall-text and keyword badge are visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(playAllText).toBeVisible();
    await expect(playAllText).toHaveText('전체');
    await expect(keywordBadge).toBeVisible();
  });

  test('App.lessons contains Lesson 06 with published status and 23 vocabCount', async ({ page }) => {
    await page.goto('/lessons.html');

    const lesson06Data = await page.evaluate(() => {
      const les = window.App.lessons.find(l => l.id === 'lesson-06');
      return les;
    });

    expect(lesson06Data).toBeDefined();
    expect(lesson06Data.id).toBe('lesson-06');
    expect(lesson06Data.speaker).toBe('Gene');
    expect(lesson06Data.vocabCount).toBe(23);
    expect(lesson06Data.status).toBe('published');
    expect(lesson06Data.avatar).toContain('gene.jpeg');
  });

  test('SavedAudioPlayer resolves audio for Lesson 06 key expressions', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    const urls = await page.evaluate(() => {
      const player = window.App.savedPlayer;
      return {
        endedUp: player._resolveAudioUrl({ text: 'we ended up dating', lessonId: 'lesson-06' }, '/'),
        hangAround: player._resolveAudioUrl({ text: 'hang around', lessonId: 'lesson-06' }, '/'),
        showOff: player._resolveAudioUrl({ text: 'show off', lessonId: 'lesson-06' }, '/'),
        backingOut: player._resolveAudioUrl({ text: 'backing out', lessonId: 'lesson-06' }, '/'),
        figuringOut: player._resolveAudioUrl({ text: 'figuring out', lessonId: 'lesson-06' }, '/')
      };
    });

    expect(urls.endedUp).toContain('We%20ended%20up%20going%20out');
    expect(urls.hangAround).toContain('hang%20around');
    expect(urls.showOff).toContain('show%20off');
    expect(urls.backingOut).toContain('backing%20out');
    expect(urls.figuringOut).toContain('figuring%20out');
  });

  test('Lesson 06 script.json contains 125 cues with bilingual timestamps', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    const scriptInfo = await page.evaluate(async () => {
      const res = await fetch('./script.json');
      const data = await res.json();
      return {
        length: data.length,
        first: data[0],
        last: data[data.length - 1]
      };
    });

    expect(scriptInfo.length).toBe(125);
    expect(scriptInfo.first.en).toContain('I met my wife');
    expect(scriptInfo.first.kr).toContain('아내를 만난');
    expect(scriptInfo.last.en).toContain('backhoe');
    expect(scriptInfo.last.kr).toContain('굴삭기');
  });

  test('Multiple-choice quiz (Q5) operates smoothly in Step 1 lesson player', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Wait for quiz engine to be ready
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length === 23);

    // Jump directly to Q5 (0-indexed: 4) and ensure multiple-choice sentence is selected
    await page.evaluate(() => {
      if (window.showStep) window.showStep(1, false);
      window.quizEngine.currentIndex = 4;
      if (window.quizEngine.quizPool && window.quizEngine.quizPool[4]) {
        const s0 = window.quizEngine.quizPool[4].sentences[0];
        window.quizEngine.quizzes[4] = { ...window.quizEngine.quizzes[4], ...s0 };
      }
      window.quizEngine.renderCurrentQuestion();
    });

    const optionBtn = page.locator('.choice-btn').filter({ hasText: 'pushing the peppers aside' }).first();
    await expect(optionBtn).toBeVisible();
    await optionBtn.click();

    // Verify correct feedback is displayed
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });

  test('Standalone share quiz Q5 supports choice selection and opens referral modal', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q5.html');

    const choiceBtn = page.locator('.standalone-choice-btn', { hasText: 'pushing the peppers aside' });
    await expect(choiceBtn).toBeVisible();
    await choiceBtn.click();

    // Referral modal opens
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');

    // Action button links directly to lesson 06
    const actionBtn = modal.locator('#btn-full-lesson');
    await expect(actionBtn).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Standalone share quiz Q22 renders as multiple choice with have got to', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q22.html');

    // Options exist and include 'have got to'
    const optionBtns = page.locator('.standalone-choice-btn');
    await expect(optionBtns).toHaveCount(4);

    const gotToBtn = page.locator('.standalone-choice-btn', { hasText: 'have got to' });
    await expect(gotToBtn).toBeVisible();

    // Click 'have got to'
    await gotToBtn.click();

    // Referral modal opens as correct
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');
    await expect(modal.locator('#btn-full-lesson')).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Quiz 11 multiple-choice operates smoothly in Step 1 lesson player', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Wait for quiz engine to be ready
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length === 23);

    // Jump directly to Q11 (0-indexed: 10) and ensure multiple-choice sentence is selected
    await page.evaluate(() => {
      if (window.showStep) window.showStep(1, false);
      window.quizEngine.currentIndex = 10;
      if (window.quizEngine.quizPool && window.quizEngine.quizPool[10]) {
        const s0 = window.quizEngine.quizPool[10].sentences[0];
        window.quizEngine.quizzes[10] = { ...window.quizEngine.quizzes[10], ...s0 };
      }
      window.quizEngine.renderCurrentQuestion();
    });

    const optionBtn = page.locator('.choice-btn').filter({ hasText: 'all the way from' }).first();
    await expect(optionBtn).toBeVisible();
    await optionBtn.click();

    // Feedback confirms answer is correct
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });

  test('Standalone share quiz Q11 renders choices and clicking correct option opens referral modal', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q11.html');

    const choiceBtn = page.locator('.standalone-choice-btn', { hasText: 'all the way from' });
    await expect(choiceBtn).toBeVisible();
    await choiceBtn.click();

    // Referral modal opens as correct
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');
    await expect(modal.locator('#btn-full-lesson')).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Multiple-choice handles wrong option shake/fade and right answer selection', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length === 23);

    // Ensure Step 1 is active and Quiz 1 is multiple-choice
    await page.evaluate(() => {
      if (window.showStep) window.showStep(1, false);
      window.quizEngine.currentIndex = 0;
      if (window.quizEngine.quizPool && window.quizEngine.quizPool[0]) {
        const s0 = window.quizEngine.quizPool[0].sentences[0];
        window.quizEngine.quizzes[0] = { ...window.quizEngine.quizzes[0], ...s0 };
      }
      window.quizEngine.renderCurrentQuestion();
    });

    // Step 1: Quiz 1 is for "ended up"
    const allBtns = page.locator('.choice-btn');
    await expect(allBtns.first()).toBeVisible();

    // 1. Click a wrong answer
    const wrongBtn = page.locator('.choice-btn').filter({ hasNotText: 'ended up' }).first();
    await wrongBtn.click();

    // Verify error state on wrong option and feedback
    await expect(wrongBtn).toBeDisabled();
    await expect(wrongBtn).toHaveClass(/disabled/);

    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/error/);

    // 2. Click the right answer afterwards
    const rightBtn = page.locator('.choice-btn', { hasText: 'ended up' });
    await rightBtn.click();

    // Verify success state
    await expect(rightBtn).toHaveClass(/correct/);
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });
});



