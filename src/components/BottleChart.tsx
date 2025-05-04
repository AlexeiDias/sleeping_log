// src/components/BottleChart.tsx
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

  const labels = logs.map((log) =>
    new Date(log.time).toLocaleString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Bottle Volume (ml)',
        data: logs.map((log) => log.volumeMl),
        borderColor: '#3b82f6',
        backgroundColor: '#93c5fd',
        tension: 0.3,
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-bold text-gray-800 mb-2">🍼 Bottle Feed Chart</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No bottle feed data yet.</p>
      ) : (
        <Line data={data} />
      )}
    </div>
  );
}
