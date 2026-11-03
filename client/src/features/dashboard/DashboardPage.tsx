import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../auth/AuthContext';
import { api } from '../../services/api';
import { getMergedCurriculumCatalog } from '../subjects/catalogData';
import { CreateCustomTopicModal } from '../subjects/CreateCustomTopicModal';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Initialize with immediate fallback topics so "Recommended Topics" is NEVER empty
  const [recommendedTopics, setRecommendedTopics] = useState<TopicItem[]>(() => {
    const catalog = getMergedCurriculumCatalog();
    return catalog[0]?.topics?.slice(0, 3) || [];
  });

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

        const catalog = getMergedCurriculumCatalog();
        if (csTopics && csTopics.length > 0) {
          setRecommendedTopics(csTopics.slice(0, 3));
        } else {
          const allFallback = [
            ...(catalog[0]?.topics || []),
            ...(catalog[1]?.topics || []),
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
      {/* Welcome & Continue Learning Hero Banner - Pure Monochrome Elegance */}
      <section className="p-7 md:p-9 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cognitive Engine Active</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight font-display text-zinc-950 dark:text-white">
            Welcome back, {user?.name || 'Learner'}
          </h1>

          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            Your pedagogical depth is actively monitored across all 5 studios. CogFlow continuously adapts content between Foundations, Core, and Advanced mastery.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {lastActiveSession ? (
              <button
                onClick={() => onLaunchTopic(lastActiveSession.topicId, lastActiveSession.currentTier)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume: {lastActiveSession.topicTitle}</span>
              </button>
            ) : (
              <button
                onClick={() => onLaunchTopic('distributed-consensus-raft', 'A')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shadow-xs transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Distributed Consensus (Raft)</span>
              </button>
            )}

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-950/5 hover:bg-zinc-950/10 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-950 dark:text-white text-xs font-bold border border-zinc-300 dark:border-zinc-700 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span>Study Any Topic with AI</span>
            </button>

            <button
              onClick={() => onNavigate('subjects')}
              className="px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-semibold border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              Browse Catalog
            </button>
          </div>
        </div>

        {/* Ambient decorative watermark */}
        <div className="absolute -right-8 -bottom-10 opacity-5 pointer-events-none text-zinc-950 dark:text-white hidden sm:block">
          <Sparkles className="w-72 h-72" />
        </div>
      </section>

      {/* Metric Cards Row - Pure Monochrome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold border border-zinc-200 dark:border-zinc-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
              Active Time
            </span>
            <span className="text-xl font-black text-zinc-950 dark:text-white font-display">
              {analytics?.totalLearningTimeMinutes || 45} mins
            </span>
          </div>
        </div>

        {/* Flow Efficiency */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-emerald-500 flex items-center justify-center font-bold border border-zinc-200 dark:border-zinc-800">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
              Flow Ratio
            </span>
            <span className="text-xl font-black text-zinc-950 dark:text-white font-display">
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
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold border border-zinc-200 dark:border-zinc-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
              Adaptation Index
            </span>
            <span className="text-xl font-black text-zinc-950 dark:text-white font-display">
              Tier A (Core)
            </span>
          </div>
        </div>

        {/* Studio Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold border border-zinc-200 dark:border-zinc-800">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium block">
              Studios Explored
            </span>
            <span className="text-xl font-black text-zinc-950 dark:text-white font-display">
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
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
              <BookOpen className="w-4 h-4 text-zinc-900 dark:text-white" />
              <span>Recommended Topics</span>
            </h3>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white flex items-center gap-1 font-mono transition"
            >
              Browse all subjects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedTopics.map((topic) => (
              <div
                key={topic.id || topic.slug}
                onClick={() => onLaunchTopic(topic.slug || topic.id, topic.difficultyBaseline)}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-900 dark:hover:border-zinc-100 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                      {topic.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                      Tier {topic.difficultyBaseline} Baseline
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {topic.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 pt-1 font-mono">
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
                  className="shrink-0 self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white dark:bg-zinc-900 dark:group-hover:bg-white dark:group-hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-bold transition-all duration-200 border border-zinc-200 dark:border-zinc-800"
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
          <h3 className="text-base font-extrabold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
            <Activity className="w-4 h-4 text-zinc-900 dark:text-white" />
            <span>Cognitive State Distribution</span>
          </h3>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Distribution of inferred cognitive conditions across your active learning telemetry.
            </p>

            {/* Cognitive Bars */}
            <div className="space-y-4 font-mono text-xs">
              {/* Flow */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Flow (Preserved)
                  </span>
                  <span className="text-zinc-500">
                    {analytics?.cognitiveDistribution?.flowSeconds || 142}s
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>

              {/* Overload */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Overload (Auto-Relieved)
                  </span>
                  <span className="text-zinc-500">
                    {analytics?.cognitiveDistribution?.overloadSeconds || 24}s
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '18%' }}
                  />
                </div>
              </div>

              {/* Boredom */}
              <div>
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Boredom (Deepened)
                  </span>
                  <span className="text-zinc-500">
                    {analytics?.cognitiveDistribution?.boredomSeconds || 12}s
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '8%' }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 leading-normal flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>30-second sustained adaptation invariant active.</span>
            </div>
          </div>
        </div>
      </div>

      <CreateCustomTopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTopicCreated={(newTopicId, initialTier) => onLaunchTopic(newTopicId, initialTier)}
      />
    </div>
  );
};
