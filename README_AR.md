# لوحة الإدارة المركزية — كرتي V1
React + Vite + Tailwind + Lucide، عربي RTL.
```bash
npm ci
cp .env.example .env
npm run dev
npm run build
```
غيّر VITE_API_URL إلى backend الخاص بك منتهياً بـ /api/v1، واضبط CORS_ORIGINS في الخادم.
الدخول بحساب superadmin الذي ينشأ من npm run seed في Backend. لا حسابات افتراضية.
قائمة الشبكات: التفعيل والخطة وتاريخ الانتهاء. الحسابات: تفعيل وتعطيل. السياسات: فتح التسجيل وحد الحزم وهاتف الدعم.
أرقام الذاكرة والزمن خاصة بعملية Node ولا تمثل استهلاك حصص Render أو Cloudinary.
الواجهة تعرض حتى 200 حساب/شبكة وآخر 100 حدث تدقيق، والبحث محلي في القائمة المحملة.
التخزين في sessionStorage. كل مسارات الإدارة تفرض superadmin على الخادم أيضاً.
