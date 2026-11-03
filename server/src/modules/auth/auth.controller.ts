import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      
      // Set secure cookie as well as returning JSON
      res.cookie('cogflow_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);

      res.cookie('cogflow_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('cogflow_token');
    res.status(200).json({
      success: true,
      data: { message: 'Successfully signed out.' },
    });
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const me = await authService.getMe(req.user.userId);
      res.status(200).json({
        success: true,
        data: me,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resetToken = await authService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        data: {
          message: 'If an account exists with this email, a reset token has been generated.',
          simulationToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await authService.resetPassword(req.body.token, req.body.newPassword);
      res.status(200).json({
        success,
        data: { message: 'Password has been updated successfully.' },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();

