import React, { useState, useEffect } from 'react';
import { RevisionNoteItem } from '@cogflow/shared';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../services/api';
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
    <div className="space-y-8 max-w-4xl mx-auto pb-16 font-sans">
      {/* Interactive Flashcards Carousel / Grid */}
      {flashcards.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
              <RotateCw className="w-4 h-4 text-zinc-950 dark:text-white" />
              <span>Interactive Recall Flashcards</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Click card to flip</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, idx) => {
              const isFlipped = Boolean(flippedCards[card.id || idx]);

              return (
                <div
                  key={card.id || idx}
                  onClick={() => toggleFlip(card.id || String(idx))}
                  className="min-h-[160px] p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] shadow-xs hover:border-zinc-950 dark:hover:border-white cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      {isFlipped ? 'Answer (Reverse)' : 'Prompt (Front)'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {isFlipped ? 'Revealed' : 'Card ' + (idx + 1)}
                    </span>
                  </div>

                  <div className="my-auto py-2">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                      {isFlipped ? card.reverseContent || card.content : card.content}
                    </p>
                  </div>

                  <div className="text-right text-[11px] text-zinc-500 font-mono font-medium">
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
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
            <BookOpen className="w-4 h-4 text-zinc-950 dark:text-white" />
            <span>Essential Definitions & Formulations</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {[...definitions, ...formulas].map((item, idx) => (
              <div key={item.id || idx} className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-zinc-950 dark:text-white font-display">
                    {item.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common Pitfalls */}
      {pitfalls.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
            <AlertOctagon className="w-4 h-4 text-amber-500" />
            <span>Frequent Pitfalls to Avoid</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {pitfalls.map((pitfall, idx) => (
              <div
                key={pitfall.id || idx}
                className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 shadow-xs"
              >
                <strong className="block font-bold mb-1 font-mono uppercase text-[10px] tracking-wider text-amber-700 dark:text-amber-400">
                  {pitfall.title}
                </strong>
                <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">{pitfall.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Learner Personal Notes Section */}
      <section className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2 font-display">
            <Pin className="w-4 h-4 text-zinc-950 dark:text-white" />
            <span>My Personal Notes & Observations</span>
          </h3>
          <Button
            size="sm"
            variant={isAddingNote ? 'outline' : 'secondary'}
            onClick={() => setIsAddingNote(!isAddingNote)}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="border-zinc-300 dark:border-zinc-700 text-xs"
          >
            {isAddingNote ? 'Cancel' : 'Add Note'}
          </Button>
        </div>

        {isAddingNote && (
          <form
            onSubmit={handleCreateNote}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] space-y-3 shadow-xs animate-in fade-in duration-150"
          >
            <Input
              placeholder="Note title or concept..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white"
            />
            <textarea
              rows={3}
              placeholder="Write your observation or personal takeaway..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
              className="w-full text-xs p-3.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" type="submit" className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold">
                Save Note
              </Button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3">
          {userNotes.map((note) => (
            <div key={note.id} className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold text-zinc-950 dark:text-white font-display">
                  {note.title}
                </h4>
                <span className="text-[10px] text-zinc-400 font-mono">User Note</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
