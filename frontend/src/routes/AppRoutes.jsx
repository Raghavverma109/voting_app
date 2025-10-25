// src/routes/AppRoutes.jsx
import React, { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// --- Dynamically import page components ---
// This tells Vite/React to create separate JS files for each page
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const ManageParties = lazy(() => import('../pages/ManageParties'));
const ManageElections = lazy(() => import('../pages/ManageElections'));
const ElectionHistory = lazy(() => import('../pages/ElectionHistory'));
const AuditDetail = lazy(() => import('../pages/AuditDetail'));
const Results = lazy(() => import('../pages/Results'));
const LiveResults = lazy(() => import('../pages/LiveResults'));
const MapResults = lazy(() => import('../pages/MapResults'));
const Profile = lazy(() => import('../pages/Profile'));

// Your existing ProtectedRoute component (no changes needed here)
const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-400">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};

// Simple component to show while pages are loading
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen bg-slate-900">
    <p className="text-white text-lg">Loading Page...</p>
    {/* You could add a spinner component here */}
  </div>
);

export default function AppRoutes() {
  return (
    // Wrap all routes in <Suspense> to handle the loading state
    <Suspense fallback={<LoadingFallback />}>
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
          <Route path="/map-results" element={<MapResults />} />
        </Route>

        {/* Nested Admin-Only Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true} />}>
          <Route index element={<AdminDashboard />} />
          <Route path="parties" element={<ManageParties />} />
          <Route path="elections" element={<ManageElections />} />
          <Route path="history" element={<ElectionHistory />} />
          <Route path="history/:electionId" element={<AuditDetail />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}