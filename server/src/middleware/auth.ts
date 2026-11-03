import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'learner' | 'educator' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const DEV_DEFAULT_USER: AuthUser = {
  userId: 'usr_dev_learner_001',
  email: 'learner@cogflow.ai',
  role: 'learner',
};

/**
 * Authentication Middleware with Development Bypass
 * Allows full direct access to all learning and API features without an auth barrier.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && req.cookies.cogflow_token) {
      token = req.cookies.cogflow_token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.security.jwtSecret) as AuthUser;
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        };
        return next();
      } catch {
        // Fall back to DEV_DEFAULT_USER
      }
    }

    // Default Dev Bypass
    req.user = DEV_DEFAULT_USER;
    next();
  } catch (error) {
    req.user = DEV_DEFAULT_USER;
    next();
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction): void {
  req.user = DEV_DEFAULT_USER;
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else if (req.cookies && req.cookies.cogflow_token) {
      token = req.cookies.cogflow_token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.security.jwtSecret) as AuthUser;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch {
    // Retain DEV_DEFAULT_USER
  }
  next();
}
