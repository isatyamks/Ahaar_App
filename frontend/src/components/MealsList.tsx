import React, { useMemo, useState } from 'react';
import { Clock, Camera } from 'lucide-react';
import type { NutritionAdvanced } from '../services/api';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  imageUrl: string;
  date?: string; // optional ISO (YYYY-MM-DD) or readable date
  datetime?: string; // optional ISO datetime
  timestamp?: number; // epoch seconds or ms
  createdAt?: string; // possible backend field
  nutrition?: {
    macronutrients?: {
      protein?: number;
      carbs?: number;
      fat?: number;
      fiber?: number;
      sugar?: number;
    };
    advanced?: NutritionAdvanced;
    [key: string]: any;
  };
}

type SortKey =
  | 'newest'
  | 'oldest'
  | 'date_desc'
  | 'date_asc'
  | 'calories_desc'
  | 'calories_asc'
  | 'sugar_desc'
  | 'sugar_asc'
  | 'protein_desc'
  | 'protein_asc'
  | 'health_desc'
  | 'health_asc';

type MacroKey = 'protein' | 'carbs' | 'fat' | 'fiber' | 'sugar';

interface MealsListProps {
  meals: Meal[];
  defaultSort?: SortKey;
}

const getMealTags = (meal: Meal): { label: string; color: string }[] => {
  if (!meal.nutrition || !meal.nutrition.macronutrients) return [];
  const { fat, fiber, sugar, protein, carbs } = meal.nutrition.macronutrients;
  const tags: { label: string; color: string }[] = [];
  if (typeof fat === 'number' && fat > 25) tags.push({ label: 'Too Fatty', color: 'bg-yellow-200 text-yellow-800' });
  if (typeof fat === 'number' && typeof carbs === 'number' && fat > 20 && carbs < 30)
    tags.push({ label: 'Too Oily', color: 'bg-orange-200 text-orange-800' });
  if (
    typeof fat === 'number' && typeof fiber === 'number' && typeof sugar === 'number' &&
    fat < 15 && fiber > 5 && sugar < 10
  )
    tags.push({ label: 'Healthy Food', color: 'bg-green-200 text-green-800' });
  if (typeof sugar === 'number' && sugar > 20)
    tags.push({ label: 'High Sugar', color: 'bg-pink-200 text-pink-800' });
  if (typeof protein === 'number' && protein > 20)
    tags.push({ label: 'High Protein', color: 'bg-blue-200 text-blue-800' });
  // Additional heuristics for richer tagging
  if (typeof carbs === 'number' && carbs > 60)
    tags.push({ label: 'High Carb', color: 'bg-purple-200 text-purple-800' });
  if (typeof carbs === 'number' && carbs < 20)
    tags.push({ label: 'Low Carb', color: 'bg-indigo-100 text-indigo-700' });
  if (typeof fiber === 'number' && fiber >= 8)
    tags.push({ label: 'Fiber Rich', color: 'bg-emerald-100 text-emerald-800' });
  if (typeof sugar === 'number' && sugar < 8)
    tags.push({ label: 'Low Sugar', color: 'bg-rose-100 text-rose-700' });

  const adv: NutritionAdvanced | undefined = meal.nutrition.advanced;
  if (adv?.meal_health_score !== undefined) {
    const s = adv.meal_health_score;
    if (s >= 7) tags.push({ label: 'Healthy', color: 'bg-green-100 text-green-800' });
    else if (s <= 4) tags.push({ label: 'Indulgent', color: 'bg-amber-100 text-amber-800' });
    else tags.push({ label: 'Balanced', color: 'bg-blue-50 text-blue-700' });
  }
  if (adv?.glycemic_index !== undefined) {
    if (adv.glycemic_index >= 70) tags.push({ label: 'High GI', color: 'bg-orange-100 text-orange-700' });
    else if (adv.glycemic_index <= 55) tags.push({ label: 'Low GI', color: 'bg-teal-100 text-teal-700' });
  }
  if (adv?.potential_allergens && adv.potential_allergens.length > 0)
    tags.push({ label: `Contains ${adv.potential_allergens[0]}`, color: 'bg-red-100 text-red-700' });
  if (adv?.environmental?.sourcing?.organic)
    tags.push({ label: 'Organic', color: 'bg-lime-100 text-lime-800' });

  // Ensure at least 2 tags; try to compose up to 3
  if (tags.length < 2) {
    if (meal.calories >= 500) tags.push({ label: 'Calorie Dense', color: 'bg-yellow-100 text-yellow-800' });
    else tags.push({ label: 'Light Meal', color: 'bg-gray-100 text-gray-700' });
  }
  if (tags.length < 3) {
    if (typeof protein === 'number' && typeof carbs === 'number') {
      const ratio = protein / Math.max(1, carbs);
      if (ratio >= 0.6) tags.push({ label: 'Protein Forward', color: 'bg-sky-100 text-sky-700' });
      else tags.push({ label: 'Carb Forward', color: 'bg-fuchsia-100 text-fuchsia-700' });
    } else {
      tags.push({ label: 'Balanced', color: 'bg-blue-50 text-blue-700' });
    }
  }
  return tags;
};

const MealsList: React.FC<MealsListProps> = ({ meals, defaultSort = 'newest' }) => {
  const [sort, setSort] = useState<SortKey>(defaultSort);

  const mealsWithIndex = useMemo(
    () => meals.map((m, idx) => ({ ...m, __index: idx } as Meal & { __index: number })),
    [meals]
  );

  const getTimeMs = (m: Meal & { __index?: number }): number => {
    // Priority: numeric timestamp -> datetime strings -> date + time -> fallback to index ordering
    if (typeof m.timestamp === 'number') {
      return m.timestamp < 1e12 ? m.timestamp * 1000 : m.timestamp; // seconds -> ms
    }
    const iso = m.datetime || m.createdAt || (typeof m.time === 'string' && m.time.includes('T') ? m.time : undefined);
    if (iso) {
      const t = Date.parse(iso);
      if (!Number.isNaN(t)) return t;
    }
    if (m.date && m.time) {
      // Attempt to compose ISO date time
      const timeStr = m.time.replace(/\s(AM|PM)$/i, (am) => am.toUpperCase());
      const composed = /\d{4}-\d{2}-\d{2}/.test(m.date)
        ? `${m.date} ${timeStr}`
        : m.date;
      const t = Date.parse(composed);
      if (!Number.isNaN(t)) return t;
    }
    // If time is like 'HH:MM' try today
    if (/^\d{1,2}:\d{2}(\s?(AM|PM))?$/i.test(m.time || '')) {
      const today = new Date();
      const d = new Date(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')} ${m.time}`);
      const t = d.getTime();
      if (!Number.isNaN(t)) return t;
    }
    return (m as any).__index ?? 0; // stable fallback
  };

  const formatDateTime = (m: Meal): string => {
    if (m.datetime) {
      const d = new Date(m.datetime);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }
    if (m.date && m.time) return `${m.date} ${m.time}`;
    if (m.time) return m.time;
    return '';
  };

  const sortedMeals = useMemo(() => {
    const list = [...mealsWithIndex];
    const getMacro = (m: Meal, key: MacroKey) =>
      m.nutrition?.macronutrients?.[key] ?? -1;
    const getHealth = (m: Meal) => m.nutrition?.advanced?.meal_health_score ?? -1;
    switch (sort) {
      case 'oldest':
      case 'date_asc':
        return list.sort((a, b) => getTimeMs(a) - getTimeMs(b));
      case 'calories_desc':
        return list.sort((a, b) => b.calories - a.calories);
      case 'calories_asc':
        return list.sort((a, b) => a.calories - b.calories);
      case 'sugar_desc':
        return list.sort((a, b) => (getMacro(b, 'sugar') as number) - (getMacro(a, 'sugar') as number));
      case 'sugar_asc':
        return list.sort((a, b) => (getMacro(a, 'sugar') as number) - (getMacro(b, 'sugar') as number));
      case 'protein_desc':
        return list.sort((a, b) => (getMacro(b, 'protein') as number) - (getMacro(a, 'protein') as number));
      case 'protein_asc':
        return list.sort((a, b) => (getMacro(a, 'protein') as number) - (getMacro(b, 'protein') as number));
      case 'health_desc':
        return list.sort((a, b) => getHealth(b) - getHealth(a));
      case 'health_asc':
        return list.sort((a, b) => getHealth(a) - getHealth(b));
      case 'date_desc':
      case 'newest':
      default:
        return list.sort((a, b) => getTimeMs(b) - getTimeMs(a));
    }
  }, [mealsWithIndex, sort]);

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
    <div className="flex items-center justify-end gap-2">
        <label className="text-xs text-gray-500">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      <option value="newest">Date/Time: Newest</option>
      <option value="oldest">Date/Time: Oldest</option>
      <option value="date_desc">Date/Time: Newest (explicit)</option>
      <option value="date_asc">Date/Time: Oldest (explicit)</option>
          <option value="calories_desc">Calories: High → Low</option>
          <option value="calories_asc">Calories: Low → High</option>
          <option value="sugar_desc">Sugar: High → Low</option>
          <option value="sugar_asc">Sugar: Low → High</option>
          <option value="protein_desc">Protein: High → Low</option>
          <option value="protein_asc">Protein: Low → High</option>
          <option value="health_desc">Health Score: High → Low</option>
          <option value="health_asc">Health Score: Low → High</option>
        </select>
      </div>
      {sortedMeals.map((meal) => (
        <div key={meal.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
              <Camera className="h-6 w-6 text-gray-500" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 truncate">{meal.name}</h4>
              <span className="text-sm font-medium text-gray-600">{meal.calories} cal</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{formatDateTime(meal)}</span>
              {/* Meal Tags */}
              {getMealTags(meal).map((tag, idx) => (
                <span
                  key={idx}
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${tag.color}`}
                >
                  {tag.label}
                </span>
              ))}
              {/* User Name */}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">satyam_kumar</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealsList;