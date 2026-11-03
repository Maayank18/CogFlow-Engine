import mongoose, { Schema, Document } from 'mongoose';

export interface IContentCache extends Document {
  cacheKey: string;
  topicId: mongoose.Types.ObjectId;
  tier: 'B' | 'A' | 'S';
  payload: Record<string, unknown>;
  createdAt: Date;
  expiresAt: Date;
}

const ContentCacheSchema = new Schema<IContentCache>(
  {
    cacheKey: {
      type: String,
      required: true,
      unique: true,
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
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB automatic TTL deletion
    },
  },
  {
    timestamps: true,
  }
);

export const ContentCacheModel =
  mongoose.models.ContentCache ||
  mongoose.model<IContentCache>('ContentCache', ContentCacheSchema);
