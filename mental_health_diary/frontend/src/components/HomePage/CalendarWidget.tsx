import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWidget: React.FC = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Календарь</h3>
      <Calendar onChange={handleDateChange} value={date} className="react-calendar" />
    </div>
  );
};

export default CalendarWidget;
