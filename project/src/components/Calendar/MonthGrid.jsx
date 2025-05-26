import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DayCell from './DayCell';
import EventItem from './EventItem';
import { formatDate } from '../../utils/calendarUtils';
import { useCalendar } from '../../context/CalendarContext';

const MonthGrid = ({ weeks, onDateClick }) => {
  const { moveEvent } = useCalendar();
  const [activeDropDate, setActiveDropDate] = useState(null);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 bg-gray-50">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="divide-y divide-gray-200">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 divide-x divide-gray-200">
            {week.days.map((day) => {
              const dateString = formatDate(day.date);
              const isDropActive = activeDropDate === dateString;

              // Setup drop target for drag and drop
              const [{ isOver }, drop] = useDrop({
                accept: 'event',
                drop: (item) => {
                  moveEvent(item.id, dateString);
                  return { moved: true };
                },
                collect: (monitor) => ({
                  isOver: !!monitor.isOver(),
                }),
                hover: () => {
                  setActiveDropDate(dateString);
                },
              });

              return (
                <DayCell
                  key={dateString}
                  day={day}
                  onClick={() => onDateClick(day.date)}
                  ref={drop}
                  isOver={isOver}
                >
                  {day.events.length > 0 && (
                    <div className="mt-1 max-h-24 overflow-y-auto space-y-1 scrollbar-thin">
                      {day.events.map((event) => (
                        <EventItem key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </DayCell>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthGrid; 