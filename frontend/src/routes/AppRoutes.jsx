// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Import Outlet
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Results from '../pages/Results';
import Profile from '../pages/Profile';
import { useAuth } from '../contexts/AuthContext';
import ManageElections from '../pages/ManageElections';
import ManageParties from '../pages/ManageParties'; // Import the new parties page
import LiveResults from '../pages/LiveResults';

// This component now acts as a "gatekeeper" for protected sections.
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If it's an admin-only route and the user is not an admin, redirect
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  // If checks pass, render the child route (e.g., AdminDashboard, ManageParties)
  return <Outlet />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Standard Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/live-results" element={<LiveResults />} />
      </Route>

      {/* --- Nested Admin-Only Routes --- */}
      <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
        {/* The index route is what shows at the base "/admin" path */}
        <Route index element={<AdminDashboard />} />
        
        {/* Child routes are nested and inherit the path and protection */}
        <Route path="parties" element={<ManageParties />} />
        <Route path="elections" element={<ManageElections />} />
      </Route>

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}