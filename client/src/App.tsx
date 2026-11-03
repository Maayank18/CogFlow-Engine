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
import { Badge } from './components/ui/Badge';
import {
  LayoutDashboard,
  BookOpen,
  FileUp,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  Compass,
  Globe,
  ShieldCheck,
} from 'lucide-react';

type MainView = 'dashboard' | 'subjects' | 'documents' | 'analytics' | 'settings';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [currentView, setCurrentView] = useState<MainView>('dashboard');
  const [activeCockpitTopicId, setActiveCockpitTopicId] = useState<string | null>(null);
  const [activeCockpitTier, setActiveCockpitTier] = useState<'B' | 'A' | 'S'>('A');
  const [showLandingPreview, setShowLandingPreview] = useState(true);
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

  // Public Landing Page Preview (optional toggle for reviewing landing page UI)
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

  const navItems: Array<{ id: MainView; label: string; icon: React.ReactNode }> = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subjects', label: 'Curriculum Catalog', icon: <Compass className="w-4 h-4" /> },
    { id: 'documents', label: 'Syllabus Ingestion', icon: <FileUp className="w-4 h-4" /> },
    { id: 'analytics', label: 'Cognitive Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-canvas-light dark:bg-canvas-dark text-slate-800 dark:text-slate-100 overflow-hidden">
      {/* Onboarding Dialog for First-Time Setup */}
      <OnboardingModal isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />

      {/* Main Navigation Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b0f17] flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-subtle">
              C
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">
                CogFlow
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold uppercase tracking-wider block -mt-1">
                Calm Precision
              </span>
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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-subtle'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60">
            <button
              onClick={() => setShowLandingPreview(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Landing Page Preview</span>
            </button>
          </div>
        </nav>

        {/* User Footer Profile (Auth Bypassed) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                {user?.name?.charAt(0) || 'D'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate">
                  {user?.name || 'Learner'}
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium block truncate">
                  Auth Bypassed • Full Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top App Header */}
        <header className="h-16 px-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#0b0f17]/70 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
              {navItems.find((n) => n.id === currentView)?.label || 'Overview'}
            </h2>
            <Badge variant="flow" size="sm" className="hidden sm:inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Auth Bypassed
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button
              size="sm"
              onClick={() => handleLaunchTopic('distributed-consensus-raft', 'A')}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Launch Studio
            </Button>
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
