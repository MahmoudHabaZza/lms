import { useForm, usePage } from '@inertiajs/react';
import { Check, Mail, Palette, Save, Settings, Share2, Upload } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import AdminLayout from '../layouts/admin-layout';

type Setting = {
    id: number;
    key: string;
    value: string;
    type: string;
    group: string;
};

type Props = {
    settings: Record<string, Setting[]>;
};

const groupIcons: Record<string, any> = {
    general: Settings,
    colors: Palette,
    social: Share2,
    mail: Mail,
};

const groupLabels: Record<string, string> = {
    general: 'إعدادات عامة',
    colors: 'الألوان',
    social: 'السوشيال ميديا',
    mail: 'إعدادات البريد',
};

const fieldLabels: Record<string, string> = {
    site_name: 'اسم الموقع',
    font_family: 'خط الموقع',
    site_logo: 'شعار الموقع',
    address: 'العنوان',
    contact_email: 'البريد العام',
    contact_phone: 'رقم التواصل',
    admin_email: 'بريد الإدارة',
    primary_color: 'اللون الأساسي',
    facebook_url: 'رابط فيسبوك',
    instagram_url: 'رابط إنستجرام',
    linkedin_url: 'رابط لينكدإن',
    whatsapp_number: 'رقم واتساب',
    youtube_url: 'رابط يوتيوب',
    booking_notification_email: 'البريد المستلم لطلبات الحجز',
    contact_notification_email: 'البريد المستلم لرسائل التواصل',
    mail_mailer: 'نوع المرسل Mailer',
    mail_host: 'SMTP Host',
    mail_port: 'SMTP Port',
    mail_username: 'اسم المستخدم',
    mail_password: 'كلمة المرور / App Password',
    mail_encryption: 'التشفير',
    mail_from_address: 'From Address',
    mail_from_name: 'From Name',
};

const fieldHints: Record<string, string> = {
    font_family: 'اختر الخط الأساسي الذي سيظهر في الموقع كله ولوحة الأدمن.',
    address: 'العنوان الذي سيظهر في الفوتر وصفحة تواصل معنا.',
    contact_email: 'البريد المعروض للزوار في التوب بار والفوتر وصفحة التواصل.',
    contact_phone: 'رقم التواصل المعروض للزوار ويمكن استخدامه للاتصال أو واتساب.',
    facebook_url: 'ضع الرابط الكامل لصفحة فيسبوك.',
    instagram_url: 'ضع الرابط الكامل لحساب إنستجرام.',
    linkedin_url: 'ضع الرابط الكامل لصفحة لينكدإن.',
    whatsapp_number: 'اكتب رقم واتساب بصيغة دولية مثل 2010xxxxxxx.',
    youtube_url: 'ضع الرابط الكامل لقناة يوتيوب.',
    booking_notification_email: 'كل طلب حجز جديد سيتم إرساله إلى هذا البريد.',
    contact_notification_email: 'كل رسالة جديدة من صفحة تواصل معنا سيتم إرسالها إلى هذا البريد.',
    mail_mailer: 'غالباً استخدم smtp. ويمكنك استخدام log أثناء التجربة.',
    mail_host: 'مثال: smtp.gmail.com أو mail.yourdomain.com',
    mail_port: 'أمثلة شائعة: 587 لـ TLS أو 465 لـ SSL',
    mail_username: 'غالباً نفس البريد المرسل منه.',
    mail_password: 'في Gmail استخدم App Password وليس كلمة المرور العادية.',
    mail_encryption: 'اتركها tls أو ssl حسب مزود البريد.',
    mail_from_address: 'البريد الظاهر كمرسل للرسائل.',
    mail_from_name: 'الاسم الظاهر للمستلم.',
};

const hiddenSettingKeys = new Set([
    'homepage_primary_color',
    'homepage_secondary_color',
]);

const fontOptions = [
    { value: 'playpen_arabic', label: 'Playpen Sans Arabic' },
    { value: 'marhey', label: 'Marhey' },
    { value: 'fredoka', label: 'Fredoka' },
    { value: 'instrument_sans', label: 'Instrument Sans' },
];

function getInputType(setting: Setting) {
    if (setting.type === 'color') return 'color';
    if (setting.key.includes('password')) return 'password';
    if (setting.key.includes('email')) return 'email';
    if (setting.key.includes('port')) return 'number';
    if (setting.key.includes('url')) return 'url';

    return 'text';
}

export default function SettingsIndex({ settings }: Props) {
    const page = usePage();
    const url = page.url ?? '';
    const activeGroup = useMemo(() => {
        const params = new URLSearchParams(url.split('?')[1] ?? '');
        const group = params.get('group');
        return group && settings[group] ? group : null;
    }, [settings, url]);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoMessage, setLogoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [testEmail, setTestEmail] = useState('');
    const [testingEmail, setTestingEmail] = useState(false);
    const [testMessage, setTestMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const groupedSettings = useMemo(() => {
        if (activeGroup) {
            return { [activeGroup]: settings[activeGroup] };
        }

        return settings;
    }, [activeGroup, settings]);

    const { data, setData, post, processing, errors } = useForm({
        settings: Object.values(settings).flat().map((setting) => ({
            key: setting.key,
            value: setting.value ?? '',
        })),
    });
    const formErrors = errors as Record<string, string | undefined>;

    const updateValue = (key: string, value: string) => {
        setData('settings', data.settings.map((setting) => (
            setting.key === key ? { ...setting, value } : setting
        )));
    };

    const getValue = (key: string) => data.settings.find((setting) => setting.key === key)?.value ?? '';

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/admin/settings', {
            preserveScroll: true,
            onSuccess: () => {
                window.location.reload();
            },
        });
    };

    return (
        <AdminLayout title={activeGroup === 'mail' ? 'إعدادات البريد' : 'إعدادات الموقع'}>
            <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {activeGroup === 'mail' ? 'إدارة البريد والإشعارات' : 'إعدادات الموقع'}
                    </h1>
                    <p className="mt-2 text-slate-600">
                        {activeGroup === 'mail'
                            ? 'من هنا تحدد بريد استقبال طلبات الحجز وكل إعدادات SMTP بشكل ديناميكي من لوحة التحكم.'
                            : 'يمكنك تحديث إعدادات الموقع العامة والبريد والسوشيال بدون تعديل الكود.'}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">شعار الموقع</h3>
                            <p className="text-sm text-slate-500">ارفع شعار الموقع من هنا.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-start gap-3">
                                <img
                                    src={logoPreview || settings?.general?.find((setting) => setting.key === 'site_logo')?.value || '/assets/EndUser/images/logo.png'}
                                    alt="logo"
                                    className="h-16 w-auto rounded border border-slate-200 p-2"
                                />
                                {logoMessage && (
                                    <div className={`flex items-center gap-2 text-sm font-medium ${logoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                        {logoMessage.type === 'success' && <Check size={16} />}
                                        {logoMessage.text}
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700">
                                <span className="inline-flex items-center gap-2">
                                    <Upload size={18} />
                                    اختر صورة
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingLogo}
                                    onChange={async (event) => {
                                        const file = event.target.files?.[0];
                                        if (!file) return;

                                        const reader = new FileReader();
                                        reader.onload = (loadEvent) => {
                                            setLogoPreview(loadEvent.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);

                                        setUploadingLogo(true);
                                        setLogoMessage(null);

                                        const formData = new FormData();
                                        formData.append('site_logo', file);

                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                                        try {
                                            const response = await fetch('/admin/settings/logo', {
                                                method: 'POST',
                                                headers: {
                                                    'X-CSRF-TOKEN': token || '',
                                                    Accept: 'application/json',
                                                },
                                                body: formData,
                                            });

                                            const result = await response.json();

                                            if (!response.ok) {
                                                setLogoMessage({ type: 'error', text: result.message || 'فشل رفع الشعار.' });
                                            } else {
                                                setLogoMessage({ type: 'success', text: result.message || 'تم رفع الشعار بنجاح.' });
                                                setLogoPreview(result.path);
                                            }
                                        } catch {
                                            setLogoMessage({ type: 'error', text: 'تعذر رفع الشعار حالياً.' });
                                        } finally {
                                            setUploadingLogo(false);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">اختبار البريد</h3>
                            <p className="text-sm text-slate-500">أرسل رسالة تجريبية للتأكد أن إعدادات SMTP صحيحة.</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(event) => setTestEmail(event.target.value)}
                                placeholder="test@example.com"
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm md:w-72"
                            />
                            <button
                                type="button"
                                disabled={testingEmail}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                                onClick={async () => {
                                    if (!testEmail) {
                                        setTestMessage({ type: 'error', text: 'أدخل بريداً لاختبار الإرسال.' });
                                        return;
                                    }

                                    setTestingEmail(true);
                                    setTestMessage(null);

                                    try {
                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                                        const response = await fetch('/admin/settings/test-email', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': token || '',
                                                Accept: 'application/json',
                                            },
                                            body: JSON.stringify({ to_email: testEmail }),
                                        });

                                        const result = await response.json();
                                        setTestMessage({
                                            type: response.ok ? 'success' : 'error',
                                            text: result.message || (response.ok ? 'تم إرسال الرسالة التجريبية.' : 'فشل إرسال الرسالة التجريبية.'),
                                        });
                                    } catch {
                                        setTestMessage({ type: 'error', text: 'تعذر تنفيذ اختبار البريد حالياً.' });
                                    } finally {
                                        setTestingEmail(false);
                                    }
                                }}
                            >
                                {testingEmail ? 'جاري الإرسال...' : 'إرسال Test Email'}
                            </button>
                        </div>
                    </div>

                    {testMessage && (
                        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm font-medium ${testMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                            {testMessage.text}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {Object.entries(groupedSettings).map(([group, groupSettings]) => {
                        const Icon = groupIcons[group] || Settings;

                        return (
                            <div key={group} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                                    <Icon className="text-slate-500" size={20} />
                                    <h2 className="text-lg font-semibold text-slate-800">{groupLabels[group] || group}</h2>
                                </div>
                                <div className="grid gap-6 p-6 md:grid-cols-2">
                                    {groupSettings
                                        .filter((setting) => !hiddenSettingKeys.has(setting.key))
                                        .map((setting) => {
                                        const inputType = getInputType(setting);
                                        const errorKey = `settings.${data.settings.findIndex((item) => item.key === setting.key)}.value`;

                                        return (
                                            <div key={setting.key} className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">
                                                    {fieldLabels[setting.key] || setting.key.replace(/_/g, ' ')}
                                                </label>

                                                {setting.key === 'font_family' ? (
                                                    <select
                                                        value={getValue(setting.key)}
                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                    >
                                                        {fontOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : inputType === 'color' ? (
                                                    <div className="flex gap-3">
                                                        <input
                                                            type="color"
                                                            value={getValue(setting.key)}
                                                            onChange={(event) => updateValue(setting.key, event.target.value)}
                                                            className="h-11 w-20 rounded-lg border border-slate-200 p-1"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={getValue(setting.key)}
                                                            onChange={(event) => updateValue(setting.key, event.target.value)}
                                                            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                        />
                                                    </div>
                                                ) : setting.key === 'mail_mailer' ? (
                                                    <select
                                                        value={getValue(setting.key)}
                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                    >
                                                        <option value="smtp">smtp</option>
                                                        <option value="log">log</option>
                                                        <option value="sendmail">sendmail</option>
                                                        <option value="array">array</option>
                                                    </select>
                                                ) : setting.key === 'mail_encryption' ? (
                                                    <select
                                                        value={getValue(setting.key)}
                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                    >
                                                        <option value="">بدون تشفير</option>
                                                        <option value="tls">tls</option>
                                                        <option value="ssl">ssl</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={inputType}
                                                        value={getValue(setting.key)}
                                                        onChange={(event) => updateValue(setting.key, event.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                                                    />
                                                )}

                                                {fieldHints[setting.key] && (
                                                    <p className="text-xs leading-6 text-slate-500">{fieldHints[setting.key]}</p>
                                                )}

                                                {formErrors[errorKey] && (
                                                    <p className="text-xs text-red-600">{formErrors[errorKey]}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
