// src/components/FeedingChart.tsx
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
  const colors = ['#FFD700', '#FFA07A', '#90EE90', '#87CEEB'];

  const datasets = mealTypes.map((meal, i) => ({
    label: meal,
    data: labels.map((d) => dailySummary[d]?.[meal] || 0),
    backgroundColor: colors[i],
  }));

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold text-gray-800 mb-2">🍽️ Feeding Chart</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No feeding data yet.</p>
      ) : (
        <Bar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'bottom' },
            },
          }}
        />
      )}
    </div>
  );
}
