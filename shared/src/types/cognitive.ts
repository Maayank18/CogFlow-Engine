export type CognitiveState = 'FLOW' | 'OVERLOAD' | 'BOREDOM' | 'UNKNOWN';

export type PedagogicalTier = 'B' | 'A' | 'S';

export interface CognitiveProbabilities {
  flow: number;
  overload: number;
  boredom: number;
}

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
  probabilities?: CognitiveProbabilities;
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

export interface AdaptationRecommendation {
  id: string;
  suggestedTier: PedagogicalTier;
  previousTier: PedagogicalTier;
  targetState: CognitiveState;
  sustainedDurationSeconds: number;
  confidence: number;
  reason: string;
  timestamp: string;
  autoApplied?: boolean;
}

export interface AdaptationHistoryItem {
  id: string;
  timestamp: string;
  previousTier: PedagogicalTier;
  newTier: PedagogicalTier;
  trigger: 'automatic_sustained' | 'manual_override' | 'assessment_recommendation';
  cognitiveStateAtTransition: CognitiveState;
  acceptedByUser: boolean;
}

