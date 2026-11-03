# Cognitive Inference Integration Guide

## 1. Integration Boundary Philosophy
The cognitive detection model (facial action units, DAiSEE classifiers, or engagement models) is trained and supplied by the specialized Machine Learning research team.

**CogFlow strictly isolates this external dependency behind a replaceable provider contract.**
The application does NOT train or bundle ML weights. When the trained model is ready for deployment, integration requires **implementing one provider adapter**, without refactoring the frontend, backend, or learning engine.

---

## 2. The Provider Contract

Both client and server import the shared contract from `@cogflow/shared`:

```typescript
export type CognitiveState = 'FLOW' | 'OVERLOAD' | 'BOREDOM' | 'UNKNOWN';

export interface CognitiveInferenceInput {
  timestamp: number;
  fps?: number;
  features?: {
    blinkRate?: number;
    headPoseVariation?: number;
    gazeFixationDuration?: number;
    actionUnits?: Record<string, number>;
  };
  behavioralSignals?: {
    pointerVelocity?: number;
    scrollCadence?: number;
    readingSpeedWpm?: number;
    interactionFrequency?: number;
    dwellTimeSec?: number;
  };
}

export interface CognitiveInferenceResult {
  state: CognitiveState;
  confidence: number;
  probabilities?: {
    flow: number;
    overload: number;
    boredom: number;
  };
  modelVersion?: string;
  observedAt: string;
  source: 'mock' | 'external_model' | 'rule_fallback';
}

export interface CognitiveInferenceProvider {
  readonly id: string;
  readonly name: string;
  initialize(): Promise<void>;
  isAvailable(): Promise<boolean>;
  infer(input: CognitiveInferenceInput): Promise<CognitiveInferenceResult>;
  dispose(): Promise<void>;
}
```

---

## 3. How to Plug In the Trained External Model

To connect the external team's model to CogFlow:

1. Open `client/src/features/cognitive/ExternalModelAdapter.ts`.
2. In `initialize()`, load your model runtime (e.g. ONNX Runtime Web, TensorFlow.js, or WebAssembly bundle):
   ```typescript
   async initialize(): Promise<void> {
     // Load ONNX/TF.js session
     this.session = await ort.InferenceSession.create('/models/cognitive_classifier.onnx');
     this.isInitialized = true;
   }
   ```
3. In `infer(input)`:
   - Extract raw features from `input.features` or local video element.
   - Run inference through your session.
   - Map output logits to normalized states: `FLOW`, `OVERLOAD`, or `BOREDOM`.
   - Return normalized `CognitiveInferenceResult`.
4. In `client/src/features/cognitive/useCognitiveTelemetry.ts`, switch `providerMode` to `'external'`.

**Everything else—including the 30-second sustained adaptation invariant, tier transitions (B/A/S), learning studios, assessment tracking, and session persistence—works automatically without any code changes!**

---

## 4. Development Mock & Testing Scenarios

For development and UI testing without an active camera or trained model weights, use `DevelopmentMockProvider.ts`.
It supports 4 explicit scenarios:
1. `natural_flow`: Sustained `FLOW` state (confidence ~0.92).
2. `sustained_overload`: Sustained `OVERLOAD` (confidence ~0.88), triggers proposal to step down to Tier B after 30s.
3. `sustained_boredom`: Sustained `BOREDOM` (confidence ~0.84), triggers proposal to step up to Tier S after 30s.
4. `jitter_fluctuating`: Alternates state every 5 seconds to verify that momentary fluctuations do NOT trigger the 30-second sustained adaptation invariant.
