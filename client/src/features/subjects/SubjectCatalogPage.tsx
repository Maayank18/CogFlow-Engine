import React, { useState, useEffect } from 'react';
import { SubjectItem, TopicItem } from '@cogflow/shared';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  Search,
  BookOpen,
  Cpu,
  Sigma,
  Atom,
  ChevronRight,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export interface SubjectCatalogPageProps {
  onSelectTopic: (topicId: string, initialTier?: 'B' | 'A' | 'S') => void;
}

export const SubjectCatalogPage: React.FC<SubjectCatalogPageProps> = ({ onSelectTopic }) => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    'All',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory;
        const data = await api.subjects.list(cat, searchQuery || undefined);
        setSubjects(data);
        if (data.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(data[0].id || data[0].slug);
        }
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (!selectedSubjectId) return;

    const fetchTopics = async () => {
      try {
        const data = await api.subjects.listTopics(selectedSubjectId);
        setTopics(data);
      } catch (err) {
        console.error('Failed to fetch topics for subject:', err);
      }
    };

    fetchTopics();
  }, [selectedSubjectId]);

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId || s.slug === selectedSubjectId);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Catalog Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Curriculum & Subject Catalog
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Explore structured disciplines engineered for adaptive multi-tier pedagogical depth.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-[#121824] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search topics or concepts..."
            leftIcon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Two-Column Subject and Topics Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Subject List */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Disciplines ({subjects.length})
          </span>

          {subjects.map((sub) => {
            const isSelected = sub.id === selectedSubjectId || sub.slug === selectedSubjectId;

            return (
              <Card
                key={sub.id}
                variant="interactive"
                onClick={() => setSelectedSubjectId(sub.id || sub.slug)}
                className={`p-4 transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      {sub.category === 'Computer Science' && <Cpu className="w-4 h-4" />}
                      {sub.category === 'Mathematics' && <Sigma className="w-4 h-4" />}
                      {sub.category === 'Physics' && <Atom className="w-4 h-4" />}
                      {!['Computer Science', 'Mathematics', 'Physics'].includes(sub.category) && (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {sub.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">{sub.category}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-blue-500 translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right Column: Topics in Selected Subject */}
        <div className="md:col-span-2 space-y-4">
          {selectedSubject && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {selectedSubject.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedSubject.description}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Curriculum Topics ({topics.length})
            </span>

            {topics.map((top) => (
              <Card key={top.id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {top.title}
                    </h4>
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
                      Baseline {top.difficultyBaseline}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{top.estimatedMinutes} mins</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {top.summary}
                </p>

                {top.learningObjectives && top.learningObjectives.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Learning Objectives:
                    </span>
                    <ul className="space-y-1">
                      {top.learningObjectives.map((obj, i) => (
                        <li key={i} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => onSelectTopic(top.id, top.difficultyBaseline)}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Launch Studio
                  </Button>
                </div>
              </Card>
            ))}

            {topics.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-8">
                No topics found in this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

