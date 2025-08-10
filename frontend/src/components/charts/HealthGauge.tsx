import React from 'react';

interface Props {
  value: number; // 0 - 10
  max?: number; // default 10
  size?: number; // px width
}

const HealthGauge: React.FC<Props> = ({ value, max = 10, size = 180 }) => {
  const radius = 70;
  const stroke = 14;
  const center = 90;
  const circumference = Math.PI * radius; // half circle length
  const clamped = Math.max(0, Math.min(value, max));
  const pct = clamped / max;
  const arc = circumference * pct;
  const remainder = circumference - arc;

  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 180 120" role="img" aria-label={`Health score ${clamped} of ${max}`}>
      {/* track */}
      <path d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
      {/* progress */}
      <path
        d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
        fill="none"
        stroke="#16a34a"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${arc} ${remainder}`}
      />
      {/* label */}
      <text x="90" y="70" textAnchor="middle" className="fill-gray-900" fontSize="22" fontWeight={700}>{clamped.toFixed(1)}</text>
      <text x="90" y="90" textAnchor="middle" className="fill-gray-500" fontSize="12">Health Score</text>
    </svg>
  );
};

export default HealthGauge;
