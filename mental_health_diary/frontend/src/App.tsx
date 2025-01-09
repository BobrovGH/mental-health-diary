import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import HomePage from './components/HomePage/HomePage';
import Registration from './components/LoginPage/Registration';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} /> 
                <Route path="/home/*" element={<HomePage />} />
                <Route path="*" element={<HomePage />} />
                <Route path="/register" element={<Registration />} />
            </Routes>
        </Router>
    );
}

export default App;
