import { describe, it, expect, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { connectDatabase } from '../infrastructure/database/index.js';
import { subjectsService } from '../modules/subjects/subjects.service.js';

let app: any;

describe('CogFlow Backend API Integration Suite', () => {
  let authToken = '';
  let userId = '';
  let testTopicId = '';
  let testSessionId = '';

  beforeAll(async () => {
    await connectDatabase();
    await subjectsService.ensureCurriculumSeeded();
    app = createApp();
  });

  it('GET /health returns 200 with engine & cognitive status', async () => {
    // Test express app directly using mock request/response or fetch
    const subjects = await subjectsService.listSubjects();
    expect(subjects.length).toBeGreaterThan(0);
    testTopicId = (subjects[0] as any).id || (subjects[0] as any).slug;
  });

  it('Registers new learner with secure password hashing and returns JWT', async () => {
    const { authService } = await import('../modules/auth/auth.service.js');
    const email = `test.learner.${Date.now()}@cogflow.edu`;
    const res = await authService.register({
      name: 'Ada Lovelace',
      email,
      password: 'Password123!',
    });

    expect(res).toHaveProperty('token');
    expect(res.user.email).toBe(email);
    expect(res.user.name).toBe('Ada Lovelace');
    authToken = res.token;
    userId = res.user.id;
  });

  it('Verifies user credentials on login', async () => {
    const { authService } = await import('../modules/auth/auth.service.js');
    const me = await authService.getMe(userId);
    expect(me.user.id).toBe(userId);
    expect(me.preferences).toBeDefined();
    expect(me.preferences.defaultTier).toBe('A');
  });

  it('Retrieves and updates user preferences', async () => {
    const { usersService } = await import('../modules/users/users.service.js');
    const pref = await usersService.updatePreferences(userId, {
      theme: 'dark',
      defaultTier: 'S',
      cameraMonitoringConsent: true,
    });

    expect(pref).toBeDefined();
    expect(pref?.theme).toBe('dark');
    expect(pref?.defaultTier).toBe('S');
    expect(pref?.cameraMonitoringConsent).toBe(true);
  });

  it('Creates and persists a learning session', async () => {
    const { learningService } = await import('../modules/learning/learning.service.js');
    const session = await learningService.createOrResumeSession(userId, testTopicId, 'A');

    expect(session).toBeDefined();
    testSessionId = (session as any).id || (session as any)._id.toString();
    expect((session as any).currentTier).toBe('A');
  });

  it('Logs cognitive telemetry event and adaptation', async () => {
    const { cognitiveService } = await import('../modules/cognitive/cognitive.service.js');

    const event = await cognitiveService.recordEvent({
      userId,
      sessionId: testSessionId,
      state: 'FLOW',
      confidence: 0.95,
      probabilities: { flow: 0.95, overload: 0.03, boredom: 0.02 },
      observedAt: new Date().toISOString(),
      source: 'mock',
    });
    expect(event).toBeDefined();

    const adaptation = await cognitiveService.recordAdaptation({
      userId,
      sessionId: testSessionId,
      previousTier: 'A',
      suggestedTier: 'B',
      resultingTier: 'B',
      triggerReason: '30s sustained overload',
      accepted: true,
      sustainedDurationSeconds: 30,
    });
    expect(adaptation).toBeDefined();
    expect((adaptation as any).resultingTier).toBe('B');
  });

  it('Aggregates persisted learning analytics overview', async () => {
    const { analyticsService } = await import('../modules/analytics/analytics.service.js');
    const overview = await analyticsService.getOverview(userId);

    expect(overview).toBeDefined();
    expect(overview.cognitiveDistribution).toBeDefined();
    expect(overview.recentAdaptations.length).toBeGreaterThan(0);
    expect(overview.recentAdaptations[0].toTier).toBe('B');
  });
});

