import React, { useMemo } from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

type MealEnv = { label: string; carbon?: number; water?: number; calories?: number };

type Props = {
  meals: MealEnv[];
};

const EnvironmentalImpact: React.FC<Props> = ({ meals }) => {
  const data = useMemo(() => ({
    datasets: meals.filter(m => m.carbon != null && m.water != null).map((m, i) => ({
      label: m.label,
      data: [{ x: m.carbon as number, y: m.water as number, r: Math.max(4, Math.min(20, (m.calories || 0) / 100)) }],
      backgroundColor: `hsl(${(i * 47) % 360} 85% 60% / 0.6)`,
    }))
  }), [meals]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Environmental Impact</h3>
      <div style={{ height: 280 }}>
        <Bubble data={data as any} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' as const } }, scales: { x: { title: { display: true, text: 'CO₂ (g)' } }, y: { title: { display: true, text: 'Water (L)' } } } }} />
      </div>
    </div>
  );
};

export default EnvironmentalImpact;
