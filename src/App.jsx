/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

// استيراد المكونات التي قمنا بإنشائها
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import CriteriaSettings from './CriteriaSettings';
import AFMISDashboard from './AFMISDashboard';
import { UserDashboard } from './UserDashboard';

function NavigationBar({ currentScreen, setCurrentScreen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // مزامنة حالة الشاشة مع المسار عند التنقل الداخلي (مثل النقر على الروابط داخل الصفحات)
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/users') {
      setCurrentScreen('admin');
    } else if (path === '/criteria' || path === '/admin/criteria') {
      setCurrentScreen('criteria');
    } else if (path === '/afmis' || path === '/afmis-dashboard') {
      setCurrentScreen('afmis');
    } else if (path === '/dashboard') {
      setCurrentScreen('dashboard');
    } else if (path === '/login') {
      setCurrentScreen('login');
    }
  }, [location.pathname, setCurrentScreen]);

  const handleScreenChange = (screenId, routePath) => {
    setCurrentScreen(screenId);
    navigate(routePath);
  };

  return (
    <div className="bg-gray-800 text-white p-3 md:p-4 shadow-md flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shadow">
          AF
        </div>
        <div>
          <span className="font-bold text-sm md:text-base text-gray-100">نظام إدارة ومتابعة الأداء المالي</span>
          <span className="hidden sm:inline-block mr-2 text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full border border-gray-600">
            بيئة التطوير والمعاينة
          </span>
        </div>
      </div>

      {/* 
        شريط تنقل علوي مؤقت (لأغراض التطوير والفحص فقط) 
        يسمح لك كمدير بالتنقل بين الشاشات لرؤية عملك
      */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-sm">
        <button 
          onClick={() => handleScreenChange('login', '/login')} 
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer hover:text-blue-300 ${
            currentScreen === 'login' ? 'bg-gray-700 text-blue-400 font-bold border border-blue-500/30' : 'text-gray-300'
          }`}
        >
          شاشة الدخول
        </button>

        <button 
          onClick={() => handleScreenChange('admin', '/admin')} 
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer hover:text-blue-300 ${
            currentScreen === 'admin' ? 'bg-gray-700 text-blue-400 font-bold border border-blue-500/30' : 'text-gray-300'
          }`}
        >
          لوحة المشرفين
        </button>

        <button 
          onClick={() => handleScreenChange('criteria', '/criteria')} 
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer hover:text-blue-300 ${
            currentScreen === 'criteria' ? 'bg-gray-700 text-blue-400 font-bold border border-blue-500/30' : 'text-gray-300'
          }`}
        >
          إدارة المعايير
        </button>

        <button 
          onClick={() => handleScreenChange('afmis', '/afmis')} 
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer hover:text-emerald-300 ${
            currentScreen === 'afmis' ? 'bg-gray-700 text-emerald-400 font-bold border border-emerald-500/30' : 'text-gray-300'
          }`}
        >
          لوحة AFMIS المركزية
        </button>

        <button 
          onClick={() => handleScreenChange('dashboard', '/dashboard')} 
          className={`px-3 py-1.5 rounded-md transition-all cursor-pointer hover:text-purple-300 ${
            currentScreen === 'dashboard' ? 'bg-gray-700 text-purple-400 font-bold border border-purple-500/30' : 'text-gray-300'
          }`}
        >
          مؤشرات الموظف
        </button>
      </div>
    </div>
  );
}

function MainContent({ currentScreen }) {
  return (
    <main className="w-full">
      {currentScreen === 'login' && <Login />}
      {currentScreen === 'admin' && <AdminDashboard />}
      {currentScreen === 'criteria' && <CriteriaSettings />}
      {currentScreen === 'afmis' && <AFMISDashboard />}
      {currentScreen === 'dashboard' && <UserDashboard />}
    </main>
  );
}

function App() {
  // حالة لإدارة الشاشة المعروضة (افتراضياً شاشة الدخول)
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
          <NavigationBar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
          <MainContent currentScreen={currentScreen} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
