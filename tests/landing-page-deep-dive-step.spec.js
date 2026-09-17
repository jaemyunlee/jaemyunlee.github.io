const { test, expect } = require('@playwright/test');

test.describe('Landing Page Deep Dive Step Description & "get to" Nuance (Issue #80)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('1. Deep Dive section (#flow-deepdive-extra) is rendered directly in learning flow below popcorn extra', async ({ page }) => {
    const learningFlow = page.locator('#learning-flow');
    await expect(learningFlow).toBeVisible();

    const popcornExtra = page.locator('#flow-popcorn-extra');
    await expect(popcornExtra).toBeVisible();

    const deepdiveExtra = page.locator('#flow-deepdive-extra');
    await expect(deepdiveExtra).toBeVisible();

    // Verify DOM order: deepdiveExtra directly follows popcornExtra
    const isDirectSiblingOrFollows = await page.evaluate(() => {
      const popcorn = document.getElementById('flow-popcorn-extra');
      const deepdive = document.getElementById('flow-deepdive-extra');
      return popcorn.compareDocumentPosition(deepdive) & Node.DOCUMENT_POSITION_FOLLOWING;
    });
    expect(isDirectSiblingOrFollows).toBeTruthy();
  });

  test('2. Deep Dive badges, title, and lead copy are properly displayed', async ({ page }) => {
    const deepdiveExtra = page.locator('#flow-deepdive-extra');

    // Badges
    await expect(deepdiveExtra.locator('.badge-deep-step')).toHaveText('OPTIONAL STEP');
    await expect(deepdiveExtra.locator('.badge-deep-pill')).toContainText('🥜 뉘앙스 딥다이브 (Deep Dive)');
    await expect(deepdiveExtra.locator('.badge-deep-highlight')).toContainText('💡 맥락 & 원어민 어감 정복');

    // Title & Lead
    const title = deepdiveExtra.locator('.flow-deepdive-extra-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('감정선과 어감');

    const lead = deepdiveExtra.locator('.flow-deepdive-extra-lead');
    await expect(lead).toBeVisible();
    await expect(lead).toContainText('원어민의 진짜 뉘앙스 차이');
  });

  test('3. Illustrative nuance example card explains "get to" vs "can" from Lesson 02', async ({ page }) => {
    const card = page.locator('#flow-deepdive-extra .deepdive-example-card');
    await expect(card).toBeVisible();

    // Header metadata
    await expect(card.locator('.deepdive-quote-badge')).toContainText('Lesson 02 대표 예시');
    await expect(card.locator('.deepdive-quote-scene')).toContainText("Scene 3 (Wayne's Cabin)");

    // English sentence and highlight
    const quoteEn = card.locator('.deepdive-quote-en');
    await expect(quoteEn).toBeVisible();
    await expect(quoteEn).toContainText('And now Jaemyun and Kelly get to enjoy it and the kids too.');
    await expect(quoteEn.locator('mark')).toHaveText('get to');

    // Korean translation
    const quoteKo = card.locator('.deepdive-quote-ko');
    await expect(quoteKo).toContainText('이제는 재면이와 켈리, 그리고 아이들도 함께 이곳을 누릴 수 있게 되었죠.');

    // Nuance comparison grid: "get to" vs "can"
    const compareGrid = card.locator('.deepdive-compare-grid');
    await expect(compareGrid).toBeVisible();

    const getToItem = compareGrid.locator('.item-highlight');
    await expect(getToItem.locator('.deepdive-compare-tag')).toContainText('get to + 동사원형');
    await expect(getToItem.locator('.deepdive-compare-desc')).toContainText('소중한 기회 / 축복 (Privilege)');
    await expect(getToItem.locator('.deepdive-compare-desc')).toContainText('특별한 행운이자 감사한 기회');

    const canItem = compareGrid.locator('.item-contrast');
    await expect(canItem.locator('.deepdive-compare-tag')).toContainText('can / could + 동사원형');
    await expect(canItem.locator('.deepdive-compare-desc')).toContainText('단순 능력 / 허가 (Ability)');
    await expect(canItem.locator('.deepdive-compare-desc')).toContainText('신체적·물리적으로 가능한 상태');
  });

  test('4. Features grid lists the 2 core benefits of Deep Dive', async ({ page }) => {
    const features = page.locator('#flow-deepdive-extra .deepdive-feature-item');
    await expect(features).toHaveCount(2);

    const featureTitles = await features.locator('strong').allTextContents();
    expect(featureTitles).toEqual([
      '정밀한 뉘앙스 비교',
      '영상 속 실제 발화 맥락'
    ]);
  });

  test('5. CTA button navigates to Lesson 02 Deep Dive page', async ({ page }) => {
    const ctaBtn = page.locator('#btn-flow-deepdive-start');
    await expect(ctaBtn).toBeVisible();
    await expect(ctaBtn).toHaveAttribute('href', './lessons/lesson-02/deep-dive.html');
    await expect(ctaBtn).toContainText('심화 학습 체험하기');
  });

  test('6. Dual-theme support: styles render cleanly in dark and light modes', async ({ page }) => {
    const deepdive = page.locator('#flow-deepdive-extra');

    // Dark mode (default)
    const darkDisplay = await deepdive.evaluate((el) => window.getComputedStyle(el).display);
    expect(darkDisplay).toBe('flex');

    // Switch to Light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });

    await expect(deepdive).toBeVisible();

    const lightCardBg = await page.locator('#flow-deepdive-extra .deepdive-example-card').evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    // Light mode card background should be white/near white (e.g., rgba(255, 255, 255, 0.95))
    expect(lightCardBg).toContain('255, 255, 255');
  });

  test('7. Mobile responsiveness: stacks vertically on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const deepdive = page.locator('#flow-deepdive-extra');
    await expect(deepdive).toBeVisible();

    const flexDir = await deepdive.evaluate((el) => window.getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('column');

    const ctaBtn = page.locator('#btn-flow-deepdive-start');
    await expect(ctaBtn).toBeVisible();
  });
});
