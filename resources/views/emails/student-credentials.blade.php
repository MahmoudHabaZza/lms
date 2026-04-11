<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>بيانات دخول الطالب</title>
</head>
<body style="margin:0;padding:24px;background:#fff7ed;font-family:Tahoma,Arial,sans-serif;color:#1e293b;direction:rtl;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #fed7aa;border-radius:24px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#f97316,#fb923c);padding:24px;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">مرحبًا {{ $student->name }}</h1>
            <p style="margin:12px 0 0;font-size:14px;line-height:1.8;">تم إنشاء حسابك على منصة Kid Coder بنجاح.</p>
        </div>

        <div style="padding:24px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.9;">
                يمكنك الآن تسجيل الدخول والبدء في متابعة الكورسات المخصصة لك.
            </p>

            <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:18px;padding:18px;margin-bottom:20px;">
                <p style="margin:0 0 10px;font-weight:700;">بيانات الدخول</p>
                <p style="margin:0 0 8px;">البريد الإلكتروني: <strong>{{ $student->email }}</strong></p>
                <p style="margin:0 0 8px;">اسم المستخدم: <strong>{{ $student->username }}</strong></p>
                <p style="margin:0;">كلمة المرور: <strong>{{ $plainPassword }}</strong></p>
            </div>

            <p style="margin:0 0 20px;font-size:14px;line-height:1.8;">
                رابط تسجيل الدخول:
            </p>

            <p style="margin:0 0 24px;">
                <a href="{{ $loginLink }}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:14px;font-weight:700;">
                    فتح صفحة تسجيل الدخول
                </a>
            </p>

            <p style="margin:0;font-size:13px;line-height:1.9;color:#64748b;">
                ننصح بتغيير كلمة المرور بعد أول تسجيل دخول للحفاظ على أمان الحساب.
            </p>
        </div>
    </div>
</body>
</html>
