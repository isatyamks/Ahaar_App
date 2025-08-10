import React from 'react';
import type { NutritionAdvanced } from '../services/api';

export const AdvancedInsights: React.FC<{ advanced?: NutritionAdvanced }> = ({ advanced }) => {
  if (!advanced) return null;
  const fats = advanced.fatty_acids || {};
  const burn = advanced.burn_time_equivalents || {};
  const env = advanced.environmental || {};
  const hist = advanced.historical || {};
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Advanced Insights</h3>
        {advanced.meal_health_score != null && (
          <span className="px-2 py-0.5 rounded-md text-sm font-semibold bg-green-100 text-green-800">
            Health Score: {advanced.meal_health_score.toFixed(1)} / 10
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Carb Insights</h4>
          <div className="text-sm text-gray-700">GI: {advanced.glycemic_index ?? '—'} | GL: {advanced.glycemic_load ?? '—'}</div>
          {advanced.antioxidant_orac != null && (
            <div className="text-sm text-gray-700">Antioxidants (ORAC): {advanced.antioxidant_orac}</div>
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
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-800">Activity</h4>
          {advanced.workout_energy_match && (
            <div className="text-sm text-gray-700">Match: {advanced.workout_energy_match}</div>
          )}
          <div className="text-sm text-gray-700">Walk: {burn.walking_minutes ?? '—'}m | Jog: {burn.jogging_minutes ?? '—'}m | Cycle: {burn.cycling_minutes ?? '—'}m</div>
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
