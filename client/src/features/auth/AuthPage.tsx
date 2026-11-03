import React, { useState } from 'react';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { useAuth } from './AuthContext.js';
import { useToast } from '../../components/ui/Toast.js';
import { api } from '../../services/api.js';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';

export interface AuthPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, register } = useAuth();
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        await login({ email: email.trim(), password });
        success('Welcome back', 'Successfully authenticated.');
        onSuccess();
      } else if (mode === 'register') {
        if (!name.trim()) throw new Error('Name is required.');
        await register({ name: name.trim(), email: email.trim(), password });
        success('Account created', 'Welcome to CogFlow!');
        onSuccess();
      } else if (mode === 'forgot') {
        const res = await api.auth.forgotPassword(email.trim());
        success('Reset Instructions Sent', res.message);
        setMode('login');
      }
    } catch (err) {
      setErrorMessage((err as Error).message);
      toastError('Authentication Failed', (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
          <span className="text-[11px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            CogFlow Engine
          </span>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {mode === 'login' && 'Sign in to CogFlow'}
            {mode === 'register' && 'Create your learning account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login' && 'Enter your credentials to continue your adaptive learning journey.'}
            {mode === 'register' && 'Experience personalized cognitive learning tailored to your pace.'}
            {mode === 'forgot' && 'Enter your account email to receive reset instructions.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Marie Curie"
              leftIcon={<User className="w-4 h-4" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@university.edu"
            leftIcon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {mode !== 'forgot' && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={mode === 'register' ? 'At least 8 characters with 1 capital and 1 number' : undefined}
              required
            />
          )}

          <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Send Reset Link'}
          </Button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          {mode === 'login' ? (
            <>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-semibold text-blue-600 dark:text-blue-400"
              >
                Don't have an account? Sign up
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-center w-full font-medium text-blue-600 dark:text-blue-400"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};
