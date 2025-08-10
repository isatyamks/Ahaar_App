import React from 'react';
import { Clock, Camera } from 'lucide-react';
import type { NutritionAdvanced } from '../services/api';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  imageUrl: string;
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

interface MealsListProps {
  meals: Meal[];
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
  return tags;
};

const MealsList: React.FC<MealsListProps> = ({ meals }) => {
  return (
    <div className="space-y-4">
      {meals.map((meal) => (
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
              <span className="text-xs text-gray-500">{meal.time}</span>
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