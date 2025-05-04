// src/components/DiaperChart.tsx
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
  const colors = ['#60a5fa', '#fbbf24', '#a78bfa'];

  const datasets = diaperTypes.map((type, idx) => ({
    label: type,
    backgroundColor: colors[idx],
    data: labels.map((d) => dailyCounts[d][type] || 0),
  }));

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold text-gray-800 mb-2">💩 Diaper Chart</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No diaper changes yet.</p>
      ) : (
        <Bar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
          }}
        />
      )}
    </div>
  );
}
