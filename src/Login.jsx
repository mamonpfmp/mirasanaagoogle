/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let authContext = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // يعمل كـ Standalone component إذا استُخدم خارج AuthProvider
  }

  // تبويب طريقة تسجيل الدخول: 'email' (البريد الإلكتروني) أو 'phone' (رقم الجوال)
  const [loginMethod, setLoginMethod] = useState('email');

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSupervisorLoading, setIsSupervisorLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  // معالجة تغيير قيم حقول الإدخال مع التحقق الفوري للأرقام في حقل الجوال
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // التأكد الصارم من أن حقل الجوال يقبل أرقاماً فقط (إزالة أي حروف أو رموز خاصة)
      const numericOnly = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        phone: numericOnly.slice(0, 14), // حد أقصى مناسب لأرقام الهواتف
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errorMessage) setErrorMessage('');
  };

  // التحقق من صحة المدخلات بناءً على الطريقة المختارة
  const validateForm = () => {
    if (loginMethod === 'email') {
      if (!formData.email.trim()) {
        setErrorMessage('يرجى إدخال البريد الإلكتروني.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setErrorMessage('صيغة البريد الإلكتروني غير صحيحة (مثال: name@mof.gov.ye).');
        return false;
      }
    } else {
      if (!formData.phone.trim()) {
        setErrorMessage('يرجى إدخال رقم الجوال.');
        return false;
      }
      // التحقق من أن رقم الجوال يحتوي على أرقام فقط
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        setErrorMessage('رقم الجوال يجب أن يحتوي على أرقام فقط دون حروف أو رموز.');
        return false;
      }
      if (formData.phone.trim().length < 9) {
        setErrorMessage('يرجى إدخال رقم جوال صحيح (9 أرقام على الأقل، مثال: 771234567).');
        return false;
      }
    }

    if (!formData.password) {
      setErrorMessage('يرجى إدخال كلمة المرور.');
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage('يجب ألا تقل كلمة المرور عن 6 خانات.');
      return false;
    }

    return true;
  };

  // معالجة تسجيل الدخول (سواء بالبريد أو برقم الجوال)
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    const credential = loginMethod === 'email' ? formData.email.trim() : formData.phone.trim();

    try {
      if (authContext?.login) {
        await authContext.login(credential, formData.password, loginMethod);
      } else {
        // محاكاة طلب API لتسجيل الدخول
        await new Promise((resolve) => setTimeout(resolve, 1100));
        console.log(`تم تسجيل الدخول بنجاح عبر [${loginMethod}]:`, credential);
      }

      setSuccessMessage('تم تسجيل الدخول بنجاح! جاري تحويلك...');
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 700);
    } catch (err) {
      console.error('خطأ في تسجيل الدخول:', err);
      let msg = 'تعذر تسجيل الدخول. يرجى التأكد من صحة البيانات المدخلة وكلمة المرور.';
      if (err.message?.includes('Invalid login credentials')) {
        msg = loginMethod === 'email'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
          : 'رقم الجوال أو كلمة المرور غير صحيحة.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // معالجة تسجيل الدخول باستخدام جوجل (OAuth)
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsGoogleLoading(true);

    try {
      if (authContext?.loginWithGoogle) {
        await authContext.loginWithGoogle();
        if (!authContext.isSupabaseConfigured) {
          navigate(redirectPath, { replace: true });
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setSuccessMessage('تمت المصادقة عبر Google بنجاح!');
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 800);
      }
    } catch (err) {
      console.error('خطأ تسجيل الدخول بواسطة Google:', err);
      setErrorMessage('تعذر الاتصال بخدمة Google. يرجى المحاولة لاحقاً.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // معالجة تسجيل دخول المشرفين المباشر (Super Admin - مأمون أنعم)
  const handleSupervisorLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSupervisorLoading(true);

    try {
      if (authContext?.loginAsSupervisor) {
        await authContext.loginAsSupervisor();
      } else if (authContext?.switchDemoAccount) {
        authContext.switchDemoAccount('admin');
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      setSuccessMessage('تم تسجيل الدخول بصلاحية المشرف العام (مأمون أنعم) بنجاح! جاري التحويل...');
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 700);
    } catch (err) {
      console.error('خطأ في تسجيل دخول المشرفين:', err);
      setErrorMessage('تعذر تسجيل دخول المشرفين. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSupervisorLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
        
        {/* ترويسة النموذج والشعار */}
        <div className="text-center mb-6">
          <div className="mx-auto h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
            {/* أيقونة نظام إدارة مؤشرات الأداء */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            نظام إدارة مؤشرات الأداء
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 font-medium">
            وزارة المالية · الإدارة العامة للتشغيل والصيانة (AFMIS)
          </p>
        </div>

        {/* تنبيه رسالة الخطأ */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
            <svg
              className="w-4 h-4 shrink-0 text-red-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed font-medium">{errorMessage}</span>
          </div>
        )}

        {/* تنبيه رسالة النجاح */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
            <svg
              className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        {/* زر تسجيل دخول المشرفين (Super Admin) المباشر والمميز */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleSupervisorLogin}
            disabled={isLoading || isGoogleLoading || isSupervisorLoading}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:via-indigo-800 hover:to-blue-800 text-white text-xs md:text-sm font-bold shadow-md shadow-purple-600/20 active:scale-[0.99] transition-all cursor-pointer group disabled:opacity-60"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                {isSupervisorLoading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <div className="text-right">
                <span className="block leading-tight font-extrabold text-sm">تسجيل دخول المشرفين</span>
                <span className="text-[10px] text-purple-200 font-normal">المشرف العام · مأمون أنعم (AFMIS)</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] bg-white/20 px-2.5 py-1 rounded-lg font-semibold text-white group-hover:bg-white/30 transition-colors">
              <span>دخول مباشر</span>
              <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </button>
        </div>

        {/* زر الدخول بواسطة Google OAuth المستقل */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading || isSupervisorLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-xl bg-white text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {isGoogleLoading ? (
              <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>متابعة باستخدام حساب Google</span>
          </button>

          {/* الفاصل البصري */}
          <div className="relative mt-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">
                أو تسجيل الدخول اليدوي
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* التبويبات الذكية للتبديل بين (البريد الإلكتروني) و (رقم الجوال)              */}
        {/* ========================================================================= */}
        <div className="mb-4">
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/80">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                if (errorMessage) setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'email'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200/50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span>البريد الإلكتروني</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                if (errorMessage) setErrorMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                loginMethod === 'phone'
                  ? 'bg-white text-blue-700 shadow-xs border border-gray-200/50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>رقم الجوال</span>
            </button>
          </div>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmitLogin} className="space-y-4">
          
          {/* الحالة 1: حقل البريد الإلكتروني */}
          {loginMethod === 'email' ? (
            <div className="animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-gray-700 mb-1.5 text-right">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@mof.gov.ye"
                  dir="ltr"
                  className="w-full text-xs md:text-sm pr-9 pl-3 py-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          ) : (
            /* الحالة 2: حقل رقم الجوال مع التحقق الحصري للأرقام فقط */
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700 text-right">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">أرقام فقط (مثال: 771234567)</span>
              </div>
              <div className="relative flex rounded-lg shadow-xs">
                {/* كود الدولة / رمز الاتصال */}
                <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-xs font-mono font-bold select-none" dir="ltr">
                  🇾🇪 +967
                </span>

                {/* حقل إدخال رقم الجوال المقتصر على الأرقام */}
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="7xxxxxxxx"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  dir="ltr"
                  className="flex-1 min-w-0 block w-full text-xs md:text-sm px-3 py-2.5 border border-gray-300 rounded-none rounded-l-lg text-right font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>
            </div>
          )}

          {/* حقل كلمة المرور المشترك */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-700">
                كلمة المرور <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setErrorMessage('يرجى مراجعة إدارة تقنية المعلومات بوزارة المالية لإعادة تعيين كلمة المرور الخاصة بك.')}
                className="text-[11px] text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                dir="ltr"
                className="w-full text-xs md:text-sm pr-9 pl-10 py-2.5 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-hidden"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* خيار تذكر الحساب */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
              <span>تذكر بيانات تسجيل الدخول</span>
            </label>
          </div>

          {/* زر تسجيل الدخول مع مؤشر التحميل */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading || isSupervisorLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs md:text-sm font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>جارٍ تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        {/* الملاحظات الأمنية التذييلية */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
          <p>بوابة الدخول الموحدة لأنظمة وزارة المالية</p>
          <p className="mt-0.5 font-medium">الجمهورية اليمنية · نظام AFMIS</p>
        </div>

      </div>
    </div>
  );
};

export default Login;
