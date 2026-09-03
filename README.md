# RhyRhy English (라이라이 잉글리시) 🎧 🇺🇸

A mobile-first, static English learning web application designed for YouTube video content with native speakers. Hosted natively on GitHub Pages with zero backend dependencies.

## 🚀 Key Features

1. **Pre-Video Markdown Quizzes**:
   - **Fill-in-the-blank**: Korean prompt, English sentence with blank, "Hint" button (first and last letter of each word), and "Skip" button.
   - **Multiple-choice**: Korean prompt, interactive option buttons. Choosing an incorrect option triggers a shake/fade animation and disables it, allowing users to keep trying until correct.
   - **Listening & fill-in-the-blank**: Speaker button with waveform animation, audio file playback, "Hint" button (first two letters of each word), and "Skip" button.
2. **Gated Progression & LocalStorage Persistence**:
   - The video and interactive script are unlocked only after finishing all pre-video quizzes.
   - Progress is automatically saved in `localStorage`; returning users resume right where they left off.
   - Completing quizzes unlocks the **Learning History** tracker.
3. **Split-Screen Interactive Video & Bilingual Script**:
   - **Desktop**: 50/50 split screen (video left, script right).
   - **Mobile Portrait**: Sticky 16:9 video at the top, scrollable script below.
   - **Mobile Landscape**: Split-screen view mirroring desktop layout.
   - **Bilingual Subtitles**: Switch between Both (EN + KR), English only, and Korean only.
   - **Click-to-Seek**: Clicking any sentence jumps the YouTube player directly to that moment.
   - **Auto-Scroll & Highlight**: Active sentence glows and scrolls into view as the video plays.
4. **Drag & Drop Sentence Bank**:
   - Drag any sentence card (using mouse on desktop or touch gestures on mobile) to reveal the floating bottom storage dock.
   - Dropping the sentence saves it to `localStorage` grouped by lesson.
   - Review and manage saved sentences anytime from the top navigation bar.
5. **Post-Video Reflection, YouTube Comments & Lottie Celebration**:
   - Prompts the user to write their own English sentence using what they learned.
   - Posts comments directly to YouTube via YouTube Data API v3 (or one-click copy & deep link).
   - Celebrates completion with high-performance Lottie confetti animations.
6. **PWA & 100% Offline Resilience**:
   - Registered Service Worker caches all core app files, styles, audio files, and markdown quizzes.
   - Quizzes, audio, scripts, and vocabulary bank work completely offline (gracefully noting when embedded YouTube requires an internet connection).

---

## 📂 Project Structure

```
/
├── index.html                   # Landing page, lesson catalog, resume banner & history
├── manifest.webmanifest         # Progressive Web App manifest
├── sw.js                        # Offline service worker caching
├── css/
│   ├── main.css                 # Base theme variables, typography, mobile-first styles
│   ├── navigation.css           # Header, lesson switcher drawer, offline banner
│   ├── quiz.css                 # Quiz card, fill-in-the-blank, multiple-choice, listening
│   ├── video-script.css         # Split-screen responsive layouts, subtitle styling
│   ├── drag-drop.css            # Bottom storage dock, touch ghost, drop animations
│   └── modal.css                # Reflection composer, Lottie overlay, modals
├── js/
│   ├── storage.js               # LocalStorage manager (progress, history, saved sentences)
│   ├── markdown-quiz-parser.js  # Parses quiz Markdown files at runtime
│   ├── quiz-engine.js           # Quiz state machine (hints, skips, animations, gating)
│   ├── video-script.js          # YouTube player sync, bilingual script, auto-scroll
│   ├── drag-drop.js             # Desktop HTML5 drag & mobile touch drag handler
│   ├── youtube-comment.js       # Reflection prompt, YouTube API posting & fallback
│   ├── celebration.js           # Lottie confetti & milestone celebration trigger
│   └── app.js                   # Navigation, lesson switching, drawers, PWA registration
├── assets/
│   ├── icons/                   # App icons and SVG assets
│   ├── lottie/                  # celebration.json (Lottie confetti animation)
│   └── vendor/                  # lottie.min.js (offline bundled runtime)
├── templates/
│   └── quizzes/                 # Templatized Markdown formats for easy editing
│       ├── README.md            # Content creator guide
│       ├── fill-in-the-blank.md
│       ├── multiple-choice.md
│       └── listening.md
└── lessons/
    ├── lesson-01/               # Morning Routine & Daily Habits
    │   ├── index.html           # Dedicated URL path for Lesson 1
    │   ├── metadata.json        # Video ID, title, level, description
    │   ├── quiz.md              # Templatized Markdown quiz file
    │   ├── script.json          # Bilingual script with timestamps
    │   └── audio/               # cats.wav
    ├── lesson-02/               # Ordering at a Trendy Cafe
    │   ├── index.html
    │   ├── metadata.json
    │   ├── quiz.md
    │   ├── script.json
    │   └── audio/               # coffee.wav, order.wav
    └── lesson-03/               # Airport & Travel Essentials
        ├── index.html
        ├── metadata.json
        ├── quiz.md
        ├── script.json
        └── audio/               # travel.wav
```

---

## 🌐 Deploying to GitHub Pages

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of RhyRhy English"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to **Settings > Pages** in your GitHub repository.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be live at `https://<your-username>.github.io/<your-repo-name>/`!

---

## ✍️ How to Add a New Lesson

1. Create a new folder under `lessons/` (e.g. `lessons/lesson-04/`).
2. Copy `index.html` from `lesson-01` and update `LESSON_ID = 'lesson-04'`.
3. Create `metadata.json` with your YouTube video ID and title.
4. Create `quiz.md` using the templates in `templates/quizzes/`.
5. Create `script.json` with your bilingual timestamps.
6. Add any listening audio files into `audio/`.
7. Add the new lesson entry to the `App.lessons` array in `js/app.js` and `index.html`.

---

## 📄 License

- **Educational Content & Media** (quizzes, scripts, audio recordings): Licensed under [![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC_BY--NC_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/) [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
  - *Attribution*: **RhyRhy English (현서네 리얼 영어)**
  - *NonCommercial*: Free to share and adapt for non-commercial educational purposes.
- **Software Code**: Licensed under the [MIT License](LICENSE).


