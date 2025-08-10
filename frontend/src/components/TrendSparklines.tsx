import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

interface Props {
  values: number[]; // recent values, oldest -> latest
  color?: string;
  height?: number;
}

const TrendSparklines: React.FC<Props> = ({ values, color = '#2563eb', height = 60 }) => {
  if (!values.length) return null;
  const labels = values.map((_, i) => `${i + 1}`);
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: color,
        backgroundColor: (ctx: any) => {
          const c = ctx.chart.ctx;
          const gradient = c.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, `${color}33`);
          gradient.addColorStop(1, `${color}00`);
          return gradient;
        },
        fill: true,
        pointRadius: 2,
        tension: 0.35,
        borderWidth: 2,
      },
    ],
  } as const;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false } },
    interaction: { mode: 'nearest' as const, intersect: false },
    scales: {
      x: { display: true, title: { display: false, text: 'Samples' } },
      y: { display: true, ticks: { precision: 0 }, title: { display: false, text: 'Value' } },
    },
  } as const;

  return (
    <div style={{ width: '100%', height }}>
      <Line data={data as any} options={options as any} />
    </div>
  );
};

export default TrendSparklines;
