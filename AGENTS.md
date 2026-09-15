# AGENTS.md - Developer & AI Agent Guidelines for RhyRhy English

This repository powers **RhyRhy English** (현서네 리얼 영어), a modern, mobile-first progressive web application (PWA) for interactive English learning.

All AI coding agents and contributors working in this codebase **MUST** strictly adhere to the following architectural, caching, design, and deployment guidelines.

---

## 1. Browser Caching & Asset Hashing Rules (Issue #3)

To guarantee that new deployments are delivered immediately to all users while maximizing browser caching performance:

### A. Content-Hashed Static Assets (CSS & JavaScript)
- **Production Build Suffixes**: All CSS (`css/*.css`) and JavaScript (`js/*.js`) files must be compiled into `dist/` with a unique, content-derived SHA-256 hash suffix (e.g., `main.a4b8c9d0.css`, `app.e1f2a3b4.js`).
- **Immutable Cache Headers**: Hashed assets are served with long-term immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`).
- **Source Paths Preserved**: In source files (`index.html`, `lessons.html`, `lessons/**/index.html`), keep standard unhashed paths (`./css/main.css`, `./js/app.js`). This enables instant live-server local development without forcing a build step on every edit.
- **Build Script Requirement**: Always run `npm run build` (or `node scripts/build.js`) before deployment to generate hashed assets in `dist/`.

### B. HTML Files: Zero-Stale Policy (`no-cache`)
- **No-Cache Meta Tags**: All HTML documents (`index.html`, `lessons.html`, `lessons/**/index.html`) must include the following meta tags inside `<head>`:
  ```html
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  ```
- **Service Worker Navigation Requests**: In `sw.js`, navigation requests (`event.request.mode === 'navigate'`) must always revalidate with the network using `fetch(new Request(event.request, { cache: 'no-cache' }))` so returning online users never get stuck on an outdated HTML version.

### C. Service Worker Cache Synchronization
- When adding or modifying static assets (new audio files, lesson JSON, quiz markdown, images):
  1. Add the new paths to `STATIC_ASSETS` in `sw.js`.
  2. The build script (`scripts/build.js`) automatically replaces CSS and JS paths in `dist/sw.js` with their hashed versions and sets `CACHE_NAME = 'rhyrhy-cache-' + buildHash`.
  3. If editing `sw.js` directly in source, increment `CACHE_NAME` (e.g., `rhyrhy-cache-v17`) to invalidate previous browser caches.

---

## 2. Design System & Theming Guidelines

- **Vanilla CSS Tokens**: All styling is built on Vanilla CSS variables in [`css/main.css`](css/main.css). Avoid Tailwind CSS or heavy CSS frameworks.
- **Dual Theme Support (Issue #2)**:
  - Both **Dark Mode** (`[data-theme="dark"]`, default) and **Light Mode** (`[data-theme="light"]`) must be supported across all pages, modals, quiz choices, and review players.
  - Test every UI modification in both themes.
  - Ensure all text passes WCAG AA contrast against its respective background.
  - Light mode uses `--bg-color: #F8FAFC`, `--surface-color: #FFFFFF`, and high-contrast text `#0F172A` / `#334155`.
- **Anti-FOUC Script**: Every HTML `<head>` must include the synchronous theme-restoring script before any stylesheets to prevent flash of unstyled theme on page load.
- **Hero Family Images**:
  - Dark mode displays [`assets/img/family-playful.jpg`](assets/img/family-playful.jpg) (studio portrait with neon educational doodles).
  - Light mode displays [`assets/img/family-light.jpg`](assets/img/family-light.jpg) (isolated studio portrait on `#F8FAFC` background with vibrant daytime doodles).

---

## 3. Lesson & Data Structure Protocol

- Each lesson resides in `lessons/lesson-XX/`:
  - `index.html`: Step-by-step interactive lesson player.
  - `metadata.json`: Title, YouTube URL, video ID, duration, description.
  - `quiz.md`: Multi-step interactive quiz parsed by `js/markdown-quiz-parser.js`.
  - `script.json`: Synchronized bilingual script and sentences.
  - `audio/`: Native speaker pronunciation WAV/MP3 files.
- When creating a new lesson:
  1. Register the lesson in `lessons.html` and `index.html` (Latest Lessons section).
  2. Register its files in `sw.js` `STATIC_ASSETS`.
  3. Ensure `scripts/build.js` processes its `index.html` references.

### Character Persona & Korean Translation Protocol (Wayne & Kelly)
- **Age & Relationship**: Wayne is older than Kelly (Wayne is Kelly's uncle / senior family figure; Kelly addresses him as "Uncle Wayne" or "Uncle").
- **Honorific Speech Rule (존댓말 vs 반말)**:
  - **Kelly -> Wayne**: Whenever translating dialogue to Korean, **Kelly MUST ALWAYS use 존댓말** (polite/honorific speech: `~해요`, `~했네요`, `~인가요?`, `삼촌` 등).
  - **Wayne -> Kelly**: **Wayne speaks in 반말** (warm/friendly informal speech: `~해`, `~했어`, `~구나`, `~자`).
  - This rule strictly applies to all Popcorn Quick Lessons (`popcorn/conversation/*.md`), regular lesson scripts (`script.json`), and translations across the app.

### Lesson Status Lifecycle & Static Enumerations (`js/lesson-status.js`)

All AI coding agents and contributors **MUST** refer to and use the centralized static enums defined in [`js/lesson-status.js`](js/lesson-status.js) rather than hardcoded string literals:

1. **`LessonPublicationStatus`** (Catalog & Metadata publication lifecycle):
   - **`PUBLISHED: 'published'`**: Live lesson accessible to all learners. All 4 steps (Quiz, Key Sentences, Full Video, Writing) are unlocked. If `status` is omitted in `metadata.json`, it defaults to published.
   - **`COMING_SOON: 'coming-soon'`**: Pre-release teaser prior to full video publication. Steps 1 & 2 (Quiz, Key Sentences) are active; Steps 3 & 4 (Video, Writing) are locked. Displays a scheduled release date badge (e.g. `9월 18일 본영상 공개 예정`).
   - **`HIDDEN: 'hidden'`**: Internal draft/testing lesson. Excluded from catalog and homepage by default; does not trigger the red navbar "NEW" badge. Accessible via direct URL or developer bypass flag (`?show_hidden=true` or `App.enableDevTesting()`), displaying a `[비공개 (테스트)]` badge.

2. **`LessonProgressState`** (Learner progress tracked in `localStorage` via `Storage.getLessonState()`):
   - **`NOT_STARTED: 'not-started'`**: The learner has not interacted with the lesson yet.
   - **`IN_PROGRESS: 'in-progress'`**: The learner has answered quiz questions or accessed Steps 1–3, but has not completed Step 4.
   - **`COMPLETED: 'completed'`**: The learner has completed all 4 steps (triggered on Step 4).

3. **`LessonStep`** (The 4 sequential interactive steps):
   - `QUIZ: 1` (Step 1: Interactive Cloze Quiz)
   - `KEY_SENTENCES: 2` (Step 2: Key Sentences & Native Pronunciation Audio)
   - `FULL_VIDEO: 3` (Step 3: Full YouTube Video & Synchronized Script)
   - `WRITING: 4` (Step 4: Writing Practice & YouTube Encouragement)

**Code Usage**: Always import and use `LessonPublicationStatus`, `LessonProgressState`, or `LessonStatusHelper` in code. E.g.:
```javascript
if (LessonStatusHelper.isComingSoon(metadata.status)) { ... }
```

---

## 4. LocalStorage Architecture & Strict Backward Compatibility Protocol

> [!CAUTION]
> **ZERO BREAKING CHANGES TO LOCALSTORAGE**: RhyRhy English operates **WITHOUT a backend server or database**. All user study progress, completed quizzes, interactive step progress, saved sentence bank items, study streaks, and history reside **EXCLUSIVELY in the learner's browser `localStorage`**. Any breaking change, key deletion/renaming, schema mutation without migration, or data loss directly wipes out real users' accumulated learning achievements.

To ensure user data safety and permanent continuity:

### A. Centralized Access via `js/storage.js`
- **Never call `localStorage` directly in UI components or pages**: All persistence reads, writes, deletions, and inspections **MUST** route through [`js/storage.js`](js/storage.js) (`Storage.*`).
- **Standardized Key Registry**: Every key must be declared in [`Storage.KEYS`](js/storage.js). Never introduce hardcoded string keys scattered across application code.

### B. Strict Backward Compatibility & Non-Destructive Migrations
- **Permanent Key Stability**: Never rename or delete established keys (e.g., `rhyrhy_progress_*`, `rhyrhy_completed_*`, `rhyrhy_step_*`, `rhyrhy_saved_sentences`, `rhyrhy_history`, `rhyrhy_popcorn_*`, `rhyrhy_theme`, `rhyrhy_seen_lessons`).
- **Graceful Schema Evolution**:
  - When extending stored objects with new properties, always support legacy records. Never assume newly added properties exist on previously stored items.
  - Provide fallback defaults when reading: e.g., `const item = JSON.parse(...) || {}; const value = item.newField ?? legacyDefault;`.
  - Perform lazy, non-destructive migrations: if updating schema versions, upgrade transparently on read without wiping previous state.
- **Never Clear Storage in Application Code**: Calling `localStorage.clear()` is **strictly prohibited** in runtime production application code (it is only permitted in isolated automated test environments).
- **Hardened Error Handling**: Every `localStorage` read and write must be safely wrapped in defensive `try ... catch` blocks to gracefully handle Safari Private Browsing mode, storage quota exceeded errors (`QuotaExceededError`), and malformed JSON without crashing the application.

---

## 5. Build & Deployment Verification

- **Zero External Dependencies**: The build script [`scripts/build.js`](scripts/build.js) uses native Node.js (`fs`, `path`, `crypto`) with zero npm packages. Keep it zero-dependency.
- **Verification Commands**:
  - Build production bundle: `npm run build` (or `node scripts/build.js`)
  - Preview production build: `npm run preview`
  - Local source dev server: `npm run serve`
- **CI/CD**: GitHub Pages deploys `dist/` via `.github/workflows/deploy.yml`. Never bypass the build step in GitHub Actions.

---

## 6. Quiz Sharing & Open Graph (OG) Image Protocol (Issue #6)

To maximize viral curiosity and organic engagement across social sharing platforms (KakaoTalk, Twitter/X, Instagram, SMS):

### A. Dedicated Quiz Pages
- Every individual quiz question has its own standalone shareable page at `/quiz/lesson-XX/qYY.html` (and `/quiz/lesson-XX/qYY/index.html`).
- Statically pre-rendered during build (`node scripts/build.js`) with custom `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, and `<meta property="og:url">` tags so crawlers render rich previews without client JavaScript.
- Embedded JSON `<script id="quiz-data" type="application/json">` eliminates runtime fetch latency.
- **Post-Answer Referral Modal**: Upon submitting an answer, visitors see feedback, the complete sentence, and **exactly one main action button**:
  `[ 🚀 전체 레슨 바로 학습하기 ]` (navigating to `/lessons/lesson-XX/index.html`).

### B. Pre-Generated 1200x630 OG Teaser Images
- Every quiz question has a pre-rendered 1200x630 card in `assets/img/og/lesson-XX-qYY.png`.
- Features curiosity-provoking headlines (e.g., `"하늘석(맨 꼭대기 좌석)"을 영어로 뭐라고 할까요?`), a cloze sentence teaser (`We got tickets in the [ ? ] section`), and RhyRhy English branding.
- **When creating a new lesson or question**:
  1. Add headline mappings in `scripts/generate-og-images.py` and `scripts/build.js` (`CURATED_HEADLINES`).
  2. Run `python3 scripts/generate-og-images.py` to generate the image assets.
  3. Run `npm run build` to pre-render static HTML pages in `dist/quiz/`.

---

## 7. GitHub Issue Workflow: One-by-One, Feature Branches & Pull Requests

> [!IMPORTANT]
> **MANDATORY WORKFLOW**: All GitHub issues must be handled strictly **one by one**. Always create a **new branch** for each issue, verify changes thoroughly, push, and submit a **Pull Request (PR)**.
> **DO NOT automatically merge the Pull Request**. The user will manually inspect and review the PR first, then merge it if everything looks good. Direct commits/pushes to `main` or merging locally without user review are strictly prohibited.

To ensure clean revision history, traceability, and robust continuous integration:

### A. Strict One-by-One Issue Resolution
- **One Issue per Cycle**: Never bundle multiple issues into a single branch or PR. Address issues strictly one at a time.
- **Sequential Progression**: Only begin the next issue after the user has reviewed, approved, and merged the current issue's PR into `main`, and the issue is confirmed closed.

### B. Dedicated Feature / Bugfix Branches
- **Fresh Branch from `main`**: Before starting any issue, pull latest `main` (`git checkout main && git pull origin main`) and create a new branch.
- **Branch Naming**: Match the issue type and number:
  - Bug fixes: `fix/issue-XX-short-description` (e.g., `fix/issue-12-shared-quiz-navbar`)
  - Enhancements: `feat/issue-XX-short-description` (e.g., `feat/issue-13-saved-audio-player`)
- **Never Commit Directly to `main`**: All modifications for an issue must reside on its dedicated branch.

### C. Pull Request & Manual Review Workflow
1. **Verification Before PR**:
   - Run unit/E2E tests (`npm test` or `npx playwright test`).
   - Run production build (`npm run build`).
2. **Push & Create PR**:
   - Push branch to remote: `git push origin <branch-name>`.
   - Create PR using GitHub CLI: `gh pr create --title "<type>: <title> (#XX)" --body "Closes #XX\n\n### Summary\n..."`.
3. **DO NOT Merge Automatically — Await User Manual Review**:
   - Provide the PR URL and a clear summary of changes to the user.
   - **DO NOT** run `gh pr merge` or merge locally.
   - Wait for the user to manually review, test, and merge the PR.
4. **Post-Merge Sync**:
   - Once the PR is merged by the user, switch back to `main`: `git checkout main && git pull origin main`.
   - Confirm the associated GitHub issue is closed before moving to the next issue.
