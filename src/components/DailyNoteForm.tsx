// src/components/DailyNoteForm.tsx
'use client';

import { useEffect, useState } from 'react';

export default function DailyNoteForm({ babyId }: { babyId: number }) {
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved'>('idle');

  const loadNote = async (date: string) => {
    setStatus('loading');
    const res = await fetch(`/api/dailynotes/${babyId}?date=${date}`);
    if (res.ok) {
      const data = await res.json();
      setContent(data?.content || '');
    }
    setStatus('idle');
  };

  useEffect(() => {
    loadNote(selectedDate);
  }, [selectedDate, babyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const res = await fetch(`/api/dailynotes/${babyId}?date=${selectedDate}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } else {
      alert('❌ Error saving note');
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm max-w-lg">
      <label className="block font-semibold">📅 Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border px-2 py-1 rounded"
      />

      <label className="block font-semibold">📝 Note:</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="border rounded w-full p-2"
        placeholder="General updates, notes, etc."
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded"
        disabled={status === 'saving'}
      >
        {status === 'saving' ? 'Saving...' : status === 'saved' ? '✅ Saved!' : '💾 Save Note'}
      </button>
    </form>
  );
}
