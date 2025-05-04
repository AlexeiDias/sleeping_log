'use client';

import { useState } from 'react';

export default function DiaperForm({ babyId }: { babyId: number }) {
  const [type, setType] = useState('WET');
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/diaper', {
      method: 'POST',
      body: JSON.stringify({ babyId, type, note }),
      headers: { 'Content-Type': 'application/json' },
    });
    alert('💾 Diaper log saved');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-1 text-sm"
        >
          <option value="WET">💧 Wet</option>
          <option value="SOLID">💩 Solid</option>
          <option value="BOTH">💩💧 Both</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Note:</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-1 w-full text-sm"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 text-sm rounded">
        Submit
      </button>
    </form>
  );
}
