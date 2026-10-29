/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth as useRealAuth } from './AuthContext';

// ----------------------------------------------------------------------
// هوك محاكاة للمصادقة وحساب الصلاحيات (مع دعم التكامل التلقائي مع AuthContext)
// ----------------------------------------------------------------------
export const useAuth = () => {
  // محاولة جلب المستخدم الحقيقي من AuthContext إن وُجد
  let contextAuth = null;
  try {
    contextAuth = useRealAuth();
  } catch (e) {
    // خارج الـ AuthProvider
  }

  // إذا كان مزود AuthContext متوفراً، نعتمد على مستخدم الجلسة
  const user = contextAuth !== null ? contextAuth.user : {
    name: 'مأمون علي محسن أنعم',
    email: 'mamonpfmp@gmail.com',
    jobTitle: 'مشرف النظام المالي (AFMIS)',
    role: 'super_admin', // الصلاحية: 'super_admin' | 'admin' | 'user'
  };

  // التحقق المزدوج: إما أن يكون الدور الإداري مسجلاً في قاعدة البيانات 
  // أو أن يكون البريد الإلكتروني هو بريد المشرف العام بالتحديد
  const isSuperAdmin =
    user?.email === 'mamonpfmp@gmail.com' ||
    user?.role === 'super_admin' ||
    contextAuth?.role === 'super_admin';

  // صلاحية الإدارة (تشمل المشرف العام ومدير النظام)
  const isAdmin =
    isSuperAdmin ||
    user?.role === 'admin' ||
    contextAuth?.role === 'admin';

  const isAuthenticated = Boolean(user && (user.email || user.id));
  const loading = contextAuth?.loading || false;

  return {
    user,
    role: isSuperAdmin ? 'super_admin' : (user?.role || 'user'),
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
    loading,
    logout: contextAuth?.logout,
  };
};

// ----------------------------------------------------------------------
// شاشة انتظار أنيقة باللغة العربية أثناء التحقق من الجلسة
// ----------------------------------------------------------------------
const LoadingScreen = () => (
  <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-sm font-semibold text-slate-700">
        جارٍ التحقق من صلاحيات الدخول والنظام...
      </span>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// حارس المصادقة الأساسي (AuthGuard): حماية المسارات من الزوار غير المسجلين
// ----------------------------------------------------------------------
export const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // إعادة التوجيه إلى صفحة تسجيل الدخول مع حفظ المسار الحالي للعودة إليه لاحقاً
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // يدعم كلاً من تمرير المكونات كـ children أو استخدام عنصر Outlet للمسارات المتداخلة
  return children ? <>{children}</> : <Outlet />;
};

// ----------------------------------------------------------------------
// حارس المشرفين (AdminGuard): يسمح فقط لمدراء النظام والمشرف العام
// ----------------------------------------------------------------------
export const AdminGuard = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // إذا لم يكن لديه صلاحية إدارية، يُعاد توجيهه للوحة المستخدم العادية
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// ----------------------------------------------------------------------
// حارس المشرف العام (SuperAdminGuard): مخصص حصرياً للمشرف العام
// ----------------------------------------------------------------------
export const SuperAdminGuard = ({ children }) => {
  const { isAuthenticated, isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

// ----------------------------------------------------------------------
// حارس الزوار (GuestGuard): لمنع المستخدم المسجل من العودة لصفحة تسجيل الدخول
// ----------------------------------------------------------------------
export const GuestGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AuthGuard;
