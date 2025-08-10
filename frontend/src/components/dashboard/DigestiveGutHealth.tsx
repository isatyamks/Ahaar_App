import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import HealthGaugeChart from '../charts/HealthGaugeChart';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  fiberG: number;
  sugarG: number;
  glycemicIndex?: number;
  glycemicLoad?: number;
};

const DigestiveGutHealth: React.FC<Props> = ({ fiberG, sugarG, glycemicIndex, glycemicLoad }) => {
  const ratioData = useMemo(() => ({
    labels: ['Fiber', 'Sugar'],
    datasets: [{ label: 'Grams', data: [fiberG, sugarG], backgroundColor: ['#10b981', '#ef4444'] }]
  }), [fiberG, sugarG]);

  const giTolerance = useMemo(() => {
    const gi = glycemicIndex ?? 50;
    const gl = glycemicLoad ?? 10;
    const fiberProtect = Math.min(4, fiberG / 7); // up to +4 pts
    const score = Math.max(0, 10 - (gi / 10) - (gl / 5) + fiberProtect);
    return Math.min(10, score);
  }, [glycemicIndex, glycemicLoad, fiberG]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Digestive & Gut Health</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Fiber vs Sugar</div>
          <div style={{ height: 220 }}>
            <Bar data={ratioData as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold text-gray-800 mb-2">GI Tolerance Index</div>
          <HealthGaugeChart value={giTolerance} max={10} />
          <div className="mt-1 text-xs text-gray-500">Higher is better</div>
        </div>
      </div>
    </div>
  );
};

export default DigestiveGutHealth;
