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
      accent: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
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
      accent: 'text-blue-500 border-blue-500/30 bg-blue-500/10',
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
      accent: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    },
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#06080e] text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden transition-colors duration-500">
      {/* Dynamic Animated Ambient Auroras */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[18%] left-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-600/20 dark:from-cyan-500/25 dark:via-blue-600/15 dark:to-purple-600/25 blur-[140px] animate-aurora-glow transform-gpu" />
        <div className="absolute top-[35%] -right-[12%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/20 via-pink-500/15 to-amber-400/20 dark:from-purple-600/20 dark:via-rose-600/15 dark:to-blue-600/20 blur-[150px] animate-aurora-glow transform-gpu" />
        <div className="absolute bottom-[2%] left-[8%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-teal-400/15 via-cyan-400/15 to-blue-500/15 dark:from-teal-500/20 dark:via-blue-600/15 dark:to-indigo-600/20 blur-[130px] animate-aurora-glow transform-gpu" />
      </div>

      {/* Floating Modern Pill Navigation Header */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300">
        <nav className="w-full max-w-5xl rounded-full bg-white/80 dark:bg-[#070b14]/85 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-5 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.45)] ring-1 ring-black/[0.02] dark:ring-white/[0.04]">
          {/* Brand Logo with Bespoke Neural Squircle */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-sm shadow-blue-500/25 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-[14px] bg-slate-900 dark:bg-[#090d16] flex items-center justify-center text-white font-black text-xs tracking-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent font-black">
                  CF
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-[15.5px] tracking-[-0.03em] text-slate-900 dark:text-white leading-none group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                CogFlow
              </span>
              <div className="flex items-center gap-1.5 mt-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-teal-600 dark:text-teal-400">
                  Adaptive Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Links - Floating Segmented Capsule */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/50 dark:border-white/[0.06] backdrop-blur-md">
            <a
              href="#philosophy"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200 hover:shadow-2xs"
            >
              Philosophy
            </a>
            <a
              href="#studios"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200 hover:shadow-2xs flex items-center gap-1.5"
            >
              <span className="w-4 h-4 rounded-full bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center">
                5
              </span>
              <span>Studios</span>
            </a>
            <a
              href="#matrix"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200 hover:shadow-2xs"
            >
              Adaptive Matrix
            </a>
            <a
              href="#privacy"
              className="px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-[-0.015em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200 hover:shadow-2xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
              <span>Privacy Invariant</span>
            </a>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-slate-100/80 dark:bg-white/[0.05] border border-slate-200/60 dark:border-white/[0.08] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-all duration-200 active:scale-95 shadow-2xs"
              title="Toggle Light/Dark Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <button
              onClick={onStartLearning}
              className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-[13px] font-semibold tracking-[-0.02em] shadow-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
            >
              <span>Launch Cockpit</span>
              <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:rotate-45 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-all duration-200">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-36 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center">
        {/* Accent Tag with Neon Lime Spark Element & Radar Ping */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-slate-700 dark:text-slate-300 mb-8 shadow-sm">
          {/* Neon Star Spark */}
          <svg className="w-4 h-4 text-lime-500 dark:text-lime-400 fill-current animate-spin-slow drop-shadow-[0_0_8px_rgba(163,230,53,0.7)]" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">Cognitive Invariant 2.0</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-teal-600 dark:text-teal-400 font-semibold">Real-Time Depth Calibration</span>
        </div>

        {/* Master Typographic Headline Pairing Ultra-Bold & Luxury Cursive Italic */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white text-center leading-[1.04] max-w-5xl">
          Empower Your Mind <br />
          with <span className="font-cursive font-normal text-6xl sm:text-8xl md:text-9xl text-blue-600 dark:text-cyan-400 px-1 inline-block hover:scale-105 transition-transform duration-300 cursor-default">Adaptive</span>{' '}
          <span className="text-gradient-iridescent font-black tracking-tight">Excellence</span>
        </h1>

        <p className="mt-7 text-base sm:text-xl text-slate-600 dark:text-slate-300 text-center max-w-2xl leading-relaxed font-normal">
          Rather than forcing every learner through static, one-size-fits-all curricula, CogFlow perceives cognitive load, flow, and boredom—continuously calibrating pedagogical depth across five coordinated studios.
        </p>

        {/* CTA Button Row */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartLearning}
            className="group inline-flex items-center gap-3.5 pl-7 pr-4 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all duration-200 active:scale-95 hover:shadow-glowCyan"
          >
            <span>Enter Studio Cockpit</span>
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-45 transition-transform duration-200">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>

          <a
            href="#matrix"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full glass-panel hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all duration-200 shadow-sm"
          >
            <span>Explore Adaptive Matrix</span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Centerpiece Layout (Center 3D Orb flanked by narrative and stats) */}
        <div className="mt-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="philosophy">
          {/* Left Narrative Pillar */}
          <div className="lg:col-span-3 text-left space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 block font-mono">
              The Cognitive Loop
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              Where <span className="font-cursive text-2xl font-normal text-indigo-600 dark:text-indigo-400">Human Capacity</span> Meets Deep Engineering.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              At CogFlow, learning is dynamic. When cognitive overload is sustained for 30 seconds, the engine automatically simplifies pedagogical density without breaking your focus.
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-xs font-semibold text-teal-700 dark:text-teal-300">
                <ShieldCheck className="w-4 h-4 text-teal-500" />
                <span>100% Privacy Preserved (On-Device)</span>
              </div>
            </div>
          </div>

          {/* Center 3D Topological Cognitive Neural Orb */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <CognitiveNeuralOrb mode={orbMode} size={390} />

            {/* Interactive Mode Selector Pills */}
            <div className="mt-4 flex items-center gap-2 p-1.5 rounded-full glass-panel shadow-sm">
              <button
                onClick={() => setOrbMode('flow')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'flow'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ● Flow State
              </button>
              <button
                onClick={() => setOrbMode('overload')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'overload'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ▲ Overload (Auto-Simplify)
              </button>
              <button
                onClick={() => setOrbMode('boredom')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orbMode === 'boredom'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ■ Boredom (Deepen Challenge)
              </button>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 font-mono">
              Click any state to test real-time topological mesh resonance
            </span>
          </div>

          {/* Right Asymmetric High-Impact Stats */}
          <div className="lg:col-span-3 space-y-7 text-left lg:pl-6">
            <div className="space-y-1 group cursor-default">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display text-gradient-iridescent">
                30s
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Sustained Adaptation Invariant
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Prevents UI oscillation by requiring sustained signals before recalibrating depth.
              </p>
            </div>

            <div className="space-y-1 group cursor-default">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display text-gradient-iridescent">
                5 Studios
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Multi-Modal Knowledge Modalities
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Learn, Visual, Code, Notes, and Practice Studios.
              </p>
            </div>

            <div className="space-y-1 group cursor-default">
              <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display text-gradient-iridescent">
                3 Tiers
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Foundations · Core · Advanced
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamless depth progression calibrated per concept.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Pedagogical Studios Showcase (Bento Grid) */}
      <section id="studios" className="relative z-10 py-28 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-mono">
            5 Pedagogical Modalities
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Engineered for <span className="font-cursive font-normal text-5xl sm:text-6xl text-blue-600 dark:text-cyan-400">Total Conceptual</span> Clarity
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            One explanation is rarely enough. CogFlow organizes every technical subject into five synchronized pedagogical studios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Studio 1: Learn */}
          <div className="p-8 rounded-3xl glass-panel hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-glowCyan transition-all duration-300 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Learn Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Structured conceptual prose, mental models, and deep explanations. Includes an interactive section navigator and highlighted core principles.
            </p>
            <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
              Prose • Analogy • Key Takeaways
            </div>
          </div>

          {/* Studio 2: Visual */}
          <div className="p-8 rounded-3xl glass-panel hover:-translate-y-1 hover:border-teal-500/50 hover:shadow-glowCyan transition-all duration-300 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
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
          <div className="p-8 rounded-3xl glass-panel hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-glowIndigo transition-all duration-300 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Code Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Production implementations with line-by-line algorithmic invariants, time/space asymptotic complexity analysis, and edge case guards.
            </p>
            <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              TypeScript / Go / Python • Invariant Guards
            </div>
          </div>

          {/* Studio 4: Notes (Spans 2 cols on md) */}
          <div className="md:col-span-2 p-8 rounded-3xl glass-panel hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-glowPurple transition-all duration-300 group shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Notes Studio <span className="font-cursive text-xl font-normal text-purple-600 dark:text-purple-400">(Active Recall & Cheat Sheets)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                3D interactive flipcards for spaced repetition, quick-review formula sheets, KaTeX mathematical theorems, and personal scratchpads.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-3 text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">
              <span>✓ 3D Flip Flashcards</span>
              <span>•</span>
              <span>✓ Spaced Repetition</span>
              <span>•</span>
              <span>✓ KaTeX TeX Formulas</span>
            </div>
          </div>

          {/* Studio 5: Practice */}
          <div className="p-8 rounded-3xl glass-panel hover:-translate-y-1 hover:border-amber-500/50 transition-all duration-300 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
              Practice Studio
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Multi-choice diagnostics paired with open-ended conceptual explanations evaluated against semantic AI rubrics with instant feedback.
            </p>
            <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
              Semantic AI Rubrics • Conceptual Scoring
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Tier Multi-Dimensional Matrix (B / A / S) */}
      <section id="matrix" className="relative z-10 py-28 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
            Tri-Tier Adaptive Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Same Subject. <span className="font-cursive font-normal text-5xl sm:text-6xl text-teal-600 dark:text-teal-400">Three Calibrated</span> Depths.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            See how CogFlow dynamically shifts pedagogical depth when cognitive overload or boredom is sustained.
          </p>
        </div>

        {/* Tier Selector Pills */}
        <div className="flex justify-center mb-9">
          <div className="p-1.5 rounded-full glass-panel flex gap-2">
            {(['B', 'A', 'S'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTierDemo(tier)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
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

        {/* Active Tier Preview Card with Refined Shadow */}
        <div className="p-8 sm:p-11 rounded-3xl glass-panel shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
            <div>
              <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold border ${tierDescriptions[activeTierDemo].accent} mb-2`}>
                {tierDescriptions[activeTierDemo].name}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Distributed Consensus (Raft Protocol)
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {tierDescriptions[activeTierDemo].subtitle}
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
            {tierDescriptions[activeTierDemo].explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {tierDescriptions[activeTierDemo].features.map((feat, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80"
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
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800/90 relative overflow-hidden shadow-2xl">
          {/* Subtle Ambient Light Orb inside */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Strict Privacy Invariant</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Zero Raw Video Frames <br />
              <span className="font-cursive font-normal text-4xl sm:text-5xl text-teal-400">Ever Leave</span> Your Machine.
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
      <section className="relative z-10 py-28 px-6 max-w-4xl mx-auto text-center space-y-7">
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Ready to experience <br />
          <span className="font-cursive font-normal text-5xl sm:text-7xl text-blue-600 dark:text-cyan-400">Calm Precision</span>{' '}
          <span className="text-gradient-iridescent font-black">Learning?</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Launch the cockpit, select any computer science or distributed systems topic, and experience adaptive depth in action.
        </p>
        <div className="pt-4">
          <button
            onClick={onStartLearning}
            className="group inline-flex items-center gap-4 pl-9 pr-5 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-2xl shadow-blue-500/30 transition-all duration-200 active:scale-95 hover:shadow-glowCyan"
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
            <a href="#philosophy" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Philosophy</a>
            <a href="#studios" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Studios</a>
            <a href="#matrix" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Matrix</a>
            <button onClick={onStartLearning} className="hover:text-blue-600 dark:hover:text-cyan-400 font-semibold transition">
              Cockpit ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
