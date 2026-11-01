# Karty Admin V3 — Static Site مستقل على Render

هذا المشروع لا يحتاج تشغيل Backend أو وجوده في مجلد مجاور. لوحة المدير المركزي؛ تطبيق مالك الشبكة مشروع Flutter مختلف.

## نشر مستقل
1. ارفع محتويات Admin-Panel لمستودع Private مستقل. إن بقيت تحت مجلد في monorepo اجعل Root Directory=Admin-Panel، وإلا اتركه فارغاً.
2. Render > New > Static Site، وليس Node Web Service. لا يوجد Start Command في Static Site.
3. Build Command: npm install --include=dev && npm run build
4. Publish Directory: dist
5. المتغير الوحيد الذي تحتاجه للربط:
```
VITE_API_URL=https://backend-428l.onrender.com/api/v1
```
القيمة الافتراضية في الكود هي الرابط أعلاه، والمتغير مرفق في.env.example وrender.admin.env.example. إذا تغيّر عنوان Backend غيّره هنا ثم أعد البناء والنشر، لأنه يُضمّن فيVite وقت البناء.
6. في Redirects/Rewrites أضف Source=/*، Destination=/index.html، Action=Rewrite. Blueprint render.yaml المرفق يضبط ذلك عند النشر به.
7. بعد ظهور رابط Static Site الحقيقي، انسخ **أصله** إلى CORS_ORIGINS في Backend، مثلاً https://karty-admin-abc.onrender.com، ثم أعد نشر Backend. لا تستخدم مثالاً تخمينياً بدل الرابط الفعلي.
8. سجّل دخولك بحساب superadmin الموجود. رقم المدير لا يُستخدم للدخول في تطبيق المالك أو البقالة.

لا تضع MONGODB_URI أو Cloudinary secret أو JWT_SECRET أو CARD_ENCRYPTION_KEY في هذا المشروع أو VITE_*؛ أي متغيرVITE عام في ملفات JavaScript. متغير CORS_ORIGINS مكانه Backend فقط.

تحديث هذا المستودع يعيد بناء هذه اللوحة فقط. تشغيل البناء لا يحتاج npm run build من مجلد أب أو سكربت Root محذوف. تحقق البناء يرفض رابطاً نسبياً /api/v1 أو عنوانYOUR-... في الإنتاج، لتجنب إرسال تسجيل الدخول إلى Static Site نفسه.

## محلياً
npm install ثم npm run dev. أضف http://localhost:5173 إلى CORS_ORIGINS في Backend عند السماح بالتجربة من جهازك. قد يستغرق أول طلب للخادم المجاني وقتاً؛ مهلة Axios100 ثانية.401 يعني بيانات دخول/جلسة،403 صلاحيات، وخطأCORS يعني إعداد أصل اللوحة وليس كلمة مرور.

## اختبار
npm run build — بناء الإنتاج مُختبر. سجله في TEST_RESULTS/admin-build.txt. راجع DELIVERY_REPORT.md لنتائج المرحلة وحدودها.
