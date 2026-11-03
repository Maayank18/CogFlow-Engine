import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './design-system/theme';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LandingPage } from './features/landing/LandingPage';
import { OnboardingModal } from './features/onboarding/OnboardingModal';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { SubjectCatalogPage } from './features/subjects/SubjectCatalogPage';
import { DocumentUploadPage } from './features/documents/DocumentUploadPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { LearningCockpit } from './features/learning/LearningCockpit';
import { Button } from './components/ui/Button';
import {
  LayoutDashboard,
  Compass,
  FileUp,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  Globe,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

type MainView = 'dashboard' | 'subjects' | 'documents' | 'analytics' | 'settings';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [currentView, setCurrentView] = useState<MainView>('dashboard');
  const [activeCockpitTopicId, setActiveCockpitTopicId] = useState<string | null>(null);
  const [activeCockpitTier, setActiveCockpitTier] = useState<'B' | 'A' | 'S'>('A');
  const [showLandingPreview, setShowLandingPreview] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active learning cockpit (Distraction-minimized full-screen)
  if (activeCockpitTopicId) {
    return (
      <LearningCockpit
        topicId={activeCockpitTopicId}
        initialTier={activeCockpitTier}
        onExit={() => setActiveCockpitTopicId(null)}
      />
    );
  }

  // Public Landing Page Preview
  if (showLandingPreview) {
    return (
      <LandingPage
        onStartLearning={() => setShowLandingPreview(false)}
        onOpenAuth={() => setShowLandingPreview(false)}
      />
    );
  }

  const handleLaunchTopic = (topicId: string, tier: 'B' | 'A' | 'S' = 'A') => {
    setActiveCockpitTopicId(topicId);
    setActiveCockpitTier(tier);
  };

  const workspaceNav = [
    { id: 'dashboard' as MainView, label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subjects' as MainView, label: 'Curriculum Catalog', icon: <Compass className="w-4 h-4" /> },
    { id: 'documents' as MainView, label: 'Syllabus Ingestion', icon: <FileUp className="w-4 h-4" /> },
  ];

  const intelligenceNav = [
    { id: 'analytics' as MainView, label: 'Cognitive Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings' as MainView, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentViewLabel =
    [...workspaceNav, ...intelligenceNav].find((n) => n.id === currentView)?.label || 'Overview';

  return (
    <div className="flex h-screen bg-[#fafbfc] dark:bg-[#07090e] text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Onboarding Dialog for First-Time Setup */}
      <OnboardingModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />

      {/* Main Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0a0d14]/90 backdrop-blur-2xl flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-sm shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full rounded-[14px] bg-slate-900 dark:bg-[#090d16] flex items-center justify-center text-white font-black text-xs tracking-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent font-black">
                  CF
                </span>
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-[15px] tracking-[-0.03em] text-slate-900 dark:text-white block leading-tight">
                CogFlow
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-teal-600 dark:text-teal-400">
                  Calm Precision
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Workspace Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono px-3 block mb-2">
              Workspace
            </span>
            {workspaceNav.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Intelligence Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono px-3 block mb-2">
              Intelligence
            </span>
            {intelligenceNav.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Public Platform Preview Link */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono px-3 block mb-2">
              Public Platform
            </span>
            <button
              onClick={() => setShowLandingPreview(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5 transition"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Landing Experience</span>
            </button>
          </div>
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50/80 dark:bg-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-sm">
              DL
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight font-display">
                Dev Learner
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                Cognitive Flow: Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Header */}
        <header className="h-16 px-6 border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#07090e]/70 backdrop-blur-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">CogFlow</span>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <h2 className="text-sm font-black text-slate-900 dark:text-white font-display">
                {currentViewLabel}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Invariant Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span>30s Invariant Active</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Launch Studio Button */}
            <button
              onClick={() => handleLaunchTopic('distributed-consensus-raft', 'A')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all duration-150 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentView === 'dashboard' && (
            <DashboardPage
              onLaunchTopic={handleLaunchTopic}
              onNavigate={(v) => setCurrentView(v as MainView)}
            />
          )}
          {currentView === 'subjects' && (
            <SubjectCatalogPage onSelectTopic={handleLaunchTopic} />
          )}
          {currentView === 'documents' && (
            <DocumentUploadPage onLaunchTopic={handleLaunchTopic} />
          )}
          {currentView === 'analytics' && <AnalyticsPage />}
          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
