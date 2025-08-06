import React from 'react';

interface TimePeriodSelectorProps {
  selected: 'daily' | 'weekly' | 'monthly';
  onSelect: (period: 'daily' | 'weekly' | 'monthly') => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({ selected, onSelect }) => {
  const periods = [
    { key: 'daily' as const, label: 'Daily' },
    { key: 'weekly' as const, label: 'Weekly' },
    { key: 'monthly' as const, label: 'Monthly' },
  ];

  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {periods.map((period) => (
        <button
          key={period.key}
          onClick={() => onSelect(period.key)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            selected === period.key
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodSelector;