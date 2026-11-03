import { Request, Response, NextFunction } from 'express';
import { assessmentsService } from './assessments.service.js';

export class AssessmentsController {
  async getAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const tier = (req.query.tier as 'B' | 'A' | 'S') || 'A';
      const assessment = await assessmentsService.getAssessmentForTopic(topicId, tier);
      res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitAttempt(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const { tier, answers } = req.body;

      const result = await assessmentsService.submitAttempt({
        userId: req.user!.userId,
        topicId,
        tier: tier || 'A',
        answers,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async listAttempts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.query as { topicId?: string };
      const attempts = await assessmentsService.listAttempts(req.user!.userId, topicId);
      res.json({
        success: true,
        data: attempts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const assessmentsController = new AssessmentsController();

