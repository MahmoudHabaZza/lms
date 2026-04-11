import { Head, usePage } from '@inertiajs/react';
import { Headphones, Loader2, Mail, MapPin, MessageSquareText, Phone, Send, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import MainLayout from './layouts/master';

type ContactFormData = {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
};

const initialForm: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
};

export default function Contact() {
    const { settings } = usePage<any>().props;
    const [formData, setFormData] = useState<ContactFormData>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const contactEmail = settings?.contact_email ?? 'info@example.com';
    const contactPhone = settings?.contact_phone ?? '+201234567890';
    const contactAddress = settings?.address ?? 'القاهرة، مصر';

    const handleFieldChange = (name: keyof ContactFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'يرجى إدخال الاسم.';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'يرجى إدخال البريد الإلكتروني.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
        }

        if (formData.phone.trim() && !/^[0-9+\s().-]{8,20}$/.test(formData.phone.trim())) {
            newErrors.phone = 'يرجى إدخال رقم هاتف صحيح.';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'يرجى إدخال موضوع الرسالة.';
        } else if (formData.subject.trim().length < 3) {
            newErrors.subject = 'الموضوع قصير جدًا.';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'يرجى كتابة الرسالة.';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'الرسالة قصيرة جدًا.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setSubmitMessage({
                type: 'error',
                message: 'يرجى مراجعة البيانات المطلوبة قبل الإرسال.',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim(),
                }),
            });

            let result: any = null;
            try {
                result = await response.json();
            } catch {
                result = null;
            }

            if (!response.ok) {
                if (result?.errors && typeof result.errors === 'object') {
                    const mappedErrors: Record<string, string> = {};
                    Object.keys(result.errors).forEach((field) => {
                        mappedErrors[field] = result.errors[field]?.[0] ?? 'بيانات غير صحيحة.';
                    });
                    setErrors(mappedErrors);
                }

                setSubmitMessage({
                    type: 'error',
                    message: result?.message || 'تعذر إرسال الرسالة حاليًا. حاول مرة أخرى.',
                });
                return;
            }

            setSubmitMessage({
                type: 'success',
                message: result?.message || 'تم إرسال رسالتك بنجاح، وسيتم التواصل معك في أقرب وقت.',
            });
            setFormData(initialForm);
            setErrors({});
        } catch {
            setSubmitMessage({
                type: 'error',
                message: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة بعد قليل.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <Head title="تواصل معنا" />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 text-right">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,111,3,0.2),_rgba(255,255,255,0.3)_45%,_rgba(255,255,255,0.7)_100%)]"></div>

                <section className="relative container mx-auto px-4 pt-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                            <div className="text-center">
                                <h1
                                    className="font-playpen-arabic text-4xl font-extrabold tracking-tight text-[var(--color-color-primary)] sm:text-5xl md:text-6xl"
                                    aria-label="تواصل معنا بسهولة"
                                >
                                    تواصل معنا بسهولة
                                </h1>
                                <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                                    لو عندك أي استفسار عن الكورسات أو المواعيد أو طريقة التقديم، ابعت لنا رسالتك وسنرد عليك في أقرب وقت.
                                </p>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-center">
                                    <Mail className="mx-auto h-7 w-7 text-orange-600" />
                                    <h2 className="mt-3 text-sm font-black text-slate-900 sm:text-base">البريد الإلكتروني</h2>
                                    <a href={`mailto:${contactEmail}`} className="mt-2 block text-sm font-medium text-slate-600 hover:text-orange-600">
                                        {contactEmail}
                                    </a>
                                </div>

                                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-center">
                                    <Phone className="mx-auto h-7 w-7 text-orange-600" />
                                    <h2 className="mt-3 text-sm font-black text-slate-900 sm:text-base">رقم التواصل</h2>
                                    <a href={`tel:${contactPhone}`} dir="ltr" className="mt-2 block text-sm font-medium text-slate-600 hover:text-orange-600">
                                        {contactPhone}
                                    </a>
                                </div>

                                <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-center">
                                    <MapPin className="mx-auto h-7 w-7 text-orange-600" />
                                    <h2 className="mt-3 text-sm font-black text-slate-900 sm:text-base">العنوان</h2>
                                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{contactAddress}</p>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-slate-200 pt-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {submitMessage && (
                                        <div
                                            className={`rounded-2xl border px-5 py-4 text-sm font-semibold sm:text-base lg:text-lg ${
                                                submitMessage.type === 'success'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-red-200 bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {submitMessage.message}
                                        </div>
                                    )}

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                        <div className="flex items-center gap-3 text-slate-700">
                                            <Headphones size={20} className="text-orange-600" />
                                            <p className="text-sm font-semibold sm:text-base">
                                                الرسالة دي هتتبعت مباشرة على البريد المخصص لرسائل التواصل في إعدادات الموقع.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <UserRound size={18} className="text-orange-600" />
                                                الاسم
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                                placeholder="اكتب الاسم بالكامل"
                                                className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
                                                    errors.name
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                                        : 'border-slate-200 bg-white focus:border-orange-400 focus:ring-orange-100'
                                                }`}
                                            />
                                            {errors.name && <p className="text-sm font-medium text-red-600">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <Mail size={18} className="text-orange-600" />
                                                البريد الإلكتروني
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                                placeholder="example@email.com"
                                                dir="ltr"
                                                className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
                                                    errors.email
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                                        : 'border-slate-200 bg-white focus:border-orange-400 focus:ring-orange-100'
                                                }`}
                                            />
                                            {errors.email && <p className="text-sm font-medium text-red-600">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <Phone size={18} className="text-orange-600" />
                                                رقم الهاتف
                                                <span className="text-xs font-semibold text-slate-500">(اختياري)</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                dir="ltr"
                                                className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
                                                    errors.phone
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                                        : 'border-slate-200 bg-white focus:border-orange-400 focus:ring-orange-100'
                                                }`}
                                            />
                                            {errors.phone && <p className="text-sm font-medium text-red-600">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <Send size={18} className="text-orange-600" />
                                                موضوع الرسالة
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.subject}
                                                onChange={(e) => handleFieldChange('subject', e.target.value)}
                                                placeholder="مثال: استفسار عن مواعيد الكورسات"
                                                className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
                                                    errors.subject
                                                        ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                                        : 'border-slate-200 bg-white focus:border-orange-400 focus:ring-orange-100'
                                                }`}
                                            />
                                            {errors.subject && <p className="text-sm font-medium text-red-600">{errors.subject}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                            <MessageSquareText size={18} className="text-orange-600" />
                                            الرسالة
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => handleFieldChange('message', e.target.value)}
                                            rows={6}
                                            placeholder="اكتب تفاصيل استفسارك هنا..."
                                            className={`w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
                                                errors.message
                                                    ? 'border-red-300 bg-red-50 focus:ring-red-200'
                                                    : 'border-slate-200 bg-white focus:border-orange-400 focus:ring-orange-100'
                                            }`}
                                        />
                                        {errors.message && <p className="text-sm font-medium text-red-600">{errors.message}</p>}
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-black text-white transition-all duration-200 ${
                                                isSubmitting
                                                    ? 'cursor-not-allowed bg-slate-400'
                                                    : 'bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg hover:from-orange-700 hover:to-orange-800 hover:shadow-xl active:scale-[0.98]'
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    جاري إرسال الرسالة...
                                                </>
                                            ) : (
                                                'إرسال الرسالة'
                                            )}
                                        </button>

                                        <p className="mt-4 text-center text-xs leading-6 text-slate-500 sm:text-sm lg:text-base">
                                            بالضغط على زر الإرسال، يتم إرسال بياناتك إلى إدارة الأكاديمية للرد على استفسارك في أقرب وقت.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
