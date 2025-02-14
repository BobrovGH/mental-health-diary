import { Routes, Route } from 'react-router-dom';
import SideBar from './layouts/SideBar';
import NotesPage from './NotesPage';
import ArtTherapyPage from './ArtTherapyPage';
import AnalyticsPage from './AnalyticsPage';
import UserPage from './UserPage';

const HomePage: React.FC = () => {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar/>
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
