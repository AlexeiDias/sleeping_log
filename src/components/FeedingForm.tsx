// src/components/FeedingForm.tsx
'use client';

import { useState } from 'react';

export default function FeedingForm({ babyId }: { babyId: number }) {
  const [mealType, setMealType] = useState('BREAKFAST');
  const [menu, setMenu] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/feeding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ babyId, mealType, menu, quantity: Number(quantity), note }),
    });

    setMenu('');
    setQuantity('');
    setNote('');
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {submitted && <p className="text-green-600 text-sm">✅ Feeding saved!</p>}

      <div>
        <label className="block text-sm font-medium">Meal Type</label>
        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="BREAKFAST">Breakfast</option>
          <option value="LUNCH">Lunch</option>
          <option value="DINNER">Dinner</option>
          <option value="SNACK">Snack</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Menu</label>
        <input
          type="text"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Quantity (g)</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
        💾 Save Feeding
      </button>
    </form>
  );
}
