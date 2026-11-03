import React, { useState, useEffect } from 'react';
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
  Eye,
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

  // Global suppression & purge of rogue error elements injected anywhere in the DOM
  useEffect(() => {
    const purgeRogueElements = () => {
      if (typeof document === 'undefined') return;
      document
        .querySelectorAll('div[id^="dmermaid"], svg[id^="dmermaid"], .error-icon, [id^="dmermaid"], div.error-icon, svg.error-icon')
        .forEach((el) => {
          el.remove();
        });
    };
    purgeRogueElements();
    const observer = new MutationObserver(() => purgeRogueElements());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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
    <div className="flex h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Onboarding Dialog for First-Time Setup */}
      <OnboardingModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />

      {/* Main Navigation Sidebar - Pure Monochrome */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black backdrop-blur-2xl flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="w-8 h-8 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center text-white dark:text-zinc-950 font-black text-xs tracking-tight shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-200">
              CF
            </div>
            <div>
              <span className="font-display font-black text-[15px] tracking-[-0.03em] text-zinc-950 dark:text-white block leading-tight">
                CogFlow
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                  Adaptive Intelligence
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Workspace Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono px-3 block mb-2">
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
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className={isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-400 dark:text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Intelligence Group */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono px-3 block mb-2">
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
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className={isActive ? 'text-white dark:text-zinc-950' : 'text-zinc-400 dark:text-zinc-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Public Platform Preview Link */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono px-3 block mb-2">
              Public Platform
            </span>
            <button
              onClick={() => setShowLandingPreview(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            >
              <Globe className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <span>Landing Experience</span>
            </button>
          </div>
        </nav>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
            <div className="w-9 h-9 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
              DL
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-zinc-950 dark:text-white block truncate leading-tight font-display">
                Dev Learner
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Adaptive Invariant: Active
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Header */}
        <header className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Hierarchy */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-400 dark:text-zinc-500 font-medium">CogFlow</span>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <h2 className="text-sm font-black text-zinc-950 dark:text-white font-display">
                {currentViewLabel}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Invariant Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>30s Invariant Active</span>
            </div>

            {/* 3-Format Theme Toggle: Crisp Light -> Eye-Care Comfort -> Dark OLED */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
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

            {/* Launch Studio Button - Pure High Contrast */}
            <button
              onClick={() => handleLaunchTopic('distributed-consensus-raft', 'A')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-xs font-bold shadow-xs transition-all duration-150 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-50/40 dark:bg-black">
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
