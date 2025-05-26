import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CalendarProvider } from './context/CalendarContext';
import Calendar from './pages/Calendar';
import { Plus } from 'lucide-react';
import './index.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CalendarProvider>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-800">
                    Event Calendar
                  </h1>
                </div>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Calendar />
          </main>
        </div>
      </CalendarProvider>
    </DndProvider>
  );
}

export default App; 