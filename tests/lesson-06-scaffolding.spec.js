const { test, expect } = require('@playwright/test');

test.describe('Lesson 06 Scaffolding & Integration', () => {

  test('Lesson 06 page loads and displays header badges and coming-soon pre-release state', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 06');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: Quiz');

    // Coming soon notification banner is visible
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeVisible();
    await expect(comingSoonBanner).toContainText('본영상 공개 예정');
    await expect(comingSoonBanner).toContainText('장인어른 진(Gene)의 생생한 목소리 오디오와 24개의 퀴즈');

    // Step navigation tabs: Steps 1 & 2 enabled, Steps 3 & 4 deactivated/disabled
    const tab1 = page.locator('.step-tab-btn[data-step="1"]');
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');

    await expect(tab1).toBeVisible();
    await expect(tab2).toBeVisible();
    await expect(tab3).toBeVisible();
    await expect(tab4).toBeVisible();

    await expect(tab1).not.toHaveClass(/deactivated/);
    await expect(tab2).not.toHaveClass(/deactivated/);
    await expect(tab3).toHaveClass(/deactivated/);
    await expect(tab4).toHaveClass(/deactivated/);
    await expect(tab3).toBeDisabled();
    await expect(tab4).toBeDisabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');

    // Locked coming-soon steps display lock icons
    await expect(tab3.locator('.step-lock-icon')).toBeVisible();
    await expect(tab3.locator('.step-lock-icon')).toHaveText('🔒');
    await expect(tab4.locator('.step-lock-icon')).toBeVisible();
    await expect(tab4.locator('.step-lock-icon')).toHaveText('🔒');
    await expect(tab1.locator('.step-lock-icon')).toHaveCount(0);
    await expect(tab2.locator('.step-lock-icon')).toHaveCount(0);
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

    expect(quizDistribution.total).toBe(24);
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(7);
    expect(quizDistribution.counts['multiple-choice']).toBe(9);
    expect(quizDistribution.counts['drag-and-drop']).toBe(5);
    expect(quizDistribution.counts['listening']).toBe(3);

    const q = quizDistribution.quizzes;

    // Q1: fill-in-the-blank > ended up
    expect(q[0].type).toBe('fill-in-the-blank');
    expect(q[0].answer).toBe('ended up');

    // Q2: multiple-choice > hang around
    expect(q[1].type).toBe('multiple-choice');
    expect(q[1].answer).toBe('hang around');
    expect(q[1].options).toContain('hang around');

    // Q3: multiple-choice > practical
    expect(q[2].type).toBe('multiple-choice');
    expect(q[2].answer).toBe('Practical');

    // Q4: drag-and-drop > went out to dinner
    expect(q[3].type).toBe('drag-and-drop');
    expect(q[3].answer).toBe('went out to dinner');
    expect(q[3].tokens).toEqual(['went', 'out', 'to', 'dinner']);

    // Q5: multiple-choice > looped
    expect(q[4].type).toBe('multiple-choice');
    expect(q[4].answer).toBe('looped');

    // Q6: fill-in-the-blank > pushing ... aside (multi-blank)
    expect(q[5].type).toBe('fill-in-the-blank');
    expect(q[5].blanks).toEqual(['pushing', 'aside']);

    // Q7: fill-in-the-blank > show off
    expect(q[6].type).toBe('fill-in-the-blank');
    expect(q[6].answer).toBe('show off');

    // Q8: fill-in-the-blank > being around (show enjoyed, fill being and around)
    expect(q[7].type).toBe('fill-in-the-blank');
    expect(q[7].answer).toBe('being around');

    // Q9: multiple-choice > taken to the bar
    expect(q[8].type).toBe('multiple-choice');
    expect(q[8].answer).toBe('taken to the bar');

    // Q10: listening > one of the times (changed to listening)
    expect(q[9].type).toBe('listening');
    expect(q[9].answer).toBe('one of the times');

    // Q11: drag-and-drop > early in the relationship
    expect(q[10].type).toBe('drag-and-drop');
    expect(q[10].answer).toBe('early in the relationship');
    expect(q[10].tokens).toEqual(['early', 'in', 'the', 'relationship']);

    // Q12: fill-in-the-blank > all, the, way, from, to (5 separate blanks, show Martinez and Lafayette)
    expect(q[11].type).toBe('fill-in-the-blank');
    expect(q[11].blanks).toEqual(['all', 'the', 'way', 'from', 'to']);

    // Q13: multiple-choice > went around a corner
    expect(q[12].type).toBe('multiple-choice');
    expect(q[12].answer).toBe('went around a corner');

    // Q14: drag-and-drop > the time of year
    expect(q[13].type).toBe('drag-and-drop');
    expect(q[13].answer).toBe('the time of year');
    expect(q[13].tokens).toEqual(['the', 'time', 'of', 'year']);

    // Q15: drag-and-drop > take a nap
    expect(q[14].type).toBe('drag-and-drop');
    expect(q[14].answer).toBe('Take a nap');
    expect(q[14].tokens).toEqual(['Take', 'a', 'nap']);

    // Q16: fill-in-the-blank > dull moment
    expect(q[15].type).toBe('fill-in-the-blank');
    expect(q[15].answer).toBe('dull moment');

    // Q17: multiple-choice > backing out
    expect(q[16].type).toBe('multiple-choice');
    expect(q[16].answer).toBe('backing out');

    // Q18: drag-and-drop > it's a pain
    expect(q[17].type).toBe('drag-and-drop');
    expect(q[17].answer).toBe("It's a pain");
    expect(q[17].tokens).toEqual(["It's", 'a', 'pain']);

    // Q19: listening > way back
    expect(q[18].type).toBe('listening');
    expect(q[18].answer).toBe('Way back');

    // Q20: listening > it was surprising that
    expect(q[19].type).toBe('listening');
    expect(q[19].answer).toBe('It was surprising that');

    // Q21: multiple-choice > disturbed
    expect(q[20].type).toBe('multiple-choice');
    expect(q[20].answer).toBe('disturbed');

    // Q22: multiple-choice > sightings
    expect(q[21].type).toBe('multiple-choice');
    expect(q[21].answer).toBe('sightings');

    // Q23: multiple-choice > got to (display you've, fill got to only, multiple choice)
    expect(q[22].type).toBe('multiple-choice');
    expect(q[22].answer).toBe('got to');

    // Q24: fill-in-the-blank > figuring out
    expect(q[23].type).toBe('fill-in-the-blank');
    expect(q[23].answer).toBe('figuring out');
  });

  test('Step 2 Key Sentences Review Player initializes with Gene speaker info and 24 items', async ({ page }) => {
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
    await expect(sentenceCards).toHaveCount(24);

    // Sentence 06 (index 5): Verify clean highlighting without residual brackets
    const card6Text = reviewSection.locator('#quiz-card-5 .sentence-en-text');
    await expect(card6Text).toContainText('I was pushing the peppers aside.');
    const card6Marks = card6Text.locator('mark.quiz-vocab-highlight');
    await expect(card6Marks).toHaveCount(2);
    await expect(card6Marks.nth(0)).toHaveText('pushing');
    await expect(card6Marks.nth(1)).toHaveText('aside');
    const card6Raw = await card6Text.innerHTML();
    expect(card6Raw).not.toContain('[');
    expect(card6Raw).not.toContain(']');
    expect(card6Raw).not.toContain('pushing, aside');

    // Sentence 12 (index 11): Verify multi-blank highlighting without residual brackets
    const card12Text = reviewSection.locator('#quiz-card-11 .sentence-en-text');
    await expect(card12Text).toContainText('We carried it all the way from Martinez to Lafayette.');
    const card12Marks = card12Text.locator('mark.quiz-vocab-highlight');
    expect(await card12Marks.count()).toBeGreaterThanOrEqual(2);
    const card12Raw = await card12Text.innerHTML();
    expect(card12Raw).not.toContain('[');
    expect(card12Raw).not.toContain(']');
    expect(card12Raw).not.toContain('all, the, way');
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

  test('App.lessons contains Lesson 06 with coming-soon status and 24 vocabCount', async ({ page }) => {
    await page.goto('/lessons.html');

    const lesson06Data = await page.evaluate(() => {
      const les = window.App.lessons.find(l => l.id === 'lesson-06');
      return les;
    });

    expect(lesson06Data).toBeDefined();
    expect(lesson06Data.id).toBe('lesson-06');
    expect(lesson06Data.speaker).toBe('Gene');
    expect(lesson06Data.vocabCount).toBe(24);
    expect(lesson06Data.status).toBe('coming-soon');
    expect(lesson06Data.avatar).toContain('gene.jpeg');
  });

  test('SavedAudioPlayer resolves audio for Lesson 06 key expressions', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    const urls = await page.evaluate(() => {
      const player = window.App.savedPlayer;
      return {
        endedUp: player._resolveAudioUrl({ text: 'we ended up dating', lessonId: 'lesson-06' }, '/'),
        hangAround: player._resolveAudioUrl({ text: 'hang around', lessonId: 'lesson-06' }, '/'),
        looped: player._resolveAudioUrl({ text: 'well looped', lessonId: 'lesson-06' }, '/'),
        backingOut: player._resolveAudioUrl({ text: 'backing out', lessonId: 'lesson-06' }, '/'),
        figuringOut: player._resolveAudioUrl({ text: 'figuring out', lessonId: 'lesson-06' }, '/')
      };
    });

    expect(urls.endedUp).toContain('We%20ended%20up%20going%20out');
    expect(urls.hangAround).toContain('hang%20around');
    expect(urls.looped).toContain('looped');
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

  test('Multi-blank interactive quiz (Q6) operates smoothly in Step 1 lesson player', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Wait for quiz engine to be ready
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length === 24);

    // Jump directly to Q6 (0-indexed: 5)
    await page.evaluate(() => {
      window.quizEngine.currentIndex = 5;
      window.quizEngine.renderCurrentQuestion();
    });

    // Check sentence text displays 'the peppers'
    const sentenceBox = page.locator('.sentence-builder-box');
    await expect(sentenceBox).toContainText('the peppers');

    // Check two blank inputs are rendered
    const blankInputs = page.locator('.quiz-multi-input');
    await expect(blankInputs).toHaveCount(2);

    // Type into first blank
    await blankInputs.nth(0).fill('pushing');
    // Type into second blank
    await blankInputs.nth(1).fill('aside');

    // Click check button
    const checkBtn = page.locator('#btn-check');
    await checkBtn.click();

    // Verify correct feedback is displayed
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });

  test('Standalone share quiz Q6 supports multi-blank inputs and opens referral modal', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q6.html');

    // Wait for quiz share runner to render
    const multiInputs = page.locator('.standalone-multi-input');
    await expect(multiInputs).toHaveCount(2);

    // The sentence displays 'the peppers'
    const shareSentence = page.locator('.standalone-cloze-box');
    await expect(shareSentence).toContainText('the peppers');

    // Type answers
    await multiInputs.nth(0).fill('pushing');
    await multiInputs.nth(1).fill('aside');

    // Submit answer
    const submitBtn = page.locator('#standalone-submit-btn');
    await submitBtn.click();

    // Referral modal opens
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');

    // Action button links directly to lesson 06
    const actionBtn = modal.locator('#btn-full-lesson');
    await expect(actionBtn).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Standalone share quiz Q23 renders as multiple choice with got to', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q23.html');

    // Options exist and include 'got to'
    const optionBtns = page.locator('.standalone-choice-btn');
    await expect(optionBtns).toHaveCount(4);

    const gotToBtn = page.locator('.standalone-choice-btn', { hasText: 'got to' });
    await expect(gotToBtn).toBeVisible();

    // Click 'got to'
    await gotToBtn.click();

    // Referral modal opens as correct
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');
    await expect(modal.locator('#btn-full-lesson')).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Quiz 12 renders 5 separate blank boxes and Enter key moves to next blank box', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Wait for quiz engine to be ready
    await page.waitForFunction(() => window.quizEngine && window.quizEngine.quizzes && window.quizEngine.quizzes.length === 24);

    // Jump directly to Q12 (0-indexed: 11)
    await page.evaluate(() => {
      window.quizEngine.currentIndex = 11;
      window.quizEngine.renderCurrentQuestion();
    });

    // Check sentence text displays 'Martinez' and 'Lafayette'
    const sentenceBox = page.locator('.sentence-builder-box');
    await expect(sentenceBox).toContainText('Martinez');
    await expect(sentenceBox).toContainText('Lafayette');

    // Check exactly 5 blank inputs are rendered
    const blankInputs = page.locator('.quiz-multi-input');
    await expect(blankInputs).toHaveCount(5);

    // Verify enterkeyhint attributes: 0..3 have 'next', 4 has 'done'
    for (let i = 0; i < 4; i++) {
      await expect(blankInputs.nth(i)).toHaveAttribute('enterkeyhint', 'next');
    }
    await expect(blankInputs.nth(4)).toHaveAttribute('enterkeyhint', 'done');

    // Type 'all' and press Enter in 1st box -> focus moves to 2nd box
    await blankInputs.nth(0).fill('all');
    await blankInputs.nth(0).press('Enter');
    await expect(blankInputs.nth(1)).toBeFocused();

    // Type 'the' and press Enter in 2nd box -> focus moves to 3rd box
    await blankInputs.nth(1).fill('the');
    await blankInputs.nth(1).press('Enter');
    await expect(blankInputs.nth(2)).toBeFocused();

    // Type 'way' and press Enter in 3rd box -> focus moves to 4th box
    await blankInputs.nth(2).fill('way');
    await blankInputs.nth(2).press('Enter');
    await expect(blankInputs.nth(3)).toBeFocused();

    // Type 'from' and press Enter in 4th box -> focus moves to 5th box
    await blankInputs.nth(3).fill('from');
    await blankInputs.nth(3).press('Enter');
    await expect(blankInputs.nth(4)).toBeFocused();

    // Type 'to' and press Enter in 5th box -> triggers submit
    await blankInputs.nth(4).fill('to');
    await blankInputs.nth(4).press('Enter');

    // Feedback confirms answer is correct
    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });

  test('Standalone share quiz Q12 renders 5 separate boxes and Enter key moves to next box', async ({ page }) => {
    await page.goto('/quiz/lesson-06/q12.html');

    // Wait for quiz share runner to render 5 inputs
    const multiInputs = page.locator('.standalone-multi-input');
    await expect(multiInputs).toHaveCount(5);

    // Displays Martinez and Lafayette
    const shareSentence = page.locator('.standalone-cloze-box');
    await expect(shareSentence).toContainText('Martinez');
    await expect(shareSentence).toContainText('Lafayette');

    // Enterkeyhint verification
    for (let i = 0; i < 4; i++) {
      await expect(multiInputs.nth(i)).toHaveAttribute('enterkeyhint', 'next');
    }
    await expect(multiInputs.nth(4)).toHaveAttribute('enterkeyhint', 'done');

    // Sequential Enter navigation
    await multiInputs.nth(0).fill('all');
    await multiInputs.nth(0).press('Enter');
    await expect(multiInputs.nth(1)).toBeFocused();

    await multiInputs.nth(1).fill('the');
    await multiInputs.nth(1).press('Enter');
    await expect(multiInputs.nth(2)).toBeFocused();

    await multiInputs.nth(2).fill('way');
    await multiInputs.nth(2).press('Enter');
    await expect(multiInputs.nth(3)).toBeFocused();

    await multiInputs.nth(3).fill('from');
    await multiInputs.nth(3).press('Enter');
    await expect(multiInputs.nth(4)).toBeFocused();

    // Last input submit
    await multiInputs.nth(4).fill('to');
    await multiInputs.nth(4).press('Enter');

    // Referral modal opens as correct
    const modal = page.locator('#quiz-referral-modal');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.result-badge')).toContainText('정답입니다');
    await expect(modal.locator('#btn-full-lesson')).toHaveAttribute('href', '/lessons/lesson-06/index.html');
  });

  test('Fill-in-the-blank decomposes into separate blank blocks without placeholders, shows red error on wrong answer, and green highlight when right answer is submitted after', async ({ page }) => {
    await page.goto('/lessons/lesson-06/index.html');

    // Step 1: Quiz 1 is a fill-in-the-blank quiz for "ended up" -> 2 blank boxes
    const blankInputs = page.locator('.quiz-input');
    await expect(blankInputs).toHaveCount(2);

    // Verify neither box has a placeholder attribute
    await expect(blankInputs.nth(0)).not.toHaveAttribute('placeholder');
    await expect(blankInputs.nth(1)).not.toHaveAttribute('placeholder');

    // 1. Submit an intentional wrong answer
    await blankInputs.nth(0).fill('wrong');
    await blankInputs.nth(1).fill('answer');
    const checkBtn = page.locator('#btn-check');
    await checkBtn.click();

    // Verify error state on both inputs and feedback
    await expect(blankInputs.nth(0)).toHaveClass(/error/);
    await expect(blankInputs.nth(0)).not.toHaveClass(/correct/);
    await expect(blankInputs.nth(1)).toHaveClass(/error/);
    await expect(blankInputs.nth(1)).not.toHaveClass(/correct/);

    const feedback = page.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/error/);
    await expect(feedback).toContainText('빈칸을 다시 확인해보세요');

    // 2. Submit the right answer afterwards (test Space navigation)
    await blankInputs.nth(0).fill('ended');
    await blankInputs.nth(0).press('Space');
    await expect(blankInputs.nth(1)).toBeFocused();
    await blankInputs.nth(1).fill('up');
    await checkBtn.click();

    // Verify green highlight on inputs
    await expect(blankInputs.nth(0)).toHaveClass(/correct/);
    await expect(blankInputs.nth(0)).not.toHaveClass(/error/);
    await expect(blankInputs.nth(0)).toBeDisabled();
    await expect(blankInputs.nth(1)).toHaveClass(/correct/);
    await expect(blankInputs.nth(1)).not.toHaveClass(/error/);
    await expect(blankInputs.nth(1)).toBeDisabled();

    // Verify green highlight on feedback box
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).not.toHaveClass(/error/);
    await expect(feedback).not.toHaveClass(/skip-info/);
    await expect(feedback).toContainText('정답입니다');
    // Verify checkmark SVG polyline is present
    await expect(feedback.locator('svg polyline')).toBeVisible();
  });
});



