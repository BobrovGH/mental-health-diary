import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import IsUserAuthenticated from './components/HomePage/IsUserAuthenticated';
import Registration from './components/LoginPage/Registration';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/*" element={
                                            <IsUserAuthenticated>
                                                <HomePage />
                                            </IsUserAuthenticated>} />
            </Routes>
        </Router>
    );
}

export default App;
