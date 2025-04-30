'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function SleepChart({ logs }: { logs: any[] }) {
  const data = {
    datasets: [
      {
        label: 'Sleep Duration (min)',
        data: logs
          .filter(log => log.start && log.end)
          .map(log => ({
            x: new Date(log.start),
            y: Math.round((new Date(log.end).getTime() - new Date(log.start).getTime()) / 60000),
          })),
        borderColor: '#3b82f6',
        backgroundColor: '#bfdbfe',
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Minutes Slept',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-2">📈 Sleep Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
}
