/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from 'xlsx';
import { DailyOperationsReport } from '../types';

/**
 * Export all reports to Excel using SheetJS (xlsx)
 */
export function exportReportsToExcel(reports: DailyOperationsReport[], fileNamePrefix = 'تقرير_التشغيل_اليومي_AFMIS') {
  if (!reports || reports.length === 0) {
    console.warn('لا توجد تقارير في الجدول لتصديرها.');
    return;
  }

  const wb = XLSX.utils.book_new();

  // 1. Main Sheet: بيانات التقارير ومؤشرات الأداء
  const mainData = reports.map((r, index) => ({
    'م': index + 1,
    'رقم التقرير': r.reportNumber,
    'تاريخ التقرير': r.reportDate,
    'الفترة / الوردية': r.shift,
    'الإدارة / الوحدة التشغيلية': r.department,
    'اسم معد التقرير': r.preparedBy,
    'الحالة التشغيلية العامة': r.operationalStatus,
    'مؤشر أداء الإدارة (Daily KPI)': r.dailyKpiScore,
    'اسم العضو المقيم': r.memberEvaluation.name,
    'الرقم الوظيفي': r.memberEvaluation.employeeId,
    'المسمى الوظيفي': r.memberEvaluation.jobTitle,
    'مؤشر أداء العضو (Member KPI)': r.memberKpiScore,
    'التقدير العام للعضو': r.memberEvaluation.overallRating,
    'حالة مراجعة التقرير': r.reviewStatus,
    'الأعضاء الحاضرين': r.membersPresent,
    'الأعضاء الغائبين': r.membersAbsent,
    'المهام المخطط لها': r.tasksPlanned,
    'المهام المنجزة': r.tasksCompleted,
    'المهام المتأخرة': r.tasksDelayed,
    'نسبة إنجاز المهام': r.tasksPlanned > 0 ? `${Math.round((r.tasksCompleted / r.tasksPlanned) * 100)}%` : '100%',
    'الطلبات المستلمة': r.requestsReceived,
    'الطلبات المعالجة': r.requestsProcessed,
    'ملخص الأعمال والأنشطة': r.activitiesSummary,
    'المعوقات أو الحوادث التشغيلية': r.operationalObstacles || 'لا يوجد',
    'الإجراءات المتخذة': r.actionsTaken || 'تم التعامل وفق الإجراءات القياسية',
    'أولويات اليوم التالي': r.nextDayPriorities || 'متابعة المهام التشغيلية اليومية',
    'أبرز نقاط القوة للعضو': r.memberEvaluation.strengthsAndImprovements || '-',
    'إجراء المتابعة المقترح للعضو': r.memberEvaluation.followUpAction || '-',
    'مرفقات داعمة': r.supportingAttachmentName || 'لا يوجد',
  }));

  const mainWs = XLSX.utils.json_to_sheet(mainData);
  // Column widths
  mainWs['!cols'] = [
    { wch: 6 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 30 },
    { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 14 },
    { wch: 25 }, { wch: 18 }, { wch: 16 }, { wch: 16 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 14 }, { wch: 14 }, { wch: 45 }, { wch: 35 }, { wch: 35 },
    { wch: 35 }, { wch: 30 }, { wch: 30 }, { wch: 25 },
  ];
  XLSX.utils.book_append_sheet(wb, mainWs, 'جدول التقارير اليومية');

  // 2. Department KPIs Breakdown Sheet
  const deptKpiData = reports.map((r) => ({
    'رقم التقرير': r.reportNumber,
    'التاريخ': r.reportDate,
    'الإدارة': r.department,
    'معد التقرير': r.preparedBy,
    'إنجاز المهام (1-5)': r.departmentKpis.taskCompletion,
    'جودة العمل (1-5)': r.departmentKpis.workQuality,
    'سرعة الاستجابة (1-5)': r.departmentKpis.responseSpeed,
    'الالتزام بالحضور (1-5)': r.departmentKpis.attendanceCommitment,
    'التعاون الجماعي (1-5)': r.departmentKpis.teamCollaboration,
    'الالتزام بالإجراءات (1-5)': r.departmentKpis.proceduresCompliance,
    'السلامة وإدارة المخاطر (1-5)': r.departmentKpis.safetyAndRisk,
    'متوسط مؤشر الإدارة (Daily KPI)': r.dailyKpiScore,
    'ملاحظات المؤشرات': r.kpiNotes || '-',
  }));
  const deptWs = XLSX.utils.json_to_sheet(deptKpiData);
  deptWs['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 20 },
    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 },
    { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, deptWs, 'تفاصيل مؤشرات الإدارة (7)');

  // 3. Member KPIs Breakdown Sheet
  const memberKpiData = reports.map((r) => ({
    'رقم التقرير': r.reportNumber,
    'التاريخ': r.reportDate,
    'اسم العضو المقيم': r.memberEvaluation.name,
    'الرقم الوظيفي': r.memberEvaluation.employeeId,
    'المسمى الوظيفي': r.memberEvaluation.jobTitle,
    'الإنتاجية (1-5)': r.memberEvaluation.productivity,
    'الجودة (1-5)': r.memberEvaluation.quality,
    'الالتزام بالمواعيد (1-5)': r.memberEvaluation.punctuality,
    'التعاون (1-5)': r.memberEvaluation.cooperation,
    'المبادرة (1-5)': r.memberEvaluation.initiative,
    'متوسط مؤشر العضو (Member KPI)': r.memberKpiScore,
    'التقدير العام': r.memberEvaluation.overallRating,
    'نقاط القوة والتحسين': r.memberEvaluation.strengthsAndImprovements || '-',
    'إجراء المتابعة': r.memberEvaluation.followUpAction || '-',
  }));
  const memberWs = XLSX.utils.json_to_sheet(memberKpiData);
  memberWs['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 25 },
    { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 },
    { wch: 20 }, { wch: 16 }, { wch: 35 }, { wch: 35 }
  ];
  XLSX.utils.book_append_sheet(wb, memberWs, 'تفاصيل تقييم العضو (5)');

  // 4. Summary & Aggregate KPIs
  const totalReports = reports.length;
  const avgDailyKpi = (reports.reduce((acc, r) => acc + r.dailyKpiScore, 0) / totalReports).toFixed(2);
  const avgMemberKpi = (reports.reduce((acc, r) => acc + r.memberKpiScore, 0) / totalReports).toFixed(2);
  const totalTasksPlanned = reports.reduce((acc, r) => acc + r.tasksPlanned, 0);
  const totalTasksCompleted = reports.reduce((acc, r) => acc + r.tasksCompleted, 0);
  const totalRequestsReceived = reports.reduce((acc, r) => acc + r.requestsReceived, 0);
  const totalRequestsProcessed = reports.reduce((acc, r) => acc + r.requestsProcessed, 0);

  const summaryData = [
    { 'البيان الإحصائي': 'الجمهورية اليمنية - وزارة المالية', 'القيمة': 'نظام معلومات الإدارة المالية الحكومية (AFMIS)' },
    { 'البيان الإحصائي': 'الإدارة العامة للتشغيل والصيانة', 'القيمة': 'تقرير يومي لمراقبة وتقييم الأداء التشغيلي' },
    { 'البيان الإحصائي': 'إجمالي التقارير المسجلة', 'القيمة': totalReports },
    { 'البيان الإحصائي': 'متوسط مؤشر أداء الإدارة اليومي (Daily KPI)', 'القيمة': `${avgDailyKpi} / 5` },
    { 'البيان الإحصائي': 'متوسط مؤشر أداء الكادر/العضو (Member KPI)', 'القيمة': `${avgMemberKpi} / 5` },
    { 'البيان الإحصائي': 'إجمالي المهام المنجزة / المخططة', 'القيمة': `${totalTasksCompleted} / ${totalTasksPlanned}` },
    { 'البيان الإحصائي': 'نسبة الإنجاز الكلية للمهام', 'القيمة': totalTasksPlanned > 0 ? `${Math.round((totalTasksCompleted / totalTasksPlanned) * 100)}%` : '100%' },
    { 'البيان الإحصائي': 'إجمالي الطلبات المعالجة / المستلمة', 'القيمة': `${totalRequestsProcessed} / ${totalRequestsReceived}` },
    { 'البيان الإحصائي': 'تاريخ التصدير', 'القيمة': new Date().toLocaleDateString('ar-YE', { dateStyle: 'full' }) },
  ];
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 35 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'الملخص الإحصائي');

  // Trigger file download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${fileNamePrefix}_${dateStr}.xlsx`);
}

/**
 * Export a single report
 */
export function exportSingleReportToExcel(report: DailyOperationsReport) {
  exportReportsToExcel([report], `تقرير_${report.reportNumber}`);
}
