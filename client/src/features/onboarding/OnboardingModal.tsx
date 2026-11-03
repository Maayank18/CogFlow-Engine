import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal.js';
import { Button } from '../../components/ui/Button.js';
import { Input } from '../../components/ui/Input.js';
import { Badge } from '../../components/ui/Badge.js';
import { useAuth } from '../auth/AuthContext.js';
import { useToast } from '../../components/ui/Toast.js';
import { Shield, Sparkles, Camera, BookOpen, Layers } from 'lucide-react';

export interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const { user, preferences, updatePreferences } = useAuth();
  const { success } = useToast();

  const [academicLevel, setAcademicLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'researcher'>(
    preferences?.academicLevel || 'intermediate'
  );
  const [defaultTier, setDefaultTier] = useState<'B' | 'A' | 'S'>(preferences?.defaultTier || 'A');
  const [cameraConsent, setCameraConsent] = useState<boolean>(
    preferences?.cameraMonitoringConsent || false
  );
  const [telemetryConsent, setTelemetryConsent] = useState<boolean>(
    preferences?.behavioralTelemetryConsent ?? true
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Distributed Systems',
    'Algorithms',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const interestOptions = [
    'Distributed Systems',
    'Algorithms & Data Structures',
    'Operating Systems',
    'Machine Learning',
    'Linear Algebra',
    'Quantum Computing',
    'Convex Optimization',
  ];

  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updatePreferences({
        academicLevel,
        defaultTier,
        cameraMonitoringConsent: cameraConsent,
        behavioralTelemetryConsent: telemetryConsent,
        primaryInterests: selectedInterests,
      });

      success('Preferences Saved', 'Welcome to your tailored CogFlow workspace.');
      onComplete();
    } catch (err) {
      console.error('Failed to update onboarding preferences:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onComplete}
      title="Personalize Your Learning Experience"
      description="Configure your academic baseline, pedagogical depth, and privacy preferences."
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Academic Level */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Current Academic / Engineering Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['beginner', 'intermediate', 'advanced', 'researcher'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setAcademicLevel(lvl)}
                className={`p-2.5 rounded-xl border text-xs font-medium capitalize transition-all ${
                  academicLevel === lvl
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-[#121824] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Default Pedagogical Tier */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Default Pedagogical Depth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setDefaultTier('B')}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                defaultTier === 'B'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold block mb-0.5">Tier B · Foundations</span>
              <span className="text-[11px] opacity-80">Intuitive scaffolding & analogies</span>
            </button>

            <button
              type="button"
              onClick={() => setDefaultTier('A')}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                defaultTier === 'A'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold block mb-0.5">Tier A · Core</span>
              <span className="text-[11px] opacity-80">Balanced industry rigor</span>
            </button>

            <button
              type="button"
              onClick={() => setDefaultTier('S')}
              className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                defaultTier === 'S'
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-100'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="font-bold block mb-0.5">Tier S · Advanced</span>
              <span className="text-[11px] opacity-80">Mathematical invariants & edge cases</span>
            </button>
          </div>
        </div>

        {/* Primary Interests */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Primary Learning Topics
          </label>
          <div className="flex flex-wrap gap-1.5">
            {interestOptions.map((item) => {
              const isSelected = selectedInterests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Privacy & Camera Consent Controls */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Privacy-Conscious Cognitive Telemetry
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            CogFlow operates under strict client-side data boundaries. Camera frames are processed on-device and <strong>never uploaded, persisted, or transmitted to remote cloud servers</strong>. You can use CogFlow fully with the camera turned off.
          </p>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={cameraConsent}
              onChange={(e) => setCameraConsent(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>Enable optional on-device camera monitoring for cognitive state detection</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={telemetryConsent}
              onChange={(e) => setTelemetryConsent(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
            />
            <span>Enable privacy-conscious behavioral timing telemetry (scroll velocity & cadence)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button size="lg" onClick={handleSave} isLoading={isSubmitting}>
            Complete & Enter Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};

