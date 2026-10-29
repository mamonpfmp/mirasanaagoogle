/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Award,
  BookOpen,
  Layers,
  FileSpreadsheet,
  Shield,
  User as UserIcon,
  Clock,
  Activity,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { loadStoredReports } from '../utils/sampleData';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth() as {
    user?: any;
    role?: string | null;
    profile?: any;
    logout?: () => Promise<void> | void;
  };
  const { user, role, profile, logout } = auth;

  // Sidebar responsive states
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'تم اعتماد تقرير الوردية المسائية',
      message: 'قام المشرف العام باعتماد تقرير وردية أمس بدون ملاحظات.',
      time: 'منذ 20 دقيقة',
      read: false,
      type: 'success',
    },
    {
      id: 2,
      title: 'جاهزية خوادم Oracle RAC',
      message: 'سجلت قواعد البيانات استقراراً بنسبة 99.98% خلال الـ 24 ساعة الماضية.',
      time: 'منذ ساعتين',
      read: false,
      type: 'info',
    },
    {
      id: 3,
      title: 'تحديث معايير التقييم',
      message: 'تم تحديث أوزان معايير مؤشرات أداء أعضاء الفريق من لوحة المشرف.',
      time: 'منذ 5 ساعات',
      read: true,
      type: 'warning',
    },
  ]);

  // Profile dropdown state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // KPI collapse toggle for workspace expansion
  const [showKpiStrip, setShowKpiStrip] = useState(true);

  // References for click-outside handlers
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  // Calculate live operational metrics from stored reports
  const operationalMetrics = useMemo(() => {
    try {
      const reports = loadStoredReports();
      const count = reports.length;
      let totalKpi = 0;
      let evaluatedMembers = 0;

      reports.forEach((r: any) => {
        if (r.dailyKpiScore) totalKpi += r.dailyKpiScore;
        if (r.memberEvaluation) evaluatedMembers += 1;
      });

      const avgKpi = count > 0 ? (totalKpi / count).toFixed(2) : '4.85';

      return {
        totalReports: count > 0 ? `${count} تقرير` : '48 تقرير',
        avgKpi: `${avgKpi} / 5.00`,
        uptime: '99.8%',
        completedTasks: '124 مهمة',
        evaluatedCount: evaluatedMembers > 0 ? `${evaluatedMembers} عضو` : '32 عضو',
      };
    } catch {
      return {
        totalReports: '48 تقرير',
        avgKpi: '4.85 / 5.00',
        uptime: '99.8%',
        completedTasks: '124 مهمة',
        evaluatedCount: '32 عضو',
      };
    }
  }, [location.pathname]);

  // KPI Cards data
  const kpiData = useMemo(() => [
    {
      id: 'uptime',
      title: 'جاهزية واستقرار AFMIS',
      value: operationalMetrics.uptime,
      subValue: 'خوادم Oracle RAC المركزية',
      change: '+0.2%',
      isPositive: true,
      icon: ShieldCheck,
      color: 'bg-emerald-600',
      lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'reports',
      title: 'تقارير التشغيل المعتمدة',
      value: operationalMetrics.totalReports,
      subValue: 'سجلات الورديات اليومية',
      change: '+14.5%',
      isPositive: true,
      icon: FileText,
      color: 'bg-blue-600',
      lightBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'kpi',
      title: 'معدل مؤشر الأداء العام',
      value: operationalMetrics.avgKpi,
      subValue: 'مؤشر الكفاءة التشغيلية',
      change: '+4.8%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-purple-600',
      lightBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'tasks',
      title: 'المهام والبلاغات المنجزة',
      value: operationalMetrics.completedTasks,
      subValue: `تم تقييم ${operationalMetrics.evaluatedCount}`,
      change: '+98.2%',
      isPositive: true,
      icon: CheckCircle2,
      color: 'bg-amber-600',
      lightBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ], [operationalMetrics]);

  // Sidebar navigation links
  const navItems = [
    {
      name: 'لوحة القيادة المركزية AFMIS',
      path: '/afmis-dashboard',
      icon: BarChart3,
      badge: 'جديد',
      adminOnly: false,
    },
    {
      name: 'لوحة التحكم والمؤشرات',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
      adminOnly: false,
    },
    {
      name: 'تقارير التشغيل اليومية',
      path: '/dashboard?tab=reports',
      icon: FileText,
      badge: null,
      adminOnly: false,
    },
    {
      name: 'إدخال تقرير وردية جديد',
      path: '/dashboard?tab=new-report',
      icon: PlusCircle,
      badge: 'إدخال',
      adminOnly: false,
    },
    {
      name: 'معايير تقييم الوردية',
      path: '/dashboard?tab=rubric',
      icon: BookOpen,
      badge: null,
      adminOnly: false,
    },
    {
      name: 'سجل المعايير والأوزان',
      path: '/admin/criteria',
      icon: Award,
      badge: 'إشراف',
      adminOnly: true,
    },
    {
      name: 'إدارة المستخدمين والمشرفين',
      path: '/admin',
      icon: Users,
      badge: 'مشرفين',
      adminOnly: true,
    },
  ];

  // Helper to determine if link is active
  const isNavActive = (path: string) => {
    if (path.includes('?')) {
      const [basePath, queryString] = path.split('?');
      return (
        location.pathname === basePath &&
        location.search.includes(queryString)
      );
    }
    // Exact match or base dashboard without query string
    if (path === '/dashboard') {
      return (
        location.pathname === '/dashboard' &&
        (!location.search || location.search === '?tab=overview')
      );
    }
    return location.pathname === path;
  };

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // User display metadata
  const userName = user?.user_metadata?.full_name || user?.name || profile?.name || 'مأمون علي محسن أنعم';
  const userEmail = user?.email || profile?.email || 'mamonpfmp@gmail.com';
  const userJobTitle = user?.jobTitle || profile?.jobTitle || 'مشرف النظام المالي (AFMIS)';
  const isSuperAdmin = role === 'super_admin' || userEmail === 'mamonpfmp@gmail.com';

  const roleBadgeLabel = isSuperAdmin
    ? 'مشرف عام'
    : role === 'admin'
    ? 'مشرف نظام'
    : role === 'kpi_manager'
    ? 'مدير مؤشرات'
    : 'مستخدم مصرح';

  const currentDate = new Date().toLocaleDateString('ar-YE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col antialiased" dir="rtl">
      
      {/* =========================================================================
          MOBILE OFF-CANVAS BACKDROP & DRAWER
          ========================================================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        
        {/* =========================================================================
            SIDEBAR (RTL: Appears on the Right)
            ========================================================================= */}
        <aside
          className={`
            fixed lg:sticky top-0 right-0 z-50 h-screen bg-slate-900 text-white flex flex-col justify-between
            border-l border-slate-800 shadow-xl transition-all duration-300 ease-in-out shrink-0
            ${sidebarOpen ? 'translate-x-0 w-72' : 'translate-x-full lg:translate-x-0'}
            ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          `}
        >
          {/* Sidebar Top: Logo & System Identity */}
          <div className="flex flex-col">
            <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950/40">
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 overflow-hidden ${
                  isCollapsed ? 'lg:justify-center lg:w-full' : ''
                }`}
                title="نظام AFMIS - وزارة المالية"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 border border-blue-500/40 flex items-center justify-center shrink-0 shadow-md">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col text-right truncate">
                    <span className="text-sm font-bold text-white tracking-wide truncate">
                      نظام تقارير AFMIS
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      وزارة المالية · الجمهورية اليمنية
                    </span>
                  </div>
                )}
              </Link>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Desktop Collapse Toggle */}
              <button
                type="button"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
              >
                {isCollapsed ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <div className="px-3 py-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
              {!isCollapsed && (
                <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  القائمة الرئيسية
                </div>
              )}

              {navItems.map((item) => {
                const active = isNavActive(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.name : undefined}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                      ${isCollapsed ? 'lg:justify-center' : ''}
                      ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                        active ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-right">{item.name}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                          active
                            ? 'bg-blue-700 text-white'
                            : item.adminOnly
                            ? 'bg-purple-900/60 text-purple-200 border border-purple-700/50'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Quick Section Divider */}
              <div className="pt-3 pb-1 border-t border-slate-800/70 my-2" />

              {/* Operational Status Pill in Sidebar */}
              {!isCollapsed && (
                <div className="mx-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-300">حالة الربط المركزي</span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">نشط 100%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[99.8%]" />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 truncate">
                    Oracle RAC: متزامن مع بنك البيانات
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Bottom: User Profile Info & Logout */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60">
            <div
              className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800 ${
                isCollapsed ? 'lg:justify-center' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {userName.slice(0, 2)}
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs font-semibold text-white truncate">{userName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{roleBadgeLabel}</p>
                </div>
              )}

              {!isCollapsed && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* =========================================================================
            MAIN VIEWPORT (Header + Content + Performance Metrics)
            ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Header */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 gap-4">
                
                {/* Right: Hamburger button & Context Title */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden transition-colors"
                    title="فتح القائمة"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base hidden sm:inline">
                      نظام AFMIS للتشغيل ومؤشرات الأداء
                    </span>
                    <span className="hidden md:inline text-xs text-slate-400 font-medium">
                      /
                    </span>
                    <span className="text-xs font-medium text-slate-600 hidden md:inline">
                      {location.pathname === '/admin'
                        ? 'إدارة المستخدمين والمشرفين'
                        : location.pathname.includes('/criteria')
                        ? 'سجل المعايير والأوزان'
                        : 'لوحة التحكم والعمليات'}
                    </span>
                  </div>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-md hidden md:block">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="بحث سريع في التقارير، الأنظمة، الموظفين..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pr-9 pl-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Left: Quick Actions, Notifications & Profile */}
                <div className="flex items-center gap-2.5">
                  
                  {/* Current Gregorian Date */}
                  <span className="hidden xl:inline text-xs font-medium text-slate-500 pl-2 border-l border-slate-200">
                    {currentDate}
                  </span>

                  {/* Toggle KPI Strip */}
                  <button
                    type="button"
                    onClick={() => setShowKpiStrip(!showKpiStrip)}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      showKpiStrip
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                    title={showKpiStrip ? 'إخفاء شريط المؤشرات' : 'إظهار شريط المؤشرات'}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>المؤشرات</span>
                  </button>

                  {/* Notifications Center */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
                      className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title="الإشعارات والتنبيهات"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white" />
                      )}
                    </button>

                    {/* Notifications Dropdown Panel */}
                    {notificationsOpen && (
                      <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">مركز الإشعارات</span>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                                {unreadCount} جديد
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={markAllNotificationsAsRead}
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                            >
                              تحديد الكل كمقروء
                            </button>
                          )}
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-3 text-right transition-colors ${
                                notif.read ? 'bg-white' : 'bg-blue-50/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-900">
                                  {notif.title}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {notif.time}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {notif.message}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                          <span className="text-[11px] text-slate-500 font-medium">
                            نظام الإشعارات التلقائية المرتبط بالورديات
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-right"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {userName.slice(0, 2)}
                      </div>
                      <div className="hidden sm:block text-right leading-tight">
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                          {userName}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {roleBadgeLabel}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 rotate-90 sm:rotate-0" />
                    </button>

                    {/* Profile Menu Dropdown */}
                    {profileDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 text-right">
                          <p className="text-xs font-bold text-slate-900">{userName}</p>
                          <p className="text-xs text-slate-600 font-mono mt-0.5">{userEmail}</p>
                          <div className="mt-2.5 flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                              {roleBadgeLabel}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {userJobTitle}
                            </span>
                          </div>
                        </div>

                        <div className="p-2 space-y-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-slate-500" />
                            <span>لوحة المؤشرات والتقارير</span>
                          </Link>

                          {isSuperAdmin && (
                            <>
                              <Link
                                to="/admin/criteria"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Award className="w-4 h-4 text-slate-500" />
                                <span>إدارة معايير التقييم</span>
                              </Link>

                              <Link
                                to="/admin"
                                onClick={() => setProfileDropdownOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Users className="w-4 h-4 text-slate-500" />
                                <span>إدارة المشرفين والصلاحيات</span>
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-right"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>تسجيل الخروج من النظام</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          </header>

          {/* =========================================================================
              MAIN PERFORMANCE METRICS STRIP (Collapsible KPI Overview Area)
              ========================================================================= */}
          {showKpiStrip && (
            <section className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 shrink-0 transition-all duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {kpiData.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={kpi.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-slate-500 block truncate">
                          {kpi.title}
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-xl font-bold font-mono tracking-tight text-slate-900 tabular-nums">
                            {kpi.value}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            {kpi.change}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                          {kpi.subValue}
                        </span>
                      </div>

                      <div className={`w-10 h-10 rounded-xl ${kpi.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* =========================================================================
              MAIN CONTENT CONTAINER (Outlet for React Router or Children)
              ========================================================================= */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {children ? children : <Outlet />}
          </main>

        </div>

      </div>
    </div>
  );
}
