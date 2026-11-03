import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningNote extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  type: 'definition' | 'formula' | 'pitfall' | 'flashcard' | 'custom';
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningNoteSchema = new Schema<ILearningNote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['definition', 'formula', 'pitfall', 'flashcard', 'custom'],
      default: 'custom',
    },
    tags: {
      type: [String],
      default: [],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

LearningNoteSchema.index({ userId: 1, topicId: 1 });

export const LearningNoteModel =
  mongoose.models.LearningNote ||
  mongoose.model<ILearningNote>('LearningNote', LearningNoteSchema);

