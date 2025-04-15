import React from 'react';
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getCalendarDate } from '../../../utils/GetCalendarDate';

const CalendarWidget: React.FC = () => {
  const { setSelectedDate } = getCalendarDate();
  const today = new Date();

  // This typing matches exactly what react-calendar expects
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    const date = value as Date;
    const localDateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
    setSelectedDate(localDateString);
  };

  return (
    <div>
      <Calendar
        locale="ru-RU"
        className="react-calendar"
        tileClassName="p-1 text-sm"
        prev2Label={null}
        next2Label={null}
        onChange={handleDateChange}
        maxDate={today}
        selectRange={false}
      />
    </div>
  );
};

export default CalendarWidget;