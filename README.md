# CogFlow 🧠
### Cognitive-Aware Adaptive Learning Platform | MERN Architecture

> **"Understand the learner's evolving learning conditions and adapt how knowledge is taught, rather than forcing every learner through the same static learning experience."**

---

## 🌟 What is CogFlow?

Traditional learning platforms treat education as a static pipeline: video lectures, fixed reading materials, generic quizzes, and static progression bars.

**CogFlow introduces cognitive awareness to digital education.** It continuously perceives permitted, privacy-conscious learning signals, estimates cognitive load, and dynamically recalibrates the pedagogical depth of the curriculum across three tiers:

- **Tier B — Foundations (Cognitive Relief Mode)**: When concept density causes overload, CogFlow lowers cognitive complexity with real-world analogies, step-by-step visual scaffolding, and minimal jargon.
- **Tier A — Core Standard (Flow State Mode)**: When challenges match learner ability, CogFlow delivers balanced industry rigor, formal concepts, architecture diagrams, production code, and trade-off analysis.
- **Tier S — Advanced (Intellectual Challenge Mode)**: When material is too elementary, CogFlow deepens intellectual challenge with mathematical formalisms, asymptotic complexity proofs, lock-free concurrency, and distributed invariants.

---

## 🔁 The Core Conceptual Cycle

CogFlow operates on a continuous 6-step loop:

$$\textbf{Perceive} \longrightarrow \textbf{Interpret} \longrightarrow \textbf{Adapt} \longrightarrow \textbf{Teach} \longrightarrow \textbf{Evaluate} \longrightarrow \textbf{Improve}$$

1. **Perceive**: Collect permitted on-device camera cues and passive behavioral timing signals (strictly zero video uploads).
2. **Interpret**: Estimate learner condition: **Flow**, **Cognitive Overload**, or **Boredom**.
3. **Adapt**: Determine appropriate pedagogical depth via the **30-second sustained adaptation invariant**.
4. **Teach**: Deliver concepts across 5 distinct pedagogical studios.
5. **Evaluate**: Assess conceptual reasoning via semantic rubric grading.
6. **Improve**: Feed session outcomes and cognitive telemetry into personalized mastery tracking.

---

## 🎨 Design Direction: "Calm Precision"

CogFlow features a ground-up design language called **Calm Precision**:
- **Clarity, Intelligence & Academic Credibility**: No distracting SaaS dashboard clutter, excessive floating cards, or loud gradients.
- **Carefully Constructed Semantic Palette**: Light (warm off-white canvas, graphite typography, restrained blue action colors, subtle teal for positive feedback) and Dark (deep charcoal canvas, elevated slate surfaces, high contrast typography).
- **Consistent Design System Primitives**: Reusable buttons, badges, cards, inputs, dialogs, drawers, toasts, tabs, and skeletons.

---

## 🚀 The Learning Cockpit: 5 Pedagogical Studios

The central learning workspace gives learners 5 specialized modes for every concept:

1. **Learn Studio**: Structured concept breakdowns (What, How, Misconceptions, Takeaways) with progressive disclosure and interactive comprehension checks.
2. **Visual Studio**: Interactive Mermaid architecture diagrams with an interactive stage/phase inspector.
3. **Code Studio**: Syntax-highlighted code walkthroughs, time/space complexity analysis cards, edge cases, and input/output demos.
4. **Notes Studio**: Key definitions, KaTeX mathematical formulas, frequent pitfalls, and 3D flip recall flashcards.
5. **Practice Studio**: Multiple-choice logic checks and open-ended conceptual challenges graded by semantic pedagogical rubrics.

---

## ⏱️ The 30-Second Sustained Adaptation Invariant

To eliminate erratic UI flickering caused by brief pauses or thinking squints:
- Inferred state changes must persist for **30 consecutive seconds** before recalibration is suggested.
- Returning to **Flow** resets the timer and clears pending proposals.
- Proposals feature a live countdown timer: `Cognitive adjustment suggested — 18 / 30 seconds`.
- Learner retains full sovereignty: can Accept, Dismiss, or Manually Override tier at any time.

---

## 🤖 Multi-Provider LLM Orchestration

CogFlow operates independently of any single AI provider:
- **Local First**: Local [Ollama](https://ollama.ai) instance using `qwen2.5-coder:7b`.
- **Cloud Fallback A**: High-speed [Groq](https://groq.com) inference using `llama-3.3-70b-versatile`.
- **Cloud Fallback B**: [OpenRouter](https://openrouter.ai) using `meta-llama/llama-3.3-70b-instruct`.
- **Zero-Failure Safety Engine**: Built-in deterministic pedagogical engine ensures complete lessons, Mermaid diagrams, and rubric grading even in offline environments.

---

## 🔒 Security & Privacy Boundaries

- **Zero Biometric Uploads**: Webcam frames remain strictly in local browser memory. No webcam frame, image buffer, or facial landmark coordinate is ever transmitted to the server or cloud AI providers.
- **Optional Monitoring**: Camera monitoring is disabled by default. CogFlow is 100% functional with the camera turned off.
- **No Untrusted Server Code Execution**: Generated code is displayed for study and analysis; untrusted generated code is never executed inside the application server.
- **Hardened Backend**: Argon2/Bcrypt password hashing, signed JWTs with HttpOnly cookies, Helmet security headers, CORS allowlist, and express-rate-limit brute-force protection.

---

## 📁 Repository Structure

```text
cogflow/
├── client/                    # React 19 + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── components/ui/     # Reusable design system primitives
│   │   ├── design-system/     # Theme provider (Light / Dark / System)
│   │   ├── features/
│   │   │   ├── auth/          # Authentication & session context
│   │   │   ├── onboarding/    # Privacy-conscious preferences setup
│   │   │   ├── dashboard/     # Learning workspace & stats
│   │   │   ├── subjects/      # Filterable curriculum catalog
│   │   │   ├── documents/     # PDF upload & syllabus topic extractor
│   │   │   ├── learning/      # Learning Cockpit (Canvas, Studios, B/A/S controls)
│   │   │   ├── cognitive/     # 30s Invariant hook, Telemetry, Mock provider
│   │   │   ├── analytics/     # Topic mastery, session history, cognitive chart
│   │   │   └── settings/      # Account, appearance, privacy, camera controls
│   │   └── services/          # Strongly-typed API client
├── server/                    # Node.js + Express + TypeScript + Mongoose
│   ├── src/
│   │   ├── config/            # Strongly-typed configuration
│   │   ├── infrastructure/
│   │   │   ├── database/      # Mongoose models & In-Memory resilience fallback
│   │   │   └── llm/           # Ollama, Groq, OpenRouter, and Deterministic fallback
│   │   ├── middleware/        # Auth, RateLimiting, Helmet, ErrorHandler
│   │   └── modules/           # Auth, Users, Subjects, Learning, Assessments,
│   │                          # Cognitive, Documents, Notes, Analytics, AI
├── shared/                    # Shared contracts, cognitive interfaces, Zod schemas
├── docs/                      # Architectural, API, and Integration documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── AI_INTEGRATION.md
│   ├── COGNITIVE_MODEL_INTEGRATION.md
│   ├── SECURITY.md
│   └── DEVELOPMENT.md
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quickstart

### 1. Prerequisites
- Node.js v20+ (Tested on v24)
- npm v10+

### 2. Install & Configure
```bash
# Clone the repository
git clone <repo-url>
cd "CogFlow - Engine"

# Install all workspace dependencies
npm install

# Setup local environment variables
cp .env.example .env

# Build shared package
npm run build:shared
```

### 3. Start Development Environment
```bash
# Terminal 1: Backend Server (http://localhost:8000)
npm run dev:server

# Terminal 2: Frontend Client (http://localhost:5173)
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing

CogFlow includes comprehensive unit and integration tests across both frontend and backend:

```bash
# Run the entire test suite (Vitest)
npm test
```

Tests verify:
- ✅ **The 30-Second Sustained Adaptation Invariant** (threshold trigger, momentary dip resets, state reversals to Flow, dismissal memory)
- ✅ **Multi-Provider AI Orchestration & Fallback Engine** (Ollama health check, cloud fallbacks, deterministic fallback generator)
- ✅ **Semantic Pedagogical Rubric Grading** (conceptual understanding, causal reasoning, missing concepts, strengths diagnosis)
- ✅ **Backend API Integration** (registration, JWT authentication, user preferences, curriculum catalog, learning session persistence, cognitive telemetry logging)
- ✅ **Client Cognitive Telemetry Providers** (mock simulation scenarios, external adapter boundary validation)

---

## 📚 Complete Engineering Documentation

Detailed documentation is available in the `docs/` folder:
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specification](docs/API.md)
- [Database Schema & Models](docs/DATABASE.md)
- [AI Orchestration & LLM Integration](docs/AI_INTEGRATION.md)
- [Cognitive Model Integration Guide](docs/COGNITIVE_MODEL_INTEGRATION.md)
- [Security & Privacy Boundaries](docs/SECURITY.md)
- [Local Development & Operations](docs/DEVELOPMENT.md)

---

## 📄 License
MIT License. Built with precision by the CogFlow Engineering Team.

