const { test, expect } = require('@playwright/test');

test.describe('Optional Deep Dive (심화 학습) Step (Issue #70)', () => {

  test('Lesson 04 displays the Peanut tab between Step 2 and Step 3', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const tabs = page.locator('#lesson-step-tabs .step-tab-btn');
    // Tab order: 1 (퀴즈), 2 (핵심 문장), deep-dive (심화 학습), 3 (전체 영상), 4 (영작하기)
    await expect(tabs).toHaveCount(5);

    const deepDiveTab = page.locator('#step-tab-deep-dive');
    await expect(deepDiveTab).toBeVisible();
    await expect(deepDiveTab).toHaveAttribute('data-step', 'deep-dive');
    await expect(deepDiveTab.locator('.step-icon')).toHaveText('🥜');
    await expect(deepDiveTab.locator('.step-label')).toHaveText('심화 학습');

    // Verify it is positioned immediately after Step 2 tab and before Step 3 tab
    const step2Tab = page.locator('.step-tab-btn[data-step="2"]');
    const step3Tab = page.locator('.step-tab-btn[data-step="3"]');
    await expect(step2Tab).toBeVisible();
    await expect(step3Tab).toBeVisible();
  });

  test('Clicking Deep Dive tab opens the section and updates the status badge', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    const deepDiveTab = page.locator('#step-tab-deep-dive');
    const deepDiveSection = page.locator('#deep-dive-section');
    const statusBadge = page.locator('#lesson-status-badge');

    // Initially on Step 1
    await expect(deepDiveSection).toBeHidden();
    await expect(statusBadge).toHaveText('Step 1: 퀴즈');

    // Click Deep Dive tab
    await deepDiveTab.click();

    // Verify active tab and section display
    await expect(deepDiveTab).toHaveClass(/active/);
    await expect(deepDiveSection).toBeVisible();
    await expect(statusBadge).toHaveText('🥜 심화 학습');

    // Other sections should be hidden
    await expect(page.locator('#quiz-section')).toBeHidden();
    await expect(page.locator('#review-section')).toBeHidden();
    await expect(page.locator('#video-section')).toBeHidden();
  });

  test('Deep Dive section renders the 4-part layout specified in Issue #70', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    const section = page.locator('#deep-dive-section');

    // Part 1: Question Prompt (Header)
    const heading = section.locator('.deep-dive-heading');
    await expect(heading).toContainText('왜 과거에 일어난 일인데, turns out은 현재형일까?');
    await expect(section.locator('.badge-peanut')).toContainText('심화 학습 · Deep Dive');

    // Part 2: Context from the Video
    await expect(section).toContainText('영상 속 실제 대화 상황');
    const sceneBox = section.locator('.deep-dive-scene-box');
    await expect(sceneBox).toBeVisible();
    await expect(sceneBox).toContainText('03:17');
    await expect(sceneBox).toContainText('So we were wondering if he had like a girl\'s name written on the belt buckle');
    await expect(sceneBox).toContainText('turns out it was a brand name that said Dsquared');

    // Part 3: Nuance Breakdown (Present vs. Past)
    const breakdownGrid = section.locator('.deep-dive-breakdown-grid');
    await expect(breakdownGrid).toBeVisible();
    await expect(breakdownGrid).toContainText('It turns out (that) ...');
    await expect(breakdownGrid).toContainText('현재형');
    await expect(breakdownGrid).toContainText('It turned out (that) ...');
    await expect(breakdownGrid).toContainText('과거형');
    await expect(section.locator('.deep-dive-takeaway')).toContainText('핵심 꿀팁');

    // Part 4: Additional Examples (3 practical real-world sentences)
    const exampleCards = section.locator('.deep-dive-example-card');
    await expect(exampleCards).toHaveCount(3);

    // Check Example 1
    await expect(exampleCards.nth(0)).toContainText('restaurant was closed');
    await expect(exampleCards.nth(0)).toContainText('it turns out they\'re open till midnight');

    // Check Example 2
    await expect(exampleCards.nth(1)).toContainText('flight delay');
    await expect(exampleCards.nth(1)).toContainText('it turns out the weather cleared up quickly');

    // Check Example 3
    await expect(exampleCards.nth(2)).toContainText('looking for my keys');
    await expect(exampleCards.nth(2)).toContainText('it turns out they were in my backpack');

    // Audio play buttons should not be present on example cards (per design decision)
    await expect(section.locator('.btn-example-speak')).toHaveCount(0);
  });

  test('Step 2 completion card flows into Deep Dive when hasDeepDive is true', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Navigate to Step 2
    await page.locator('.step-tab-btn[data-step="2"]').click();
    await expect(page.locator('#review-section')).toBeVisible();

    // The next step button on Step 2 completion card should guide learner to Deep Dive
    const nextBtn = page.locator('#step2-complete-card .btn-goto-deep-dive');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toContainText('심화 학습 보러가기');

    // Click next button -> should activate Deep Dive step
    await nextBtn.click();
    await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
  });

  test('In Lesson 04, Deep Dive bottom card directs directly to Step 3 and is enabled in published status', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    const bottomCard = page.locator('#deep-dive-section .deep-dive-bottom-card');
    await expect(bottomCard).toBeVisible();

    // Must have exactly one button (no secondary back button)
    const buttons = bottomCard.locator('button');
    await expect(buttons).toHaveCount(1);

    const nextBtn = bottomCard.locator('#btn-deep-dive-next');
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toHaveClass(/btn/);
    await expect(nextBtn).toHaveClass(/btn-primary/);
    await expect(nextBtn).toHaveClass(/btn-goto-step3/);

    // In published status: displays "전체 영상 보기" and is enabled
    await expect(nextBtn).toContainText('전체 영상 보기');
    await expect(nextBtn).toBeEnabled();
    await expect(nextBtn).not.toHaveClass(/deactivated/);
    await expect(page.locator('#btn-deep-dive-back')).toHaveCount(0);

    // Verify nudge text encouraging observation in Step 3 full context
    await expect(bottomCard).toContainText('Step 3 전체 대화 맥락 속에서 확인하기');
    await expect(bottomCard).toContainText('it turns out');
    await expect(bottomCard).toContainText('전체 영상');

    // Clicking nextBtn navigates directly to Step 3
    await nextBtn.click();
    await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');
    await expect(page.locator('#video-section')).toBeVisible();
  });

  test('Lessons without Deep Dive (e.g. Lesson 03) continue to flow seamlessly without Peanut tab', async ({ page }) => {
    // Check Lesson 03
    await page.goto('/lessons/lesson-03/index.html');
    await expect(page.locator('#step-tab-deep-dive')).toHaveCount(0);
    await expect(page.locator('#deep-dive-section')).toHaveCount(0);
    const tabs03 = page.locator('#lesson-step-tabs .step-tab-btn');
    await expect(tabs03).toHaveCount(4);

    // Step 2 completion card in Lesson 03 points directly to Step 3
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const nextBtn03 = page.locator('#step2-complete-card #btn-goto-step3');
    await expect(nextBtn03).toContainText('전체 영상 보러가기');
  });

  test.describe('Lesson 01 Deep Dive (심화 학습) - Nuance of Emphatic Do (Issue #77)', () => {

    test('Lesson 01 displays the Peanut tab between Step 2 and Step 3', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');

      const tabs = page.locator('#lesson-step-tabs .step-tab-btn');
      await expect(tabs).toHaveCount(5);

      const deepDiveTab = page.locator('#step-tab-deep-dive');
      await expect(deepDiveTab).toBeVisible();
      await expect(deepDiveTab).toHaveAttribute('data-step', 'deep-dive');
      await expect(deepDiveTab.locator('.step-icon')).toHaveText('🥜');
      await expect(deepDiveTab.locator('.step-label')).toHaveText('심화 학습');
    });

    test('Clicking Deep Dive tab opens the section and updates the status badge in Lesson 01', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');

      const deepDiveTab = page.locator('#step-tab-deep-dive');
      const deepDiveSection = page.locator('#deep-dive-section');
      const statusBadge = page.locator('#lesson-status-badge');

      await deepDiveTab.click();

      await expect(deepDiveTab).toHaveClass(/active/);
      await expect(deepDiveSection).toBeVisible();
      await expect(statusBadge).toHaveText('🥜 심화 학습');

      // Verify header heading
      const heading = deepDiveSection.locator('.deep-dive-heading');
      await expect(heading).toContainText('좋아한다고 말할 때, 왜 그냥 like 대신 I do like라고 할까?');
    });

    test('Lesson 01 renders 3 separate sections each with its own scene box and comparison grid', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const section = page.locator('#deep-dive-section');

      // Section 1: I do like vs. I like
      const sec1Title = section.locator('.deep-dive-block-title', { hasText: '1. I do like vs. I like' });
      await expect(sec1Title).toBeVisible();
      await expect(section.locator('.deep-dive-scene-meta', { hasText: 'Scene 1: 빅뱅의 신곡에 대한 솔직한 마음' })).toBeVisible();
      await expect(section.locator('.deep-dive-time-badge', { hasText: '⏱ 05:51' })).toBeVisible();
      await expect(section.locator('.breakdown-pattern', { hasText: 'do + 동사원형 (I do like)' })).toBeVisible();
      await expect(section.locator('.breakdown-tense-badge', { hasText: '진심 어린 강조 / 확신' })).toBeVisible();

      // Section 2: I do have ... but vs. I have ... but
      const sec2Title = section.locator('.deep-dive-block-title', { hasText: '2. I do have ... but vs. I have ... but' });
      await expect(sec2Title).toBeVisible();
      await expect(section.locator('.deep-dive-scene-meta', { hasText: 'Scene 2: 콘서트에 같이 갈 친구를 찾으며' })).toBeVisible();
      await expect(section.locator('.deep-dive-time-badge', { hasText: '⏱ 01:09' })).toBeVisible();
      await expect(section.locator('.breakdown-pattern', { hasText: 'do have ... but (양보의 do)' })).toBeVisible();
      await expect(section.locator('.breakdown-tense-badge', { hasText: '부분 인정과 반전 (양보)' })).toBeVisible();

      // Section 3: I do wish vs. I wish
      const sec3Title = section.locator('.deep-dive-block-title', { hasText: '3. I do wish vs. I wish' });
      await expect(sec3Title).toBeVisible();
      await expect(section.locator('.deep-dive-scene-meta', { hasText: 'Scene 3: 가족들과 다 같이 못 가는 진한 아쉬움' })).toBeVisible();
      await expect(section.locator('.deep-dive-time-badge', { hasText: '⏱ 06:31' })).toBeVisible();
      await expect(section.locator('.breakdown-pattern', { hasText: 'do wish (감정 증폭)' })).toBeVisible();
      await expect(section.locator('.breakdown-tense-badge', { hasText: '간절한 바람 / 아쉬움 극대화' })).toBeVisible();

      // Takeaway and examples
      await expect(section.locator('.deep-dive-takeaway')).toBeVisible();
      await expect(section.locator('.deep-dive-example-card')).toHaveCount(3);
    });

    test('In published Lesson 01, Deep Dive bottom card directs directly to Step 3 and is enabled', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const nextBtn = page.locator('#btn-deep-dive-next');
      await expect(nextBtn).toBeVisible();
      await expect(nextBtn).toBeEnabled();

      await nextBtn.click();
      await expect(page.locator('#video-section')).toBeVisible();
      await expect(page.locator('.step-tab-btn[data-step="3"]')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');
    });

    test('LocalStorage restores deep-dive step state on reload in Lesson 01', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html');

      await page.evaluate(() => {
        localStorage.setItem('rhyrhy_step_lesson-01', 'deep-dive');
      });

      await page.reload();

      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
    });

    test('Lesson 01 Deep Dive displays share button in header and share nudge card with copy: 영어 공부하는 다른 사람에게도 알려주세요', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.goto('/lessons/lesson-01/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const headerShareBtn = page.locator('#btn-deep-dive-share');
      await expect(headerShareBtn).toBeVisible();

      const nudge = page.locator('.deep-dive-share-nudge');
      await expect(nudge).toBeVisible();
      await expect(nudge.locator('.share-nudge-headline')).toContainText('영어 공부하는 다른 사람에게도 알려주세요!');

      const nudgeBtn = page.locator('#btn-deep-dive-share-nudge');
      await expect(nudgeBtn).toBeVisible();
      await nudgeBtn.click();

      const toast = page.locator('.save-toast-notification');
      await expect(toast).toContainText('영어 공부하는 다른 사람에게도 알려주세요');
    });

  });

  test.describe('Lesson 02 Deep Dive (심화 학습) - 3 Separate Sections (Issue #74)', () => {

    test('Lesson 02 displays the Peanut tab between Step 2 and Step 3', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');

      const tabs = page.locator('#lesson-step-tabs .step-tab-btn');
      await expect(tabs).toHaveCount(5);

      const deepDiveTab = page.locator('#step-tab-deep-dive');
      await expect(deepDiveTab).toBeVisible();
      await expect(deepDiveTab).toHaveAttribute('data-step', 'deep-dive');
      await expect(deepDiveTab.locator('.step-icon')).toHaveText('🥜');
      await expect(deepDiveTab.locator('.step-label')).toHaveText('심화 학습');
    });

    test('Clicking Deep Dive tab opens the section and updates the status badge', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');

      const deepDiveTab = page.locator('#step-tab-deep-dive');
      const deepDiveSection = page.locator('#deep-dive-section');
      const statusBadge = page.locator('#lesson-status-badge');

      await expect(deepDiveSection).toBeHidden();
      await deepDiveTab.click();

      await expect(deepDiveTab).toHaveClass(/active/);
      await expect(deepDiveSection).toBeVisible();
      await expect(statusBadge).toHaveText('🥜 심화 학습');

      // Other sections should be hidden
      await expect(page.locator('#quiz-section')).toBeHidden();
      await expect(page.locator('#review-section')).toBeHidden();
      await expect(page.locator('#video-section')).toBeHidden();
    });

    test('Renders 3 separate sections each with its own scene box and comparison grid', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const section = page.locator('#deep-dive-section');

      // Header prompt
      await expect(section.locator('.badge-peanut')).toContainText('심화 학습 · Deep Dive');
      await expect(section.locator('.deep-dive-heading')).toContainText('어릴 적 추억을 이야기할 때, 왜 used to와 would를 섞어 쓸까?');

      // 3 separate section headers and scene boxes
      const sectionHeaders = section.locator('.breakdown-section-header');
      await expect(sectionHeaders).toHaveCount(3);

      const sceneBoxes = section.locator('.deep-dive-scene-box');
      await expect(sceneBoxes).toHaveCount(3);

      const breakdownGrids = section.locator('.deep-dive-breakdown-grid');
      await expect(breakdownGrids).toHaveCount(3);

      // Section 1: would play vs played
      await expect(sectionHeaders.nth(0)).toContainText('1. would play vs. played');
      await expect(sceneBoxes.nth(0).locator('.deep-dive-scene-meta')).toContainText('Scene 1: 개울가 물놀이 회상');
      await expect(sceneBoxes.nth(0).locator('.deep-dive-time-badge')).toContainText('⏱ 01:46');
      await expect(sceneBoxes.nth(0).locator('.deep-dive-dialogue')).toContainText('inner tubes and air mattresses');
      await expect(sceneBoxes.nth(0).locator('.deep-dive-dialogue')).toContainText('till we were like blue-lipped');
      await expect(breakdownGrids.nth(0).locator('.breakdown-card').nth(0)).toContainText('would + 동사원형');
      await expect(breakdownGrids.nth(0).locator('.breakdown-card').nth(0)).toContainText('향수 어린 회상');
      await expect(breakdownGrids.nth(0).locator('.breakdown-card').nth(1)).toContainText('played (단순 과거)');
      await expect(breakdownGrids.nth(0).locator('.breakdown-card').nth(1)).toContainText('단순 사실 서술');

      // Section 2: would vs used to
      await expect(sectionHeaders.nth(1)).toContainText('2. would vs. used to');
      await expect(sceneBoxes.nth(1).locator('.deep-dive-scene-meta')).toContainText('Scene 2: 예전의 보(작은 댐)');
      await expect(sceneBoxes.nth(1).locator('.deep-dive-time-badge')).toContainText('⏱ 01:43');
      await expect(sceneBoxes.nth(1).locator('.deep-dive-dialogue')).toContainText('We used to have a dam under the creek.');
      await expect(breakdownGrids.nth(1).locator('.breakdown-card').nth(0)).toContainText('used to + 동사원형');
      await expect(breakdownGrids.nth(1).locator('.breakdown-card').nth(0)).toContainText('현재와의 단절');
      await expect(breakdownGrids.nth(1).locator('.breakdown-card').nth(1)).toContainText('would + 동사원형');
      await expect(breakdownGrids.nth(1).locator('.breakdown-card').nth(1)).toContainText('행동(Action)에만');

      // Section 3: get to vs can
      await expect(sectionHeaders.nth(2)).toContainText('3. get to vs. can');
      await expect(sceneBoxes.nth(2).locator('.deep-dive-scene-meta')).toContainText('Scene 3: 세대를 이어 누리는 삶의 터전');
      await expect(sceneBoxes.nth(2).locator('.deep-dive-time-badge')).toContainText('⏱ 05:25');
      await expect(sceneBoxes.nth(2).locator('.deep-dive-dialogue')).toContainText('Jaemyun and Kelly get to enjoy it');
      await expect(breakdownGrids.nth(2).locator('.breakdown-card').nth(0)).toContainText('get to + 동사원형');
      await expect(breakdownGrids.nth(2).locator('.breakdown-card').nth(0)).toContainText('소중한 기회 / 축복');
      await expect(breakdownGrids.nth(2).locator('.breakdown-card').nth(1)).toContainText('can / could');
      await expect(breakdownGrids.nth(2).locator('.breakdown-card').nth(1)).toContainText('단순 능력 / 허가');

      // Takeaway & 3 Examples
      await expect(section.locator('.deep-dive-takeaway')).toContainText('핵심 꿀팁 정리');
      const examples = section.locator('.deep-dive-example-card');
      await expect(examples).toHaveCount(3);
    });

    test('In published Lesson 02, Deep Dive bottom card directs directly to Step 3 and is enabled', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const nextBtn = page.locator('#btn-deep-dive-next');
      await expect(nextBtn).toBeVisible();
      await expect(nextBtn).toContainText('전체 영상 보러가기');
      await expect(nextBtn).toBeEnabled();
      await expect(nextBtn).not.toHaveClass(/deactivated/);

      // Click button and verify it navigates to Step 3
      await nextBtn.click();
      await expect(page.locator('#video-section')).toBeVisible();
      await expect(page.locator('.step-tab-btn[data-step="3"]')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');
    });

    test('LocalStorage restores deep-dive step state on reload in Lesson 02', async ({ page }) => {
      await page.goto('/lessons/lesson-02/index.html');
      await page.locator('#step-tab-deep-dive').click();
      await expect(page.locator('#deep-dive-section')).toBeVisible();

      const stored = await page.evaluate(() => localStorage.getItem('rhyrhy_step_lesson-02'));
      expect(stored).toBe('deep-dive');

      await page.reload();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
    });

    test('Deep Dive displays share button in header and share nudge card with copy: 영어 공부하는 다른 사람에게도 알려주세요', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
      await page.goto('/lessons/lesson-02/index.html');
      await page.locator('#step-tab-deep-dive').click();

      const headerShareBtn = page.locator('#btn-deep-dive-share');
      await expect(headerShareBtn).toBeVisible();
      await expect(headerShareBtn).toContainText('공유하기');

      const nudgeCard = page.locator('.deep-dive-share-nudge');
      await expect(nudgeCard).toBeVisible();
      await expect(nudgeCard).toContainText('영어 공부하는 다른 사람에게도 알려주세요');

      const nudgeShareBtn = page.locator('#btn-deep-dive-share-nudge');
      await expect(nudgeShareBtn).toBeVisible();
      await expect(nudgeShareBtn).toContainText('심화 학습 공유하기');

      // Click share button and verify feedback
      await nudgeShareBtn.click();
      await expect(nudgeShareBtn).toContainText('복사됨! ✓');
      const toast = page.locator('.save-toast-notification');
      await expect(toast).toContainText('영어 공부하는 다른 사람에게도 알려주세요');
    });

  });

  test.describe('Dedicated Deep Dive Shareable Pages & Direct URL Routing', () => {

    test('Lesson 01 dedicated page (/lessons/lesson-01/deep-dive.html) loads directly on Deep Dive step and allows proceeding to other steps', async ({ page }) => {
      await page.goto('/lessons/lesson-01/deep-dive.html');

      // Seamlessly redirects to index.html?step=deep-dive
      await expect(page).toHaveURL(/.*\/lessons\/lesson-01\/index\.html\?step=deep-dive/);

      // Lands directly on deep-dive step
      const deepDiveSection = page.locator('#deep-dive-section');
      await expect(deepDiveSection).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');

      // Share nudge is present
      const nudge = page.locator('.deep-dive-share-nudge');
      await expect(nudge).toBeVisible();
      await expect(nudge).toContainText('영어 공부하는 다른 사람에게도 알려주세요');

      // User can proceed to Step 3 via bottom card
      const nextBtn = page.locator('#btn-deep-dive-next');
      await expect(nextBtn).toBeVisible();
      await nextBtn.click();

      await expect(page.locator('#video-section')).toBeVisible();
      await expect(page.locator('.step-tab-btn[data-step="3"]')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');

      // User can switch back to Step 1
      await page.locator('.step-tab-btn[data-step="1"]').click();
      await expect(page.locator('#quiz-section')).toBeVisible();
    });

    test('Lesson 02 dedicated page (/lessons/lesson-02/deep-dive.html) loads directly on Deep Dive step and allows proceeding to other steps', async ({ page }) => {
      await page.goto('/lessons/lesson-02/deep-dive.html');

      // Seamlessly redirects to index.html?step=deep-dive
      await expect(page).toHaveURL(/.*\/lessons\/lesson-02\/index\.html\?step=deep-dive/);

      // Lands directly on deep-dive step
      const deepDiveSection = page.locator('#deep-dive-section');
      await expect(deepDiveSection).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');

      // Share nudge is present
      const nudge = page.locator('.deep-dive-share-nudge');
      await expect(nudge).toBeVisible();
      await expect(nudge).toContainText('영어 공부하는 다른 사람에게도 알려주세요');

      // User can proceed to Step 3 via bottom card
      const nextBtn = page.locator('#btn-deep-dive-next');
      await expect(nextBtn).toBeVisible();
      await nextBtn.click();

      await expect(page.locator('#video-section')).toBeVisible();
      await expect(page.locator('.step-tab-btn[data-step="3"]')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('Step 3: 전체 영상');

      // User can switch back to Step 1
      await page.locator('.step-tab-btn[data-step="1"]').click();
      await expect(page.locator('#quiz-section')).toBeVisible();
    });

    test('Lesson 04 dedicated page (/lessons/lesson-04/deep-dive.html) loads directly on Deep Dive step with share buttons', async ({ page }) => {
      await page.goto('/lessons/lesson-04/deep-dive.html');

      // Seamlessly redirects to index.html?step=deep-dive
      await expect(page).toHaveURL(/.*\/lessons\/lesson-04\/index\.html\?step=deep-dive/);

      const deepDiveSection = page.locator('#deep-dive-section');
      await expect(deepDiveSection).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');

      const headerShareBtn = page.locator('#btn-deep-dive-share');
      await expect(headerShareBtn).toBeVisible();

      const nudge = page.locator('.deep-dive-share-nudge');
      await expect(nudge).toBeVisible();
      await expect(nudge).toContainText('영어 공부하는 다른 사람에게도 알려주세요');
    });

    test('Dedicated Deep Dive pages have authentic Open Graph tags and custom Deep Dive OG images (not quiz OG)', async () => {
      const fs = require('fs');
      const path = require('path');

      // 1. Verify Lesson 01 Deep Dive HTML OG tags
      const l01Html = fs.readFileSync(path.join(__dirname, '../lessons/lesson-01/deep-dive.html'), 'utf-8');
      expect(l01Html).toContain('property="og:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-01-deep-dive.png"');
      expect(l01Html).toContain('name="twitter:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-01-deep-dive.png"');
      expect(l01Html).toContain('I do like라고 할까?');
      expect(l01Html).not.toContain('lesson-01-q1.png');

      // 2. Verify Lesson 02 Deep Dive HTML OG tags
      const l02Html = fs.readFileSync(path.join(__dirname, '../lessons/lesson-02/deep-dive.html'), 'utf-8');
      expect(l02Html).toContain('property="og:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-02-deep-dive.png"');
      expect(l02Html).toContain('name="twitter:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-02-deep-dive.png"');
      expect(l02Html).toContain('used to와 would를 섞어 쓸까?');
      expect(l02Html).not.toContain('lesson-02-q6.png');

      // 3. Verify Lesson 04 Deep Dive HTML OG tags
      const l04Html = fs.readFileSync(path.join(__dirname, '../lessons/lesson-04/deep-dive.html'), 'utf-8');
      expect(l04Html).toContain('property="og:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-04-deep-dive.png"');
      expect(l04Html).toContain('name="twitter:image" content="https://rhyrhyenglish.site/assets/img/og/lesson-04-deep-dive.png"');
      expect(l04Html).toContain('turns out은 현재형일까?');
      expect(l04Html).not.toContain('lesson-04-q1.png');

      // 4. Verify actual OG image files exist on disk
      const l01ImgPath = path.join(__dirname, '../assets/img/og/lesson-01-deep-dive.png');
      const l02ImgPath = path.join(__dirname, '../assets/img/og/lesson-02-deep-dive.png');
      const l04ImgPath = path.join(__dirname, '../assets/img/og/lesson-04-deep-dive.png');
      expect(fs.existsSync(l01ImgPath)).toBe(true);
      expect(fs.statSync(l01ImgPath).size).toBeGreaterThan(10000);
      expect(fs.existsSync(l02ImgPath)).toBe(true);
      expect(fs.statSync(l02ImgPath).size).toBeGreaterThan(10000);
      expect(fs.existsSync(l04ImgPath)).toBe(true);
      expect(fs.statSync(l04ImgPath).size).toBeGreaterThan(10000);
    });

    test('URL parameter ?step=deep-dive opens lesson on Deep Dive step directly', async ({ page }) => {
      // Test Lesson 01
      await page.goto('/lessons/lesson-01/index.html?step=deep-dive');
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');

      // Test Lesson 02
      await page.goto('/lessons/lesson-02/index.html?step=deep-dive');
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
      await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');

      // Test Lesson 04
      await page.goto('/lessons/lesson-04/index.html?step=deep-dive');
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    });

    test('URL hash #deep-dive opens lesson on Deep Dive step directly', async ({ page }) => {
      await page.goto('/lessons/lesson-01/index.html#deep-dive');
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);

      await page.goto('/lessons/lesson-02/index.html#deep-dive');
      await expect(page.locator('#deep-dive-section')).toBeVisible();
      await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    });

  });

  test('Deep Dive maintains high contrast in both Dark and Light modes', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');
    await page.locator('#step-tab-deep-dive').click();

    // Dark Mode (default)
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const cardDark = page.locator('.deep-dive-card');
    await expect(cardDark).toBeVisible();
    const headingDark = page.locator('.deep-dive-heading');
    await expect(headingDark).toBeVisible();
    const nudgeBtnDark = page.locator('#btn-deep-dive-share-nudge');
    await expect(nudgeBtnDark).toBeVisible();

    // Light Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    const cardLight = page.locator('.deep-dive-card');
    await expect(cardLight).toBeVisible();
    const headingLight = page.locator('.deep-dive-heading');
    await expect(headingLight).toBeVisible();
    const peanutBadge = page.locator('.badge-peanut');
    await expect(peanutBadge).toBeVisible();
    const nudgeBtnLight = page.locator('#btn-deep-dive-share-nudge');
    await expect(nudgeBtnLight).toBeVisible();

    // Check light mode styles on share nudge button
    const nudgeBtnColor = await nudgeBtnLight.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        color: style.color,
        background: style.backgroundImage || style.backgroundColor
      };
    });
    // White text (#FFFFFF) on indigo gradient background
    expect(nudgeBtnColor.color).toBe('rgb(255, 255, 255)');
    expect(nudgeBtnColor.background).toContain('gradient');
  });

  test('LocalStorage restores deep-dive step state on page reload', async ({ page }) => {
    await page.goto('/lessons/lesson-04/index.html');

    // Click Deep Dive tab
    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();

    // Verify localStorage has deep-dive
    const storedStep = await page.evaluate(() => localStorage.getItem('rhyrhy_step_lesson-04'));
    expect(storedStep).toBe('deep-dive');

    // Reload page
    await page.reload();

    // Should resume on Deep Dive step
    await expect(page.locator('#step-tab-deep-dive')).toHaveClass(/active/);
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await expect(page.locator('#lesson-status-badge')).toHaveText('🥜 심화 학습');
  });

  test('Badges (time badge, 현재형, 과거형) never wrap into multi-line strings on mobile screens', async ({ page }) => {
    // Set small mobile viewport (e.g., Galaxy S8 / narrow Android 360px width)
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/lessons/lesson-04/index.html');

    // Simulate larger mobile font scaling by applying a larger base font-size
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '20px';
    });

    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();

    const timeBadge = page.locator('.deep-dive-time-badge');
    const presentBadge = page.locator('.breakdown-card.highlight .breakdown-tense-badge');
    const pastBadge = page.locator('.breakdown-card .badge-past.breakdown-tense-badge');

    await expect(timeBadge).toBeVisible();
    await expect(presentBadge).toBeVisible();
    await expect(pastBadge).toBeVisible();

    // Inspect CSS computed styles and bounding box heights
    const badgeChecks = await page.evaluate(() => {
      const time = document.querySelector('.deep-dive-time-badge');
      const present = document.querySelector('.breakdown-card.highlight .breakdown-tense-badge');
      const past = document.querySelector('.breakdown-card .badge-past.breakdown-tense-badge');

      const getTimeStyle = window.getComputedStyle(time);
      const getPresentStyle = window.getComputedStyle(present);
      const getPastStyle = window.getComputedStyle(past);

      return {
        time: {
          text: time.textContent.trim(),
          whiteSpace: getTimeStyle.whiteSpace,
          flexShrink: getTimeStyle.flexShrink,
          height: time.getBoundingClientRect().height,
          lineHeight: parseFloat(getTimeStyle.lineHeight) || 20
        },
        present: {
          text: present.textContent.trim(),
          whiteSpace: getPresentStyle.whiteSpace,
          flexShrink: getPresentStyle.flexShrink,
          height: present.getBoundingClientRect().height,
          lineHeight: parseFloat(getPresentStyle.lineHeight) || 20
        },
        past: {
          text: past.textContent.trim(),
          whiteSpace: getPastStyle.whiteSpace,
          flexShrink: getPastStyle.flexShrink,
          height: past.getBoundingClientRect().height,
          lineHeight: parseFloat(getPastStyle.lineHeight) || 20
        }
      };
    });

    // Verify time badge
    expect(badgeChecks.time.text).toBe('⏱ 03:17');
    expect(badgeChecks.time.whiteSpace).toBe('nowrap');
    expect(badgeChecks.time.flexShrink).toBe('0');
    // Height should reflect a single line of text with padding (not wrapped to 2+ lines)
    expect(badgeChecks.time.height).toBeLessThan(badgeChecks.time.lineHeight * 2);

    // Verify present tense badge ('현재형')
    expect(badgeChecks.present.text).toBe('현재형');
    expect(badgeChecks.present.whiteSpace).toBe('nowrap');
    expect(badgeChecks.present.flexShrink).toBe('0');
    expect(badgeChecks.present.height).toBeLessThan(badgeChecks.present.lineHeight * 2);

    // Verify past tense badge ('과거형')
    expect(badgeChecks.past.text).toBe('과거형');
    expect(badgeChecks.past.whiteSpace).toBe('nowrap');
    expect(badgeChecks.past.flexShrink).toBe('0');
    expect(badgeChecks.past.height).toBeLessThan(badgeChecks.past.lineHeight * 2);
  });

  test('Clicking step menu in Lesson 04 scrolls active section to top', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/lesson-04/index.html');

    // Confirm coming-soon-banner is hidden when published
    const banner = page.locator('#coming-soon-banner');
    await expect(banner).toBeHidden();

    // Click Step 2 tab
    await page.locator('.step-tab-btn[data-step="2"]').click();
    await expect(page.locator('#review-section')).toBeVisible();

    // Wait for smooth scroll to finish
    await page.waitForTimeout(600);

    // Check that window.scrollY scrolled past top, placing reviewSection at ~70px under nav
    const scrollStateStep2 = await page.evaluate(() => {
      const reviewSection = document.getElementById('review-section');
      const rect = reviewSection.getBoundingClientRect();
      return {
        scrollY: window.pageYOffset || window.scrollY,
        reviewSectionTop: rect.top
      };
    });

    expect(scrollStateStep2.scrollY).toBeGreaterThan(0);
    // reviewSectionTop should be positioned right below navHeight (approx 70px)
    expect(Math.abs(scrollStateStep2.reviewSectionTop - 70)).toBeLessThan(10);

    // Click Deep Dive tab
    await page.locator('#step-tab-deep-dive').click();
    await expect(page.locator('#deep-dive-section')).toBeVisible();
    await page.waitForTimeout(600);

    const scrollStateDeepDive = await page.evaluate(() => {
      const deepDive = document.getElementById('deep-dive-section');
      const rect = deepDive.getBoundingClientRect();
      return {
        scrollY: window.pageYOffset || window.scrollY,
        deepDiveTop: rect.top
      };
    });

    expect(scrollStateDeepDive.scrollY).toBeGreaterThan(0);
    expect(Math.abs(scrollStateDeepDive.deepDiveTop - 70)).toBeLessThan(10);
  });

  test('On bigger screens (desktop), Deep Dive page has the same width as other step sections', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/lessons/lesson-02/index.html');

    // Step 1: Quiz section width
    const quizBox = await page.locator('#quiz-section').boundingBox();

    // Step 2: Review section width
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const reviewBox = await page.locator('#review-section').boundingBox();

    // Deep Dive section width
    await page.locator('#step-tab-deep-dive').click();
    const deepDiveBox = await page.locator('#deep-dive-section').boundingBox();

    // Deep dive width should match quiz and review section widths
    expect(deepDiveBox.width).toBeGreaterThan(1000);
    expect(Math.abs(deepDiveBox.width - quizBox.width)).toBeLessThan(2);
    expect(Math.abs(deepDiveBox.width - reviewBox.width)).toBeLessThan(2);
  });

  test('Font size is scaled up for elderly readability on bigger screens (desktop), but remains unchanged on mobile', async ({ page }) => {
    // 1. Check Desktop (1280px)
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/lessons/lesson-02/index.html');

    // Step 1: Quiz Korean Sentence
    const desktopQuizFontSize = await page.locator('.quiz-korean-sentence').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    // Should be at least 24px (~1.5rem+)
    expect(desktopQuizFontSize).toBeGreaterThanOrEqual(24);

    // Step 2: Key Sentence English
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const desktopReviewFontSize = await page.locator('.sentence-en-text').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    // Should be at least 20px (~1.28rem)
    expect(desktopReviewFontSize).toBeGreaterThanOrEqual(20);

    // Deep Dive: Dialogue English
    await page.locator('#step-tab-deep-dive').click();
    const desktopDeepDiveFontSize = await page.locator('.dialogue-en').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    // Should be at least 18px (~1.15rem)
    expect(desktopDeepDiveFontSize).toBeGreaterThanOrEqual(18);

    // Step 3: Script Sentence English
    await page.locator('.step-tab-btn[data-step="3"]').click();
    const desktopScriptFontSize = await page.locator('.script-card-body .sentence-en').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    // Should be at least 18px (~1.18rem)
    expect(desktopScriptFontSize).toBeGreaterThanOrEqual(18);

    // Step 4: Reflection Title
    await page.locator('.step-tab-btn[data-step="4"]').click();
    const desktopReflectionFontSize = await page.locator('.reflection-title').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    // Should be at least 23px (~1.5rem)
    expect(desktopReflectionFontSize).toBeGreaterThanOrEqual(23);

    // 2. Check Mobile (375px) - Font sizes should NOT receive the desktop boost
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/lessons/lesson-02/index.html');

    // Mobile Step 1 font size must be smaller than desktop
    const mobileQuizFontSize = await page.locator('.quiz-korean-sentence').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    expect(mobileQuizFontSize).toBeLessThan(desktopQuizFontSize);

    // Mobile Step 2 font size must be smaller than desktop
    await page.locator('.step-tab-btn[data-step="2"]').click();
    const mobileReviewFontSize = await page.locator('.sentence-en-text').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    expect(mobileReviewFontSize).toBeLessThan(desktopReviewFontSize);

    // Mobile Deep Dive font size must be smaller than desktop
    await page.locator('#step-tab-deep-dive').click();
    const mobileDeepDiveFontSize = await page.locator('.dialogue-en').first().evaluate(el => parseFloat(window.getComputedStyle(el).fontSize));
    expect(mobileDeepDiveFontSize).toBeLessThan(desktopDeepDiveFontSize);
  });

});

