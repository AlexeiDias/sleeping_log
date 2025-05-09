'use client';

import { useEffect, useState } from 'react';

export default function SleepTimer({ sleepLogId }: { sleepLogId: number }) {
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
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
    if (!sleepLogId || typeof sleepLogId !== 'number') {
      console.warn("⚠️ Invalid sleepLogId", sleepLogId);
      alert('Invalid sleep session ID');
      return;
    }

    try {
      const res = await fetch(`/api/sleep-check/${sleepLogId}`, {
        method: 'POST',
      });

      if (res.ok) {
        setLastLogged(new Date());
        setSecondsLeft(15 * 60);
      } else {
        alert('❌ Failed to log check');
      }
    } catch (err) {
      console.error("❌ Network error while logging check", err);
      alert('❌ Network error while logging check');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4 sm:p-6 shadow-sm space-y-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        🕒 15-Min Sleep Check
      </h3>

      <div className="text-4xl sm:text-5xl font-mono text-blue-700 dark:text-blue-400">
        {formatTime(secondsLeft)}
      </div>

      <button
        onClick={logSleepCheck}
        disabled={secondsLeft === 0}
        className="mt-2 inline-block w-full sm:w-auto px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        🔄 Reset Timer & Log Check
      </button>

      {lastLogged && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✅ Last check: {lastLogged.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
