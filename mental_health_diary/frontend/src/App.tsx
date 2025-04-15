import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import { AuthProvider } from './utils/IsUserAuthenticated';
import Registration from './components/LoginPage/Registration';
import { CalendarDateProvider } from './utils/GetCalendarDate';

function App() {
    return (
        <Router>
            <CalendarDateProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/*" element={<HomePage />} />
                    </Routes>
                </AuthProvider>
            </CalendarDateProvider>
        </Router>
    );
}

export default App;
