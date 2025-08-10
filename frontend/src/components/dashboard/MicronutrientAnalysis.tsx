import React, { useMemo } from 'react';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

type Nutrient = { name: string; amount: number; unit: string };

type Props = {
  vitamins: Nutrient[];
  minerals: Nutrient[];
};

const RDA: Record<string, number> = {
  'Vitamin A': 900, // mcg
  'Vitamin C': 90, // mg
  'Vitamin D': 20, // mcg
  'Vitamin E': 15, // mg
  'Vitamin K': 120, // mcg
  Folate: 400, // mcg
  Calcium: 1000, // mg
  Iron: 8, // mg (adult male)
  Magnesium: 400, // mg
  Phosphorus: 700, // mg
  Potassium: 4700, // mg
  Zinc: 11, // mg
  Copper: 0.9, // mg
  Manganese: 2.3, // mg
  Selenium: 55, // mcg
};

function normalizeAmount(name: string, amount: number, unit: string) {
  // Convert all to mg for matching RDA where possible
  let mg = amount;
  if (unit.toLowerCase() === 'mcg' || unit.toLowerCase() === 'µg') mg = amount / 1000;
  if (unit.toLowerCase() === 'g') mg = amount * 1000;
  const rdaMg = RDA[name];
  if (!rdaMg) return null;
  // For vitamins with mcg RDA (A, D, K, Folate, Selenium), our RDA is in respective unit above
  // Adjust specific known mcg RDAs back to mg input
  const needsMcg = ['Vitamin A', 'Vitamin D', 'Vitamin K', 'Folate', 'Selenium'];
  const rdaVal = needsMcg.includes(name) ? (RDA[name] / 1000) : RDA[name];
  return { pct: Math.min(200, (mg / rdaVal) * 100), rda: rdaVal };
}

const MicronutrientAnalysis: React.FC<Props> = ({ vitamins, minerals }) => {
  const selectedVits = ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin E', 'Vitamin K', 'Folate'];
  const selectedMins = ['Calcium', 'Iron', 'Magnesium', 'Phosphorus', 'Potassium', 'Zinc'];

  const radarData = useMemo(() => {
    const labels = [...selectedVits, ...selectedMins];
    const values = labels.map(name => {
      const item = [...vitamins, ...minerals].find(n => n.name === name);
      if (!item) return 0;
      const norm = normalizeAmount(name, item.amount, item.unit);
      return norm ? norm.pct : 0;
    });
    return {
      labels,
      datasets: [
        { label: '% of RDA', data: values, backgroundColor: 'rgba(37,99,235,0.2)', borderColor: '#2563eb', pointBackgroundColor: '#2563eb' }
      ]
    };
  }, [vitamins, minerals]);

  const grouped = useMemo(() => {
    const labels = ['Deficient (<80%)', 'Adequate (80-120%)', 'Excess (>120%)'];
    let def = 0, ok = 0, ex = 0;
    const all = [...vitamins, ...minerals];
    for (const n of all) {
      const norm = normalizeAmount(n.name, n.amount, n.unit);
      if (!norm) continue;
      if (norm.pct < 80) def++; else if (norm.pct <= 120) ok++; else ex++;
    }
    return {
      labels,
      datasets: [
        { label: 'Count', data: [def, ok, ex], backgroundColor: ['#ef4444', '#10b981', '#f59e0b'] }
      ]
    };
  }, [vitamins, minerals]);

  return (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Micronutrient Analysis</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-800 mb-2">RDA Radar</div>
          <div className="h-64">
            <Radar
            data={radarData as any}
            options={{
              plugins: { legend: { position: 'bottom' as const } },
              scales: {
                r: {
                  min: 0,
                  max: 150,
                  ticks: { display: false },
                  grid: { color: '#f3f4f6' },
                  angleLines: { display: false },
                  pointLabels: { color: '#374151', font: { size: 10 } },
                },
              },
            }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-800 mb-2">Deficiency & Excess</div>
          <div style={{ height: 300 }}>
            <Bar
              data={grouped as any}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0 }, stacked: false },
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                },
              } as any}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicronutrientAnalysis;
