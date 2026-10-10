# دليل النشر والإطلاق (Deployment Guide)

## 1. الإعداد الأولي ومستودع GitHub
تأكد من أن ملف `.env` غير مدرج في المستودع (مدرج بالفعل في `.gitignore`):
```bash
git status
git push origin master
```

## 2. النشر على منصة Vercel
1. ادخل إلى لوحة تحكم [Vercel](https://vercel.com) واضغط على **Add New Project**.
2. اربط مستودع GitHub الخاص بهذا المشروع (`Engagement invitation`).
3. اختر الإعداد المسبق **Vite** (سيتم اكتشافه تلقائياً).
4. في قسم **Environment Variables**، أضف المتغيرات التالية:
   - `VITE_SUPABASE_URL`: رابط مشروع Supabase الخاص بك.
   - `VITE_SUPABASE_ANON_KEY`: المفتاح العام (anon key) الخاص بالمشروع.
5. اضغط **Deploy**.
6. تم تضمين ملف `vercel.json` لإعادة توجيه كافة المسارات (بما فيها `/admin`) تلقائياً إلى `index.html`.

## 3. إعداد قاعدة بيانات Supabase
قم بتشغيل الاستعلام التالي في **SQL Editor** داخل Supabase:
```sql
-- جدول رسائل الضيوف
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz default now()
);

-- تفعيل حماية Row Level Security
alter table messages enable row level security;

-- السماح للضيوف بإرسال رسائل التهنئة فقط
create policy "guests can insert" on messages
  for insert to anon with check (true);

-- السماح لحساب الأدمن فقط بقراءة الرسائل
create policy "admin can read" on messages
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');

-- السماح لحساب الأدمن فقط بحذف الرسائل
create policy "admin can delete" on messages
  for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL');
```
*ملاحظة: استبدل `YOUR_ADMIN_EMAIL` بالبريد الإلكتروني الخاص بك.*

ثم من قائمة **Authentication -> Users**:
1. أنشئ مستخدماً واحداً ببريدك الإلكتروني وكلمة مرورك.
2. عطل التسجيل العام (Disable public sign-ups) في إعدادات Supabase Auth.
3. أضف رابط موقعك في Vercel إلى **Redirect URLs**.

## 4. فحص ما قبل الإطلاق النهائي
- [ ] استبدال البيانات التقديرية في `src/config.js` (أسماء العروسين، التاريخ بدقة، رابط خرائط Google).
- [ ] إضافة ملفات الميديا الحقيقية في `public/assets/` (الموسيقى `music.mp3` والمؤثرات `sfx/`).
- [ ] اختبار فتح الدعوة من رابط تجريبي على هاتف محمول.
