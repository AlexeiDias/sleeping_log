'use client';

import { useEffect, useState } from 'react';

export default function SleepTimer({ babyId }: { babyId: number }) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const DURATION = 15 * 60; // 15 minutes

  useEffect(() => {
    const active = localStorage.getItem(`sleep_timer_${babyId}`);
    if (active) {
      const { startTime } = JSON.parse(active);
      const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
      const remaining = DURATION - elapsed;
      if (remaining > 0) {
        setSecondsLeft(remaining);
      }
    }
  }, [babyId]);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      alert('⏰ Timer finished! Check on the baby.');
      setSecondsLeft(null);
      localStorage.removeItem(`sleep_timer_${babyId}`);
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);
    setIntervalId(id);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const startTimer = () => {
    localStorage.setItem(
      `sleep_timer_${babyId}`,
      JSON.stringify({ startTime: new Date().toISOString() })
    );
    setSecondsLeft(DURATION);
  };

  const resetTimer = () => {
    startTimer();
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  if (secondsLeft === null) {
    return (
      <button
        onClick={startTimer}
        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
      >
        ▶️ Start Timer
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-mono text-yellow-700">{format(secondsLeft)}</span>
      <button
        onClick={resetTimer}
        className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
      >
        🔁 Reset Timer
      </button>
    </div>
  );
}
