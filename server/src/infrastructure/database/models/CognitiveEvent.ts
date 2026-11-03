import mongoose, { Schema, Document } from 'mongoose';

export interface ICognitiveEvent extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  state: 'FLOW' | 'OVERLOAD' | 'BOREDOM' | 'UNKNOWN';
  confidence: number;
  probabilities?: {
    flow: number;
    overload: number;
    boredom: number;
  };
  source: 'mock' | 'external_model' | 'rule_fallback';
  observedAt: Date;
  createdAt: Date;
}

const CognitiveEventSchema = new Schema<ICognitiveEvent>(
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
    state: {
      type: String,
      enum: ['FLOW', 'OVERLOAD', 'BOREDOM', 'UNKNOWN'],
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    probabilities: {
      flow: { type: Number, min: 0, max: 1 },
      overload: { type: Number, min: 0, max: 1 },
      boredom: { type: Number, min: 0, max: 1 },
    },
    source: {
      type: String,
      enum: ['mock', 'external_model', 'rule_fallback'],
      default: 'mock',
    },
    observedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    // TTL index to automatically clean up raw cognitive telemetry after 30 days
    expireAfterSeconds: 30 * 24 * 60 * 60,
  }
);

CognitiveEventSchema.index({ sessionId: 1, observedAt: -1 });

export const CognitiveEventModel =
  mongoose.models.CognitiveEvent ||
  mongoose.model<ICognitiveEvent>('CognitiveEvent', CognitiveEventSchema);

