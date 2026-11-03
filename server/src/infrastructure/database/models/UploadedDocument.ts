import mongoose, { Schema, Document } from 'mongoose';

export interface IUploadedDocument extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  extractedHeadingCount: number;
  detectedTopics: Array<{
    title: string;
    description: string;
    pageReference?: number;
    estimatedTier: 'B' | 'A' | 'S';
  }>;
  chunks: Array<{
    pageNumber: number;
    text: string;
  }>;
  status: 'processing' | 'ready' | 'failed';
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UploadedDocumentSchema = new Schema<IUploadedDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    extractedHeadingCount: {
      type: Number,
      default: 0,
    },
    detectedTopics: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        pageReference: { type: Number },
        estimatedTier: { type: String, enum: ['B', 'A', 'S'], default: 'A' },
      },
    ],
    chunks: [
      {
        pageNumber: { type: Number, required: true },
        text: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UploadedDocumentSchema.index({ userId: 1, createdAt: -1 });

export const UploadedDocumentModel =
  mongoose.models.UploadedDocument ||
  mongoose.model<IUploadedDocument>('UploadedDocument', UploadedDocumentSchema);

