export type EventCategory = 'work' | 'personal' | 'meeting' | 'reminder' | 'other';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number; // every X days/weeks/months
  weekdays?: number[]; // 0-6 (Sunday-Saturday)
  monthDay?: number; // 1-31
  endDate?: string | null;
  occurrences?: number | null;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time: string | null; // HH:MM format or null for all-day events
  endTime: string | null; // HH:MM format or null for all-day events
  description: string;
  category: EventCategory;
  recurrence: RecurrenceRule;
  parentId?: string; // for recurring event instances
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface MonthData {
  weeks: CalendarWeek[];
  monthName: string;
  year: number;
}