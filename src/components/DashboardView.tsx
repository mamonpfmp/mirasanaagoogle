/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DailyOperationsReport, ShiftType, OperationalStatus } from '../types';
import {
  getOperationalStatusTheme,
  getReviewStatusTheme,
  getMemberRatingTheme,
  scoreToPercent,
} from '../utils/kpiCalculator';
import { exportReportsToExcel, exportSingleReportToExcel } from '../utils/excelExport';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Trash2,
  Star,
  UserCheck,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface DashboardViewProps {
  reports: DailyOperationsReport[];
  onSelectReport: (report: DailyOperationsReport) => void;
  onDeleteReport: (id: string) => void;
  onAddNewReport: () => void;
  onResetToSample: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onAddNewReport,
  onResetToSample,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Summary Metrics calculations
  const totalReports = reports.length;

  const avgDailyKpi = useMemo(() => {
    if (totalReports === 0) return 0;
    const sum = reports.reduce((acc, r) => acc + r.dailyKpiScore, 0);
    return Number((sum / totalReports).toFixed(2));
  }, [reports, totalReports]);

  const avgMemberKpi = useMemo(() => {
    if (totalReports === 0) return 0;
    const sum = reports.reduce((acc, r) => acc + r.memberKpiScore, 0);
    return Number((sum / totalReports).toFixed(2));
  }, [reports, totalReports]);

  // Operational status breakdown
  const statusCounts = useMemo(() => {
    return {
      stable: reports.filter((r) => r.operationalStatus === 'مستقرة').length,
      affected: reports.filter((r) => r.operationalStatus === 'متأثرة جزئياً').length,
      critical: reports.filter((r) => r.operationalStatus === 'حرجة').length,
    };
  }, [reports]);

  // Tasks and requests totals
  const totalTasksPlanned = useMemo(
    () => reports.reduce((acc, r) => acc + r.tasksPlanned, 0),
    [reports]
  );
  const totalTasksCompleted = useMemo(
    () => reports.reduce((acc, r) => acc + r.tasksCompleted, 0),
    [reports]
  );
  const taskCompletionRate = useMemo(() => {
    if (totalTasksPlanned === 0) return 100;
    return Math.round((totalTasksCompleted / totalTasksPlanned) * 100);
  }, [totalTasksPlanned, totalTasksCompleted]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchDept = r.department.toLowerCase().includes(term);
        const matchPrep = r.preparedBy.toLowerCase().includes(term);
        const matchMem = r.memberEvaluation.name.toLowerCase().includes(term);
        const matchNum = r.reportNumber.toLowerCase().includes(term);
        const matchSummary = r.activitiesSummary.toLowerCase().includes(term);
        if (!matchDept && !matchPrep && !matchMem && !matchNum && !matchSummary) {
          return false;
        }
      }

      // Shift filter
      if (selectedShift !== 'all' && r.shift !== selectedShift) {
        return false;
      }

      // Operational status filter
      if (selectedStatus !== 'all' && r.operationalStatus !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [reports, searchTerm, selectedShift, selectedStatus]);

  const handleExportFiltered = () => {
    exportReportsToExcel(filteredReports);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome with Export & Add Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            لوحة التحكم ومراقبة الأداء التشغيلي
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة فورية للتقارير اليومية، مؤشرات كفاءة الإدارات، وتقييم أداء الكوادر بنظام AFMIS
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetToSample}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="إعادة تحميل البيانات النموذجية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بيانات نموذجية</span>
          </button>

          <button
            onClick={handleExportFiltered}
            disabled={filteredReports.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-xs disabled:opacity-50"
            title="تصدير بيانات الجدول المعروضة إلى ملف Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>تصدير إلى Excel</span>
          </button>

          <button
            onClick={onAddNewReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة تقرير جديد</span>
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS (Exact User Requirements: Total Reports, Average Daily KPI Score, Average Member KPI Score) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي التقارير المسجلة</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {totalReports}
            </span>
            <span className="text-xs text-slate-400 font-medium">تقريراً معتمداً</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>الحالة: {statusCounts.stable} مستقر</span>
            <span>{statusCounts.affected} متأثر</span>
          </div>
        </div>

        {/* Card 2: Average Daily KPI Score (متوسط مؤشر أداء الإدارة) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">متوسط مؤشر أداء الإدارة (Daily KPI)</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-700 tabular-nums">
              {avgDailyKpi}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mr-auto tabular-nums">
              {scoreToPercent(avgDailyKpi)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>متوسط المؤشرات التشغيلية السبعة</span>
          </div>
        </div>

        {/* Card 3: Average Member KPI Score (متوسط مؤشر أداء العضو) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">متوسط مؤشر أداء الكادر (Member KPI)</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700 tabular-nums">
              {avgMemberKpi}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mr-auto tabular-nums">
              {scoreToPercent(avgMemberKpi)}%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>متوسط تقييم المعايير الفردية الخمسة</span>
          </div>
        </div>

        {/* Card 4: Operational Tasks Completion */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">نسبة إنجاز المهام التشغيلية</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-700 tabular-nums">
              {taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              ({totalTasksCompleted} من {totalTasksPlanned})
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>جاهزية الأنظمة والخدمات</span>
            <span className="font-semibold text-emerald-600">عالية</span>
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم التقرير، اسم الإدارة، معد التقرير، أو الموظف..."
            className="w-full text-xs md:text-sm pr-9 pl-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Shift Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">الوردية:</span>
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium"
            >
              <option value="all">جميع الورديات</option>
              <option value="صباحية">صباحية</option>
              <option value="مسائية">مسائية</option>
              <option value="ليلية">ليلية</option>
            </select>
          </div>

          {/* Operational Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">الحالة:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-medium"
            >
              <option value="all">جميع الحالات</option>
              <option value="مستقرة">مستقرة</option>
              <option value="متأثرة جزئياً">متأثرة جزئياً</option>
              <option value="حرجة">حرجة</option>
            </select>
          </div>

          {(searchTerm || selectedShift !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedShift('all');
                setSelectedStatus('all');
              }}
              className="text-xs text-rose-600 hover:underline px-2"
            >
              إلغاء التصفية
            </button>
          )}
        </div>

      </div>

      {/* DATA TABLE: Listing all submitted reports */}
      {/* Required Columns: Date, Shift, Operational Status, Daily KPI, Member KPI + actions */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">سجل تقارير التشغيل اليومية</h2>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredReports.length} من {totalReports})
            </span>
          </div>

          <button
            onClick={handleExportFiltered}
            disabled={filteredReports.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>تصدير إلى Excel</span>
          </button>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">لا توجد تقارير مطابقة</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              لم يتم العثور على أي تقرير يطابق معايير البحث أو التصفية الحالية.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={onAddNewReport}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                إضافة أول تقرير الآن
              </button>
              <button
                onClick={onResetToSample}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                استعادة النماذج
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">تاريخ التقرير (Date)</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">الوردية (Shift)</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">الإدارة / الوحدة</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">الحالة التشغيلية</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">مؤشر الإدارة (Daily KPI)</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">مؤشر العضو (Member KPI)</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">العضو المُقيّم</th>
                  <th scope="col" className="py-3 px-4 whitespace-nowrap">الاعتماد</th>
                  <th scope="col" className="py-3 px-4 text-center whitespace-nowrap">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredReports.map((report) => {
                  const statusTheme = getOperationalStatusTheme(report.operationalStatus);
                  const reviewTheme = getReviewStatusTheme(report.reviewStatus);
                  const memberTheme = getMemberRatingTheme(report.memberEvaluation.overallRating);

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 tabular-nums">
                          {report.reportDate}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {report.reportNumber}
                        </span>
                      </td>

                      {/* Shift */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800">
                          {report.shift}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {report.membersPresent} حاضر / {report.membersAbsent} غائب
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate" title={report.department}>
                          {report.department}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          معد التقرير: {report.preparedBy}
                        </div>
                      </td>

                      {/* Operational Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${statusTheme.badgeBg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusTheme.dotColor}`} />
                          <span>{report.operationalStatus}</span>
                        </span>
                      </td>

                      {/* Daily KPI Score (1-5) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                          <span className="text-sm font-extrabold text-blue-700 tabular-nums">
                            {report.dailyKpiScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 5</span>
                        </div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          {scoreToPercent(report.dailyKpiScore)}% كفاءة
                        </div>
                      </td>

                      {/* Member KPI Score (1-5) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                            {report.memberKpiScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/ 5</span>
                        </div>
                        <div className="text-[10px] text-slate-500 tabular-nums">
                          {scoreToPercent(report.memberKpiScore)}% تقييم
                        </div>
                      </td>

                      {/* Evaluated Member */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {report.memberEvaluation.name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${memberTheme.badgeBg}`}>
                            {report.memberEvaluation.overallRating}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {report.memberEvaluation.employeeId}
                          </span>
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${reviewTheme.badgeBg}`}>
                          {report.reviewStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onSelectReport(report)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="معاينة التقرير والطباعة الرسمية"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => exportSingleReportToExcel(report)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="تصدير هذا التقرير إلى Excel"
                          >
                            <FileSpreadsheet className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف التقرير رقم ${report.reportNumber}؟`)) {
                                onDeleteReport(report.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="حذف التقرير"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer info strip */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>نظام AFMIS · الإدارة العامة للتشغيل والصيانة</span>
            <span>·</span>
            <span>وزارة المالية - الجمهورية اليمنية</span>
          </div>

          <button
            onClick={handleExportFiltered}
            disabled={filteredReports.length === 0}
            className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>تنزيل كافة السجلات المصفاة (Excel)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
