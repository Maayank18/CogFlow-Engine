import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card.js';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { useAuth } from '../auth/AuthContext.js';
import { api } from '../../services/api.js';
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
} from 'lucide-react';

export interface DashboardPageProps {
  onLaunchTopic: (topicId: string, tier?: 'B' | 'A' | 'S') => void;
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onLaunchTopic, onNavigate }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<LearningAnalyticsOverview | null>(null);
  const [recentSessions, setRecentSessions] = useState<LearningSessionSummary[]>([]);
  const [recommendedTopics, setRecommendedTopics] = useState<TopicItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [overviewData, sessionsData, csTopics] = await Promise.all([
          api.analytics.getOverview(),
          api.learning.listSessions(),
          api.subjects.listTopics('computer-science').catch(() => []),
        ]);

        setAnalytics(overviewData);
        setRecentSessions(sessionsData || []);
        setRecommendedTopics(csTopics.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const lastActiveSession = recentSessions[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Welcome & Continue Learning Hero Banner */}
      <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <Badge size="sm" variant="neutral" className="bg-white/20 text-white border-transparent">
            Welcome Back
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ready to achieve flow state, {user?.name || 'Learner'}?
          </h1>
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
            Your pedagogical depth is actively calibrated to your cognitive condition. Pick up where you left off or explore new curricula.
          </p>

          {lastActiveSession && (
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => onLaunchTopic(lastActiveSession.topicId, lastActiveSession.currentTier)}
                icon={<Play className="w-4 h-4 fill-current text-blue-600" />}
                className="bg-white text-blue-900 hover:bg-blue-50 border-transparent font-semibold shadow-sm"
              >
                Resume: {lastActiveSession.topicTitle}
              </Button>
              <span className="text-xs text-blue-200">
                Tier {lastActiveSession.currentTier} · Mode {lastActiveSession.currentMode}
              </span>
            </div>
          )}
        </div>

        {/* Decorative background brain watermark */}
        <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none text-white hidden sm:block">
          <Sparkles className="w-64 h-64" />
        </div>
      </section>

      {/* Metrics Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Time */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Time Studied</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.totalLearningTimeMinutes || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">mins</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active engagement</span>
        </Card>

        {/* Mastered Topics */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-teal-500" />
            <span>Topics Mastered</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.topicsMasteredCount || 0}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Score ≥ 80%</span>
        </Card>

        {/* Assessment Average */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span>Assessment Avg</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.averageAssessmentScore || 0}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Semantic rubrics</span>
        </Card>

        {/* Current Streak */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Learning Streak</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.currentStreakDays || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">days</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Consistency streak</span>
        </Card>
      </section>

      {/* Main Content Split: Recommended Topics + Cognitive State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommended Topics to Learn */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>Recommended Topics</span>
            </h3>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Browse all subjects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendedTopics.map((topic) => (
              <Card
                key={topic.id}
                variant="interactive"
                onClick={() => onLaunchTopic(topic.id, topic.difficultyBaseline)}
                className="p-5 flex items-center justify-between"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {topic.summary}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Est. {topic.estimatedMinutes} mins</span>
                    <span>•</span>
                    <span>{topic.learningObjectives?.length || 3} Learning Objectives</span>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="shrink-0 ml-4">
                  Start <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Cognitive State Insights */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            <span>Cognitive State Distribution</span>
          </h3>

          <Card className="p-5 space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Distribution of inferred cognitive conditions across your recent learning sessions.
            </p>

            {/* Cognitive Bars */}
            <div className="space-y-3">
              {/* Flow */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    Flow (Preserved)
                  </span>
                  <span className="text-slate-500">
                    {analytics?.cognitiveDistribution?.flowSeconds || 0}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full"
                    style={{
                      width: `${
                        analytics?.cognitiveDistribution?.flowSeconds
                          ? Math.min(100, (analytics.cognitiveDistribution.flowSeconds / 120) * 100)
                          : 65
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Overload */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Overload (Relieved)
                  </span>
                  <span className="text-slate-500">
                    {analytics?.cognitiveDistribution?.overloadSeconds || 0}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{
                      width: `${
                        analytics?.cognitiveDistribution?.overloadSeconds
                          ? Math.min(100, (analytics.cognitiveDistribution.overloadSeconds / 120) * 100)
                          : 20
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Boredom */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Boredom (Deepened)
                  </span>
                  <span className="text-slate-500">
                    {analytics?.cognitiveDistribution?.boredomSeconds || 0}s
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${
                        analytics?.cognitiveDistribution?.boredomSeconds
                          ? Math.min(100, (analytics.cognitiveDistribution.boredomSeconds / 120) * 100)
                          : 15
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-tight">
              Inferred via client-side telemetry with 30-second sustained adaptation invariant.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
