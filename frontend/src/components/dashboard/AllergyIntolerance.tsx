import React from 'react';

type Props = {
  allergens?: string[];
};

const COMMON = ['Gluten', 'Dairy', 'Soy', 'Nuts', 'Shellfish', 'Egg'];

const AllergyIntolerance: React.FC<Props> = ({ allergens = [] }) => {
  const set = new Set(allergens.map(a => a.toLowerCase()));
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Allergy & Intolerance Detection</h3>
      <div className="flex flex-wrap gap-2">
        {COMMON.map(c => {
          const present = Array.from(set).some(a => a.includes(c.toLowerCase()));
          return (
            <span key={c} className={`px-2 py-1 rounded-full text-xs ${present ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {c}: {present ? 'Present' : 'Absent'}
            </span>
          );
        })}
      </div>
      {!!allergens.length && (
        <div className="mt-3 text-sm text-red-700">Flagged: {allergens.join(', ')}</div>
      )}
    </div>
  );
};

export default AllergyIntolerance;
