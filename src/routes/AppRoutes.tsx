import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/pages/Landing/LandingPage';
import LoginPage from '@/pages/Login/LoginPage';
import SignUpPage from '@/pages/SignUp/SignUpPage';
import GovernmentDashboard from '@/pages/GovernmentDashboard/GovernmentDashboard';
import ProcurementDashboard from '@/pages/ProcurementDashboard/ProcurementDashboard';
import ShippingDashboard from '@/pages/ShippingDashboard/ShippingDashboard';
import RefineryDashboard from '@/pages/RefineryDashboard/RefineryDashboard';
import DecisionDashboard from '@/pages/DecisionDashboard/DecisionDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/government"
          element={
            <ProtectedRoute allowedRoles={['government']}>
              <GovernmentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/procurement"
          element={
            <ProtectedRoute allowedRoles={['procurement']}>
              <ProcurementDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipping"
          element={
            <ProtectedRoute allowedRoles={['shipping']}>
              <ShippingDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refinery"
          element={
            <ProtectedRoute allowedRoles={['refinery']}>
              <RefineryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/decision"
          element={
            <ProtectedRoute allowedRoles={['executive']}>
              <DecisionDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
