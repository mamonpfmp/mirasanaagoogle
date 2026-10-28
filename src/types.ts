/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ShiftType = 'صباحية' | 'مسائية' | 'ليلية';
export type OperationalStatus = 'مستقرة' | 'متأثرة جزئياً' | 'حرجة';
export type MemberOverallRating = 'متميز' | 'جيد جداً' | 'جيد' | 'يحتاج تحسين';
export type ReportReviewStatus = 'قيد المراجعة' | 'معتمد' | 'مرفوض';

export interface DepartmentKpis {
  taskCompletion: number; // 1 to 5 (إنجاز المهام)
  workQuality: number; // 1 to 5 (جودة العمل)
  responseSpeed: number; // 1 to 5 (سرعة الاستجابة)
  attendanceCommitment: number; // 1 to 5 (الالتزام بالحضور)
  teamCollaboration: number; // 1 to 5 (التعاون الجماعي)
  proceduresCompliance: number; // 1 to 5 (الالتزام بالإجراءات)
  safetyAndRisk: number; // 1 to 5 (السلامة وإدارة المخاطر)
}

export interface MemberEvaluation {
  name: string; // الاسم
  employeeId: string; // الرقم الوظيفي
  jobTitle: string; // المسمى الوظيفي
  productivity: number; // 1 to 5 (الإنتاجية)
  quality: number; // 1 to 5 (الجودة)
  punctuality: number; // 1 to 5 (الالتزام بالمواعيد)
  cooperation: number; // 1 to 5 (التعاون)
  initiative: number; // 1 to 5 (المبادرة)
  strengthsAndImprovements?: string; // أبرز نقاط القوة / مجالات التحسين
  overallRating: MemberOverallRating; // التقدير العام للعضو
  followUpAction?: string; // إجراء المتابعة المقترح
}

export interface DailyOperationsReport {
  id: string;
  reportNumber: string;
  // Section 1: بيانات التشغيل اليومي
  reportDate: string; // تاريخ التقرير (Required)
  department: string; // الإدارة أو الوحدة التشغيلية (Required)
  preparedBy: string; // اسم معدّ التقرير (Required)
  shift: ShiftType; // الفترة أو الوردية (صباحية / مسائية / ليلية) (Required)
  
  // الأعضاء
  membersPresent: number; // الحاضرين (Required)
  membersAbsent: number; // الغائبين (Required)
  
  activitiesSummary: string; // ملخص الأعمال والأنشطة (Required)
  
  // عدد المهام
  tasksPlanned: number; // المخطط لها (Required)
  tasksCompleted: number; // المنجزة (Required)
  tasksDelayed: number; // المتأخرة (Required)
  
  // عدد الطلبات
  requestsReceived: number; // المستلمة
  requestsProcessed: number; // المعالجة
  
  operationalStatus: OperationalStatus; // الحالة التشغيلية العامة (مستقرة / متأثرة جزئياً / حرجة) (Required)
  operationalObstacles?: string; // المعوقات أو الحوادث التشغيلية
  actionsTaken?: string; // الإجراءات المتخذة
  nextDayPriorities?: string; // أولويات اليوم التالي
  supportingAttachmentName?: string; // مرفقات داعمة
  supportingAttachmentSize?: string;

  // Section 2: مؤشرات الأداء والتقييم
  departmentKpis: DepartmentKpis;
  kpiNotes?: string; // ملاحظات حول مؤشرات الأداء
  dailyKpiScore: number; // calculation 1: متوسط 7 مؤشرات (1 to 5)

  memberEvaluation: MemberEvaluation;
  memberKpiScore: number; // calculation 2: متوسط 5 مؤشرات (1 to 5)
  
  reviewStatus: ReportReviewStatus; // حالة مراجعة التقرير (قيد المراجعة / معتمد / مرفوض) (Required)
  createdAt: string;
}
