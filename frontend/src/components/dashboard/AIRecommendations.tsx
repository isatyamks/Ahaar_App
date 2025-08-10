import React, { useMemo } from 'react';

type Props = {
  totals: { protein: number; carbs: number; fat: number; fiber: number };
  vitamins: Array<{ name: string; amount: number; unit: string }>;
  minerals: Array<{ name: string; amount: number; unit: string }>;
  suggestions?: string[];
};

const AIRecommendations: React.FC<Props> = ({ totals, vitamins, minerals, suggestions = [] }) => {
  const extra = useMemo(() => {
    const out: string[] = [];
    if (totals.fiber < 25) out.push('Add leafy greens or legumes to boost fiber');
    if (totals.protein < 60) out.push('Include a lean protein source in the next meal');
    const iron = minerals.find(m => m.name === 'Iron');
    if (iron && iron.amount < 8) out.push('Consider iron-rich foods (spinach, lentils)');
    const vitC = vitamins.find(v => v.name === 'Vitamin C');
    if (vitC && vitC.amount < 75) out.push('Add citrus or bell peppers for Vitamin C');
    return out;
  }, [totals, vitamins, minerals]);

  const combined = [...suggestions, ...extra];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AI Recommendations</h3>
      {combined.length ? (
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800">
          {combined.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No recommendations at this time.</div>
      )}
    </div>
  );
};

export default AIRecommendations;
