const { test, expect } = require('@playwright/test');

test.describe('Lesson 08 Scaffolding & Integration', () => {

  test('Lesson 08 page loads and displays header badges and coming-soon pre-release state', async ({ page }) => {
    await page.goto('/lessons/lesson-08/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 08');

    // Status badge
    const statusBadge = page.locator('#lesson-status-badge');
    await expect(statusBadge).toHaveText('Step 1: Quiz');

    // Hidden draft badge is visible
    const hiddenBadge = page.locator('.lesson-header-section .badge-hidden');
    await expect(hiddenBadge).toBeVisible();
    await expect(hiddenBadge).toContainText('비공개 (테스트)');

    // Coming soon notification banner is visible
    const comingSoonBanner = page.locator('#coming-soon-banner');
    await expect(comingSoonBanner).toBeVisible();
    await expect(comingSoonBanner).toContainText('본영상 공개 예정');
    await expect(comingSoonBanner).toContainText('켈리(Kelly)의 생생한 목소리 오디오와 28개의 퀴즈');

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
      const counts = { 'drag-and-drop': 0, 'multiple-choice': 0, 'fill-in-the-blank': 0 };
      quizzes.forEach(q => counts[q.type] = (counts[q.type] || 0) + 1);
      return {
        total: quizzes.length,
        counts: counts,
        quizzes: quizzes
      };
    });

    expect(quizData.total).toBe(28);
    const q = quizData.quizzes;

    // Check specific target expressions and types
    expect(q[0].type).toBe('drag-and-drop');
    expect(q[0].answer).toBe('has not gone to plan');
    expect(q[0].baseForm).toBe('go to plan');

    expect(q[1].type).toBe('drag-and-drop');
    expect(q[1].answer).toBe('went to go get');
    expect(q[1].baseForm).toBe('go get');

    expect(q[2].type).toBe('multiple-choice');
    expect(q[2].answer).toBe('colliding');
    expect(q[2].baseForm).toBe('collide');

    expect(q[3].type).toBe('drag-and-drop');
    expect(q[3].answer).toBe('get quotes');
    expect(q[3].baseForm).toBe('get quotes');

    expect(q[4].type).toBe('multiple-choice');
    expect(q[4].answer).toBe('dent');
    expect(q[4].baseForm).toBe('dent');

    expect(q[5].type).toBe('fill-in-the-blank');
    expect(q[5].answer).toBe('get it fixed');

    expect(q[6].type).toBe('fill-in-the-blank');
    expect(q[6].answer).toBe('dealing with');
    expect(q[6].baseForm).toBe('deal with');

    expect(q[7].type).toBe('multiple-choice');
    expect(q[7].answer).toBe('incident');
    expect(q[7].baseForm).toBe('incident');

    expect(q[8].type).toBe('fill-in-the-blank');
    expect(q[8].answer).toBe('ended up');
    expect(q[8].baseForm).toBe('end up');

    expect(q[9].type).toBe('multiple-choice');
    expect(q[9].answer).toBe('reinjured');
    expect(q[9].baseForm).toBe('reinjure');

    expect(q[10].type).toBe('multiple-choice');
    expect(q[10].answer).toBe('sling');
    expect(q[10].baseForm).toBe('sling');

    expect(q[11].type).toBe('multiple-choice');
    expect(q[11].answer).toBe('being referred to');
    expect(q[11].baseForm).toBe('be referred to');

    expect(q[12].type).toBe('multiple-choice');
    expect(q[12].answer).toBe('postpone');
    expect(q[12].baseForm).toBe('postpone');

    expect(q[13].type).toBe('multiple-choice');
    expect(q[13].answer).toBe('on top of');
    expect(q[13].baseForm).toBe('on top of');

    expect(q[14].type).toBe('multiple-choice');
    expect(q[14].answer).toBe('procrastinating');
    expect(q[14].baseForm).toBe('procrastinate');

    expect(q[15].type).toBe('drag-and-drop');
    expect(q[15].answer).toBe('just so you know');
    expect(q[15].baseForm).toBe('just so you know');

    expect(q[16].type).toBe('multiple-choice');
    expect(q[16].answer).toBe('booked');
    expect(q[16].baseForm).toBe('book');

    expect(q[17].type).toBe('multiple-choice');
    expect(q[17].answer).toBe('rambling');
    expect(q[17].baseForm).toBe('ramble');

    expect(q[18].type).toBe('multiple-choice');
    expect(q[18].answer).toBe('sounded like');
    expect(q[18].baseForm).toBe('sound like');

    expect(q[19].type).toBe('multiple-choice');
    expect(q[19].answer).toBe('hairline fracture');
    expect(q[19].baseForm).toBe('hairline fracture');

    expect(q[20].type).toBe('drag-and-drop');
    expect(q[20].answer).toBe('got out of the sling');
    expect(q[20].baseForm).toBe('get out of the sling');

    expect(q[21].type).toBe('multiple-choice');
    expect(q[21].answer).toBe("that's why");
    expect(q[21].baseForm).toBe("that's why");

    expect(q[22].type).toBe('drag-and-drop');
    expect(q[22].answer).toBe('should have been');
    expect(q[22].baseForm).toBe('should have been');

    expect(q[23].type).toBe('multiple-choice');
    expect(q[23].answer).toBe('deficiency');
    expect(q[23].baseForm).toBe('deficiency');

    expect(q[24].type).toBe('multiple-choice');
    expect(q[24].answer).toBe('pediatrician');
    expect(q[24].baseForm).toBe('pediatrician');

    expect(q[25].type).toBe('fill-in-the-blank');
    expect(q[25].answer).toBe('figure out');
    expect(q[25].baseForm).toBe('figure out');

    expect(q[26].type).toBe('drag-and-drop');
    expect(q[26].answer).toBe('void our warranty');
    expect(q[26].baseForm).toBe('void warranty');

    expect(q[27].type).toBe('drag-and-drop');
    expect(q[27].answer).toBe('went a little too crazy with');
    expect(q[27].baseForm).toBe('go crazy with');
  });

  test('Lesson 08 Step 2 renders 28 cards with baseForm badges (e.g., reinjure for reinjured)', async ({ page }) => {
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

    // Check specific cards for BaseForm badges:
    // Sentence 01: has not gone to plan -> badge: 💡 go to plan
    const card1Badge = page.locator('#quiz-card-0 .sentence-keyword-badge');
    await expect(card1Badge).toContainText('go to plan');

    // Sentence 03: colliding -> badge: 💡 collide
    const card3Badge = page.locator('#quiz-card-2 .sentence-keyword-badge');
    await expect(card3Badge).toContainText('collide');

    // Sentence 07: dealing with -> badge: 💡 deal with
    const card7Badge = page.locator('#quiz-card-6 .sentence-keyword-badge');
    await expect(card7Badge).toContainText('deal with');

    // Sentence 09: ended up -> badge: 💡 end up
    const card9Badge = page.locator('#quiz-card-8 .sentence-keyword-badge');
    await expect(card9Badge).toContainText('end up');

    // Sentence 10: reinjured -> badge: 💡 reinjure
    const card10Badge = page.locator('#quiz-card-9 .sentence-keyword-badge');
    await expect(card10Badge).toContainText('reinjure');

    // Sentence 12: being referred to -> badge: 💡 be referred to
    const card12Badge = page.locator('#quiz-card-11 .sentence-keyword-badge');
    await expect(card12Badge).toContainText('be referred to');

    // Sentence 15: procrastinating -> badge: 💡 procrastinate
    const card15Badge = page.locator('#quiz-card-14 .sentence-keyword-badge');
    await expect(card15Badge).toContainText('procrastinate');

    // Sentence 17: booked -> badge: 💡 book
    const card17Badge = page.locator('#quiz-card-16 .sentence-keyword-badge');
    await expect(card17Badge).toContainText('book');

    // Sentence 18: rambling -> badge: 💡 ramble
    const card18Badge = page.locator('#quiz-card-17 .sentence-keyword-badge');
    await expect(card18Badge).toContainText('ramble');

    // Sentence 19: sounded like -> badge: 💡 sound like
    const card19Badge = page.locator('#quiz-card-18 .sentence-keyword-badge');
    await expect(card19Badge).toContainText('sound like');

    // Sentence 21: got out of the sling -> badge: 💡 get out of the sling
    const card21Badge = page.locator('#quiz-card-20 .sentence-keyword-badge');
    await expect(card21Badge).toContainText('get out of the sling');

    // Sentence 28: went a little too crazy with -> badge: 💡 go crazy with
    const card28Badge = page.locator('#quiz-card-27 .sentence-keyword-badge');
    await expect(card28Badge).toContainText('go crazy with');
  });

  test('All 28 Lesson 08 audio files exist and return HTTP 200 OK', async ({ request }) => {
    const fs = require('fs');
    const path = require('path');
    const MarkdownQuizParser = require('../js/markdown-quiz-parser.js');

    const quizMd = fs.readFileSync(path.join(__dirname, '../lessons/lesson-08/quiz.md'), 'utf8');
    const quizzes = MarkdownQuizParser.parse(quizMd);
    expect(quizzes.length).toBe(28);

    for (let i = 0; i < quizzes.length; i++) {
      const q = quizzes[i];
      const audioUrl = `/lessons/lesson-08/${q.audio}`;
      const res = await request.get(audioUrl);
      expect(res.status(), `Audio for quiz ${i + 1} (${audioUrl}) should be 200`).toBe(200);
      const contentType = res.headers()['content-type'] || '';
      expect(contentType).toMatch(/audio|wav|octet-stream/i);
    }
  });

  test('Lesson 08 card is omitted by default in catalog, and visible with [비공개 (테스트)] badge when show_hidden=true', async ({ page }) => {
    // 1. By default, hidden lesson is not in catalog
    await page.goto('/lessons.html');
    await expect(page.locator('#card-lesson-08')).toHaveCount(0);

    // 2. When show_hidden=true is passed, it appears with [비공개 (테스트)] badge
    await page.goto('/lessons.html?show_hidden=true');
    const card = page.locator('#card-lesson-08');
    await expect(card).toBeVisible();

    const badge = card.locator('.badge-hidden');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('비공개 (테스트)');

    // Verify 28 퀴즈 count pill
    const meta = card.locator('.lesson-card-meta');
    await expect(meta).toContainText('28 퀴즈');

    // Verify Action button leads to lesson-08
    const btn = card.locator('.lesson-card-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('테스트 학습하기');
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
    expect(quizData.baseForm).toBe('go to plan');
    expect(quizData.type).toBe('drag-and-drop');
  });

});
