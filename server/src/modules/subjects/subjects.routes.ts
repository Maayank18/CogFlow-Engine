import { Router } from 'express';
import { subjectsController } from './subjects.controller.js';

const router = Router();

router.get('/', subjectsController.listSubjects.bind(subjectsController));
router.get('/:subjectId', subjectsController.getSubject.bind(subjectsController));
router.get('/:subjectId/topics', subjectsController.listTopics.bind(subjectsController));
router.get('/topics/:topicId', subjectsController.getTopic.bind(subjectsController));

export const subjectsRoutes = router;

