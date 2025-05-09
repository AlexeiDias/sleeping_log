'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type DiaperLog = {
  id: number;
  time: string;
  type: 'WET' | 'SOLID' | 'BOTH';
};

export default function DiaperChart({ babyId }: { babyId: number }) {
  const [logs, setLogs] = useState<DiaperLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch(`/api/diaper/${babyId}`);
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, [babyId]);

  const dailyCounts: Record<string, { [key in DiaperLog['type']]?: number }> = {};

  logs.forEach((log) => {
    const date = new Date(log.time).toLocaleDateString();
    if (!dailyCounts[date]) dailyCounts[date] = {};
    dailyCounts[date][log.type] = (dailyCounts[date][log.type] || 0) + 1;
  });

  const labels = Object.keys(dailyCounts);
  const diaperTypes: DiaperLog['type'][] = ['WET', 'SOLID', 'BOTH'];
  const colors = ['#60a5fa', '#fbbf24', '#a78bfa']; // Tailwind-aligned palette

  const datasets = diaperTypes.map((type, idx) => ({
    label: type,
    backgroundColor: colors[idx],
    borderRadius: 4,
    data: labels.map((d) => dailyCounts[d][type] || 0),
    barThickness: 28,
    maxBarThickness: 32,
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6b7280',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      y: {
        stacked: true,
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
        💩 Diaper Chart
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No diaper changes yet.
        </p>
      ) : (
        <div className="relative h-full w-full">
          <Bar data={{ labels, datasets }} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
