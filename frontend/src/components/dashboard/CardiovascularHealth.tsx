import React, { useMemo } from 'react';
import HealthGaugeChart from '../charts/HealthGaugeChart';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  sodiumMg: number;
  cholesterolMg: number;
  saturatedFatG?: number;
  potassiumMg?: number;
};

const CardiovascularHealth: React.FC<Props> = ({ sodiumMg, cholesterolMg, saturatedFatG = 0, potassiumMg }) => {
  const sodiumSafety = useMemo(() => {
    const max = 2300; // mg
    const ratio = Math.max(0, Math.min(1, 1 - sodiumMg / max));
    return ratio * 10; // 0-10
  }, [sodiumMg]);

  // No HDL/LDL breakdown; estimate split based on total (placeholder)
  const cholData = useMemo(() => ({
    labels: ['Estimated LDL impact', 'Estimated HDL impact'],
    datasets: [{ data: [Math.max(0, cholesterolMg * 0.75), Math.max(0, cholesterolMg * 0.25)], backgroundColor: ['#ef4444', '#10b981'], borderWidth: 0 }]
  }), [cholesterolMg]);

  const heartRiskIndex = useMemo(() => {
    const sodiumRisk = Math.min(10, (sodiumMg / 2300) * 10);
    const cholRisk = Math.min(10, (cholesterolMg / 300) * 10);
    const satRisk = Math.min(10, (saturatedFatG / 20) * 10);
    const potProtect = potassiumMg ? Math.min(5, (potassiumMg / 4700) * 5) : 0;
    return Math.max(0, Math.min(10, (sodiumRisk + cholRisk + satRisk - potProtect)));
  }, [sodiumMg, cholesterolMg, saturatedFatG, potassiumMg]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cardiovascular & Heart Health</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold text-gray-800 mb-2">Sodium Safety Level</div>
          <HealthGaugeChart value={sodiumSafety} max={10} />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Cholesterol Impact (est.)</div>
          <Doughnut data={cholData as any} options={{ plugins: { legend: { position: 'bottom' as const } } }} />
        </div>
        <div className="text-sm text-gray-700">
          Heart Risk Index: <span className="font-semibold">{heartRiskIndex.toFixed(1)}/10</span>
          <div className="mt-2 text-xs text-gray-500">Based on sodium, total cholesterol, saturated fat, and potassium (protective).</div>
        </div>
      </div>
    </div>
  );
};

export default CardiovascularHealth;
