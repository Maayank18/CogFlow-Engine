import React, { useState, useEffect } from 'react';
import {
  PedagogicalMode,
  PedagogicalTier,
  LessonContent,
  AdaptationRecommendation,
} from '@cogflow/shared';
import { api } from '../../services/api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { useCognitiveTelemetry } from '../cognitive/useCognitiveTelemetry';
import { use30SecondInvariant } from '../cognitive/use30SecondInvariant';

import { LearnStudio } from './studios/LearnStudio';
import { VisualStudio } from './studios/VisualStudio';
import { CodeStudio } from './studios/CodeStudio';
import { NotesStudio } from './studios/NotesStudio';
import { PracticeStudio } from './studios/PracticeStudio';
import { getClientFallbackLesson } from './fallbackLessons';

import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

import {
  BookOpen,
  Eye,
  Code2,
  FileText,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Camera,
  CameraOff,
  Activity,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';

export interface LearningCockpitProps {
  topicId: string;
  initialTier?: PedagogicalTier;
  onExit: () => void;
}

export const LearningCockpit: React.FC<LearningCockpitProps> = ({
  topicId,
  initialTier = 'A',
  onExit,
}) => {
  const { user } = useAuth();
  const { success, info } = useToast();

  const [currentTier, setCurrentTier] = useState<PedagogicalTier>(initialTier);
  const [currentMode, setCurrentMode] = useState<PedagogicalMode>('learn');
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // Panels collapse states
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // Cognitive telemetry
  const {
    videoRef,
    isCameraActive,
    toggleCamera,
    currentResult,
    simulationScenario,
    setSimulationScenario,
  } = useCognitiveTelemetry({
    sampleIntervalMs: 2000,
    onInference: (result) => {
      if (sessionId) {
        api.cognitive.recordEvent({
          sessionId,
          state: result.state,
          confidence: result.confidence,
          probabilities: result.probabilities,
          observedAt: result.observedAt,
          source: result.source,
        }).catch(() => {});
      }
    },
  });

  // 30-Second Sustained Adaptation Invariant State Machine
  const {
    activeState,
    pendingState,
    elapsedSustainedSeconds,
    sustainedThresholdSeconds,
    progressPercentage,
    activeRecommendation,
    acceptRecommendation,
    dismissRecommendation,
  } = use30SecondInvariant({
    currentState: currentResult.state,
    currentConfidence: currentResult.confidence,
    currentTier,
    confidenceThreshold: 0.6,
    sustainedThresholdSeconds: 30,
    onAdaptationProposed: (rec) => {
      info(
        'Cognitive Adaptation Proposed',
        `30s sustained ${rec.targetState.toLowerCase()} detected. Suggesting recalibration to Tier ${rec.suggestedTier}.`
      );
    },
  });

  // Load Session and Lesson on mount or tier change
  useEffect(() => {
    let active = true;

    const init = async () => {
      setIsLoadingLesson(true);
      try {
        // Start or resume learning session with resilient local fallback
        try {
          const session = await api.learning.createSession(topicId, currentTier);
          if (active) {
            setSessionId(session.id);
            setSessionSeconds(session.activeDurationSeconds || 0);
          }
        } catch {
          if (active) {
            setSessionId(`local-session-${Date.now()}`);
            setSessionSeconds(0);
          }
        }

        // Fetch lesson at current tier with instant fallback
        try {
          const lessonData = await api.learning.getLesson(topicId, currentTier, false);
          if (active && lessonData && lessonData.sections && lessonData.sections.length > 0) {
            setLesson(lessonData);
          } else {
            throw new Error('Lesson data empty or invalid');
          }
        } catch (err) {
          console.warn('[Cockpit] Backend lesson deferred, activating instant pedagogical lesson:', err);
          if (active) {
            const fallback = getClientFallbackLesson(topicId, currentTier);
            setLesson(fallback);
          }
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
        if (active) {
          setLesson(getClientFallbackLesson(topicId, currentTier));
        }
      } finally {
        if (active) setIsLoadingLesson(false);
      }
    };

    init();
    return () => {
      active = false;
    };
  }, [topicId, currentTier]);

  // Session duration ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (sessionId) {
        api.learning.updateSession(sessionId, { activeDurationIncrementSeconds: 1 }).catch(() => {});
      }
    };
  }, [sessionId]);

  const handleManualTierChange = async (targetTier: PedagogicalTier) => {
    if (targetTier === currentTier) return;
    setCurrentTier(targetTier);

    if (sessionId) {
      await api.learning.updateSession(sessionId, { currentTier: targetTier }).catch(() => {});
    }
  };

  const handleAcceptAdaptation = async () => {
    const target = acceptRecommendation();
    if (target) {
      if (sessionId && activeRecommendation) {
        await api.cognitive.recordAdaptation({
          sessionId,
          previousTier: activeRecommendation.previousTier,
          suggestedTier: activeRecommendation.suggestedTier,
          resultingTier: target,
          triggerReason: activeRecommendation.reason,
          accepted: true,
          sustainedDurationSeconds: activeRecommendation.sustainedDurationSeconds,
        }).catch(() => {});
      }

      setCurrentTier(target);
      success('Recalibration Applied', `Pedagogical depth adjusted to Tier ${target}.`);
    }
  };

  const handleDismissAdaptation = async () => {
    if (sessionId && activeRecommendation) {
      await api.cognitive.recordAdaptation({
        sessionId,
        previousTier: activeRecommendation.previousTier,
        suggestedTier: activeRecommendation.suggestedTier,
        resultingTier: currentTier,
        triggerReason: activeRecommendation.reason,
        accepted: false,
        sustainedDurationSeconds: activeRecommendation.sustainedDurationSeconds,
      }).catch(() => {});
    }
    dismissRecommendation();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const modes: Array<{ id: PedagogicalMode; label: string; icon: React.ReactNode }> = [
    { id: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'visualize', label: 'Visualize', icon: <Eye className="w-4 h-4" /> },
    { id: 'code', label: 'Code', icon: <Code2 className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-canvas-light dark:bg-canvas-dark text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Cockpit Top Header */}
      <header className="h-14 px-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#121824]/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={onExit} icon={<ChevronLeft className="w-4 h-4" />}>
            Dashboard
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs sm:max-w-md">
              {lesson?.topicTitle || 'Loading Topic...'}
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-0.5">
              {lesson?.subjectTitle || 'Course Overview'}
            </span>
          </div>
        </div>

        {/* Multi-Tier B / A / S Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => handleManualTierChange('B')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              currentTier === 'B'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tier B · Foundations
          </button>
          <button
            onClick={() => handleManualTierChange('A')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              currentTier === 'A'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tier A · Core
          </button>
          <button
            onClick={() => handleManualTierChange('S')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              currentTier === 'S'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tier S · Advanced
          </button>
        </div>

        {/* Right Header Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatSeconds(sessionSeconds)}</span>
          </div>

          <Badge
            variant={
              currentResult.state === 'FLOW'
                ? 'flow'
                : currentResult.state === 'OVERLOAD'
                ? 'overload'
                : 'boredom'
            }
            dot
          >
            {currentResult.state}
          </Badge>
        </div>
      </header>

      {/* Main Cockpit Body Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT NAVIGATION PANEL */}
        <aside
          className={`${
            isLeftCollapsed ? 'w-14' : 'w-64'
          } border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121824] transition-all duration-200 flex flex-col shrink-0 z-10`}
        >
          {/* Mode Selector Tabs */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setCurrentMode(m.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  currentMode === m.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                } ${isLeftCollapsed ? 'justify-center px-0' : ''}`}
                title={m.label}
              >
                {m.icon}
                {!isLeftCollapsed && <span>{m.label}</span>}
              </button>
            ))}
          </div>

          {/* Table of Sections (when not collapsed) */}
          {!isLeftCollapsed && lesson?.sections && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Topic Sections
              </span>
              {lesson.sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="text-xs text-slate-600 dark:text-slate-400 py-1.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-pointer truncate"
                >
                  <span className="text-slate-400 mr-2 font-mono">{idx + 1}.</span>
                  {sec.title}
                </div>
              ))}
            </div>
          )}

          {/* Collapse Toggle Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {isLeftCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* CENTRAL LEARNING CANVAS */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {isLoadingLesson ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-medium">
                Calibrating pedagogical material for Tier {currentTier}...
              </p>
            </div>
          ) : lesson ? (
            <div>
              {/* Studio Mode Delivery */}
              {currentMode === 'learn' && (
                <LearnStudio sections={lesson.sections} topicTitle={lesson.topicTitle} />
              )}
              {currentMode === 'visualize' && <VisualStudio diagram={lesson.visualDiagram} />}
              {currentMode === 'code' && <CodeStudio codeExample={lesson.codeExample} />}
              {currentMode === 'notes' && (
                <NotesStudio topicId={topicId} notes={lesson.revisionNotes} />
              )}
              {currentMode === 'practice' && (
                <PracticeStudio
                  topicId={topicId}
                  tier={currentTier}
                  questions={lesson.practiceQuestions}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p>Unable to load lesson for this topic.</p>
            </div>
          )}
        </main>

        {/* RIGHT INTELLIGENCE PANEL */}
        <aside
          className={`${
            isRightCollapsed ? 'w-12' : 'w-72'
          } border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121824] transition-all duration-200 flex flex-col shrink-0 z-10`}
        >
          {/* Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {!isRightCollapsed && (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Cognitive Intelligence
                </span>
              </div>
            )}
            <button
              onClick={() => setIsRightCollapsed(!isRightCollapsed)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {isRightCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {!isRightCollapsed && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* 30-Second Sustained Recalibration Proposal Banner */}
              {activeRecommendation && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 animate-in fade-in slide-in-from-top-2 duration-200 space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Adaptive Recalibration</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeRecommendation.reason}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" onClick={handleAcceptAdaptation} className="w-full">
                      Accept (Tier {activeRecommendation.suggestedTier})
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleDismissAdaptation}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}

              {/* 30-Second Invariant Live Progress Counter */}
              {pendingState && pendingState !== 'FLOW' && !activeRecommendation && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      Cognitive adjustment suggested
                    </span>
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
                      {elapsedSustainedSeconds} / {sustainedThresholdSeconds}s
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        pendingState === 'OVERLOAD' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Local Webcam Telemetry & Hardware Release */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    On-Device Monitoring
                  </span>
                  <Button
                    size="sm"
                    variant={isCameraActive ? 'danger' : 'outline'}
                    onClick={toggleCamera}
                    icon={isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                    className="h-7 text-[11px]"
                  >
                    {isCameraActive ? 'Stop' : 'Start'}
                  </Button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                  />
                  {!isCameraActive && (
                    <div className="text-center p-3 text-slate-500">
                      <CameraOff className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span className="text-[10px] block">Webcam Offline</span>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-teal-400 font-mono">
                    Zero Biometric Upload
                  </div>
                </div>
              </div>

              {/* Estimated Cognitive State Gauge */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Current State:</span>
                  <Badge
                    variant={
                      currentResult.state === 'FLOW'
                        ? 'flow'
                        : currentResult.state === 'OVERLOAD'
                        ? 'overload'
                        : 'boredom'
                    }
                  >
                    {currentResult.state}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Confidence:</span>
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {Math.round(currentResult.confidence * 100)}%
                  </span>
                </div>

                {currentResult.probabilities && (
                  <div className="space-y-1 pt-1 text-[10px]">
                    <div className="flex justify-between text-slate-400">
                      <span>Flow:</span>
                      <span>{Math.round(currentResult.probabilities.flow * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Overload:</span>
                      <span>{Math.round(currentResult.probabilities.overload * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Boredom:</span>
                      <span>{Math.round(currentResult.probabilities.boredom * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Development Simulation Controls */}
              <div className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    <span>Inference Simulation</span>
                  </span>
                  <Badge size="sm" variant="neutral">
                    MOCK
                  </Badge>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Simulate sustained states to test 30-second invariant transitions.
                </p>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => setSimulationScenario('natural_flow')}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      simulationScenario === 'natural_flow'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Flow
                  </button>
                  <button
                    onClick={() => setSimulationScenario('sustained_overload')}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      simulationScenario === 'sustained_overload'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Overload (30s)
                  </button>
                  <button
                    onClick={() => setSimulationScenario('sustained_boredom')}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      simulationScenario === 'sustained_boredom'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Boredom (30s)
                  </button>
                  <button
                    onClick={() => setSimulationScenario('jitter_fluctuating')}
                    className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      simulationScenario === 'jitter_fluctuating'
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Jitter (5s Dips)
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

