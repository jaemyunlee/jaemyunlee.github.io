const { test, expect } = require('@playwright/test');

test.describe('Lesson 07 Scaffolding & Integration', () => {

  test('Lesson 07 page loads and displays header badges and coming-soon pre-release state', async ({ page }) => {
    await page.goto('/lessons/lesson-07/index.html');

    // Header badge
    const headerBadge = page.locator('.lesson-header-section .badge-primary');
    await expect(headerBadge).toHaveText('Lesson 07');

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
    await expect(comingSoonBanner).toContainText('켈리(Kelly)의 생생한 목소리 오디오와 22개의 퀴즈');

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

  test('Lesson 07 loads all 22 quizzes matching requested types and target expressions', async ({ page }) => {
    await page.goto('/lessons/lesson-07/index.html');

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

    expect(quizData.total).toBe(22);
    expect(quizData.counts['drag-and-drop']).toBe(5);
    expect(quizData.counts['multiple-choice']).toBe(9);
    expect(quizData.counts['fill-in-the-blank']).toBe(8);

    const q = quizData.quizzes;

    // Q1: drag-and-drop > stop me in
    expect(q[0].type).toBe('drag-and-drop');
    expect(q[0].answer).toBe('stop me in');

    // Q2: multiple-choice > random
    expect(q[1].type).toBe('multiple-choice');
    expect(q[1].answer).toBe('random');

    // Q3: multiple-choice > standpoint
    expect(q[2].type).toBe('multiple-choice');
    expect(q[2].answer).toBe('standpoint');

    // Q4: multiple-choice > fermented
    expect(q[3].type).toBe('multiple-choice');
    expect(q[3].answer).toBe('fermented');

    // Q5: fill-in-the-blank > used to
    expect(q[4].type).toBe('fill-in-the-blank');
    expect(q[4].answer).toBe('used to');

    // Q6: drag-and-drop > every other week
    expect(q[5].type).toBe('drag-and-drop');
    expect(q[5].answer).toBe('every other week');

    // Q7: drag-and-drop > there were ever times where
    expect(q[6].type).toBe('drag-and-drop');
    expect(q[6].answer).toBe('there were ever times where');

    // Q8: multiple-choice > got stared at
    expect(q[7].type).toBe('multiple-choice');
    expect(q[7].answer).toBe('got stared at');

    // Q9: fill-in-the-blank > at least
    expect(q[8].type).toBe('fill-in-the-blank');
    expect(q[8].answer).toBe('at least');

    // Q10: multiple-choice > encourage (encouraged)
    expect(q[9].type).toBe('multiple-choice');
    expect(q[9].answer).toBe('encouraged');

    // Q11: fill-in-the-blank > have lived up to (multi-blank)
    expect(q[10].type).toBe('fill-in-the-blank');
    expect(q[10].blanks).toEqual(['have', 'lived', 'up', 'to']);

    // Q12: multiple-choice > be introduced by (was introduced to)
    expect(q[11].type).toBe('multiple-choice');
    expect(q[11].answer).toBe('was introduced to');

    // Q13: fill-in-the-blank > can't say
    expect(q[12].type).toBe('fill-in-the-blank');
    expect(q[12].answer).toBe("can't say");

    // Q14: fill-in-the-blank > supposed to
    expect(q[13].type).toBe('fill-in-the-blank');
    expect(q[13].answer).toBe('supposed to');

    // Q15: multiple-choice > taste the same
    expect(q[14].type).toBe('multiple-choice');
    expect(q[14].answer).toBe('taste the same');

    // Q16: multiple-choice > technically
    expect(q[15].type).toBe('multiple-choice');
    expect(q[15].answer).toBe('technically');

    // Q17: drag-and-drop > based it off of
    expect(q[16].type).toBe('drag-and-drop');
    expect(q[16].answer).toBe('based it off of');

    // Q18: fill-in-the-blank > as good as
    expect(q[17].type).toBe('fill-in-the-blank');
    expect(q[17].answer).toBe('as good as');

    // Q19: fill-in-the-blank > turn out
    expect(q[18].type).toBe('fill-in-the-blank');
    expect(q[18].answer).toBe('turn out');

    // Q20: fill-in-the-blank > whereas
    expect(q[19].type).toBe('fill-in-the-blank');
    expect(q[19].answer).toBe('Whereas');

    // Q21: multiple-choice > oilier to
    expect(q[20].type).toBe('multiple-choice');
    expect(q[20].answer).toBe('oilier to');

    // Q22: drag-and-drop > break from
    expect(q[21].type).toBe('drag-and-drop');
    expect(q[21].answer).toBe('break from');
  });

  test('Step 2 Key Sentences Review Player initializes with Kelly speaker info and 22 items', async ({ page }) => {
    await page.goto('/lessons/lesson-07/index.html');

    // Navigate to Step 2
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    // Verify step 2 review player container
    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    // Verify Kelly avatar and speaker name in review player
    const speakerAvatar = reviewSection.locator('.sentence-speaker-avatar').first();
    await expect(speakerAvatar).toBeVisible();
    await expect(speakerAvatar).toHaveAttribute('src', /kelly\.jpg/);

    const speakerName = reviewSection.locator('.sentence-speaker-name').first();
    await expect(speakerName).toContainText('Kelly');

    const sentenceCards = reviewSection.locator('.quiz-sentence-card');
    await expect(sentenceCards).toHaveCount(22);

    // Verify first and last card English text
    const firstEn = sentenceCards.first().locator('.sentence-en-text');
    await expect(firstEn).toContainText('stop me in');

    const lastEn = sentenceCards.last().locator('.sentence-en-text');
    await expect(lastEn).toContainText('break from');

    // Verify all 22 audio files resolve with 200 OK and match 1:1 without gaps
    const audioCheck = await page.evaluate(async () => {
      const player = window.reviewPlayer;
      if (!player) return { ok: false, error: 'no reviewPlayer' };
      const failed = [];
      for (let i = 0; i < player.quizzes.length; i++) {
        const url = player._resolveAudioUrl(i);
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (!res.ok) {
            failed.push({ index: i, url, status: res.status });
          }
        } catch (e) {
          failed.push({ index: i, url, error: e.message });
        }
      }
      return { ok: failed.length === 0, failed, total: player.quizzes.length, audioFilesCount: player.audioFiles?.length };
    });

    expect(audioCheck.total).toBe(22);
    expect(audioCheck.audioFilesCount).toBe(22);
    expect(audioCheck.ok).toBe(true);
    expect(audioCheck.failed).toEqual([]);
  });

  test('Lesson 07 card is omitted by default in catalog, and visible with [비공개 (테스트)] badge when show_hidden=true', async ({ page }) => {
    // 1. By default, hidden lesson is not in catalog
    await page.goto('/lessons.html');
    await expect(page.locator('#card-lesson-07')).toHaveCount(0);

    // 2. When show_hidden=true is passed, it appears with [비공개 (테스트)] badge
    await page.goto('/lessons.html?show_hidden=true');
    const card = page.locator('#card-lesson-07');
    await expect(card).toBeVisible();

    const badge = card.locator('.badge-hidden');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('비공개 (테스트)');

    // Verify 22 퀴즈 count pill
    const meta = card.locator('.lesson-card-meta');
    await expect(meta).toContainText('22 퀴즈');

    // Verify Action button leads to lesson-07
    const btn = card.locator('.lesson-card-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('테스트 학습하기');
  });

  test('Lesson 07 card is omitted by default on home page (index.html), and visible when show_hidden=true', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#card-lesson-07')).toHaveCount(0);

    // Visible when show_hidden=true
    await page.goto('/index.html?show_hidden=true');
    const card = page.locator('#card-lesson-07');
    await expect(card).toBeVisible();

    const title = card.locator('.lesson-card-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('김치');
  });

  test('Dedicated standalone quiz page loads for Lesson 07 Q1 and shows CTA', async ({ page }) => {
    await page.goto('/quiz/lesson-07/q1.html');

    // Title / heading
    await expect(page).toHaveTitle(/가던 나를 불쑥 불러세우다|현서네 리얼 영어/i);

    // Card contains question
    const challengeCard = page.locator('.quiz-standalone-card');
    await expect(challengeCard).toBeVisible();
    await expect(challengeCard).toContainText('Napa cabbages');

    // Main action button in referral modal links to full lesson
    const fullLessonBtn = page.locator('#btn-full-lesson');
    await expect(fullLessonBtn).toBeAttached();
    await expect(fullLessonBtn).toHaveAttribute('href', /lessons\/lesson-07\/index\.html/);
  });

  test('Theme switching works on Lesson 07 page without visual glitches', async ({ page }) => {
    await page.goto('/lessons/lesson-07/index.html');

    // Switch to light theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Switch to dark theme
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

});
