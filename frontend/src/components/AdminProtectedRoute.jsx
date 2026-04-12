import React from 'react';
import { Navigate } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  const isAdmin = adminService.getCurrentAdmin();
  const token = adminService.getAdminToken();

  if (!isAdmin || !token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
