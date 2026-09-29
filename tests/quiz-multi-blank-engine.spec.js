const { test, expect } = require('@playwright/test');

test.describe('Multi-Blank Quiz Engine & Parser Integration', () => {
  test('MarkdownQuizParser correctly parses multi-blank questions', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    const parsed = await page.evaluate(() => {
      const md = `## Quiz 1
- **Type**: fill-in-the-blank
- **English**: She was [pushing] the hot peppers [aside].
- **Answer**: pushing, aside
- **Korean**: 그녀는 매운 고추들을 옆으로 밀어내고 있었어요.
- **Explanation**: multi-blank test.`;
      const q = window.MarkdownQuizParser.parse(md)[0];
      return {
        type: q.type,
        blanks: q.blanks,
        sentenceTemplate: q.sentenceTemplate
      };
    });
    expect(parsed.type).toBe('fill-in-the-blank');
    expect(parsed.blanks).toEqual(['pushing', 'aside']);
  });

  test('QuizEngine renders multiple blank inputs and validates correct submission', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await page.waitForFunction(() => !!window.quizEngine);

    await page.evaluate(() => {
      let testContainer = document.getElementById('test-quiz-container-1');
      if (!testContainer) {
        testContainer = document.createElement('div');
        testContainer.id = 'test-quiz-container-1';
        document.body.appendChild(testContainer);
      }
      const dummyQuizzes = [{
        num: 1,
        type: 'fill-in-the-blank',
        english: 'She was [pushing] the hot peppers [aside].',
        answer: 'pushing, aside',
        blanks: ['pushing', 'aside'],
        sentenceTemplate: 'She was _____ the hot peppers _____.'
      }];
      window.testQuizEngine = new QuizEngine({
        container: '#test-quiz-container-1',
        lessonId: 'test-multi-blank-1',
        quizzes: dummyQuizzes
      });
      window.testQuizEngine.init();
    });

    const testScope = page.locator('#test-quiz-container-1');
    const blankInputs = testScope.locator('.quiz-multi-input');
    await expect(blankInputs).toHaveCount(2);

    await blankInputs.nth(0).fill('pushing');
    await blankInputs.nth(1).fill('aside');

    const checkBtn = testScope.locator('#btn-check');
    await checkBtn.click();

    const feedback = testScope.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });

  test('QuizEngine enterkeyhint and sequential navigation for 5 blank inputs', async ({ page }) => {
    await page.goto('/lessons/lesson-01/index.html');
    await page.waitForFunction(() => !!window.quizEngine);

    await page.evaluate(() => {
      let testContainer = document.getElementById('test-quiz-container-2');
      if (!testContainer) {
        testContainer = document.createElement('div');
        testContainer.id = 'test-quiz-container-2';
        document.body.appendChild(testContainer);
      }
      const dummyQuizzes = [{
        num: 1,
        type: 'fill-in-the-blank',
        english: 'All the way [all] [the] [way] [from] Martinez [to] Lafayette.',
        answer: 'all, the, way, from, to',
        blanks: ['all', 'the', 'way', 'from', 'to'],
        sentenceTemplate: 'All the way _____ _____ _____ _____ Martinez _____ Lafayette.'
      }];
      window.testQuizEngine = new QuizEngine({
        container: '#test-quiz-container-2',
        lessonId: 'test-multi-blank-2',
        quizzes: dummyQuizzes
      });
      window.testQuizEngine.init();
    });

    const testScope = page.locator('#test-quiz-container-2');
    const blankInputs = testScope.locator('.quiz-multi-input');
    await expect(blankInputs).toHaveCount(5);

    for (let i = 0; i < 4; i++) {
      await expect(blankInputs.nth(i)).toHaveAttribute('enterkeyhint', 'next');
    }
    await expect(blankInputs.nth(4)).toHaveAttribute('enterkeyhint', 'done');

    await blankInputs.nth(0).fill('all');
    await blankInputs.nth(0).press('Enter');
    await expect(blankInputs.nth(1)).toBeFocused();

    await blankInputs.nth(1).fill('the');
    await blankInputs.nth(1).press('Enter');
    await expect(blankInputs.nth(2)).toBeFocused();

    await blankInputs.nth(2).fill('way');
    await blankInputs.nth(2).press('Enter');
    await expect(blankInputs.nth(3)).toBeFocused();

    await blankInputs.nth(3).fill('from');
    await blankInputs.nth(3).press('Enter');
    await expect(blankInputs.nth(4)).toBeFocused();

    await blankInputs.nth(4).fill('to');
    await blankInputs.nth(4).press('Enter');

    const feedback = testScope.locator('#quiz-feedback');
    await expect(feedback).toBeVisible();
    await expect(feedback).toHaveClass(/success/);
    await expect(feedback).toContainText('정답입니다');
  });
});
