import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPreferencesData } from '@cogflow/shared';
import { api } from '../../services/api';

const DEV_DEFAULT_USER: UserProfile = {
  id: 'usr_dev_learner_001',
  email: 'learner@cogflow.ai',
  name: 'Learner (Bypass Active)',
  role: 'learner',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEV_DEFAULT_PREFERENCES: UserPreferencesData = {
  theme: 'dark',
  defaultTier: 'A',
  preferredMode: 'learn',
  cameraMonitoringConsent: true,
  behavioralTelemetryConsent: true,
  soundEffects: true,
  reducedMotion: false,
  academicLevel: 'intermediate',
  primaryInterests: [],
};

interface AuthContextType {
  user: UserProfile | null;
  preferences: UserPreferencesData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferencesData>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-authenticated by default for instant zero-friction development & demo
  const [user, setUser] = useState<UserProfile | null>(DEV_DEFAULT_USER);
  const [preferences, setPreferences] = useState<UserPreferencesData | null>(DEV_DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      if (data && data.user) {
        setUser(data.user);
        setPreferences(data.preferences || DEV_DEFAULT_PREFERENCES);
      } else {
        setUser(DEV_DEFAULT_USER);
        setPreferences(DEV_DEFAULT_PREFERENCES);
      }
    } catch {
      // In bypass mode, maintain the dev user session
      setUser(DEV_DEFAULT_USER);
      setPreferences(DEV_DEFAULT_PREFERENCES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await api.auth.login(data);
      api.setToken(res.token);
      setUser(res.user);
      const pref = await api.users.getPreferences();
      setPreferences(pref);
    } catch {
      setUser(DEV_DEFAULT_USER);
    }
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await api.auth.register(data);
      api.setToken(res.token);
      setUser(res.user);
      const pref = await api.users.getPreferences();
      setPreferences(pref);
    } catch {
      setUser(DEV_DEFAULT_USER);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore
    } finally {
      api.setToken(null);
      // Even on logout in bypass mode, default back to dev session
      setUser(DEV_DEFAULT_USER);
      setPreferences(DEV_DEFAULT_PREFERENCES);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferencesData>) => {
    try {
      const updated = await api.users.updatePreferences(updates);
      setPreferences(updated);
    } catch {
      setPreferences((prev) => ({ ...(prev || DEV_DEFAULT_PREFERENCES), ...updates }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        isAuthenticated: true, // Always active in bypass mode
        isLoading,
        login,
        register,
        logout,
        updatePreferences,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
