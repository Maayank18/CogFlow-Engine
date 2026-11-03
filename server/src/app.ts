import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getDatabaseStatus } from './infrastructure/database/index.js';

import { authRoutes } from './modules/auth/auth.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { subjectsRoutes } from './modules/subjects/subjects.routes.js';
import { learningRoutes } from './modules/learning/learning.routes.js';
import { documentsRoutes } from './modules/documents/documents.routes.js';
import { assessmentsRoutes } from './modules/assessments/assessments.routes.js';
import { cognitiveRoutes } from './modules/cognitive/cognitive.routes.js';
import { notesRoutes } from './modules/notes/notes.routes.js';
import { analyticsRoutes } from './modules/analytics/analytics.routes.js';
import { aiRoutes } from './modules/ai/ai.routes.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Allows Vite local dev and cross-origin images/avatars
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configuration
  app.use(
    cors({
      origin: [config.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(cookieParser(config.security.cookieSecret));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  if (config.env !== 'test') {
    app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  }

  // Rate limiting for API
  app.use('/api', apiRateLimiter);

  // Health and readiness checks
  app.get('/health', (_req: Request, res: Response) => {
    const db = getDatabaseStatus();
    res.json({
      status: 'healthy',
      app: 'CogFlow Adaptive Intelligence Server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        connected: db.isConnected,
        inMemoryFallbackActive: db.isInMemoryMode,
      },
      cognitiveEngine: {
        provider: config.cognitive.provider,
        simulationActive: config.cognitive.enableSimulation,
      },
    });
  });

  app.get('/api/v1/health', (_req: Request, res: Response) => {
    const db = getDatabaseStatus();
    res.json({
      status: 'healthy',
      database: db,
    });
  });

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', usersRoutes);
  app.use('/api/v1/subjects', subjectsRoutes);
  app.use('/api/v1/learning', learningRoutes);
  app.use('/api/v1/documents', documentsRoutes);
  app.use('/api/v1/assessments', assessmentsRoutes);
  app.use('/api/v1/cognitive', cognitiveRoutes);
  app.use('/api/v1/notes', notesRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/ai', aiRoutes);

  // 404 handler for undefined API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
      },
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}

