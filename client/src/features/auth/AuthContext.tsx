import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPreferencesData } from '@cogflow/shared';
import { api } from '../../services/api';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferencesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      setUser(data.user);
      setPreferences(data.preferences);
    } catch {
      setUser(null);
      setPreferences(null);
      api.setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    const res = await api.auth.login(data);
    api.setToken(res.token);
    setUser(res.user);
    const pref = await api.users.getPreferences();
    setPreferences(pref);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const res = await api.auth.register(data);
    api.setToken(res.token);
    setUser(res.user);
    const pref = await api.users.getPreferences();
    setPreferences(pref);
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout network errors
    } finally {
      api.setToken(null);
      setUser(null);
      setPreferences(null);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferencesData>) => {
    const updated = await api.users.updatePreferences(updates);
    setPreferences(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        preferences,
        isAuthenticated: Boolean(user),
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

