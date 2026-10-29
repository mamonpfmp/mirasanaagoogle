/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { AuthGuard, AdminGuard } from './ProtectedRoutes';
import AppLayout from './AppLayout';
import Login from './Login';
import AFMISDashboard from './AFMISDashboard';
import AdminDashboard from './AdminDashboard';
import CriteriaSettings from './CriteriaSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. مسار تسجيل الدخول (خارج غلاف AppLayout) */}
          <Route path="/login" element={<Login />} />

          {/* 2. المسارات المحمية داخل الغلاف المعماري الموحد AppLayout */}
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            {/* لوحة القيادة والمؤشرات المركزية AFMIS */}
            <Route path="/dashboard" element={<AFMISDashboard />} />

            {/* لوحة إدارة المستخدمين والصلاحيات (مشرفين) */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />

            {/* إدارة المعايير والتقييم (مشرفين) */}
            <Route
              path="/admin/criteria"
              element={
                <AdminGuard>
                  <CriteriaSettings />
                </AdminGuard>
              }
            />
          </Route>

          {/* 3. مسارات التوجيه الافتراضية والمسارات غير المعروفة */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
