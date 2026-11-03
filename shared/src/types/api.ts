import { CognitiveState, PedagogicalTier } from './cognitive.js';
import { PedagogicalMode } from './pedagogy.js';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'learner' | 'educator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferencesData {
  theme: 'light' | 'comfort' | 'dark' | 'system';
  defaultTier: PedagogicalTier;
  preferredMode: PedagogicalMode;
  cameraMonitoringConsent: boolean;
  behavioralTelemetryConsent: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  academicLevel: 'beginner' | 'intermediate' | 'advanced' | 'researcher';
  primaryInterests: string[];
}

export interface SubjectItem {
  id: string;
  slug: string;
  title: string;
  category: 'Computer Science' | 'Mathematics' | 'Physics' | 'Chemistry' | 'Biology' | 'Engineering';
  description: string;
  icon: string;
  topicCount: number;
}

export interface TopicItem {
  id: string;
  subjectId: string;
  slug: string;
  title: string;
  summary: string;
  prerequisites: string[];
  learningObjectives: string[];
  estimatedMinutes: number;
  difficultyBaseline: PedagogicalTier;
  order: number;
}

export interface LearningSessionSummary {
  id: string;
  userId: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  currentTier: PedagogicalTier;
  currentMode: PedagogicalMode;
  activeDurationSeconds: number;
  startedAt: string;
  lastActiveAt: string;
  isCompleted: boolean;
  cognitiveSummary?: {
    flowPercentage: number;
    overloadPercentage: number;
    boredomPercentage: number;
    adaptationsTriggered: number;
  };
}

export interface UploadedDocumentData {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSizeBytes: number;
  extractedHeadingCount: number;
  detectedTopics: Array<{
    title: string;
    description: string;
    pageReference?: number;
    estimatedTier: PedagogicalTier;
  }>;
  status: 'processing' | 'ready' | 'failed';
  uploadedAt: string;
}

export interface LearningAnalyticsOverview {
  totalLearningTimeMinutes: number;
  sessionsCompletedCount: number;
  topicsMasteredCount: number;
  averageAssessmentScore: number;
  currentStreakDays: number;
  cognitiveDistribution: {
    flowSeconds: number;
    overloadSeconds: number;
    boredomSeconds: number;
    unknownSeconds: number;
  };
  tierDistribution: {
    bTierMinutes: number;
    aTierMinutes: number;
    sTierMinutes: number;
  };
  recentSessions: LearningSessionSummary[];
  recentAdaptations: Array<{
    topicTitle: string;
    fromTier: PedagogicalTier;
    toTier: PedagogicalTier;
    reason: string;
    timestamp: string;
  }>;
}

