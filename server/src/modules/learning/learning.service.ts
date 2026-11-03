import {
  LearningSessionModel,
  TopicModel,
  SubjectModel,
  LessonModel,
  TopicProgressModel,
} from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';
import { LLMOrchestrator } from '../../infrastructure/llm/LLMOrchestrator.js';
import { getDeterministicFallbackLesson } from '../../infrastructure/llm/deterministicFallback.js';
import { subjectsService } from '../subjects/subjects.service.js';
import { LessonContent } from '@cogflow/shared';

export class LearningService {
  private llmOrchestrator = LLMOrchestrator.getInstance();

  async createOrResumeSession(
    userId: string,
    topicId: string,
    initialTier: 'B' | 'A' | 'S' = 'A',
    initialMode: 'learn' | 'visualize' | 'code' | 'notes' | 'practice' = 'learn'
  ) {
    const { isInMemoryMode } = getDatabaseStatus();

    // Check for existing active session for this user and topic
    if (isInMemoryMode) {
      let session = inMemoryStore.learningSessions.findOne(
        (s) => s.userId === userId && s.topicId === topicId && !s.isCompleted
      );

      if (!session) {
        session = inMemoryStore.learningSessions.create({
          userId,
          topicId,
          currentTier: initialTier,
          currentMode: initialMode,
          activeDurationSeconds: 0,
          isCompleted: false,
          startedAt: new Date(),
          lastActiveAt: new Date(),
        });
      }
      return session;
    }

    let session = await LearningSessionModel.findOne({
      userId,
      topicId,
      isCompleted: false,
    }).sort({ lastActiveAt: -1 });

    if (!session) {
      session = await LearningSessionModel.create({
        userId,
        topicId,
        currentTier: initialTier,
        currentMode: initialMode,
        activeDurationSeconds: 0,
        isCompleted: false,
        startedAt: new Date(),
        lastActiveAt: new Date(),
      });
    }

    return session;
  }

  async getSession(sessionId: string, userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      const session = inMemoryStore.learningSessions.findById(sessionId);
      if (!session || session.userId !== userId) return null;
      return session;
    }

    return LearningSessionModel.findOne({ _id: sessionId, userId });
  }

  async listUserSessions(userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return inMemoryStore.learningSessions
        .find((s) => s.userId === userId)
        .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
    }

    return LearningSessionModel.find({ userId }).sort({ lastActiveAt: -1 }).limit(20);
  }

  async updateSession(
    sessionId: string,
    userId: string,
    updates: {
      currentTier?: 'B' | 'A' | 'S';
      currentMode?: 'learn' | 'visualize' | 'code' | 'notes' | 'practice';
      activeDurationIncrementSeconds?: number;
      isCompleted?: boolean;
    }
  ) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      const session = inMemoryStore.learningSessions.findById(sessionId);
      if (!session || session.userId !== userId) return null;

      const newDuration =
        (session.activeDurationSeconds || 0) + (updates.activeDurationIncrementSeconds || 0);

      return inMemoryStore.learningSessions.findByIdAndUpdate(sessionId, {
        currentTier: updates.currentTier || session.currentTier,
        currentMode: updates.currentMode || session.currentMode,
        activeDurationSeconds: newDuration,
        isCompleted: updates.isCompleted !== undefined ? updates.isCompleted : session.isCompleted,
        lastActiveAt: new Date(),
      });
    }

    const session = await LearningSessionModel.findOne({ _id: sessionId, userId });
    if (!session) return null;

    if (updates.currentTier) session.currentTier = updates.currentTier;
    if (updates.currentMode) session.currentMode = updates.currentMode;
    if (updates.activeDurationIncrementSeconds) {
      session.activeDurationSeconds += updates.activeDurationIncrementSeconds;
    }
    if (updates.isCompleted !== undefined) {
      session.isCompleted = updates.isCompleted;
      if (updates.isCompleted) session.endedAt = new Date();
    }
    session.lastActiveAt = new Date();

    await session.save();
    return session;
  }

  async getLessonForTopic(
    topicId: string,
    tier: 'B' | 'A' | 'S' = 'A',
    forceRefresh: boolean = false
  ): Promise<LessonContent> {
    await subjectsService.ensureCurriculumSeeded();
    const { isInMemoryMode } = getDatabaseStatus();

    // Find topic info
    let topic: any;
    let subject: any;

    if (isInMemoryMode) {
      topic =
        inMemoryStore.topics.findById(topicId) ||
        inMemoryStore.topics.findOne((t: any) => t.slug === topicId || t.id === topicId);
      if (topic) {
        subject = inMemoryStore.subjects.findById(topic.subjectId);
      }
    } else {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(topicId);
      topic = isMongoId
        ? await TopicModel.findById(topicId)
        : await TopicModel.findOne({ $or: [{ slug: topicId }, { _id: topicId }] });
      if (topic) {
        subject = await SubjectModel.findById(topic.subjectId);
      }
    }

    const topicTitle =
      topic?.title ||
      (topicId.includes('-')
        ? topicId
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        : 'Concept Mastery');
    const subjectTitle = subject?.title || 'Computer Science & Distributed Systems';
    const effectiveTopicId = topic ? (topic.id || topic._id).toString() : topicId;

    // Check if lesson exists in cache/database
    if (!forceRefresh) {
      if (isInMemoryMode) {
        const cached = inMemoryStore.lessons.findOne(
          (l) => (l.topicId === effectiveTopicId || l.topicTitle === topicTitle) && l.tier === tier
        );
        if (cached) return cached;
      } else {
        const cached = await LessonModel.findOne({
          $or: [{ topicId: effectiveTopicId }, { topicTitle }],
          tier,
        });
        if (cached) {
          return {
            id: cached._id.toString(),
            topicId: effectiveTopicId,
            topicTitle,
            subjectTitle,
            tier: cached.tier,
            summary: cached.summary,
            learningObjectives: cached.learningObjectives,
            sections: cached.sections,
            visualDiagram: cached.visualDiagram,
            codeExample: cached.codeExample,
            revisionNotes: cached.revisionNotes,
            practiceQuestions: cached.practiceQuestions,
            createdAt: cached.createdAt.toISOString(),
            updatedAt: cached.updatedAt.toISOString(),
          };
        }
      }
    }

    // Race dynamic generation against responsive 16-second threshold so browser never hangs
    const timeoutPromise = new Promise<LessonContent>((resolve) => {
      setTimeout(() => {
        console.log(
          `[LearningService] Responsive threshold (16s) reached for "${topicTitle}". Serving structured deterministic lesson.`
        );
        resolve(
          getDeterministicFallbackLesson({
            topicId: effectiveTopicId,
            topicTitle,
            subjectTitle,
            tier,
          })
        );
      }, 16000);
    });

    const generated = await Promise.race([
      this.llmOrchestrator.generateLesson({
        topicId: effectiveTopicId,
        topicTitle,
        subjectTitle,
        tier,
        summary: topic?.summary,
        learningObjectives: topic?.learningObjectives,
      }),
      timeoutPromise,
    ]);

    // Save to database
    if (isInMemoryMode) {
      inMemoryStore.lessons.create(generated as any);
    } else {
      await LessonModel.findOneAndUpdate(
        { topicId: effectiveTopicId, tier },
        { $set: generated },
        { upsert: true, new: true }
      );
    }

    return generated;
  }
}

export const learningService = new LearningService();
