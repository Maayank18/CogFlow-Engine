import { Router } from 'express';
import { usersController } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validateRequest.js';
import { UserPreferencesSchema } from '@cogflow/shared';

const router = Router();

router.use(requireAuth);

router.get('/me', usersController.getMe.bind(usersController));
router.patch('/me', usersController.updateMe.bind(usersController));

router.get('/me/preferences', usersController.getPreferences.bind(usersController));
router.patch(
  '/me/preferences',
  validateBody(UserPreferencesSchema.partial()),
  usersController.updatePreferences.bind(usersController)
);

export const usersRoutes = router;
