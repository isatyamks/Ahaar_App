import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
import type { NutritionAdvanced } from '../services/api';
import HealthGaugeChart from './charts/HealthGaugeChart';

type BarDatum = { label: string; value: number; color?: string };

const ChartBar: React.FC<{ data: BarDatum[]; unit?: string; suggestedMax?: number; height?: number }> = ({ data, unit, suggestedMax, height = 180 }) => {
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);
  const colors = data.map(d => d.color || 'var(--ah-primary)');
  const ds = {
    labels,
    datasets: [
      {
        label: unit ? `Value (${unit})` : 'Value',
        data: values,
        backgroundColor: colors,
        borderWidth: 0,
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  } as const;
  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.y}${unit ? ' ' + unit : ''}` } } },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f3f4f6' },
        suggestedMax: suggestedMax,
        ticks: { callback: (v: any) => `${v}${unit ? ' ' + unit : ''}` },
      },
    },
  } as const;
  return <div style={{ height }}><Bar data={ds as any} options={opts as any} /></div>;
};

export const AdvancedInsights: React.FC<{ advanced?: NutritionAdvanced }> = ({ advanced }) => {
  if (!advanced) return null;
  const fats = advanced.fatty_acids || {};
  const burn = advanced.burn_time_equivalents || {};
  const env = advanced.environmental || {};
  // const hist = advanced.historical || {};
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Advanced Insights</h3>
        {advanced.meal_health_score != null && (
          <div className="flex items-center">
            <HealthGaugeChart value={advanced.meal_health_score} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carb Insights */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Carb Insights</h4>
          <ChartBar
            data={[
              { label: 'GI', value: Number(advanced.glycemic_index || 0), color: 'var(--ah-primary)' },
              { label: 'GL', value: Number(advanced.glycemic_load || 0), color: '#60a5fa' }
            ]}
            suggestedMax={100}
          />
          {advanced.antioxidant_orac != null && (
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-700 mb-1">Antioxidants (ORAC)</div>
              <ChartBar
                data={[{ label: 'ORAC', value: Number(advanced.antioxidant_orac || 0), color: '#8b5cf6' }]}
                suggestedMax={2000}
              />
            </div>
          )}
          {!!advanced.diet_compatibility?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {advanced.diet_compatibility.map((d, i) => (
                <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ background: 'var(--ah-bg-soft)', color: 'var(--ah-secondary)' }}>{d}</span>
              ))}
            </div>
          )}
        </div>

        {/* Fatty Acids */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Fatty Acids (g)</h4>
          <ChartBar
            unit="g"
            data={[
              { label: 'Sat', value: Number(fats.saturated_fat || 0), color: '#f59e0b' },
              { label: 'Mono', value: Number(fats.monounsaturated_fat || 0), color: '#fbbf24' },
              { label: 'Poly', value: Number(fats.polyunsaturated_fat || 0), color: '#fb923c' }
            ]}
          />
          <div className="text-xs text-gray-600 mt-2">Ω3: {fats.omega_3 ?? '—'} g | Ω6: {fats.omega_6 ?? '—'} g | Ratio Ω3:Ω6: {fats.omega_3_to_6_ratio ?? '—'}</div>
        </div>

        {/* Activity Equivalents */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">Activity Equivalents (min)</h4>
          {advanced.workout_energy_match && (
            <div className="text-xs text-gray-600 mb-2">Match: {advanced.workout_energy_match}</div>
          )}
          <ChartBar
            unit="min"
            data={[
              { label: 'Walk', value: Number(burn.walking_minutes || 0), color: 'var(--ah-primary)' },
              { label: 'Jog', value: Number(burn.jogging_minutes || 0), color: '#3b82f6' },
              { label: 'Cycle', value: Number(burn.cycling_minutes || 0), color: '#60a5fa' }
            ]}
          />
        </div>

        {/* Environment & Alerts */}
        <div className="card p-6">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Environment & Alerts</h4>
          {(env.carbon_footprint_g_co2 != null || env.water_usage_liters != null) && (
            <ChartBar
              data={[
                { label: 'CO₂ (g)', value: Number(env.carbon_footprint_g_co2 || 0), color: '#10b981' },
                { label: 'Water (L)', value: Number(env.water_usage_liters || 0), color: '#06b6d4' }
              ]}
            />
          )}
          {env.sourcing && (
            <div className="text-xs text-gray-600 mt-2">Sourcing: {env.sourcing.local ? 'Local' : 'Non-local'}{env.sourcing.organic ? ', Organic' : ''}</div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {!!advanced.potential_allergens?.length && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                Allergens: {advanced.potential_allergens.join(', ')}
              </span>
            )}
            {!!advanced.deficiency_alerts?.length && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#fffbeb', color: '#b45309' }}>
                Deficiency: {advanced.deficiency_alerts.join(', ')}
              </span>
            )}
            {!!advanced.excessive_intake_alerts?.length && (
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                Excess: {advanced.excessive_intake_alerts.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInsights;
