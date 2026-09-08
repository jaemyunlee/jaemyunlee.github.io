const { test, expect } = require('@playwright/test');

test.describe('Lesson Steps & Navigation Flow Restructuring (Issue #21)', () => {
  test('Navigation tabs display the new 4-step sequence and Korean labels', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

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

  test('Step 2 displays Key Sentences review player and guides user to Step 3 (Interactive Video)', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 2
    const tab2 = page.locator('.step-tab-btn[data-step="2"]');
    await tab2.click();

    // Verify review section is visible
    const reviewSection = page.locator('#review-section');
    await expect(reviewSection).toBeVisible();

    // Verify section title is updated to Key Sentences
    const heading = reviewSection.locator('h3');
    await expect(heading).toContainText('핵심 문장 듣기');

    // Verify Step 2 completion card and next-step button to Step 3
    const nextStepBtn = page.locator('#btn-goto-step3');
    await expect(nextStepBtn).toBeVisible();
    await expect(nextStepBtn).toContainText('전체 영상 보러가기');

    // Click next step button -> should transition to Step 3 (Interactive Video)
    await nextStepBtn.click();

    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();
    await expect(tab2).not.toHaveClass(/active/);
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    await expect(tab3).toHaveClass(/active/);
  });

  test('Step 3 completion banner guides user to Step 4 (Writing & Commenting)', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 3
    const tab3 = page.locator('.step-tab-btn[data-step="3"]');
    await tab3.click();

    // Verify video section is visible
    const videoSection = page.locator('#video-section');
    await expect(videoSection).toBeVisible();

    // Verify bottom banner button text does not contain 'Step 3'
    const bannerBtn = page.locator('#btn-banner-goto-step4, #btn-banner-goto-step3');
    await expect(bannerBtn).toBeVisible();
    const bannerText = await bannerBtn.textContent();
    expect(bannerText).not.toContain('Step 3');
    expect(bannerText).toContain('문장 작성 & 댓글 남기기');

    // Trigger video completion modal
    await page.evaluate(() => {
      const modal = document.getElementById('step4-nudge-modal') || document.getElementById('step3-nudge-modal');
      if (modal) modal.style.display = 'flex';
    });

    const modal = page.locator('#step4-nudge-modal');
    await expect(modal).toBeVisible();

    // Click modal button to navigate to Step 4
    const modalBtn = modal.locator('#btn-modal-goto-step4');
    await modalBtn.click();

    // Step 4 (reflection/writing) should be active
    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await expect(tab4).toHaveClass(/active/);

    // Also test navigating directly from banner button
    await tab3.click();
    await expect(videoSection).toBeVisible();
    await bannerBtn.click();
    await expect(reflectionSection).toBeVisible();
    await expect(tab4).toHaveClass(/active/);
  });

  test('Step 4 writing submission marks lesson completed in Storage and displays completion feedback', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');

    // Switch to Step 4
    const tab4 = page.locator('.step-tab-btn[data-step="4"]');
    await tab4.click();

    const reflectionSection = page.locator('#reflection-section');
    await expect(reflectionSection).toBeVisible();

    // Fill sentence in textarea
    const textarea = page.locator('#user-reflection-sentence');
    await textarea.fill('I just happened to practice English today and it was great!');

    // Mock window.open to prevent popup
    await page.evaluate(() => {
      window.open = () => {};
    });

    // Click submit/copy comment button
    const submitBtn = page.locator('#btn-post-comment');
    await submitBtn.click();

    // Verify storage has lesson completed
    const isCompleted = await page.evaluate(() => {
      return Storage.isLessonCompleted('lesson-01');
    });
    expect(isCompleted).toBe(true);

    // Verify completion feedback card is rendered
    const feedback = page.locator('#reflection-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toContainText('축하합니다! 오늘의 레슨을 모두 완주하셨습니다!');

    // Verify YouTube comment button and Next Lesson button
    const ytCommentBtn = feedback.locator('#btn-goto-youtube-comment');
    await expect(ytCommentBtn).toBeVisible();
    await expect(ytCommentBtn).toContainText('유튜브에 댓글 남기러 가기');
    await expect(ytCommentBtn).toHaveAttribute('href', /youtube\.com/);

    const nextLessonBtn = feedback.locator('#btn-goto-next-lesson');
    await expect(nextLessonBtn).toBeVisible();
    await expect(nextLessonBtn).toContainText('다음 레슨 공부하기');
    await expect(nextLessonBtn).toHaveAttribute('href', /lessons/);

    // Old step 4 review button should not exist
    const oldStep4Btn = feedback.locator('#btn-goto-step4');
    await expect(oldStep4Btn).toHaveCount(0);

    // Button updates with completion indicator
    await expect(submitBtn).toContainText('학습 완료');
  });

  test('Completed lesson displays visual completion badge and checkmark in catalog and home page', async ({ page }) => {
    // Seed lesson-01 as completed in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_progress_lesson-01', JSON.stringify({
        completed: true,
        lessonCompleted: true,
        currentQuestionIndex: 20
      }));
      localStorage.setItem('rhyrhy_history', JSON.stringify([
        {
          lessonId: 'lesson-01',
          title: 'Morning Routine & Daily Habits',
          completedAt: new Date().toISOString(),
          quizzesPassed: true,
          lessonCompleted: true
        }
      ]));
    });

    // 1. Check home page
    await page.goto('/index.html');
    const homeCard = page.locator('#card-lesson-01');
    await expect(homeCard).toBeVisible();
    await expect(homeCard).toHaveClass(/completed/);

    const homeBadge = homeCard.locator('.badge-completed');
    await expect(homeBadge).toBeVisible();
    await expect(homeBadge).toContainText('학습 완료');

    // 2. Check catalog page
    await page.goto('/lessons.html');
    const catalogCard = page.locator('#card-lesson-01');
    await expect(catalogCard).toBeVisible();
    await expect(catalogCard).toHaveClass(/completed/);

    const catalogBadge = catalogCard.locator('.badge-completed');
    await expect(catalogBadge).toBeVisible();
    await expect(catalogBadge).toContainText('학습 완료');
  });
});
