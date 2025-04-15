import React, { useState, useEffect } from "react";
import NoteFrequencyChart from "../AnalyticsPage/NoteFrequencyChart";
import MoodTrendsChart from "../AnalyticsPage/MoodOrEnergyBarChart";
import EmotionPieChart from "../AnalyticsPage/EmotionPieChart";
import { getOldestNoteDate, getNoteFrequency } from "../../utils/api";
import { Link } from "react-router-dom";

const AnalyticsPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = `${today.slice(0, 7)}-01`;

  const [userOldestNoteDate, setUserOldestNoteDate] = useState<string>("");
  const [startDate, setStartDate] = useState(firstDayOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [chartStartDate, setChartStartDate] = useState(firstDayOfMonth);
  const [chartEndDate, setChartEndDate] = useState(today);
  const [hasNotes, setHasNotes] = useState<boolean | null>(null);
  const [notesInPeriod, setNotesInPeriod] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's oldest note date, if there's no any notes date is ""
  useEffect(() => {
    const fetchOldestNoteDate = async () => {
      try {
        const data = await getOldestNoteDate();
        if (data.oldestNoteDate) {
          setUserOldestNoteDate(data.oldestNoteDate);
          setHasNotes(true);
        } else {
          setHasNotes(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка загрузки аналитики');
      } finally {
        setLoading(false);
      }
    };
    fetchOldestNoteDate();
  }, []);

  // Check if there are notes in the selected period
  useEffect(() => {
    const fetchNoteFrequency = async () => {
      try {
        const data = await getNoteFrequency(chartStartDate, chartEndDate);
        console.log(`data of note frequency: ${JSON.stringify(data)}`);
        if (data.data.length > 0) {
          setNotesInPeriod(true);
        } else {
          setNotesInPeriod(false);
        }
      } catch (error) {
        console.error("Error fetching note frequency data:", error);
      }
    };

    if (hasNotes) {
      fetchNoteFrequency();
    }
  }, [chartStartDate, chartEndDate, hasNotes]);

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

  if (loading) {
    return <div className="p-4 text-center">Загрузка уроков...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  // User has no notes
  if (hasNotes === false) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Аналитика</h2>
        <p className="mb-4">У вас пока нет заметок</p>
        <Link to="/notes/create" className="text-orange-500 hover:underline">
          Создать первую заметку
        </Link>
      </div>
    );
  }

  // No notes in selected period
  if (hasNotes && notesInPeriod === false) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Аналитика</h2>
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
        <p className="mb-4">Нет заметок для выбранного периода</p>
      </div>
    );
  }

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

      {/* Charts */}
      <div className="flex items-center gap-2 mb-2">
        <NoteFrequencyChart startDate={chartStartDate} endDate={chartEndDate} />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <MoodTrendsChart type="mood_trends" startDate={chartStartDate} endDate={chartEndDate} />
        </div>
        <div className="flex-1">
        <MoodTrendsChart type="energy_trends" startDate={chartStartDate} endDate={chartEndDate} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1">
          <EmotionPieChart type="Позитивные эмоции" startDate={chartStartDate} endDate={chartEndDate} />
        </div>
        <div className="flex-1">
          <EmotionPieChart type="Негативные эмоции" startDate={chartStartDate} endDate={chartEndDate} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;