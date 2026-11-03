import mongoose, { Schema, Document } from 'mongoose';

export interface IAdaptationEvent extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  previousTier: 'B' | 'A' | 'S';
  suggestedTier: 'B' | 'A' | 'S';
  resultingTier: 'B' | 'A' | 'S';
  triggerReason: string;
  accepted: boolean;
  sustainedDurationSeconds: number;
  timestamp: Date;
  createdAt: Date;
}

const AdaptationEventSchema = new Schema<IAdaptationEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'LearningSession',
      required: true,
      index: true,
    },
    previousTier: {
      type: String,
      enum: ['B', 'A', 'S'],
      required: true,
    },
    suggestedTier: {
      type: String,
      enum: ['B', 'A', 'S'],
      required: true,
    },
    resultingTier: {
      type: String,
      enum: ['B', 'A', 'S'],
      required: true,
    },
    triggerReason: {
      type: String,
      required: true,
    },
    accepted: {
      type: Boolean,
      required: true,
    },
    sustainedDurationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

AdaptationEventSchema.index({ userId: 1, timestamp: -1 });

export const AdaptationEventModel =
  mongoose.models.AdaptationEvent ||
  mongoose.model<IAdaptationEvent>('AdaptationEvent', AdaptationEventSchema);

