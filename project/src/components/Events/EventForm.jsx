import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { X, Trash2, AlertCircle } from 'lucide-react';
import { formatDate, formatDisplayDate, hasTimeConflict } from '../../utils/calendarUtils';
import { useCalendar } from '../../context/CalendarContext';

Modal.setAppElement('#root');

const initialRecurrence = {
  type: 'none',
  interval: 1,
  weekdays: [],
  monthDay: 1,
  endDate: null,
  occurrences: null,
};

const EventForm = ({
  isOpen,
  onClose,
  selectedDate,
  eventToEdit = null,
}) => {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendar();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(formatDate(selectedDate));
  const [time, setTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [recurrence, setRecurrence] = useState(initialRecurrence);
  const [weekdays, setWeekdays] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteRecurring, setDeleteRecurring] = useState(false);

  // Initialize form with event data if editing
  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time);
      setEndTime(eventToEdit.endTime);
      setDescription(eventToEdit.description);
      setCategory(eventToEdit.category);
      setRecurrence(eventToEdit.recurrence);
      setWeekdays(eventToEdit.recurrence.weekdays || []);
    } else {
      // New event defaults
      setTitle('');
      setDate(formatDate(selectedDate));
      setTime('09:00');
      setEndTime('10:00');
      setDescription('');
      setCategory('other');
      setRecurrence(initialRecurrence);
      setWeekdays([]);
    }
    // Reset conflicts when form opens
    setConflicts([]);
    setShowDeleteConfirm(false);
  }, [eventToEdit, selectedDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare event data
    const eventData = {
      title,
      date,
      time,
      endTime,
      description,
      category,
      recurrence: {
        ...recurrence,
        weekdays: recurrence.type === 'weekly' ? weekdays : undefined,
        monthDay: recurrence.type === 'monthly' ? new Date(date).getDate() : undefined,
      },
    };
    
    // Check for conflicts
    const potentialConflicts = events.filter(e => 
      e.date === date && 
      (eventToEdit ? e.id !== eventToEdit.id : true) && 
      hasTimeConflict(e, eventData)
    );
    
    if (potentialConflicts.length > 0) {
      setConflicts(potentialConflicts);
      return;
    }
    
    // Add or update the event
    if (eventToEdit) {
      updateEvent({ ...eventData, id: eventToEdit.id });
    } else {
      addEvent(eventData);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (eventToEdit) {
      deleteEvent(eventToEdit.id, deleteRecurring);
      onClose();
    }
  };

  const handleWeekdayToggle = (day) => {
    setWeekdays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-lg w-full mx-auto mt-16 bg-white rounded-lg shadow-xl border border-gray-200 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {eventToEdit ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conflict warning */}
        {conflicts.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-medium text-yellow-700">Time Conflict Detected</p>
                <p className="text-sm text-yellow-600 mt-1">
                  This event conflicts with:
                </p>
                <ul className="text-sm text-yellow-600 mt-1 ml-4 list-disc">
                  {conflicts.map(conflict => (
                    <li key={conflict.id}>
                      {conflict.title} ({conflict.time ? `${conflict.time}${conflict.endTime ? ` - ${conflict.endTime}` : ''}` : 'All day'})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add title"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                  <span className="ml-2 text-xs text-gray-500">(optional)</span>
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="time"
                    value={time || ''}
                    onChange={(e) => setTime(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {time && (
                    <input
                      type="time"
                      value={endTime || ''}
                      onChange={(e) => setEndTime(e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="End time"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="meeting">Meeting</option>
                <option value="reminder">Reminder</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
                <span className="ml-2 text-xs text-gray-500">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add a description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <div>
                {eventToEdit && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {eventToEdit ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Event</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this event?
              </p>
              {eventToEdit?.recurrence?.type !== 'none' && (
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={deleteRecurring}
                      onChange={(e) => setDeleteRecurring(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Delete all recurring events
                    </span>
                  </label>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EventForm; 