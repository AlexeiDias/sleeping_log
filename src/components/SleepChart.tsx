// src/components/SleepChart.tsx
'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { SleepLog } from '@prisma/client';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, TimeScale, Tooltip);

export default function SleepChart({ babyId }: { babyId: number }) {
  const [logs, setLogs] = useState<SleepLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/sleep/${babyId}`);
      const data = await res.json();
      setLogs(data);
    };
    load();
  }, [babyId]);

  const chartData = {
    labels: logs.map((log) => log.start),
    datasets: [
      {
        label: 'Sleep Duration (min)',
        data: logs.map((log) =>
          log.end ? (new Date(log.end).getTime() - new Date(log.start).getTime()) / 60000 : 0
        ),
        borderColor: '#3b82f6',
        backgroundColor: '#93c5fd',
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🛏️ Sleep Chart</h2>
      <Line data={chartData} />
    </div>
  );
}
