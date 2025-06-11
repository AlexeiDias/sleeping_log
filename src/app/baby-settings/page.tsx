'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BabySettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [babies, setBabies] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  const [helperName, setHelperName] = useState('');
  const [helperEmail, setHelperEmail] = useState('');
  const [helperStatus, setHelperStatus] = useState('');
  const router = useRouter();

  // Load babies as before
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

  // Baby creation as before
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

  // 🧑‍🤝‍🧑 Create Helper Logic
  const createHelper = async () => {
    setHelperStatus('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: helperName, email: helperEmail }),
      });

      if (res.ok) {
        setHelperStatus('✅ Helper created!');
        setHelperName('');
        setHelperEmail('');
      } else {
        const data = await res.json();
        setHelperStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      console.error('🚨 Error creating helper:', err);
      setHelperStatus('❌ Server error');
    }
  };

  return (
    <main className="p-6 space-y-10">
      <button
        onClick={() => {
          router.push('/');
          router.refresh();
        }}
        className="inline-block mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Dashboard
      </button>

      {/* Baby Management */}
      <section>
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
            Add Baby
          </button>
        </div>

        {statusMsg && (
          <div className="mb-2 text-sm text-blue-900 bg-blue-800 p-2 rounded">
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
                    className="bg-blue-800 text-white px-3 py-1 text-sm rounded"
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
      </section>

      {/* Helper User Management */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">🧑‍🤝‍🧑 Create Helper User</h2>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            className="border px-2 py-1"
            placeholder="Helper name"
            value={helperName}
            onChange={(e) => setHelperName(e.target.value)}
          />
          <input
            className="border px-2 py-1"
            placeholder="Helper email"
            type="email"
            value={helperEmail}
            onChange={(e) => setHelperEmail(e.target.value)}
          />
          <button
            onClick={createHelper}
            className="bg-blue-800 text-white px-4 py-1 rounded"
          >
            Add Helper
          </button>
        </div>

        {helperStatus && (
          <div className="text-sm p-2 rounded bg-blue-800">{helperStatus}</div>
        )}
      </section>
    </main>
  );
}
