import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningSession extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  currentTier: 'B' | 'A' | 'S';
  currentMode: 'learn' | 'visualize' | 'code' | 'notes' | 'practice';
  activeDurationSeconds: number;
  isCompleted: boolean;
  startedAt: Date;
  lastActiveAt: Date;
  endedAt?: Date;
  cognitiveSummary?: {
    flowPercentage: number;
    overloadPercentage: number;
    boredomPercentage: number;
    adaptationsTriggered: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LearningSessionSchema = new Schema<ILearningSession>(
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
    currentTier: {
      type: String,
      enum: ['B', 'A', 'S'],
      default: 'A',
    },
    currentMode: {
      type: String,
      enum: ['learn', 'visualize', 'code', 'notes', 'practice'],
      default: 'learn',
    },
    activeDurationSeconds: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    cognitiveSummary: {
      flowPercentage: { type: Number, default: 0 },
      overloadPercentage: { type: Number, default: 0 },
      boredomPercentage: { type: Number, default: 0 },
      adaptationsTriggered: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

LearningSessionSchema.index({ userId: 1, isCompleted: 1, lastActiveAt: -1 });

export const LearningSessionModel =
  mongoose.models.LearningSession ||
  mongoose.model<ILearningSession>('LearningSession', LearningSessionSchema);
