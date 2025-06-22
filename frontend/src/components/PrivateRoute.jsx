import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('access_token');
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (err) {
    localStorage.removeItem('access_token');
    return <Navigate to="/login" replace />;
  }
}
