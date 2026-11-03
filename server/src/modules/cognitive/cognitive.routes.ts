import { Router } from 'express';
import { cognitiveController } from './cognitive.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validateRequest.js';
import {
  CognitiveEventSubmissionSchema,
  AdaptationEventSubmissionSchema,
} from '@cogflow/shared';

const router = Router();

router.get('/status', cognitiveController.getStatus.bind(cognitiveController));

router.use(requireAuth);

router.post(
  '/events',
  validateBody(CognitiveEventSubmissionSchema),
  cognitiveController.recordEvent.bind(cognitiveController)
);

router.post(
  '/adaptations',
  validateBody(AdaptationEventSubmissionSchema),
  cognitiveController.recordAdaptation.bind(cognitiveController)
);

router.get('/sessions/:sessionId', cognitiveController.getSessionEvents.bind(cognitiveController));

export const cognitiveRoutes = router;
