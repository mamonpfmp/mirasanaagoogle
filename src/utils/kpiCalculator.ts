/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DepartmentKpis, MemberEvaluation, OperationalStatus, ReportReviewStatus, MemberOverallRating } from '../types';

/**
 * Calculation 1: Automatic real-time average of the 7 Department KPIs (scale 1 to 5)
 */
export function calculateDailyKpiScore(kpis: DepartmentKpis): number {
  const values = [
    Number(kpis.taskCompletion) || 1,
    Number(kpis.workQuality) || 1,
    Number(kpis.responseSpeed) || 1,
    Number(kpis.attendanceCommitment) || 1,
    Number(kpis.teamCollaboration) || 1,
    Number(kpis.proceduresCompliance) || 1,
    Number(kpis.safetyAndRisk) || 1,
  ];

  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  return Number(avg.toFixed(2));
}

/**
 * Calculation 2: Automatic real-time average of the 5 Member KPIs (scale 1 to 5)
 */
export function calculateMemberKpiScore(member: Pick<MemberEvaluation, 'productivity' | 'quality' | 'punctuality' | 'cooperation' | 'initiative'>): number {
  const values = [
    Number(member.productivity) || 1,
    Number(member.quality) || 1,
    Number(member.punctuality) || 1,
    Number(member.cooperation) || 1,
    Number(member.initiative) || 1,
  ];

  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  return Number(avg.toFixed(2));
}

/**
 * Convert 1-5 score to Percentage for secondary display (e.g. 5/5 = 100%)
 */
export function scoreToPercent(score: number): number {
  return Number(((score / 5) * 100).toFixed(1));
}

/**
 * Theme & badge styles for Operational Status
 */
export function getOperationalStatusTheme(status: OperationalStatus): {
  label: string;
  badgeBg: string;
  dotColor: string;
} {
  switch (status) {
    case 'مستقرة':
      return {
        label: 'مستقرة',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'متأثرة جزئياً':
      return {
        label: 'متأثرة جزئياً',
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'حرجة':
    default:
      return {
        label: 'حرجة',
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-500',
      };
  }
}

/**
 * Theme for Report Review Status
 */
export function getReviewStatusTheme(status: ReportReviewStatus): {
  badgeBg: string;
} {
  switch (status) {
    case 'معتمد':
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    case 'مرفوض':
      return {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      };
    case 'قيد المراجعة':
    default:
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      };
  }
}

/**
 * Theme for Member Overall Rating
 */
export function getMemberRatingTheme(rating: MemberOverallRating): {
  badgeBg: string;
} {
  switch (rating) {
    case 'متميز':
      return {
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      };
    case 'جيد جداً':
      return {
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    case 'جيد':
      return {
        badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    case 'يحتاج تحسين':
    default:
      return {
        badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      };
  }
}
