import React, { forwardRef } from 'react';

const DayCell = forwardRef(
  ({ day, onClick, children, isOver = false }, ref) => {
    const { date, isCurrentMonth, isToday } = day;
    
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`
          min-h-[100px] p-2 transition-colors duration-100
          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
          ${isToday ? 'ring-2 ring-inset ring-blue-500' : ''}
          ${isOver ? 'bg-blue-50' : ''}
          hover:bg-gray-50 cursor-pointer
        `}
      >
        <div className="flex justify-between items-start">
          <span
            className={`
              inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
              ${isToday ? 'bg-blue-500 text-white' : ''}
            `}
          >
            {date.getDate()}
          </span>
          {day.events.length > 0 && !isToday && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800">
              {day.events.length}
            </span>
          )}
        </div>
        {children}
      </div>
    );
  }
);

DayCell.displayName = 'DayCell';

export default DayCell; 