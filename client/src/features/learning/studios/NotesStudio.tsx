import React, { useState, useEffect } from 'react';
import { RevisionNoteItem } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card.js';
import { Button } from '../../../components/ui/Button.js';
import { Badge } from '../../../components/ui/Badge.js';
import { Input } from '../../../components/ui/Input.js';
import { useToast } from '../../../components/ui/Toast.js';
import { api } from '../../../services/api.js';
import { BookOpen, AlertOctagon, RotateCw, Plus, Tag, Pin } from 'lucide-react';

export interface NotesStudioProps {
  topicId: string;
  notes: RevisionNoteItem[];
}

export const NotesStudio: React.FC<NotesStudioProps> = ({ topicId, notes: initialNotes }) => {
  const [userNotes, setUserNotes] = useState<RevisionNoteItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    const fetchUserNotes = async () => {
      try {
        const data = await api.notes.list(topicId);
        setUserNotes(data || []);
      } catch {
        // Fallback silently if offline
      }
    };
    fetchUserNotes();
  }, [topicId]);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const created = await api.notes.create({
        topicId,
        title: newTitle.trim(),
        content: newContent.trim(),
        type: 'custom',
        tags: ['my-notes'],
      });

      setUserNotes((prev) => [created, ...prev]);
      setNewTitle('');
      setNewContent('');
      setIsAddingNote(false);
      success('Note saved', 'Your note has been added to this topic.');
    } catch (err) {
      error('Failed to save note', (err as Error).message);
    }
  };

  const definitions = initialNotes.filter((n) => n.type === 'definition');
  const formulas = initialNotes.filter((n) => n.type === 'formula');
  const pitfalls = initialNotes.filter((n) => n.type === 'pitfall');
  const flashcards = initialNotes.filter((n) => n.type === 'flashcard');

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Interactive Flashcards Carousel / Grid */}
      {flashcards.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-purple-500" />
              <span>Interactive Recall Flashcards</span>
            </h3>
            <span className="text-xs text-slate-400">Click card to flip</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, idx) => {
              const isFlipped = Boolean(flippedCards[card.id || idx]);

              return (
                <div
                  key={card.id || idx}
                  onClick={() => toggleFlip(card.id || String(idx))}
                  className="min-h-[160px] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] shadow-subtle hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium uppercase tracking-wider text-[10px]">
                      {isFlipped ? 'Answer (Reverse)' : 'Prompt (Front)'}
                    </span>
                    <Badge size="sm" variant={isFlipped ? 'tierS' : 'primary'}>
                      {isFlipped ? 'Revealed' : 'Card ' + (idx + 1)}
                    </Badge>
                  </div>

                  <div className="my-auto py-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {isFlipped ? card.reverseContent || card.content : card.content}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-blue-500 dark:text-blue-400 font-medium">
                    {isFlipped ? 'Click to flip back' : 'Click to reveal'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Definitions & Formulas */}
      {(definitions.length > 0 || formulas.length > 0) && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>Essential Definitions & Formulations</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {[...definitions, ...formulas].map((item, idx) => (
              <Card key={item.id || idx} className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <Badge size="sm" variant={item.type === 'formula' ? 'tierS' : 'neutral'}>
                    {item.type}
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {item.content}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Common Pitfalls */}
      {pitfalls.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span>Frequent Pitfalls to Avoid</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {pitfalls.map((pitfall, idx) => (
              <div
                key={pitfall.id || idx}
                className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200"
              >
                <strong className="block font-semibold mb-1">{pitfall.title}</strong>
                <p className="text-slate-700 dark:text-slate-300">{pitfall.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Learner Personal Notes Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pin className="w-4 h-4 text-teal-500" />
            <span>My Personal Notes & Observations</span>
          </h3>
          <Button
            size="sm"
            variant={isAddingNote ? 'outline' : 'secondary'}
            onClick={() => setIsAddingNote(!isAddingNote)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            {isAddingNote ? 'Cancel' : 'Add Note'}
          </Button>
        </div>

        {isAddingNote && (
          <form
            onSubmit={handleCreateNote}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121824] space-y-3 shadow-card animate-in fade-in duration-150"
          >
            <Input
              placeholder="Note title or concept..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <textarea
              rows={3}
              placeholder="Write your observation or personal takeaway..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
              className="w-full text-xs p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" type="submit">
                Save Note
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3">
          {userNotes.map((note) => (
            <Card key={note.id} className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {note.title}
                </h4>
                <span className="text-[10px] text-slate-400">User Note</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {note.content}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
