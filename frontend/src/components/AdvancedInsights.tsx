import React from 'react';
import type { NutritionAdvanced } from '../services/api';
import HealthGauge from './charts/HealthGauge';

export const AdvancedInsights: React.FC<{ advanced?: NutritionAdvanced }> = ({ advanced }) => {
  if (!advanced) return null;
  const fats = advanced.fatty_acids || {};
  const burn = advanced.burn_time_equivalents || {};
  const env = advanced.environmental || {};
  const hist = advanced.historical || {};
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Advanced Insights</h3>
        {advanced.meal_health_score != null && (
          <div className="flex items-center">
            <HealthGauge value={advanced.meal_health_score} />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Carb Insights</h4>
          <div className="text-sm text-gray-700">GI: {advanced.glycemic_index ?? '—'} | GL: {advanced.glycemic_load ?? '—'}</div>
          {advanced.antioxidant_orac != null && (
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <span>Antioxidants (ORAC): {advanced.antioxidant_orac}</span>
              <div className="w-28 h-2 bg-gray-200 rounded">
                <div className="h-2 bg-purple-500 rounded" style={{ width: `${Math.min(100, (advanced.antioxidant_orac / 2000) * 100)}%` }} />
              </div>
            </div>
          )}
          {!!advanced.diet_compatibility?.length && (
            <div className="text-sm text-gray-700">Diets: {advanced.diet_compatibility.join(', ')}</div>
          )}
          {!!advanced.potential_allergens?.length && (
            <div className="text-sm text-red-700">Allergens: {advanced.potential_allergens.join(', ')}</div>
          )}
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Fatty Acids</h4>
          <div className="text-sm text-gray-700">Omega-3: {fats.omega_3 ?? '—'} g | Omega-6: {fats.omega_6 ?? '—'} g</div>
          <div className="text-sm text-gray-700">Ratio (Ω3:Ω6): {fats.omega_3_to_6_ratio ?? '—'}</div>
          <div className="text-sm text-gray-700">Sat: {fats.saturated_fat ?? '—'} g, Mono: {fats.monounsaturated_fat ?? '—'} g, Poly: {fats.polyunsaturated_fat ?? '—'} g</div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-yellow-500 rounded" style={{ width: `${Math.min(100, (Number(fats.saturated_fat || 0) / 20) * 100)}%` }} />
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-amber-500 rounded" style={{ width: `${Math.min(100, (Number(fats.monounsaturated_fat || 0) / 25) * 100)}%` }} />
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-orange-500 rounded" style={{ width: `${Math.min(100, (Number(fats.polyunsaturated_fat || 0) / 25) * 100)}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Activity</h4>
          {advanced.workout_energy_match && (
            <div className="text-sm text-gray-700">Match: {advanced.workout_energy_match}</div>
          )}
          <div className="text-sm text-gray-700">Walk: {burn.walking_minutes ?? '—'}m | Jog: {burn.jogging_minutes ?? '—'}m | Cycle: {burn.cycling_minutes ?? '—'}m</div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-green-600 rounded" style={{ width: `${Math.min(100, (Number(burn.walking_minutes || 0) / 60) * 100)}%` }} />
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-green-500 rounded" style={{ width: `${Math.min(100, (Number(burn.jogging_minutes || 0) / 45) * 100)}%` }} />
          </div>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="h-2 bg-green-400 rounded" style={{ width: `${Math.min(100, (Number(burn.cycling_minutes || 0) / 60) * 100)}%` }} />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Environment & Suggestions</h4>
          {(env.carbon_footprint_g_co2 != null || env.water_usage_liters != null) && (
            <div className="text-sm text-gray-700">CO₂: {env.carbon_footprint_g_co2 ?? '—'} g | Water: {env.water_usage_liters ?? '—'} L</div>
          )}
          {env.sourcing && (
            <div className="text-sm text-gray-700">Sourcing: {env.sourcing.local ? 'Local' : 'Non-local'}{env.sourcing.organic ? ', Organic' : ''}</div>
          )}
          {!!advanced.deficiency_alerts?.length && (
            <div className="text-sm text-amber-700">Deficiency: {advanced.deficiency_alerts.join(', ')}</div>
          )}
          {!!advanced.excessive_intake_alerts?.length && (
            <div className="text-sm text-red-700">Excess: {advanced.excessive_intake_alerts.join(', ')}</div>
          )}
          {!!hist.ai_suggestions?.length && (
            <div className="text-sm text-gray-700">AI: {hist.ai_suggestions.join('; ')}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedInsights;
