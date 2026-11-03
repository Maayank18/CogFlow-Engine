import { describe, it, expect } from 'vitest';
import { DevelopmentMockProvider } from '../features/cognitive/DevelopmentMockProvider';
import { ExternalModelAdapter } from '../features/cognitive/ExternalModelAdapter';

describe('Cognitive Telemetry Provider Contracts', () => {
  it('DevelopmentMockProvider emits FLOW state under natural_flow scenario', async () => {
    const provider = new DevelopmentMockProvider();
    await provider.initialize();

    provider.setScenario('natural_flow');
    const res = await provider.infer({ timestamp: Date.now() });

    expect(res.state).toBe('FLOW');
    expect(res.confidence).toBeGreaterThanOrEqual(0.8);
    expect(res.source).toBe('mock');
  });

  it('DevelopmentMockProvider emits OVERLOAD and BOREDOM when instructed', async () => {
    const provider = new DevelopmentMockProvider();
    await provider.initialize();

    provider.setScenario('sustained_overload');
    const overloadRes = await provider.infer({ timestamp: Date.now() });
    expect(overloadRes.state).toBe('OVERLOAD');
    expect(overloadRes.confidence).toBeGreaterThan(0.7);

    provider.setScenario('sustained_boredom');
    const boredomRes = await provider.infer({ timestamp: Date.now() });
    expect(boredomRes.state).toBe('BOREDOM');
  });

  it('ExternalModelAdapter validates boundaries and reports unavailable when runtime is missing', async () => {
    const adapter = new ExternalModelAdapter();
    await adapter.initialize();

    const isAvail = await adapter.isAvailable();
    expect(isAvail).toBe(false);

    // Should return fallback UNKNOWN safely without crashing
    const res = await adapter.infer({ timestamp: Date.now() });
    expect(res.state).toBe('UNKNOWN');
    expect(res.confidence).toBe(0);
    expect(res.source).toBe('rule_fallback');
  });
});

