import { LearningNoteModel } from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';

export class NotesService {
  async listNotes(userId: string, topicId?: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return inMemoryStore.learningNotes
        .find((n) => n.userId === userId && (!topicId || n.topicId === topicId))
        .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }

    const filter: Record<string, unknown> = { userId };
    if (topicId) filter.topicId = topicId;

    return LearningNoteModel.find(filter).sort({ pinned: -1, createdAt: -1 });
  }

  async createNote(params: {
    userId: string;
    topicId: string;
    title: string;
    content: string;
    type?: 'definition' | 'formula' | 'pitfall' | 'flashcard' | 'custom';
    tags?: string[];
  }) {
    const { isInMemoryMode } = getDatabaseStatus();

    const note = {
      userId: params.userId,
      topicId: params.topicId,
      title: params.title,
      content: params.content,
      type: params.type || 'custom',
      tags: params.tags || [],
      pinned: false,
    };

    if (isInMemoryMode) {
      return inMemoryStore.learningNotes.create(note);
    }
    return LearningNoteModel.create(note);
  }

  async updateNote(noteId: string, userId: string, updates: Record<string, unknown>) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      const existing = inMemoryStore.learningNotes.findById(noteId);
      if (!existing || existing.userId !== userId) return null;
      return inMemoryStore.learningNotes.findByIdAndUpdate(noteId, updates);
    }

    return LearningNoteModel.findOneAndUpdate({ _id: noteId, userId }, { $set: updates }, { new: true });
  }

  async deleteNote(noteId: string, userId: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      const existing = inMemoryStore.learningNotes.findById(noteId);
      if (!existing || existing.userId !== userId) return false;
      return inMemoryStore.learningNotes.deleteOne(noteId);
    }

    const result = await LearningNoteModel.deleteOne({ _id: noteId, userId });
    return result.deletedCount > 0;
  }
}

export const notesService = new NotesService();

