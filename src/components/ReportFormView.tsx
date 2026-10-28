/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useId, useMemo } from 'react';
import {
  DailyOperationsReport,
  DepartmentKpis,
  MemberEvaluation,
  ShiftType,
  OperationalStatus,
  MemberOverallRating,
  ReportReviewStatus,
} from '../types';
import {
  calculateDailyKpiScore,
  calculateMemberKpiScore,
  scoreToPercent,
  getOperationalStatusTheme,
} from '../utils/kpiCalculator';
import {
  Save,
  RotateCcw,
  Sparkles,
  Star,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  Send,
  Check,
} from 'lucide-react';

interface ReportFormViewProps {
  onSaveReport: (report: DailyOperationsReport) => void;
  onCancel: () => void;
  existingReport?: DailyOperationsReport | null;
}

// Interactive Star Rating Component for 1-5
const RatingStars: React.FC<{
  value: number;
  onChange: (val: number) => void;
  label: string;
  name: string;
}> = ({ value, onChange, label, name }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const getLabelDescription = (val: number) => {
    switch (val) {
      case 5:
        return 'متميز (5/5)';
      case 4:
        return 'جيد جداً (4/5)';
      case 3:
        return 'جيد (3/5)';
      case 2:
        return 'مقبول (2/5)';
      case 1:
      default:
        return 'ضعيف (1/5)';
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-xs font-bold text-slate-800">
          {label} <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 tabular-nums">
          {getLabelDescription(hovered ?? value)}
        </span>
      </div>

      <div className="flex items-center gap-1.5 justify-between">
        <div className="flex items-center gap-1" role="radiogroup" aria-label={label}>
          {[1, 2, 3, 4, 5].map((starVal) => {
            const isFilled = starVal <= (hovered ?? value);
            return (
              <button
                key={starVal}
                type="button"
                onClick={() => onChange(starVal)}
                onMouseEnter={() => setHovered(starVal)}
                onMouseLeave={() => setHovered(null)}
                className="p-1 hover:scale-115 transition-transform focus:outline-hidden"
                aria-label={`${label} - ${starVal} من 5`}
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                      : 'text-slate-300 hover:text-amber-300'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Quick radio pills for accessibility */}
        <div className="hidden sm:flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-6 h-6 text-[11px] font-bold rounded flex items-center justify-center transition-colors tabular-nums ${
                value === num
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ReportFormView: React.FC<ReportFormViewProps> = ({
  onSaveReport,
  onCancel,
  existingReport,
}) => {
  // IDs for accessibility
  const reportDateId = useId();
  const departmentId = useId();
  const preparedById = useId();
  const shiftId = useId();
  const membersPresentId = useId();
  const membersAbsentId = useId();
  const activitiesSummaryId = useId();
  const tasksPlannedId = useId();
  const tasksCompletedId = useId();
  const tasksDelayedId = useId();
  const requestsReceivedId = useId();
  const requestsProcessedId = useId();
  const operationalStatusId = useId();
  const operationalObstaclesId = useId();
  const actionsTakenId = useId();
  const nextDayPrioritiesId = useId();
  const fileUploadId = useId();
  const kpiNotesId = useId();

  // Member Evaluation IDs
  const memberNameId = useId();
  const memberEmpId = useId();
  const memberJobTitleId = useId();
  const memberStrengthsId = useId();
  const memberOverallRatingId = useId();
  const memberFollowUpId = useId();
  const reviewStatusId = useId();

  // SECTION 1: بيانات التشغيل اليومي
  const [reportDate, setReportDate] = useState<string>(
    existingReport?.reportDate || new Date().toISOString().slice(0, 10)
  );
  const [department, setDepartment] = useState<string>(
    existingReport?.department || 'إدارة تشغيل وتطوير قواعد بيانات AFMIS'
  );
  const [preparedBy, setPreparedBy] = useState<string>(
    existingReport?.preparedBy || 'م. رضوان عبدالله الحكيمي'
  );
  const [shift, setShift] = useState<ShiftType>(
    existingReport?.shift || 'صباحية'
  );

  const [membersPresent, setMembersPresent] = useState<number>(
    existingReport?.membersPresent ?? 8
  );
  const [membersAbsent, setMembersAbsent] = useState<number>(
    existingReport?.membersAbsent ?? 0
  );

  const [activitiesSummary, setActivitiesSummary] = useState<string>(
    existingReport?.activitiesSummary ||
      'متابعة ومراقبة خوادم وقواعد بيانات نظام AFMIS وسندات الصرف، والتأكد من مطابقة سجلات النسخ الاحتياطي التراكمي.'
  );

  const [tasksPlanned, setTasksPlanned] = useState<number>(
    existingReport?.tasksPlanned ?? 8
  );
  const [tasksCompleted, setTasksCompleted] = useState<number>(
    existingReport?.tasksCompleted ?? 8
  );
  const [tasksDelayed, setTasksDelayed] = useState<number>(
    existingReport?.tasksDelayed ?? 0
  );

  const [requestsReceived, setRequestsReceived] = useState<number>(
    existingReport?.requestsReceived ?? 15
  );
  const [requestsProcessed, setRequestsProcessed] = useState<number>(
    existingReport?.requestsProcessed ?? 15
  );

  const [operationalStatus, setOperationalStatus] = useState<OperationalStatus>(
    existingReport?.operationalStatus || 'مستقرة'
  );

  const [operationalObstacles, setOperationalObstacles] = useState<string>(
    existingReport?.operationalObstacles ||
      'استقرار تشغيلي تام دون أي انقطاعات أو معوقات حرجة.'
  );

  const [actionsTaken, setActionsTaken] = useState<string>(
    existingReport?.actionsTaken ||
      'إجراء الفحص الدوري لمساحات الجداول والمراقبة المستمرة لمؤشرات استهلاك الذاكرة.'
  );

  const [nextDayPriorities, setNextDayPriorities] = useState<string>(
    existingReport?.nextDayPriorities ||
      'استكمال فحص جداول القيود المحاسبية ومتابعة تذاكر الدعم الفني للفروع.'
  );

  const [attachmentName, setAttachmentName] = useState<string>(
    existingReport?.supportingAttachmentName || ''
  );
  const [attachmentSize, setAttachmentSize] = useState<string>(
    existingReport?.supportingAttachmentSize || ''
  );

  // SECTION 2: إدارة مؤشرات الأداء (Department KPIs - 7 Items)
  const [deptKpis, setDeptKpis] = useState<DepartmentKpis>(
    existingReport?.departmentKpis || {
      taskCompletion: 5,
      workQuality: 5,
      responseSpeed: 5,
      attendanceCommitment: 5,
      teamCollaboration: 5,
      proceduresCompliance: 5,
      safetyAndRisk: 5,
    }
  );
  const [kpiNotes, setKpiNotes] = useState<string>(
    existingReport?.kpiNotes || 'التزام عالٍ بكافة معايير التشغيل والجاهزية الفنية للأنظمة المالية.'
  );

  // SECTION 2: تقييم العضو (Member Evaluation - 5 Items)
  const [memberName, setMemberName] = useState<string>(
    existingReport?.memberEvaluation.name || 'م. نبيل محمد الصلوي'
  );
  const [memberEmployeeId, setMemberEmployeeId] = useState<string>(
    existingReport?.memberEvaluation.employeeId || 'EMP-7412'
  );
  const [memberJobTitle, setMemberJobTitle] = useState<string>(
    existingReport?.memberEvaluation.jobTitle || 'كبير مهندسي قواعد البيانات والأنظمة'
  );

  const [memberKpis, setMemberKpis] = useState({
    productivity: existingReport?.memberEvaluation.productivity ?? 5,
    quality: existingReport?.memberEvaluation.quality ?? 5,
    punctuality: existingReport?.memberEvaluation.punctuality ?? 5,
    cooperation: existingReport?.memberEvaluation.cooperation ?? 5,
    initiative: existingReport?.memberEvaluation.initiative ?? 5,
  });

  const [memberStrengths, setMemberStrengths] = useState<string>(
    existingReport?.memberEvaluation.strengthsAndImprovements ||
      'سرعة استجابة عالية ودقة في التحليل الفني وحل المشكلات الاستباقي.'
  );
  const [memberOverallRating, setMemberOverallRating] = useState<MemberOverallRating>(
    existingReport?.memberEvaluation.overallRating || 'متميز'
  );
  const [memberFollowUp, setMemberFollowUp] = useState<string>(
    existingReport?.memberEvaluation.followUpAction ||
      'ترشيحه للإشراف على توسعة مصفوفات التخزين المركزية.'
  );
  const [reviewStatus, setReviewStatus] = useState<ReportReviewStatus>(
    existingReport?.reviewStatus || 'معتمد'
  );

  // Validation & Success Toast State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [validationErrorsList, setValidationErrorsList] = useState<
    { key: string; label: string; elementId: string; message: string }[]
  >([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [lastSavedReportNumber, setLastSavedReportNumber] = useState<string>('');

  const clearFieldError = (key: string) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setValidationErrorsList((prev) => prev.filter((item) => item.key !== key));
      if (validationErrorsList.length <= 1) {
        setValidationError(null);
      }
    }
  };

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  // CALCULATION 1: Live daily_kpi_score
  const dailyKpiScore = useMemo(() => {
    return calculateDailyKpiScore(deptKpis);
  }, [deptKpis]);

  // CALCULATION 2: Live member_kpi_score
  const memberKpiScore = useMemo(() => {
    return calculateMemberKpiScore(memberKpis);
  }, [memberKpis]);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      const sizeKB = Math.round(file.size / 1024);
      if (sizeKB > 1024) {
        setAttachmentSize(`${(sizeKB / 1024).toFixed(1)} ميجابايت`);
      } else {
        setAttachmentSize(`${sizeKB} كيلوبايت`);
      }
    }
  };

  // Comprehensive validation function before publishing
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const list: { key: string; label: string; elementId: string; message: string }[] = [];

    // 1. تاريخ التقرير
    if (!reportDate) {
      errors.reportDate = 'يرجى تحديد تاريخ التقرير';
      list.push({ key: 'reportDate', label: 'تاريخ التقرير', elementId: reportDateId, message: errors.reportDate });
    }

    // 2. الإدارة أو الوحدة التشغيلية
    if (!department || !department.trim()) {
      errors.department = 'يرجى إدخال اسم الإدارة أو الوحدة التشغيلية';
      list.push({ key: 'department', label: 'الإدارة التشغيلية', elementId: departmentId, message: errors.department });
    }

    // 3. اسم معدّ التقرير
    if (!preparedBy || !preparedBy.trim()) {
      errors.preparedBy = 'يرجى إدخال اسم المسؤول أو مهندس الوردية المُعد للتقرير';
      list.push({ key: 'preparedBy', label: 'اسم معدّ التقرير', elementId: preparedById, message: errors.preparedBy });
    }

    // 4. الفترة أو الوردية
    if (!shift) {
      errors.shift = 'يرجى اختيار الوردية التشغيلية';
      list.push({ key: 'shift', label: 'الوردية التشغيلية', elementId: shiftId, message: errors.shift });
    }

    // 5. الأعضاء الحاضرين
    if (membersPresent === undefined || isNaN(Number(membersPresent)) || Number(membersPresent) < 0) {
      errors.membersPresent = 'يجب إدخال عدد صحيح للأعضاء الحاضرين (0 أو أكثر)';
      list.push({ key: 'membersPresent', label: 'الأعضاء الحاضرين', elementId: membersPresentId, message: errors.membersPresent });
    }

    // 6. الأعضاء الغائبين
    if (membersAbsent === undefined || isNaN(Number(membersAbsent)) || Number(membersAbsent) < 0) {
      errors.membersAbsent = 'يجب إدخال عدد صحيح للأعضاء الغائبين (0 أو أكثر)';
      list.push({ key: 'membersAbsent', label: 'الأعضاء الغائبين', elementId: membersAbsentId, message: errors.membersAbsent });
    }

    // 7. الحالة التشغيلية
    if (!operationalStatus) {
      errors.operationalStatus = 'يرجى تحديد الحالة التشغيلية العامة للمنظومة';
      list.push({ key: 'operationalStatus', label: 'الحالة التشغيلية', elementId: operationalStatusId, message: errors.operationalStatus });
    }

    // 8. المهام المخططة
    if (tasksPlanned === undefined || isNaN(Number(tasksPlanned)) || Number(tasksPlanned) < 0) {
      errors.tasksPlanned = 'يجب إدخال عدد المهام المخطط لها';
      list.push({ key: 'tasksPlanned', label: 'المهام المخطط لها', elementId: tasksPlannedId, message: errors.tasksPlanned });
    }

    // 9. المهام المنجزة
    if (tasksCompleted === undefined || isNaN(Number(tasksCompleted)) || Number(tasksCompleted) < 0) {
      errors.tasksCompleted = 'يجب إدخال عدد المهام المنجزة';
      list.push({ key: 'tasksCompleted', label: 'المهام المنجزة', elementId: tasksCompletedId, message: errors.tasksCompleted });
    }

    // 10. ملخص الأعمال والأنشطة
    if (!activitiesSummary || !activitiesSummary.trim()) {
      errors.activitiesSummary = 'ملخص الأعمال والأنشطة إلزامي، يرجى كتابة وصف تفصيلي لما تم خلال الوردية';
      list.push({ key: 'activitiesSummary', label: 'ملخص الأعمال والأنشطة', elementId: activitiesSummaryId, message: errors.activitiesSummary });
    } else if (activitiesSummary.trim().length < 8) {
      errors.activitiesSummary = 'يرجى كتابة ملخص كافٍ للأعمال المنجزة (8 أحرف على الأقل)';
      list.push({ key: 'activitiesSummary', label: 'ملخص الأعمال والأنشطة', elementId: activitiesSummaryId, message: errors.activitiesSummary });
    }

    // 11. بيانات العضو المُقيّم: الاسم
    if (!memberName || !memberName.trim()) {
      errors.memberName = 'يرجى إدخال الاسم الكامل للعضو أو المهندس المُقيَّم';
      list.push({ key: 'memberName', label: 'اسم العضو المُقيَّم', elementId: memberNameId, message: errors.memberName });
    }

    // 12. بيانات العضو المُقيّم: الرقم الوظيفي
    if (!memberEmployeeId || !memberEmployeeId.trim()) {
      errors.memberEmployeeId = 'يرجى إدخال الرقم الوظيفي للعضو (مثل EMP-1234)';
      list.push({ key: 'memberEmployeeId', label: 'الرقم الوظيفي للعضو', elementId: memberEmpId, message: errors.memberEmployeeId });
    }

    // 13. بيانات العضو المُقيّم: المسمى الوظيفي
    if (!memberJobTitle || !memberJobTitle.trim()) {
      errors.memberJobTitle = 'يرجى إدخال المسمى الوظيفي للعضو';
      list.push({ key: 'memberJobTitle', label: 'المسمى الوظيفي للعضو', elementId: memberJobTitleId, message: errors.memberJobTitle });
    }

    // 14. التقدير العام للعضو
    if (!memberOverallRating) {
      errors.memberOverallRating = 'يرجى تحديد التقدير العام للعضو';
      list.push({ key: 'memberOverallRating', label: 'التقدير العام للعضو', elementId: memberOverallRatingId, message: errors.memberOverallRating });
    }

    // 15. حالة مراجعة التقرير
    if (!reviewStatus) {
      errors.reviewStatus = 'يرجى تحديد حالة مراجعة التقرير';
      list.push({ key: 'reviewStatus', label: 'حالة مراجعة التقرير', elementId: reviewStatusId, message: errors.reviewStatus });
    }

    setFieldErrors(errors);
    setValidationErrorsList(list);

    if (list.length > 0) {
      setValidationError(`تعذر نشر التقرير: هناك (${list.length}) حقول مطلوبة غير مكتملة. يرجى استكمالها أدناه قبل إرسال البيانات.`);
      // Focus and smoothly scroll to the first invalid field
      setTimeout(() => {
        scrollToElement(list[0].elementId);
      }, 60);
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Form submit handler for Publishing (with complete validation)
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const isValid = validateForm();
    if (!isValid) return;

    const reportNumber =
      existingReport?.reportNumber ||
      `REP-${reportDate.replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;

    const newReport: DailyOperationsReport = {
      id: existingReport?.id || `rep-${Date.now()}`,
      reportNumber,
      reportDate,
      department: department.trim(),
      preparedBy: preparedBy.trim(),
      shift,
      membersPresent: Number(membersPresent) || 0,
      membersAbsent: Number(membersAbsent) || 0,
      activitiesSummary: activitiesSummary.trim(),
      tasksPlanned: Number(tasksPlanned) || 0,
      tasksCompleted: Number(tasksCompleted) || 0,
      tasksDelayed: Number(tasksDelayed) || 0,
      requestsReceived: Number(requestsReceived) || 0,
      requestsProcessed: Number(requestsProcessed) || 0,
      operationalStatus,
      operationalObstacles: operationalObstacles.trim(),
      actionsTaken: actionsTaken.trim(),
      nextDayPriorities: nextDayPriorities.trim(),
      supportingAttachmentName: attachmentName || undefined,
      supportingAttachmentSize: attachmentSize || undefined,

      departmentKpis: { ...deptKpis },
      kpiNotes: kpiNotes.trim(),
      dailyKpiScore,

      memberEvaluation: {
        name: memberName.trim(),
        employeeId: memberEmployeeId.trim(),
        jobTitle: memberJobTitle.trim(),
        productivity: memberKpis.productivity,
        quality: memberKpis.quality,
        punctuality: memberKpis.punctuality,
        cooperation: memberKpis.cooperation,
        initiative: memberKpis.initiative,
        strengthsAndImprovements: memberStrengths.trim(),
        overallRating: memberOverallRating,
        followUpAction: memberFollowUp.trim(),
      },
      memberKpiScore,
      reviewStatus,
      createdAt: existingReport?.createdAt || new Date().toISOString(),
    };

    onSaveReport(newReport);
    setLastSavedReportNumber(reportNumber);
    setIsSuccess(true);
    setFieldErrors({});
    setValidationErrorsList([]);
  };

  // Save as Draft handler (allows saving incomplete reports temporarily)
  const handleSaveDraft = () => {
    if (!reportDate) {
      setFieldErrors({ reportDate: 'يرجى تحديد تاريخ التقرير على الأقل لحفظ المسودة' });
      setValidationErrorsList([{ key: 'reportDate', label: 'تاريخ التقرير', elementId: reportDateId, message: 'تاريخ التقرير مطلوب' }]);
      setValidationError('يرجى تحديد تاريخ التقرير لحفظ المسودة.');
      scrollToElement(reportDateId);
      return;
    }

    const reportNumber =
      existingReport?.reportNumber ||
      `DRAFT-${reportDate.replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;

    const draftReport: DailyOperationsReport = {
      id: existingReport?.id || `draft-${Date.now()}`,
      reportNumber,
      reportDate,
      department: department.trim() || 'إدارة التشغيل (مسودة)',
      preparedBy: preparedBy.trim() || 'معد المسودة',
      shift,
      membersPresent: Number(membersPresent) || 0,
      membersAbsent: Number(membersAbsent) || 0,
      activitiesSummary: activitiesSummary.trim() || 'مسودة عمل قيد الاستكمال...',
      tasksPlanned: Number(tasksPlanned) || 0,
      tasksCompleted: Number(tasksCompleted) || 0,
      tasksDelayed: Number(tasksDelayed) || 0,
      requestsReceived: Number(requestsReceived) || 0,
      requestsProcessed: Number(requestsProcessed) || 0,
      operationalStatus,
      operationalObstacles: operationalObstacles.trim(),
      actionsTaken: actionsTaken.trim(),
      nextDayPriorities: nextDayPriorities.trim(),
      supportingAttachmentName: attachmentName || undefined,
      supportingAttachmentSize: attachmentSize || undefined,
      departmentKpis: { ...deptKpis },
      kpiNotes: kpiNotes.trim(),
      dailyKpiScore,
      memberEvaluation: {
        name: memberName.trim() || 'عضو تحت التقييم',
        employeeId: memberEmployeeId.trim() || 'EMP-0000',
        jobTitle: memberJobTitle.trim() || 'أخصائي تشغيل',
        productivity: memberKpis.productivity,
        quality: memberKpis.quality,
        punctuality: memberKpis.punctuality,
        cooperation: memberKpis.cooperation,
        initiative: memberKpis.initiative,
        strengthsAndImprovements: memberStrengths.trim(),
        overallRating: memberOverallRating,
        followUpAction: memberFollowUp.trim(),
      },
      memberKpiScore,
      reviewStatus: 'قيد المراجعة',
      createdAt: existingReport?.createdAt || new Date().toISOString(),
    };

    onSaveReport(draftReport);
    setLastSavedReportNumber(reportNumber);
    setIsSuccess(true);
    setFieldErrors({});
    setValidationErrorsList([]);
  };

  // Helper to clear form
  const handleClearForm = () => {
    setReportDate(new Date().toISOString().slice(0, 10));
    setDepartment('إدارة تشغيل قواعد بيانات AFMIS');
    setPreparedBy('');
    setShift('صباحية');
    setMembersPresent(1);
    setMembersAbsent(0);
    setActivitiesSummary('');
    setTasksPlanned(0);
    setTasksCompleted(0);
    setTasksDelayed(0);
    setRequestsReceived(0);
    setRequestsProcessed(0);
    setOperationalStatus('مستقرة');
    setOperationalObstacles('');
    setActionsTaken('');
    setNextDayPriorities('');
    setAttachmentName('');
    setAttachmentSize('');
    setDeptKpis({
      taskCompletion: 3,
      workQuality: 3,
      responseSpeed: 3,
      attendanceCommitment: 3,
      teamCollaboration: 3,
      proceduresCompliance: 3,
      safetyAndRisk: 3,
    });
    setKpiNotes('');
    setMemberName('');
    setMemberEmployeeId('');
    setMemberJobTitle('');
    setMemberKpis({
      productivity: 3,
      quality: 3,
      punctuality: 3,
      cooperation: 3,
      initiative: 3,
    });
    setMemberStrengths('');
    setMemberOverallRating('جيد جداً');
    setMemberFollowUp('');
    setReviewStatus('قيد المراجعة');
    setValidationError(null);
  };

  // Quick template filler
  const handleFillTemplate = () => {
    setDepartment('إدارة تشغيل وتطوير قواعد بيانات AFMIS');
    setPreparedBy('م. رضوان عبدالله الحكيمي');
    setShift('صباحية');
    setMembersPresent(8);
    setMembersAbsent(0);
    setActivitiesSummary('فحص ومراقبة استقرار خوادم Oracle RAC، مراجعة سندات الصرف المحاسبية بنظام AFMIS، والتأكد من نجاح النسخ الاحتياطي.');
    setTasksPlanned(9);
    setTasksCompleted(9);
    setTasksDelayed(0);
    setRequestsReceived(22);
    setRequestsProcessed(22);
    setOperationalStatus('مستقرة');
    setOperationalObstacles('لا توجد معوقات، تم التعامل مع زيادة الاستعلامات عبر تحسين خطط التنفيذ بنجاح.');
    setActionsTaken('ضبط مؤشرات ذاكرة الـ SGA والتحقق الدوري من مسارات التكرار Redundancy.');
    setNextDayPriorities('متابعة تجهيز التقارير المالية الدورية للوزارات.');
    setDeptKpis({
      taskCompletion: 5,
      workQuality: 5,
      responseSpeed: 5,
      attendanceCommitment: 5,
      teamCollaboration: 5,
      proceduresCompliance: 5,
      safetyAndRisk: 5,
    });
    setKpiNotes('أداء نموذجي متكامل وجاهزية تامة على مدار الوردية.');
    setMemberName('م. نبيل محمد الصلوي');
    setMemberEmployeeId('EMP-7412');
    setMemberJobTitle('كبير مهندسي قواعد البيانات والأنظمة');
    setMemberKpis({
      productivity: 5,
      quality: 5,
      punctuality: 5,
      cooperation: 5,
      initiative: 5,
    });
    setMemberStrengths('خبرة ممتازة، التزام عالي وسرعة فائقة في معالجة الاستعلامات المعقدة.');
    setMemberOverallRating('متميز');
    setMemberFollowUp('ترشيحه لمكافأة التميز الشهري.');
    setReviewStatus('معتمد');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      {/* Top Floating Live Score Bar */}
      <div className="sticky top-20 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Daily KPI score display */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
              <Star className="w-5 h-5 fill-blue-600 text-blue-600" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                مؤشر أداء الإدارة (Daily KPI)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-blue-700 tabular-nums">
                  {dailyKpiScore}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ 5.0</span>
                <span className="text-xs text-slate-400 font-medium mr-1">
                  ({scoreToPercent(dailyKpiScore)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          {/* Member KPI score display */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                مؤشر أداء العضو (Member KPI)
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                  {memberKpiScore}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ 5.0</span>
                <span className="text-xs text-slate-400 font-medium mr-1">
                  ({scoreToPercent(memberKpiScore)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="تعبئة بيانات نموذجية جاهزة للتجربة"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">بيانات نموذجية</span>
          </button>

          <button
            type="button"
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            title="تفريغ كافة الحقول"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>تفريغ</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs cursor-pointer"
            title="حفظ التقرير كمسودة مؤقتة"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>حفظ مسودة</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs md:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
            title="نشر التقرير واعتماده رسمياً بعد التحقق من البيانات"
          >
            <Send className="w-4 h-4" />
            <span>نشر التقرير (Publish)</span>
          </button>
        </div>
      </div>

      {/* Prominent Interactive Validation Error Banner */}
      {validationErrorsList.length > 0 && (
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl shadow-sm text-rose-950 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-rose-900 flex items-center gap-2">
                  <span>تعذر نشر التقرير: هناك ({validationErrorsList.length}) حقول مطلوبة غير مكتملة!</span>
                </h3>
                <span className="text-xs px-2.5 py-0.5 font-bold rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                  فحص صحة واكتمال البيانات (Validation)
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1">
                لضمان دقة مؤشرات الأداء واعتماد البيانات الرسمية، يرجى استكمال الحقول المحددة باللون الأحمر أدناه. يمكنك النقر على أي حقل للانتقال إليه وتعبئته مباشرة:
              </p>
              
              {/* Interactive jump-to badges */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-rose-200/80">
                {validationErrorsList.map((item, idx) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => scrollToElement(item.elementId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-rose-100 border border-rose-300 rounded-lg text-xs font-bold text-rose-800 transition-colors shadow-2xs hover:border-rose-400 group cursor-pointer"
                    title={`انقر للانتقال مباشرة لحقل ${item.label}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 text-[10px] flex items-center justify-center group-hover:bg-rose-200 font-mono">
                      {idx + 1}
                    </span>
                    <span>{item.label}</span>
                    <span className="text-rose-500 text-[10px] group-hover:translate-x-[-2px] transition-transform">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {isSuccess && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between gap-4 text-emerald-950 text-sm animate-in fade-in duration-300 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-base text-emerald-900">
                  تم التحقق من صحة كافة البيانات ونشر التقرير بنجاح!
                </p>
                {lastSavedReportNumber && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    {lastSavedReportNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-700 mt-1">
                مؤشر أداء الإدارة اليومي: <strong className="tabular-nums font-extrabold">{dailyKpiScore} / 5</strong> | مؤشر أداء العضو: <strong className="tabular-nums font-extrabold">{memberKpiScore} / 5</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <span>العودة لجدول التقارير</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: بيانات التشغيل اليومي (Daily Operations Data)   */}
        {/* ========================================================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <div>
                <h2 className="text-base font-bold">القسم الأول: بيانات التشغيل اليومي</h2>
                <p className="text-xs text-slate-300">
                  توثيق سير العمل الميداني، الأعضاء، المهام المنجزة، والطلبات
                </p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700">
              حقول إلزامية (*)
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Grid 1: Basic Identifiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* تاريخ التقرير */}
              <div>
                <label htmlFor={reportDateId} className="block text-xs font-bold text-slate-800 mb-1">
                  تاريخ التقرير <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id={reportDateId}
                    type="date"
                    required
                    value={reportDate}
                    onChange={(e) => {
                      setReportDate(e.target.value);
                      clearFieldError('reportDate');
                    }}
                    className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                      fieldErrors.reportDate
                        ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {fieldErrors.reportDate && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.reportDate}</span>
                  </p>
                )}
              </div>

              {/* الإدارة أو الوحدة التشغيلية */}
              <div className="lg:col-span-2">
                <label htmlFor={departmentId} className="block text-xs font-bold text-slate-800 mb-1">
                  الإدارة أو الوحدة التشغيلية <span className="text-rose-500">*</span>
                </label>
                <input
                  id={departmentId}
                  type="text"
                  required
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    clearFieldError('department');
                  }}
                  placeholder="مثلاً: إدارة تشغيل قواعد بيانات AFMIS"
                  className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                    fieldErrors.department
                      ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.department && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.department}</span>
                  </p>
                )}
              </div>

              {/* اسم معدّ التقرير */}
              <div>
                <label htmlFor={preparedById} className="block text-xs font-bold text-slate-800 mb-1">
                  اسم معدّ التقرير <span className="text-rose-500">*</span>
                </label>
                <input
                  id={preparedById}
                  type="text"
                  required
                  value={preparedBy}
                  onChange={(e) => {
                    setPreparedBy(e.target.value);
                    clearFieldError('preparedBy');
                  }}
                  placeholder="الاسم الكامل"
                  className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                    fieldErrors.preparedBy
                      ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.preparedBy && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.preparedBy}</span>
                  </p>
                )}
              </div>

              {/* الفترة أو الوردية */}
              <div>
                <label htmlFor={shiftId} className="block text-xs font-bold text-slate-800 mb-1">
                  الفترة أو الوردية <span className="text-rose-500">*</span>
                </label>
                <select
                  id={shiftId}
                  required
                  value={shift}
                  onChange={(e) => {
                    setShift(e.target.value as ShiftType);
                    clearFieldError('shift');
                  }}
                  className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                    fieldErrors.shift
                      ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  <option value="صباحية">صباحية (08:00 - 15:00)</option>
                  <option value="مسائية">مسائية (15:00 - 22:00)</option>
                  <option value="ليلية">ليلية (مناوبة الطوارئ)</option>
                </select>
                {fieldErrors.shift && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.shift}</span>
                  </p>
                )}
              </div>

              {/* الأعضاء: الحاضرين / الغائبين */}
              <div className={`lg:col-span-2 grid grid-cols-2 gap-3 p-3 rounded-lg border transition-all ${
                fieldErrors.membersPresent || fieldErrors.membersAbsent
                  ? 'bg-rose-50/20 border-rose-300'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <label htmlFor={membersPresentId} className="block text-xs font-bold text-slate-700 mb-1">
                    الأعضاء الحاضرين <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={membersPresentId}
                    type="number"
                    min="0"
                    required
                    value={membersPresent}
                    onChange={(e) => {
                      setMembersPresent(parseInt(e.target.value) || 0);
                      clearFieldError('membersPresent');
                    }}
                    className={`w-full text-sm font-semibold border rounded-md px-3 py-1.5 bg-white tabular-nums ${
                      fieldErrors.membersPresent ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.membersPresent && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">{fieldErrors.membersPresent}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={membersAbsentId} className="block text-xs font-bold text-slate-700 mb-1">
                    الأعضاء الغائبين <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={membersAbsentId}
                    type="number"
                    min="0"
                    required
                    value={membersAbsent}
                    onChange={(e) => {
                      setMembersAbsent(parseInt(e.target.value) || 0);
                      clearFieldError('membersAbsent');
                    }}
                    className={`w-full text-sm font-semibold border rounded-md px-3 py-1.5 bg-white tabular-nums text-rose-600 ${
                      fieldErrors.membersAbsent ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.membersAbsent && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">{fieldErrors.membersAbsent}</p>
                  )}
                </div>
              </div>

              {/* الحالة التشغيلية العامة */}
              <div>
                <label htmlFor={operationalStatusId} className="block text-xs font-bold text-slate-800 mb-1">
                  الحالة التشغيلية العامة <span className="text-rose-500">*</span>
                </label>
                <select
                  id={operationalStatusId}
                  required
                  value={operationalStatus}
                  onChange={(e) => {
                    setOperationalStatus(e.target.value as OperationalStatus);
                    clearFieldError('operationalStatus');
                  }}
                  className={`w-full text-sm font-bold border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    fieldErrors.operationalStatus
                      ? 'border-rose-500 ring-2 ring-rose-200'
                      : operationalStatus === 'مستقرة'
                      ? 'border-emerald-300 text-emerald-800 bg-emerald-50/40'
                      : operationalStatus === 'متأثرة جزئياً'
                      ? 'border-amber-300 text-amber-800 bg-amber-50/40'
                      : 'border-rose-300 text-rose-800 bg-rose-50/40'
                  }`}
                >
                  <option value="مستقرة">مستقرة (طبيعية 100%)</option>
                  <option value="متأثرة جزئياً">متأثرة جزئياً (تذبذب أو بطء)</option>
                  <option value="حرجة">حرجة (توقف أو عطل حرج)</option>
                </select>
                {fieldErrors.operationalStatus && (
                  <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.operationalStatus}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Grid 2: عدد المهام (المخطط / المنجزة / المتأخرة) & عدد الطلبات (المستلمة / المعالجة) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* عدد المهام */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  عدد المهام التشغيلية <span className="text-rose-500">*</span>
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor={tasksPlannedId} className="block text-[11px] font-semibold text-slate-600 mb-1">
                      المخطط لها
                    </label>
                    <input
                      id={tasksPlannedId}
                      type="number"
                      min="0"
                      required
                      value={tasksPlanned}
                      onChange={(e) => {
                        setTasksPlanned(parseInt(e.target.value) || 0);
                        clearFieldError('tasksPlanned');
                      }}
                      className={`w-full text-sm font-bold border rounded-md px-2.5 py-1.5 bg-white tabular-nums ${
                        fieldErrors.tasksPlanned ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                      }`}
                    />
                    {fieldErrors.tasksPlanned && (
                      <p className="text-[10px] font-bold text-rose-600 mt-1">{fieldErrors.tasksPlanned}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={tasksCompletedId} className="block text-[11px] font-semibold text-slate-600 mb-1">
                      المنجزة
                    </label>
                    <input
                      id={tasksCompletedId}
                      type="number"
                      min="0"
                      required
                      value={tasksCompleted}
                      onChange={(e) => {
                        setTasksCompleted(parseInt(e.target.value) || 0);
                        clearFieldError('tasksCompleted');
                      }}
                      className={`w-full text-sm font-bold border rounded-md px-2.5 py-1.5 bg-white tabular-nums ${
                        fieldErrors.tasksCompleted ? 'border-rose-500 ring-2 ring-rose-200' : 'border-emerald-300 text-emerald-700'
                      }`}
                    />
                    {fieldErrors.tasksCompleted && (
                      <p className="text-[10px] font-bold text-rose-600 mt-1">{fieldErrors.tasksCompleted}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={tasksDelayedId} className="block text-[11px] font-semibold text-slate-600 mb-1">
                      المتأخرة
                    </label>
                    <input
                      id={tasksDelayedId}
                      type="number"
                      min="0"
                      required
                      value={tasksDelayed}
                      onChange={(e) => {
                        setTasksDelayed(parseInt(e.target.value) || 0);
                        clearFieldError('tasksDelayed');
                      }}
                      className="w-full text-sm font-bold border border-rose-300 text-rose-700 rounded-md px-2.5 py-1.5 bg-white tabular-nums"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  نسبة الإنجاز:{' '}
                  <span className="font-bold text-blue-700 tabular-nums">
                    {tasksPlanned > 0 ? Math.round((tasksCompleted / tasksPlanned) * 100) : 100}%
                  </span>
                </div>
              </div>

              {/* عدد الطلبات */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-800 block mb-2">
                  عدد الطلبات والتذاكر
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={requestsReceivedId} className="block text-[11px] font-semibold text-slate-600 mb-1">
                      الطلبات المستلمة
                    </label>
                    <input
                      id={requestsReceivedId}
                      type="number"
                      min="0"
                      value={requestsReceived}
                      onChange={(e) => setRequestsReceived(parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-bold border border-slate-300 rounded-md px-2.5 py-1.5 bg-white tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor={requestsProcessedId} className="block text-[11px] font-semibold text-slate-600 mb-1">
                      الطلبات المعالجة
                    </label>
                    <input
                      id={requestsProcessedId}
                      type="number"
                      min="0"
                      value={requestsProcessed}
                      onChange={(e) => setRequestsProcessed(parseInt(e.target.value) || 0)}
                      className="w-full text-sm font-bold border border-emerald-300 text-emerald-700 rounded-md px-2.5 py-1.5 bg-white tabular-nums"
                    />
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 font-medium">
                  نسبة معالجة الطلبات:{' '}
                  <span className="font-bold text-blue-700 tabular-nums">
                    {requestsReceived > 0 ? Math.round((requestsProcessed / requestsReceived) * 100) : 100}%
                  </span>
                </div>
              </div>
            </div>

            {/* ملخص الأعمال والأنشطة */}
            <div>
              <label htmlFor={activitiesSummaryId} className="block text-xs font-bold text-slate-800 mb-1">
                ملخص الأعمال والأنشطة <span className="text-rose-500">*</span>
              </label>
              <textarea
                id={activitiesSummaryId}
                rows={3}
                required
                value={activitiesSummary}
                onChange={(e) => {
                  setActivitiesSummary(e.target.value);
                  clearFieldError('activitiesSummary');
                }}
                placeholder="سرد تفصيلي لمجريات الوردية، العمليات الفنية، الصيانة الوقائية، والتحديثات..."
                className={`w-full text-sm border rounded-lg p-3 bg-white transition-all ${
                  fieldErrors.activitiesSummary
                    ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                    : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.activitiesSummary && (
                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{fieldErrors.activitiesSummary}</span>
                </p>
              )}
            </div>

            {/* Grid 3: المعوقات / الإجراءات / أولويات الغد */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor={operationalObstaclesId} className="block text-xs font-bold text-slate-800 mb-1">
                  المعوقات أو الحوادث التشغيلية
                </label>
                <textarea
                  id={operationalObstaclesId}
                  rows={2}
                  value={operationalObstacles}
                  onChange={(e) => setOperationalObstacles(e.target.value)}
                  placeholder="أي عائق فني أو انقطاع..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor={actionsTakenId} className="block text-xs font-bold text-slate-800 mb-1">
                  الإجراءات المتخذة
                </label>
                <textarea
                  id={actionsTakenId}
                  rows={2}
                  value={actionsTaken}
                  onChange={(e) => setActionsTaken(e.target.value)}
                  placeholder="كيف تم التعامل مع المعوقات..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label htmlFor={nextDayPrioritiesId} className="block text-xs font-bold text-slate-800 mb-1">
                  أولويات اليوم التالي
                </label>
                <textarea
                  id={nextDayPrioritiesId}
                  rows={2}
                  value={nextDayPriorities}
                  onChange={(e) => setNextDayPriorities(e.target.value)}
                  placeholder="المهام المستهدفة للوردية القادمة..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* مرفقات داعمة */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label htmlFor={fileUploadId} className="block text-xs font-bold text-slate-800 mb-0.5">
                  مرفقات داعمة (تقارير فنية، لقطات شاشات، أو مستندات مساندة)
                </label>
                <span className="text-[11px] text-slate-500">
                  صيغ مقبولة: PDF, XLSX, DOCX, PNG, JPG (حتى 15 ميجابايت)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {attachmentName && (
                  <span className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded text-slate-700 font-mono">
                    {attachmentName} ({attachmentSize})
                  </span>
                )}
                <label
                  htmlFor={fileUploadId}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-300 rounded-lg transition-colors shadow-2xs"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{attachmentName ? 'تغيير الملف' : 'اختيار ملف مرفق'}</span>
                </label>
                <input
                  id={fileUploadId}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 2: مؤشرات الأداء والتقييم (KPIs & Evaluation)              */}
        {/* ================================================================= */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <div>
                <h2 className="text-base font-bold">القسم الثاني: مؤشرات الأداء والتقييم</h2>
                <p className="text-xs text-slate-300">
                  تقييم مؤشرات أداء الإدارة (7 مؤشرات) وتقييم أداء العضو (5 مؤشرات) مع الاحتساب الفوري
                </p>
              </div>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700">
              تقييم خماسي (1 إلى 5 نجوم)
            </span>
          </div>

          <div className="p-6 space-y-8">
            
            {/* ------------------------------------------------------------- */}
            {/* Subsection A: إدارة مؤشرات الأداء (Department KPIs - 7 Items)  */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                    <span>إدارة مؤشرات الأداء (Department KPIs)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    تقييم إلزامي لجميع المؤشرات السبعة على مقياس من 1 إلى 5.
                  </p>
                </div>

                {/* Calculation 1: daily_kpi_score */}
                <div className="flex items-center gap-3 bg-blue-50/80 border border-blue-200 px-4 py-2 rounded-lg">
                  <span className="text-xs font-bold text-blue-900">
                    متوسط مؤشر أداء الإدارة (daily_kpi_score):
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-blue-700 tabular-nums">
                      {dailyKpiScore}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* The 7 KPI Star Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <RatingStars
                  label="1. إنجاز المهام"
                  name="taskCompletion"
                  value={deptKpis.taskCompletion}
                  onChange={(val) => setDeptKpis({ ...deptKpis, taskCompletion: val })}
                />
                <RatingStars
                  label="2. جودة العمل"
                  name="workQuality"
                  value={deptKpis.workQuality}
                  onChange={(val) => setDeptKpis({ ...deptKpis, workQuality: val })}
                />
                <RatingStars
                  label="3. سرعة الاستجابة"
                  name="responseSpeed"
                  value={deptKpis.responseSpeed}
                  onChange={(val) => setDeptKpis({ ...deptKpis, responseSpeed: val })}
                />
                <RatingStars
                  label="4. الالتزام بالحضور"
                  name="attendanceCommitment"
                  value={deptKpis.attendanceCommitment}
                  onChange={(val) => setDeptKpis({ ...deptKpis, attendanceCommitment: val })}
                />
                <RatingStars
                  label="5. التعاون الجماعي"
                  name="teamCollaboration"
                  value={deptKpis.teamCollaboration}
                  onChange={(val) => setDeptKpis({ ...deptKpis, teamCollaboration: val })}
                />
                <RatingStars
                  label="6. الالتزام بالإجراءات"
                  name="proceduresCompliance"
                  value={deptKpis.proceduresCompliance}
                  onChange={(val) => setDeptKpis({ ...deptKpis, proceduresCompliance: val })}
                />
                <RatingStars
                  label="7. السلامة وإدارة المخاطر"
                  name="safetyAndRisk"
                  value={deptKpis.safetyAndRisk}
                  onChange={(val) => setDeptKpis({ ...deptKpis, safetyAndRisk: val })}
                />
              </div>

              {/* ملاحظات حول مؤشرات الأداء */}
              <div>
                <label htmlFor={kpiNotesId} className="block text-xs font-bold text-slate-800 mb-1">
                  ملاحظات حول مؤشرات الأداء
                </label>
                <textarea
                  id={kpiNotesId}
                  rows={2}
                  value={kpiNotes}
                  onChange={(e) => setKpiNotes(e.target.value)}
                  placeholder="ملاحظات توضيحية حول مؤشرات الأداء وأسباب التقييم..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Subsection B: تقييم العضو (Member Evaluation - 5 Items)         */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>تقييم العضو الفردي (Member Evaluation)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    تقييم أداء كادر الوردية المتميز أو المتابع على المقاييس الخمسة
                  </p>
                </div>

                {/* Calculation 2: member_kpi_score */}
                <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200 px-4 py-2 rounded-lg">
                  <span className="text-xs font-bold text-emerald-900">
                    متوسط مؤشر أداء العضو (member_kpi_score):
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-emerald-700 tabular-nums">
                      {memberKpiScore}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Member Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <label htmlFor={memberNameId} className="block text-xs font-bold text-slate-800 mb-1">
                    الاسم الكامل <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={memberNameId}
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => {
                      setMemberName(e.target.value);
                      clearFieldError('memberName');
                    }}
                    placeholder="اسم الموظف / المهندس"
                    className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                      fieldErrors.memberName
                        ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.memberName && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.memberName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={memberEmpId} className="block text-xs font-bold text-slate-800 mb-1">
                    الرقم الوظيفي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={memberEmpId}
                    type="text"
                    required
                    value={memberEmployeeId}
                    onChange={(e) => {
                      setMemberEmployeeId(e.target.value);
                      clearFieldError('memberEmployeeId');
                    }}
                    placeholder="EMP-1234"
                    className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                      fieldErrors.memberEmployeeId
                        ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.memberEmployeeId && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.memberEmployeeId}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={memberJobTitleId} className="block text-xs font-bold text-slate-800 mb-1">
                    المسمى الوظيفي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={memberJobTitleId}
                    type="text"
                    required
                    value={memberJobTitle}
                    onChange={(e) => {
                      setMemberJobTitle(e.target.value);
                      clearFieldError('memberJobTitle');
                    }}
                    placeholder="مهندس أنظمة / أخصائي دعم"
                    className={`w-full text-sm border rounded-lg px-3 py-2 bg-white transition-all ${
                      fieldErrors.memberJobTitle
                        ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 focus:ring-rose-400'
                        : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {fieldErrors.memberJobTitle && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.memberJobTitle}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* The 5 Member KPI Star Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <RatingStars
                  label="1. الإنتاجية"
                  name="productivity"
                  value={memberKpis.productivity}
                  onChange={(val) => setMemberKpis({ ...memberKpis, productivity: val })}
                />
                <RatingStars
                  label="2. الجودة"
                  name="quality"
                  value={memberKpis.quality}
                  onChange={(val) => setMemberKpis({ ...memberKpis, quality: val })}
                />
                <RatingStars
                  label="3. الالتزام بالمواعيد"
                  name="punctuality"
                  value={memberKpis.punctuality}
                  onChange={(val) => setMemberKpis({ ...memberKpis, punctuality: val })}
                />
                <RatingStars
                  label="4. التعاون"
                  name="cooperation"
                  value={memberKpis.cooperation}
                  onChange={(val) => setMemberKpis({ ...memberKpis, cooperation: val })}
                />
                <RatingStars
                  label="5. المبادرة"
                  name="initiative"
                  value={memberKpis.initiative}
                  onChange={(val) => setMemberKpis({ ...memberKpis, initiative: val })}
                />
              </div>

              {/* Strengths, Overall Rating & Follow-up */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor={memberStrengthsId} className="block text-xs font-bold text-slate-800 mb-1">
                    أبرز نقاط القوة / مجالات التحسين
                  </label>
                  <textarea
                    id={memberStrengthsId}
                    rows={2}
                    value={memberStrengths}
                    onChange={(e) => setMemberStrengths(e.target.value)}
                    placeholder="سرد جوانب التميز أو النقاط التي تحتاج تدريباً وتطويراً..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor={memberOverallRatingId} className="block text-xs font-bold text-slate-800 mb-1">
                    التقدير العام للعضو <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id={memberOverallRatingId}
                    required
                    value={memberOverallRating}
                    onChange={(e) => {
                      setMemberOverallRating(e.target.value as MemberOverallRating);
                      clearFieldError('memberOverallRating');
                    }}
                    className={`w-full text-sm font-bold border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      fieldErrors.memberOverallRating ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                    }`}
                  >
                    <option value="متميز">متميز (أداء يفوق التوقعات)</option>
                    <option value="جيد جداً">جيد جداً (أداء متقن وملتزم)</option>
                    <option value="جيد">جيد (أداء يلبي المتطلبات)</option>
                    <option value="يحتاج تحسين">يحتاج تحسين (أداء دون المستوى)</option>
                  </select>
                  {fieldErrors.memberOverallRating && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.memberOverallRating}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Follow-up Action & Report Review Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor={memberFollowUpId} className="block text-xs font-bold text-slate-800 mb-1">
                    إجراء المتابعة المقترح
                  </label>
                  <textarea
                    id={memberFollowUpId}
                    rows={2}
                    value={memberFollowUp}
                    onChange={(e) => setMemberFollowUp(e.target.value)}
                    placeholder="مثلاً: توفير دورة تدريبية، تكليفه بمهام إشرافية، أو متابعة أسبوعية..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label htmlFor={reviewStatusId} className="block text-xs font-bold text-slate-800 mb-1">
                    حالة مراجعة التقرير <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id={reviewStatusId}
                    required
                    value={reviewStatus}
                    onChange={(e) => {
                      setReviewStatus(e.target.value as ReportReviewStatus);
                      clearFieldError('reviewStatus');
                    }}
                    className={`w-full text-sm font-bold border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                      fieldErrors.reviewStatus ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300'
                    }`}
                  >
                    <option value="قيد المراجعة">قيد المراجعة</option>
                    <option value="معتمد">معتمد</option>
                    <option value="مرفوض">مرفوض</option>
                  </select>
                  {fieldErrors.reviewStatus && (
                    <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1 animate-in fade-in">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.reviewStatus}</span>
                    </p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Form Actions Footer with Validation Warning */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          {validationErrorsList.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-rose-900 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold">
                  تنبيه: لا يمكن نشر التقرير حتى يتم استكمال الحقول الإلزامية ({validationErrorsList.length} حقول ناقصة).
                </span>
              </div>
              <button
                type="button"
                onClick={() => scrollToElement(validationErrorsList[0].elementId)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                الانتقال لأول حقل ناقص ↗
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء والعودة للوحة التحكم
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearForm}
                className="px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
              >
                تفريغ الحقول
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>حفظ كمسودة مؤقتة</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-2.5 text-sm md:text-base font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all hover:shadow cursor-pointer active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>نشر واعتماد التقرير (Publish)</span>
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
