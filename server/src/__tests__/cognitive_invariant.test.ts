import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  CognitiveState,
  PedagogicalTier,
  AdaptationRecommendation,
} from '@cogflow/shared';

/**
 * Pure state machine replicating the 30-second sustained adaptation invariant.
 */
class SustainedAdaptationStateMachine {
  private activeState: CognitiveState = 'FLOW';
  private pendingState: CognitiveState | null = null;
  private stateStartTime: number | null = null;
  private activeRecommendation: AdaptationRecommendation | null = null;
  private dismissedState: CognitiveState | null = null;

  constructor(
    private currentTier: PedagogicalTier,
    private readonly sustainedThresholdSeconds = 30,
    private readonly confidenceThreshold = 0.6
  ) {}

  public getPendingState(): CognitiveState | null {
    return this.pendingState;
  }

  public getActiveRecommendation(): AdaptationRecommendation | null {
    return this.activeRecommendation;
  }

  public tick(
    state: CognitiveState,
    confidence: number,
    currentTimeMs: number
  ): AdaptationRecommendation | null {
    if (confidence < this.confidenceThreshold || state === 'UNKNOWN') {
      return null;
    }

    if (state === 'FLOW') {
      this.activeState = 'FLOW';
      this.pendingState = null;
      this.stateStartTime = null;
      this.dismissedState = null;
      this.activeRecommendation = null;
      return null;
    }

    if (this.dismissedState === state) {
      return null;
    }

    if (state !== this.pendingState) {
      this.pendingState = state;
      this.stateStartTime = currentTimeMs;
      return null;
    }

    if (this.stateStartTime && !this.activeRecommendation) {
      const elapsedSeconds = Math.floor((currentTimeMs - this.stateStartTime) / 1000);
      if (elapsedSeconds >= this.sustainedThresholdSeconds) {
        let suggestedTier: PedagogicalTier | null = null;
        if (state === 'OVERLOAD') {
          suggestedTier = this.currentTier === 'S' ? 'A' : this.currentTier === 'A' ? 'B' : null;
        } else if (state === 'BOREDOM') {
          suggestedTier = this.currentTier === 'B' ? 'A' : this.currentTier === 'A' ? 'S' : null;
        }

        if (suggestedTier) {
          this.activeRecommendation = {
            id: `adapt-${currentTimeMs}`,
            suggestedTier,
            previousTier: this.currentTier,
            targetState: state,
            sustainedDurationSeconds: this.sustainedThresholdSeconds,
            confidence,
            reason: `Sustained ${state} for ${this.sustainedThresholdSeconds}s`,
            timestamp: new Date(currentTimeMs).toISOString(),
          };
          return this.activeRecommendation;
        }
      }
    }

    return null;
  }

  public accept(): PedagogicalTier | null {
    if (!this.activeRecommendation) return null;
    const target = this.activeRecommendation.suggestedTier;
    this.currentTier = target;
    this.activeRecommendation = null;
    this.pendingState = null;
    this.stateStartTime = null;
    return target;
  }

  public dismiss(): void {
    if (this.activeRecommendation) {
      this.dismissedState = this.activeRecommendation.targetState;
    }
    this.activeRecommendation = null;
    this.pendingState = null;
    this.stateStartTime = null;
  }
}

describe('30-Second Sustained Adaptation Invariant', () => {
  let machine: SustainedAdaptationStateMachine;

  beforeEach(() => {
    machine = new SustainedAdaptationStateMachine('A', 30, 0.6);
  });

  it('does NOT trigger adaptation for short, momentary cognitive overload (< 30s)', () => {
    const baseTime = 1000000;
    // Overload for 10 seconds
    machine.tick('OVERLOAD', 0.85, baseTime);
    const rec10 = machine.tick('OVERLOAD', 0.85, baseTime + 10000);
    expect(rec10).toBeNull();

    // Overload for 29 seconds (1 second short of threshold)
    const rec29 = machine.tick('OVERLOAD', 0.85, baseTime + 29000);
    expect(rec29).toBeNull();
    expect(machine.getActiveRecommendation()).toBeNull();
  });

  it('TRIGGERS step-down adaptation to Tier B when Overload is sustained for 30 consecutive seconds', () => {
    const baseTime = 1000000;
    machine.tick('OVERLOAD', 0.88, baseTime);
    machine.tick('OVERLOAD', 0.88, baseTime + 15000);

    const rec = machine.tick('OVERLOAD', 0.88, baseTime + 30000);
    expect(rec).not.toBeNull();
    expect(rec?.suggestedTier).toBe('B');
    expect(rec?.previousTier).toBe('A');
    expect(rec?.targetState).toBe('OVERLOAD');
    expect(rec?.sustainedDurationSeconds).toBe(30);

    // Accept suggestion
    const newTier = machine.accept();
    expect(newTier).toBe('B');
  });

  it('TRIGGERS step-up adaptation to Tier S when Boredom is sustained for 30 consecutive seconds', () => {
    const baseTime = 1000000;
    machine.tick('BOREDOM', 0.82, baseTime);
    machine.tick('BOREDOM', 0.82, baseTime + 20000);

    const rec = machine.tick('BOREDOM', 0.82, baseTime + 30000);
    expect(rec).not.toBeNull();
    expect(rec?.suggestedTier).toBe('S');
    expect(rec?.previousTier).toBe('A');
    expect(rec?.targetState).toBe('BOREDOM');
  });

  it('RESETS accumulation if state drops back to FLOW before reaching 30s', () => {
    const baseTime = 1000000;
    // Overload for 20 seconds
    machine.tick('OVERLOAD', 0.85, baseTime);
    machine.tick('OVERLOAD', 0.85, baseTime + 20000);

    // Drop to Flow for 2 seconds (learner recovered or relaxed)
    machine.tick('FLOW', 0.9, baseTime + 22000);
    expect(machine.getPendingState()).toBeNull();

    // Overload resumes for another 15 seconds (total elapsed would be 35s if uninterrupted, but reset should prevent it)
    machine.tick('OVERLOAD', 0.85, baseTime + 24000);
    const rec = machine.tick('OVERLOAD', 0.85, baseTime + 39000);
    // Since it reset at 24000, 39000 - 24000 = 15s < 30s
    expect(rec).toBeNull();
  });

  it('IGNORES low-confidence or UNKNOWN inference inputs', () => {
    const baseTime = 1000000;
    machine.tick('OVERLOAD', 0.4, baseTime); // Below 0.6 threshold
    expect(machine.getPendingState()).toBeNull();

    machine.tick('UNKNOWN', 0.9, baseTime + 5000);
    expect(machine.getPendingState()).toBeNull();
  });

  it('RESPECTS user dismissal and does not repeatedly nag with the same suggestion', () => {
    const baseTime = 1000000;
    machine.tick('OVERLOAD', 0.85, baseTime);
    const rec = machine.tick('OVERLOAD', 0.85, baseTime + 30000);
    expect(rec).not.toBeNull();

    // User dismisses proposal
    machine.dismiss();
    expect(machine.getActiveRecommendation()).toBeNull();

    // Continuous overload afterwards does not immediately re-propose
    const nextRec = machine.tick('OVERLOAD', 0.85, baseTime + 35000);
    expect(nextRec).toBeNull();
  });
});

