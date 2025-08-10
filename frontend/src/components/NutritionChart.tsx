import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface NutritionChartProps {
  data: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const { chartData, chartOptions } = useMemo(() => {
    const total = data.protein * 4 + data.carbs * 4 + data.fat * 9;
    const proteinCalories = data.protein * 4;
    const carbCalories = data.carbs * 4;
    const fatCalories = data.fat * 9;
    return {
      chartData: {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [
          {
            data: [proteinCalories, carbCalories, fatCalories],
            backgroundColor: ['#2563eb', '#16a34a', '#f59e0b'],
            borderWidth: 0,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { display: true, position: 'bottom' as const },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const val = ctx.parsed as number;
                const pct = total ? Math.round((val / total) * 100) : 0;
                return `${ctx.label}: ${pct}%`;
              },
            },
          },
        },
      },
    };
  }, [data]);

  return (
    <div className="relative">
  <Doughnut data={chartData as any} options={{ ...chartOptions, maintainAspectRatio: false }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-xl font-semibold text-gray-900 leading-none">{data.calories}</div>
        <div className="text-xs text-gray-500 mt-1">calories</div>
      </div>
    </div>
  );
};

export default NutritionChart;