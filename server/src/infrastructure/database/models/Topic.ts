import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  subjectId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  summary: string;
  prerequisites: string[];
  learningObjectives: string[];
  estimatedMinutes: number;
  difficultyBaseline: 'B' | 'A' | 'S';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    learningObjectives: {
      type: [String],
      required: true,
    },
    estimatedMinutes: {
      type: Number,
      default: 20,
    },
    difficultyBaseline: {
      type: String,
      enum: ['B', 'A', 'S'],
      default: 'A',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique slug within a subject
TopicSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

export const TopicModel =
  mongoose.models.Topic || mongoose.model<ITopic>('Topic', TopicSchema);
