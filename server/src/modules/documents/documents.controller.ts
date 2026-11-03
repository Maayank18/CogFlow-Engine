import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../../config/index.js';
import { documentsService } from './documents.service.js';

// Ensure upload directory exists
if (!fs.existsSync(config.uploads.uploadDir)) {
  fs.mkdirSync(config.uploads.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, config.uploads.uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: config.uploads.maxSizeBytes },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.txt', '.md'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext) || file.mimetype === 'application/pdf' || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Markdown, and text files are supported for syllabus ingestion.'));
    }
  },
});

export class DocumentsController {
  async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: { code: 'NO_FILE', message: 'No file was provided.' } });
        return;
      }

      const doc = await documentsService.processUploadedFile({
        userId: req.user!.userId,
        filePath: req.file.path,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        fileSizeBytes: req.file.size,
      });

      res.status(201).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  async listDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const docs = await documentsService.listDocuments(req.user!.userId);
      res.json({
        success: true,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doc = await documentsService.getDocument(req.params.documentId, req.user!.userId);
      if (!doc) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found.' } });
        return;
      }
      res.json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleted = await documentsService.deleteDocument(req.params.documentId, req.user!.userId);
      if (!deleted) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Document not found.' } });
        return;
      }
      res.json({
        success: true,
        data: { message: 'Document deleted successfully.' },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const documentsController = new DocumentsController();
