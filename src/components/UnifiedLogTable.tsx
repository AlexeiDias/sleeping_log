'use client';

import React, { useEffect, useState } from 'react';

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
      const [sleepRes, feedingRes, bottleRes, diaperRes] = await Promise.all([
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
    <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        📒 Unified Activity Log
      </h2>
      <table className="min-w-full table-auto text-sm sm:text-base">
        <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
          <tr>
            <th className="px-3 py-2 whitespace-nowrap">🕒 Time</th>
            <th className="px-3 py-2 whitespace-nowrap">📛 Type</th>
            <th className="px-3 py-2 whitespace-nowrap">📘 Summary</th>
            <th className="px-3 py-2 whitespace-nowrap">📝 Note</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <React.Fragment key={idx}>
              <tr className="border-t border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800">
                <td className="px-3 py-2 whitespace-nowrap text-gray-700 dark:text-gray-200">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-blue-700 dark:text-blue-400 font-medium">
                  {log.type}
                </td>
                <td className="px-3 py-2">{log.summary}</td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  {/* no note here anymore */}
                </td>
              </tr>

              {log.note && (
                <tr className="bg-zinc-900 border-t border-zinc-700">
                  <td colSpan={4} className="px-4 py-2 text-sm text-gray-400">
                    📝 {log.note}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
