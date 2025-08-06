import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  selectedPeriod: 'daily' | 'weekly' | 'monthly';
  dateRange?: { start: Date; end: Date };
  onDateRangeSelect?: (range: { start: Date; end: Date }) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
  selectedPeriod,
  dateRange,
  onDateRangeSelect
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatDateRange = (start: Date, end: Date) => {
    if (start.getTime() === end.getTime()) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!dateRange) return false;
    return date >= dateRange.start && date <= dateRange.end;
  };

  const isDateSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (selectedPeriod === 'daily') {
      onDateSelect(date);
      setShowCalendar(false);
    } else if (isSelectingRange && onDateRangeSelect) {
      if (!rangeStart) {
        setRangeStart(date);
      } else {
        const start = rangeStart < date ? rangeStart : date;
        const end = rangeStart < date ? date : rangeStart;
        onDateRangeSelect({ start, end });
        setRangeStart(null);
        setIsSelectingRange(false);
        setShowCalendar(false);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getQuickDateOptions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    return [
      { label: 'Today', date: today },
      { label: 'Yesterday', date: yesterday },
      { label: 'Last Week', date: lastWeek },
      { label: 'Last Month', date: lastMonth },
    ];
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          {selectedPeriod === 'daily' 
            ? formatDate(selectedDate)
            : dateRange 
              ? formatDateRange(dateRange.start, dateRange.end)
              : 'Select Date Range'
          }
        </span>
      </button>

      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-80">
          {/* Quick Date Options */}
          {selectedPeriod === 'daily' && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 gap-2">
                {getQuickDateOptions().map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleDateClick(option.date)}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Range Selection Toggle */}
          {selectedPeriod !== 'daily' && onDateRangeSelect && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <button
                onClick={() => {
                  setIsSelectingRange(!isSelectingRange);
                  setRangeStart(null);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  isSelectingRange 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CalendarDays className="h-4 w-4" />
                <span>{isSelectingRange ? 'Cancel Range Selection' : 'Select Date Range'}</span>
              </button>
              {isSelectingRange && rangeStart && (
                <p className="text-xs text-gray-500 mt-2">
                  Start: {formatDate(rangeStart)} - Click another date to complete range
                </p>
              )}
            </div>
          )}

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <h3 className="text-sm font-medium text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => date && handleDateClick(date)}
                disabled={!date}
                className={`
                  h-8 w-8 text-sm rounded-md transition-colors duration-200
                  ${!date 
                    ? 'invisible' 
                    : isDateSelected(date)
                      ? 'bg-blue-600 text-white'
                      : isDateInRange(date)
                        ? 'bg-blue-100 text-blue-700'
                        : rangeStart && date.getTime() === rangeStart.getTime()
                          ? 'bg-blue-200 text-blue-800'
                          : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                {date?.getDate()}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowCalendar(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDateSelect(new Date());
                setShowCalendar(false);
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;