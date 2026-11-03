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
  Compass,
  FileText,
  RotateCw,
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
      explanation: 'Simplifies pedagogical complexity, breaking down distributed consensus into a relatable high-school voting committee analogy with animated state transitions.',
      features: ['Analogy-first explanations', 'Simplified visual flows', 'Isolated core concepts', 'Guided self-check practice'],
      accent: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    },
    A: {
      name: 'Core Engineering (Tier A)',
      subtitle: 'Optimal Flow State • Production-Grade Systems',
      explanation: 'Balanced technical rigor delivering production Raft consensus: leader election heartbeats, term monotonicity, log replication consistency, and safety invariants.',
      features: ['Production algorithms & code', 'Full architectural flowcharts', 'Failure-recovery mechanics', 'Conceptual rubric evaluation'],
      accent: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
    },
    S: {
      name: 'Advanced Systems (Tier S)',
      subtitle: 'Boredom Countermeasure • Edge-Cases & Formal Verification',
      explanation: 'Accelerates pedagogical depth into split-brain network partitions, joint consensus configuration changes, formal TLA+ verification, and zero-copy replication.',
      features: ['Formal verification proofs', 'Split-brain edge case analysis', 'High-throughput optimizations', 'Deep synthesis challenges'],
      accent: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#07090e] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      {/* Ambient Background Radial Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] left-[20%] w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-cyan-400/15 via-blue-500/10 to-indigo-500/15 dark:from-cyan-500/20 dark:via-blue-600/10 dark:to-purple-600/20 blur-[140px] transform-gpu" />
        <div className="absolute top-[40%] -right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-purple-400/15 via-pink-500/10 to-amber-400/15 dark:from-purple-600/15 dark:via-rose-600/10 dark:to-blue-600/15 blur-[150px] transform-gpu" />
        <div className="absolute bottom-[5%] left-[5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-400/10 via-cyan-400/10 to-blue-500/10 dark:from-teal-500/15 dark:via-blue-600/10 dark:to-indigo-600/10 blur-[130px] transform-gpu" />
      </div>

      {/* Floating Modern Pill Header */}
      <header className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-5xl rounded-full bg-white/70 dark:bg-[#0c1017]/70 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 px-5 py-3 flex items-center justify-between shadow-glass">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm tracking-tight">
              CF
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                CogFlow
              </span>
              <span className="text-[9px] uppercase tracking-widest text-teal-600 dark:text-teal-400 font-bold -mt-0.5">
                Adaptive Intelligence
              </span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#philosophy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Philosophy
            </a>
            <a href="#studios" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              5 Studios
            </a>
            <a href="#matrix" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Adaptive Matrix
            </a>
            <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Invariant
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onStartLearning}
              className="group inline-flex items-center gap-2 pl-4 pr-2.5 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              <span>Launch Studio</span>
              <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Accent Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-md">
          {/* Neon Star Accent from reference */}
          <svg className="w-4 h-4 text-lime-500 fill-lime-500 animate-spin-slow" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <span className="font-semibold text-slate-900 dark:text-white">Cognitive Invariant 2.0</span>
          <span className="text-slate-400">·</span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">Real-Time Depth Calibration</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white text-center leading-[1.08] max-w-4xl">
          Empower Deep Tech Mastery <br className="hidden sm:inline" />
          with <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400 bg-clip-text text-transparent">Cognitive Intelligence</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 text-center max-w-2xl leading-relaxed font-normal">
          Rather than forcing every engineer through static video slides, CogFlow continuously perceives cognitive load, flow, and boredom—calibrating pedagogical depth across 5 multi-modal studios.
        </p>

        {/* CTA Button Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartLearning}
            className="group inline-flex items-center gap-3 pl-6 pr-3.5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95"
          >
            <span>Enter Studio Cockpit</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>

          <a
            href="#matrix"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-white/10 transition-all duration-200 backdrop-blur-md"
          >
            <span>Explore Adaptive Matrix</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Centerpiece Layout (Center 3D Orb flanked by narrative and stats) */}
        <div className="mt-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Narrative Pillar */}
          <div className="lg:col-span-3 text-left space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
              The Cognitive Loop
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Perceive. Interpret. Adapt. Teach. Evaluate.
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              At CogFlow, learning is dynamic. When cognitive overload is sustained for 30s, the engine seamlessly reduces pedagogical density without breaking your concentration.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% On-Device Processing</span>
              </div>
            </div>
          </div>

          {/* Center 3D Topological Cognitive Neural Orb */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <CognitiveNeuralOrb mode={orbMode} size={380} />

            {/* Interactive Mode Selector Pills */}
            <div className="mt-4 flex items-center gap-2 p-1.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm">
              <button
                onClick={() => setOrbMode('flow')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  orbMode === 'flow'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ● Flow State
              </button>
              <button
                onClick={() => setOrbMode('overload')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  orbMode === 'overload'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ▲ Overload (Auto-Simplify)
              </button>
              <button
                onClick={() => setOrbMode('boredom')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  orbMode === 'boredom'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ■ Boredom (Deepen Challenge)
              </button>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
              Click any state to test real-time topological mesh resonance
            </span>
          </div>

          {/* Right Asymmetric High-Impact Stats */}
          <div className="lg:col-span-3 space-y-6 text-left lg:pl-6">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                30s
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sustained Adaptation Invariant
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Eliminates UI flickering and transient glance noise.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                5 Studios
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Multi-Modal Knowledge Delivery
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Learn, Visual, Code, Notes, and Practice.
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
                3 Tiers
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Foundations · Core · Advanced
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                Tri-level calibrated content per concept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Pedagogical Studios Showcase (Bento Grid) */}
      <section id="studios" className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            5 Pedagogical Modalities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered for Comprehensive Mastery
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            One explanation is rarely enough. CogFlow organizes every technical subject into five coordinated pedagogical studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Studio 1: Learn */}
          <div className="p-7 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-blue-500/40 transition-all duration-300 group shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Learn Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Structured conceptual prose, mental models, and deep explanations. Includes an interactive section navigator and highlighted key principles.
            </p>
            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Prose • Analogy • Key Takeaways
            </div>
          </div>

          {/* Studio 2: Visual */}
          <div className="p-7 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-300 group shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Visual Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              High-fidelity architectural diagrams and step-by-step phase inspectors. Watch data flow across nodes, cluster splits, and recovery states.
            </p>
            <div className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-semibold">
              Interactive SVG • Phase Inspector
            </div>
          </div>

          {/* Studio 3: Code */}
          <div className="p-7 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 group shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Code Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Production implementations with line-by-line algorithmic invariants, time/space asymptotic complexity analysis, and edge case guards.
            </p>
            <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              TypeScript / Go / Python • O(N) Invariants
            </div>
          </div>

          {/* Studio 4: Notes (Spans 2 cols on md) */}
          <div className="md:col-span-2 p-7 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-purple-500/40 transition-all duration-300 group shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Notes Studio (Active Recall & Formula Cheat Sheets)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                3D flip flashcards for spaced repetition, quick-review formulas, mathematical KaTeX theorems, and learner personal annotation scratchpads.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
              <span>✓ 3D Flip Flashcards</span>
              <span>•</span>
              <span>✓ Spaced Repetition</span>
              <span>•</span>
              <span>✓ KaTeX TeX Formulas</span>
            </div>
          </div>

          {/* Studio 5: Practice */}
          <div className="p-7 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl hover:border-amber-500/40 transition-all duration-300 group shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Practice Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Multi-choice diagnostics paired with open-ended conceptual explanations graded against semantic AI rubrics with instant feedback.
            </p>
            <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
              Semantic AI Rubrics • Conceptual Scoring
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Tier Multi-Dimensional Matrix (B / A / S) */}
      <section id="matrix" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Tri-Tier Adaptive Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Same Topic. Three Pedagogical Depths.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            See how CogFlow dynamically shifts depth when cognitive overload or boredom is detected.
          </p>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md flex gap-2">
            {(['B', 'A', 'S'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTierDemo(tier)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                  activeTierDemo === tier
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tier {tier} — {tier === 'B' ? 'Foundations' : tier === 'A' ? 'Core' : 'Advanced'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tier Preview Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#0c1017]/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-2xl shadow-xl shadow-slate-900/5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold border ${tierDescriptions[activeTierDemo].accent} mb-2`}>
                {tierDescriptions[activeTierDemo].name}
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Distributed Consensus (Raft)
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {tierDescriptions[activeTierDemo].subtitle}
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
            {tierDescriptions[activeTierDemo].explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tierDescriptions[activeTierDemo].features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy-by-Design Section */}
      <section id="privacy" className="relative z-10 py-24 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Light Orb inside */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Privacy Invariant</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Zero Raw Video Frames Ever Leave Your Device.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              CogFlow adheres to a strict architectural boundary: facial and cognitive inference occurs exclusively on-device via isolated feature extractors. The backend API receives only high-level numerical telemetry vectors (<code className="text-teal-300 font-mono">CognitiveTelemetryPayload</code>).
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                ✓ No cloud webcam streaming
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                ✓ 100% User Opt-In Control
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                ✓ External Model Adapter Contract
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Master CTA Deck */}
      <section className="relative z-10 py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Ready to experience <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400 bg-clip-text text-transparent">
            Calm Precision Learning?
          </span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Launch the cockpit, select any computer science or distributed systems topic, and experience adaptive depth in action.
        </p>
        <div className="pt-4">
          <button
            onClick={onStartLearning}
            className="group inline-flex items-center gap-3 pl-8 pr-4 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition-all duration-200 active:scale-95"
          >
            <span>Launch Studio Cockpit</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* Floating Modern Footer Dock */}
      <footer className="relative z-10 border-t border-slate-200/80 dark:border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              CF
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">CogFlow Architecture</span>
            <span>—</span>
            <span>Cognitive-Aware Adaptive Intelligence</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="#philosophy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Philosophy</a>
            <a href="#studios" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Studios</a>
            <a href="#matrix" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Matrix</a>
            <button onClick={onStartLearning} className="hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">
              Cockpit ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
