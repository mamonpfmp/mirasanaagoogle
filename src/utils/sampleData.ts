/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DailyOperationsReport } from '../types';

export const INITIAL_SAMPLE_REPORTS: DailyOperationsReport[] = [
  {
    id: 'rep-001',
    reportNumber: 'REP-20261026-01',
    reportDate: '2026-10-26',
    department: 'إدارة تشغيل وتطوير قواعد بيانات AFMIS',
    preparedBy: 'م. رضوان عبدالله الحكيمي',
    shift: 'صباحية',
    membersPresent: 9,
    membersAbsent: 1,
    activitiesSummary: 'متابعة أداء مجموعات خوادم Oracle RAC المركزية، إجراء فحص تزامن الحركات المالية اليومية لسندات الصرف، والتحقق من اكتمال النسخ الاحتياطي التراكمي ونقله لوحدات التخزين SAN.',
    tasksPlanned: 8,
    tasksCompleted: 8,
    tasksDelayed: 0,
    requestsReceived: 18,
    requestsProcessed: 18,
    operationalStatus: 'مستقرة',
    operationalObstacles: 'لا توجد معوقات حرجة؛ تم رصد استهلاك أعلى من المعتاد للذاكرة وتم ضبط مؤشرات SGA بنجاح.',
    actionsTaken: 'إعادة ضبط مساحات الذاكرة المؤقتة، والتحقق من جاهزية العقد البديلة Standby Database.',
    nextDayPriorities: 'متابعة معالجة التسويات المالية الختامية للجهات الحكومية للشهر الجاري وتحديث جداول الفهارس.',
    supportingAttachmentName: 'تقرير_سلامة_قواعد_البيانات_Oracle_26Oct.pdf',
    supportingAttachmentSize: '1.4 ميجابايت',
    departmentKpis: {
      taskCompletion: 5,
      workQuality: 5,
      responseSpeed: 5,
      attendanceCommitment: 4,
      teamCollaboration: 5,
      proceduresCompliance: 5,
      safetyAndRisk: 5,
    },
    kpiNotes: 'أداء تشغيلي متميز والتزام كامل بمعايير سلامة البيانات والجاهزية العالية للأنظمة المالية.',
    dailyKpiScore: 4.86,
    memberEvaluation: {
      name: 'م. نبيل محمد الصلوي',
      employeeId: 'EMP-7412',
      jobTitle: 'كبير مهندسي قواعد البيانات والأنظمة',
      productivity: 5,
      quality: 5,
      punctuality: 5,
      cooperation: 5,
      initiative: 5,
      strengthsAndImprovements: 'كفاءة استثنائية في التحسين الاستباقي لاستعلامات الميزانية وسرعة حل التذاكر الحرجة.',
      overallRating: 'متميز',
      followUpAction: 'تكليفه بالإشراف الفني على مشروع ترقية النسخة القادمة لأنظمة التخزين الاحتياطي.',
    },
    memberKpiScore: 5.0,
    reviewStatus: 'معتمد',
    createdAt: '2026-10-26T14:30:00Z',
  },
  {
    id: 'rep-002',
    reportNumber: 'REP-20261025-02',
    reportDate: '2026-10-25',
    department: 'إدارة الشبكات والاتصالات والبنية التحتية',
    preparedBy: 'م. سليم منصور الأكوع',
    shift: 'صباحية',
    membersPresent: 6,
    membersAbsent: 0,
    activitiesSummary: 'فحص خطوط الربط الشبكي VPN مع البنك المركزي ومصلحتي الجمارك والضرائب، وتأمين تدفق بيانات الفروع المالية بالمحافظات ومراقبة جدران الحماية.',
    tasksPlanned: 6,
    tasksCompleted: 5,
    tasksDelayed: 1,
    requestsReceived: 14,
    requestsProcessed: 12,
    operationalStatus: 'متأثرة جزئياً',
    operationalObstacles: 'تذبذب مؤقت في كابل الألياف الضوئية المغذي لأحد المسارات الخارجية لمكتب المالية بتعز.',
    actionsTaken: 'تم التحويل التلقائي والفوري للمسار الاحتياطي اللاسلكي والتنسيق مع مزود الخدمة حتى استقرار الربط.',
    nextDayPriorities: 'استكمال اختبار مسارات التكرار (Redundancy) لأجهزة التوجيه Core Routers في مركز البيانات.',
    supportingAttachmentName: 'مخطط_حركة_المرور_الشبكية.xlsx',
    supportingAttachmentSize: '820 كيلوبايت',
    departmentKpis: {
      taskCompletion: 4,
      workQuality: 4,
      responseSpeed: 5,
      attendanceCommitment: 5,
      teamCollaboration: 4,
      proceduresCompliance: 4,
      safetyAndRisk: 4,
    },
    kpiNotes: 'سرعة استجابة عالية في تفعيل المسارات الاحتياطية وتفادي توقف الخدمة المالية.',
    dailyKpiScore: 4.29,
    memberEvaluation: {
      name: 'م. عادل أحمد العريقي',
      employeeId: 'EMP-6320',
      jobTitle: 'مهندس شبكات وأمن اتصالات',
      productivity: 4,
      quality: 4,
      punctuality: 5,
      cooperation: 5,
      initiative: 4,
      strengthsAndImprovements: 'سرعة بديهة في التبديل بين المسارات الاحتياطية وإتقان سياسات أمان جدران الحماية.',
      overallRating: 'جيد جداً',
      followUpAction: 'إلحاقه بالبرنامج التدريبي المتقدم لشهادة CCNP Security.',
    },
    memberKpiScore: 4.4,
    reviewStatus: 'معتمد',
    createdAt: '2026-10-25T14:45:00Z',
  },
  {
    id: 'rep-003',
    reportNumber: 'REP-20261024-03',
    reportDate: '2026-10-24',
    department: 'إدارة الدعم الفني وخدمات مستفيدي AFMIS',
    preparedBy: 'أ. وسيم جميل الشميري',
    shift: 'صباحية',
    membersPresent: 11,
    membersAbsent: 1,
    activitiesSummary: 'استقبال بلاغات وتذاكر مستخدمي المنظومة في قطاعات الموازنة والحسابات بالوزارات والهيئات، حل مشكلات تسجيل الدخول وتحديث شهادات التوقيع الرقمي للمفوضين.',
    tasksPlanned: 10,
    tasksCompleted: 9,
    tasksDelayed: 1,
    requestsReceived: 38,
    requestsProcessed: 35,
    operationalStatus: 'مستقرة',
    operationalObstacles: 'تراكم طلبات إعادة تعيين كلمات المرور بعد انتهاء عطلة نهاية الأسبوع من عدة جهات.',
    actionsTaken: 'توزيع المهام على فريق الدعم وتفعيل الخط الساخن المباشر وتقديم المساعدة عن بعد.',
    nextDayPriorities: 'نشر الدليل التوعوي لخدمة الاستعادة الذاتية لحسابات المستخدمين وتقليل زمن الانتظار.',
    supportingAttachmentName: 'كشف_تذاكر_الدعم_الفني_اليومي.pdf',
    supportingAttachmentSize: '2.1 ميجابايت',
    departmentKpis: {
      taskCompletion: 4,
      workQuality: 5,
      responseSpeed: 4,
      attendanceCommitment: 5,
      teamCollaboration: 5,
      proceduresCompliance: 5,
      safetyAndRisk: 4,
    },
    kpiNotes: 'جهد كبير من فريق الدعم في إنجاز 35 طلباً حيوياً في يوم واحد.',
    dailyKpiScore: 4.57,
    memberEvaluation: {
      name: 'أ. مروان قائد القدسي',
      employeeId: 'EMP-8902',
      jobTitle: 'أخصائي أول دعم فني وتطبيقات مالية',
      productivity: 5,
      quality: 4,
      punctuality: 5,
      cooperation: 5,
      initiative: 4,
      strengthsAndImprovements: 'صبر وحسن تعامل مع مستخدمي المنظومة بالوزارات وسرعة إرشادهم لحل المشكلات.',
      overallRating: 'جيد جداً',
      followUpAction: 'تكريمه كأفضل مسؤول دعم فني للشهر الجاري في لقاء الإدارة العامة.',
    },
    memberKpiScore: 4.6,
    reviewStatus: 'معتمد',
    createdAt: '2026-10-24T15:10:00Z',
  },
  {
    id: 'rep-004',
    reportNumber: 'REP-20261023-04',
    reportDate: '2026-10-23',
    department: 'إدارة مركز البيانات والطاقة والتبريد',
    preparedBy: 'م. إيهاب عبدالجبار الزبيري',
    shift: 'ليلية',
    membersPresent: 4,
    membersAbsent: 0,
    activitiesSummary: 'مراقبة درجات حرارة كبائن الخوادم، فحص وحدات التزويد المستمر بالطاقة UPS ومولدات الطوارئ، والتأكد من منظومات مكافحة الحريق والبيئة المناخية.',
    tasksPlanned: 5,
    tasksCompleted: 5,
    tasksDelayed: 0,
    requestsReceived: 2,
    requestsProcessed: 2,
    operationalStatus: 'مستقرة',
    operationalObstacles: 'لا توجد؛ درجات الحرارة داخل القاعات مستقرة تماماً بين 19 و 21 درجة مئوية.',
    actionsTaken: 'إجراء الفحص الروتيني الأسبوعي للبطاريات ومستوى الوقود في المولدات الاحتياطية.',
    nextDayPriorities: 'جدولة الصيانة الوقائية الشهرية لوحدة التبريد المركزية رقم 2 (PAC-02).',
    supportingAttachmentName: 'قراءات_بيئة_مركز_البيانات.pdf',
    supportingAttachmentSize: '950 كيلوبايت',
    departmentKpis: {
      taskCompletion: 5,
      workQuality: 5,
      responseSpeed: 5,
      attendanceCommitment: 5,
      teamCollaboration: 5,
      proceduresCompliance: 5,
      safetyAndRisk: 5,
    },
    kpiNotes: 'استقرار نموذجي في جميع مؤشرات بيئة مركز البيانات ومولدات الطاقة.',
    dailyKpiScore: 5.0,
    memberEvaluation: {
      name: 'م. حمزة فيصل الواسعي',
      employeeId: 'EMP-5510',
      jobTitle: 'مهندس صيانة مرافق ومراكز بيانات',
      productivity: 5,
      quality: 5,
      punctuality: 5,
      cooperation: 5,
      initiative: 5,
      strengthsAndImprovements: 'انضباط كامل ودقة عالية في تدوين قراءات أجهزة القياس الحراري والكهربائي.',
      overallRating: 'متميز',
      followUpAction: 'استمرار المناوبة الدورية وفق الجدول المعتمد.',
    },
    memberKpiScore: 5.0,
    reviewStatus: 'معتمد',
    createdAt: '2026-10-23T23:45:00Z',
  },
];

const STORAGE_KEY = 'afmis_daily_operations_reports_v2';

export function loadStoredReports(): DailyOperationsReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REPORTS));
      return INITIAL_SAMPLE_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_REPORTS;
  } catch (e) {
    console.error('Error loading reports from localStorage', e);
    return INITIAL_SAMPLE_REPORTS;
  }
}

export function saveStoredReports(reports: DailyOperationsReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Error saving reports to localStorage', e);
  }
}

export function resetToSampleReports(): DailyOperationsReport[] {
  saveStoredReports(INITIAL_SAMPLE_REPORTS);
  return INITIAL_SAMPLE_REPORTS;
}
