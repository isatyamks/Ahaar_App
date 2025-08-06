import React from 'react';

interface NutritionCardProps {
  title: string;
  value: number;
  unit: string;
  target: number;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'yellow';
}

const NutritionCard: React.FC<NutritionCardProps> = ({ 
  title, 
  value, 
  unit, 
  target, 
  icon, 
  color 
}) => {
  const percentage = Math.min((value / target) * 100, 100);
  
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    red: 'text-red-600 bg-red-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50'
  };

  const progressColors = {
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{unit}</div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${progressColors[color]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        Target: {target} {unit}
      </div>
    </div>
  );
};

export default NutritionCard;