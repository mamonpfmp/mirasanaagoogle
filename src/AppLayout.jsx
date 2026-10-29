/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Shield,
  Award,
  FileText,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export default function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();
  const { user, role, logout } = auth || {};

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showKpiStrip, setShowKpiStrip] = useState(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications dropdown
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'تمت تسوية أوامر التحصيل اليومية',
      message: 'تم إنجاز تسوية 1,840 عملية تحصيل بنكية بنجاح في نظام AFMIS.',
      time: 'منذ 15 دقيقة',
      read: false,
    },
    {
      id: 2,
      title: 'استقرار خوادم Oracle RAC المركزية',
      message: 'سجلت قواعد البيانات استقراراً بنسبة 99.85% دون أي انقطاع.',
      time: 'منذ ساعة',
      read: false,
    },
    {
      id: 3,
      title: 'تحديث معايير التقييم والأوزان',
      message: 'تم تعديل الأوزان النسبية لمؤشرات الأداء للعام المالي الجديد.',
      time: 'منذ 3 ساعات',
      read: true,
    },
  ]);

  // Profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Performance metrics summary
  const kpiData = [
    {
      title: 'إجمالي أوامر التحصيل المعتمدة',
      value: '18,420 أمر',
      change: '+14.8%',
      isPositive: true,
      subText: 'تسوية فورية AFMIS',
      icon: Receipt,
      accentColor: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'حجم التدفقات المالية المنفذة',
      value: '3,712.6 م.ر',
      change: '+9.3%',
      isPositive: true,
      subText: 'خلال الأسبوع الماضي',
      icon: DollarSign,
      accentColor: 'bg-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'المستخدمين والجهات المتصلة',
      value: '1,248 مستخدم',
      change: '+24.3%',
      isPositive: true,
      subText: 'في 142 جهة حكومية',
      icon: Users,
      accentColor: 'bg-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'جاهزية واستقرار النظام المالي',
      value: '99.85%',
      change: '+0.15%',
      isPositive: true,
      subText: 'خوادم Oracle المركزية',
      icon: CheckCircle2,
      accentColor: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  // Sidebar navigation items
  const navItems = [
    {
      name: 'لوحة القيادة والمؤشرات (AFMIS)',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'الرئيسية',
    },
    {
      name: 'إدارة المستخدمين والصلاحيات',
      path: '/admin',
      icon: Users,
      badge: 'CRUD',
    },
    {
      name: 'إدارة المعايير والتقييم',
      path: '/admin/criteria',
      icon: Award,
      badge: 'KPIs',
    },
  ];

  const isNavActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const userName = user?.user_metadata?.full_name || user?.name || 'مأمون علي محسن أنعم';
  const userEmail = user?.email || 'mamonpfmp@gmail.com';
  const isSuperAdmin = role === 'super_admin' || userEmail === 'mamonpfmp@gmail.com';
  const roleLabel = isSuperAdmin
    ? 'مشرف عام (Super Admin)'
    : role === 'admin'
    ? 'مشرف نظام'
    : role === 'kpi_manager'
    ? 'مدير مؤشرات'
    : 'مستخدم معتمد';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex" dir="rtl">
      
      {/* ---------------- 1. خلفية القائمة المتنقلة (Mobile Backdrop) ---------------- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ---------------- 2. الشريط الجانبي (Sidebar) ---------------- */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 bg-white border-l border-slate-200 flex flex-col justify-between transition-all duration-300 ease-in-out lg:static
        ${sidebarOpen ? 'translate-x-0 w-64' : 'translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div>
          {/* الشعار واسم التطبيق */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-right truncate">
                  <span className="font-bold text-base text-slate-900 tracking-tight">MOF KPIs</span>
                  <span className="text-[10px] text-slate-500 font-medium">وزارة المالية · AFMIS</span>
                </div>
              )}
            </Link>

            {/* زر إغلاق القائمة في الموبايل */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-500 hover:text-slate-700 p-1 rounded-lg"
              title="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>

            {/* زر طي القائمة في الشاشات الكبيرة */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
            >
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {/* روابط التنقل */}
          <nav className="p-3 space-y-1.5">
            {!isCollapsed && (
              <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                قوائم النظام
              </span>
            )}

            {navItems.map((item) => {
              const active = isNavActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all group ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* أسفل الشريط الجانبي: حالة الاتصال ومعلومات المشرف */}
        <div className="p-3 border-t border-slate-100">
          {!isCollapsed && (
            <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-700">الربط المركزي</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  نشط ومستقر
                </span>
              </div>
              <p className="text-[10px] text-slate-400">قواعد بيانات Oracle RAC</p>
            </div>
          )}

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                {userName.slice(0, 2)}
              </div>
              {!isCollapsed && (
                <div className="text-right truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{isSuperAdmin ? 'مشرف عام' : 'مستخدم'}</p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ---------------- 3. مساحة العمل والمحتوى الرئيسي ---------------- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* رأس الصفحة (Top Header) */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          
          {/* الجانب الأيمن: زر فتح القائمة والعنوان */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100"
              title="فتح القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 hidden sm:block">
                منظومة مؤشرات الأداء والتشغيل (AFMIS)
              </h1>
              <span className="hidden md:inline text-xs text-slate-400 font-medium">/</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 hidden md:inline">
                {location.pathname === '/admin'
                  ? 'إدارة المستخدمين'
                  : location.pathname.includes('/criteria')
                  ? 'معايير الأداء والتقييم'
                  : 'لوحة القيادة المركزية'}
              </span>
            </div>
          </div>

          {/* شريط البحث في المنتصف */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في العمليات، التقارير، المعايير، والمستخدمين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
          </div>

          {/* الجانب الأيسر: الإجراءات السريعة والإشعارات والملف الشخصي */}
          <div className="flex items-center gap-2.5">
            
            {/* زر إظهار/إخفاء بطاقات المؤشرات العلوية */}
            <button
              onClick={() => setShowKpiStrip(!showKpiStrip)}
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showKpiStrip
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title={showKpiStrip ? 'إخفاء شريط المؤشرات السريعة' : 'إظهار شريط المؤشرات السريعة'}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>المؤشرات</span>
            </button>

            {/* مركز الإشعارات */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="الإشعارات"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <span className="font-bold text-xs text-slate-900">الإشعارات والتنبيهات</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-600 hover:underline font-medium"
                      >
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-right">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 text-xs ${notif.read ? 'bg-white' : 'bg-blue-50/40'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* القائمة المنسدلة لملف المستخدم */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-right"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {userName.slice(0, 2)}
                </div>
                <div className="hidden sm:block text-right leading-tight">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">{userName}</p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{roleLabel}</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden text-right animate-in fade-in duration-150">
                  <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{userName}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{userEmail}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                      {roleLabel}
                    </span>
                  </div>
                  <div className="p-2 space-y-1 text-xs">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>لوحة القيادة المركزية</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      <Users className="w-4 h-4 text-slate-500" />
                      <span>إدارة المستخدمين</span>
                    </Link>
                    <Link
                      to="/admin/criteria"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 text-slate-700"
                    >
                      <Award className="w-4 h-4 text-slate-500" />
                      <span>معايير الأداء والتقييم</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ---------------- 4. بطاقات مؤشرات الأداء السريعة (KPIs Area) ---------------- */}
        {showKpiStrip && (
          <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 shrink-0 transition-all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-xs font-medium text-slate-500 block truncate">
                        {kpi.title}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-extrabold text-slate-900 font-mono tracking-tight">
                          {kpi.value}
                        </span>
                        <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                          kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {kpi.isPositive ? (
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-rose-600" />
                          )}
                          {kpi.change}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                        {kpi.subText}
                      </span>
                    </div>

                    <div className={`w-11 h-11 rounded-xl ${kpi.accentColor} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- 5. منطقة المحتوى الديناميكية (Outlet) ---------------- */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children ? children : <Outlet />}
        </main>

      </div>
    </div>
  );
}
