# CogFlow Engine — Quick Start Guide

> Concise step-by-step instructions to install, configure AI, and run the CogFlow platform in under 2 minutes.

---

## 1. Prerequisites
- **Node.js**: `v18.0.0+` (v20+ recommended)
- **Git**: Installed
- **Ollama** *(Optional, for local AI)*: [ollama.com](https://ollama.com)
- **MongoDB** *(Optional)*: Auto-falls back to built-in In-Memory store if not installed.

---

## 2. Setup & Launch Commands

Run these commands in order from your terminal:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: (Optional) Setup Local AI with Ollama
If you want on-device AI generation, open a terminal and run:
```bash
# 1. Start Ollama service (if not already running as background app)
ollama serve

# 2. In another terminal, pull the recommended model:
ollama pull mistral:7b
```
*(Alternatively, you can add `GROQ_API_KEY=your_key` in `server/.env` for instant cloud AI, or run without either—CogFlow automatically uses its instant deterministic offline engine!)*

### Step 3: Run the Application
Launch both backend and frontend together:
```bash
npm run dev
```

### Step 4: Open in Your Browser
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **Ollama Check**: [http://localhost:11434](http://localhost:11434) *(Shows "Ollama is running")*

---

## 3. Verify Everything Works

```bash
# Run complete test suite (19 tests across server & client)
npm test

# Build production bundles
npm run build
```

---

## 4. Key Features & How to Use

| Feature | How to Use |
| :--- | :--- |
| **Study Any Custom Topic** | Click **`[✨ Study Any Topic]`** in the header or catalog. Enter any topic (e.g. *Rust Lifetimes*, *Quantum Computing*). AI generates all 5 studios on demand! |
| **3 Viewing Formats** | Click the **Theme Toggle** (Sun/Eye/Moon) in the top bar to cycle: **Crisp Light** $\rightarrow$ **Eye-Care Comfort (Sepia)** $\rightarrow$ **Dark OLED**. |
| **5 Pedagogical Studios** | Navigate between **Learn** (intuition & checks), **Visualize** (interactive flowcharts), **Code** (annotated examples), **Notes** (flashcards & pitfalls), and **Practice** (8–10 MCQs). |
| **Cognitive Telemetry** | Toggle the webcam in the right panel for privacy-preserving, on-device attention & flow monitoring (30s sustained adaptation invariant). |

---

## 5. Summary of Useful Commands

```bash
npm run dev          # Start full stack (Client + Server)
npm run dev:server   # Start backend API only
npm run dev:client   # Start React Vite frontend only
npm test             # Run test suite
npm run build        # Build production bundles
npm run typecheck    # Run TypeScript checks across monorepo
```
