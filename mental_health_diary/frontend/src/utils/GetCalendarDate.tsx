import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface CalendarDateContextValue {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

// Create the context
const CalendarDateContext = createContext<CalendarDateContextValue | undefined>(undefined);

// Create a provider component
export const CalendarDateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today in YYYY-MM-DD

  return (
    <CalendarDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </CalendarDateContext.Provider>
  );
};

// Custom hook to use the context
export const getCalendarDate = (): CalendarDateContextValue => {
  const context = useContext(CalendarDateContext);
  if (!context) {
    throw new Error('useCalendarDate must be used within a CalendarDateProvider');
  }
  return context;
};