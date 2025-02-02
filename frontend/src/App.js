import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CompetitionsPage from './pages/CompetitionsPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout';

const App = () => {
    return (
        <Routes>
            {/* Rotta pubblica per il login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotte protette */}
            <Route
                element={
                    <PrivateRoute>
                        <ProtectedLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/competitions" element={<CompetitionsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Route>
        </Routes>
    );
};

export default App;
