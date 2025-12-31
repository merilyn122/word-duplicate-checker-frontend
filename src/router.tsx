import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';

// 页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WordLibrary from './pages/WordLibrary';
import CheckDuplicate from './pages/CheckDuplicate';
import Reports from './pages/Reports';
import MainLayout from './components/Layout/MainLayout';

// 私有路由组件
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return isAuthenticated ? (
        <MainLayout>{children}</MainLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />

                <Route path="/word-library" element={
                    <PrivateRoute>
                        <WordLibrary />
                    </PrivateRoute>
                } />

                <Route path="/check-duplicate" element={
                    <PrivateRoute>
                        <CheckDuplicate />
                    </PrivateRoute>
                } />

                <Route path="/reports" element={
                    <PrivateRoute>
                        <Reports />
                    </PrivateRoute>
                } />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;