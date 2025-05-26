import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarHeader = ({
  monthName,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <header className="flex items-center justify-between py-4 px-2">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {monthName} {year}
        </h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onToday}
          className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <CalendarIcon size={16} className="mr-1" />
          Today
        </button>
        
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={onPrevMonth}
            className="p-2 bg-white border border-r-0 border-gray-300 rounded-l-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 bg-white border border-gray-300 rounded-r-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CalendarHeader; 