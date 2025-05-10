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
  ChartOptions,
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
        backgroundColor: '#bfdbfe',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  // ✅ Typed chart options for line chart
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day', // ✅ Typed literal — avoids TS error
        },
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 sm:p-6 space-y-4 h-[300px] sm:h-[400px] overflow-hidden">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        🛏️ Sleep Chart
      </h2>
      <div className="relative h-full w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
