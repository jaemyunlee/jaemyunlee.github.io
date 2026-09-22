const { test, expect } = require('@playwright/test');

test.describe('Lesson 05 Scaffolding & Integration', () => {

  test('Lesson 05 page loads and displays header badges and navigation tabs in published mode', async ({ page }) => {
    await page.goto('/lessons/lesson-05/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 05');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: Quiz');

    // Coming soon notification banner is hidden
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeHidden();

    // Step navigation tabs: Steps 1, 2, 3, 4 all active and enabled
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
    await expect(tab3).not.toHaveClass(/deactivated/);
    await expect(tab4).not.toHaveClass(/deactivated/);
    await expect(tab3).toBeEnabled();
    await expect(tab4).toBeEnabled();

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('영작하기');

    // Clicking Step 3 activates Video & Script section
    await tab3.click();
    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();
    await expect(statusBadge).toHaveText('Step 3: Full Video');

    // Clicking Step 4 activates Reflection section
    await tab4.click();
    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();
    await expect(statusBadge).toHaveText('Step 4: Writing');
  });

  test('Lesson 05 loads all 21 quizzes with drag-and-drop, multiple-choice, fill-in-the-blank, and listening', async ({ page }) => {
    await page.goto('/lessons/lesson-05/index.html');

    // Wait for quiz container to render first question
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible({ timeout: 5000 });

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

    expect(quizDistribution.total).toBe(20);
    expect(quizDistribution.counts['drag-and-drop']).toBe(1);
    expect(quizDistribution.counts['multiple-choice']).toBe(11);
    expect(quizDistribution.counts['fill-in-the-blank']).toBe(4);
    expect(quizDistribution.counts['listening']).toBe(4);

    const q = quizDistribution.quizzes;

    // Q1: drag-and-drop > my brain is mush
    expect(q[0].type).toBe('drag-and-drop');
    expect(q[0].answer).toBe('My brain is mush');
    expect(q[0].tokens).toEqual(['My', 'brain', 'is', 'mush']);

    // Q2: multiple-choice > minors
    expect(q[1].type).toBe('multiple-choice');
    expect(q[1].answer).toBe('minors');
    expect(q[1].options).toContain('minors');

    // Q3: listening > have to do with
    expect(q[2].type).toBe('listening');
    expect(q[2].answer).toBe('had to do with');

    // Q4: multiple-choice > get into
    expect(q[3].type).toBe('multiple-choice');
    expect(q[3].answer).toBe('get into');

    // Q5: multiple-choice > transcript
    expect(q[4].type).toBe('multiple-choice');
    expect(q[4].answer).toBe('transcript');

    // Q6: listening > suit their requirements
    expect(q[5].type).toBe('listening');
    expect(q[5].answer).toBe('suit their requirements');

    // Q7: multiple-choice > cover / covers
    expect(q[6].type).toBe('multiple-choice');
    expect(q[6].answer).toBe('covers');

    // Q8: multiple-choice > prerequisite
    expect(q[7].type).toBe('multiple-choice');
    expect(q[7].answer).toBe('prerequisite');

    // Q9: multiple-choice > waived
    expect(q[8].type).toBe('multiple-choice');
    expect(q[8].answer).toBe('waived');

    // Q10: multiple-choice > cover
    expect(q[9].type).toBe('multiple-choice');
    expect(q[9].answer).toBe('cover');

    // Q11: listening > as well
    expect(q[10].type).toBe('listening');
    expect(q[10].answer).toBe('as well');

    // Q12: fill-in-the-blank > come up
    expect(q[11].type).toBe('fill-in-the-blank');
    expect(q[11].answer).toBe('come up');

    // Q13: multiple-choice > multiple choice
    expect(q[12].type).toBe('multiple-choice');
    expect(q[12].answer).toBe('multiple choice');

    // Q14: multiple-choice > second guess
    expect(q[13].type).toBe('multiple-choice');
    expect(q[13].answer).toBe('second guess');

    // Q15: multiple-choice > decently
    expect(q[14].type).toBe('multiple-choice');
    expect(q[14].answer).toBe('decently');

    // Q16: listening > out of the three
    expect(q[15].type).toBe('listening');
    expect(q[15].answer).toBe('out of the three');

    // Q17: fill-in-the-blank > come up with
    expect(q[16].type).toBe('fill-in-the-blank');
    expect(q[16].answer).toBe('come up with');

    // Q18: multiple-choice > open my eyes
    expect(q[17].type).toBe('multiple-choice');
    expect(q[17].answer).toBe('opened my eyes');

    // Q19: fill-in-the-blank > in-depth
    expect(q[18].type).toBe('fill-in-the-blank');
    expect(q[18].answer).toBe('in-depth');

    // Q20: fill-in-the-blank > fall into
    expect(q[19].type).toBe('fill-in-the-blank');
    expect(q[19].answer).toBe('fell into');
  });

  test('Quiz 1 renders as drag-and-drop and allows chip interaction', async ({ page }) => {
    await page.goto('/lessons/lesson-05/index.html');

    // Ensure Quiz 1 is active
    const dropZone = page.locator('#word-drop-zone');
    await expect(dropZone).toBeVisible({ timeout: 5000 });

    // Chips in the word bank pool
    const chips = page.locator('.drag-word-chip');
    await expect(chips).toHaveCount(4);

    // Slots container
    const slots = page.locator('.word-slot');
    await expect(slots).toHaveCount(4);

    // Click each chip in order: My, brain, is, mush
    await page.locator('.drag-word-chip', { hasText: 'My' }).click();
    await page.locator('.drag-word-chip', { hasText: 'brain' }).click();
    await page.locator('.drag-word-chip', { hasText: 'is' }).click();
    await page.locator('.drag-word-chip', { hasText: 'mush' }).click();

    // Check Answer
    const submitBtn = page.locator('#btn-check');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Feedback should show correct answer
    const feedback = page.locator('.quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
  });

  test('Step 2 Key Sentences & Audio Player initializes with Kelly avatar and all 20 items', async ({ page }) => {
    await page.goto('/lessons/lesson-05/index.html');

    // Navigate to Step 2
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    // Speaker avatar and name
    const speakerAvatar = reviewSection.locator('.sentence-speaker-avatar').first();
    await expect(speakerAvatar).toBeVisible();
    await expect(speakerAvatar).toHaveAttribute('src', /kelly\.jpg/);

    const speakerName = reviewSection.locator('.sentence-speaker-name').first();
    await expect(speakerName).toContainText('Kelly');

    // Sentence cards count
    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards).toHaveCount(20);

    // First card contains "My brain is mush"
    const firstCard = sentenceCards.first();
    await expect(firstCard).toContainText('My brain is mush');

    // 17th card (index 16) highlights "come up with"
    const card17 = sentenceCards.nth(16);
    await expect(card17).toBeVisible();
    const highlight17 = card17.locator('.quiz-vocab-highlight');
    await expect(highlight17).toHaveText('come up with');
    await expect(card17.locator('.sentence-keyword-badge')).toContainText('come up with');
    await expect(card17.locator('.sentence-en-text')).toContainText('come up with something');
    await expect(card17.locator('.sentence-en-text')).not.toContainText('with with');
  });

  test('Lessons catalog and Home page display Lesson 05 as published (no coming-soon badge)', async ({ page }) => {
    // 1. Lessons catalog page
    await page.goto('/lessons.html');
    const lesson05Card = page.locator('#card-lesson-05');
    await expect(lesson05Card).toBeVisible({ timeout: 5000 });
    await expect(lesson05Card).not.toHaveClass(/coming-soon/);
    await expect(lesson05Card.locator('.badge-coming-soon')).toHaveCount(0);

    // Verify action button shows start learning
    const actionBtn = page.locator('#card-lesson-05 .lesson-card-btn');
    await expect(actionBtn).toContainText('학습 시작하기');

    // 2. Home page
    await page.goto('/index.html');
    const homeLesson05Card = page.locator('#card-lesson-05');
    await expect(homeLesson05Card).toBeVisible({ timeout: 5000 });
    await expect(homeLesson05Card).not.toHaveClass(/coming-soon/);
    await expect(homeLesson05Card.locator('.badge-coming-soon')).toHaveCount(0);
  });

  test('Standalone quiz sharing pages exist for Lesson 05 (q1 to q20)', async ({ page }) => {
    // Test q1
    await page.goto('/quiz/lesson-05/q1.html');
    await expect(page).toHaveTitle(/머리가 멍해서 생각이 안 돌아가요|RhyRhy English/);
    const quizCard = page.locator('.quiz-standalone-card');
    await expect(quizCard).toBeVisible();

    // Test q20
    await page.goto('/quiz/lesson-05/q20.html');
    await expect(page).toHaveTitle(/우연히 시작하다, 어쩌다 발을 들이다|RhyRhy English/);
    const quizCard20 = page.locator('.quiz-standalone-card');
    await expect(quizCard20).toBeVisible();
  });

});
