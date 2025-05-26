import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useCalendar } from '../context/CalendarContext';
import CalendarHeader from '../components/Calendar/CalendarHeader';
import MonthGrid from '../components/Calendar/MonthGrid';
import EventForm from '../components/Events/EventForm';
import EventDetailsModal from '../components/Calendar/EventDetailsModal';
import { getMonthData, nextMonth, previousMonth, formatDate } from '../utils/calendarUtils';

const Calendar = () => {
  const { events, loading } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(() => getMonthData(currentDate, []));
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      setCalendarData(getMonthData(currentDate, events));
    }
  }, [currentDate, events, loading]);

  const handlePrevMonth = () => {
    setCurrentDate(previousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(nextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsEventFormOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEditEvent = () => {
    setIsEventDetailsOpen(false);
    setSelectedDate(new Date(selectedEvent?.date || ''));
    setIsEventFormOpen(true);
  };

  const handleDeleteEvent = () => {
    setIsEventDetailsOpen(false);
  };

  return (
    <div>
      {/* Calendar header with navigation */}
      <CalendarHeader
        monthName={calendarData.monthName}
        year={calendarData.year}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Calendar grid */}
      <div className="mt-4">
        <MonthGrid 
          weeks={calendarData.weeks} 
          onDateClick={handleDateClick}
        />
      </div>
      
      {/* Add event button (fixed) */}
      <button
        onClick={() => {
          setSelectedDate(new Date());
          setSelectedEvent(null);
          setIsEventFormOpen(true);
        }}
        className="fixed right-8 bottom-8 w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Event form modal */}
      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        selectedDate={selectedDate}
        eventToEdit={selectedEvent}
      />

      {/* Event details modal */}
      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        onClose={() => setIsEventDetailsOpen(false)}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default Calendar; 