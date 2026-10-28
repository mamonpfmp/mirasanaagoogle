/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, UserCheck, ShieldCheck, CheckCircle2, Award, Info, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const KpiRubricView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              دليل معايير تقييم الأداء ومؤشرات التشغيل (KPI Rubric)
            </h1>
            <p className="text-xs text-slate-500">
              الإدارة العامة للتشغيل والصيانة · نظام معلومات الإدارة المالية الحكومية (AFMIS) - وزارة المالية
            </p>
          </div>
        </div>

        <Link
          to="/admin/criteria"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 text-indigo-600" />
          <span>تخصيص وإدارة المعايير والأوزان</span>
        </Link>
      </div>

      {/* Grid of the 2 KPI sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department KPIs (7 Items) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                1. مؤشرات أداء الإدارة (Department KPIs)
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              7 مؤشرات (1 - 5)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            يتم حساب متوسط درجات المؤشرات السبعة آلياً في الحقل 
            <span className="font-mono font-bold text-blue-700 mx-1">daily_kpi_score</span>
            وفق المعادلة الرياضية المباشرة (مجموع الدرجات ÷ 7).
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              {
                num: '1',
                title: 'إنجاز المهام',
                desc: 'مدى استكمال كافة المهام المجدولة والطارئة للوردية في الوقت المحدد وبلا تأخير.',
              },
              {
                num: '2',
                title: 'جودة العمل',
                desc: 'دقة التنفيذ والالتزام بأعلى معايير الإتقان الفني وعدم وجود أخطاء في المعاملات.',
              },
              {
                num: '3',
                title: 'سرعة الاستجابة',
                desc: 'زمن التفاعل مع البلاغات والتذاكر الواردة والتدخل العاجل عند أي تذبذب للخدمة.',
              },
              {
                num: '4',
                title: 'الالتزام بالحضور',
                desc: 'انضباط كادر الوردية بالكامل في أوقات الحضور والانصراف والجاهزية للعمل.',
              },
              {
                num: '5',
                title: 'التعاون الجماعي',
                desc: 'روح الفريق والتنسيق الفعال بين مهندسي الأنظمة والشبكات والدعم وقواعد البيانات.',
              },
              {
                num: '6',
                title: 'الالتزام بالإجراءات',
                desc: 'اتباع دورة العمل الرسمية والسياسات المعتمدة من وزارة المالية والإدارة العامة.',
              },
              {
                num: '7',
                title: 'السلامة وإدارة المخاطر',
                desc: 'تطبيق إجراءات أمن المعلومات، النسخ الاحتياطي، وإدارة مخاطر مركز البيانات.',
              },
            ].map((kpi) => (
              <div key={kpi.num} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {kpi.num}
                  </span>
                  <span className="font-bold text-slate-800">{kpi.title}</span>
                </div>
                <p className="text-slate-600 pr-7 text-[11px] leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member KPIs (5 Items) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                2. تقييم أداء العضو (Member Evaluation)
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
              5 مؤشرات (1 - 5)
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            يتم حساب متوسط درجات المؤشرات الخمسة آلياً في الحقل 
            <span className="font-mono font-bold text-emerald-700 mx-1">member_kpi_score</span>
            وفق المعادلة الرياضية المباشرة (مجموع الدرجات ÷ 5).
          </p>

          <div className="space-y-2.5 text-xs">
            {[
              {
                num: '1',
                title: 'الإنتاجية',
                desc: 'حجم المهام والتذاكر المنجزة بكفاءة مقارنة بالوقت المستغرق وحجم العمل المكلف به.',
              },
              {
                num: '2',
                title: 'الجودة',
                desc: 'الدقة الفنية الخالية من الأخطاء والالتزام بتقديم حلول جذرية تمنع تكرار الأعطال.',
              },
              {
                num: '3',
                title: 'الالتزام بالمواعيد',
                desc: 'الحضور المبكر للوردية، استلام وتسليم المهام بدقة، وتسليم التقارير الفنية في موعدها.',
              },
              {
                num: '4',
                title: 'التعاون',
                desc: 'مساعدة الزملاء، المرونة في التناوب وتغطية المهام الطارئة، والتواصل الإيجابي.',
              },
              {
                num: '5',
                title: 'المبادرة',
                desc: 'اقتراح تحسينات للأنظمة، معالجة استباقية للأعطال قبل تفاقمها، وتطوير الذات.',
              },
            ].map((kpi) => (
              <div key={kpi.num} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {kpi.num}
                  </span>
                  <span className="font-bold text-slate-800">{kpi.title}</span>
                </div>
                <p className="text-slate-600 pr-7 text-[11px] leading-relaxed">{kpi.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scale Ratings legend */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span>مقياس الدرجات اللفظية والنسب المئوية</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <span className="font-bold text-purple-900 block">متميز (5 نجوم)</span>
            <span className="text-[11px] text-purple-700 font-mono">4.50 - 5.00 (90% - 100%)</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-bold text-blue-900 block">جيد جداً (4 نجوم)</span>
            <span className="text-[11px] text-blue-700 font-mono">3.50 - 4.49 (70% - 89%)</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-bold text-amber-900 block">جيد (3 نجوم)</span>
            <span className="text-[11px] text-amber-700 font-mono">2.50 - 3.49 (50% - 69%)</span>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <span className="font-bold text-orange-900 block">مقبول (نجمتان)</span>
            <span className="text-[11px] text-orange-700 font-mono">1.50 - 2.49 (30% - 49%)</span>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <span className="font-bold text-rose-900 block">يحتاج تحسين (نجمة)</span>
            <span className="text-[11px] text-rose-700 font-mono">أقل من 1.50 (أقل من 30%)</span>
          </div>
        </div>
      </div>

    </div>
  );
};
