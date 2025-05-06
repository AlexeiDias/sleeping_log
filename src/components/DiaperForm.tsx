'use client';

import { useState } from 'react';

export default function DiaperForm({ babyId }: { babyId: number }) {
  const [type, setType] = useState('WET');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const res = await fetch('/api/diaper', {
      method: 'POST',
      body: JSON.stringify({ babyId, type, note }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setStatus('saved');
      setNote('');
    } else {
      alert('Something went wrong while saving.');
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <div>
        <label className="block font-medium">Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-1 w-full"
        >
          <option value="WET">💧 Wet</option>
          <option value="SOLID">💩 Solid</option>
          <option value="BOTH">💩💧 Both</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Note:</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded"
        disabled={status === 'saving'}
      >
        {status === 'saving' ? 'Saving...' : status === 'saved' ? '✅ Saved!' : '💾 Save Diaper'}
      </button>
    </form>
  );
}
