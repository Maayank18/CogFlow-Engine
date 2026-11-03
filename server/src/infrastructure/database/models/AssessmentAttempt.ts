import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  tier: 'B' | 'A' | 'S';
  score: number;
  maximumScore: number;
  percentage: number;
  passed: boolean;
  answers: Array<{
    questionId: string;
    type: 'mcq' | 'concept';
    selectedOptionIndex?: number;
    conceptualAnswerText?: string;
    earnedScore: number;
    feedback?: string;
  }>;
  overallFeedback?: string;
  strengths: string[];
  missingConcepts: string[];
  misconceptions: string[];
  recommendedRevision: string[];
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
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
    score: {
      type: Number,
      required: true,
    },
    maximumScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    answers: [
      {
        questionId: { type: String, required: true },
        type: { type: String, enum: ['mcq', 'concept'], required: true },
        selectedOptionIndex: { type: Number },
        conceptualAnswerText: { type: String },
        earnedScore: { type: Number, required: true },
        feedback: { type: String },
      },
    ],
    overallFeedback: { type: String },
    strengths: { type: [String], default: [] },
    missingConcepts: { type: [String], default: [] },
    misconceptions: { type: [String], default: [] },
    recommendedRevision: { type: [String], default: [] },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AssessmentAttemptSchema.index({ userId: 1, topicId: 1, submittedAt: -1 });

export const AssessmentAttemptModel =
  mongoose.models.AssessmentAttempt ||
  mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);

