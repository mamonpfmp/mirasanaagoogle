/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const AdminDashboard = () => {
  const navigate = useNavigate();

  let authContext = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // يعمل خارج مزود AuthContext إذا لزم الأمر
  }

  // حالة التحكم بالنافذة المنبثقة الموحدة والديناميكية (Dynamic Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' أو 'edit'
  const [editingUserId, setEditingUserId] = useState(null);

  // الحالة الافتراضية لنموذج المستخدم
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'viewer', // القيمة الافتراضية
  };

  const [formData, setFormData] = useState(initialFormState);
  const [modalError, setModalError] = useState('');

  // حالة البحث وتصفية الصلاحيات
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // بيانات المستخدمين الأساسية في الـ State
  const [users, setUsers] = useState([
    { id: 1, name: 'مأمون أنعم', email: 'mamonpfmp@gmail.com', phone: '777000000', role: 'super_admin', date: '2026-10-28' },
    { id: 2, name: 'أحمد محمد', email: 'ahmed@example.com', phone: '771234567', role: 'admin', date: '2026-10-25' },
    { id: 3, name: 'سارة خالد', email: 'sara@example.com', phone: '733456789', role: 'kpi_manager', date: '2026-10-20' },
    { id: 4, name: 'فهد عبدالله', email: 'fahad@example.com', phone: '719876543', role: 'viewer', date: '2026-10-15' },
  ]);

  // رسالة إشعار تأكيدية عائمة (Toast Notification)
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // دالة لترجمة وتلوين الصلاحيات في الجدول
  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">مشرف عام</span>;
      case 'admin':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">مشرف نظام</span>;
      case 'kpi_manager':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">مدير مؤشرات</span>;
      case 'viewer':
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">للاطلاع فقط</span>;
    }
  };

  // فتح نافذة الإضافة (فارغة)
  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingUserId(null);
    setFormData(initialFormState);
    setModalError('');
    setIsModalOpen(true);
  };

  // فتح نافذة التعديل (معبأة ببيانات المستخدم المختار)
  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setEditingUserId(user.id);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '', // كلمة المرور اختيارية عند التعديل
      role: user.role || 'viewer',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  // معالجة تغيير قيم حقول النموذج
  const handleInputChange = (e) => {
    if (modalError) setModalError('');
    const { name, value } = e.target;
    if (name === 'phone') {
      // حصر حقل الجوال على الأرقام فقط
      const numeric = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, phone: numeric }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // حفظ المستخدم (إضافة جديد أو تعديل الحالي) وتحديث الـ State
  const handleSaveUser = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setModalError('يرجى ملء كافة الحقول الإلزامية: الاسم الكامل والبريد الإلكتروني.');
      return;
    }

    if (modalMode === 'add') {
      // عملية الإضافة (Create)
      if (!formData.password) {
        setModalError('يرجى إدخال كلمة مرور للمستخدم الجديد لإتمام عملية الإضافة.');
        return;
      }

      const createdUser = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '77xxxxxxx',
        role: formData.role,
        date: new Date().toISOString().slice(0, 10),
      };

      setUsers((prevUsers) => [createdUser, ...prevUsers]);
      showToast(`تمت إضافة المستخدم (${createdUser.name}) بنجاح!`);
    } else {
      // عملية التعديل (Update)
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || u.phone,
                role: formData.role,
              }
            : u
        )
      );
      showToast(`تم تحديث بيانات المستخدم (${formData.name}) بنجاح!`);
    }

    // إغلاق النافذة المنبثقة وإعادة ضبط الحالة
    setIsModalOpen(false);
    setFormData(initialFormState);
    setEditingUserId(null);
  };

  // معالجة حذف مستخدم (Delete)
  const handleDeleteUser = (id, name) => {
    if (window.confirm(`هل أنت متأكد من رغبتك في حذف المستخدم (${name}) نهائياً من المنظومة؟`)) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      showToast(`تم حذف المستخدم (${name}) بنجاح.`);
    }
  };

  // تسجيل دخول المشرفين المباشر (Super Admin - مأمون أنعم)
  const handleSupervisorLogin = async () => {
    try {
      if (authContext?.loginAsSupervisor) {
        await authContext.loginAsSupervisor();
      } else if (authContext?.switchDemoAccount) {
        authContext.switchDemoAccount('admin');
      }
      showToast('تم تفعيل وتأكيد جلسة المشرف العام (مأمون أنعم - mamonpfmp@gmail.com) بنجاح!');
    } catch (e) {
      console.error(e);
      showToast('تعذر تسجيل دخول المشرفين.');
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    if (authContext?.logout) {
      await authContext.logout();
    }
    navigate('/login');
  };

  // تصفية والبحث في المستخدمين
  const filteredUsers = users.filter((u) => {
    const query = searchTerm.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      (u.phone && u.phone.includes(query));
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* الشريط العلوي (Header) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* الشعار وعنوان المنظومة */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">لوحة تحكم المشرفين</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    إدارة المستخدمين والصلاحيات (CRUD)
                  </span>
                </div>
                <span className="text-xs text-gray-500">نظام إدارة مؤشرات الأداء (MOF KPIs) · وزارة المالية</span>
              </div>
            </div>

            {/* أزرار الإجراءات السريعة */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* زر تسجيل دخول المشرفين */}
              <button
                type="button"
                onClick={handleSupervisorLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 cursor-pointer shadow-xs"
                title="تسجيل دخول المشرف العام المباشر (مأمون أنعم)"
              >
                <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>تسجيل دخول المشرفين</span>
              </button>

              <Link
                to="/admin/criteria"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
              >
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>إدارة المعايير</span>
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

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* إشعار النجاح والتحديث */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-3 text-xs md:text-sm shadow-xs animate-in fade-in">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* بطاقة الترحيب والأزرار البارزة */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              إدارة مستخدمي النظام والصلاحيات
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              إدارة شاملة لبيانات الموظفين والمهندسين، تعيين الصلاحيات، وإجراء عمليات الإضافة والتعديل والحذف فورياً.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* زر تسجيل دخول المشرفين */}
            <button
              type="button"
              onClick={handleSupervisorLogin}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>تسجيل دخول المشرفين</span>
            </button>

            {/* زر الانتقال إلى إدارة المعايير */}
            <Link
              to="/admin/criteria"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>إدارة المعايير</span>
            </Link>

            {/* زر إضافة مستخدم جديد (يفتح المودال فارغاً) */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>
        </div>

        {/* بطاقات الإحصائيات الأربع */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">إجمالي المستخدمين</span>
            <div className="mt-2 text-2xl font-extrabold text-gray-900 tabular-nums">
              {users.length}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">حسابات مفعلة بالمنظومة</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">المشرفون (Admins)</span>
            <div className="mt-2 text-2xl font-extrabold text-purple-700 tabular-nums">
              {users.filter((u) => u.role === 'super_admin' || u.role === 'admin').length}
            </div>
            <span className="text-[11px] text-purple-600 font-medium mt-1 block">صلاحيات إدارية كاملة</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">مدراء المؤشرات</span>
            <div className="mt-2 text-2xl font-extrabold text-emerald-700 tabular-nums">
              {users.filter((u) => u.role === 'kpi_manager').length}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">إدخال وتقييم التقارير</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block">للاطلاع فقط</span>
            <div className="mt-2 text-2xl font-extrabold text-gray-700 tabular-nums">
              {users.filter((u) => u.role === 'viewer').length}
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">استعراض ومراقبة</span>
          </div>
        </div>

        {/* شريط البحث وتصفية الصلاحيات */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
              placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الجوال..."
              className="w-full text-xs md:text-sm pr-9 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 font-semibold whitespace-nowrap">تصفية حسب الدور:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">كافة الصلاحيات</option>
              <option value="super_admin">مشرف عام</option>
              <option value="admin">مشرف نظام</option>
              <option value="kpi_manager">مدير مؤشرات</option>
              <option value="viewer">للاطلاع فقط</option>
            </select>
          </div>
        </div>

        {/* جدول المستخدمين الموسع (CRUD Operations) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-900">سجل المستخدمين والصلاحيات</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                {filteredUsers.length} مستخدم
              </span>
            </div>
            <span className="text-xs text-gray-400">انقر على "تعديل" لتعديل بيانات أي مستخدم مباشرة</span>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-bold text-gray-600">لا يوجد مستخدمون مطابقون لمعايير البحث</p>
              <button
                onClick={() => { setSearchTerm(''); setFilterRole('all'); }}
                className="mt-2 text-xs text-blue-600 hover:underline"
              >
                إعادة ضبط البحث والتصفية
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold">
                  <tr>
                    <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الاسم</th>
                    <th scope="col" className="py-3.5 px-6 whitespace-nowrap">البريد الإلكتروني</th>
                    <th scope="col" className="py-3.5 px-6 whitespace-nowrap">رقم الجوال</th>
                    <th scope="col" className="py-3.5 px-6 whitespace-nowrap">الصلاحية / الدور</th>
                    <th scope="col" className="py-3.5 px-6 whitespace-nowrap">تاريخ الإضافة</th>
                    <th scope="col" className="py-3.5 px-6 text-center whitespace-nowrap">الإجراءات (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* الاسم */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{u.name}</div>
                            <span className="text-[10px] text-gray-400 font-mono">ID: #{u.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* البريد الإلكتروني */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-gray-700">
                        {u.email}
                      </td>

                      {/* رقم الجوال */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-gray-600" dir="ltr">
                        {u.phone ? `+967 ${u.phone}` : '—'}
                      </td>

                      {/* الصلاحية */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* تاريخ الإضافة */}
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-gray-500 tabular-nums">
                        {u.date}
                      </td>

                      {/* الإجراءات: تعديل (معبأ مسبقاً) / حذف */}
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                            title="تعديل بيانات المستخدم بالكامل"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>تعديل</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                            title="حذف المستخدم نهائياً"
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

      </main>

      {/* ========================================================================= */}
      {/* النافذة المنبثقة الديناميكية الموحدة: إضافة / تعديل مستخدم                  */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* ترويسة النافذة المنبثقة (ديناميكية حسب الوضع) */}
            <div className={`px-6 py-4 text-white flex items-center justify-between ${
              modalMode === 'add' ? 'bg-blue-600' : 'bg-slate-900'
            }`}>
              <div className="flex items-center gap-2">
                {modalMode === 'add' ? (
                  <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )}
                <h3 className="text-base font-bold">
                  {modalMode === 'add' ? 'إضافة مستخدم جديد للنظام' : `تعديل بيانات المستخدم: ${formData.name}`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* النموذج الديناميكي (مشترك للإضافة والتعديل) */}
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-2 animate-in fade-in">
                  <span className="text-base">⚠️</span>
                  <span>{modalError}</span>
                </div>
              )}
              
              {/* حقل الاسم الكامل */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="مثال: م. رضوان الحكيمي"
                  className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* حقل البريد الإلكتروني */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@mof.gov.ye"
                  dir="ltr"
                  className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              {/* حقل رقم الجوال */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    رقم الجوال
                  </label>
                  <span className="text-[11px] text-gray-400">أرقام فقط</span>
                </div>
                <div className="relative flex rounded-lg shadow-xs">
                  <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-xs font-mono font-bold select-none" dir="ltr">
                    🇾🇪 +967
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="77xxxxxxx"
                    inputMode="numeric"
                    dir="ltr"
                    className="flex-1 min-w-0 block w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-none rounded-l-lg text-right font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* حقل كلمة المرور (إلزامي في الإضافة، اختياري في التعديل) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {modalMode === 'add' ? (
                    <>كلمة المرور الافتراضية <span className="text-red-500">*</span></>
                  ) : (
                    <>كلمة المرور الجديدة <span className="text-gray-400 font-normal">(اتركها فارغة للإبقاء على الحالية)</span></>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  required={modalMode === 'add'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={modalMode === 'add' ? '••••••••' : 'اترك الحقل فارغاً إذا كنت لا ترغب بتغييرها'}
                  dir="ltr"
                  className="w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* القائمة المنسدلة لاختيار الصلاحية / الدور */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  الصلاحية / الدور (Role) <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full text-xs md:text-sm border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="viewer">للاطلاع فقط (Viewer)</option>
                  <option value="kpi_manager">مدير مؤشرات (KPI Manager)</option>
                  <option value="admin">مشرف نظام (Admin)</option>
                  <option value="super_admin">مشرف عام (Super Admin)</option>
                </select>
              </div>

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
                  className={`px-5 py-2 text-xs md:text-sm font-bold text-white rounded-lg shadow-sm transition-colors cursor-pointer ${
                    modalMode === 'add'
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {modalMode === 'add' ? 'حفظ المستخدم الجديد' : 'حفظ التعديلات'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
