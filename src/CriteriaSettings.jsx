/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// المعايير الافتراضية لمؤشرات أداء المنظومة (Department KPIs)
const DEFAULT_DEPARTMENT_CRITERIA = [
  {
    id: 1,
    name: 'جاهزية واستقرار نظام AFMIS (Oracle RAC)',
    weight: 25,
    target: '≥ 99.8%',
    category: 'الأنظمة وقواعد البيانات',
    description: 'استمرار عمل الخوادم والخدمات المالية المركزية دون أي انقطاع غير مجدول.',
  },
  {
    id: 2,
    name: 'سرعة الاستجابة ومعالجة البلاغات الفنية',
    weight: 20,
    target: '< 15 دقيقة',
    category: 'الدعم الفني والعمليات',
    description: 'زمن التفاعل السريع والتدخل الفوري عند ورود بلاغات وتذاكر الأعطال الحرجة.',
  },
  {
    id: 3,
    name: 'نسبة إنجاز المهام اليومية المجدولة والطارئة',
    weight: 20,
    target: '100%',
    category: 'التشغيل والصيانة',
    description: 'استكمال كافة مهام الوردية المعتمدة وفق خطة التشغيل اليومية دون تأخير.',
  },
  {
    id: 4,
    name: 'دقة وجودة تنفيذ المعاملات الفنية',
    weight: 15,
    target: '0 أخطاء حرجة',
    category: 'الجودة والرقابة',
    description: 'الالتزام بأعلى معايير الإتقان الفني وتجنب الأخطاء التراجعية في قواعد البيانات.',
  },
  {
    id: 5,
    name: 'أمن المعلومات والنسخ الاحتياطي الدوري',
    weight: 20,
    target: '100% نجاح',
    category: 'أمن المعلومات',
    description: 'التحقق اليومي من إتمام النسخ الاحتياطي لقواعد البيانات وسجلات النظام ومطابقة السياسات الأمنية.',
  },
];

// المعايير الافتراضية لتقييم أداء الأعضاء (Member KPIs)
const DEFAULT_MEMBER_CRITERIA = [
  {
    id: 1,
    name: 'الانضباط والالتزام بالمواعيد',
    maxScore: 5.0,
    weight: 20,
    description: 'الحضور المبكر للوردية، التواجد المستمر في موقع العمل، واستلام وتسليم المهام والتقارير بدقة.',
  },
  {
    id: 2,
    name: 'سرعة الاستجابة والإنجاز',
    maxScore: 5.0,
    weight: 25,
    description: 'التفاعل الفوري مع التكليفات العاجلة والبلاغات الطارئة والقدرة على حل المشكلات تحت الضغط.',
  },
  {
    id: 3,
    name: 'جودة العمل ودقة التنفيذ',
    maxScore: 5.0,
    weight: 25,
    description: 'تقديم حلول فنية جذرية خالية من الأخطاء وتوثيق خطوات المعالجة في سجل التشغيل اليومي.',
  },
  {
    id: 4,
    name: 'التعاون والعمل الجماعي',
    maxScore: 5.0,
    weight: 15,
    description: 'التنسيق الإيجابي مع أعضاء الفريق، مشاركة الخبرات، والمرونة في تغطية النوبات الطارئة.',
  },
  {
    id: 5,
    name: 'المبادرة والابتكار وتطوير الذات',
    maxScore: 5.0,
    weight: 15,
    description: 'تقديم مقترحات بناءة لتحسين كفاءة المنظومة، رصد الاختناقات ومعالجتها استباقياً قبل تفاقمها.',
  },
];

export const CriteriaSettings = () => {
  const navigate = useNavigate();

  let authContext = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // Standalone
  }

  // التبويب النشط: 'department' (معايير مؤشرات الأداء) أو 'member' (معايير تقييم أداء الأعضاء)
  const [activeTab, setActiveTab] = useState('department');

  // بيانات المعايير المحفوظة
  const [deptCriteria, setDeptCriteria] = useState(() => {
    const saved = localStorage.getItem('afmis_criteria_dept');
    return saved ? JSON.parse(saved) : DEFAULT_DEPARTMENT_CRITERIA;
  });

  const [memberCriteria, setMemberCriteria] = useState(() => {
    const saved = localStorage.getItem('afmis_criteria_member');
    return saved ? JSON.parse(saved) : DEFAULT_MEMBER_CRITERIA;
  });

  // حفظ التعديلات في LocalStorage
  useEffect(() => {
    localStorage.setItem('afmis_criteria_dept', JSON.stringify(deptCriteria));
  }, [deptCriteria]);

  useEffect(() => {
    localStorage.setItem('afmis_criteria_member', JSON.stringify(memberCriteria));
  }, [memberCriteria]);

  // حالة النافذة المنبثقة الديناميكية (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' أو 'edit'
  const [editingId, setEditingId] = useState(null);

  // حالة نموذج معيار مؤشرات الأداء
  const [deptForm, setDeptForm] = useState({
    name: '',
    weight: 20,
    target: '',
    category: 'التشغيل والصيانة',
    description: '',
  });

  // حالة نموذج معيار تقييم الأعضاء
  const [memberForm, setMemberForm] = useState({
    name: '',
    maxScore: 5.0,
    weight: 20,
    description: '',
  });

  // حالة الخطأ بالنافذة المنبثقة للتحقق من اكتمال الحقول
  const [modalError, setModalError] = useState('');

  // حالة البحث والتصفية
  const [searchTerm, setSearchTerm] = useState('');

  // رسائل التنبيه العائمة (Toast)
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // فتح نافذة الإضافة (فارغة)
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingId(null);
    setModalError('');
    if (activeTab === 'department') {
      setDeptForm({
        name: '',
        weight: 20,
        target: '',
        category: 'التشغيل والصيانة',
        description: '',
      });
    } else {
      setMemberForm({
        name: '',
        maxScore: 5.0,
        weight: 20,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل (معبأة ببيانات المعيار)
  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setEditingId(item.id);
    setModalError('');
    if (activeTab === 'department') {
      setDeptForm({
        name: item.name,
        weight: item.weight,
        target: item.target,
        category: item.category || 'التشغيل والصيانة',
        description: item.description || '',
      });
    } else {
      setMemberForm({
        name: item.name,
        maxScore: item.maxScore || 5.0,
        weight: item.weight,
        description: item.description || '',
      });
    }
    setIsModalOpen(true);
  };

  // حفظ المعيار (إضافة أو تعديل)
  const handleSave = (e) => {
    e.preventDefault();
    setModalError('');

    if (activeTab === 'department') {
      if (!deptForm.name.trim() || !deptForm.target.trim()) {
        setModalError('يرجى استكمال الحقول المطلوبة: اسم المعيار والقيمة المستهدفة.');
        return;
      }

      if (modalMode === 'add') {
        const created = {
          id: Date.now(),
          name: deptForm.name.trim(),
          weight: Number(deptForm.weight) || 0,
          target: deptForm.target.trim(),
          category: deptForm.category,
          description: deptForm.description.trim(),
        };
        setDeptCriteria((prev) => [...prev, created]);
        showToast(`تمت إضافة المعيار (${created.name}) بنجاح!`);
      } else {
        setDeptCriteria((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: deptForm.name.trim(),
                  weight: Number(deptForm.weight) || 0,
                  target: deptForm.target.trim(),
                  category: deptForm.category,
                  description: deptForm.description.trim(),
                }
              : c
          )
        );
        showToast(`تم تحديث المعيار (${deptForm.name}) بنجاح!`);
      }
    } else {
      // Member Criteria
      if (!memberForm.name.trim()) {
        setModalError('يرجى إدخال اسم معيار تقييم العضو قبل الحفظ.');
        return;
      }

      if (modalMode === 'add') {
        const created = {
          id: Date.now(),
          name: memberForm.name.trim(),
          maxScore: Number(memberForm.maxScore) || 5.0,
          weight: Number(memberForm.weight) || 0,
          description: memberForm.description.trim(),
        };
        setMemberCriteria((prev) => [...prev, created]);
        showToast(`تمت إضافة معيار التقييم (${created.name}) بنجاح!`);
      } else {
        setMemberCriteria((prev) =>
          prev.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  name: memberForm.name.trim(),
                  maxScore: Number(memberForm.maxScore) || 5.0,
                  weight: Number(memberForm.weight) || 0,
                  description: memberForm.description.trim(),
                }
              : c
          )
        );
        showToast(`تم تحديث معيار التقييم (${memberForm.name}) بنجاح!`);
      }
    }

    setIsModalOpen(false);
  };

  // حذف معيار
  const handleDelete = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المعيار (${name}) نهائياً؟`)) {
      if (activeTab === 'department') {
        setDeptCriteria((prev) => prev.filter((c) => c.id !== id));
      } else {
        setMemberCriteria((prev) => prev.filter((c) => c.id !== id));
      }
      showToast(`تم حذف المعيار (${name}) بنجاح.`);
    }
  };

  // إعادة التعيين إلى المعايير القياسية
  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة المعايير الافتراضية المعتمدة لوزارة المالية؟')) {
      if (activeTab === 'department') {
        setDeptCriteria(DEFAULT_DEPARTMENT_CRITERIA);
      } else {
        setMemberCriteria(DEFAULT_MEMBER_CRITERIA);
      }
      showToast('تمت استعادة المعايير القياسية بنجاح.');
    }
  };

  // حساب مجموع الأوزان النسبية
  const totalWeight = activeTab === 'department'
    ? deptCriteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0)
    : memberCriteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  // تصفية المعايير بالبحث
  const filteredDept = deptCriteria.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMember = memberCriteria.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* الشريط العلوي المشترك (Header) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* الشعار والعنوان */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">إعدادات ومعايير الأداء (KPIs)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    بوابة المشرفين
                  </span>
                </div>
                <span className="text-xs text-gray-500">نظام معلومات الإدارة المالية الحكومية (AFMIS) · وزارة المالية</span>
              </div>
            </div>

            {/* روابط التنقل السريع */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>إدارة المستخدمين</span>
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              >
                <span>لوحة المؤشرات</span>
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* إشعار النجاح */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-3 text-xs md:text-sm shadow-xs animate-in fade-in">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* بطاقة الترحيب والتبويبات الرئيسية والأزرار */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              إدارة وتخصيص معايير الأداء والتقييم
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              تحكم بالأوزان النسبية، المستهدفات الفنية، والدرجات القصوى لتقييم أداء التشغيل والكوادر البشرية.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              title="استعادة القيم القياسية"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>استعادة الافتراضي</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{activeTab === 'department' ? 'إضافة معيار مؤشرات' : 'إضافة معيار تقييم كادر'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* التبويبتان المطلوبتان: 1) معايير مؤشرات الأداء  2) معايير تقييم أداء الأعضاء   */}
        {/* ========================================================================= */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            type="button"
            onClick={() => { setActiveTab('department'); setSearchTerm(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'department'
                ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>معايير مؤشرات الأداء (Department KPIs)</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-indigo-50 text-indigo-700 font-mono font-bold">
              {deptCriteria.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('member'); setSearchTerm(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs md:text-sm font-extrabold rounded-xl transition-all cursor-pointer ${
              activeTab === 'member'
                ? 'bg-white text-emerald-700 shadow-sm border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>معايير تقييم أداء الأعضاء (Member KPIs)</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-mono font-bold">
              {memberCriteria.length}
            </span>
          </button>
        </div>

        {/* بطاقات المؤشرات والإحصاءات الخاصة بالمعايير */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">عدد المعايير المفعلة</span>
            <div className="mt-2 text-2xl font-extrabold text-gray-900 tabular-nums">
              {activeTab === 'department' ? deptCriteria.length : memberCriteria.length}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">معايير خاضعة للتقييم اليومي</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">إجمالي الوزن النسبي الحالي</span>
            <div className={`mt-2 text-2xl font-extrabold tabular-nums flex items-baseline gap-1 ${
              totalWeight === 100 ? 'text-emerald-700' : 'text-amber-600'
            }`}>
              <span>%{totalWeight}</span>
              <span className="text-xs text-gray-400 font-normal">/ %100</span>
            </div>
            <span className={`text-[11px] font-semibold mt-1 block ${
              totalWeight === 100 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {totalWeight === 100 ? '✓ مجموع الأوزان متوازن تماماً (100%)' : '⚠ ينبغي تعديل الأوزان لتصل إلى 100%'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">مستوى الدقة والمعايرة</span>
            <div className="mt-2 text-2xl font-extrabold text-indigo-700 tabular-nums">
              {activeTab === 'department' ? 'قياسي موحد' : '5 درجات قصوى'}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">مؤشر AFMIS المعتمد</span>
          </div>
        </div>

        {/* حقل البحث السريع */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في المعايير بالاسم أو التصنيف أو القيمة المستهدفة..."
              className="w-full text-xs md:text-sm pr-9 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* الجدول 1: معايير مؤشرات أداء المنظومة (Department KPIs Table)            */}
        {/* ========================================================================= */}
        {activeTab === 'department' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">جدول معايير مؤشرات أداء المنظومة والتشغيل</h2>
              <span className="text-xs text-gray-400 font-mono">({filteredDept.length} معيار)</span>
            </div>

            {filteredDept.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 text-xs">لا توجد معايير مطابقة للبحث</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <tr>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">اسم المعيار</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">التصنيف</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الوزن النسبي</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">القيمة المستهدفة</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الوصف التشغيلي</th>
                      <th scope="col" className="py-3.5 px-6 text-center whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredDept.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{c.name}</div>
                          <span className="text-[10px] text-gray-400 font-mono">معيار #{c.id}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                            {c.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-mono font-bold text-indigo-700">
                          %{c.weight}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-mono font-bold text-emerald-700" dir="ltr">
                          {c.target}
                        </td>
                        <td className="py-4 px-6 text-gray-600 max-w-xs truncate text-[11px]">
                          {c.description || '—'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(c)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
                              title="تعديل المعيار"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(c.id, c.name)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                              title="حذف المعيار"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* الجدول 2: معايير تقييم أداء الأعضاء (Member Evaluation Table)            */}
        {/* ========================================================================= */}
        {activeTab === 'member' && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900">جدول معايير تقييم أداء الكوادر والأعضاء</h2>
              <span className="text-xs text-gray-400 font-mono">({filteredMember.length} معيار)</span>
            </div>

            {filteredMember.length === 0 ? (
              <div className="text-center py-12 px-4 text-gray-500 text-xs">لا توجد معايير مطابقة للبحث</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                    <tr>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">اسم المعيار</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الدرجة القصوى</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الوزن النسبي</th>
                      <th scope="col" className="py-3.5 px-6 whitespace-nowrap">المؤشر الإجرائي / الوصف</th>
                      <th scope="col" className="py-3.5 px-6 text-center whitespace-nowrap">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredMember.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{m.name}</div>
                          <span className="text-[10px] text-gray-400 font-mono">معيار تقييم #{m.id}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-mono font-bold text-blue-700">
                          {m.maxScore} درجات
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-mono font-bold text-emerald-700">
                          %{m.weight}
                        </td>
                        <td className="py-4 px-6 text-gray-600 max-w-sm truncate text-[11px]">
                          {m.description || '—'}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(m)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                              title="تعديل المعيار"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(m.id, m.name)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                              title="حذف المعيار"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* النافذة المنبثقة الديناميكية (Modal) للإضافة والتعديل                        */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* ترويسة النافذة */}
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>
                  {activeTab === 'department'
                    ? modalMode === 'add' ? 'إضافة معيار مؤشرات أداء جديد' : 'تعديل معيار مؤشرات الأداء'
                    : modalMode === 'add' ? 'إضافة معيار تقييم كادر جديد' : 'تعديل معيار تقييم الكادر'}
                </span>
              </h3>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* النموذج الديناميكي */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2 animate-in fade-in">
                  <span className="text-base">⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}
              
              {activeTab === 'department' ? (
                <>
                  {/* حقل اسم المعيار */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      اسم المعيار <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      placeholder="مثال: جاهزية واستقرار نظام AFMIS"
                      className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  {/* صف التصنيف والوزن النسبي */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        التصنيف / المجال
                      </label>
                      <select
                        value={deptForm.category}
                        onChange={(e) => setDeptForm({ ...deptForm, category: e.target.value })}
                        className="w-full text-xs md:text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
                      >
                        <option value="الأنظمة وقواعد البيانات">الأنظمة وقواعد البيانات</option>
                        <option value="التشغيل والصيانة">التشغيل والصيانة</option>
                        <option value="الدعم الفني والعمليات">الدعم الفني والعمليات</option>
                        <option value="الجودة والرقابة">الجودة والرقابة</option>
                        <option value="أمن المعلومات">أمن المعلومات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        الوزن النسبي (%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={deptForm.weight}
                        onChange={(e) => setDeptForm({ ...deptForm, weight: e.target.value })}
                        className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* حقل القيمة المستهدفة */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      القيمة المستهدفة (Target) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={deptForm.target}
                      onChange={(e) => setDeptForm({ ...deptForm, target: e.target.value })}
                      placeholder="مثال: ≥ 99.8% أو 100% أو < 15 دقيقة"
                      dir="ltr"
                      className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg text-right font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  {/* حقل الوصف */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      الوصف والمعايير التشغيلية
                    </label>
                    <textarea
                      rows={2}
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      placeholder="شرح آلية قياس المعيار والتحقق منه..."
                      className="w-full text-xs md:text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* معايير الأعضاء: حقل الاسم */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      اسم معيار التقييم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder="مثال: الانضباط والالتزام بالمواعيد"
                      className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  {/* صف الدرجة القصوى والوزن النسبي */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        الدرجة القصوى
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="100"
                        required
                        value={memberForm.maxScore}
                        onChange={(e) => setMemberForm({ ...memberForm, maxScore: e.target.value })}
                        className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        الوزن النسبي (%)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={memberForm.weight}
                        onChange={(e) => setMemberForm({ ...memberForm, weight: e.target.value })}
                        className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* حقل الوصف الإجرائي */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      المؤشر الإجرائي وطريقة القياس
                    </label>
                    <textarea
                      rows={3}
                      value={memberForm.description}
                      onChange={(e) => setMemberForm({ ...memberForm, description: e.target.value })}
                      placeholder="تحديد شروط منح الدرجة كاملة وتفاصيل التقييم الفني..."
                      className="w-full text-xs md:text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {/* أزرار الحفظ والإلغاء */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs md:text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs md:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {modalMode === 'add' ? 'إضافة المعيار' : 'حفظ التعديلات'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CriteriaSettings;
