import { useState, useEffect } from 'react';
import { apiService, NutritionData } from '../services/api';
import { mockNutritionData } from '../data/mockData';

export const useNutritionData = (
  period: 'daily' | 'weekly' | 'monthly',
  selectedDate: Date,
  dateRange?: { start: Date; end: Date }
) => {
  const [data, setData] = useState<NutritionData>(mockNutritionData[period]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if backend is available
      await apiService.checkHealth();
      setIsOnline(true);

      const dateStr = selectedDate.toISOString().split('T')[0];
      const startDateStr = dateRange?.start.toISOString().split('T')[0];
      const endDateStr = dateRange?.end.toISOString().split('T')[0];

      const nutritionData = await apiService.getNutritionData(
        period,
        dateStr,
        startDateStr,
        endDateStr
      );

      setData(nutritionData);
    } catch (err) {
      console.warn('Backend not available, using mock data:', err);
      setIsOnline(false);
      setData(mockNutritionData[period]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, selectedDate, dateRange]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    isOnline,
    refetch
  };
};