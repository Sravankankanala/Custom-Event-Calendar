import React from 'react';
import { useDrag } from 'react-dnd';
import { Clock, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/calendarUtils';

const EventItem = ({ event, onClick }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'event',
    item: { id: event.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Define category colors
  const categoryColors = {
    work: 'bg-blue-100 text-blue-800 border-blue-300',
    personal: 'bg-green-100 text-green-800 border-green-300',
    meeting: 'bg-purple-100 text-purple-800 border-purple-300',
    reminder: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    other: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const colorClass = categoryColors[event.category] || categoryColors.other;

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`
        px-2 py-1 rounded text-xs border-l-2 select-none
        ${colorClass}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        cursor-pointer transition-all duration-150
        hover:shadow-sm hover:scale-[1.02] overflow-hidden
      `}
    >
      <div className="font-medium truncate">{event.title}</div>
      
      {event.time && (
        <div className="flex items-center mt-1 text-xs opacity-80">
          <Clock size={10} className="mr-1" />
          {formatTime(event.time)}
          {event.endTime && ` - ${formatTime(event.endTime)}`}
        </div>
      )}
      
      {event.recurrence.type !== 'none' && (
        <div className="flex items-center mt-1 text-xs opacity-70">
          <RotateCcw size={10} className="mr-1" />
          {event.recurrence.type.charAt(0).toUpperCase() + event.recurrence.type.slice(1)}
        </div>
      )}
    </div>
  );
};

export default EventItem; 