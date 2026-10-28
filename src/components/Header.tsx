/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileSpreadsheet,
  PlusCircle,
  BarChart3,
  BookOpen,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'form' | 'rubric';
  onSelectTab: (tab: 'dashboard' | 'form' | 'rubric') => void;
  onExportAll: () => void;
  reportsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onExportAll,
  reportsCount,
}) => {
  const currentDate = new Date().toLocaleDateString('ar-YE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Zone 1: Brand & Ministry of Finance lockup */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Screenshot_________________WhatsApp_4c36ef97.jpg"
                alt="AFMIS شعار نظام التشغيل والصيانة"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback styling if image path needs fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                  الإدارة العامة للتشغيل والصيانة
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  AFMIS
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                وزارة المالية · الجمهورية اليمنية
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>لوحة التحكم ومراقبة الأداء</span>
            </button>

            <button
              onClick={() => onSelectTab('form')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentTab === 'form'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>إدخال تقرير يومي جديد</span>
            </button>

            <button
              onClick={() => onSelectTab('rubric')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                currentTab === 'rubric'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>معايير وأوزان التقييم</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden xl:inline text-xs text-slate-500 font-medium pl-2 border-l border-slate-200">
              {currentDate}
            </span>

            <button
              onClick={onExportAll}
              disabled={reportsCount === 0}
              title="تصدير جميع التقارير والبيانات إلى ملف Excel بصيغة xlsx"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>تصدير Excel</span>
            </button>

            <button
              onClick={() => onSelectTab('form')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>تقرير جديد</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100 gap-1 text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md ${
              currentTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            لوحة التحكم
          </button>
          <button
            onClick={() => onSelectTab('form')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md ${
              currentTab === 'form' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            إدخال تقرير
          </button>
          <button
            onClick={() => onSelectTab('rubric')}
            className={`flex-1 py-1.5 text-center font-medium rounded-md ${
              currentTab === 'rubric' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            المعايير والأوزان
          </button>
        </div>

      </div>
    </header>
  );
};
