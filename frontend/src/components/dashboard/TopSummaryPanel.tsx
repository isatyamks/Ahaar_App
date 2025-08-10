import React, { useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import NutritionChart from '../NutritionChart';
import HealthGaugeChart from '../charts/HealthGaugeChart';

type Props = {
  totals: { calories: number; protein: number; carbs: number; fat: number; fiber?: number; sugar?: number; sodium?: number };
  targets?: { calories?: number; protein?: number; carbs?: number; fat?: number };
  latestAdvanced?: {
    meal_health_score?: number;
    potential_allergens?: string[];
    deficiency_alerts?: string[];
    excessive_intake_alerts?: string[];
  };
};

const defaultTargets = { calories: 2000, protein: 150, carbs: 250, fat: 65 };

const RadialProgress: React.FC<{ value: number; target: number; label: string; color: string }>
  = ({ value, target, label, color }) => {
  const pct = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="transform -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.915" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm font-semibold text-gray-900">{pct}%</div>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600">{label}</div>
    </div>
  );
};

const TopSummaryPanel: React.FC<Props> = ({ totals, targets = defaultTargets, latestAdvanced }) => {
  const healthScore = latestAdvanced?.meal_health_score ?? null;
  const healthCategory = useMemo(() => {
    if (healthScore == null) return null;
    if (healthScore >= 8) return { label: 'Excellent', color: 'text-green-700 bg-green-50' };
    if (healthScore >= 5) return { label: 'Balanced', color: 'text-blue-700 bg-blue-50' };
    return { label: 'Needs Improvement', color: 'text-yellow-800 bg-yellow-50' };
  }, [healthScore]);

  const riskFlags = useMemo(() => {
    const flags: string[] = [];
    if (totals.sodium && totals.sodium > 2300) flags.push('High Sodium');
    if (totals.fiber !== undefined && totals.sugar !== undefined && totals.fiber < 20 && totals.sugar > 50) flags.push('Low Fiber / High Sugar');
    if (totals.fat > 80) flags.push('Excess Total Fat');
    if (latestAdvanced?.excessive_intake_alerts?.length) flags.push(...(latestAdvanced.excessive_intake_alerts as string[]));
    if (latestAdvanced?.deficiency_alerts?.length) flags.push(...(latestAdvanced.deficiency_alerts as string[]));
    return flags.slice(0, 5);
  }, [totals, latestAdvanced]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Macros vs Target</h3>
          <div className="grid grid-cols-4 gap-4">
            <RadialProgress value={totals.calories} target={targets.calories || defaultTargets.calories} label="Calories" color="#2563eb" />
            <RadialProgress value={totals.protein} target={targets.protein || defaultTargets.protein} label="Protein" color="#ef4444" />
            <RadialProgress value={totals.carbs} target={targets.carbs || defaultTargets.carbs} label="Carbs" color="#16a34a" />
            <RadialProgress value={totals.fat} target={targets.fat || defaultTargets.fat} label="Fat" color="#f59e0b" />
          </div>
          <div className="mt-4">
            <NutritionChart data={{ calories: totals.calories, protein: totals.protein, carbs: totals.carbs, fat: totals.fat }} />
          </div>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Overall Health Score</h3>
          {healthScore != null ? (
            <HealthGaugeChart value={healthScore} />
          ) : (
            <div className="text-sm text-gray-500">No score available</div>
          )}
          {healthCategory && (
            <span className={`mt-2 text-xs px-2 py-1 rounded-full ${healthCategory.color}`}>{healthCategory.label}</span>
          )}
        </div>
        <div className="col-span-1">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">AI Risk Flags</h3>
          {riskFlags.length ? (
            <ul className="space-y-2">
              {riskFlags.map((f, i) => (
                <li key={i} className="flex items-center text-sm text-yellow-800 bg-yellow-50 border border-yellow-100 rounded px-2 py-1">
                  <AlertTriangle className="h-4 w-4 mr-2" /> {f}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">No issues detected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopSummaryPanel;
