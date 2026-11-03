import React, { useState } from 'react';
import { useTheme } from '../../design-system/theme';
import { CognitiveNeuralOrb, OrbCognitiveMode } from '../../components/visual/CognitiveNeuralOrb';
import {
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Code2,
  BookOpen,
  Eye,
  CheckCircle2,
  Sun,
  Moon,
  ChevronRight,
  FileText,
  Zap,
} from 'lucide-react';

export interface LandingPageProps {
  onStartLearning: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [orbMode, setOrbMode] = useState<OrbCognitiveMode>('flow');
  const [activeTierDemo, setActiveTierDemo] = useState<'B' | 'A' | 'S'>('A');

  const tierDescriptions = {
    B: {
      name: 'Foundations (Tier B)',
      subtitle: 'Cognitive Overload Reduction • Intuitive Mental Models',
      explanation:
        'Simplifies pedagogical complexity, breaking down distributed consensus into a relatable high-school voting committee analogy with animated state transitions.',
      features: [
        'Analogy-first explanations',
        'Simplified visual flows',
        'Isolated core concepts',
        'Guided self-check practice',
      ],
      accent: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    A: {
      name: 'Core Engineering (Tier A)',
      subtitle: 'Optimal Flow State • Production-Grade Systems',
      explanation:
        'Balanced technical rigor delivering production Raft consensus: leader election heartbeats, term monotonicity, log replication consistency, and safety invariants.',
      features: [
        'Production algorithms & code',
        'Full architectural flowcharts',
        'Failure-recovery mechanics',
        'Conceptual rubric evaluation',
      ],
      accent: 'text-zinc-950 dark:text-white border-zinc-500/30 bg-zinc-500/10',
    },
    S: {
      name: 'Advanced Systems (Tier S)',
      subtitle: 'Boredom Countermeasure • Edge-Cases & Formal Verification',
      explanation:
        'Accelerates pedagogical depth into split-brain network partitions, joint consensus configuration changes, formal TLA+ verification, and zero-copy replication.',
      features: [
        'Formal verification proofs',
        'Split-brain edge case analysis',
        'High-throughput optimizations',
        'Deep synthesis challenges',
      ],
      accent: 'text-zinc-950 dark:text-white border-zinc-500/30 bg-zinc-500/10',
    },
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-950 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950 relative overflow-x-hidden transition-colors duration-300">
      {/* Subtle Ambient Monochrome Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] left-[20%] w-[600px] h-[600px] rounded-full bg-zinc-200/40 dark:bg-zinc-800/15 blur-[140px] transform-gpu" />
        <div className="absolute top-[40%] -right-[10%] w-[550px] h-[550px] rounded-full bg-zinc-200/30 dark:bg-zinc-800/10 blur-[150px] transform-gpu" />
      </div>

      {/* Floating Modern Pill Navigation Header */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300">
        <nav className="w-full max-w-5xl rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-2xl border border-zinc-200/90 dark:border-zinc-800/90 px-4 sm:px-5 py-2.5 flex items-center justify-between shadow-xs ring-1 ring-black/[0.04] dark:ring-white/[0.04]">
          {/* Brand Logo with Pure Monochrome Badge */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-black text-xs tracking-tight shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200">
              CF
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-[15.5px] tracking-[-0.03em] text-zinc-950 dark:text-white leading-none">
                CogFlow
              </span>
              <div className="flex items-center gap-1.5 mt-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  Adaptive Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links - Floating Segmented Capsule */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
            <a
              href="#philosophy"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
            >
              Philosophy
            </a>
            <a
              href="#studios"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150 flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-[10px] font-mono font-bold flex items-center justify-center">
                5
              </span>
              <span>Studios</span>
            </a>
            <a
              href="#matrix"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150"
            >
              Adaptive Matrix
            </a>
            <a
              href="#privacy"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-all duration-150 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>Privacy Invariant</span>
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* 3-Format Theme Toggle: Crisp Light -> Eye-Care Comfort -> Dark OLED */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-all duration-150 active:scale-95"
              title={
                resolvedTheme === 'light'
                  ? 'Active: Crisp Light • Click for Comfort Mode (Eye Care)'
                  : resolvedTheme === 'comfort'
                  ? 'Active: Comfort Mode (Warm Off-White) • Click for Dark Mode'
                  : 'Active: Dark Mode (OLED) • Click for Crisp Light Mode'
              }
            >
              {resolvedTheme === 'dark' ? (
                <Moon className="w-4 h-4 text-zinc-100" />
              ) : resolvedTheme === 'comfort' ? (
                <Eye className="w-4 h-4 text-amber-800 dark:text-amber-200" />
              ) : (
                <Sun className="w-4 h-4 text-zinc-800" />
              )}
            </button>

            <button
              onClick={onStartLearning}
              className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-[13px] font-bold tracking-[-0.02em] shadow-xs active:scale-95 transition-all duration-200"
            >
              <span>Launch Cockpit</span>
              <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-all duration-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Accent Tag with Radar Ping */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 mb-8 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-zinc-950 dark:text-white tracking-tight">Cognitive Invariant 2.0</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-zinc-500 font-mono">30-Second Sustained State Adaptation</span>
        </div>

        {/* Central Manifesto Title - Pure Monochrome High-Contrast */}
        <div className="text-center max-w-4xl space-y-4">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-zinc-950 dark:text-white leading-[1.02] font-display">
            Adaptive Intelligence <br />
            <span className="font-serif italic font-normal text-zinc-600 dark:text-zinc-400">
              For Pure Mastery
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed pt-2 font-normal">
            CogFlow dynamically recalibrates pedagogical depth between <strong className="text-zinc-950 dark:text-white">Foundations</strong>, <strong className="text-zinc-950 dark:text-white">Core Engineering</strong>, and <strong className="text-zinc-950 dark:text-white">Advanced Formal Systems</strong> based on continuous on-device cognitive state inference.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onStartLearning}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <span>Launch Studio Cockpit</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="#matrix"
              className="px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-semibold border border-zinc-200 dark:border-zinc-800 transition-all"
            >
              Explore 3-Tier Depth
            </a>
          </div>
        </div>

        {/* 3D Neural Topological Visualizer Row */}
        <div className="mt-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="lg:col-span-3 space-y-3 text-left">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
              Real-Time Inference
            </span>
            <h3 className="text-xl font-black text-zinc-950 dark:text-white font-display leading-tight">
              Sustained 30-Second Invariant
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Inferred state transitions require a 30-second sustained baseline, ensuring transient blinks or pauses never trigger jarring UI shifts.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <CognitiveNeuralOrb mode={orbMode} size={360} />

            <div className="mt-4 flex items-center gap-2 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setOrbMode('flow')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'flow'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                ● Flow State
              </button>
              <button
                onClick={() => setOrbMode('overload')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'overload'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                ▲ Overload (Relieved)
              </button>
              <button
                onClick={() => setOrbMode('boredom')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'boredom'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                ■ Boredom (Deepened)
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6 text-left lg:pl-4">
            <div className="space-y-1">
              <div className="text-3xl font-black text-zinc-950 dark:text-white font-display">
                30s
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide font-mono">
                Sustained Barrier
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Prevents hysteresis and maintains pedagogical continuity.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-zinc-950 dark:text-white font-display">
                5 Studios
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide font-mono">
                Multimodal Modalities
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Learn, Visual, Code, Notes, and Practice Studios.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-black text-zinc-950 dark:text-white font-display">
                3 Tiers
              </div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide font-mono">
                B · A · S Depths
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Foundations, Core Systems, and Formal Proofs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Pedagogical Studios Showcase (Bento Grid) */}
      <section id="studios" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            5 Pedagogical Modalities
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
            Engineered for Total Conceptual Clarity
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            One explanation is rarely enough. CogFlow organizes every technical subject into five synchronized pedagogical studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Studio 1: Learn */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white shadow-xs transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-800">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 font-display">
              Learn Studio
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Structured conceptual prose, mental models, and deep explanations. Includes an interactive section navigator and highlighted core principles.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
              Prose • Analogy • Key Takeaways
            </div>
          </div>

          {/* Studio 2: Visual */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white shadow-xs transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-800">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 font-display">
              Visual Studio
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              High-fidelity architectural diagrams and step-by-step phase inspectors. Watch data flow across nodes, cluster splits, and recovery states.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
              Interactive SVG • Phase Inspector
            </div>
          </div>

          {/* Studio 3: Code */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white shadow-xs transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-800">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 font-display">
              Code Studio
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Production implementations with line-by-line algorithmic invariants, time/space asymptotic complexity analysis, and edge case guards.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
              TypeScript / Go / Python • Invariant Guards
            </div>
          </div>

          {/* Studio 4: Notes (Spans 2 cols on md) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white shadow-xs transition-all duration-200 group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-800">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 font-display">
                Notes Studio (Active Recall & Cheat Sheets)
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
                3D interactive flipcards for spaced repetition, quick-review formula sheets, KaTeX mathematical theorems, and personal scratchpads.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
              <span>✓ 3D Flip Flashcards</span>
              <span>•</span>
              <span>✓ Spaced Repetition</span>
              <span>•</span>
              <span>✓ KaTeX TeX Formulas</span>
            </div>
          </div>

          {/* Studio 5: Practice */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-white shadow-xs transition-all duration-200 group">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform border border-zinc-200 dark:border-zinc-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 font-display">
              Practice Studio
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              8-10 multiple-choice challenges paired with open-ended conceptual explanations evaluated against semantic rubrics with instant feedback.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
              8-10 MCQs • Semantic Rubrics • Step Stepper
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Tier Multi-Dimensional Matrix (B / A / S) */}
      <section id="matrix" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Tri-Tier Adaptive Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
            Same Subject. Three Calibrated Depths.
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            See how CogFlow dynamically shifts pedagogical depth when cognitive overload or boredom is sustained.
          </p>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex justify-center mb-9">
          <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex gap-2">
            {(['B', 'A', 'S'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTierDemo(tier)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeTierDemo === tier
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                Tier {tier} — {tier === 'B' ? 'Foundations' : tier === 'A' ? 'Core' : 'Advanced'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tier Preview Card */}
        <div className="p-8 sm:p-11 rounded-3xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-6">
            <div>
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${tierDescriptions[activeTierDemo].accent} mb-2 font-mono`}>
                {tierDescriptions[activeTierDemo].name}
              </span>
              <h3 className="text-2xl font-black text-zinc-950 dark:text-white font-display">
                Distributed Consensus (Raft Protocol)
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {tierDescriptions[activeTierDemo].subtitle}
            </div>
          </div>

          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-8">
            {tierDescriptions[activeTierDemo].explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {tierDescriptions[activeTierDemo].features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy-by-Design Section */}
      <section id="privacy" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white border border-zinc-800 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Privacy Invariant</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight font-display">
              Zero Raw Video Frames Ever Leave Your Machine.
            </h3>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              CogFlow adheres to a strict architectural boundary: facial and cognitive inference occurs exclusively on-device via isolated feature extractors. The backend API receives only high-level numerical telemetry vectors (<code className="text-zinc-200 font-mono">CognitiveTelemetryPayload</code>).
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                ✓ No cloud webcam streaming
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                ✓ 100% User Opt-In Control
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                ✓ External Model Adapter Contract
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Master CTA Deck */}
      <section className="relative z-10 py-28 px-6 max-w-4xl mx-auto text-center space-y-7">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white leading-tight font-display">
          Ready to experience <br />
          <span className="font-serif italic font-normal text-zinc-600 dark:text-zinc-400">Calm Precision</span> Learning?
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Launch the cockpit, select any computer science or distributed systems topic, and experience adaptive depth in action.
        </p>
        <div className="pt-4">
          <button
            onClick={onStartLearning}
            className="group inline-flex items-center gap-4 pl-9 pr-5 py-4 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 font-extrabold text-base shadow-xs transition-all duration-200 active:scale-95"
          >
            <span>Launch Studio Cockpit</span>
            <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* Modern Footer Dock */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800 py-8 px-6 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-[10px]">
              CF
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white font-sans">CogFlow Architecture</span>
            <span>—</span>
            <span>Cognitive-Aware Adaptive Intelligence</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#philosophy" className="hover:text-zinc-950 dark:hover:text-white transition">Philosophy</a>
            <a href="#studios" className="hover:text-zinc-950 dark:hover:text-white transition">Studios</a>
            <a href="#matrix" className="hover:text-zinc-950 dark:hover:text-white transition">Matrix</a>
            <button onClick={onStartLearning} className="hover:text-zinc-950 dark:hover:text-white font-semibold transition">
              Cockpit ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
