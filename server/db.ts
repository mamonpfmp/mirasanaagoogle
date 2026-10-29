/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

/**
 * ============================================================================
 * إعداد الاتصال بقاعدة بيانات Google Cloud SQL (PostgreSQL)
 * ============================================================================
 * يوفر Google Cloud SQL طريقتين رئيسيتين للاتصال:
 * 
 * 1. الاتصال المباشر عبر TCP / عنوان IP العام أو الخاص (أو عبر Cloud SQL Auth Proxy):
 *    - DB_HOST: عنوان خادم Cloud SQL أو 127.0.0.1 عند استخدام Cloud SQL Proxy.
 *    - DB_PORT: المنفذ الافتراضي لـ PostgreSQL هو 5432.
 *    - DB_USER: اسم مستخدم قاعدة البيانات (مثل: postgres أو afmis_user).
 *    - DB_PASSWORD: كلمة مرور المستخدم المحمية بمتغيرات البيئة.
 *    - DB_NAME: اسم قاعدة البيانات (مثل: afmis_db).
 *    - DB_SSL: 'true' لفرض التشفير التام SSL/TLS في بيئة الإنتاج.
 * 
 * 2. الاتصال عبر Unix Domain Socket (المستخدم تلقائياً في Google Cloud Run / App Engine):
 *    - المسار: /cloudsql/PROJECT_ID:REGION:INSTANCE_NAME
 *    - يتم تمرير INSTANCE_CONNECTION_NAME عبر متغيرات البيئة.
 */

const isProduction = process.env.NODE_ENV === 'production';

// إعداد تكوين حوض الاتصالات (Connection Pool)
const poolConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'afmis_db',
  max: parseInt(process.env.DB_POOL_MAX || '20', 10), // أقصى عدد من الاتصالات المتزامنة
  idleTimeoutMillis: 30000, // مهلة إغلاق الاتصال الخامل (30 ثانية)
  connectionTimeoutMillis: 10000, // مهلة انتظار الاتصال قبل حدوث خطأ (10 ثوانٍ)
};

// تحديد مسار الاتصال: إما عبر Unix Socket (Cloud Run) أو عبر TCP (IP/Proxy)
if (process.env.INSTANCE_CONNECTION_NAME) {
  // الاتصال عبر مسار Unix Socket الخاص بـ Google Cloud SQL
  poolConfig.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
} else {
  // الاتصال عبر TCP (IP / Local Proxy)
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = parseInt(process.env.DB_PORT || '5432', 10);

  // إعداد شهادات وتشفير SSL للاتصالات الآمنة مع Cloud SQL
  if (process.env.DB_SSL === 'true' || isProduction) {
    poolConfig.ssl = {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
      // يمكن تزويد شهادة CA من Google Cloud إذا تم تحديدها
      ...(process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT } : {}),
    };
  }
}

// إنشاء مثيل حوض الاتصالات
export const pool = new Pool(poolConfig);

// مراقبة أحداث الاتصال والأخطاء
pool.on('connect', () => {
  console.log('✅ تم فتح اتصال جديد مع قاعدة بيانات Google Cloud SQL (PostgreSQL)');
});

pool.on('error', (err: Error) => {
  console.error('❌ خطأ غير متوقع في حوض اتصالات PostgreSQL:', err.message);
});

/**
 * دالة مساعدة لتنفيذ استعلامات SQL مع تتبع زمني ومعالجة الأخطاء
 * @param text نص استعلام SQL
 * @param params المعاملات الآمنة لحماية الاستعلام من هجمات SQL Injection
 */
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.DEBUG_SQL === 'true') {
      console.log('⚡ تم تنفيذ الاستعلام:', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error: any) {
    console.error('❌ خطأ أثناء تنفيذ استعلام SQL:', {
      query: text,
      message: error.message,
    });
    throw error;
  }
}

/**
 * فحص جاهزية الاتصال بقاعدة البيانات (Health Check)
 */
export async function testConnection(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT NOW() AS current_time, current_database() AS db_name');
    console.log(`📡 الاتصال بقاعدة البيانات ${res.rows[0].db_name} نشط ومستقر في: ${res.rows[0].current_time}`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ تعذر الاتصال بـ Cloud SQL (${error.message}). تحقق من متغيرات البيئة.`);
    return false;
  }
}
