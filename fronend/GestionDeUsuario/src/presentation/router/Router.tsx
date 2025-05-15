import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import ProfilePage from '@pages/ProfilePage';
import AdminUsersPage from '@pages/AdminUsersPage';
import AdminUserEditPage from '@pages/AdminUserEditPage';
import NotFoundPage from '@pages/NotFoundPage';

// Components
import ProtectedRoute from './ProtectedRoute';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes for all authenticated users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Admin-only routes */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users/:userId" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUserEditPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;