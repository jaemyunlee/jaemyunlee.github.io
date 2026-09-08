const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/jaemyun/.gemini/antigravity-ide/brain/c1ecb1ce-624f-4492-9271-d6e858f7b792';

async function safeScreenshot(page, filename) {
  if (!process.env.CI && fs.existsSync(ARTIFACT_DIR)) {
    try {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
    } catch (_) {}
  }
}

test.describe('Landing Page Redesign & 5-Step Learning Flow (Issue #39)', () => {
  test('1. Resume banner is removed: #resume-banner-container does not exist in DOM', async ({ page }) => {
    // Seed progress so the old resume banner would have been triggered
    await page.addInitScript(() => {
      localStorage.setItem('rhyrhy_progress_lesson-01', JSON.stringify({
        completed: false,
        currentQuestionIndex: 1,
        score: 1,
        timestamp: Date.now()
      }));
      localStorage.setItem('rhyrhy_last_active_lesson', 'lesson-01');
    });

    await page.goto('/index.html');

    // #resume-banner-container must NOT exist in the DOM
    const resumeBanner = page.locator('#resume-banner-container');
    await expect(resumeBanner).toHaveCount(0);

    const resumeCard = page.locator('.resume-card');
    await expect(resumeCard).toHaveCount(0);
  });

  test('2. 5-Step Learning Flow section is present and renders all 5 steps with icons, numbers, and tags', async ({ page }) => {
    await page.goto('/index.html');

    const flowSection = page.locator('#learning-flow');
    await expect(flowSection).toBeVisible();

    const title = flowSection.locator('.flow-title');
    await expect(title).toHaveText('현서네 5단계 리얼 영어 학습법');

    // Verify 5 step cards
    const cards = flowSection.locator('.flow-step-card');
    await expect(cards).toHaveCount(5);

    const expectedSteps = [
      {
        num: 'STEP 01',
        tag: '선행 퀴즈',
        title: '3분 퀴즈로 핵심 어휘 선행 학습',
        descSubstring: '3분 퀴즈'
      },
      {
        num: 'STEP 02',
        tag: '음성 프리뷰',
        title: '원어민 음성으로 핵심 문장 듣기',
        descSubstring: '원어민의 정확한 실제 발음'
      },
      {
        num: 'STEP 03',
        tag: '전체 영상',
        title: '전체 영상 & 동기화 자막 시청',
        descSubstring: '동기화된 한영 자막 스크립트'
      },
      {
        num: 'STEP 04',
        tag: '실전 영작',
        title: '배운 표현으로 나만의 문장 영작',
        descSubstring: '직접 영작'
      },
      {
        num: 'STEP 05',
        tag: '장기 기억',
        title: '일상 속 백그라운드 흘려듣기',
        descSubstring: '백그라운드로 연속 재생'
      }
    ];

    for (let i = 0; i < expectedSteps.length; i++) {
      const card = cards.nth(i);
      const expected = expectedSteps[i];

      await expect(card.locator('.flow-step-num')).toHaveText(expected.num);
      await expect(card.locator('.flow-step-tag')).toHaveText(expected.tag);
      await expect(card.locator('.flow-step-title')).toHaveText(expected.title);
      await expect(card.locator('.flow-step-desc')).toContainText(expected.descSubstring);

      // Verify SVG icon exists inside
      const iconWrap = card.locator('.flow-step-icon-wrap');
      await expect(iconWrap).toBeVisible();
      await expect(iconWrap.locator('svg')).toBeVisible();
    }
  });

  test('3. Hero subtitle is updated and flow link smoothly references #learning-flow', async ({ page }) => {
    await page.goto('/index.html');

    const heroSubtitle = page.locator('.hero-subtitle');
    await expect(heroSubtitle).toContainText('5단계 과학적 학습 루틴');

    const flowLink = page.locator('.btn-hero-flow-link');
    await expect(flowLink).toBeVisible();
    await expect(flowLink).toHaveAttribute('href', '#learning-flow');

    // Click flow link and verify learning-flow is in view
    await flowLink.click();
    await page.waitForTimeout(400);

    const flowSection = page.locator('#learning-flow');
    await expect(flowSection).toBeInViewport();
  });

  test('4. Dark and Light modes maintain accessible contrast and responsive layout', async ({ page }) => {
    await page.goto('/index.html');

    const flowSection = page.locator('#learning-flow');
    await expect(flowSection).toBeVisible();

    // 1. Dark Mode Check
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const darkCard = page.locator('.flow-step-card').first();
    await expect(darkCard).toBeVisible();
    await flowSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    if (!process.env.CI && fs.existsSync(ARTIFACT_DIR)) {
      await flowSection.screenshot({ path: path.join(ARTIFACT_DIR, 'flow_cards_dark.png') });
    }

    // 2. Switch to Light Mode
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const lightCardTitle = page.locator('.flow-step-title').first();
    const lightTitleColor = await lightCardTitle.evaluate(el => getComputedStyle(el).color);
    // In light mode, title should be dark slate (#0F172A = rgb(15, 23, 42))
    expect(lightTitleColor).toBe('rgb(15, 23, 42)');

    await page.waitForTimeout(300);
    if (!process.env.CI && fs.existsSync(ARTIFACT_DIR)) {
      await flowSection.screenshot({ path: path.join(ARTIFACT_DIR, 'flow_cards_light.png') });
    }

    // 3. Mobile Viewport Check (375 x 667)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(flowSection).toBeVisible();
    const cards = page.locator('.flow-step-card');
    await expect(cards).toHaveCount(5);
    await flowSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    if (!process.env.CI && fs.existsSync(ARTIFACT_DIR)) {
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'flow_cards_mobile.png') });
    }
  });
});
