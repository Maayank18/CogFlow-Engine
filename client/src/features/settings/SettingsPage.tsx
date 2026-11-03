import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../../design-system/theme';
import { useToast } from '../../components/ui/Toast';
import { api } from '../../services/api';
import {
  User,
  Sun,
  Moon,
  Laptop,
  Shield,
  Cpu,
  Save,
  CheckCircle2,
  Trash2,
  Zap,
  Sparkles,
  Key,
  RefreshCw,
  Server,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, preferences, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [defaultTier, setDefaultTier] = useState<'B' | 'A' | 'S'>(preferences?.defaultTier || 'A');
  const [cameraConsent, setCameraConsent] = useState(preferences?.cameraMonitoringConsent || false);
  const [telemetryConsent, setTelemetryConsent] = useState(preferences?.behavioralTelemetryConsent ?? true);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [isConnectingGroq, setIsConnectingGroq] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const fetchAIStatus = async () => {
    try {
      const data = await api.ai.getStatus();
      setAiStatus(data);
    } catch (err) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAIStatus();
  }, []);

  const handleConnectGroq = async () => {
    if (!groqKeyInput.trim()) return;
    setIsConnectingGroq(true);
    try {
      const res = await api.ai.configureGroq(groqKeyInput.trim());
      if (res.success) {
        success('Groq Connected', res.message);
        setGroqKeyInput('');
        await fetchAIStatus();
      } else {
        error('Groq Connection Failed', res.message);
      }
    } catch (err) {
      error('Groq Error', (err as Error).message);
    } finally {
      setIsConnectingGroq(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    setDiagnosticResult(null);
    try {
      const res = await api.ai.runDiagnostics();
      setDiagnosticResult(res.data);
      if (res.success) {
        success('Diagnostics Passed', `Active: ${res.data.activeProvider} (${res.data.latencyMs}ms)`);
      } else {
        error('Diagnostics Fallback', res.data.error || 'Fell back to deterministic engine');
      }
    } catch (err) {
      error('Diagnostic Error', (err as Error).message);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (name !== user?.name) {
        await api.users.updateProfile({ name });
      }

      await updatePreferences({
        theme,
        defaultTier,
        cameraMonitoringConsent: cameraConsent,
        behavioralTelemetryConsent: telemetryConsent,
      });

      success('Settings Updated', 'Your preferences have been saved.');
    } catch (err) {
      error('Failed to save settings', (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your account profile, theme appearance, cognitive privacy, and model provider status.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Profile Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Account Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed directly."
            />
          </div>
        </Card>

        {/* Theme & Appearance */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Appearance & Interface
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme === 'system'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </Card>

        {/* Default Pedagogical Tier */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Pedagogical Baseline
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(['B', 'A', 'S'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setDefaultTier(tier)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  defaultTier === tier
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs block">Tier {tier}</span>
                <span className="text-[11px] font-normal text-slate-400">
                  {tier === 'B' ? 'Foundations' : tier === 'A' ? 'Core Standard' : 'Advanced Rigor'}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Privacy & Cognitive Telemetry Settings */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Cognitive Telemetry & Privacy Boundaries
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cameraConsent}
                onChange={(e) => setCameraConsent(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Permit optional on-device camera monitoring
                </span>
                <span className="text-[11px] text-slate-400">
                  Allows client-side facial telemetry for cognitive load estimation. Frames are never uploaded.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={telemetryConsent}
                onChange={(e) => setTelemetryConsent(e.target.checked)}
                className="rounded text-blue-600 mt-0.5"
              />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Permit passive behavioral timing telemetry
                </span>
                <span className="text-[11px] text-slate-400">
                  Measures scroll cadence and reading velocity timing. Never records keystrokes.
                </span>
              </div>
            </label>
          </div>
        </Card>

        {/* AI Engine & LLM Orchestration Status */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  AI Orchestration & Multi-Tier Fallback
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Default Provider: <span className="font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">{aiStatus?.defaultProvider || 'ollama'}</span> • Cloud Fallback: <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunDiagnostic}
              disabled={isRunningDiagnostic}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostic ? 'animate-spin text-blue-500' : ''}`} />
              <span>{isRunningDiagnostic ? 'Testing AI Pipeline...' : 'Run Diagnostics'}</span>
            </button>
          </div>

          {/* Diagnostic Result Banner if run */}
          {diagnosticResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              diagnosticResult.activeProvider !== 'fallback'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  Active Provider: <strong>{diagnosticResult.activeProvider}</strong> ({diagnosticResult.model})
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold">
                Latency: {diagnosticResult.latencyMs}ms
              </span>
            </div>
          )}

          {/* Provider Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {aiStatus?.providers?.map((p: any) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {p.id === 'ollama' ? (
                      <Server className="w-4 h-4 text-blue-500" />
                    ) : p.id === 'groq' ? (
                      <Zap className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Cpu className="w-4 h-4 text-purple-500" />
                    )}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{p.name}</span>
                  </div>
                  <Badge size="sm" variant={p.available ? 'flow' : 'neutral'} dot>
                    {p.available ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {p.details || (p.available ? 'Connected & Operational' : 'Standby')}
                </div>
              </div>
            )) || (
              <p className="text-xs text-slate-400">Loading AI status...</p>
            )}
          </div>

          {/* Connect Groq API Key Failsafe Box */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Groq Cloud High-Speed Failsafe (Optional)
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                500+ tok/s Ultra-Fast LPU
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              If local Ollama takes time on your device or goes offline, Groq provides instant failover generation in ~1 second. Enter a free API key from <code>console.groq.com</code>:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter Groq API Key (gsk_...)"
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleConnectGroq}
                disabled={isConnectingGroq || !groqKeyInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50 active:scale-95 shrink-0"
              >
                {isConnectingGroq ? 'Verifying...' : 'Connect Groq'}
              </button>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button size="lg" type="submit" isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};

