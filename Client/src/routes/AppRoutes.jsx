import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Protection
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Loading fallback
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center dark">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-muted-foreground animate-pulse">Loading WebTrack...</p>
  </div>
);

// Lazy load pages for better performance
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Register = lazy(() => import('../pages/Auth/Register'));
const MySites = lazy(() => import('../pages/Sites/MySites'));
const CreateSite = lazy(() => import('../pages/Sites/CreateSite'));
const Overview = lazy(() => import('../pages/Analytics/Overview'));
const Realtime = lazy(() => import('../pages/Analytics/Realtime'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#18181b', // zinc-900
            color: '#fff',
            border: '1px solid #27272a', // zinc-800
          },
        }}
      />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/sites" replace />} />
              <Route path="sites" element={<MySites />} />
              <Route path="sites/create" element={<CreateSite />} />
              <Route path="analytics" element={<Overview />} />
              <Route path="realtime" element={<Realtime />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
