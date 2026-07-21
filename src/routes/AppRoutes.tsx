import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import LandingPage from '@/pages/Landing';
import LoginPage from '@/pages/Login';
import NotFoundPage from '@/pages/NotFound';
import GovernmentDashboard from '@/pages/GovernmentDashboard';
import ProcurementDashboard from '@/pages/ProcurementDashboard';
import ShippingDashboard from '@/pages/ShippingDashboard';
import RefineryDashboard from '@/pages/RefineryDashboard';
import DecisionDashboard from '@/pages/DecisionDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <DashboardLayout />
            </ErrorBoundary>
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

      {/* 404 */}
      <Route path="/404" element={<NotFoundPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
