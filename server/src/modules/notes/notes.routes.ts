import { Router } from 'express';
import { notesController } from './notes.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', notesController.listNotes.bind(notesController));
router.post('/', notesController.createNote.bind(notesController));
router.patch('/:noteId', notesController.updateNote.bind(notesController));
router.delete('/:noteId', notesController.deleteNote.bind(notesController));

export const notesRoutes = router;

