import { config } from '../../config/index.js';
import { CognitiveEventModel, AdaptationEventModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export class CognitiveService {
  getStatus() {
    return {
      provider: config.cognitive.provider,
      simulationEnabled: config.cognitive.enableSimulation,
      sustainedThresholdSeconds: config.cognitive.sustainedThresholdSeconds,
      confidenceThreshold: config.cognitive.confidenceThreshold,
      status: 'active',
      cameraFrameStorage: 'DISABLED_BY_DESIGN (Zero biometric persistence)',
    };
  }

  async recordEvent(params: {
    userId: string;
    sessionId: string;
    state: 'FLOW' | 'OVERLOAD' | 'BOREDOM' | 'UNKNOWN';
    confidence: number;
    probabilities?: { flow: number; overload: number; boredom: number };
    observedAt: string;
    source: 'mock' | 'external_model' | 'rule_fallback';
  }) {
    const { isInMemoryMode } = getDatabaseStatus();

    const record = {
      userId: params.userId,
      sessionId: params.sessionId,
      state: params.state,
      confidence: params.confidence,
      probabilities: params.probabilities,
      source: params.source,
      observedAt: new Date(params.observedAt),
    };

    if (isInMemoryMode) {
      return inMemoryStore.cognitiveEvents.create(record);
    }
    return CognitiveEventModel.create(record);
  }

  async recordAdaptation(params: {
    userId: string;
    sessionId: string;
    previousTier: 'B' | 'A' | 'S';
    suggestedTier: 'B' | 'A' | 'S';
    resultingTier: 'B' | 'A' | 'S';
    triggerReason: string;
    accepted: boolean;
    sustainedDurationSeconds: number;
  }) {
    const { isInMemoryMode } = getDatabaseStatus();

    const record = {
      userId: params.userId,
      sessionId: params.sessionId,
      previousTier: params.previousTier,
      suggestedTier: params.suggestedTier,
      resultingTier: params.resultingTier,
      triggerReason: params.triggerReason,
      accepted: params.accepted,
      sustainedDurationSeconds: params.sustainedDurationSeconds,
      timestamp: new Date(),
    };

    if (isInMemoryMode) {
      return inMemoryStore.adaptationEvents.create(record);
    }
    return AdaptationEventModel.create(record);
  }

  async getSessionEvents(sessionId: string, userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return inMemoryStore.cognitiveEvents
        .find((e) => e.sessionId === sessionId && e.userId === userId)
        .slice(-100);
    }

    return CognitiveEventModel.find({ sessionId, userId }).sort({ observedAt: -1 }).limit(100);
  }
}

export const cognitiveService = new CognitiveService();

