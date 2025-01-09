import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Calendar styles

// Dummy data for site pages
const NotesPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold">Заметки</h2>
    <p>Здесь всё будет, но потом</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold">Аналитика</h2>
    <p>Здесь всё будет, но потом</p>
  </div>
);

const ArtTherapyPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold">Арт-терапия</h2>
    <p>Здесь всё будет, но потом</p>
  </div>
);

const UserPage = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold">Профиль пользователя</h2>
    <p>Здесь всё будет, но потом</p>
  </div>
);

const HomePage: React.FC = () => {
  const [date, setDate] = useState(new Date());
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-128 bg-white shadow-lg p-4">
        <div className="mb-8">
          <div className="bg-gray-200 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">Календарь</h3>
            <Calendar
              onChange={handleDateChange}
              value={date}
              className="react-calendar"
            />
          </div>
        </div>

        <nav className="flex flex-col mb-4">
          <Link to="/home/notes" className="text-lg text-gray-700 py-2 hover:bg-gray-200">Заметки</Link>
          <Link to="/home/analytics" className="text-lg text-gray-700 py-2 hover:bg-gray-200">Аналитика</Link>
          <Link to="/home/arttherapy" className="text-lg text-gray-700 py-2 hover:bg-gray-200">Арт-терапия</Link>
        </nav>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-full bg-gray-400 cursor-pointer"
              onClick={() => navigate('/user')}
            ></div>
            <label
              className="cursor-pointer text-gray-700 hover:underline"
              onClick={() => navigate('/user')}
            >
              {username || 'Username'}
            </label>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('access');
              localStorage.removeItem('refresh'); //Removing tokens
              navigate('/login');
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Выйти
          </button>
        </div>

      </aside>
      {/* Navigation between dummy pages */}
      <main className="flex-1 p-6">
        <Routes> 
          <Route path="/" element={<NotesPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="arttherapy" element={<ArtTherapyPage />} />
          <Route path="user" element={<UserPage />} />
          
        </Routes>
      </main>
    </div>
  );
};

export default HomePage;
