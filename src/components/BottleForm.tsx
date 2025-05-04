'use client';

import { useState } from 'react';

export default function BottleForm({ babyId }: { babyId: number }) {
  const [volume, setVolume] = useState(120);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');

    const res = await fetch('/api/bottle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ babyId, volumeMl: volume, note }),
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
        <label className="block text-gray-700 font-medium mb-1">
          Volume (ml):
        </label>
        <input
          type="number"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={30}
          max={300}
          step={10}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Note:</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Optional note"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-1 rounded"
        disabled={status === 'saving'}
      >
        {status === 'saving' ? 'Saving...' : status === 'saved' ? '✅ Saved!' : '💾 Save'}
      </button>
    </form>
  );
}
