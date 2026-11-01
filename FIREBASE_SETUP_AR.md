# تفعيل Push باستخدام Firebase — اختياري

هذا الإعداد لا يخص OTP: رمز الحساب تسلمه الإدارة يدوياً. بدونFirebase يعمل صندوق الإشعارات الدائم وSocket والطلبات والدفع.

## المشروع والتطبيقان
في https://console.firebase.google.com أنشئ مشروعك أو اختر مشروعاً قائماً، ثم أضف تطبيقَيAndroid بهويتيهما الحاليتين:
- Retailer: `com.karty.mobile.pos`.
- Owner: `com.karty.mobile.owner`.

من إعدادات كل تطبيق استخرج appId وapiKey وmessagingSenderId وprojectId. هذه قيم تهيئة عامة وليست مفتاح خدمة خاصاً. استخدم مشروعFirebase واحداً للتطبيقين ليكفي حساب خدمة واحد في الخادم.

## بناء الهاتف
انسخ firebase.config.example.json إلىfirebase.config.json محلياً لكل تطبيق، ثم أدخل قيمه الصحيحة. لا تضع Service Account فيه.
```
flutter pub get
flutter build apk --debug --dart-define-from-file=firebase.config.json
```
الملف يحتوي API_URL وFIREBASE_APP_ID وFIREBASE_API_KEY وFIREBASE_SENDER_ID وFIREBASE_PROJECT_ID. يجب اختلافAPP_ID بين التطبيقين وفق تسجيلAndroid الخاص بكل منهما.

يقرأDart هذه القيم ويقرأهاGradle منdart-defines لإنشاء google_app_id وgcm_defaultSenderId وgoogle_api_key وproject_id. لذلك لا نحتاج تضمينgoogle-services.json الخاص بحسابك أوإضافةGoogleServicesGradlePlugin. البناء بلا الملف يشغل التطبيق بلاPush. إذا بنيت بأمر قديم دون هذه القيم فلا تتوقع تفعيلPush.

## مفتاح الخادم السري
Firebase Console > Project Settings > Service accounts > Generate new private key. احفظJSON كسر، ثم ضع محتواه فيFIREBASE_SERVICE_ACCOUNT_JSON ضمنEnvironment لخدمةBackend علىRender.

احفظprivate_key معالهروب\n كما فيJSON. عند الاستيراد من.env استعمل JSON مضغوطاً بسطر واحد؛ منواجهةRender يمكن لصق القيمةJSON مباشرة. لا ترفع مفتاح الخدمة إلىGitHub أوVITE أوFlutter. تأكد منتمكينFirebase Cloud Messaging API HTTPv1 وصلاحيةحسابالخدمة للإرسال.

الخادم يوقعOAuth باستخدامRSA ويرسلHTTPv1 الرسمي. لاFirestore ولاRealtime Database ولاFirebase PhoneAuth مطلوبان. قيمةالتوكن يرفعها التطبيق تلقائياً بعدالدخول والتحقق ومنح الأذونات، ولا يدخلها البائع يدوياً.

## التجربة الحية المطلوبة
1. افتح التطبيق المبني بالتهيئة مرة واحدة، وسجل الدخول وأكملOTP واسمح بالإشعارات.
2. نفذ حدثاً منالحساب الآخر:طلب كروت،مراجعة دفع،أوإعلان شبكة.
3. أثناء الفتح:يعرضSocket/FCM إشعاراً محلياً بمعرف ثابت لتقليل التكرار.
4. بالخلفية/الإغلاق العادي:Android يعرضnotification،والضغط عليها يفتحInbox بعدفتح القفل إن كانمفعلاً.
5. إذاكان الجهاز غيرمتصل،تجدالرسائل فيالصندوقعندالعودة. إذاكانتRender نائمة يتأخر عامل الإرسال حتى تستأنف الخدمة.

الأذونات والبطارية وGooglePlayServices والإنترنت تؤثر علىالوصول. Android Force-stop منالإعدادات يمنع الرسائل حتىيفتح المستخدم التطبيق يدوياً. لايوجد ضمان تسليمأوexactly-once. الرسائلالعامةقدتظهر علىشاشةالقفل إذا سمح المستخدم،فاضبط خصوصيةAndroid المناسبة.

اختبرناالنقل بالتوقيع وHTTP بمحاكاة فقط،ولم نرسل رسائل منحسابكم. المراجع:
https://firebase.google.com/docs/cloud-messaging/flutter/receive
https://firebase.google.com/docs/admin/setup
