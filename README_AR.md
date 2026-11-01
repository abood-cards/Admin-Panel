# Karty Admin V2.1
في النشر الموحد: تبنى من جذر الحزمة وتستخدم VITE_API_URL=/api/v1؛ Express يقدم الملفات من نفس أصل API. لا ترفع مفاتيح Backend في بيئة اللوحة.

في نشر Static مستقل: Root Directory=Admin-Panel، Build=npm ci --include=dev && npm run build، Publish Directory=dist. المتغير الوحيد المطلوب: VITE_API_URL=https://YOUR-REAL-API.onrender.com/api/v1. أضف Rewrite /* إلى /index.html واضبط CORS_ORIGINS في Backend على أصل رابط اللوحة. لا تقبل عملية البناء عنواناً تجريبياً أو localhost للإنتاج.

تغيير VITE_API_URL يتطلب إعادة البناء، وليس مجرد إعادة تشغيل الخادم. راجع README.md الرئيسي للتفاصيل وتهيئة الأدمن.
