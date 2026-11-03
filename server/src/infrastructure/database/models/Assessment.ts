import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessment extends Document {
  topicId: mongoose.Types.ObjectId;
  tier: 'B' | 'A' | 'S';
  title: string;
  passingScorePercentage: number;
  questions: Array<{
    id: string;
    type: 'mcq' | 'concept';
    prompt: string;
    tier: 'B' | 'A' | 'S';
    options?: string[];
    correctAnswerIndex?: number;
    explanation: string;
    maxScore: number;
    rubricCriteria?: string[];
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ['B', 'A', 'S'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    passingScorePercentage: {
      type: Number,
      default: 70,
    },
    questions: [
      {
        id: { type: String, required: true },
        type: { type: String, enum: ['mcq', 'concept'], required: true },
        prompt: { type: String, required: true },
        tier: { type: String, enum: ['B', 'A', 'S'], required: true },
        options: { type: [String] },
        correctAnswerIndex: { type: Number },
        explanation: { type: String, required: true },
        maxScore: { type: Number, default: 10 },
        rubricCriteria: { type: [String] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

AssessmentSchema.index({ topicId: 1, tier: 1 });

export const AssessmentModel =
  mongoose.models.Assessment ||
  mongoose.model<IAssessment>('Assessment', AssessmentSchema);
