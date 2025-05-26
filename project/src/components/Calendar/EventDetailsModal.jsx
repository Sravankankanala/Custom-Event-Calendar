import React from 'react';
import Modal from 'react-modal';
import { X, Clock, Calendar, RotateCcw, Edit, Trash2 } from 'lucide-react';
import { formatDisplayDate, formatTime } from '../../utils/calendarUtils';

Modal.setAppElement('#root');

const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
}) => {
  if (!event) return null;

  // Define category colors and labels
  const categoryColors = {
    work: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    personal: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    meeting: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    reminder: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    other: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  };

  const categoryLabels = {
    work: 'Work',
    personal: 'Personal',
    meeting: 'Meeting',
    reminder: 'Reminder',
    other: 'Other',
  };

  const colorClasses = categoryColors[event.category] || categoryColors.other;
  const categoryLabel = categoryLabels[event.category] || 'Other';

  // Format recurrence text
  const getRecurrenceText = () => {
    const { type, interval = 1, weekdays = [] } = event.recurrence;
    
    switch (type) {
      case 'daily':
        return interval === 1 ? 'Daily' : `Every ${interval} days`;
      case 'weekly':
        if (weekdays.length > 0) {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const selectedDays = weekdays.map(day => days[day]).join(', ');
          return `Weekly on ${selectedDays}`;
        }
        return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
      case 'monthly':
        return interval === 1 ? 'Monthly' : `Every ${interval} months`;
      case 'custom':
        return `Every ${interval} days`;
      default:
        return 'One-time event';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-md w-full mx-auto mt-16 bg-white rounded-lg shadow-xl border border-gray-200 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4"
    >
      <div>
        {/* Header with category color */}
        <div className={`px-6 py-4 rounded-t-lg ${colorClasses.bg} ${colorClasses.text} border-b ${colorClasses.border}`}>
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-1 text-sm opacity-80">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-25">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Event details */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Date and time */}
            <div className="flex items-start">
              <Calendar size={18} className="mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-gray-800">{formatDisplayDate(new Date(event.date))}</p>
                {event.recurrence.type !== 'none' && (
                  <p className="text-sm text-gray-600 mt-1">
                    {getRecurrenceText()}
                  </p>
                )}
              </div>
            </div>

            {/* Time */}
            {event.time && (
              <div className="flex items-start">
                <Clock size={18} className="mr-3 mt-0.5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-800">
                    {formatTime(event.time)}
                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-800 whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-2">
            <button
              onClick={onDelete}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailsModal; 