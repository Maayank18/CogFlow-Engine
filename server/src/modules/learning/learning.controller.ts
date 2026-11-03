import { Request, Response, NextFunction } from 'express';
import { learningService } from './learning.service.js';

export class LearningController {
  async createSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId, initialTier, initialMode } = req.body;
      const session = await learningService.createOrResumeSession(
        req.user!.userId,
        topicId,
        initialTier,
        initialMode
      );
      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  async listSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessions = await learningService.listUserSessions(req.user!.userId);
      res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const session = await learningService.getSession(req.params.sessionId, req.user!.userId);
      if (!session) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Session not found.' } });
        return;
      }
      res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await learningService.updateSession(
        req.params.sessionId,
        req.user!.userId,
        req.body
      );
      if (!updated) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Session not found.' } });
        return;
      }
      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLesson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const tier = (req.query.tier as 'B' | 'A' | 'S') || 'A';
      const forceRefresh = req.query.forceRefresh === 'true';

      const lesson = await learningService.getLessonForTopic(topicId, tier, forceRefresh);
      res.json({
        success: true,
        data: lesson,
      });
    } catch (error) {
      next(error);
    }
  }

  async adaptTier(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const { targetTier } = req.body as { targetTier: 'B' | 'A' | 'S' };

      const adaptedLesson = await learningService.getLessonForTopic(topicId, targetTier, false);
      res.json({
        success: true,
        data: adaptedLesson,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const learningController = new LearningController();

