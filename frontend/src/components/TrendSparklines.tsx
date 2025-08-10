import React from 'react';

interface Props {
  values: number[]; // recent values, oldest -> latest
  color?: string;
  height?: number;
}

const TrendSparklines: React.FC<Props> = ({ values, color = '#2563eb', height = 60 }) => {
  if (!values.length) return null;
  const width = 200;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {/* last point dot */}
      {(() => {
        const last = values[values.length - 1];
        const x = (values.length - 1) * step;
        const y = height - ((last - min) / range) * height;
        return <circle cx={x} cy={y} r="3" fill={color} />
      })()}
    </svg>
  );
};

export default TrendSparklines;
