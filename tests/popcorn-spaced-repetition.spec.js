const { test, expect } = require('@playwright/test');

test.describe('Popcorn Quick Lesson Enhancements & Bug Fixes (Issue #47)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/daily.html');
    await page.evaluate(() => {
      if (typeof Storage !== 'undefined') {
        Storage.resetPopcornPreferences();
        localStorage.removeItem('rhyrhy_saved_sentences');
      }
    });
  });

  test('1. Compact dictionary storage scaling benchmark: 1,000+ quick lessons consumes < 50KB and executes in < 10ms', async ({ page }) => {
    await page.goto('/daily.html');

    const benchmark = await page.evaluate(() => {
      // 1. Generate 1,000 realistic quick lesson entries across diverse spaced repetition states
      const mockRep = {};
      const mockMetadata = [];
      const now = Date.now();

      for (let i = 1; i <= 1000; i++) {
        const id = `popcorn-${String(i).padStart(4, '0')}`;
        mockMetadata.push({
          id,
          type: 'conversation',
          expression: `expression pattern ${i}`
        });

        const stateType = i % 4;
        if (stateType === 0) {
          // Unseen / fresh
          mockRep[id] = { s: 0, d: 0, p: 0 };
        } else if (stateType === 1) {
          // 1st "알아요" click: 2-month cooldown (60 days)
          mockRep[id] = { s: 1, d: now + (60 * 24 * 60 * 60 * 1000), p: 0 };
        } else if (stateType === 2) {
          // 2nd consecutive "알아요": permanent exclusion
          mockRep[id] = { s: 2, d: 0, p: 1 };
        } else {
          // Studied: 14-day interval
          mockRep[id] = { s: 0, d: now + (14 * 24 * 60 * 60 * 1000), p: 0 };
        }
      }

      // Save to localStorage
      Storage.savePopcornSpacedRep(mockRep);

      // Measure total serialized byte size
      const serialized = localStorage.getItem(Storage.KEYS.POPCORN_SPACED_REP) || '';
      const totalBytes = new Blob([serialized]).size;

      // Benchmark retrieval and availability check across all 1,000 lessons
      const t0 = performance.now();
      const available = Storage.getAvailablePopcornLessons(mockMetadata, 14);
      const t1 = performance.now();
      const queryDurationMs = t1 - t0;

      // Benchmark single item update
      const t2 = performance.now();
      Storage.recordPopcornKnow('popcorn-0500');
      const t3 = performance.now();
      const updateDurationMs = t3 - t2;

      // Verify data integrity for sample entries
      const unseen = Storage.getPopcornSpacedRep()['popcorn-0004'];
      const permanent = Storage.getPopcornSpacedRep()['popcorn-0002'];

      return {
        totalLessons: Object.keys(mockRep).length,
        totalBytes,
        queryDurationMs,
        updateDurationMs,
        availableCount: available.length,
        unseenStreak: unseen ? unseen.s : -1,
        permanentFlag: permanent ? permanent.p : -1
      };
    });

    expect(benchmark.totalLessons).toBe(1000);

    // CRITICAL USER REQUIREMENT: Total storage must strictly be < 50KB (51,200 bytes)
    console.log(`1,000 lessons storage footprint: ${benchmark.totalBytes} bytes (${(benchmark.totalBytes / 1024).toFixed(2)} KB)`);
    expect(benchmark.totalBytes).toBeLessThan(50 * 1024);

    // Performance assertion: Query and updates must execute in under 10 ms
    console.log(`1,000 lessons query duration: ${benchmark.queryDurationMs.toFixed(3)} ms`);
    expect(benchmark.queryDurationMs).toBeLessThan(10);
    expect(benchmark.updateDurationMs).toBeLessThan(10);

    // Data integrity
    expect(benchmark.unseenStreak).toBe(0);
    expect(benchmark.permanentFlag).toBe(1);
    expect(benchmark.availableCount).toBe(250); // only stateType 0 (unseen) is available
  });

  test('2. Spaced Repetition Logic: 1st "알아요" sets 2 months, 2nd consecutive click permanently stops display', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    const knownBtn = page.locator('#btn-popcorn-known');
    await expect(knownBtn).toBeVisible({ timeout: 5000 });
    await expect(knownBtn).toContainText('알아요');

    // 1st click on "알아요"
    await knownBtn.click();

    // Verify state after 1st click
    const state1 = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep()['popcorn-001'];
      return {
        isKnown: Storage.isPopcornKnown('popcorn-001'),
        inCooldown60d: Storage.isPopcornInCooldown('popcorn-001', 59),
        streak: rep ? rep.s : 0
      };
    });
    expect(state1.isKnown).toBe(false); // not permanent yet
    expect(state1.inCooldown60d).toBe(true); // 2 months (60 days) cooldown
    expect(state1.streak).toBe(1);

    // Toast message verifies 2-month reschedule
    const toast1 = page.locator('.save-toast-notification');
    await expect(toast1).toBeVisible();
    await expect(toast1).toContainText('2달 뒤에 다시 복습');

    // Simulate 61 days elapsed (time jump)
    await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - 1000;
      Storage.savePopcornSpacedRep(rep);
    });

    // 2nd play: open popcorn-001 and click "알아요" for the second consecutive time
    await page.goto('/daily.html?id=popcorn-001');
    const knownBtn2 = page.locator('#btn-popcorn-known');
    await expect(knownBtn2).toBeVisible({ timeout: 5000 });
    await knownBtn2.click();

    // Verify 2nd consecutive click permanently stops displaying
    const state2 = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep()['popcorn-001'];
      return {
        isKnown: Storage.isPopcornKnown('popcorn-001'),
        permanent: rep ? rep.p : 0,
        streak: rep ? rep.s : 0
      };
    });
    expect(state2.isKnown).toBe(true);
    expect(state2.permanent).toBe(1);
    expect(state2.streak).toBe(2);

    // Permanent exclusion toast appears
    const toast2 = page.locator('.save-toast-notification');
    await expect(toast2).toBeVisible();
    await expect(toast2).toContainText('마스터 목록에 보관했어요');
  });

  test('3. Spaced Repetition Logic: Clicking "몰라요" on second play resets progress (streak = 0)', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // 1st play: User clicks "알아요" -> streak becomes 1
    await page.click('#btn-popcorn-known');
    let streak = await page.evaluate(() => Storage.getPopcornSpacedRep()['popcorn-001'].s);
    expect(streak).toBe(1);

    // Simulate 2 months later: cooldown elapsed
    await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - 1000;
      Storage.savePopcornSpacedRep(rep);
    });

    // 2nd play: User does not know the expression and clicks "몰라요"
    await page.goto('/daily.html?id=popcorn-001');
    const learnBtn = page.locator('#btn-popcorn-learn');
    await expect(learnBtn).toBeVisible({ timeout: 5000 });
    await learnBtn.click();

    // Progress resets: streak goes back to 0!
    streak = await page.evaluate(() => Storage.getPopcornSpacedRep()['popcorn-001'].s);
    expect(streak).toBe(0);

    // Advances to Stage 2 study conversation
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();
  });

  test('4. Spaced Repetition Logic: "한국어 번역" or navigating to next lesson sets 14-day interval', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Proceed to Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Click "한국어 번역" button
    const revealBtn = page.locator('#btn-popcorn-reveal');
    await expect(revealBtn).toBeVisible();
    await revealBtn.click();

    // Verify interval is updated to 14 days (changed from 30 days)
    const in14DayCooldown = await page.evaluate(() => {
      return Storage.isPopcornInCooldown('popcorn-001', 14);
    });
    expect(in14DayCooldown).toBe(true);

    // Verify that after 15 days, it is no longer in cooldown
    const after15Days = await page.evaluate(() => {
      const rep = Storage.getPopcornSpacedRep();
      rep['popcorn-001'].d = Date.now() - (15 * 24 * 60 * 60 * 1000);
      Storage.savePopcornSpacedRep(rep);
      const studied = JSON.parse(localStorage.getItem('rhyrhy_popcorn_studied') || '{}');
      studied['popcorn-001'] = Date.now() - (15 * 24 * 60 * 60 * 1000);
      localStorage.setItem('rhyrhy_popcorn_studied', JSON.stringify(studied));
      return Storage.isPopcornInCooldown('popcorn-001', 14);
    });
    expect(after15Days).toBe(false);
  });

  test('5. Layout Alignment: Popcorn page layout is anchored from top instead of vertically centered', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/daily.html');

    const mainElement = page.locator('.daily-page-main');
    await expect(mainElement).toBeVisible();

    // Check computed styles
    const styles = await mainElement.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        justifyContent: cs.justifyContent,
        paddingTop: cs.paddingTop
      };
    });

    // Must be top-anchored (flex-start) and top padding 16px matching standard lesson
    expect(styles.justifyContent).toBe('flex-start');
    expect(styles.paddingTop).toBe('16px');

    // Ensure header top position is within standard margin (< 90px from top of viewport including nav)
    const header = page.locator('.daily-page-header');
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();
    expect(headerBox.y).toBeLessThanOrEqual(95);
  });

  test('6. Markdown Parsing Fix: Clicking "한국어 번역" cleanly renders parsed HTML without errors', async ({ page }) => {
    // Test on popcorn-002 which has rich nested markdown with bullets, bold, and code
    await page.goto('/daily.html?id=popcorn-002');

    // Click "몰라요" to enter Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Click "한국어 번역"
    const revealBtn = page.locator('#btn-popcorn-reveal');
    await revealBtn.click();

    // Verify explanation card is visible
    const expCard = page.locator('#popcorn-explanation-card');
    await expect(expCard).toBeVisible();

    // Check parsed HTML elements
    const boldElements = expCard.locator('.popcorn-exp-bold');
    await expect(boldElements.first()).toBeVisible();
    await expect(expCard.locator('.popcorn-exp-paragraph').first()).toBeVisible();
    await expect(expCard.locator('.popcorn-exp-list').first()).toBeVisible();
    await expect(expCard.locator('.popcorn-exp-sublist').first()).toBeVisible();

    // Ensure raw markdown asterisks or dashes are not rendered as plain text
    const expBodyText = await expCard.locator('.popcorn-explanation-body').innerText();
    expect(expBodyText).not.toContain('**"make a [noun] of it"**');
    expect(expBodyText).toContain('"make a [noun] of it"');
    expect(expBodyText).toContain('make a night of it');
  });

  test('7. Navbar Popcorn Animation: Uses high-definition popcorn box asset and realistic popcorn particle images', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Advance to Stage 2
    await page.click('#btn-popcorn-learn');
    await expect(page.locator('#popcorn-conversation-card')).toBeVisible();

    // Click "다음 팝콘 표현 뽑기" which triggers transition
    const nextBtn = page.locator('#btn-popcorn-next');
    await nextBtn.click();

    // Central flyer appears with high-definition asset
    const flyer = page.locator('.popcorn-nav-flyer');
    await expect(flyer).toBeVisible({ timeout: 2000 });

    const flyerImg = flyer.locator('.popcorn-flyer-hd-img');
    await expect(flyerImg).toBeVisible();
    await expect(flyerImg).toHaveAttribute('src', /assets\/img\/popcorn\/popcorn-box-hd\.png/);

    // Burst particles contain realistic popcorn image assets, not emojis
    const particleImg = page.locator('.popcorn-particle .popcorn-particle-img');
    await expect(particleImg.first()).toBeVisible();
    await expect(particleImg.first()).toHaveAttribute('src', /assets\/img\/popcorn\/popcorn-kernel-\d\.png/);
  });

  test('8. Analytics Tracking: Measures skip-to-learn ratio and generates Top 10 unfamiliarity report', async ({ page }) => {
    await page.goto('/daily.html?id=popcorn-001');

    // Simulate clicking "몰라요"
    await page.click('#btn-popcorn-learn');

    // Verify action recorded in stats
    const stats1 = await page.evaluate(() => Storage.getPopcornStats()['popcorn-001']);
    expect(stats1.learnCount).toBe(1);
    expect(stats1.skipCount).toBe(0);

    // Open another lesson and click "알아요"
    await page.goto('/daily.html?id=popcorn-002');
    await page.click('#btn-popcorn-known');

    const stats2 = await page.evaluate(() => Storage.getPopcornStats()['popcorn-002']);
    expect(stats2.skipCount).toBe(1);
    expect(stats2.learnCount).toBe(0);

    // Verify report generation via Storage and CLI generator
    const report = await page.evaluate(() => Storage.getTopUnfamiliarLessons(10));
    expect(report.length).toBeGreaterThanOrEqual(2);
    // popcorn-001 has 1 learn click, so it should be rank 1 for unfamiliarity
    expect(report[0].id).toBe('popcorn-001');
    expect(report[0].learnCount).toBe(1);
    expect(report[0].unfamiliarityRate).toBe(100);
  });
});
