'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BabySettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [babies, setBabies] = useState([]);
  const router = useRouter();

  const fetchBabies = () => {
    fetch('/api/babies')
      .then((res) => res.json())
      .then(setBabies);
  };

  useEffect(() => {
    fetchBabies();
  }, []);

  const createBaby = async () => {
    if (!name || !email) return;
    await fetch('/api/babies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    setName('');
    setEmail('');
    fetchBabies();
  };

  const deleteBaby = async (id: number) => {
    await fetch(`/api/babies/${id}`, { method: 'DELETE' });
    fetchBabies();
  };

  return (
    <main className="p-6">
      <button
        onClick={() => {
          router.push('/');
          router.refresh();
        }}
        className="inline-block mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">👶 Manage Babies</h2>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          className="border px-2 py-1"
          placeholder="Baby name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border px-2 py-1"
          placeholder="Parent email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={createBaby}
          className="bg-green-600 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <ul className="list-disc ml-6">
        {babies.map((baby: any) => (
          <li key={baby.id} className="flex justify-between items-center gap-2 mb-1">
            <div>
              {baby.name} <span className="text-xs text-gray-500">{baby.email}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => deleteBaby(baby.id)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/reports/send-daily?babyId=${baby.id}`);
                  if (res.ok) alert(`📧 Report sent to ${baby.email}`);
                  else alert('❌ Failed to send report.');
                }}
                className="bg-indigo-600 text-white px-3 py-1 text-sm rounded"
              >
                📧 Send Report
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
