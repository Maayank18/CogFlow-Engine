import { Router } from 'express';
import { learningController } from './learning.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validateRequest.js';
import { CreateLearningSessionSchema, UpdateLearningSessionSchema } from '@cogflow/shared';

const router = Router();

router.use(requireAuth);

router.post(
  '/sessions',
  validateBody(CreateLearningSessionSchema),
  learningController.createSession.bind(learningController)
);

router.get('/sessions', learningController.listSessions.bind(learningController));
router.get('/sessions/:sessionId', learningController.getSession.bind(learningController));
router.patch(
  '/sessions/:sessionId',
  validateBody(UpdateLearningSessionSchema),
  learningController.updateSession.bind(learningController)
);

router.get('/topics/:topicId/lesson', learningController.getLesson.bind(learningController));
router.post('/topics/:topicId/adapt', learningController.adaptTier.bind(learningController));

export const learningRoutes = router;

