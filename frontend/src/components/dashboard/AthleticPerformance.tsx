import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend);

type Props = {
  protein: number;
  carbs: number;
  fat: number;
  burnEq?: { walking_minutes?: number; jogging_minutes?: number; cycling_minutes?: number };
};

const AthleticPerformance: React.FC<Props> = ({ protein, carbs, fat, burnEq }) => {
  const time = Array.from({ length: 13 }, (_, i) => i * 0.5); // 0..6h
  const curves = useMemo(() => {
    const p = time.map(t => 60 * Math.exp(-Math.pow((t - 2), 2) / 1) * (protein / 100));
    const c = time.map(t => 80 * Math.exp(-Math.pow((t - 1), 2) / 0.6) * (carbs / 200));
    const f = time.map(t => 40 * Math.exp(-Math.pow((t - 3), 2) / 1.2) * (fat / 70));
    return {
      labels: time.map(t => `${t}h`),
      datasets: [
        { label: 'Protein', data: p, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.15)', fill: true, pointRadius: 0 },
        { label: 'Carbs', data: c, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.15)', fill: true, pointRadius: 0 },
        { label: 'Fat', data: f, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.15)', fill: true, pointRadius: 0 },
      ]
    };
  }, [time, protein, carbs, fat]);

  const energyBars = useMemo(() => ({
    labels: ['Walk', 'Run', 'Cycle'],
    datasets: [{ label: 'Minutes', data: [burnEq?.walking_minutes || 0, burnEq?.jogging_minutes || 0, burnEq?.cycling_minutes || 0], backgroundColor: ['#3b82f6', '#ef4444', '#10b981'] }]
  }), [burnEq]);

  const fuelingScore = useMemo(() => {
    // crude: prefer carbs 50-60% cals, protein 20-30%, fat 20-30
    const cals = protein * 4 + carbs * 4 + fat * 9;
    const pc = (protein * 4) / cals, cc = (carbs * 4) / cals, fc = (fat * 9) / cals;
    const within = (v: number, min: number, max: number) => (v >= min && v <= max) ? 10 : Math.max(0, 10 - (Math.min(Math.abs(v - min), Math.abs(v - max)) * 50));
    return Math.min(10, (within(pc, 0.2, 0.3) + within(cc, 0.5, 0.6) + within(fc, 0.2, 0.3)) / 3);
  }, [protein, carbs, fat]);

  return (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Athletic Performance</h3>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Macro Timing (absorption)</div>
          <div style={{ height: 280 }}>
            <Line data={curves as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } }, elements: { point: { radius: 0 } }, scales: { x: { ticks: { maxRotation: 0 } } } }} />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Energy Expenditure Equivalence</div>
          <div style={{ height: 240 }}>
            <Bar data={energyBars as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
          </div>
        </div>
        <div className="text-sm text-gray-700">Performance Fueling Score: <span className="font-semibold">{fuelingScore.toFixed(1)}/10</span></div>
      </div>
    </div>
  );
};

export default AthleticPerformance;
