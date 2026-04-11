<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>طلب انضمام جديد</title>
    <style>
        body {
            margin: 0;
            padding: 24px;
            background: #fff7ed;
            font-family: Tahoma, Arial, sans-serif;
            color: #1e293b;
            line-height: 1.7;
        }
        .shell {
            max-width: 720px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
        }
        .hero {
            padding: 28px 32px;
            background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
            color: #ffffff;
        }
        .hero h1 {
            margin: 0;
            font-size: 28px;
        }
        .hero p {
            margin: 8px 0 0;
            opacity: 0.92;
            font-size: 15px;
        }
        .content {
            padding: 32px;
        }
        .card {
            background: #fffaf5;
            border: 1px solid #fed7aa;
            border-radius: 16px;
            padding: 20px;
        }
        .row {
            padding: 12px 0;
            border-bottom: 1px solid #fed7aa;
        }
        .row:last-child {
            border-bottom: none;
        }
        .label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            color: #c2410c;
            margin-bottom: 4px;
        }
        .value {
            font-size: 15px;
            color: #1e293b;
            word-break: break-word;
        }
        .notes {
            margin-top: 20px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 18px;
        }
        .button {
            display: inline-block;
            margin-top: 18px;
            padding: 12px 18px;
            border-radius: 12px;
            background: #f97316;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
        }
        .footer {
            padding: 18px 32px 28px;
            color: #64748b;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="shell">
        <div class="hero">
            <h1>طلب انضمام جديد</h1>
            <p>تم استلام طلب جديد للانضمام إلى فريق التدريس في منصة Kid Coder.</p>
        </div>

        <div class="content">
            <div class="card">
                <div class="row">
                    <span class="label">الاسم الكامل</span>
                    <div class="value">{{ $application->full_name }}</div>
                </div>
                <div class="row">
                    <span class="label">البريد الإلكتروني</span>
                    <div class="value">{{ $application->email }}</div>
                </div>
                <div class="row">
                    <span class="label">رقم الهاتف</span>
                    <div class="value">{{ $application->phone ?: 'غير مضاف' }}</div>
                </div>
                <div class="row">
                    <span class="label">الوظيفة المطلوبة</span>
                    <div class="value">{{ $application->position_label }}</div>
                </div>
                <div class="row">
                    <span class="label">حالة الطلب</span>
                    <div class="value">{{ $application->status }}</div>
                </div>
            </div>

            <div class="notes">
                <span class="label">ملاحظات إضافية</span>
                <div class="value">{{ $application->notes ?: 'لا توجد ملاحظات إضافية.' }}</div>
                @if($application->cv_url)
                    <a href="{{ $application->cv_url }}" class="button" target="_blank" rel="noopener noreferrer">تحميل السيرة الذاتية</a>
                @endif
            </div>
        </div>

        <div class="footer">
            تم إرسال هذا البريد تلقائيًا من صفحة "انضم لنا" بتاريخ {{ now()->format('Y-m-d H:i') }}.
        </div>
    </div>
</body>
</html>
