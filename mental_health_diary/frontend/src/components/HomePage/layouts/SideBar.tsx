import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CalendarWidget from '../widgets/CalendarWidget';
import { useAuth } from '../../../utils/IsUserAuthenticated';
import { getUserData } from '../../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

const SideBar: React.FC = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

   // When scrolled more than 100px, show up button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch the user's profile picture based on the username
    const fetchProfilePic = async () => {
      if (username) {
        try {
          const data = await getUserData(username);
          setProfilePic(data.profile_pic);
        } catch (error) {
          console.error("Error fetching user profile picture:", error);
        }
      }
    };

    fetchProfilePic();
  }, [username]);

  return (
    <aside className="w-64 bg-white shadow-lg p-4">
      <div className="mb-4">
      <CalendarWidget/>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col mb-4">
        <Link to="/" className="text-lg text-gray-700 py-2 hover:bg-gray-200">
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
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/user')}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          )}
          <label className="cursor-pointer text-gray-700 hover:underline">{username || 'Username'}</label>
        </div>
        <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Выйти
        </button>
      </div>
      {/* Кнопка "Наверх" */}
      {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 left-4 bg-white hover:bg-gray-200 text-gray-400 font-bold py-2 px-4 rounded"
          >
            <FontAwesomeIcon icon={faCaretUp}  /> Наверх
          </button>
        )}
    </aside>
  );
};

export default SideBar;