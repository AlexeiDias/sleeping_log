'use client';

import { useEffect, useState } from 'react';

type LogType = 'SLEEP' | 'FEEDING' | 'BOTTLE' | 'DIAPER';

type UnifiedLog = {
  type: LogType;
  timestamp: Date;
  summary: string;
  note?: string;
};

export default function UnifiedLogTable({ babyId }: { babyId: number }) {
  const [logs, setLogs] = useState<UnifiedLog[]>([]);

  useEffect(() => {
    async function load() {
      const [
        sleepRes,
        feedingRes,
        bottleRes,
        diaperRes
      ] = await Promise.all([
        fetch(`/api/sleep/${babyId}`).then((res) => res.json()),
        fetch(`/api/feeding/${babyId}`).then((res) => res.json()),
        fetch(`/api/bottle/${babyId}`).then((res) => res.json()),
        fetch(`/api/diaper/${babyId}`).then((res) => res.json()),
      ]);

      const sleepLogs = sleepRes.map((log: any) => ({
        type: 'SLEEP',
        timestamp: new Date(log.start),
        summary: log.end
          ? `Nap - ${Math.round((new Date(log.end).getTime() - new Date(log.start).getTime()) / 60000)} min`
          : 'Nap started',
        note: log.note,
      }));

      const feedingLogs = feedingRes.map((log: any) => ({
        type: 'FEEDING',
        timestamp: new Date(log.time),
        summary: `${log.mealType} - ${log.menu} (${log.quantity}g)`,
        note: log.note,
      }));

      const bottleLogs = bottleRes.map((log: any) => ({
        type: 'BOTTLE',
        timestamp: new Date(log.time),
        summary: `Bottle - ${log.volumeMl}ml`,
        note: log.note,
      }));

      const diaperLogs = diaperRes.map((log: any) => ({
        type: 'DIAPER',
        timestamp: new Date(log.time),
        summary: `${log.type.charAt(0)}${log.type.slice(1).toLowerCase()} diaper`,
        note: log.note,
      }));

      const allLogs = [...sleepLogs, ...feedingLogs, ...bottleLogs, ...diaperLogs]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setLogs(allLogs);
    }

    load();
  }, [babyId]);

  return (
    <div className="overflow-x-auto text-sm mt-6">
      <h2 className="text-lg font-semibold mb-2">📒 Unified Activity Log</h2>
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-gray-200 text-gray-800">
          <tr>
            <th className="px-2 py-1">🕒 Time</th>
            <th className="px-2 py-1">📛 Type</th>
            <th className="px-2 py-1">📘 Summary</th>
            <th className="px-2 py-1">📝 Note</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-2 py-1 whitespace-nowrap">{log.timestamp.toLocaleString()}</td>
              <td className="px-2 py-1">{log.type}</td>
              <td className="px-2 py-1">{log.summary}</td>
              <td className="px-2 py-1 text-gray-600">{log.note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
