import {
  CognitiveInferenceProvider,
  CognitiveInferenceInput,
  CognitiveInferenceResult,
  CognitiveState,
} from '@cogflow/shared';

/**
 * ExternalModelAdapter
 * Connects the external team's trained ML model to CogFlow through a strict boundary contract.
 * Normalizes state labels, validates confidence ranges, and prevents invalid output from entering the learning engine.
 */
export class ExternalModelAdapter implements CognitiveInferenceProvider {
  public readonly id = 'external_model';
  public readonly name = 'External Cognitive Classifier';
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    console.log('[ExternalModelAdapter] Initializing model runtime connection...');
    // When the external model binary or endpoint is integrated, initialization logic hooks here.
    this.isInitialized = true;
  }

  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    // Returns true only when external model weights or provider endpoint is verified
    return (window as any).__COGFLOW_EXTERNAL_MODEL_LOADED__ === true;
  }

  async infer(input: CognitiveInferenceInput): Promise<CognitiveInferenceResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (typeof window === 'undefined') {
        throw new Error('Inference cannot execute in non-browser environment.');
      }
      const externalRuntime = (window as any).__COGFLOW_MODEL_RUNTIME__;
      if (!externalRuntime || typeof externalRuntime.predict !== 'function') {
        throw new Error('External model runtime is not loaded in current environment.');
      }

      const rawOutput = await externalRuntime.predict(input);

      // Validate & normalize
      const state = this.normalizeState(rawOutput.state);
      const confidence = Math.min(1, Math.max(0, Number(rawOutput.confidence) || 0));

      return {
        state,
        confidence,
        probabilities: rawOutput.probabilities,
        modelVersion: rawOutput.modelVersion || 'v1.0-external',
        observedAt: new Date().toISOString(),
        source: 'external_model',
      };
    } catch (error) {
      console.warn('[ExternalModelAdapter] Inference execution failed:', error);
      return {
        state: 'UNKNOWN',
        confidence: 0,
        observedAt: new Date().toISOString(),
        source: 'rule_fallback',
      };
    }
  }

  async dispose(): Promise<void> {
    this.isInitialized = false;
    console.log('[ExternalModelAdapter] Disposed resources.');
  }

  private normalizeState(rawState: unknown): CognitiveState {
    const s = String(rawState).toUpperCase().trim();
    if (s.includes('FLOW') || s.includes('ENGAGED')) return 'FLOW';
    if (s.includes('OVERLOAD') || s.includes('CONFUS') || s.includes('FRUSTRAT')) return 'OVERLOAD';
    if (s.includes('BORED') || s.includes('DISTRACT')) return 'BOREDOM';
    return 'UNKNOWN';
  }
}
