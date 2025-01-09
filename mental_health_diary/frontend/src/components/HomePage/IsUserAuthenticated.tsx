import React from 'react';
import { Navigate } from 'react-router-dom';

const IsUserAuthenticated: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('access');
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default IsUserAuthenticated;