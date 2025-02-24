import React, { useState, useEffect } from "react";
import NoteFrequencyChart from "../AnalyticsPage/NoteFrequencyChart";
import MoodTrendsChart from "../AnalyticsPage/MoodOrEnergyBarChart";
import EmotionPieChart from "../AnalyticsPage/EmotionPieChart";
import { getOldestNoteDate } from "../../utils/api";

const AnalyticsPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [userOldestNoteDate, setUserOldestNoteDate] = useState<string>("2025-01-01");

  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [chartStartDate, setChartStartDate] = useState(firstDayOfMonth);
  const [chartEndDate, setChartEndDate] = useState(today);

  useEffect(() => {
    const fetchOldestNoteDate = async () => {
      try {
        const data = await getOldestNoteDate();
        console.log(`date of the oldest user's note: ${JSON.stringify(data)}`)
        if (data.oldest_note_date) {
          setUserOldestNoteDate(data.oldest_note_date);
        }
      } catch (error) {
        console.error("Error fetching oldest note date:", error);
      }
    };
    fetchOldestNoteDate();
  }, []);

  // Validate and set start date
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDate = e.target.value;
    if (newDate < userOldestNoteDate) newDate = userOldestNoteDate;
    if (newDate > today) newDate = today;
    setStartDate(newDate);

    // Ensure startDate is not after endDate
    if (newDate > endDate) setEndDate(newDate);
  };

  // Validate and set end date
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDate = e.target.value;
    if (newDate < userOldestNoteDate) newDate = userOldestNoteDate;
    if (newDate > today) newDate = today;
    setEndDate(newDate);

    // Ensure endDate is not before startDate
    if (newDate < startDate) setStartDate(newDate);
  };

  // Update chart when button is clicked
  const updateChart = () => {
    setChartStartDate(startDate);
    setChartEndDate(endDate);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Аналитика</h2>
        <p className="mb-4">Посмотреть аналитику для следующего периода:</p>

        <div className="flex items-center space-x-4 mb-4">
          <input
            type="date"
            id="start"
            name="start-date"
            value={startDate}
            min={userOldestNoteDate}
            max={today}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={handleStartDateChange}
          />
          <span className="text-lg">—</span>
          <input
            type="date"
            id="end"
            name="end-date"
            value={endDate}
            min={userOldestNoteDate}
            max={today}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={handleEndDateChange}
          />
          <button
            type="button"
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none"
            onClick={updateChart}
          >
            Обновить график
          </button>
        </div>


      </div>

      <div className="flex items-center gap-2 mb-2">
        <NoteFrequencyChart startDate={chartStartDate} endDate={chartEndDate} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <MoodTrendsChart type="mood_trends" startDate={chartStartDate} endDate={chartEndDate} />
        <MoodTrendsChart type="energy_trends" startDate={chartStartDate} endDate={chartEndDate} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <EmotionPieChart type="Позитивные эмоции" startDate={chartStartDate} endDate={chartEndDate} />
        <EmotionPieChart type="Негативные эмоции" startDate={chartStartDate} endDate={chartEndDate} />
      </div>
    </div>
  );
};

export default AnalyticsPage;