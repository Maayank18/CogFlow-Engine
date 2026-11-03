import { Router } from 'express';
import { authController } from './auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { authRateLimiter } from '../../middleware/rateLimiter.js';
import { validateBody } from '../../middleware/validateRequest.js';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  ForgotPasswordRequestSchema,
  ResetPasswordRequestSchema,
} from '@cogflow/shared';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validateBody(RegisterRequestSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authRateLimiter,
  validateBody(LoginRequestSchema),
  authController.login.bind(authController)
);

router.post('/logout', authController.logout.bind(authController));

router.get('/me', requireAuth, authController.getMe.bind(authController));

router.post(
  '/forgot-password',
  authRateLimiter,
  validateBody(ForgotPasswordRequestSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  '/reset-password',
  authRateLimiter,
  validateBody(ResetPasswordRequestSchema),
  authController.resetPassword.bind(authController)
);

export const authRoutes = router;
