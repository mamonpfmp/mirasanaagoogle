/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import { generateToken, authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * ============================================================================
 * مسار تسجيل الدخول المزدوج (البريد الإلكتروني أو رقم الجوال)
 * POST /api/auth/login
 * ============================================================================
 * يقبل المدخلات إما:
 * 1. { identifier, password } حيث يكون identifier إما بريداً أو جوالاً
 * 2. { email, password }
 * 3. { phone, password }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, email, phone, password } = req.body;

    const loginId = (identifier || email || phone || '').toString().trim();

    if (!loginId) {
      res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني أو رقم الجوال للمتابعة.',
      });
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة المرور.',
      });
      return;
    }

    // تنظيف رقم الجوال من الرموز والمسافات إن وجد
    const cleanPhone = loginId.replace(/[^\d+]/g, '');

    // استعلام البحث عن المستخدم بواسطة البريد الإلكتروني أو رقم الجوال
    const sql = `
      SELECT id, name, email, phone, role, password_hash, created_at
      FROM users 
      WHERE LOWER(email) = LOWER($1) 
         OR phone = $1 
         OR phone = $2
      LIMIT 1
    `;

    let user: any = null;

    try {
      const result = await query(sql, [loginId, cleanPhone]);
      if (result.rows.length > 0) {
        user = result.rows[0];
      }
    } catch (dbErr: any) {
      console.warn('⚠️ تعذر الاستعلام المباشر من قاعدة البيانات:', dbErr.message);
      // في حال عدم توفر اتصال Cloud SQL المحلي، نتيح حساب المشرف الافتراضي للاختبار
      if (loginId.toLowerCase() === 'mamonpfmp@gmail.com' || loginId === '967777000111') {
        user = {
          id: 1,
          name: 'مأمون علي محسن أنعم',
          email: 'mamonpfmp@gmail.com',
          phone: '967777000111',
          role: 'admin',
          // تجزئة كلمة المرور: Admin@123456
          password_hash: '$2a$10$w3Ue2M8dI2O/4.9ySgH/6.GjO27Hw1Uq5fE.dCgD37IbmZ0s.eKCy',
          created_at: new Date().toISOString(),
        };
      }
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد/الجوال وكلمة المرور.',
      });
      return;
    }

    // مطابقة كلمة المرور باستخدام خوارزمية bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة. يرجى التأكد من كلمة المرور.',
      });
      return;
    }

    // إصدار توكن JWT الآمن
    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    // استبعاد تجزئة كلمة المرور من بيانات الاستجابة
    const { password_hash, ...safeUserData } = user;

    res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
      token,
      user: safeUserData,
    });
  } catch (error: any) {
    console.error('❌ خطأ في مسار تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ داخلي في الخادم أثناء معالجة تسجيل الدخول.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * مسار تسجيل مستخدم جديد
 * POST /api/auth/register
 * ============================================================================
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role = 'user' } = req.body;

    // التحقق من الحقول الإلزامية
    if (!name || !email || !phone || !password) {
      res.status(400).json({
        success: false,
        message: 'كافة الحقول مطلوبة: (الاسم، البريد الإلكتروني، رقم الجوال، كلمة المرور).',
      });
      return;
    }

    // التحقق من تنسيق الجوال (يقبل أرقام فقط مع علامة + اختيارية)
    const phoneRegex = /^[+]?[\d]{7,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      res.status(400).json({
        success: false,
        message: 'رقم الجوال غير صحيح، يجب أن يتكون من أرقام فقط (7-15 خانة).',
      });
      return;
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingCheck = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1) OR phone = $2 LIMIT 1',
      [email.trim(), phone.trim()]
    );

    if (existingCheck.rows.length > 0) {
      res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني أو رقم الجوال مسجل مسبقاً في النظام.',
      });
      return;
    }

    // تشفير كلمة المرور بواسطة bcrypt (10 جولات salt)
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // إدراج المستخدم الجديد في قاعدة بيانات PostgreSQL
    const insertSql = `
      INSERT INTO users (name, email, phone, role, password_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role, created_at
    `;

    const result = await query(insertSql, [
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      role,
      password_hash,
    ]);

    const newUser = result.rows[0];
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح.',
      token,
      user: newUser,
    });
  } catch (error: any) {
    console.error('❌ خطأ في مسار التسجيل:', error);
    res.status(500).json({
      success: false,
      message: 'تعذر إنشاء الحساب، يرجى المحاولة لاحقاً.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * مسار جلب بيانات المستخدم المسجل حالياً
 * GET /api/auth/me
 * ============================================================================
 */
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const result = await query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء جلب بيانات المستخدم.',
      error: error.message,
    });
  }
});

export default router;
