/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  loadStoredReports,
  saveStoredReports,
  resetToSampleReports,
} from './utils/sampleData';
import { exportReportsToExcel } from './utils/excelExport';
import { DashboardView } from './components/DashboardView';
import { ReportFormView } from './components/ReportFormView';
import { ReportDetailModal } from './components/ReportDetailModal';
import { KpiRubricView } from './components/KpiRubricView';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  LogOut,
  Shield,
  User,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  FileSpreadsheet,
  PlusCircle,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react';

// Monthly KPI Trends Mock/Calculated Data for Recharts
const MONTHLY_KPI_TRENDS = [
  { date: '1 أكتوبر', dailyKpi: 4.45, memberKpi: 4.30, tasksCompleted: 28, requests: 45, uptime: 99.4 },
  { date: '5 أكتوبر', dailyKpi: 4.60, memberKpi: 4.52, tasksCompleted: 34, requests: 52, uptime: 99.7 },
  { date: '10 أكتوبر', dailyKpi: 4.38, memberKpi: 4.40, tasksCompleted: 31, requests: 48, uptime: 99.2 },
  { date: '15 أكتوبر', dailyKpi: 4.75, memberKpi: 4.68, tasksCompleted: 40, requests: 60, uptime: 99.9 },
  { date: '20 أكتوبر', dailyKpi: 4.82, memberKpi: 4.75, tasksCompleted: 42, requests: 64, uptime: 100.0 },
  { date: '24 أكتوبر', dailyKpi: 4.57, memberKpi: 4.60, tasksCompleted: 38, requests: 58, uptime: 99.8 },
  { date: '25 أكتوبر', dailyKpi: 4.29, memberKpi: 4.40, tasksCompleted: 35, requests: 50, uptime: 99.4 },
  { date: '26 أكتوبر', dailyKpi: 4.86, memberKpi: 5.00, tasksCompleted: 44, requests: 62, uptime: 99.9 },
];

export const UserDashboard = () => {
  const { user, role, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabFromQuery = searchParams.get('tab');
  const [activeTab, setActiveTabState] = useState(tabFromQuery || 'overview');

  useEffect(() => {
    if (tabFromQuery && ['overview', 'reports', 'new-report', 'rubric'].includes(tabFromQuery)) {
      setActiveTabState(tabFromQuery);
    }
  }, [tabFromQuery]);

  const setActiveTab = (tabName) => {
    setActiveTabState(tabName);
    setSearchParams({ tab: tabName });
  };

  const [reports, setReports] = useState(() => loadStoredReports());
  const [selectedReportForModal, setSelectedReportForModal] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveReport = (newReport) => {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === newReport.id);
      let updated;
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = newReport;
      } else {
        updated = [newReport, ...prev];
      }
      saveStoredReports(updated);
      return updated;
    });
    setActiveTab('reports');
  };

  const handleDeleteReport = (id) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    saveStoredReports(updated);
  };

  const handleResetToSample = () => {
    const samples = resetToSampleReports();
    setReports(samples);
  };

  const handleExportAll = () => {
    exportReportsToExcel(reports);
  };

  const currentDate = new Date().toLocaleDateString('ar-YE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full text-slate-900 font-sans" dir="rtl">
      
      {/* Sub-Navigation & Actions Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-3.5 mb-6 no-print">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>المؤشرات البيانية (Recharts)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>سجل التقارير اليومية ({reports.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new-report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'new-report'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة تقرير جديد</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('rubric')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'rubric'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>دليل المعايير والأوزان</span>
            </button>
          </nav>

          {/* Quick Actions Strip */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={handleExportAll}
              disabled={reports.length === 0}
              title="تصدير جميع التقارير إلى ملف Excel بصيغة xlsx"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>تصدير Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('new-report')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تقرير جديد</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW (Recharts Dashboard Charts: اتجاهات مؤشرات الأداء)       */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Welcome Greeting Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    أهلاً بك، {user?.user_metadata?.full_name || user?.email}
                  </h1>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-bold border ${
                      role === 'admin'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {role === 'admin' ? 'صلاحية مدير النظام (Admin)' : 'صلاحية مستخدم معتمد (User)'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  لوحة المؤشرات البيانية لمتابعة اتجاهات كفاءة التشغيل (KPI Trends) وتقييم الكوادر خلال الشهر الحالي
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 pl-2 border-l border-slate-200 hidden sm:inline">
                  {currentDate}
                </span>

                <button
                  onClick={handleExportAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>تصدير Excel</span>
                </button>

                <button
                  onClick={() => setActiveTab('new-report')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إدخال تقرير جديد</span>
                </button>
              </div>
            </div>

            {/* Quick KPI KPI Summary Mini-Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block">
                  متوسط مؤشر الإدارة (الشهر الحالي)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-blue-700 tabular-nums">4.62</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                  ↑ +0.35 مقارنة بالشهر السابق
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block">
                  متوسط تقييم الكادر (الشهر الحالي)
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">4.58</span>
                  <span className="text-xs text-slate-400">/ 5.0</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                  ↑ +0.28 أداء متميز
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block">
                  متوسط جاهزية نظام AFMIS
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-purple-700 tabular-nums">99.72%</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1 block">
                  ضمن النطاق القياسي المعتمد
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 block">
                  إجمالي المهام المنجزة هذا الشهر
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 tabular-nums">287</span>
                  <span className="text-xs text-slate-400">مهمة فنية</span>
                </div>
                <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
                  نسبة الإنجاز 94.2%
                </span>
              </div>
            </div>

            {/* RECHARTS CHART 1: KPI Trends (Daily KPI vs Member KPI) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>اتجاهات مؤشرات الأداء (KPI Trends) على مدار الشهر الحالي</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    مقارنة مسار مؤشر أداء الإدارة اليومي (Daily KPI) ومتوسط أداء الكادر (Member KPI) على مقياس من 1 إلى 5
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    <span className="font-semibold text-slate-700">مؤشر الإدارة (Daily KPI)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-700">مؤشر الكادر (Member KPI)</span>
                  </span>
                </div>
              </div>

              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MONTHLY_KPI_TRENDS}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMember" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[3.5, 5.0]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val, name) => [
                        `${val} من 5`,
                        name === 'dailyKpi' ? 'مؤشر أداء الإدارة' : 'مؤشر أداء الكادر',
                      ]}
                      labelFormatter={(lbl) => `تاريخ: ${lbl}`}
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                        direction: 'rtl',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="dailyKpi"
                      name="dailyKpi"
                      stroke="#2563eb"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorDaily)"
                    />
                    <Area
                      type="monotone"
                      dataKey="memberKpi"
                      name="memberKpi"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorMember)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECHARTS CHART 2 & 3: Double Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 2: Tasks & Requests Resolution BarChart */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      حجم المهام والطلبات المعالجة أسبوعياً
                    </h3>
                    <p className="text-xs text-slate-500">
                      مقارنة التذاكر والطلبات المستلمة والمهام المنجزة
                    </p>
                  </div>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={MONTHLY_KPI_TRENDS}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip
                        formatter={(val, name) => [
                          `${val}`,
                          name === 'tasksCompleted' ? 'المهام المنجزة' : 'الطلبات المستلمة',
                        ]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          direction: 'rtl',
                        }}
                      />
                      <Bar dataKey="tasksCompleted" name="tasksCompleted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="requests" name="requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: System Availability / Uptime Trend */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      نسبة جاهزية واستقرار نظام AFMIS (%)
                    </h3>
                    <p className="text-xs text-slate-500">
                      مؤشر استقرار الخوادم وقواعد البيانات Oracle RAC
                    </p>
                  </div>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={MONTHLY_KPI_TRENDS}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <YAxis domain={[98.5, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                      <Tooltip
                        formatter={(val) => [`${val}%`, 'نسبة الجاهزية']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          direction: 'rtl',
                        }}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="uptime"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#059669' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Bottom Quick Action Banner */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-950">
                    الاطلاع على جدول التقارير المرفوعة وإدارتها
                  </h4>
                  <p className="text-xs text-blue-800">
                    يمكنك تصفح جميع تقارير الوردية، تصديرها إلى مصنف Excel كامل، أو استعراض وطباعة كل تقرير رسمياً.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('reports')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs"
              >
                <span>فتح جدول التقارير الكامل</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: REPORTS TABLE (لوحة التحكم - مراقبة الأداء)                         */}
        {/* ========================================================================= */}
        {activeTab === 'reports' && (
          <DashboardView
            reports={reports}
            onSelectReport={(rep) => setSelectedReportForModal(rep)}
            onDeleteReport={handleDeleteReport}
            onAddNewReport={() => setActiveTab('new-report')}
            onResetToSample={handleResetToSample}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ADD NEW REPORT (إضافة تقرير جديد)                                   */}
        {/* ========================================================================= */}
        {activeTab === 'new-report' && (
          <ReportFormView
            onSaveReport={handleSaveReport}
            onCancel={() => setActiveTab('reports')}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KPI RUBRIC (دليل المعايير والأوزان)                                */}
        {/* ========================================================================= */}
        {activeTab === 'rubric' && (
          <KpiRubricView />
        )}

      </div>

      {/* Official Report Detail & Print Modal */}
      {selectedReportForModal && (
        <ReportDetailModal
          report={selectedReportForModal}
          onClose={() => setSelectedReportForModal(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            الإدارة العامة للتشغيل والصيانة · نظام معلومات الإدارة المالية (AFMIS) - وزارة المالية
          </span>
          <span className="text-slate-400">
            الجمهورية اليمنية · تقرير يومي لمراقبة وتقييم الأداء
          </span>
        </div>
      </footer>

    </div>
  );
};
