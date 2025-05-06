'use client';

import { useEffect, useState } from 'react';

export default function SleepTimer({ sleepLogId }: { sleepLogId: number }) {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 min
  const [lastLogged, setLastLogged] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const logSleepCheck = async () => {
    try {
      const res = await fetch(`/api/sleep-check/${sleepLogId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setLastLogged(new Date());
        setSecondsLeft(15 * 60); // reset countdown
      } else {
        alert('❌ Failed to log check');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Network error while logging check');
    }
  };

  return (
    <div className="border p-4 rounded shadow text-center space-y-2">
      <h3 className="font-semibold text-lg">🕒 15-Min Sleep Check</h3>
      <div className="text-3xl font-mono text-blue-700">{formatTime(secondsLeft)}</div>
      <button
        onClick={logSleepCheck}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
        disabled={secondsLeft === 0}
      >
        🔄 Reset Timer & Log Check
      </button>
      {lastLogged && (
        <div className="text-green-600 text-sm">
          ✅ Last check: {lastLogged.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
