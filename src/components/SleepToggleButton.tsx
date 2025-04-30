'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ NEW

export default function SleepToggleButton({ babyId }: { babyId: number }) {
  const [isSleeping, setIsSleeping] = useState(false);
  const [latestLogId, setLatestLogId] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const router = useRouter(); // ✅ INIT

  const DURATION = 15 * 60;
  const storageKey = `sleep_timer_${babyId}`;

  useEffect(() => {
    const checkSleep = async () => {
      const res = await fetch(`/api/sleep/${babyId}`);
      const logs = await res.json();
      const openLog = logs.find((log: any) => log.end === null);
      if (openLog) {
        setIsSleeping(true);
        setLatestLogId(openLog.id);

        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const { startTime } = JSON.parse(stored);
          const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
          const remaining = DURATION - elapsed;
          if (remaining > 0) {
            setSecondsLeft(remaining);
          }
        }
      }
    };
    checkSleep();
  }, [babyId]);

  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }

      fetch(`/api/sleep/${babyId}`)
        .then(res => res.json())
        .then(logs => {
          const openLog = logs.find((log: any) => log.end === null);
          if (openLog) {
            fetch(`/api/sleep/${babyId}/note`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                logId: openLog.id,
                note: '15min check complete',
              }),
            });
          }
        });

      alert('⏰ 15-minute timer ended — check the baby!');
      setSecondsLeft(null);
      localStorage.removeItem(storageKey);
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft]);

  const startSleep = async () => {
    const res = await fetch('/api/sleep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        babyId,
        start: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const logsRes = await fetch(`/api/sleep/${babyId}`);
      const logs = await logsRes.json();
      const openLog = logs.find((log: any) => log.end === null);
      if (openLog) {
        setIsSleeping(true);
        setLatestLogId(openLog.id);
        setSecondsLeft(DURATION);
        localStorage.setItem(
          storageKey,
          JSON.stringify({ startTime: new Date().toISOString() })
        );
        router.refresh(); // ✅ refresh page content
      }
    }
  };

  const stopSleep = async () => {
    const logsRes = await fetch(`/api/sleep/${babyId}`);
    const logs = await logsRes.json();
    const openLog = logs.find((log: any) => log.end === null);

    if (!openLog) {
      console.warn('⚠️ No open log found to stop');
      return;
    }

    const res = await fetch(`/api/sleep/${babyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        end: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      setIsSleeping(false);
      setLatestLogId(null);
      setSecondsLeft(null);
      localStorage.removeItem(storageKey);
      router.refresh(); // ✅ refresh page content
    }
  };

  const resetTimer = () => {
    setSecondsLeft(DURATION);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ startTime: new Date().toISOString() })
    );
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div className="flex flex-col gap-1">
      {isSleeping ? (
        <>
          <button
            onClick={stopSleep}
            className="bg-red-600 text-white px-3 py-1 text-xs rounded"
          >
            🛑 Stop Sleeping
          </button>
          {secondsLeft !== null && (
            <div className="flex gap-2 items-center">
              <span className="text-yellow-700 text-sm font-mono">
                ⏳ {formatTime(secondsLeft)}
              </span>
              <button
                onClick={resetTimer}
                className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
              >
                🔁 Reset Timer
              </button>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={startSleep}
          className="bg-green-600 text-white px-3 py-1 text-xs rounded"
        >
          🟢 Start Sleeping
        </button>
      )}
    </div>
  );
}
