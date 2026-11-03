import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/providers/status', aiController.getProvidersStatus.bind(aiController));
router.post('/providers/groq', aiController.configureGroq.bind(aiController));
router.get('/diagnostics', aiController.runDiagnostics.bind(aiController));

router.use(requireAuth);

router.post('/chat/stream', aiController.streamChat.bind(aiController));
router.post('/questions/answer', aiController.askQuestion.bind(aiController));

export const aiRoutes = router;

