/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import { testConnection } from './db';

// تحميل متغيرات البيئة
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// 1. إعداد البرمجيات الوسيطة للأمان والاتصال (Middlewares)
// ============================================================================

// تفعيل CORS لتمكين واجهة React من الاتصال بالخادم بأمان
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
);

// تحليل حمولات JSON و URL-Encoded
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// تسجيل الطلبات في بيئة التطوير (Request Logger)
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================================
// 2. مسارات النظام (API Endpoints)
// ============================================================================

// فحص الجاهزية والصحة (Health Check)
app.get('/api/health', async (_req: Request, res: Response) => {
  const isDbHealthy = await testConnection();
  res.status(200).json({
    status: 'online',
    system: 'AFMIS Ministry of Finance Backend',
    timestamp: new Date().toISOString(),
    database: isDbHealthy ? 'connected (Google Cloud SQL)' : 'offline / standby',
  });
});

// مسارات المصادقة وتسجيل الدخول
app.use('/api/auth', authRoutes);

// مسارات إدارة المستخدمين والمشرفين (CRUD)
app.use('/api/users', usersRoutes);

// ============================================================================
// 3. معالجة المسارات غير المعرفة ومعالجة الأخطاء الشاملة
// ============================================================================

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `المسار المطلوب غير موجود: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ خطأ داخلي في الخادم:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ داخلي في الخادم.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// تشغيل الخادم إذا تم استدعاؤه بشكل مباشر
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`
====================================================================
🚀 خادم AFMIS Backend يعمل بنجاح على المنفذ: ${PORT}
🔗 الرابط المحلي: http://localhost:${PORT}
🛡️ بيئة التشغيل: ${process.env.NODE_ENV || 'development'}
====================================================================
    `);
    // فحص الاتصال بقاعدة بيانات Cloud SQL عند بدء التشغيل
    testConnection();
  });
}

export default app;
