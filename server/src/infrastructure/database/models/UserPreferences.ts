import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  theme: 'light' | 'dark' | 'system';
  defaultTier: 'B' | 'A' | 'S';
  preferredMode: 'learn' | 'visualize' | 'code' | 'notes' | 'practice';
  cameraMonitoringConsent: boolean;
  behavioralTelemetryConsent: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  academicLevel: 'beginner' | 'intermediate' | 'advanced' | 'researcher';
  primaryInterests: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    defaultTier: {
      type: String,
      enum: ['B', 'A', 'S'],
      default: 'A',
    },
    preferredMode: {
      type: String,
      enum: ['learn', 'visualize', 'code', 'notes', 'practice'],
      default: 'learn',
    },
    cameraMonitoringConsent: {
      type: Boolean,
      default: false,
    },
    behavioralTelemetryConsent: {
      type: Boolean,
      default: true,
    },
    soundEffects: {
      type: Boolean,
      default: true,
    },
    reducedMotion: {
      type: Boolean,
      default: false,
    },
    academicLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'researcher'],
      default: 'intermediate',
    },
    primaryInterests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const UserPreferencesModel =
  mongoose.models.UserPreferences ||
  mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema);
