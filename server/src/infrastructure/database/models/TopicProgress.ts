import mongoose, { Schema, Document } from 'mongoose';

export interface ITopicProgress extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  masteryLevel: number; // 0 to 100
  completedSections: string[];
  highestTierReached: 'B' | 'A' | 'S';
  totalTimeSpentSeconds: number;
  assessmentCount: number;
  averageScore: number;
  isMastered: boolean;
  lastStudiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TopicProgressSchema = new Schema<ITopicProgress>(
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
    masteryLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedSections: {
      type: [String],
      default: [],
    },
    highestTierReached: {
      type: String,
      enum: ['B', 'A', 'S'],
      default: 'B',
    },
    totalTimeSpentSeconds: {
      type: Number,
      default: 0,
    },
    assessmentCount: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    isMastered: {
      type: Boolean,
      default: false,
    },
    lastStudiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

TopicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

export const TopicProgressModel =
  mongoose.models.TopicProgress ||
  mongoose.model<ITopicProgress>('TopicProgress', TopicProgressSchema);
