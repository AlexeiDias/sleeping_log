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

type FeedingLog = {
  id: number;
  mealType: string;
  menu: string;
  quantity: number;
  note: string | null;
  time: string;
};

export default function FeedingChart({ babyId }: { babyId: number }) {
  const [logs, setLogs] = useState<FeedingLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch(`/api/feeding/${babyId}`);
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, [babyId]);

  // Group quantity per day + mealType
  const dailySummary: Record<string, Record<string, number>> = {};

  logs.forEach((log) => {
    const date = new Date(log.time).toLocaleDateString();
    const meal = log.mealType;
    if (!dailySummary[date]) dailySummary[date] = {};
    if (!dailySummary[date][meal]) dailySummary[date][meal] = 0;
    dailySummary[date][meal] += log.quantity;
  });

  const labels = Object.keys(dailySummary);
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const colors = ['#facc15', '#fb923c', '#4ade80', '#60a5fa']; // Tailwind palette equivalents

  const datasets = mealTypes.map((meal, i) => ({
    label: meal,
    data: labels.map((d) => dailySummary[d]?.[meal] || 0),
    backgroundColor: colors[i],
    borderRadius: 4,
    barThickness: 24,
    maxBarThickness: 30,
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6b7280', // text-gray-500
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
        🍽️ Feeding Chart
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No feeding data yet.
        </p>
      ) : (
        <div className="relative h-full w-full">
          <Bar data={{ labels, datasets }} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
