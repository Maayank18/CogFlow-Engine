# CogFlow Engine — Quick Start Guide

> Concise step-by-step instructions to install, configure `qwen2.5-coder:7b` AI, and run the CogFlow platform in under 2 minutes.

---

## 1. Prerequisites
- **Node.js**: `v18.0.0+` (v20+ recommended)
- **Git**: Installed
- **Ollama** *(Recommended for local AI)*: [ollama.com](https://ollama.com)
- **MongoDB** *(Optional)*: Automatically falls back to built-in in-memory database if not installed.

---

## 2. Setup & Launch Commands (Step-by-Step)

Run these commands in order from your terminal:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Local AI with Ollama (`qwen2.5-coder:7b`)
CogFlow uses **`qwen2.5-coder:7b`** as its primary neural engine for synthesizing 5-studio interactive lessons, architectural flowcharts, and assessments.

Open your terminal and run:
```bash
# 1. Start Ollama service (if not already running in your background tray)
ollama serve

# 2. In another terminal, pull the pre-configured model:
ollama pull qwen2.5-coder:7b
```

> **Note**: CogFlow is pre-configured out-of-the-box in `.env` (`OLLAMA_MODEL=qwen2.5-coder:7b`). If Ollama is offline or pulling, CogFlow seamlessly uses its instant deterministic offline engine—zero blank states, zero crashes!

### Step 3: Run the Application
Launch both backend and frontend together with a single command:
```bash
npm run dev
```

### Step 4: Open in Your Browser
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- **Ollama Check**: [http://localhost:11434](http://localhost:11434) *(Displays "Ollama is running")*

---

## 3. Important Things to Know

1. **Zero Database Configuration**: If you do not have MongoDB running locally, CogFlow automatically initializes an in-memory document store. Everything works immediately out of the box.
2. **On-Demand Custom Topics**: You can study *any* topic on earth. Click **`[✨ Study Any Topic]`** in the top navigation bar or catalog, type a topic (e.g. *Rust Lifetimes*, *Quantum Computing*), and `qwen2.5-coder:7b` will synthesize an entire curriculum across all 5 studios.
3. **3 Visual Themes**: Click the **Theme Toggle** (Sun/Eye/Moon) in the top bar to switch between:
   - **Crisp Light** (High contrast daylight)
   - **Comfort Mode** (Eye-care warm off-white / sepia for fatigue-free long sessions)
   - **Dark OLED** (True deep black)
4. **5 Specialized Studios**: Every lesson is structured across **Learn** (intuition & checks), **Visualize** (interactive step-by-step flowcharts), **Code** (annotated examples), **Notes** (flashcards & pitfalls), and **Practice** (8–10 MCQs).
5. **Private On-Device Telemetry**: Facial telemetry uses local in-browser WebAssembly models with a **30-second sustained adaptation invariant**. No images or video are ever stored or uploaded.

---

## 4. Verification & Testing Commands

```bash
# Run complete test suite (19 tests across server & client)
npm test

# Build production bundles
npm run build

# Run TypeScript checks across the monorepo
npm run typecheck
```

---

## 5. Summary of Useful Commands

```bash
npm run dev          # Start full stack concurrently (Client on :5173 + Server on :8000)
npm run dev:server   # Start backend API only
npm run dev:client   # Start React Vite frontend only
npm test             # Run test suite
npm run build        # Build production bundles
```
