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

---

## 4. Build & Deployment Verification

- **Zero External Dependencies**: The build script [`scripts/build.js`](scripts/build.js) uses native Node.js (`fs`, `path`, `crypto`) with zero npm packages. Keep it zero-dependency.
- **Verification Commands**:
  - Build production bundle: `npm run build` (or `node scripts/build.js`)
  - Preview production build: `npm run preview`
  - Local source dev server: `npm run serve`
- **CI/CD**: GitHub Pages deploys `dist/` via `.github/workflows/deploy.yml`. Never bypass the build step in GitHub Actions.

---

## 5. Quiz Sharing & Open Graph (OG) Image Protocol (Issue #6)

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

## 6. GitHub Issue Workflow: One-by-One, Feature Branches & Pull Requests

> [!IMPORTANT]
> **MANDATORY WORKFLOW**: All GitHub issues must be handled strictly **one by one**. Always create a **new branch** for each issue, submit a **Pull Request (PR)**, and merge into `main` via the PR (`gh pr merge`). Direct commits/pushes to `main` or merging locally without a PR are strictly prohibited.

To ensure clean revision history, traceability, and robust continuous integration:

### A. Strict One-by-One Issue Resolution
- **One Issue per Cycle**: Never bundle multiple issues into a single branch or PR. Address issues strictly one at a time.
- **Sequential Progression**: Only begin the next issue after the current issue's PR has been merged into `main`, deleted, and the issue is confirmed closed.

### B. Dedicated Feature / Bugfix Branches
- **Fresh Branch from `main`**: Before starting any issue, pull latest `main` (`git checkout main && git pull origin main`) and create a new branch.
- **Branch Naming**: Match the issue type and number:
  - Bug fixes: `fix/issue-XX-short-description` (e.g., `fix/issue-12-shared-quiz-navbar`)
  - Enhancements: `feat/issue-XX-short-description` (e.g., `feat/issue-13-saved-audio-player`)
- **Never Commit Directly to `main`**: All modifications for an issue must reside on its dedicated branch.

### C. Pull Request & Merge Workflow
1. **Verification Before PR**:
   - Run unit/E2E tests (`npm test` or `npx playwright test`).
   - Run production build (`npm run build`).
2. **Push & Create PR**:
   - Push branch to remote: `git push origin <branch-name>`.
   - Create PR using GitHub CLI: `gh pr create --title "<type>: <title> (#XX)" --body "Closes #XX\n\n### Summary\n..."`.
3. **Merge via PR**:
   - Merge PR into `main` using `gh pr merge --squash --delete-branch`.
   - Never merge locally or push directly to `main`.
4. **Post-Merge Sync**:
   - Switch back to `main`: `git checkout main && git pull origin main`.
   - Confirm the associated GitHub issue is closed.
