/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DailyOperationsReport } from '../types';
import {
  getOperationalStatusTheme,
  getReviewStatusTheme,
  getMemberRatingTheme,
  scoreToPercent,
} from '../utils/kpiCalculator';
import { exportSingleReportToExcel } from '../utils/excelExport';
import {
  X,
  Printer,
  FileSpreadsheet,
  Star,
  UserCheck,
  CheckCircle2,
  Building2,
  Calendar,
  Clock,
  Layers,
  Paperclip,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: DailyOperationsReport | null;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
}) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const statusTheme = getOperationalStatusTheme(report.operationalStatus);
  const reviewTheme = getReviewStatusTheme(report.reviewStatus);
  const memberTheme = getMemberRatingTheme(report.memberEvaluation.overallRating);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-blue-600 px-2.5 py-0.5 rounded font-bold">
              {report.reportNumber}
            </span>
            <span className="text-sm font-bold">معاينة التقرير التشغيلي اليومي</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportSingleReportToExcel(report)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 rounded-lg transition-colors"
              title="تصدير هذا التقرير إلى Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              title="طباعة التقرير كوثيقة رسمية أو حفظ كـ PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة رسمية / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors mr-2"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document Content */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900" id="official-print-area">
          
          {/* Header of the Official Government Document */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex items-start justify-between gap-4">
              {/* Right text: Republic & Ministry */}
              <div className="text-right space-y-1">
                <p className="text-xs font-bold text-slate-800">الجمهورية اليمنية</p>
                <p className="text-xs font-bold text-slate-800">وزارة المالية</p>
                <p className="text-sm font-extrabold text-blue-900">
                  الإدارة العامة للتشغيل والصيانة
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  نظام معلومات الإدارة المالية الحكومية (AFMIS)
                </p>
              </div>

              {/* Official Center Emblem / Logo */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center shadow-xs">
                  <img
                    src="/assets/aistudio/Screenshot_________________WhatsApp_4c36ef97.jpg"
                    alt="شعار الإدارة العامة للتشغيل والصيانة AFMIS"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 font-bold">
                  MOF - YEMEN
                </span>
              </div>

              {/* Left text: Report Metadata */}
              <div className="text-left space-y-1 font-mono text-xs">
                <div>
                  <span className="text-slate-500">رقم التقرير: </span>
                  <span className="font-bold text-slate-900">{report.reportNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500">التاريخ: </span>
                  <span className="font-bold text-slate-900 tabular-nums">{report.reportDate}</span>
                </div>
                <div>
                  <span className="text-slate-500">الوردية: </span>
                  <span className="font-bold text-slate-900 font-sans">{report.shift}</span>
                </div>
                <div className="pt-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-sans font-bold border ${reviewTheme.badgeBg}`}>
                    {report.reviewStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-center">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                تقرير التشغيل اليومي وتقييم الأداء
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                {report.department}
              </p>
            </div>
          </div>

          {/* Section 1 Details: بيانات التشغيل اليومي */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-500 pb-1 border-b border-slate-200">
              أولاً: بيانات التشغيل وسير العمل اليومي
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 block">معد التقرير</span>
                <span className="text-xs font-bold text-slate-800">{report.preparedBy}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">الحالة التشغيلية العامة</span>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border mt-0.5 ${statusTheme.badgeBg}`}>
                  {report.operationalStatus}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">حضور الكادر</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">
                  {report.membersPresent} حاضر / {report.membersAbsent} غائب
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">إنجاز المهام</span>
                <span className="text-xs font-bold text-slate-800 tabular-nums">
                  {report.tasksCompleted} من {report.tasksPlanned} (متأخر: {report.tasksDelayed})
                </span>
              </div>
            </div>

            {/* Activities Summary */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-700 block mb-1">
                ملخص الأعمال والأنشطة المنفذة:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {report.activitiesSummary}
              </p>
            </div>

            {/* Obstacles & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  المعوقات والحوادث التشغيلية:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.operationalObstacles || 'لا توجد معوقات حرجة.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  الإجراءات المتخذة:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.actionsTaken || 'تم التنفيذ وفق المعايير والسياسات المعتمدة.'}
                </p>
              </div>
            </div>

            {/* Priorities & Attachments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  أولويات اليوم التالي:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.nextDayPriorities || 'متابعة العمليات اليومية المجدولة.'}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-0.5">
                    المرفقات المساندة:
                  </span>
                  <span className="text-xs text-slate-600">
                    {report.supportingAttachmentName ? (
                      <span className="font-mono text-blue-700">
                        {report.supportingAttachmentName} ({report.supportingAttachmentSize})
                      </span>
                    ) : (
                      'لا توجد مرفقات ملحقة'
                    )}
                  </span>
                </div>
                {report.supportingAttachmentName && (
                  <Paperclip className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Section 2 Details: مؤشرات الأداء والتقييم */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-xs font-bold text-slate-500 pb-1 border-b border-slate-200">
              ثانياً: مؤشرات الأداء والتقييم الدوري
            </h2>

            {/* Department KPIs (7 Items) */}
            <div className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span className="text-xs font-bold text-blue-950">
                    مؤشرات أداء الإدارة (Department KPIs)
                  </span>
                </div>
                <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-md border border-blue-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">Daily KPI Score: </span>
                  <span className="text-base font-extrabold text-blue-700 tabular-nums">
                    {report.dailyKpiScore}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                {[
                  { label: 'إنجاز المهام', val: report.departmentKpis.taskCompletion },
                  { label: 'جودة العمل', val: report.departmentKpis.workQuality },
                  { label: 'سرعة الاستجابة', val: report.departmentKpis.responseSpeed },
                  { label: 'الالتزام بالحضور', val: report.departmentKpis.attendanceCommitment },
                  { label: 'التعاون الجماعي', val: report.departmentKpis.teamCollaboration },
                  { label: 'الالتزام بالإجراءات', val: report.departmentKpis.proceduresCompliance },
                  { label: 'السلامة والمخاطر', val: report.departmentKpis.safetyAndRisk },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block truncate" title={item.label}>
                      {item.label}
                    </span>
                    <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-900 tabular-nums">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {report.kpiNotes && (
                <p className="text-xs text-slate-600 pt-2 border-t border-blue-100">
                  <span className="font-semibold text-slate-700">ملاحظات مؤشرات الأداء: </span>
                  {report.kpiNotes}
                </p>
              )}
            </div>

            {/* Member Evaluation (5 Items) */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    تقييم أداء العضو (Member Evaluation)
                  </span>
                </div>
                <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-md border border-emerald-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">Member KPI Score: </span>
                  <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                    {report.memberKpiScore}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 5.0</span>
                </div>
              </div>

              {/* Member Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">الاسم</span>
                  <span className="font-bold text-slate-800">{report.memberEvaluation.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">الرقم الوظيفي</span>
                  <span className="font-mono font-bold text-slate-800">{report.memberEvaluation.employeeId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">المسمى الوظيفي</span>
                  <span className="font-medium text-slate-800">{report.memberEvaluation.jobTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">التقدير العام</span>
                  <span className={`inline-block font-bold px-2 py-0.5 rounded border text-[11px] ${memberTheme.badgeBg}`}>
                    {report.memberEvaluation.overallRating}
                  </span>
                </div>
              </div>

              {/* The 5 Member KPI items */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {[
                  { label: 'الإنتاجية', val: report.memberEvaluation.productivity },
                  { label: 'الجودة', val: report.memberEvaluation.quality },
                  { label: 'الالتزام بالمواعيد', val: report.memberEvaluation.punctuality },
                  { label: 'التعاون', val: report.memberEvaluation.cooperation },
                  { label: 'المبادرة', val: report.memberEvaluation.initiative },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block truncate" title={item.label}>
                      {item.label}
                    </span>
                    <div className="flex items-center justify-center gap-0.5 mt-1 text-emerald-600">
                      <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-900 tabular-nums">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Strengths & Follow Up */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {report.memberEvaluation.strengthsAndImprovements && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-0.5">نقاط القوة ومجالات التحسين:</span>
                    <p className="text-slate-600">{report.memberEvaluation.strengthsAndImprovements}</p>
                  </div>
                )}
                {report.memberEvaluation.followUpAction && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-0.5">إجراء المتابعة المقترح:</span>
                    <p className="text-slate-600">{report.memberEvaluation.followUpAction}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Official Signatures & Approvals (for print) */}
          <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <p className="font-bold text-slate-800">معد التقرير</p>
              <p className="text-slate-600 mt-1">{report.preparedBy}</p>
              <div className="mt-8 border-b border-dotted border-slate-400 w-32 mx-auto"></div>
              <p className="text-[10px] text-slate-400 mt-1">التوقيع والتاريخ</p>
            </div>

            <div>
              <p className="font-bold text-slate-800">رئيس القسم / مشرف الوردية</p>
              <p className="text-slate-600 mt-1">إدارة التشغيل والصيانة</p>
              <div className="mt-8 border-b border-dotted border-slate-400 w-32 mx-auto"></div>
              <p className="text-[10px] text-slate-400 mt-1">الاعتماد والتوقيع</p>
            </div>

            <div>
              <p className="font-bold text-slate-800">مدير عام التشغيل والصيانة</p>
              <p className="text-slate-600 mt-1">وزارة المالية</p>
              <div className="mt-8 border-b border-dotted border-slate-400 w-32 mx-auto"></div>
              <p className="text-[10px] text-slate-400 mt-1">الختم الرسمي والاعتماد</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
