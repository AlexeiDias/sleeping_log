'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BabySettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [babies, setBabies] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();

  const fetchBabies = async () => {
    try {
      const res = await fetch('/api/babies');
      const data = await res.json();
      setBabies(data || []);
    } catch (err) {
      console.error('🚨 Failed to fetch babies:', err);
    }
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

  const sendReport = async (babyId: number, babyName: string) => {
    setStatusMsg(`📤 Sending report for ${babyName}...`);
    try {
      const res = await fetch(`/api/reports/send-daily?babyId=${babyId}`);
      const data = await res.json();

      if (res.ok) {
        setStatusMsg(`✅ Report sent for ${babyName}`);
      } else {
        setStatusMsg(`❌ Failed to send report for ${babyName}`);
      }
    } catch (err) {
      console.error('❌ Report error:', err);
      setStatusMsg(`❌ Error sending report for ${babyName}`);
    }

    setTimeout(() => setStatusMsg(''), 4000);
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

      {statusMsg && (
        <div className="mb-2 text-sm text-blue-700 bg-blue-100 p-2 rounded">
          {statusMsg}
        </div>
      )}

      <ul className="list-disc ml-6">
        {babies?.length > 0 ? (
          babies.map((baby: any) => (
            <li key={baby.id} className="flex justify-between items-center gap-2 mb-1">
              <span>{baby.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => sendReport(baby.id, baby.name)}
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded"
                >
                  📧 Send Report
                </button>
                <button
                  onClick={() => deleteBaby(baby.id)}
                  className="bg-red-600 text-white px-3 py-1 text-sm rounded"
                >
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic">No babies found.</li>
        )}
      </ul>
    </main>
  );
}
