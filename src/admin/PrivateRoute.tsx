// src/admin/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const token = localStorage.getItem('adminToken');
  return token
    ? <Outlet />
    : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;
