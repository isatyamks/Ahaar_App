import React, { useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, BarElement, Tooltip, Legend, annotationPlugin as any);

type Props = {
  carbs: number;
  glycemicIndex?: number;
  glycemicLoad?: number;
};

const GlycemicImpact: React.FC<Props> = ({ carbs, glycemicIndex = 50, glycemicLoad }) => {
  const hours = Array.from({ length: 19 }, (_, i) => i * 0.25); // 0..4.5h
  const lineData = useMemo(() => {
    const peak = Math.min(3, 0.5 + (glycemicIndex / 100) * 2.5);
    const amp = Math.min(60, 10 + (glycemicIndex / 100) * 50) * (carbs / 50);
    const values = hours.map(t => {
      // gamma-like curve around peak
      const val = amp * Math.exp(-Math.pow((t - peak), 2) / 0.5);
      return Math.max(0, val);
    });
    return {
      labels: hours.map(h => `${h.toFixed(2)}h`),
      datasets: [{ label: 'Predicted Glucose Δ (mg/dL)', data: values, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.15)', fill: true, tension: 0.35, pointRadius: 0 }]
    };
  }, [hours, glycemicIndex, carbs]);

  const barData = useMemo(() => ({
    labels: ['GI', 'GL'],
    datasets: [{ label: 'Value', data: [glycemicIndex, glycemicLoad ?? (carbs * glycemicIndex) / 100], backgroundColor: ['#3b82f6', '#60a5fa'] }]
  }), [glycemicIndex, glycemicLoad, carbs]);

  const annotations = {
    annotations: {
      idealMin: { type: 'line', yMin: 20, yMax: 20, borderColor: '#10b981', borderWidth: 1, label: { display: true, content: 'Ideal +20 mg/dL', backgroundColor: 'rgba(16,185,129,0.1)' } },
      idealMax: { type: 'line', yMin: 60, yMax: 60, borderColor: '#f59e0b', borderWidth: 1, label: { display: true, content: 'Caution +60 mg/dL', backgroundColor: 'rgba(245,158,11,0.1)' } }
    }
  } as any;

  return (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Glycemic & Metabolic Impact</h3>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Blood Sugar Spike Prediction (3-5h)</div>
          <div style={{ height: 260 }}>
            <Line data={lineData as any} options={{ responsive: true, maintainAspectRatio: false, elements: { point: { radius: 0 } }, plugins: { legend: { position: 'bottom' as const }, annotation: annotations, tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y.toFixed(1)} mg/dL` } } }, scales: { x: { ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { ticks: { callback: (v: any) => `${v}` } } } } as any} />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Glycemic Index & Load</div>
          <div style={{ height: 220 }}>
            <Bar data={barData as any} options={{ responsive: true, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, suggestedMax: 100 } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlycemicImpact;
