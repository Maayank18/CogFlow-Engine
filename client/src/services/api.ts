import {
  ApiResponse,
  UserProfile,
  UserPreferencesData,
  SubjectItem,
  TopicItem,
  LearningSessionSummary,
  LessonContent,
  UploadedDocumentData,
  LearningAnalyticsOverview,
  RevisionNoteItem,
} from '@cogflow/shared';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('cogflow_token');
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('cogflow_token', token);
    } else {
      localStorage.removeItem('cogflow_token');
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Clear token on unauthorized if not checking auth
      if (!endpoint.includes('/auth/me')) {
        this.setToken(null);
      }
    }

    const json: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: { code: 'PARSE_ERROR', message: 'Failed to parse JSON response' },
    }));

    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || `HTTP ${response.status}: Request failed.`);
    }

    return json.data as T;
  }

  // --- Auth Endpoints ---
  public auth = {
    register: (data: { name: string; email: string; password: string }) =>
      this.request<{ user: UserProfile; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      this.request<{ user: UserProfile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),

    getMe: () =>
      this.request<{ user: UserProfile; preferences: UserPreferencesData }>('/auth/me'),

    forgotPassword: (email: string) =>
      this.request<{ message: string; simulationToken?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (data: { token: string; newPassword: string }) =>
      this.request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };

  // --- Users Endpoints ---
  public users = {
    getPreferences: () => this.request<UserPreferencesData>('/users/me/preferences'),
    updatePreferences: (data: Partial<UserPreferencesData>) =>
      this.request<UserPreferencesData>('/users/me/preferences', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateProfile: (data: { name?: string }) =>
      this.request<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  };

  // --- Subjects & Topics Endpoints ---
  public subjects = {
    list: (category?: string, search?: string) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      return this.request<SubjectItem[]>(`/subjects?${params.toString()}`);
    },
    get: (subjectId: string) => this.request<SubjectItem>(`/subjects/${subjectId}`),
    listTopics: (subjectId: string) => this.request<TopicItem[]>(`/subjects/${subjectId}/topics`),
    getTopic: (topicId: string) => this.request<TopicItem>(`/subjects/topics/${topicId}`),
  };

  // --- Learning Cockpit Endpoints ---
  public learning = {
    createSession: (topicId: string, initialTier: 'B' | 'A' | 'S' = 'A') =>
      this.request<LearningSessionSummary>('/learning/sessions', {
        method: 'POST',
        body: JSON.stringify({ topicId, initialTier }),
      }),

    listSessions: () => this.request<LearningSessionSummary[]>('/learning/sessions'),

    getSession: (sessionId: string) =>
      this.request<LearningSessionSummary>(`/learning/sessions/${sessionId}`),

    updateSession: (
      sessionId: string,
      updates: {
        currentTier?: 'B' | 'A' | 'S';
        currentMode?: 'learn' | 'visualize' | 'code' | 'notes' | 'practice';
        activeDurationIncrementSeconds?: number;
        isCompleted?: boolean;
      }
    ) =>
      this.request<LearningSessionSummary>(`/learning/sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),

    getLesson: (topicId: string, tier: 'B' | 'A' | 'S' = 'A', forceRefresh = false) =>
      this.request<LessonContent>(
        `/learning/topics/${topicId}/lesson?tier=${tier}&forceRefresh=${forceRefresh}`
      ),

    adaptTier: (topicId: string, targetTier: 'B' | 'A' | 'S') =>
      this.request<LessonContent>(`/learning/topics/${topicId}/adapt`, {
        method: 'POST',
        body: JSON.stringify({ targetTier }),
      }),
  };

  // --- Assessments Endpoints ---
  public assessments = {
    getForTopic: (topicId: string, tier: 'B' | 'A' | 'S' = 'A') =>
      this.request<{
        topicId: string;
        tier: 'B' | 'A' | 'S';
        title: string;
        passingScorePercentage: number;
        questions: any[];
      }>(`/assessments/topics/${topicId}?tier=${tier}`),

    submitAttempt: (
      topicId: string,
      tier: 'B' | 'A' | 'S',
      answers: Array<{
        questionId: string;
        type: 'mcq' | 'concept';
        selectedOptionIndex?: number;
        conceptualAnswerText?: string;
      }>
    ) =>
      this.request<any>(`/assessments/topics/${topicId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ tier, answers }),
      }),

    listAttempts: (topicId?: string) =>
      this.request<any[]>(`/assessments/attempts${topicId ? `?topicId=${topicId}` : ''}`),
  };

  // --- Documents / Syllabus Endpoints ---
  public documents = {
    upload: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const headers: Record<string, string> = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to upload document.');
      }
      return json.data as UploadedDocumentData;
    },

    list: () => this.request<UploadedDocumentData[]>('/documents'),
    get: (documentId: string) => this.request<UploadedDocumentData>(`/documents/${documentId}`),
    delete: (documentId: string) =>
      this.request<{ message: string }>(`/documents/${documentId}`, { method: 'DELETE' }),
  };

  // --- Cognitive Telemetry Endpoints ---
  public cognitive = {
    getStatus: () => this.request<any>('/cognitive/status'),

    recordEvent: (event: {
      sessionId: string;
      state: 'FLOW' | 'OVERLOAD' | 'BOREDOM' | 'UNKNOWN';
      confidence: number;
      probabilities?: { flow: number; overload: number; boredom: number };
      observedAt: string;
      source: 'mock' | 'external_model' | 'rule_fallback';
    }) =>
      this.request<any>('/cognitive/events', {
        method: 'POST',
        body: JSON.stringify(event),
      }),

    recordAdaptation: (adaptation: {
      sessionId: string;
      previousTier: 'B' | 'A' | 'S';
      suggestedTier: 'B' | 'A' | 'S';
      resultingTier: 'B' | 'A' | 'S';
      triggerReason: string;
      accepted: boolean;
      sustainedDurationSeconds: number;
    }) =>
      this.request<any>('/cognitive/adaptations', {
        method: 'POST',
        body: JSON.stringify(adaptation),
      }),

    getSessionEvents: (sessionId: string) =>
      this.request<any[]>(`/cognitive/sessions/${sessionId}`),
  };

  // --- Notes Endpoints ---
  public notes = {
    list: (topicId?: string) =>
      this.request<RevisionNoteItem[]>(`/notes${topicId ? `?topicId=${topicId}` : ''}`),

    create: (data: {
      topicId: string;
      title: string;
      content: string;
      type?: string;
      tags?: string[];
    }) =>
      this.request<RevisionNoteItem>('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (noteId: string, updates: Partial<RevisionNoteItem>) =>
      this.request<RevisionNoteItem>(`/notes/${noteId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),

    delete: (noteId: string) =>
      this.request<{ message: string }>(`/notes/${noteId}`, {
        method: 'DELETE',
      }),
  };

  // --- Analytics Endpoints ---
  public analytics = {
    getOverview: () => this.request<LearningAnalyticsOverview>('/analytics/overview'),
  };

  // --- AI Orchestration Endpoints ---
  public ai = {
    getStatus: () => this.request<any>('/ai/providers/status'),

    askQuestion: (data: { prompt: string; topicTitle: string; tier: string }) =>
      this.request<{ answer: string; provider: string; model: string }>('/ai/questions/answer', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
}

export const api = new ApiClient();
