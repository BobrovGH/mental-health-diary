import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getCalendarDate } from '../../../utils/GetCalendarDate';

const CalendarWidget: React.FC = () => {
  const { setSelectedDate } = getCalendarDate();
  const today = new Date();

  const handleDateChange = (date: Date) => {
    const formattedDate = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0'); // Keeps local date
    setSelectedDate(formattedDate);
    console.log('Date selected:', formattedDate);
  };
  
  return (
    <div className="p-2">
      <Calendar
        locale="ru-RU"
        className="react-calendar"
        tileClassName="p-1 text-sm"
        prev2Label={null}
        next2Label={null}
        onChange={handleDateChange}
        maxDate={today}
      />
    </div>
  );
};

export default CalendarWidget;