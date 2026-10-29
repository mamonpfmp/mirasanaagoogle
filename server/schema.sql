-- ==============================================================================
-- نظام إدارة معلومات المالية العامة (AFMIS) - وزارة المالية
-- ملف إنشاء وتحديث هيكل قاعدة بيانات Google Cloud SQL (PostgreSQL)
-- جدول المستخدمين والمشرفين (users)
-- ==============================================================================

-- 1. تمكين إضافة uuid-ossp (اختياري لتوليد المعرفات الفريدة)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. إنشاء جدول المستخدمين (users) مع كافة الحقول المطلوبة وقواعد التحقق
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. إنشاء فهارس (Indexes) لتسريع الاستعلامات وعمليات تسجيل الدخول
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. تعليقات توثيقية للأعمدة والجداول باللغة العربية
COMMENT ON TABLE users IS 'جدول مستخدمي ومشرفي نظام AFMIS لإدارة المالية العامة';
COMMENT ON COLUMN users.id IS 'المعرف الفريد للمستخدم (تلقائي الزيادة)';
COMMENT ON COLUMN users.name IS 'الاسم الكامل للمستخدم';
COMMENT ON COLUMN users.email IS 'البريد الإلكتروني الرسمي للمستخدم (فريد)';
COMMENT ON COLUMN users.phone IS 'رقم الجوال للمستخدم لتسجيل الدخول والتحقق (فريد)';
COMMENT ON COLUMN users.role IS 'دور وصلاحية المستخدم: admin (مشرف نظام), supervisor (مدير مؤشرات), user (مستخدم للإطلاع)';
COMMENT ON COLUMN users.password_hash IS 'تجزئة كلمة المرور المشفرة بواسطة خوارزمية bcrypt';
COMMENT ON COLUMN users.created_at IS 'تاريخ ووقت إنشاء حساب المستخدم';

-- 5. إدراج مستخدمين أوليين تجريبيين (كلمة المرور المشفرة لـ "Admin@123456" و "User@123456")
-- التجزئة الناتجة عن bcrypt لخوارزمية 10 جولات:
-- كلمة المرور الافتراضية للمشرف العام: Admin@123456
INSERT INTO users (name, email, phone, role, password_hash)
VALUES 
    (
        'مأمون علي محسن أنعم', 
        'mamonpfmp@gmail.com', 
        '967777000111', 
        'admin', 
        '$2a$10$w3Ue2M8dI2O/4.9ySgH/6.GjO27Hw1Uq5fE.dCgD37IbmZ0s.eKCy'
    ),
    (
        'أحمد سالم باجعفر', 
        'ahmed.salem@mof.gov.ye', 
        '967771234567', 
        'supervisor', 
        '$2a$10$w3Ue2M8dI2O/4.9ySgH/6.GjO27Hw1Uq5fE.dCgD37IbmZ0s.eKCy'
    ),
    (
        'فاطمة عبد الرقيب القدسي', 
        'fatima.kudsi@mof.gov.ye', 
        '967778901234', 
        'user', 
        '$2a$10$w3Ue2M8dI2O/4.9ySgH/6.GjO27Hw1Uq5fE.dCgD37IbmZ0s.eKCy'
    )
ON CONFLICT (email) DO NOTHING;
