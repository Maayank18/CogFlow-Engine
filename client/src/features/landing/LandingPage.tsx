import React, { useState } from 'react';
import { Button } from '../../components/ui/Button.js';
import { Badge } from '../../components/ui/Badge.js';
import { Card } from '../../components/ui/Card.js';
import { useTheme } from '../../design-system/theme.js';
import {
  Brain,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  BookOpen,
  Code2,
  Eye,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export interface LandingPageProps {
  onStartLearning: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, onOpenAuth }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [selectedDemoTier, setSelectedDemoTier] = useState<'B' | 'A' | 'S'>('A');

  return (
    <div className="min-h-screen bg-canvas-light dark:bg-canvas-dark text-slate-800 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f17]/70 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            CF
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
              CogFlow
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider block -mt-1">
              Adaptive Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Button variant="ghost" onClick={onOpenAuth}>
            Sign In
          </Button>
          <Button onClick={onStartLearning} icon={<ArrowRight className="w-4 h-4" />}>
            Launch Studio
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <Badge variant="primary" dot size="md">
          Calm Precision Architecture · Next-Gen EdTech
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
          Learning that perceives your condition. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
            Continuously adapting pedagogical depth.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Traditional platforms deliver static courses regardless of confusion or boredom.
          CogFlow continuously recalibrates explanations, visualizations, code walkthroughs, and assessments between Foundations, Core, and Advanced mastery.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button size="lg" onClick={onStartLearning} icon={<ArrowRight className="w-4 h-4" />}>
            Explore Learning Catalog
          </Button>
          <Button size="lg" variant="outline" onClick={onOpenAuth}>
            Create Learner Profile
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            100% Privacy-Preserved (Zero Biometric Uploads)
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-blue-500" />
            Local Ollama + Cloud AI Fallback
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-purple-500" />
            30-Second Sustained Adaptation Invariant
          </span>
        </div>
      </section>

      {/* The Fundamental Cognitive Cycle */}
      <section className="py-16 px-6 bg-slate-50/60 dark:bg-[#121824]/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              The Cognitive Learning Cycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Perceive · Interpret · Adapt · Teach · Evaluate · Improve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overload */}
            <Card className="p-6 space-y-3 border-rose-200 dark:border-rose-950/60">
              <Badge variant="overload" dot>
                Cognitive Overload
              </Badge>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Foundations Tier (B)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When concept density causes overload, CogFlow steps down complexity. Introduces real-world analogies, step-by-step scaffolding, visual intuition, and minimal jargon.
              </p>
            </Card>

            {/* Flow */}
            <Card className="p-6 space-y-3 border-teal-200 dark:border-teal-950/60">
              <Badge variant="flow" dot>
                Flow State
              </Badge>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Core Standard Tier (A)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Preserves uninterrupted study when challenge matches learner capability. Delivers formal concepts, architecture diagrams, production code, and engineering trade-offs.
              </p>
            </Card>

            {/* Boredom */}
            <Card className="p-6 space-y-3 border-amber-200 dark:border-amber-950/60">
              <Badge variant="boredom" dot>
                Boredom / Under-challenged
              </Badge>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Advanced Tier (S)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                When material is insufficiently challenging, CogFlow steps up depth. Introduces mathematical derivations, lock-free concurrency, distributed invariants, and research edge cases.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Multi-Tier Demonstration */}
      <section className="py-20 px-6 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="neutral">Interactive Multi-Tier Preview</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            One Concept, Three Pedagogical Depths
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Click across tiers to experience how the exact same objective adapts its explanation and rigor.
          </p>
        </div>

        {/* Tier Selector Buttons */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedDemoTier('B')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedDemoTier === 'B'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-[#121824] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            Tier B · Foundations
          </button>
          <button
            onClick={() => setSelectedDemoTier('A')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedDemoTier === 'A'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-[#121824] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            Tier A · Core Standard
          </button>
          <button
            onClick={() => setSelectedDemoTier('S')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              selectedDemoTier === 'S'
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-white dark:bg-[#121824] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
            }`}
          >
            Tier S · Advanced Rigor
          </button>
        </div>

        {/* Preview Card */}
        <Card className="p-8 max-w-3xl mx-auto shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Distributed Consensus (Raft Protocol)
            </span>
            <Badge variant={selectedDemoTier === 'S' ? 'tierS' : selectedDemoTier === 'B' ? 'tierB' : 'tierA'}>
              Tier {selectedDemoTier} Explanation
            </Badge>
          </div>

          {selectedDemoTier === 'B' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
              <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                The Town Hall Analogy
              </strong>
              <p>
                Imagine a committee of 5 people who must keep a single notebook updated. If anyone could write whenever they wanted, notes would conflict.
              </p>
              <p>
                Instead, they elect 1 leader with a timer. Only the leader accepts new entries and ensures at least 3 people copy it before calling it official.
              </p>
            </div>
          )}

          {selectedDemoTier === 'A' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
              <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Replicated State Machine Mechanics
              </strong>
              <p>
                Raft decomposes distributed consensus into leader election, log replication, and safety. A cluster of $2F+1$ nodes tolerates $F$ crash failures.
              </p>
              <p>
                Heartbeat intervals and randomized election timeouts prevent split-vote deadlocks during concurrent leader claims.
              </p>
            </div>
          )}

          {selectedDemoTier === 'S' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 animate-in fade-in duration-150">
              <strong className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Formal State Invariants & PACELC Trade-offs
              </strong>
              <p>
                Under linearizability invariants, Raft guarantees the Election Safety Property: at most one leader can be elected in a given term $\tau$.
              </p>
              <p>
                Asymmetric network partitions (e.g. partition where leader can contact follower B but not C) are resolved via pre-vote phases, bounding tail latency and avoiding disruptive term inflation.
              </p>
            </div>
          )}
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 CogFlow Engineering. Calm Precision Cognitive Architecture. Built for modern learners.</p>
      </footer>
    </div>
  );
};

