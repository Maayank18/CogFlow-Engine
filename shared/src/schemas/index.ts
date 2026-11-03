import { z } from 'zod';

export const RegisterRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const LoginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'comfort', 'dark', 'system']).default('system'),
  defaultTier: z.enum(['B', 'A', 'S']).default('A'),
  preferredMode: z.enum(['learn', 'visualize', 'code', 'notes', 'practice']).default('learn'),
  cameraMonitoringConsent: z.boolean().default(false),
  behavioralTelemetryConsent: z.boolean().default(true),
  soundEffects: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  academicLevel: z.enum(['beginner', 'intermediate', 'advanced', 'researcher']).default('intermediate'),
  primaryInterests: z.array(z.string()).default([]),
});

export const CreateLearningSessionSchema = z.object({
  topicId: z.string().min(1, 'Topic ID is required'),
  initialTier: z.enum(['B', 'A', 'S']).default('A'),
  initialMode: z.enum(['learn', 'visualize', 'code', 'notes', 'practice']).default('learn'),
});

export const UpdateLearningSessionSchema = z.object({
  currentTier: z.enum(['B', 'A', 'S']).optional(),
  currentMode: z.enum(['learn', 'visualize', 'code', 'notes', 'practice']).optional(),
  activeDurationIncrementSeconds: z.number().nonnegative().optional(),
  isCompleted: z.boolean().optional(),
});

export const GenerateLessonRequestSchema = z.object({
  topicId: z.string().min(1, 'Topic ID is required'),
  tier: z.enum(['B', 'A', 'S']),
  forceRefresh: z.boolean().optional().default(false),
});

export const SubmitAssessmentSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      type: z.enum(['mcq', 'concept']),
      selectedOptionIndex: z.number().int().optional(),
      conceptualAnswerText: z.string().optional(),
    })
  ),
});

export const CognitiveEventSubmissionSchema = z.object({
  sessionId: z.string().min(1),
  state: z.enum(['FLOW', 'OVERLOAD', 'BOREDOM', 'UNKNOWN']),
  confidence: z.number().min(0).max(1),
  probabilities: z
    .object({
      flow: z.number().min(0).max(1),
      overload: z.number().min(0).max(1),
      boredom: z.number().min(0).max(1),
    })
    .optional(),
  observedAt: z.string().datetime(),
  source: z.enum(['mock', 'external_model', 'rule_fallback']),
});

export const AdaptationEventSubmissionSchema = z.object({
  sessionId: z.string().min(1),
  previousTier: z.enum(['B', 'A', 'S']),
  suggestedTier: z.enum(['B', 'A', 'S']),
  resultingTier: z.enum(['B', 'A', 'S']),
  triggerReason: z.string().min(1),
  accepted: z.boolean(),
  sustainedDurationSeconds: z.number().nonnegative(),
});

