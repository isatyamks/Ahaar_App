import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface DateRangeDisplayProps {
  selectedDate: Date;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  dateRange?: { start: Date; end: Date };
}

const DateRangeDisplay: React.FC<DateRangeDisplayProps> = ({
  selectedDate,
  selectedPeriod,
  dateRange
}) => {
  const formatDateRange = () => {
    if (selectedPeriod === 'daily') {
      return selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    if (dateRange) {
      const startStr = dateRange.start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateRange.start.getFullYear() !== dateRange.end.getFullYear() ? 'numeric' : undefined
      });
      
      const endStr = dateRange.end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `${startStr} - ${endStr}`;
    }

    // Default ranges based on selected date
    const today = new Date(selectedDate);
    
    if (selectedPeriod === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }

    if (selectedPeriod === 'monthly') {
      return today.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }

    return '';
  };

  const getPeriodIcon = () => {
    switch (selectedPeriod) {
      case 'daily':
        return <Clock className="h-4 w-4" />;
      case 'weekly':
      case 'monthly':
        return <CalendarDays className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            {getPeriodIcon()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {selectedPeriod} Overview
            </h2>
            <p className="text-sm text-gray-600">{formatDateRange()}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {selectedPeriod === 'daily' ? 'Today' : 
             selectedPeriod === 'weekly' ? 'This Period' : 
             'This Month'}
          </div>
          <div className="text-xs text-gray-400">
            Data updated {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangeDisplay;