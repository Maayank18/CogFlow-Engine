import {
  CognitiveInferenceProvider,
  CognitiveInferenceInput,
  CognitiveInferenceResult,
  CognitiveState,
} from '@cogflow/shared';

export type SimulationScenario = 'natural_flow' | 'sustained_overload' | 'sustained_boredom' | 'jitter_fluctuating';

export class DevelopmentMockProvider implements CognitiveInferenceProvider {
  public readonly id = 'mock';
  public readonly name = 'Development Cognitive Simulator [SIMULATION ONLY]';
  private scenario: SimulationScenario = 'natural_flow';
  private initialized = false;

  public setScenario(scenario: SimulationScenario) {
    this.scenario = scenario;
    console.info(`[CognitiveSimulator] Scenario switched to: ${scenario}`);
  }

  public getScenario(): SimulationScenario {
    return this.scenario;
  }

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async infer(input: CognitiveInferenceInput): Promise<CognitiveInferenceResult> {
    const now = new Date().toISOString();

    switch (this.scenario) {
      case 'sustained_overload':
        return {
          state: 'OVERLOAD',
          confidence: 0.88,
          probabilities: { flow: 0.08, overload: 0.88, boredom: 0.04 },
          modelVersion: 'sim-overload-v1',
          observedAt: now,
          source: 'mock',
        };

      case 'sustained_boredom':
        return {
          state: 'BOREDOM',
          confidence: 0.84,
          probabilities: { flow: 0.1, overload: 0.06, boredom: 0.84 },
          modelVersion: 'sim-boredom-v1',
          observedAt: now,
          source: 'mock',
        };

      case 'jitter_fluctuating': {
        // Alternates between FLOW and OVERLOAD every 5 seconds to test that momentary dips do NOT trigger 30s threshold
        const epochSeconds = Math.floor(Date.now() / 5000);
        const isJitterOverload = epochSeconds % 2 === 0;
        return {
          state: isJitterOverload ? 'OVERLOAD' : 'FLOW',
          confidence: 0.72,
          probabilities: isJitterOverload
            ? { flow: 0.25, overload: 0.72, boredom: 0.03 }
            : { flow: 0.8, overload: 0.15, boredom: 0.05 },
          modelVersion: 'sim-jitter-v1',
          observedAt: now,
          source: 'mock',
        };
      }

      case 'natural_flow':
      default:
        return {
          state: 'FLOW',
          confidence: 0.92,
          probabilities: { flow: 0.92, overload: 0.05, boredom: 0.03 },
          modelVersion: 'sim-flow-v1',
          observedAt: now,
          source: 'mock',
        };
    }
  }

  async dispose(): Promise<void> {
    this.initialized = false;
  }
}

export const developmentMockProvider = new DevelopmentMockProvider();
