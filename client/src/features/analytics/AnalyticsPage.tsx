import React, { useState, useEffect } from 'react';
import { LearningAnalyticsOverview } from '@cogflow/shared';
import { api } from '../../services/api.js';
import { Card } from '../../components/ui/Card.js';
import { Badge } from '../../components/ui/Badge.js';
import {
  Activity,
  Clock,
  Award,
  TrendingUp,
  Layers,
  History,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<LearningAnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.analytics.getOverview();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cogDist = analytics?.cognitiveDistribution || {
    flowSeconds: 0,
    overloadSeconds: 0,
    boredomSeconds: 0,
    unknownSeconds: 0,
  };

  const totalCogSeconds =
    cogDist.flowSeconds + cogDist.overloadSeconds + cogDist.boredomSeconds + (cogDist.unknownSeconds || 0) || 1;

  const flowPct = Math.round((cogDist.flowSeconds / totalCogSeconds) * 100);
  const overloadPct = Math.round((cogDist.overloadSeconds / totalCogSeconds) * 100);
  const boredomPct = Math.round((cogDist.boredomSeconds / totalCogSeconds) * 100);

  const tierDist = analytics?.tierDistribution || { bTierMinutes: 0, aTierMinutes: 0, sTierMinutes: 0 };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Cognitive Analytics & Progress
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Historical analysis of your sustained cognitive states, tier progression, and semantic assessment mastery.
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Total Study Time
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.totalLearningTimeMinutes || 0}
            <span className="text-xs font-normal text-slate-400 ml-1">mins</span>
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Sessions Completed
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.sessionsCompletedCount || 0}
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Topics Mastered
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.topicsMasteredCount || 0}
          </p>
        </Card>

        <Card className="p-5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">
            Average Score
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {analytics?.averageAssessmentScore || 0}%
          </p>
        </Card>
      </div>

      {/* Cognitive Breakdown & Tier Progression Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cognitive Condition Distribution */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Cognitive Condition Breakdown
            </h3>
          </div>

          {/* Visual Stacked Progress Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
            <div
              style={{ width: `${flowPct}%` }}
              className="bg-teal-500 h-full transition-all"
              title={`Flow: ${flowPct}%`}
            />
            <div
              style={{ width: `${overloadPct}%` }}
              className="bg-rose-500 h-full transition-all"
              title={`Overload: ${overloadPct}%`}
            />
            <div
              style={{ width: `${boredomPct}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Boredom: ${boredomPct}%`}
            />
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Flow State (Optimal Challenge)
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{flowPct}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Cognitive Overload (Relieved)
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{overloadPct}%</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Boredom (Deepened to S-Tier)
              </span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{boredomPct}%</span>
            </div>
          </div>
        </Card>

        {/* Tier Distribution */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Pedagogical Tier Distribution
            </h3>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Badge size="sm" variant="tierB">
                    Tier B
                  </Badge>
                  Foundations
                </span>
                <span className="font-mono">{tierDist.bTierMinutes} mins</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (tierDist.bTierMinutes / (tierDist.bTierMinutes + tierDist.aTierMinutes + tierDist.sTierMinutes || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Badge size="sm" variant="tierA">
                    Tier A
                  </Badge>
                  Core Standard
                </span>
                <span className="font-mono">{tierDist.aTierMinutes} mins</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (tierDist.aTierMinutes / (tierDist.bTierMinutes + tierDist.aTierMinutes + tierDist.sTierMinutes || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium mb-1 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Badge size="sm" variant="tierS">
                    Tier S
                  </Badge>
                  Advanced Invariants
                </span>
                <span className="font-mono">{tierDist.sTierMinutes} mins</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (tierDist.sTierMinutes / (tierDist.bTierMinutes + tierDist.aTierMinutes + tierDist.sTierMinutes || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Adaptation Events History */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-500" />
          <span>Sustained 30-Second Adaptation History</span>
        </h3>

        {analytics?.recentAdaptations && analytics.recentAdaptations.length > 0 ? (
          <div className="space-y-2">
            {analytics.recentAdaptations.map((item, idx) => (
              <Card key={idx} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {item.topicTitle}
                    </span>
                    <Badge size="sm" variant="neutral">
                      Tier {item.fromTier} → Tier {item.toTier}
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">{item.reason}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center text-xs text-slate-400">
            No adaptations recorded yet. As you engage in learning sessions and cognitive conditions persist for 30 seconds, recalibrations will appear here.
          </Card>
        )}
      </section>
    </div>
  );
};
