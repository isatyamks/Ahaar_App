import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  value: number; // 0 - max
  max?: number; // default 10
}

const HealthGaugeChart: React.FC<Props> = ({ value, max = 10 }) => {
  const clamped = Math.max(0, Math.min(value, max));
  const used = clamped;
  const remaining = Math.max(0, max - clamped);

  const data = useMemo(() => ({
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [used, remaining],
        backgroundColor: ['#16a34a', '#e5e7eb'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '70%',
      },
    ],
  }), [used, remaining]);

  const options = useMemo(() => ({
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  }), []);

  return (
    <div className="relative" style={{ width: 220, height: 140 }}>
      <Doughnut data={data as any} options={options as any} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ top: '10%' }}>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{clamped.toFixed(1)}</div>
          <div className="text-xs text-gray-500">Health Score</div>
        </div>
      </div>
    </div>
  );
};

export default HealthGaugeChart;
