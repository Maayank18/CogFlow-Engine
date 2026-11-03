# CogFlow Architecture & System Design

## 1. System Overview
CogFlow is a cognitive-aware adaptive learning platform. Traditional educational platforms enforce a static, one-size-fits-all curriculum where every learner is subjected to identical pacing, depth, and presentation regardless of their mental state.

CogFlow operates on the continuous closed-loop cycle:

$$\text{Perceive} \longrightarrow \text{Interpret} \longrightarrow \text{Adapt} \longrightarrow \text{Teach} \longrightarrow \text{Evaluate} \longrightarrow \text{Improve}$$

```mermaid
flowchart TD
    subgraph Client [Client Application — React 19]
      A[Telemetry Collector] -->|Local Video Stream| B[Cognitive Inference Engine]
      A -->|Scroll & Pointer Cadence| B
      B --> C[30s Sustained Adaptation Invariant]
      C --> D[Learning Cockpit]
      D --> E1[Learn Studio]
      D --> E2[Visual Studio]
      D --> E3[Code Studio]
      D --> E4[Notes Studio]
      D --> E5[Practice Studio]
    end

    subgraph Server [Backend Engine — Node.js / Express]
      F[API Gateway & Rate Limiter] --> G[Learning Service]
      F --> H[AI Orchestrator]
      F --> I[Cognitive Telemetry Service]
      F --> J[Semantic Grading Engine]
      F --> K[Document / Syllabus Ingestion]
    end

    subgraph Intelligence [LLM Orchestration Layer]
      H --> L1[Local Ollama: qwen2.5-coder:7b]
      H --> L2[Cloud Fallback: Groq]
      H --> L3[Cloud Fallback: OpenRouter]
      H --> L4[Deterministic Fallback Engine]
    end

    subgraph Storage [Persistence Layer]
      G --> M[(MongoDB / In-Memory Resilience Store)]
      I --> M
      J --> M
    end

    C -.->|Recalibration Proposal| D
    D <-->|API v1 (REST & Streaming)| F
```

---

## 2. Spatial Architecture: The Learning Cockpit
The **Learning Cockpit** is the central learning environment of CogFlow. It eschews generic dashboard widgets in favor of an immersive, distraction-minimized tri-panel layout:

1. **Left Navigation Panel (Collapsible)**:
   - Displays topic title, curriculum category, and active duration timer.
   - Provides quick switching between the 5 dedicated pedagogical studios:
     - **Learn Studio**: Structured conceptual explanations with progressive disclosure and comprehension checkpoints.
     - **Visual Studio**: Interactive Mermaid architecture diagrams with an interactive stage/phase inspector.
     - **Code Studio**: Syntax-highlighted code with time/space complexity cards, boundary edge cases, and input/output demos.
     - **Notes Studio**: Essential definitions, KaTeX formulas, critical pitfalls, and 3D flip recall flashcards.
     - **Practice Studio**: Multiple-choice logic checks and open-ended conceptual challenges graded by semantic pedagogical rubrics.
   - Section outlines for jumping across lesson modules.

2. **Central Learning Canvas**:
   - Primary content workspace displaying the active studio.
   - Top tier-switcher allowing seamless transition between **Tier B** (Foundations), **Tier A** (Core Standard), and **Tier S** (Advanced Rigor) without losing notes, assessment history, or session state.

3. **Right Intelligence Panel (Collapsible)**:
   - Live cognitive state indicator: **Flow**, **Cognitive Overload**, or **Boredom**.
   - Confidence score and class probabilities.
   - On-device camera preview with explicit hardware toggles (100% on-device; zero frame uploads).
   - Live countdown progress bar tracking the 30-second sustained adaptation invariant.
   - Recalibration proposal banner with reasons, accept button, and dismiss options.
   - Development simulation mode selector for testing adaptation transitions.

---

## 3. The 30-Second Sustained Adaptation Invariant
To prevent disruptive UI flickering and erratic pacing caused by momentary micro-fluctuations (e.g., brief squinting or thinking pauses), CogFlow strictly enforces the **30-second sustained threshold**:

1. **Threshold Requirement**: An inferred cognitive state change (`OVERLOAD` or `BOREDOM`) must persist uninterrupted for 30 consecutive seconds before a pedagogical recalibration is proposed.
2. **Cancellation on Return to Flow**: If the learner recovers or returns to `FLOW` before 30 seconds elapse, the accumulation timer resets to zero.
3. **Tab Invisibility Handling**: If the user switches browser tabs, accumulation is paused.
4. **Learner Sovereignty**: Adjustments are presented as non-intrusive proposals. The learner can accept, dismiss, or manually override their tier at any time.

---

## 4. Multi-Tier Pedagogical Model (B / A / S)

| Tier | Name | Target State | Pedagogical Depth & Focus |
|---|---|---|---|
| **B** | **Foundations** | Relieve Overload | Real-world physical analogies, step-by-step visual scaffolding, minimal jargon, intuitive diagrams. |
| **A** | **Core Standard** | Preserve Flow | Professional engineering standard, formal terminology, architecture diagrams, production code patterns, and practical trade-offs. |
| **S** | **Advanced Challenge** | Eliminate Boredom | Mathematical formalisms, asymptotic complexity proofs, lock-free concurrency, memory alignment, and distributed invariants. |

---

## 5. Privacy & Zero-Biometric Guarantee
1. **Zero Video Transmission**: Webcam streams are bound strictly to local HTML5 video elements. No webcam frame, image buffer, or facial landmark coordinate is ever transmitted to the server or cloud AI providers.
2. **Optional Monitoring**: The camera is disabled by default. Learners can use CogFlow with the camera turned off, relying on behavioral timing telemetry or manual tier selection.
3. **Aggregated Telemetry Only**: Only coarse normalized labels (e.g. `FLOW`, confidence `0.85`, timestamp) are recorded to the backend database to compute session mastery and adaptation logs. Raw telemetry expires via MongoDB TTL after 30 days.
