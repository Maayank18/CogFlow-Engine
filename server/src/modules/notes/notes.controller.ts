import { Request, Response, NextFunction } from 'express';
import { notesService } from './notes.service.js';

export class NotesController {
  async listNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topicId } = req.query as { topicId?: string };
      const notes = await notesService.listNotes(req.user!.userId, topicId);
      res.json({
        success: true,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  }

  async createNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const note = await notesService.createNote({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await notesService.updateNote(req.params.noteId, req.user!.userId, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Note not found.' } });
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

  async deleteNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await notesService.deleteNote(req.params.noteId, req.user!.userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Note not found.' } });
        return;
      }
      res.json({
        success: true,
        data: { message: 'Note deleted successfully.' },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notesController = new NotesController();
