import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CognitiveState,
  PedagogicalTier,
  AdaptationRecommendation,
} from '@cogflow/shared';

export interface Use30SecondInvariantProps {
  currentState: CognitiveState;
  currentConfidence: number;
  currentTier: PedagogicalTier;
  confidenceThreshold?: number;
  sustainedThresholdSeconds?: number;
  onAdaptationProposed?: (recommendation: AdaptationRecommendation) => void;
}

export interface Use30SecondInvariantReturn {
  activeState: CognitiveState;
  pendingState: CognitiveState | null;
  elapsedSustainedSeconds: number;
  sustainedThresholdSeconds: number;
  progressPercentage: number;
  activeRecommendation: AdaptationRecommendation | null;
  acceptRecommendation: () => PedagogicalTier | null;
  dismissRecommendation: () => void;
  resetInvariant: () => void;
}

export function use30SecondInvariant({
  currentState,
  currentConfidence,
  currentTier,
  confidenceThreshold = 0.6,
  sustainedThresholdSeconds = 30,
  onAdaptationProposed,
}: Use30SecondInvariantProps): Use30SecondInvariantReturn {
  const [activeState, setActiveState] = useState<CognitiveState>('FLOW');
  const [pendingState, setPendingState] = useState<CognitiveState | null>(null);
  const [elapsedSustainedSeconds, setElapsedSustainedSeconds] = useState<number>(0);
  const [activeRecommendation, setActiveRecommendation] = useState<AdaptationRecommendation | null>(null);

  // Track dismissals to avoid nagging with identical suggestion repeatedly
  const dismissedStateRef = useRef<CognitiveState | null>(null);
  const stateStartTimeRef = useRef<number | null>(null);

  // Determine target tier based on cognitive state
  const computeTargetTier = useCallback(
    (targetState: CognitiveState, fromTier: PedagogicalTier): PedagogicalTier | null => {
      if (targetState === 'OVERLOAD') {
        // Step down to reduce cognitive complexity
        if (fromTier === 'S') return 'A';
        if (fromTier === 'A') return 'B';
        return null; // Already at foundational tier
      }

      if (targetState === 'BOREDOM') {
        // Step up to deepen intellectual challenge
        if (fromTier === 'B') return 'A';
        if (fromTier === 'A') return 'S';
        return null; // Already at advanced tier
      }

      return null;
    },
    []
  );

  useEffect(() => {
    // If inference is below confidence threshold or unknown, do not progress sustained timer
    if (currentConfidence < confidenceThreshold || currentState === 'UNKNOWN') {
      return;
    }

    // If state returns to FLOW, reset pending transition
    if (currentState === 'FLOW') {
      setActiveState('FLOW');
      setPendingState(null);
      setElapsedSustainedSeconds(0);
      stateStartTimeRef.current = null;
      dismissedStateRef.current = null; // Re-arm once learner returns to Flow
      return;
    }

    // If already in this state or this state was dismissed in current cycle
    if (dismissedStateRef.current === currentState) {
      return;
    }

    // If this is a new candidate state (OVERLOAD or BOREDOM)
    if (currentState !== pendingState) {
      setPendingState(currentState);
      setElapsedSustainedSeconds(0);
      stateStartTimeRef.current = Date.now();
    }
  }, [currentState, currentConfidence, confidenceThreshold, pendingState]);

  // High-frequency 1-second interval timer for the 30-second sustained accumulation
  useEffect(() => {
    if (!pendingState || pendingState === 'FLOW' || activeRecommendation) {
      return;
    }

    const timer = setInterval(() => {
      // Handle tab visibility: pause timer if user switched browser tabs
      if (document.hidden) {
        return;
      }

      if (!stateStartTimeRef.current) {
        stateStartTimeRef.current = Date.now();
      }

      const elapsed = Math.floor((Date.now() - stateStartTimeRef.current) / 1000);
      setElapsedSustainedSeconds(elapsed);

      // Check if the 30-second invariant has been fulfilled!
      if (elapsed >= sustainedThresholdSeconds) {
        const targetTier = computeTargetTier(pendingState, currentTier);

        if (targetTier && targetTier !== currentTier) {
          const reason =
            pendingState === 'OVERLOAD'
              ? `High cognitive load detected continuously for ${sustainedThresholdSeconds}s. Stepping down to Tier ${targetTier} will simplify foundational intuition.`
              : `Consistent material mastery and low cognitive challenge detected for ${sustainedThresholdSeconds}s. Escalating to Tier ${targetTier} will deepen intellectual depth.`;

          const recommendation: AdaptationRecommendation = {
            id: `adapt-${Date.now()}`,
            suggestedTier: targetTier,
            previousTier: currentTier,
            targetState: pendingState,
            sustainedDurationSeconds: sustainedThresholdSeconds,
            confidence: currentConfidence,
            reason,
            timestamp: new Date().toISOString(),
          };

          setActiveState(pendingState);
          setActiveRecommendation(recommendation);
          if (onAdaptationProposed) {
            onAdaptationProposed(recommendation);
          }
        }

        // Reset timer accumulation once proposed
        setElapsedSustainedSeconds(0);
        stateStartTimeRef.current = null;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [
    pendingState,
    currentTier,
    currentConfidence,
    sustainedThresholdSeconds,
    activeRecommendation,
    computeTargetTier,
    onAdaptationProposed,
  ]);

  const acceptRecommendation = useCallback((): PedagogicalTier | null => {
    if (!activeRecommendation) return null;
    const target = activeRecommendation.suggestedTier;
    setActiveRecommendation(null);
    setPendingState(null);
    setElapsedSustainedSeconds(0);
    stateStartTimeRef.current = null;
    return target;
  }, [activeRecommendation]);

  const dismissRecommendation = useCallback(() => {
    if (activeRecommendation) {
      dismissedStateRef.current = activeRecommendation.targetState;
    }
    setActiveRecommendation(null);
    setPendingState(null);
    setElapsedSustainedSeconds(0);
    stateStartTimeRef.current = null;
  }, [activeRecommendation]);

  const resetInvariant = useCallback(() => {
    setActiveState('FLOW');
    setPendingState(null);
    setElapsedSustainedSeconds(0);
    setActiveRecommendation(null);
    dismissedStateRef.current = null;
    stateStartTimeRef.current = null;
  }, []);

  const progressPercentage = Math.min(
    100,
    Math.round((elapsedSustainedSeconds / sustainedThresholdSeconds) * 100)
  );

  return {
    activeState,
    pendingState,
    elapsedSustainedSeconds,
    sustainedThresholdSeconds,
    progressPercentage,
    activeRecommendation,
    acceptRecommendation,
    dismissRecommendation,
    resetInvariant,
  };
}

