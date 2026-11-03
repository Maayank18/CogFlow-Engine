import { Request, Response, NextFunction } from 'express';
import { cognitiveService } from './cognitive.service.js';

export class CognitiveController {
  getStatus(req: Request, res: Response): void {
    res.json({
      success: true,
      data: cognitiveService.getStatus(),
    });
  }

  async recordEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await cognitiveService.recordEvent({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  async recordAdaptation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await cognitiveService.recordAdaptation({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json({
        success: true,
        data: record,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSessionEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const events = await cognitiveService.getSessionEvents(req.params.sessionId, req.user!.userId);
      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cognitiveController = new CognitiveController();
