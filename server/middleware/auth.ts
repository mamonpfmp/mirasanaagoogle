/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// سر توكن JWT المخزن في متغيرات البيئة
const JWT_SECRET = process.env.JWT_SECRET || 'afmis-super-secure-jwt-secret-key-2026';

// تمديد واجهة Request لتضمين كائن المستخدم
export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'user';
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * برمجية وسيطة (JWT Guard) للتحقق من صحة وصلاحية توكن الدخول
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح: يرجى تسجيل الدخول وإرفاق توكن المصادقة (Bearer Token).',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'غير مصرح: لم يتم توفير التوكن في رأس الطلب.',
      });
      return;
    }

    // التحقق من صحة التوكن وفك تشفيره
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'انتهت صلاحية جلسة الدخول (Token Expired)، يرجى تسجيل الدخول مجدداً.',
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: 'رمز التحقق غير صالح أو تم التلاعب به.',
    });
  }
}

/**
 * برمجية وسيطة للتأكد من أن المستخدم يمتلك صلاحيات المشرف أو مدير النظام
 */
export function requireAdminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'غير مصرح: المستخدم غير مسجل دخول.',
    });
    return;
  }

  // السماح للمشرفين ومديري النظام فقط
  if (req.user.role !== 'admin' && req.user.role !== 'supervisor') {
    res.status(403).json({
      success: false,
      message: 'غير مسموح: هذه العملية تتطلب صلاحيات المشرف العام أو مدير النظام.',
    });
    return;
  }

  next();
}

/**
 * دالة مساعدة لتوليد توكن JWT للمستخدمين بعد نجاح تسجيل الدخول
 */
export function generateToken(user: AuthenticatedUser): string {
  const options: jwt.SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any,
  };

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    JWT_SECRET,
    options
  );
}
