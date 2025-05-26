import React, { createContext, useState, useEffect, useContext } from 'react';
import { formatDate, generateEventId } from '../utils/calendarUtils';

const CalendarContext = createContext(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage on initial render
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    setLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('calendarEvents', JSON.stringify(events));
    }
  }, [events, loading]);

  const addEvent = (eventData) => {
    const newId = generateEventId();
    const newEvent = {
      ...eventData,
      id: newId,
    };

    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newId;
  };

  const updateEvent = (updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const deleteEvent = (id, deleteRecurring) => {
    if (deleteRecurring) {
      // Find the event to check if it's part of a recurring series
      const eventToDelete = events.find(e => e.id === id);
      
      if (eventToDelete?.parentId) {
        // This is a recurring instance - delete the parent and all instances
        const parentId = eventToDelete.parentId;
        setEvents(prevEvents => 
          prevEvents.filter(e => e.id !== parentId && e.parentId !== parentId)
        );
      } else {
        // This is a parent event - delete it and all its instances
        setEvents(prevEvents => 
          prevEvents.filter(e => e.id !== id && e.parentId !== id)
        );
      }
    } else {
      // Just delete this specific event
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    }
  };

  const moveEvent = (id, newDate) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, date: newDate } : event
      )
    );
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        moveEvent,
        loading,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}; 