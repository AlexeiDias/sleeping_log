'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function BabyCard({ baby }: { baby: { id: number, name: string } }) {
  const [countdown, setCountdown] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startSleep = async () => {
    setStartTime(new Date());
    setCountdown(15 * 60); // 15 min in seconds

    await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ babyId: baby.id, start: new Date().toISOString() }),
    });
  };

  const stopSleep = async () => {
    setCountdown(0);
    await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        babyId: baby.id,
        start: startTime,
        end: new Date().toISOString(),
      }),
    });
    setStartTime(null);
  };

  const restartTimer = () => {
    setCountdown(15 * 60);
  };

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="border p-4 rounded shadow-md flex flex-col gap-2">
      <Link href={`/baby/${baby.id}/stats`} className="text-xl font-bold text-blue-600 hover:underline">
        {baby.name}
      </Link>

      {countdown > 0 && (
        <p className="text-lg font-mono text-green-600">⏳ {formatTime(countdown)}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={startSleep}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Start
        </button>
        <button
          onClick={restartTimer}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Restart
        </button>
        <button
          onClick={stopSleep}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
