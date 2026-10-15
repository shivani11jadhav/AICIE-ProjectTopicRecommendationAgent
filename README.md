# ProjectAI — AI-Powered Project Topic Recommendation Agent

A full-stack web application that recommends personalised academic project topics to college students using Google Gemini (or OpenAI) as the AI backend.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [Running Tests](#running-tests)
8. [Switching AI Provider](#switching-ai-provider)
9. [Limitations & Disclaimers](#limitations--disclaimers)

---

## Features

- Personalised project recommendations based on skills, interests, domain, difficulty, duration, and team type
- AI-generated, ranked, and scored recommendations (suitability + feasibility scores)
- Full project blueprint: architecture, modules, database schema, roadmap, testing approach
- AI mentor chat — ask follow-up questions with full project context
- Refine/alternative generation for any recommendation
- Save favourites to localStorage
- Search, filter, and sort results
- Responsive UI for mobile and desktop

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router |
| Backend    | Node.js, Express.js                     |
| AI         | Google Gemini (`gemini-1.5-flash`) or OpenAI (`gpt-4o-mini`) |
| Validation | express-validator                       |
| Rate limit | express-rate-limit                      |
| Tests      | Jest + Supertest                        |

---

## Project Structure

```
AI_CIE-3/
├── backend/
│   ├── src/
│   │   ├── server.js                  # Express entry point
│   │   ├── routes/
│   │   │   ├── health.js
│   │   │   ├── recommendations.js
│   │   │   └── chat.js
│   │   ├── providers/
│   │   │   ├── index.js               # Provider router
│   │   │   ├── gemini.js              # Google Gemini adapter
│   │   │   └── openai.js              # OpenAI adapter
│   │   ├── services/
│   │   │   ├── recommender.js         # Orchestrates AI calls
│   │   │   ├── scorer.js              # Scoring & ranking engine
│   │   │   └── promptBuilder.js       # All prompt templates
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js
│   │   │   └── errorHandler.js
│   │   ├── validation/
│   │   │   └── preferences.js
│   │   └── utils/
│   │       └── parseJSON.js           # Robust JSON extractor
│   ├── tests/
│   │   ├── scorer.test.js
│   │   ├── parseJSON.test.js
│   │   └── api.test.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── FormPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── DetailsPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── components/ui/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── ScoreBar.jsx
│   │   │   └── TagList.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── helpers.js
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Quick Start

### Prerequisites

- Node.js 18 or later
- A Google Gemini API key (free tier available at https://aistudio.google.com/app/apikey)

### 1. Clone / open the project

```bash
cd AI_CIE-3
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your API key:

```
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_api_key_here
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### 3. Install and start the backend

```bash
cd backend
npm install
npm run dev
```

The backend starts on **http://localhost:5000**.
Verify: open http://localhost:5000/api/health — should return `{"status":"ok"}`.

### 4. Install and start the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

### 5. Use the application

Open **http://localhost:5173** in your browser.

- Click **Find My Project Topic** or **Get Started**
- Fill in your preferences and click **Generate Recommendations**
- Browse ranked results, view full blueprints, save favourites, and chat with the AI mentor

---

## Environment Variables

| Variable         | Required | Default   | Description                                         |
|------------------|----------|-----------|-----------------------------------------------------|
| `AI_PROVIDER`    | Yes      | `gemini`  | `gemini` or `openai`                                |
| `GEMINI_API_KEY` | If Gemini | —        | Your Google Gemini API key                          |
| `OPENAI_API_KEY` | If OpenAI | —        | Your OpenAI API key                                 |
| `PORT`           | No       | `5000`    | Backend port                                        |
| `CORS_ORIGIN`    | No       | `http://localhost:5173` | Allowed frontend origin          |
| `RATE_LIMIT_MAX` | No       | `20`      | Max AI requests per IP per 15 minutes               |
| `SUPABASE_URL`   | No       | —         | Supabase project URL (optional persistence)         |
| `SUPABASE_ANON_KEY` | No    | —         | Supabase anon key (optional persistence)            |

**Never commit your `.env` file.** It is listed in `.gitignore`.

---

## API Reference

### GET /api/health

Returns server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-10-14T10:00:00.000Z",
  "provider": "gemini",
  "version": "1.0.0"
}
```

---

### POST /api/recommendations

Generate and rank personalised project topic recommendations.

**Request body:**
```json
{
  "branch": "Computer Science",
  "academicYear": "3rd Year",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI"],
  "domain": "Web Development",
  "techStack": ["React", "Node.js", "MongoDB"],
  "difficulty": "Intermediate",
  "duration": "1–2 months",
  "teamType": "Individual",
  "count": 5
}
```

**Response:**
```json
{
  "recommendations": [
    {
      "id": "abc123",
      "title": "AI-Powered Task Manager",
      "shortDescription": "...",
      "problemStatement": "...",
      "whySuitable": "...",
      "mainFeatures": ["Feature 1", "Feature 2"],
      "recommendedTechStack": ["React", "Node.js"],
      "requiredSkills": ["JavaScript", "React"],
      "difficulty": "Intermediate",
      "estimatedDuration": "4–6 weeks",
      "learningOutcomes": ["outcome1"],
      "feasibilityScore": 78,
      "feasibilityExplanation": "...",
      "domain": "Web Development",
      "tags": ["productivity", "AI"],
      "suggestedImprovements": ["improvement1"],
      "suitabilityScore": 85,
      "scoreBreakdown": {
        "skillMatch": 90,
        "interestMatch": 80,
        "feasibility": 78,
        "difficultyFit": 100,
        "techCompatibility": 85,
        "note": "Scores are estimates..."
      }
    }
  ],
  "meta": {
    "provider": "gemini",
    "count": 5,
    "generatedAt": "2026-10-14T10:00:00.000Z",
    "disclaimer": "..."
  }
}
```

---

### POST /api/recommendations/:id/detail

Generate a full blueprint for a selected project.

**Request body:**
```json
{
  "project": { /* the full recommendation object */ },
  "preferences": { /* the student preferences object */ }
}
```

**Response:** Detailed JSON with `projectOverview`, `objectives`, `proposedArchitecture`, `modules`, `databaseSchema`, `implementationRoadmap`, `testingApproach`, `futureEnhancements`.

---

### POST /api/recommendations/:id/refine

Generate alternative project suggestions.

**Request body:**
```json
{
  "project": { /* current project */ },
  "preferences": { /* student preferences */ },
  "refinementRequest": "Make it simpler and beginner-friendly"
}
```

**Response:** `{ "alternatives": [...], "generatedAt": "..." }`

---

### POST /api/chat

Chat with the AI mentor about a selected project.

**Request body:**
```json
{
  "message": "Can I build this with React and Node.js?",
  "project": { /* selected project */ },
  "preferences": { /* student preferences */ },
  "history": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ]
}
```

**Response:** `{ "reply": "Yes, React and Node.js are...", "timestamp": "..." }`

---

## Running Tests

```bash
cd backend
npm test
```

Tests cover:
- Scoring engine (5 tests)
- JSON parser (8 tests)
- API validation and error handling (5 tests)

All 18 tests should pass without an API key configured.

---

## Switching AI Provider

1. In `backend/.env`, change `AI_PROVIDER=openai` and set `OPENAI_API_KEY`.
2. Restart the backend (`npm run dev`).
3. No frontend changes required.

To add a new provider, create `backend/src/providers/myprovider.js` with `generate()` and `chat()` exports, then add a case for it in `backend/src/providers/index.js`.

---

## Limitations & Disclaimers

- Recommendations are AI-generated and based on stated preferences. They are not verified facts.
- Feasibility and suitability scores are estimates from a configurable scoring algorithm, not independently verified measurements.
- The AI does not verify that a project idea is unique or has never been built before.
- AI responses may be incorrect, outdated, or incomplete. Always review suggestions critically.
- Rate limiting (20 requests per 15 minutes per IP by default) applies to all AI endpoints.


  screenshots
  <img width="958" height="458" alt="Screenshot 2026-10-15 081806" src="https://github.com/user-attachments/assets/723a8b9b-57ae-4def-a591-a6b366318c1b" />
  <img width="953" height="496" alt="Screenshot 2026-10-15 082018" src="https://github.com/user-attachments/assets/75b24af3-cf8b-4caa-8a8c-e0c40aaa8663" />
  <img width="959" height="475" alt="Screenshot 2026-10-15 082032" src="https://github.com/user-attachments/assets/b35eac4a-8940-410b-9539-72267b703ea7" />



