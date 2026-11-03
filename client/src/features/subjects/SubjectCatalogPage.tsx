import React, { useState, useEffect } from 'react';
import { SubjectItem, TopicItem } from '@cogflow/shared';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { FALLBACK_CURRICULUM_CATALOG, CatalogSubjectWithTopics } from './catalogData';
import {
  Search,
  BookOpen,
  Cpu,
  Sigma,
  Atom,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export interface SubjectCatalogPageProps {
  onSelectTopic: (topicId: string, initialTier?: 'B' | 'A' | 'S') => void;
}

export const SubjectCatalogPage: React.FC<SubjectCatalogPageProps> = ({ onSelectTopic }) => {
  const [subjects, setSubjects] = useState<SubjectItem[]>(FALLBACK_CURRICULUM_CATALOG);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(FALLBACK_CURRICULUM_CATALOG[0].slug);
  const [topics, setTopics] = useState<TopicItem[]>(FALLBACK_CURRICULUM_CATALOG[0].topics);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'All',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Engineering',
  ];

  // Fetch subjects from backend, with instant fallback
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory;
        const data = await api.subjects.list(cat, searchQuery || undefined);
        if (data && data.length > 0) {
          setSubjects(data);
          if (!selectedSubjectId || !data.some((s) => s.id === selectedSubjectId || s.slug === selectedSubjectId)) {
            setSelectedSubjectId(data[0].slug || data[0].id);
          }
        }
      } catch (err) {
        console.warn('Using client-side curriculum catalog fallback:', err);
        // Filter fallback data client-side
        let filtered = FALLBACK_CURRICULUM_CATALOG;
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        }
        setSubjects(filtered);
      }
    };

    fetchSubjects();
  }, [selectedCategory, searchQuery]);

  // Fetch topics for selected subject
  useEffect(() => {
    if (!selectedSubjectId) return;

    const fetchTopics = async () => {
      try {
        const data = await api.subjects.listTopics(selectedSubjectId);
        if (data && data.length > 0) {
          setTopics(data);
          return;
        }
      } catch (err) {
        console.warn('Using fallback topics for subject:', err);
      }

      // Fallback topic lookup
      const fallbackSub = FALLBACK_CURRICULUM_CATALOG.find(
        (s) => s.slug === selectedSubjectId || s.id === selectedSubjectId
      );
      if (fallbackSub) {
        setTopics(fallbackSub.topics);
      } else {
        setTopics(FALLBACK_CURRICULUM_CATALOG[0].topics);
      }
    };

    fetchTopics();
  }, [selectedSubjectId]);

  const selectedSubject =
    subjects.find((s) => s.id === selectedSubjectId || s.slug === selectedSubjectId) ||
    FALLBACK_CURRICULUM_CATALOG[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Catalog Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
          Curriculum & Subject Catalog
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Explore structured engineering and scientific disciplines calibrated for dynamic multi-tier pedagogical depth (Foundations, Core, and Advanced).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search topics or concepts..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full text-xs"
          />
        </div>
      </div>

      {/* Two-Column Subject and Topics Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Subject List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Disciplines ({subjects.length})
            </span>
          </div>

          <div className="space-y-2.5">
            {subjects.map((sub) => {
              const isSelected = sub.id === selectedSubjectId || sub.slug === selectedSubjectId;

              return (
                <div
                  key={sub.id || sub.slug}
                  onClick={() => setSelectedSubjectId(sub.slug || sub.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-500/10'
                      : 'bg-white dark:bg-[#0c1017] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/60 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {sub.category === 'Computer Science' && <Cpu className="w-4 h-4" />}
                        {sub.category === 'Mathematics' && <Sigma className="w-4 h-4" />}
                        {sub.category === 'Physics' && <Atom className="w-4 h-4" />}
                        {sub.category === 'Engineering' && <Layers className="w-4 h-4" />}
                        {!['Computer Science', 'Mathematics', 'Physics', 'Engineering'].includes(sub.category) && (
                          <BookOpen className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {sub.title}
                        </h3>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {sub.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-1' : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Topics in Selected Subject */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSubject && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-teal-500/10 border border-blue-200/60 dark:border-blue-900/40 backdrop-blur-md">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono block mb-1">
                Active Discipline
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedSubject.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {selectedSubject.description}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                Curriculum Topics ({topics.length})
              </span>
            </div>

            {topics.map((top) => (
              <div
                key={top.id || top.slug}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0c1017] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all duration-200 space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {top.title}
                    </h3>
                    <Badge
                      size="sm"
                      variant={
                        top.difficultyBaseline === 'S'
                          ? 'tierS'
                          : top.difficultyBaseline === 'B'
                          ? 'tierB'
                          : 'tierA'
                      }
                    >
                      Tier {top.difficultyBaseline} Baseline
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{top.estimatedMinutes} mins</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {top.summary}
                </p>

                {top.learningObjectives && top.learningObjectives.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                      Core Invariants Covered:
                    </span>
                    <ul className="space-y-1.5">
                      {top.learningObjectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => onSelectTopic(top.slug || top.id, top.difficultyBaseline)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-slate-900 dark:hover:text-white text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
