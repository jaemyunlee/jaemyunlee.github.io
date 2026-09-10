#!/usr/bin/env node

/**
 * Popcorn Quick Lesson Analytics Report Generator (Issue #47)
 * 
 * Analyzes skip-to-learn ratios and identifies the Top 10 quick lessons
 * where users click the "Learn" ("몰라요") button due to unfamiliarity.
 */

const fs = require('fs');
const path = require('path');

const METADATA_PATH = path.resolve(__dirname, '..', 'popcorn', 'metadata.json');

/**
 * Generate unfamiliarity report data from metadata and statistics map
 * @param {Array<object>} metadataList 
 * @param {object} statsMap { [lessonId]: { skipCount: number, learnCount: number, expression?: string } }
 * @param {number} [limit=10]
 * @returns {Array<object>}
 */
function generateUnfamiliarityReport(metadataList, statsMap = {}, limit = 10) {
  const items = (metadataList || []).map(meta => {
    const stat = statsMap[meta.id] || {};
    const skipCount = typeof stat.skipCount === 'number' ? stat.skipCount : 0;
    const learnCount = typeof stat.learnCount === 'number' ? stat.learnCount : 0;
    const total = skipCount + learnCount;

    // Skip-to-learn ratio: skip / learn
    const skipToLearnRatio = learnCount > 0 
      ? Number((skipCount / learnCount).toFixed(2)) 
      : (skipCount > 0 ? Infinity : 0);

    // Unfamiliarity percentage: learn / total
    const unfamiliarityRate = total > 0 
      ? Number(((learnCount / total) * 100).toFixed(1)) 
      : 0;

    return {
      id: meta.id,
      expression: meta.expression || stat.expression || meta.id,
      type: meta.type || 'conversation',
      skipCount,
      learnCount,
      total,
      skipToLearnRatio,
      unfamiliarityRate
    };
  });

  // Sort descending by learnCount (unfamiliar clicks), then by unfamiliarityRate
  items.sort((a, b) => {
    if (b.learnCount !== a.learnCount) {
      return b.learnCount - a.learnCount;
    }
    return b.unfamiliarityRate - a.unfamiliarityRate;
  });

  return items.slice(0, limit).map((item, index) => ({
    rank: index + 1,
    ...item
  }));
}

/**
 * Format the unfamiliarity report into an ASCII table string
 * @param {Array<object>} reportData 
 * @returns {string}
 */
function formatReportTable(reportData) {
  const header = `==========================================================================================================
🍿 POPCORN QUICK LESSON UNFAMILIARITY REPORT (TOP 10 "LEARN" CLICKS)
==========================================================================================================
Rank | Lesson ID   | Expression                       | Learn (몰라요) | Skip (알아요) | Skip:Learn | Unfamiliar %
----------------------------------------------------------------------------------------------------------`;

  const rows = reportData.map(r => {
    const rankStr = String(r.rank).padEnd(4);
    const idStr = String(r.id).padEnd(11);
    const expStr = (r.expression.length > 32 ? r.expression.slice(0, 29) + '...' : r.expression).padEnd(32);
    const learnStr = String(r.learnCount).padStart(14);
    const skipStr = String(r.skipCount).padStart(13);
    const ratioStr = (r.skipToLearnRatio === Infinity ? 'Inf' : String(r.skipToLearnRatio)).padStart(10);
    const rateStr = `${r.unfamiliarityRate.toFixed(1)}%`.padStart(12);

    return `${rankStr} | ${idStr} | ${expStr} | ${learnStr} | ${skipStr} | ${ratioStr} | ${rateStr}`;
  });

  const footer = `----------------------------------------------------------------------------------------------------------
Total lessons evaluated: ${reportData.length}
==========================================================================================================`;

  return [header, ...rows, footer].join('\n');
}

// CLI Execution
if (require.main === module) {
  let metadata = [];
  try {
    if (fs.existsSync(METADATA_PATH)) {
      metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
    }
  } catch (err) {
    console.warn('Could not read metadata.json:', err.message);
  }

  // Load stats from optional CLI argument path, or fallback to sample demonstration stats
  let stats = {};
  const statsArg = process.argv[2];
  if (statsArg && fs.existsSync(statsArg)) {
    try {
      stats = JSON.parse(fs.readFileSync(statsArg, 'utf-8'));
    } catch (e) {
      console.warn('Could not parse stats file, using defaults');
    }
  } else {
    // Demonstration data for available lessons
    stats = {
      'popcorn-001': { skipCount: 18, learnCount: 42, expression: 'just so you know' },
      'popcorn-002': { skipCount: 5, learnCount: 68, expression: 'make a [noun] of it' }
    };
  }

  const report = generateUnfamiliarityReport(metadata, stats, 10);
  console.log(formatReportTable(report));
}

module.exports = {
  generateUnfamiliarityReport,
  formatReportTable
};
