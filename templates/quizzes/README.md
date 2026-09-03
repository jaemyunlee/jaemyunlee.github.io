# RhyRhy English - Quiz Templates & Documentation

This directory contains template formats and guidelines for creating and editing quizzes for RhyRhy English lessons.

## Supported Quiz Formats

### 1. Fill-in-the-Blank
- **Template File**: `fill-in-the-blank.md`
- **Purpose**: Vocabulary, idiom, and grammar recall.
- **Syntax**:
  ```markdown
  ## Quiz 1
  - **Type**: fill-in-the-blank
  - **Korean**: 나는 고양이를 키워요
  - **English**: I have [cats]
  - **Explanation**: "cats" is the plural form of cat.
  ```
- **Engine Rules**:
  - The bracketed word or phrase `[word]` marks the blank.
  - Clicking **Hint** reveals the first and last letter of each word (e.g., `c _ _ s`).
  - Clicking **Skip** reveals the correct answer in green and advances.

---

### 2. Multiple-Choice
- **Template File**: `multiple-choice.md`
- **Purpose**: Recognition and contextual meaning selection.
- **Syntax**:
  ```markdown
  ## Quiz 2
  - **Type**: multiple-choice
  - **Korean**: 오늘 날씨가 정말 화창하네요
  - **English**: The weather is really [sunny, rainy, foggy, snowy]
  - **Answer**: sunny
  - **Explanation**: "sunny" describes bright, clear weather with lots of sunshine.
  ```
- **Engine Rules**:
  - Bracketed list `[choice 1, choice 2, choice 3, choice 4]` defines the choices.
  - `Answer` specifies the correct option (defaults to the first option if omitted).
  - An incorrect selection triggers a shake/fade animation and deactivates that button.
  - The user continues until the correct option is selected, which advances the quiz.

---

### 3. Listening & Fill-in-the-Blank
- **Template File**: `listening.md`
- **Purpose**: Auditory comprehension and phonetic spelling.
- **Syntax**:
  ```markdown
  ## Quiz 3
  - **Type**: listening
  - **Audio**: audio/cats.wav
  - **English**: I have two cute [cats]
  - **Korean**: 나는 귀여운 고양이 두 마리를 키워요
  - **Explanation**: Notice how native speakers blend the 't' and 's' into /ts/.
  ```
- **Engine Rules**:
  - `Audio` points to the relative path of the audio file in the lesson folder.
  - The speaker icon plays the audio with visual wave ripples.
  - Clicking **Hint** reveals the first **two** letters of each word (e.g., `ca__`).
  - Clicking **Skip** displays the answer and advances.

---

## How to Add or Update Quizzes

1. Open your lesson folder (e.g. `lessons/lesson-01/quiz.md`).
2. Add or edit quiz blocks following the format above.
3. Save the file.
4. Refresh the lesson page in your browser. The client-side parser immediately reads the new content!

