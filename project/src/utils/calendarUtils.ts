import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  format,
  addMonths,
  subMonths,
  isToday,
  addDays,
  addWeeks,
  addMonths as addMonthsFn,
  isSameMonth,
  parseISO,
} from 'date-fns';
import { CalendarDay, CalendarWeek, Event, MonthData, RecurrenceRule } from '../types';

export const getMonthData = (date: Date, events: Event[]): MonthData => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const expandedEvents = expandRecurringEvents(events, startDate, endDate);

  const calendarDays: CalendarDay[] = days.map((day) => ({
    date: day,
    isCurrentMonth: isSameMonth(day, monthStart),
    isToday: isToday(day),
    events: expandedEvents.filter((event) => 
      isSameDay(parseISO(event.date), day)
    ),
  }));

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push({
      days: calendarDays.slice(i, i + 7),
    });
  }

  return {
    weeks,
    monthName: format(monthStart, 'MMMM'),
    year: monthStart.getFullYear(),
  };
};

export const nextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

export const previousMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
};

export const generateEventId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const expandRecurringEvents = (events: Event[], startDate: Date, endDate: Date): Event[] => {
  const allEvents: Event[] = [];

  events.forEach(event => {
    // Add the original event
    const eventDate = parseISO(event.date);
    if (eventDate >= startDate && eventDate <= endDate) {
      allEvents.push(event);
    }

    // Generate recurring instances
    if (event.recurrence.type !== 'none') {
      const instances = generateRecurringInstances(event, startDate, endDate);
      allEvents.push(...instances);
    }
  });

  return allEvents;
};

export const generateRecurringInstances = (event: Event, startDate: Date, endDate: Date): Event[] => {
  const instances: Event[] = [];
  const rule = event.recurrence;
  const originalDate = parseISO(event.date);
  
  // Skip if original event is outside our range
  if (originalDate > endDate) return instances;
  
  // Define end condition
  let endCondition = endDate;
  if (rule.endDate) {
    const ruleEndDate = parseISO(rule.endDate);
    if (ruleEndDate < endDate) {
      endCondition = ruleEndDate;
    }
  }

  let currentDate = originalDate;
  let occurrenceCount = 0;
  const maxOccurrences = rule.occurrences || Number.MAX_SAFE_INTEGER;

  while (currentDate <= endCondition && occurrenceCount < maxOccurrences) {
    if (currentDate > originalDate) { // Skip the original instance
      if (currentDate >= startDate && currentDate <= endDate) {
        instances.push({
          ...event,
          id: `${event.id}-${occurrenceCount}`,
          date: formatDate(currentDate),
          parentId: event.id,
        });
      }
    }
    
    // Move to next occurrence based on recurrence type
    currentDate = getNextOccurrence(currentDate, rule);
    occurrenceCount++;
  }

  return instances;
};

export const getNextOccurrence = (date: Date, rule: RecurrenceRule): Date => {
  const interval = rule.interval || 1;
  
  switch (rule.type) {
    case 'daily':
      return addDays(date, interval);
      
    case 'weekly':
      if (rule.weekdays && rule.weekdays.length > 0) {
        // Find the next matching weekday
        let nextDate = addDays(date, 1);
        while (!rule.weekdays.includes(nextDate.getDay())) {
          nextDate = addDays(nextDate, 1);
        }
        return nextDate;
      }
      return addWeeks(date, interval);
      
    case 'monthly':
      return addMonthsFn(date, interval);
      
    case 'custom':
      if (interval) {
        return addDays(date, interval);
      }
      return addDays(date, 1);
      
    default:
      return addDays(date, 1);
  }
};

export const hasTimeConflict = (event1: Event, event2: Event): boolean => {
  // Both events must have time set to check for conflicts
  if (!event1.time || !event2.time) return false;
  
  // Must be on the same day
  if (event1.date !== event2.date) return false;
  
  const event1Start = event1.time;
  const event1End = event1.endTime || addTimeMinutes(event1.time, 60);
  
  const event2Start = event2.time;
  const event2End = event2.endTime || addTimeMinutes(event2.time, 60);
  
  // Check if event1 starts during event2
  if (event1Start >= event2Start && event1Start < event2End) return true;
  
  // Check if event2 starts during event1
  if (event2Start >= event1Start && event2Start < event1End) return true;
  
  return false;
};

export const addTimeMinutes = (time: string, minutesToAdd: number): string => {
  const [hours, minutes] = time.split(':').map(Number);
  
  let totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};