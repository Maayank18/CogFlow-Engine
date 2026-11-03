# CogFlow Local Development & Operations Guide

## 1. Prerequisites
- **Node.js**: v20.0+ (Tested on v24.19.0)
- **npm**: v10+ (Tested on v12.0.2)
- **Optional Local LLM**: [Ollama](https://ollama.ai) with `qwen2.5-coder:7b` (built-in fallback engine runs if Ollama is not installed).
- **Optional Database**: MongoDB v6.0+ (built-in in-memory document store activates automatically if local mongod is not running).

---

## 2. Quickstart Setup

1. **Clone and Install Dependencies**:
   ```bash
   git clone <repo-url>
   cd "CogFlow - Engine"
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```

3. **Build the Shared Package**:
   ```bash
   npm run build:shared
   ```

4. **Start the Development Servers**:
   In two separate terminals (or using the root script):
   ```bash
   # Terminal 1: Backend Server (runs on http://localhost:8000)
   npm run dev:server

   # Terminal 2: Frontend Client (runs on http://localhost:5173)
   npm run dev:client
   ```

5. Open your browser at `http://localhost:5173`.

---

## 3. Useful NPM Scripts

| Script | Purpose |
|---|---|
| `npm run dev:server` | Starts backend server with tsx watch and hot reloading. |
| `npm run dev:client` | Starts Vite client dev server with HMR. |
| `npm run build` | Builds shared, server, and client packages for production. |
| `npm run typecheck` | Runs TypeScript compiler checks across all workspaces. |
| `npm test` | Runs the full Vitest suite (19 tests across server & client). |

---

## 4. Testing & Verification

Run the automated test suite:
```bash
npm test
```

This executes:
1. **Cognitive Invariant Tests**: 30-second sustained threshold, momentary interruption resets, state reversals, and dismissal behavior.
2. **AI Orchestrator Tests**: Ollama connection checks, cloud fallbacks, deterministic fallback generator, and semantic rubric evaluations.
3. **API Integration Tests**: User registration, login, preferences, session persistence, and cognitive telemetry ingestion.
4. **Client Provider Tests**: Simulation scenarios and external adapter boundary handling.

---

## 5. Connecting Ollama (Optional)

If you wish to use local neural inference:
1. Install [Ollama](https://ollama.ai).
2. Pull the default model:
   ```bash
   ollama pull qwen2.5-coder:7b
   ```
3. Ensure Ollama is running (`ollama serve`). CogFlow will automatically detect it at `http://127.0.0.1:11434` and route generation requests to it.

