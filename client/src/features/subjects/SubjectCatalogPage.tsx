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
          return;
        }
      } catch (err) {
        console.warn('Using client-side curriculum catalog fallback:', err);
      }

      // Filter fallback data client-side
      let filtered = FALLBACK_CURRICULUM_CATALOG;
      if (selectedCategory !== 'All') {
        filtered = filtered.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            s.topics?.some((t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q))
        );
      }
      setSubjects(filtered);
      if (filtered.length > 0) {
        if (!selectedSubjectId || !filtered.some((s) => s.id === selectedSubjectId || s.slug === selectedSubjectId)) {
          setSelectedSubjectId(filtered[0].slug || filtered[0].id);
        }
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
          // If search query is present, filter the topics
          if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            const filteredTopics = data.filter(
              (t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
            );
            setTopics(filteredTopics.length > 0 ? filteredTopics : data);
          } else {
            setTopics(data);
          }
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
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          const filteredTopics = fallbackSub.topics.filter(
            (t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
          );
          setTopics(filteredTopics.length > 0 ? filteredTopics : fallbackSub.topics);
        } else {
          setTopics(fallbackSub.topics);
        }
      } else {
        setTopics(FALLBACK_CURRICULUM_CATALOG[0].topics);
      }
    };

    fetchTopics();
  }, [selectedSubjectId, searchQuery]);

  const selectedSubject =
    subjects.find((s) => s.id === selectedSubjectId || s.slug === selectedSubjectId) ||
    FALLBACK_CURRICULUM_CATALOG[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
      {/* Catalog Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white font-display">
          Curriculum & Subject Catalog
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Explore structured engineering and scientific disciplines calibrated for dynamic multi-tier pedagogical depth (Foundations, Core, and Advanced).
        </p>
      </div>

      {/* Filter and Search Bar - Pure Monochrome */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800'
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
            leftIcon={<Search className="w-4 h-4 text-zinc-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
          />
        </div>
      </div>

      {/* Two-Column Subject and Topics Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Subject List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
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
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-950 dark:border-white shadow-xs'
                      : 'bg-white dark:bg-[#09090b] border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                          isSelected
                            ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-xs'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'
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
                        <h3 className="text-sm font-bold text-zinc-950 dark:text-white leading-tight">
                          {sub.title}
                        </h3>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          {sub.category}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'text-zinc-950 dark:text-white translate-x-1' : 'text-zinc-300 dark:text-zinc-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {subjects.length === 0 && (
              <div className="p-6 text-center rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 space-y-2">
                <p className="text-xs text-zinc-500 font-mono">No matching disciplines found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold underline text-zinc-950 dark:text-white"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Topics in Selected Subject */}
        <div className="lg:col-span-8 space-y-4">
          {selectedSubject && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block mb-1">
                Active Discipline
              </span>
              <h2 className="text-xl font-black text-zinc-950 dark:text-white font-display">
                {selectedSubject.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                {selectedSubject.description}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                Curriculum Topics ({topics.length})
              </span>
            </div>

            {topics.map((top) => (
              <div
                key={top.id || top.slug}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-950 dark:hover:border-white hover:shadow-sm transition-all duration-200 space-y-4 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                      {top.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
                      Tier {top.difficultyBaseline} Baseline
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>~{top.estimatedMinutes} mins</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {top.summary}
                </p>

                {top.learningObjectives && top.learningObjectives.length > 0 && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono block mb-2">
                      Core Invariants Covered:
                    </span>
                    <ul className="space-y-1.5">
                      {top.learningObjectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => onSelectTopic(top.slug || top.id, top.difficultyBaseline)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold transition-all duration-200 active:scale-95 shadow-xs"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {topics.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 space-y-3">
                <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white">No topics found in this selection</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try clearing your search query or selecting another discipline to explore topics.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                >
                  View All Topics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
