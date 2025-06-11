'use client';

import React, { useState } from 'react';

export default function UserCreateForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email }),
    });

    if (res.ok) {
      setMessage('✅ User created successfully!');
      setName('');
      setEmail('');
    } else {
      const error = await res.json();
      setMessage(`❌ Error: ${error.error}`);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-zinc-900 rounded">
      <h2 className="text-lg font-semibold">➕ Create New Helper</h2>

      <div>
        <label className="block mb-1">Name:</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-zinc-800 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 px-4 py-2 rounded text-white"
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
}
