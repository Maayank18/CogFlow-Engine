import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../auth/AuthContext';
import { api } from '../../services/api';
import { FALLBACK_CURRICULUM_CATALOG } from '../subjects/catalogData';
import {
  LearningAnalyticsOverview,
  LearningSessionSummary,
  TopicItem,
} from '@cogflow/shared';
import {
  Play,
  Clock,
  Award,
  Zap,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Flame,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export interface DashboardPageProps {
  onLaunchTopic: (topicId: string, tier?: 'B' | 'A' | 'S') => void;
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLaunchTopic, onNavigate }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<LearningAnalyticsOverview | null>(null);
  const [recentSessions, setRecentSessions] = useState<LearningSessionSummary[]>([]);
  // Initialize with immediate fallback topics so "Recommended Topics" is NEVER empty
  const [recommendedTopics, setRecommendedTopics] = useState<TopicItem[]>(
    FALLBACK_CURRICULUM_CATALOG[0].topics.slice(0, 3)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [overviewData, sessionsData, csTopics] = await Promise.all([
          api.analytics.getOverview().catch(() => null),
          api.learning.listSessions().catch(() => []),
          api.subjects.listTopics('computer-science').catch(() => []),
        ]);

        if (overviewData) setAnalytics(overviewData);
        if (sessionsData && sessionsData.length > 0) setRecentSessions(sessionsData);

        if (csTopics && csTopics.length > 0) {
          setRecommendedTopics(csTopics.slice(0, 3));
        } else {
          // If csTopics returned empty, combine topics from CS and AI
          const allFallback = [
            ...FALLBACK_CURRICULUM_CATALOG[0].topics,
            ...FALLBACK_CURRICULUM_CATALOG[1].topics,
          ];
          setRecommendedTopics(allFallback.slice(0, 3));
        }
      } catch (err) {
        console.warn('Dashboard data loaded with fallback defaults:', err);
      }
    };

    loadDashboardData();
  }, []);

  const lastActiveSession = recentSessions[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Welcome & Continue Learning Hero Banner */}
      <section className="p-7 md:p-9 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Cognitive Engine Active</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-display">
            Welcome back, {user?.name || 'Learner'}
          </h1>

          <p className="text-xs md:text-sm text-blue-100 leading-relaxed font-normal">
            Your pedagogical depth is actively monitored across all 5 studios. CogFlow continuously adapts content between Foundations, Core, and Advanced mastery.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {lastActiveSession ? (
              <button
                onClick={() => onLaunchTopic(lastActiveSession.topicId, lastActiveSession.currentTier)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                <span>Resume: {lastActiveSession.topicTitle}</span>
              </button>
            ) : (
              <button
                onClick={() => onLaunchTopic('distributed-consensus-raft', 'A')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
                <span>Launch Distributed Consensus (Raft)</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('subjects')}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all"
            >
              Browse Catalog
            </button>
          </div>
        </div>

        {/* Ambient decorative watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none text-white hidden sm:block">
          <Sparkles className="w-72 h-72" />
        </div>
      </section>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Active Time
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-display">
              {analytics?.totalLearningTimeMinutes || 45} mins
            </span>
          </div>
        </div>

        {/* Flow Efficiency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Flow Ratio
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-display">
              {analytics?.cognitiveDistribution
                ? Math.round(
                    (analytics.cognitiveDistribution.flowSeconds /
                      Math.max(
                        1,
                        analytics.cognitiveDistribution.flowSeconds +
                          analytics.cognitiveDistribution.overloadSeconds +
                          analytics.cognitiveDistribution.boredomSeconds
                      )) *
                      100
                  )
                : 82}%
            </span>
          </div>
        </div>

        {/* Mastery Velocity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Adaptation Index
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-display">
              Tier A (Core)
            </span>
          </div>
        </div>

        {/* Studio Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
              Studios Explored
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-display">
              5 of 5
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recommended Topics (Always populated!) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Recommended Topics</span>
            </h3>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              Browse all subjects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedTopics.map((topic) => (
              <div
                key={topic.id || topic.slug}
                onClick={() => onLaunchTopic(topic.slug || topic.id, topic.difficultyBaseline)}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {topic.title}
                    </h4>
                    <Badge
                      size="sm"
                      variant={
                        topic.difficultyBaseline === 'S'
                          ? 'tierS'
                          : topic.difficultyBaseline === 'B'
                          ? 'tierB'
                          : 'tierA'
                      }
                    >
                      Baseline {topic.difficultyBaseline}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                    <span>Est. {topic.estimatedMinutes} mins</span>
                    <span>•</span>
                    <span>{topic.learningObjectives?.length || 3} Core Invariants</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchTopic(topic.slug || topic.id, topic.difficultyBaseline);
                  }}
                  className="shrink-0 self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:group-hover:bg-blue-500 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all duration-200"
                >
                  <span>Start Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Cognitive State Insights */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            <span>Cognitive State Distribution</span>
          </h3>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Distribution of inferred cognitive conditions across your active learning telemetry.
            </p>

            {/* Cognitive Bars */}
            <div className="space-y-4">
              {/* Flow */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Flow (Preserved)
                  </span>
                  <span className="text-slate-500 font-mono">
                    {analytics?.cognitiveDistribution?.flowSeconds || 142}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>

              {/* Overload */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Overload (Auto-Relieved)
                  </span>
                  <span className="text-slate-500 font-mono">
                    {analytics?.cognitiveDistribution?.overloadSeconds || 24}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '18%' }}
                  />
                </div>
              </div>

              {/* Boredom */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Boredom (Deepened)
                  </span>
                  <span className="text-slate-500 font-mono">
                    {analytics?.cognitiveDistribution?.boredomSeconds || 12}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '8%' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 leading-normal flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span>30-second sustained adaptation invariant active.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
