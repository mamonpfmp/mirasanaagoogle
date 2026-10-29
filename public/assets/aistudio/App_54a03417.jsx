import React, { useState } from 'react';

// --- مكون شاشة تسجيل الدخول (Login) ---
const Login = ({ onLogin }) => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({ email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(); // تنفيذ دالة الدخول للانتقال للوحة التحكم
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
          <p className="mt-2 text-sm text-gray-600">نظام إدارة مؤشرات الأداء MOF KPIs</p>
        </div>

        <div className="flex p-1 space-x-1 space-x-reverse bg-gray-100 rounded-lg mb-6">
          <button
            onClick={() => setLoginMethod('email')}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${loginMethod === 'email' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            البريد الإلكتروني
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${loginMethod === 'phone' ? 'bg-white text-blue-700 shadow' : 'text-gray-500 hover:text-gray-700'}`}
          >
            رقم الجوال
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {loginMethod === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" placeholder="name@example.com" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
              <input type="tel" name="phone" required maxLength="15" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" placeholder="7X XXX XXXX" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all">
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center border-t border-gray-200 pt-6">
          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all">
             تسجيل الدخول باستخدام Google
          </button>
        </div>
      </div>
    </div>
  );
};

// --- مكون لوحة تحكم المشرفين (AdminDashboard) ---
const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'مأمون علي محسن أنعم', email: 'mamonpfmp@gmail.com', role: 'super_admin', date: '2026-10-28' },
    { id: 2, name: 'سارة خالد', email: 'sara@mof.gov.ye', role: 'kpi_manager', date: '2026-10-25' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [toastMessage, setToastMessage] = useState('');

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user.id);
      setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'viewer' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser ? { ...u, ...formData } : u));
      showToast('تم تعديل بيانات المستخدم بنجاح 👌');
    } else {
      setUsers([{ ...formData, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...users]);
      showToast('تمت إضافة المستخدم بنجاح 👌');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      setUsers(users.filter(u => u.id !== id));
      showToast('تم حذف المستخدم بنجاح!');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin': return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">مشرف عام</span>;
      case 'admin': return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">مشرف نظام</span>;
      case 'kpi_manager': return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">مدير مؤشرات</span>;
      default: return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">للاطلاع فقط</span>;
    }
  };

  return (
    <div className="p-6">
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h1>
            <p className="text-sm text-gray-500 mt-1">نظام إدارة مؤشرات الأداء (MOF KPIs)</p>
          </div>
          <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
            + إضافة مستخدم جديد
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">الإيميل</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">الصلاحية</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-900 font-medium">تعديل</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 font-medium">حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-900">{editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور الافتراضية</label>
                    <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-left" dir="ltr" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصلاحية</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="super_admin">مشرف عام</option>
                    <option value="admin">مشرف نظام</option>
                    <option value="kpi_manager">مدير مؤشرات</option>
                    <option value="viewer">مستخدم (للاطلاع فقط)</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">إلغاء</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">حفظ البيانات</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- مكون إدارة المعايير (CriteriaSettings) ---
const CriteriaSettings = () => {
  const [activeTab, setActiveTab] = useState('kpis');
  
  const [kpiCriteria] = useState([
    { id: 1, name: 'نسبة تحصيل الإيرادات', weight: '40%', target: '95%' },
    { id: 2, name: 'دقة التقارير المالية', weight: '30%', target: '100%' },
  ]);

  const [memberCriteria] = useState([
    { id: 1, name: 'سرعة إنجاز المهام', maxScore: 20 },
    { id: 2, name: 'جودة العمل والانضباط', maxScore: 30 },
  ]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">إعدادات المعايير والتقييم</h1>

        <div className="flex border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('kpis')}
            className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'kpis' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            معايير مؤشرات الأداء (KPIs)
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'members' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            معايير تقييم أداء الأعضاء
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              {activeTab === 'kpis' ? 'قائمة معايير المؤشرات' : 'قائمة معايير الموظفين'}
            </h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + إضافة معيار جديد
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">اسم المعيار</th>
                  {activeTab === 'kpis' ? (
                    <>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الوزن النسبي</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">القيمة المستهدفة</th>
                    </>
                  ) : (
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الدرجة القصوى</th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(activeTab === 'kpis' ? kpiCriteria : memberCriteria).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                    {activeTab === 'kpis' ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.weight}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.target}</td>
                      </>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.maxScore} نقطة</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">تعديل</button>
                      <button className="text-red-600 hover:text-red-900 font-medium">حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- المكون الرئيسي (App) الذي يجمع كل شيء ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl">
      
      {/* شريط التنقل - يظهر فقط إذا لم نكن في شاشة الدخول */}
      {currentScreen !== 'login' && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
                    </svg>
                  </div>
                  <span className="font-bold text-xl text-gray-900 tracking-tight">MOF KPIs</span>
                </div>
                <div className="hidden sm:-my-px sm:mr-8 sm:flex sm:space-x-8 sm:space-x-reverse">
                  <button 
                    onClick={() => setCurrentScreen('admin')} 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentScreen === 'admin' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    لوحة المشرفين
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('criteria')} 
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentScreen === 'criteria' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    إدارة المعايير
                  </button>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button 
                  onClick={() => setCurrentScreen('login')}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* منطقة عرض المكونات */}
      <main className="transition-opacity duration-300">
        {currentScreen === 'login' && <Login onLogin={() => setCurrentScreen('admin')} />}
        {currentScreen === 'admin' && <AdminDashboard />}
        {currentScreen === 'criteria' && <CriteriaSettings />}
      </main>

    </div>
  );
}
