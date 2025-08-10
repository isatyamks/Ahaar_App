import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  totals: { protein: number; carbs: number; fat: number };
  targets?: { protein?: number; carbs?: number; fat?: number };
  advancedFatty?: { saturated_fat?: number; monounsaturated_fat?: number; polyunsaturated_fat?: number };
  aminoProfile?: Record<string, number> | undefined;
};

const MacronutrientAnalysis: React.FC<Props> = ({ totals, targets = { protein: 150, carbs: 250, fat: 65 }, advancedFatty, aminoProfile }) => {
  const cals = totals.protein * 4 + totals.carbs * 4 + totals.fat * 9;
  const doughnut = useMemo(() => ({
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [totals.protein * 4, totals.carbs * 4, totals.fat * 9],
        backgroundColor: ['#ef4444', '#16a34a', '#f59e0b'],
        borderWidth: 0,
        cutout: '60%'
      }
    ]
  }), [totals]);

  const gramsBar = useMemo(() => ({
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Actual (g)',
        data: [totals.protein, totals.carbs, totals.fat],
        backgroundColor: '#2563eb',
        borderRadius: 6,
        maxBarThickness: 32,
      },
      {
        label: 'Target (g)',
        data: [targets.protein || 150, targets.carbs || 250, targets.fat || 65],
        backgroundColor: '#e5e7eb',
        borderRadius: 6,
        maxBarThickness: 32,
      }
    ]
  }), [totals, targets]);

  const macroQualityIndex = useMemo(() => {
    const balanceScore = 10 - Math.abs((totals.protein * 4) / cals - 0.3) * 20 - Math.abs((totals.carbs * 4) / cals - 0.45) * 20 - Math.abs((totals.fat * 9) / cals - 0.25) * 20;
    const sat = advancedFatty?.saturated_fat || 0;
    const mono = advancedFatty?.monounsaturated_fat || 0;
    const poly = advancedFatty?.polyunsaturated_fat || 0;
    const fatQuality = Math.max(0, 10 - Math.max(0, (sat - (mono + poly))) * 2);
    const aaCompleteness = aminoProfile ? Math.min(10, Object.values(aminoProfile).reduce((a, b) => a + (b > 0 ? 1 : 0), 0) / 9 * 10) : 5;
    return Math.max(0, Math.min(10, (balanceScore + fatQuality + aaCompleteness) / 3));
  }, [totals, cals, advancedFatty, aminoProfile]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Macronutrient Analysis</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Macro % of Calories</div>
          <Doughnut data={doughnut as any} options={{ plugins: { legend: { position: 'bottom' as const }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.label}: ${Math.round((ctx.parsed / cals) * 100)}%` } } } }} />
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Grams vs Target</div>
          <div style={{ height: 260 }}>
            <Bar data={gramsBar as any} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { stacked: false, grid: { display: false } }, y: { beginAtZero: true } }, plugins: { legend: { position: 'bottom' as const } } }} />
          </div>
          <div className="mt-3 text-sm text-gray-700">Macro Quality Index: <span className="font-semibold">{macroQualityIndex.toFixed(1)}/10</span></div>
          <div className="mt-2 text-xs text-gray-600">
            Protein type: {aminoProfile ? 'Complete profile' : 'Unknown'} · Fat breakdown: Sat {advancedFatty?.saturated_fat ?? '—'}g / Mono {advancedFatty?.monounsaturated_fat ?? '—'}g / Poly {advancedFatty?.polyunsaturated_fat ?? '—'}g
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacronutrientAnalysis;
