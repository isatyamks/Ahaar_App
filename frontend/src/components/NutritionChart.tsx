import React from 'react';

interface NutritionChartProps {
  data: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const total = data.protein * 4 + data.carbs * 4 + data.fat * 9;
  const proteinPercentage = (data.protein * 4 / total) * 100;
  const carbsPercentage = (data.carbs * 4 / total) * 100;
  const fatPercentage = (data.fat * 9 / total) * 100;

  return (
    <div className="space-y-6">
      {/* Donut Chart Representation */}
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="10"
            />
            
            {/* Protein arc */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#ef4444"
              strokeWidth="10"
              strokeDasharray={`${proteinPercentage * 2.2} ${220 - proteinPercentage * 2.2}`}
              strokeDashoffset="0"
              className="transition-all duration-500"
            />
            
            {/* Carbs arc */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${carbsPercentage * 2.2} ${220 - carbsPercentage * 2.2}`}
              strokeDashoffset={`-${proteinPercentage * 2.2}`}
              className="transition-all duration-500"
            />
            
            {/* Fat arc */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray={`${fatPercentage * 2.2} ${220 - fatPercentage * 2.2}`}
              strokeDashoffset={`-${(proteinPercentage + carbsPercentage) * 2.2}`}
              className="transition-all duration-500"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">{data.calories}</div>
            <div className="text-sm text-gray-500">calories</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Protein ({Math.round(proteinPercentage)}%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Carbs ({Math.round(carbsPercentage)}%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Fat ({Math.round(fatPercentage)}%)</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;