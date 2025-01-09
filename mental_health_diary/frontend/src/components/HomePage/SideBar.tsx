import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarWidget from './CalendarWidget';

interface SideBarProps {
  username: string;
}

const SideBar: React.FC<SideBarProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh');
    
    if (refreshToken) {
        await fetch('http://127.0.0.1:8000/api/users/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
    }

    localStorage.removeItem('access');
    localStorage.removeItem('refresh'); // Remove tokens

    navigate('/login');
};

  return (
    <aside className="w-128 bg-white shadow-lg p-4">
      {/* Calendar Widget */}
      <div className="mb-8">
        <CalendarWidget />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mb-4">
        <Link to="/notes" className="text-lg text-gray-700 py-2 hover:bg-gray-200">
          Заметки
        </Link>
        <Link to="/analytics" className="text-lg text-gray-700 py-2 hover:bg-gray-200">
          Аналитика
        </Link>
        <Link to="/arttherapy" className="text-lg text-gray-700 py-2 hover:bg-gray-200">
          Арт-терапия
        </Link>
      </nav>

      {/* User Info */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate('/user')}
        >
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          <label className="cursor-pointer text-gray-700 hover:underline">{username}</label>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
