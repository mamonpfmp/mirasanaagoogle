/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { AuthGuard, AdminGuard } from './ProtectedRoutes';
import { Login } from './Login';
import { UserDashboard } from './UserDashboard';
import { AdminDashboard } from './AdminDashboard';
import { CriteriaSettings } from './CriteriaSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* User Protected Route (Accessible to authenticated users with user or admin role) */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <UserDashboard />
              </AuthGuard>
            }
          />

          {/* Admin Protected Route: Users Management */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />

          {/* Admin Protected Route: Criteria & Rubrics Settings */}
          <Route
            path="/admin/criteria"
            element={
              <AdminGuard>
                <CriteriaSettings />
              </AdminGuard>
            }
          />
          <Route
            path="/criteria"
            element={
              <AdminGuard>
                <CriteriaSettings />
              </AdminGuard>
            }
          />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
