/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db';
import { authMiddleware, requireAdminMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// تطبيق الحماية على جميع مسارات إدارة المستخدمين
// تتطلب وجود توكن صالح + صلاحيات مشرف (Admin/Supervisor)
router.use(authMiddleware);
router.use(requireAdminMiddleware);

/**
 * ============================================================================
 * 1. استرجاع قائمة جميع المستخدمين مع إمكانية البحث والفلترة
 * GET /api/users
 * ============================================================================
 */
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search, role } = req.query;

    let sql = `
      SELECT id, name, email, phone, role, created_at, updated_at
      FROM users
      WHERE 1=1
    `;
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone LIKE $${params.length})`;
    }

    if (role && role !== 'all') {
      params.push(role);
      sql += ` AND role = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('❌ خطأ أثناء استرجاع المستخدمين:', error);
    res.status(500).json({
      success: false,
      message: 'تعذر جلب قائمة المستخدمين من قاعدة البيانات.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * 2. استرجاع مستخدم محدد بواسطة المعرف (ID)
 * GET /api/users/:id
 * ============================================================================
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `المستخدم بالمعرف (${id}) غير موجود في النظام.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'تعذر جلب بيانات المستخدم.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * 3. إضافة مستخدم جديد للنظام من قبل المشرف
 * POST /api/users
 * ============================================================================
 */
router.post('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, role = 'user', password } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({
        success: false,
        message: 'الحقول التالية إلزامية: الاسم، البريد، رقم الجوال، وكلمة المرور.',
      });
      return;
    }

    // التحقق من تكرار البريد أو الجوال
    const checkDuplicate = await query(
      'SELECT id, email, phone FROM users WHERE LOWER(email) = LOWER($1) OR phone = $2 LIMIT 1',
      [email.trim(), phone.trim()]
    );

    if (checkDuplicate.rows.length > 0) {
      const match = checkDuplicate.rows[0];
      const isEmail = match.email.toLowerCase() === email.trim().toLowerCase();
      res.status(409).json({
        success: false,
        message: isEmail
          ? 'البريد الإلكتروني مستخدم بالفعل لمستخدم آخر.'
          : 'رقم الجوال مسجل بالفعل لمستخدم آخر.',
      });
      return;
    }

    // تشفير كلمة المرور
    const password_hash = await bcrypt.hash(password, 10);

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

    res.status(201).json({
      success: true,
      message: 'تمت إضافة المستخدم بنجاح.',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('❌ خطأ أثناء إنشاء المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'فشلت عملية إضافة المستخدم.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * 4. تعديل بيانات مستخدم موجود
 * PUT /api/users/:id
 * ============================================================================
 */
router.put('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password } = req.body;

    // التحقق من وجود المستخدم
    const userCheck = await query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'المستخدم المطلوب تعديله غير موجود.',
      });
      return;
    }

    // التحقق من عدم تكرار البريد أو الهاتف لمستخدم آخر
    if (email || phone) {
      const dupCheck = await query(
        'SELECT id FROM users WHERE (LOWER(email) = LOWER($1) OR phone = $2) AND id != $3 LIMIT 1',
        [email ? email.trim() : '', phone ? phone.trim() : '', id]
      );
      if (dupCheck.rows.length > 0) {
        res.status(409).json({
          success: false,
          message: 'البريد الإلكتروني أو رقم الجوال مستخدم بالفعل من قبل حساب آخر.',
        });
        return;
      }
    }

    // بناء استعلام التحديث ديناميكياً
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name) {
      updates.push(`name = $${idx++}`);
      values.push(name.trim());
    }

    if (email) {
      updates.push(`email = $${idx++}`);
      values.push(email.trim().toLowerCase());
    }

    if (phone) {
      updates.push(`phone = $${idx++}`);
      values.push(phone.trim());
    }

    if (role) {
      updates.push(`role = $${idx++}`);
      values.push(role);
    }

    if (password && password.trim().length > 0) {
      const password_hash = await bcrypt.hash(password, 10);
      updates.push(`password_hash = $${idx++}`);
      values.push(password_hash);
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);
    const updateSql = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${idx}
      RETURNING id, name, email, phone, role, created_at, updated_at
    `;

    const result = await query(updateSql, values);

    res.status(200).json({
      success: true,
      message: 'تم تحديث بيانات المستخدم بنجاح.',
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('❌ خطأ أثناء تعديل المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'فشلت عملية تعديل المستخدم.',
      error: error.message,
    });
  }
});

/**
 * ============================================================================
 * 5. حذف مستخدم من النظام
 * DELETE /api/users/:id
 * ============================================================================
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;

    // حماية: منع المشرف من حذف حسابه الشخصي مباشرة
    if (parseInt(id, 10) === currentUserId) {
      res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الشخصي النشط حالياً لدواعي الأمان.',
      });
      return;
    }

    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود أو تم حذفه مسبقاً.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `تم حذف حساب المستخدم (${result.rows[0].name}) بنجاح.`,
      deletedUser: result.rows[0],
    });
  } catch (error: any) {
    console.error('❌ خطأ أثناء حذف المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'تعذر حذف المستخدم لوجود ارتباطات في النظام.',
      error: error.message,
    });
  }
});

export default router;
