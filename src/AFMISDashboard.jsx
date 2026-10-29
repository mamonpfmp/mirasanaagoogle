/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Filter,
  Shield,
  Layers,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

// ==============================================================================
// بيانات وهمية واقعية تحاكي نظام معلومات إدارة المالية العامة (AFMIS)
// ==============================================================================

// 1. حجم العمليات المالية خلال الأسبوع الماضي
const weeklyTransactionsData = [
  { day: 'السبت', volume: 342.5, count: 1820, target: 300 },
  { day: 'الأحد', volume: 512.8, count: 2640, target: 450 },
  { day: 'الإثنين', volume: 628.4, count: 3110, target: 500 },
  { day: 'الثلاثاء', volume: 489.1, count: 2490, target: 450 },
  { day: 'الأربعاء', volume: 734.6, count: 3850, target: 550 },
  { day: 'الخميس', volume: 810.2, count: 4210, target: 600 },
  { day: 'الجمعة', volume: 195.0, count: 980, target: 200 },
];

// 2. مقارنة الإيرادات المحصلة مقابل المستهدفة للجهات الحكومية (بملايين العملة)
const revenueComparisonData = [
  { entity: 'مصلحة الضرائب', collected: 1420, target: 1550, achievement: 91.6 },
  { entity: 'مصلحة الجمارك', collected: 980, target: 920, achievement: 106.5 },
  { entity: 'وزارة النفط', collected: 2150, target: 2000, achievement: 107.5 },
  { entity: 'وزارة الاتصالات', collected: 640, target: 700, achievement: 91.4 },
  { entity: 'موانئ البحر الأحمر', collected: 430, target: 410, achievement: 104.8 },
  { entity: 'وزارة المالية', collected: 890, target: 850, achievement: 104.7 },
];

// 3. توزيع المستخدمين حسب الصلاحيات
const userRoleDistributionData = [
  { name: 'مشرف نظام (Admin)', value: 45, color: '#4f46e5', percentage: '12%' },
  { name: 'مدير مؤشرات (Supervisor)', value: 110, color: '#0ea5e9', percentage: '28%' },
  { name: 'مدقق مالي (Auditor)', value: 85, color: '#10b981', percentage: '22%' },
  { name: 'مستخدم للإطلاع (Viewer)', value: 150, color: '#f59e0b', percentage: '38%' },
];

// 4. أحدث أوامر التحصيل والعمليات المنفذة في AFMIS
const recentTransactions = [
  {
    id: 'TXN-2026-9841',
    entity: 'مصلحة الضرائب - كبار المكلفين',
    amount: '42,850,000 ر.س',
    type: 'تحصيل ضريبة القيمة المضافة',
    status: 'مسوى ومكتمل',
    statusCode: 'completed',
    time: 'منذ 8 دقائق',
    channel: 'سداد إلكتروني فوري',
  },
  {
    id: 'TXN-2026-9840',
    entity: 'مصلحة الجمارك - منفذ الوديعة',
    amount: '18,420,000 ر.س',
    type: 'رسوم جمركية وموانئ',
    status: 'مسوى ومكتمل',
    statusCode: 'completed',
    time: 'منذ 24 دقيقة',
    channel: 'حوالة بنكية مباشرة',
  },
  {
    id: 'TXN-2026-9839',
    entity: 'وزارة الاتصالات وتقنية المعلومات',
    amount: '9,310,000 ر.س',
    type: 'عوائد تراخيص تشغيلية',
    status: 'قيد الاعتماد النهائي',
    statusCode: 'pending',
    time: 'منذ 45 دقيقة',
    channel: 'نظام سويفت البنكي',
  },
  {
    id: 'TXN-2026-9838',
    entity: 'الهيئة العامة للموانئ',
    amount: '6,150,000 ر.س',
    type: 'رسوم رسو ومناولة',
    status: 'مسوى ومكتمل',
    statusCode: 'completed',
    time: 'منذ ساعة',
    channel: 'بوابة الدفع الحكومية',
  },
  {
    id: 'TXN-2026-9837',
    entity: 'وزارة الصحة العامة',
    amount: '3,200,000 ر.س',
    type: 'رسوم تراخيص ومطابقة',
    status: 'مراجعة التدقيق المالي',
    statusCode: 'audit',
    time: 'منذ ساعتين',
    channel: 'إيداع بنكي مركزي',
  },
];

// مخصص Tooltip للرسم الخطي
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5" dir="rtl">
        <p className="font-bold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
        <p className="text-emerald-400 font-semibold flex items-center justify-between gap-4">
          <span>العمليات المنفذة:</span>
          <span>{payload[0]?.value} مليون ر.س</span>
        </p>
        {payload[1] && (
          <p className="text-indigo-300 flex items-center justify-between gap-4">
            <span>المعدل المستهدف:</span>
            <span>{payload[1]?.value} مليون ر.س</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

// مخصص Tooltip للرسم الشريطي
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const collected = payload.find((p) => p.dataKey === 'collected')?.value || 0;
    const target = payload.find((p) => p.dataKey === 'target')?.value || 0;
    const ratio = target > 0 ? ((collected / target) * 100).toFixed(1) : '100';

    return (
      <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs space-y-2" dir="rtl">
        <p className="font-bold text-slate-100 text-sm border-b border-slate-700 pb-1">{label}</p>
        <div className="space-y-1">
          <p className="text-emerald-400 font-semibold flex items-center justify-between gap-4">
            <span>المحصل فعلياً:</span>
            <span className="font-mono">{collected.toLocaleString()} م.ر</span>
          </p>
          <p className="text-blue-400 font-semibold flex items-center justify-between gap-4">
            <span>المستهدف المعتمد:</span>
            <span className="font-mono">{target.toLocaleString()} م.ر</span>
          </p>
          <p className="text-amber-300 font-medium pt-1 border-t border-slate-800 flex items-center justify-between gap-4">
            <span>نسبة الإنجاز:</span>
            <span className="font-bold font-mono">{ratio}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function AFMISDashboard() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // محاكاة تحديث البيانات اللحظية
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // بطاقات الإحصاءات العلوية
  const summaryCards = useMemo(() => [
    {
      id: 'collection-orders',
      title: 'إجمالي أوامر التحصيل المعتمدة',
      value: timeframe === 'today' ? '2,840' : timeframe === 'week' ? '18,100' : '74,650',
      unit: 'أمر تحصيل',
      change: '+14.8%',
      isPositive: true,
      subtext: 'مقارنة بالفترة السابقة',
      icon: Receipt,
      accentColor: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'daily-volume',
      title: 'حجم العمليات المالية المنفذة',
      value: timeframe === 'today' ? '810.2' : timeframe === 'week' ? '3,712.6' : '15,840.0',
      unit: 'مليون ر.س',
      change: '+9.3%',
      isPositive: true,
      subtext: 'تدفقات مالية فورية موثقة',
      icon: DollarSign,
      accentColor: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'active-users',
      title: 'المستخدمين والجهات المتصلة',
      value: '1,248',
      unit: 'مستخدم نشط',
      change: '+24 مستخدم',
      isPositive: true,
      subtext: 'في 142 جهة وهيئة حكومية',
      icon: Users,
      accentColor: 'from-purple-600 to-fuchsia-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'bank-reconciliation',
      title: 'نسبة التسوية والمطابقة البنكية',
      value: '99.85%',
      unit: 'مطابقة تامة',
      change: '+0.15%',
      isPositive: true,
      subtext: 'مع البنك المركزي والبنوك الوسيطة',
      icon: CheckCircle2,
      accentColor: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ], [timeframe]);

  // تصفية المعاملات حسب الحالة
  const filteredTransactions = useMemo(() => {
    if (activeFilter === 'all') return recentTransactions;
    if (activeFilter === 'completed') {
      return recentTransactions.filter((t) => t.statusCode === 'completed');
    }
    return recentTransactions.filter((t) => t.statusCode !== 'completed');
  }, [activeFilter]);

  return (
    <div className="space-y-6 pb-12" dir="rtl">
      {/* ==================================================================== */}
      {/* الرأس والترويسة العلوية للوحة AFMIS                                 */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              نظام AFMIS المالي المركزي متصل
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">| وزارة المالية</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            لوحة القيادة المركزية ومؤشرات الأداء المالي (AFMIS)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            متابعة فورية للتحصيلات والإيرادات الحكومية، كفاءة العمليات، وتوزيع صلاحيات المستخدمين
          </p>
        </div>

        {/* أزرار الإجراءات والفلترة الزمنية */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* محدد الفترة الزمنية */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-medium">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'today'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اليوم
            </button>
            <button
              onClick={() => setTimeframe('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'week'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الأسبوع
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'month'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الشهر
            </button>
            <button
              onClick={() => setTimeframe('quarter')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeframe === 'quarter'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              الربع سنوي
            </button>
          </div>

          {/* زر تحديث البيانات */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium shadow-xs transition-colors disabled:opacity-60"
            title="تحديث البيانات المباشرة"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* زر تصدير التقرير */}
          <button
            onClick={() => {
              alert('جاري إعداد وتحميل التقرير المالي الموحد بصيغة Excel...');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير التقرير المالي</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. البطاقات الإحصائية العلوية (Summary Cards)                         */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 block mb-1">
                    {card.title}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {card.value}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {card.unit}
                    </span>
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.accentColor} flex items-center justify-center text-white shadow-xs shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold ${card.badgeBg}`}>
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
                <span className="text-slate-400 font-medium">
                  {card.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 2. شبكة الرسوم البيانية المتجاوبة (CSS Grid)                         */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* الرسم الخطي: حجم العمليات المنفذة على AFMIS خلال الأسبوع الماضي */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  حجم العمليات المالية المنفذة على نظام AFMIS خلال الأسبوع الماضي
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                تتبع القيمة الإجمالية للتدفقات اليومية بالمليون (ر.س / ر.ي) مقارنة بالمستهدف اليومي
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                العمليات الفعلية
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-indigo-400 inline-block"></span>
                المستهدف اليومي
              </span>
            </div>
          </div>

          {/* مساحة الرسم البياني الخطي */}
          <div className="w-full h-72 sm:h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weeklyTransactionsData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} م`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#059669"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                  name="العمليات المنفذة"
                  dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="المعدل المستهدف"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span>ذروة العمليات: يوم الخميس (810.2 مليون ر.س)</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              إجمالي الأسبوع: 3,712.6 مليون ر.س
            </span>
          </div>
        </div>

        {/* الرسم الدائري: توزيع المستخدمين حسب الصلاحيات */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                توزيع المستخدمين حسب الصلاحيات
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              صلاحيات الوصول لنظام AFMIS وإدارة المؤشرات
            </p>
          </div>

          {/* مساحة الرسم الدائري */}
          <div className="w-full h-56 sm:h-64 my-2 relative" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {userRoleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} مستخدم`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    direction: 'rtl',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* مؤشر المنتصف للرسم الدائري */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">الإجمالي</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">390</span>
              <span className="text-[10px] text-slate-400">حساب معتمد</span>
            </div>
          </div>

          {/* وسيلة إيضاح الصلاحيات */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {userRoleDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{item.value}</span>
                  <span className="text-slate-400 text-[11px]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* الرسم الشريطي: الإيرادات المحصلة مقابل الإيرادات المستهدفة للجهات الحكومية */}
        <div className="lg:col-span-12 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  مقارنة الإيرادات المحصلة مقابل الإيرادات المستهدفة للجهات الحكومية
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                مقارنة مستهدفات الموازنة العامة بالتحصيل الفعلي بالمليون (ر.س / ر.ي) عبر قنوات AFMIS
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block"></span>
                الإيرادات المحصلة فعلياً
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-600">
                <span className="w-3.5 h-3.5 rounded bg-blue-500 inline-block"></span>
                الإيرادات المستهدفة
              </span>
            </div>
          </div>

          {/* مساحة الرسم الشريطي */}
          <div className="w-full h-80 sm:h-96" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueComparisonData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                barGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="entity"
                  stroke="#475569"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val} م`}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar
                  dataKey="collected"
                  name="المحصل فعلياً"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
                <Bar
                  dataKey="target"
                  name="المستهدف المعتمد"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* مؤشرات الأداء السريع للجهات */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100">
            {revenueComparisonData.map((item, i) => (
              <div key={i} className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60 text-center">
                <span className="text-[11px] font-medium text-slate-600 block truncate">
                  {item.entity}
                </span>
                <span className={`text-sm font-bold font-mono mt-1 block ${
                  item.achievement >= 100 ? 'text-emerald-700' : 'text-blue-700'
                }`}>
                  {item.achievement}%
                </span>
                <span className="text-[10px] text-slate-400">نسبة التحقيق</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. جدول أحدث العمليات وأوامر التحصيل المالية في النظام                */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              سجل أحدث أوامر التحصيل المالي المباشر (AFMIS Journal)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              العمليات المسجلة لحظياً عبر قنوات التحصيل والتسوية مع البنك المركزي
            </p>
          </div>

          {/* تبويبات الفلترة السريعة */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({recentTransactions.length})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'completed'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              مسوى ومكتمل
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                activeFilter === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              قيد المراجعة
            </button>
          </div>
        </div>

        {/* الجدول التفاعلي المتجاوب */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50/80 text-slate-500 text-xs border-b border-slate-200/60 font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">رقم العملية</th>
                <th className="py-3.5 px-4">الجهة الحكومية</th>
                <th className="py-3.5 px-4">نوع التحصيل</th>
                <th className="py-3.5 px-4">القيمة المالية</th>
                <th className="py-3.5 px-4">قناة الدفع والتسوية</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 sm:px-6">التوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-indigo-700">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {tx.entity}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {tx.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                    {tx.amount}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {tx.channel}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        tx.statusCode === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : tx.statusCode === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tx.statusCode === 'completed'
                            ? 'bg-emerald-500'
                            : tx.statusCode === 'pending'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      ></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-400 font-medium">
                    {tx.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
