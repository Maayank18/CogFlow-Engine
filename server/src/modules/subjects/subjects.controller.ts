import { Request, Response, NextFunction } from 'express';
import { subjectsService } from './subjects.service.js';

export class SubjectsController {
  async listSubjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search } = req.query as { category?: string; search?: string };
      const subjects = await subjectsService.listSubjects(category, search);
      res.json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId } = req.params;
      const subject = await subjectsService.getSubject(subjectId);
      if (!subject) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Subject not found.' } });
        return;
      }
      res.json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  async listTopics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { subjectId } = req.params;
      const topics = await subjectsService.listTopics(subjectId);
      res.json({
        success: true,
        data: topics,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.params;
      const topic = await subjectsService.getTopic(topicId);
      if (!topic) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Topic not found.' } });
        return;
      }
      res.json({
        success: true,
        data: topic,
      });
    } catch (error) {
      next(error);
    }
  }

  async createSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, category, description, icon } = req.body;
      if (!title || !title.trim()) {
        res.status(400).json({ success: false, error: { code: 'INVALID_TITLE', message: 'Subject title is required.' } });
        return;
      }
      const subject = await subjectsService.createSubject({ title, category, description, icon });
      res.status(201).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTopic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        title,
        subjectIdOrSlug,
        category,
        summary,
        difficultyBaseline,
        estimatedMinutes,
        learningObjectives,
      } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ success: false, error: { code: 'INVALID_TITLE', message: 'Topic title is required.' } });
        return;
      }

      const topic = await subjectsService.createTopic({
        title,
        subjectIdOrSlug,
        category,
        summary,
        difficultyBaseline,
        estimatedMinutes,
        learningObjectives,
      });

      res.status(201).json({
        success: true,
        data: topic,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subjectsController = new SubjectsController();

