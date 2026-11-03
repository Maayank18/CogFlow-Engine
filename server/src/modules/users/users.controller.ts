import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service.js';

export class UsersController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const preferences = await usersService.getPreferences(req.user!.userId);
      res.json({
        success: true,
        data: {
          user: req.user,
          preferences,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await usersService.updateProfile(req.user!.userId, req.body);
      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const preferences = await usersService.getPreferences(req.user!.userId);
      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await usersService.updatePreferences(req.user!.userId, req.body);
      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();

