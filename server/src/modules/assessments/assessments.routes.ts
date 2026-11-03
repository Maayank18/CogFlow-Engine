import { Router } from 'express';
import { assessmentsController } from './assessments.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/topics/:topicId', assessmentsController.getAssessment.bind(assessmentsController));
router.post('/topics/:topicId/submit', assessmentsController.submitAttempt.bind(assessmentsController));
router.get('/attempts', assessmentsController.listAttempts.bind(assessmentsController));

export const assessmentsRoutes = router;
