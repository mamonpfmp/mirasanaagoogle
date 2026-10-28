/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const AuthContext = createContext(null);

// Default Demo profiles for offline preview / fallback
export const DEMO_USERS = {
  admin: {
    id: 'demo-admin-id-01',
    email: 'mamonpfmp@gmail.com',
    user_metadata: { full_name: 'مأمون علي محسن أنعم' },
    role: 'admin',
    jobTitle: 'مشرف النظام المالي (AFMIS)',
  },
  user: {
    id: 'demo-user-id-02',
    email: 'engineer@afmis.gov.ye',
    user_metadata: { full_name: 'م. رضوان عبدالله الحكيمي' },
    role: 'user',
    jobTitle: 'مهندس تشغيل نظم وقواعد بيانات',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch role from Supabase 'profiles' table
  const fetchUserRole = async (userId, userEmail) => {
    if (!isSupabaseConfigured) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error fetching role from profiles table:', error.message);
      }

      if (data && data.role) {
        setRole(data.role);
        setProfile(data);
      } else {
        // Fallback default role: admin if email is mamonpfmp@gmail.com or starts with admin, otherwise user
        const isSuperAdminEmail = userEmail?.toLowerCase() === 'mamonpfmp@gmail.com';
        const defaultRole = (isSuperAdminEmail || userEmail?.includes('admin')) ? 'admin' : 'user';
        setRole(defaultRole);
        setProfile({
          id: userId,
          email: userEmail,
          role: defaultRole,
          full_name: isSuperAdminEmail ? 'مأمون علي محسن أنعم' : (userEmail?.split('@')[0] || 'مستخدم المنظومة'),
        });
      }
    } catch (err) {
      console.error('Failed to retrieve user profile:', err);
      setRole('user');
    }
  };

  useEffect(() => {
    // Check if demo user is stored in localStorage
    const savedDemo = localStorage.getItem('afmis_demo_auth_session');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setRole(parsed.role);
        setProfile(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse saved demo auth', e);
      }
    }

    if (isSupabaseConfigured) {
      // 1. Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id, session.user.email);
        } else {
          setRole(null);
          setProfile(null);
        }
        setLoading(false);
      });

      // 2. Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id, currentSession.user.email);
        } else {
          setRole(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // By default start with demo admin user so the preview is immediately active
      const defaultDemo = DEMO_USERS.admin;
      setUser(defaultDemo);
      setRole(defaultDemo.role);
      setProfile(defaultDemo);
      localStorage.setItem('afmis_demo_auth_session', JSON.stringify(defaultDemo));
      setLoading(false);
    }
  }, []);

  // Standard Email / Phone and Password Login
  const login = async (identifier, password, method = 'email') => {
    setLoading(true);

    const isPhone = method === 'phone' || /^\+?\d{7,15}$/.test(identifier.trim());
    const cleanIdentifier = identifier.trim();

    if (isSupabaseConfigured) {
      const credentials = isPhone
        ? { phone: cleanIdentifier, password }
        : { email: cleanIdentifier, password };

      const { data, error } = await supabase.auth.signInWithPassword(credentials);

      if (error) {
        setLoading(false);
        throw error;
      }

      setSession(data.session);
      setUser(data.user);
      await fetchUserRole(data.user.id, data.user.email || cleanIdentifier);
      setLoading(false);
      return data;
    } else {
      // Demo authentication simulation
      await new Promise((res) => setTimeout(res, 350));
      const isSuperAdmin =
        cleanIdentifier.toLowerCase() === 'mamonpfmp@gmail.com' ||
        cleanIdentifier === '777000000' ||
        cleanIdentifier.toLowerCase().includes('admin');

      const chosenRole = isSuperAdmin ? 'admin' : 'user';
      const userEmail = cleanIdentifier.includes('@')
        ? cleanIdentifier
        : `${cleanIdentifier}@mof.gov.ye`;

      const mockUser = {
        id: `user-${Date.now()}`,
        email: userEmail,
        phone: isPhone ? cleanIdentifier : '',
        user_metadata: {
          full_name: cleanIdentifier.includes('@')
            ? cleanIdentifier.split('@')[0]
            : `مستخدم جوال (${cleanIdentifier})`,
        },
        role: chosenRole,
        jobTitle: chosenRole === 'admin' ? 'مشرف النظام المالي (AFMIS)' : 'مهندس تشغيل نظم',
      };
      setUser(mockUser);
      setRole(chosenRole);
      setProfile(mockUser);
      localStorage.setItem('afmis_demo_auth_session', JSON.stringify(mockUser));
      setLoading(false);
      return { user: mockUser };
    }
  };

  // Sign in with Google (OAuth)
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Demo OAuth simulation
      await new Promise((res) => setTimeout(res, 300));
      const googleUser = {
        id: 'google-oauth-user-id',
        email: 'user.google@afmis.gov.ye',
        user_metadata: { full_name: 'مستخدم حساب Google' },
        role: 'user',
        jobTitle: 'مهندس تشغيل معتمد',
      };
      setUser(googleUser);
      setRole('user');
      setProfile(googleUser);
      localStorage.setItem('afmis_demo_auth_session', JSON.stringify(googleUser));
      return { user: googleUser };
    }
  };

  // Direct Supervisor (Super Admin) Login for mamonpfmp@gmail.com
  const loginAsSupervisor = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    const supervisorUser = {
      id: 'super-admin-mamon-01',
      email: 'mamonpfmp@gmail.com',
      user_metadata: { full_name: 'مأمون علي محسن أنعم' },
      role: 'super_admin',
      jobTitle: 'مشرف النظام المالي (AFMIS)',
    };
    setUser(supervisorUser);
    setRole('super_admin');
    setProfile(supervisorUser);
    localStorage.setItem('afmis_demo_auth_session', JSON.stringify(supervisorUser));
    setLoading(false);
    return supervisorUser;
  };

  // Switch demo account directly (useful for testing Admin vs User dashboards)
  const switchDemoAccount = (targetRole) => {
    const demo = DEMO_USERS[targetRole] || DEMO_USERS.user;
    setUser(demo);
    setRole(demo.role);
    setProfile(demo);
    localStorage.setItem('afmis_demo_auth_session', JSON.stringify(demo));
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    localStorage.removeItem('afmis_demo_auth_session');
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error signing out:', err);
      }
    }
    setUser(null);
    setRole(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        profile,
        session,
        loading,
        login,
        loginWithGoogle,
        loginAsSupervisor,
        logout,
        switchDemoAccount,
        isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
