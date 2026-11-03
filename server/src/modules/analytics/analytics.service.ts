import {
  LearningSessionModel,
  TopicProgressModel,
  AssessmentAttemptModel,
  CognitiveEventModel,
  AdaptationEventModel,
  TopicModel,
} from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export class AnalyticsService {
  async getOverview(userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      const sessions = inMemoryStore.learningSessions.find((s) => s.userId === userId);
      const progresses = inMemoryStore.topicProgress.find((p) => p.userId === userId);
      const attempts = inMemoryStore.assessmentAttempts.find((a) => a.userId === userId);
      const cogEvents = inMemoryStore.cognitiveEvents.find((e) => e.userId === userId);
      const adaptations = inMemoryStore.adaptationEvents.find((a) => a.userId === userId);

      const totalActiveSeconds = sessions.reduce((acc: number, s: any) => acc + (s.activeDurationSeconds || 0), 0);
      const masteredCount = progresses.filter((p: any) => p.isMastered || p.masteryLevel >= 80).length;

      const avgScore =
        attempts.length > 0
          ? Math.round(attempts.reduce((acc: number, a: any) => acc + a.percentage, 0) / attempts.length)
          : 0;

      // Cognitive distribution
      let flowSeconds = 0;
      let overloadSeconds = 0;
      let boredomSeconds = 0;
      let unknownSeconds = 0;

      for (const ev of cogEvents) {
        if (ev.state === 'FLOW') flowSeconds += 5;
        else if (ev.state === 'OVERLOAD') overloadSeconds += 5;
        else if (ev.state === 'BOREDOM') boredomSeconds += 5;
        else unknownSeconds += 5;
      }

      // Tier distribution (rough estimate from sessions)
      let bMin = 0;
      let aMin = 0;
      let sMin = 0;
      for (const s of sessions) {
        const mins = Math.round((s.activeDurationSeconds || 0) / 60);
        if (s.currentTier === 'B') bMin += mins;
        else if (s.currentTier === 'S') sMin += mins;
        else aMin += mins;
      }

      const recentSessions = sessions.slice(0, 5).map((s) => {
        const topic = inMemoryStore.topics.findById(s.topicId);
        return {
          id: s.id,
          userId: s.userId,
          topicId: s.topicId,
          topicTitle: topic ? topic.title : 'Concept Study',
          subjectTitle: 'Computer Science',
          currentTier: s.currentTier,
          currentMode: s.currentMode,
          activeDurationSeconds: s.activeDurationSeconds || 0,
          startedAt: s.startedAt ? s.startedAt.toISOString() : new Date().toISOString(),
          lastActiveAt: s.lastActiveAt ? s.lastActiveAt.toISOString() : new Date().toISOString(),
          isCompleted: Boolean(s.isCompleted),
        };
      });

      return {
        totalLearningTimeMinutes: Math.round(totalActiveSeconds / 60),
        sessionsCompletedCount: sessions.filter((s) => s.isCompleted).length,
        topicsMasteredCount: masteredCount,
        averageAssessmentScore: avgScore,
        currentStreakDays: sessions.length > 0 ? 1 : 0,
        cognitiveDistribution: {
          flowSeconds,
          overloadSeconds,
          boredomSeconds,
          unknownSeconds,
        },
        tierDistribution: {
          bTierMinutes: bMin,
          aTierMinutes: aMin,
          sTierMinutes: sMin,
        },
        recentSessions,
        recentAdaptations: adaptations.slice(-5).map((a) => ({
          topicTitle: 'Concept Adaptive Transition',
          fromTier: a.previousTier,
          toTier: a.resultingTier,
          reason: a.triggerReason,
          timestamp: a.timestamp.toISOString(),
        })),
      };
    }

    // MongoDB aggregation
    const sessions = await LearningSessionModel.find({ userId }).sort({ lastActiveAt: -1 });
    const progresses = await TopicProgressModel.find({ userId });
    const attempts = await AssessmentAttemptModel.find({ userId });
    const cogEvents = await CognitiveEventModel.find({ userId }).limit(300);
    const adaptations = await AdaptationEventModel.find({ userId }).sort({ timestamp: -1 }).limit(10);

    const totalActiveSeconds = sessions.reduce((acc: number, s: any) => acc + (s.activeDurationSeconds || 0), 0);
    const masteredCount = progresses.filter((p: any) => p.isMastered || p.masteryLevel >= 80).length;

    const avgScore =
      attempts.length > 0
        ? Math.round(attempts.reduce((acc: number, a: any) => acc + a.percentage, 0) / attempts.length)
        : 0;

    let flowSeconds = 0;
    let overloadSeconds = 0;
    let boredomSeconds = 0;
    let unknownSeconds = 0;

    for (const ev of cogEvents) {
      if (ev.state === 'FLOW') flowSeconds += 5;
      else if (ev.state === 'OVERLOAD') overloadSeconds += 5;
      else if (ev.state === 'BOREDOM') boredomSeconds += 5;
      else unknownSeconds += 5;
    }

    let bMin = 0;
    let aMin = 0;
    let sMin = 0;
    for (const s of sessions) {
      const mins = Math.round(((s as any).activeDurationSeconds || 0) / 60);
      if (s.currentTier === 'B') bMin += mins;
      else if (s.currentTier === 'S') sMin += mins;
      else aMin += mins;
    }

    const recentSessions = await Promise.all(
      sessions.slice(0, 5).map(async (s: any) => {
        const topic = await TopicModel.findById(s.topicId);
        return {
          id: s._id.toString(),
          userId: s.userId.toString(),
          topicId: s.topicId.toString(),
          topicTitle: topic ? topic.title : 'Concept Study',
          subjectTitle: 'Computer Science',
          currentTier: s.currentTier,
          currentMode: s.currentMode,
          activeDurationSeconds: s.activeDurationSeconds || 0,
          startedAt: s.startedAt.toISOString(),
          lastActiveAt: s.lastActiveAt.toISOString(),
          isCompleted: s.isCompleted,
        };
      })
    );

    return {
      totalLearningTimeMinutes: Math.round(totalActiveSeconds / 60),
      sessionsCompletedCount: sessions.filter((s: any) => s.isCompleted).length,
      topicsMasteredCount: masteredCount,
      averageAssessmentScore: avgScore,
      currentStreakDays: sessions.length > 0 ? 1 : 0,
      cognitiveDistribution: {
        flowSeconds,
        overloadSeconds,
        boredomSeconds,
        unknownSeconds,
      },
      tierDistribution: {
        bTierMinutes: bMin,
        aTierMinutes: aMin,
        sTierMinutes: sMin,
      },
      recentSessions,
      recentAdaptations: adaptations.map((a: any) => ({
        topicTitle: 'Concept Adaptive Transition',
        fromTier: a.previousTier,
        toTier: a.resultingTier,
        reason: a.triggerReason,
        timestamp: a.timestamp.toISOString(),
      })),
    };
  }
}

export const analyticsService = new AnalyticsService();
