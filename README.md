# UNDERSTANDX — React + Vite

This project separates the supplied UNDERSTANDX React UI into page files and uses Tailwind CSS for styling.

## Run in Visual Studio Code

1. Download and extract `understandx-react.zip`.
2. Open the extracted `understandx-react` folder in Visual Studio Code.
3. Open **Terminal → New Terminal**.
4. Check Node.js is installed with `node -v` and `npm -v`.
5. Install the project packages:

   ```bash
   npm install
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

## Main files

- `src/App.jsx` — main navigation, login state, footer, and page switching
- `src/pages/HomePage.jsx` — landing page, feature cards, testimonials
- `src/pages/LoginPage.jsx` — sign-in / create-account screen
- `src/pages/DashboardPage.jsx` — dashboard and reusable dashboard cards
- `src/pages/LearningLadderPage.jsx` — four-tier learning ladder
- `src/pages/DocumentVerificationPage.jsx` — upload UI and sample scan results
- `src/pages/HistoryMasteryPage.jsx` — learning history and mastery badges
- `src/index.css` — Tailwind directives and global styles

## Important notes

- The supplied design's sign-in/register form is currently a **front-end demo**. It does not save accounts or authenticate against a server.
- The document verification screen currently simulates a scan after upload; it does not actually read PDF/image contents or verify answers with AI.
- The dashboard metrics and learning-ladder sample solution are demonstration content.
- The original layout uses Tailwind CSS utility classes. Do not remove the Tailwind configuration/dependencies unless replacing the styling system.
