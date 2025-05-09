'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

type BottleFeed = {
  id: number;
  time: string;
  volumeMl: number;
  note: string | null;
};

export default function BottleChart({ babyId }: { babyId: number }) {
  const [logs, setLogs] = useState<BottleFeed[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch(`/api/bottle/${babyId}`);
      const data = await res.json();
      setLogs(data);
    };
    fetchLogs();
  }, [babyId]);

  const labels = logs.map((log) => new Date(log.time).toLocaleString());

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Bottle Volume (ml)',
        data: logs.map((log) => log.volumeMl),
        borderColor: '#3b82f6',
        backgroundColor: '#bfdbfe',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#6b7280', // gray-500
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
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
        🍼 Bottle Feed Chart
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No bottle feed data yet.
        </p>
      ) : (
        <div className="relative h-full w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
