const { test, expect } = require('@playwright/test');

test.describe('Lesson 08 Scaffolding & 5-Step Integration', () => {

  test('Lesson 08 page loads and displays header badges and 5-step navigation', async ({ page }) => {
    await page.goto('/lessons/lesson-08/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 08');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Coming-soon banner is visible
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeVisible();
    await expect(comingSoonBanner).toContainText('본영상 공개 예정');

    // Step navigation tabs: 5 steps + writing tab
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

    // Steps 1 & 2 active, Steps 3, 4, 5, writing deactivated
    await expect(tab1).not.toHaveClass(/deactivated/);
    await expect(tab2).not.toHaveClass(/deactivated/);
    await expect(tab3).toHaveClass(/deactivated/);
    await expect(tab4).toHaveClass(/deactivated/);
    await expect(tab5).toHaveClass(/deactivated/);
    await expect(tabWriting).toHaveClass(/deactivated/);

    await expect(tab1.locator('.step-label')).toHaveText('퀴즈');
    await expect(tab2.locator('.step-label')).toHaveText('핵심 문장');
    await expect(tab3.locator('.step-label')).toHaveText('전체 영상');
    await expect(tab4.locator('.step-label')).toHaveText('받아쓰기');
    await expect(tab5.locator('.step-label')).toHaveText('스피킹 퀴즈');
    await expect(tabWriting.locator('.step-label')).toHaveText('영작하기');
  });

  test('Lesson 08 loads all 28 quizzes matching requested types and target expressions', async ({ page }) => {
    await page.goto('/lessons/lesson-08/index.html');

    // Wait for quiz container to render
    const quizCard = page.locator('.quiz-card');
    await expect(quizCard).toBeVisible();

    // Check total quiz count in QuizEngine
    const totalCountText = await page.locator('.quiz-badge').textContent();
    expect(totalCountText).toContain('Quiz 1 of 28');

    const quizData = await page.evaluate(async () => {
      const parser = window.MarkdownQuizParser;
      const quizzes = await parser.loadFromUrl('./quiz.md');
      return {
        total: quizzes.length,
        quizzes: quizzes
      };
    });

    expect(quizData.total).toBe(28);
    const q = quizData.quizzes;

    // All quizzes must be multiple-choice or drag-and-drop
    q.forEach(quiz => {
      expect(['multiple-choice', 'drag-and-drop']).toContain(quiz.type);
    });

    // Check target expressions
    expect(q[0].answer).toBe('has not gone to plan');
    expect(q[1].answer).toBe('went to go get');
    expect(q[2].answer).toBe('colliding');
    expect(q[3].answer).toBe('get quotes');
    expect(q[4].answer).toBe('dent');
    expect(q[5].answer).toBe('get it fixed');
    expect(q[6].answer).toBe('dealing with');
    expect(q[7].answer).toBe('incident');
    expect(q[8].answer).toBe('ended up');
    expect(q[9].answer).toBe('reinjured');
    expect(q[10].answer).toBe('in a sling');
    expect(q[11].answer).toBe('being referred to');
    expect(q[12].answer).toBe('postpone');
    expect(q[13].answer).toBe('procrastinating');
    expect(q[14].answer).toBe('just so you know');
    expect(q[15].answer).toBe('booked');
    expect(q[16].answer).toBe('in'); // Replaced on top of with in (Issue #108)
    expect(q[17].answer).toBe('rambling');
    expect(q[18].answer).toBe('sounded like');
    expect(q[19].answer).toBe('hairline fracture');
    expect(q[20].answer).toBe('got out of the sling');
    expect(q[21].answer).toBe("that's why");
    expect(q[22].answer).toBe('should have been');
    expect(q[23].answer).toBe('deficiency');
    expect(q[24].answer).toBe('pediatrician');
    expect(q[25].answer).toBe('figure out');
    expect(q[26].answer).toBe('void your warranty');
    expect(q[27].answer).toBe('went a little too crazy with');
  });

  test('Lesson 08 Step 2 renders 28 cards with key expression badges', async ({ page }) => {
    // Navigate directly to step 2 via query param ?step=2
    await page.goto('/lessons/lesson-08/index.html?step=2');

    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    // Verify 28 sentence cards
    const sentenceCards = page.locator('.quiz-sentence-card');
    await expect(sentenceCards).toHaveCount(28);

    // Verify Speaker is Kelly
    const firstSpeaker = page.locator('.sentence-speaker-name').first();
    await expect(firstSpeaker).toHaveText('Kelly');

    // Check key sentence expressions
    const card1Badge = page.locator('#quiz-card-0 .sentence-keyword-badge');
    await expect(card1Badge).toBeVisible();

    const card3Badge = page.locator('#quiz-card-2 .sentence-keyword-badge');
    await expect(card3Badge).toBeVisible();

    const card17Badge = page.locator('#quiz-card-16 .sentence-keyword-badge');
    await expect(card17Badge).toBeVisible();
    await expect(card17Badge).toContainText('in');
  });

  test('All 28 Lesson 08 key sentence audio files exist and return HTTP 200 OK', async ({ request }) => {
    const fs = require('fs');
    const path = require('path');

    const keySentences = JSON.parse(fs.readFileSync(path.join(__dirname, '../lessons/lesson-08/key-sentences.json'), 'utf8'));
    expect(keySentences.length).toBe(28);

    for (let i = 0; i < keySentences.length; i++) {
      const ks = keySentences[i];
      const audioUrl = `/lessons/lesson-08/audio/${ks.audioFile}`;
      const res = await request.get(audioUrl);
      expect(res.status(), `Audio for sentence ${i + 1} (${audioUrl}) should be 200`).toBe(200);
      const contentType = res.headers()['content-type'] || '';
      expect(contentType).toMatch(/audio|wav|mpeg|octet-stream/i);
    }
  });

  test('Lesson 08 card is displayed in catalog with 10월 10일 coming-soon badge', async ({ page }) => {
    await page.goto('/lessons.html');
    const card = page.locator('#card-lesson-08');
    await expect(card).toBeVisible();

    const title = card.locator('.lesson-card-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('세차장');

    const badge = card.locator('.badge-coming-soon');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('10월 10일');

    // Verify 28 퀴즈 count pill
    const meta = card.locator('.lesson-card-meta');
    await expect(meta).toContainText('28 퀴즈');

    // Verify Action button leads to lesson-08
    const btn = card.locator('.lesson-card-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('학습 시작하기');
  });

  test('Lesson 08 card is displayed on home page (index.html) with coming-soon badge', async ({ page }) => {
    await page.goto('/index.html');
    const card = page.locator('#card-lesson-08');
    await expect(card).toBeVisible();

    const title = card.locator('.lesson-card-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('세차장');

    const badge = card.locator('.badge-coming-soon');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('10월 10일');
  });

  test('Lesson 08 pre-rendered standalone quiz pages exist and have correct OG metadata', async ({ page }) => {
    await page.goto('/quiz/lesson-08/q1.html');

    // Title & OG Meta
    const pageTitle = await page.title();
    expect(pageTitle).toContain('계획대로');

    // Check embedded JSON quiz data
    const quizDataHandle = await page.locator('#quiz-data').textContent();
    expect(quizDataHandle).toBeTruthy();
    const quizData = JSON.parse(quizDataHandle);
    expect(quizData.lessonId).toBe('lesson-08');
    expect(quizData.num).toBe(1);
    expect(['multiple-choice', 'drag-and-drop']).toContain(quizData.type);
  });

});
