import { Router } from 'express';
import { documentsController, uploadMiddleware } from './documents.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post(
  '/upload',
  uploadMiddleware.single('file'),
  documentsController.uploadDocument.bind(documentsController)
);

router.get('/', documentsController.listDocuments.bind(documentsController));
router.get('/:documentId', documentsController.getDocument.bind(documentsController));
router.delete('/:documentId', documentsController.deleteDocument.bind(documentsController));

export const documentsRoutes = router;

