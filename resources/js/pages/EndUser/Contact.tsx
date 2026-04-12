import { Head, usePage } from '@inertiajs/react';
import { Loader2, Mail, MapPin, MessageSquareText, Phone, Send, Sparkles, UserRound } from 'lucide-react';
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

    const contactEmail = settings?.contact_email?.trim() ?? '';
    const contactPhone = settings?.contact_phone?.trim() ?? '';
    const contactAddress = settings?.address?.trim() ?? '';

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

    const inputClass = (field: string) =>
        `w-full rounded-2xl border-2 px-5 py-4 text-base outline-none transition-all duration-300 focus:ring-4 ${
            errors[field]
                ? 'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 bg-white hover:border-orange-200 focus:border-orange-400 focus:ring-orange-100'
        }`;

    return (
        <MainLayout>
            <Head title="تواصل معنا" />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50/30 text-right">
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-100/30 blur-3xl" />

                <section className="relative pb-12 pt-28 sm:pt-32">
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-bold text-orange-700">
                            <Sparkles size={16} />
                            نحب نسمع منك
                        </div>
                        <h1 className="mt-5 font-playpen-arabic text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            تواصل معنا
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-500">
                            عندك سؤال أو استفسار؟ ابعتلنا رسالة وهنرد عليك بأسرع وقت.
                        </p>
                    </div>
                </section>

                {(contactEmail || contactPhone || contactAddress) && (
                    <section className="relative mt-4">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-3">
                                {contactEmail && (
                                    <a
                                        href={`mailto:${contactEmail}`}
                                        className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-orange-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                                            <Mail size={24} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">البريد الإلكتروني</h3>
                                        <span className="text-sm text-slate-500 transition-colors group-hover:text-orange-600">{contactEmail}</span>
                                    </a>
                                )}

                                {contactPhone && (
                                    <a
                                        href={`tel:${contactPhone}`}
                                        className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-sky-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                                            <Phone size={24} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">رقم التواصل</h3>
                                        <span dir="ltr" className="text-sm text-slate-500 transition-colors group-hover:text-sky-600">{contactPhone}</span>
                                    </a>
                                )}

                                {contactAddress && (
                                    <div className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-emerald-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                                            <MapPin size={24} />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-800">العنوان</h3>
                                        <span className="text-sm leading-6 text-slate-500">{contactAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                <section className="relative py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl">
                            <div className="rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-xl sm:p-12">
                                <div className="mb-10 text-center">
                                    <h2 className="text-2xl font-extrabold text-slate-800 sm:text-3xl">ابعتلنا رسالتك</h2>
                                    <p className="mt-2 text-sm text-slate-400">الحقول المطلوبة مُعلّمة بـ <span className="text-red-400">*</span></p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-7">
                                    {submitMessage && (
                                        <div
                                            className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-sm font-semibold sm:text-base ${
                                                submitMessage.type === 'success'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-red-200 bg-red-50 text-red-700'
                                            }`}
                                        >
                                            <span className="text-xl">{submitMessage.type === 'success' ? '✓' : '!'}</span>
                                            {submitMessage.message}
                                        </div>
                                    )}

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <UserRound size={16} className="text-orange-500" />
                                                الاسم <span className="text-red-400">*</span>
                                            </label>
                                            <input type="text" value={formData.name} onChange={(e) => handleFieldChange('name', e.target.value)} placeholder="اكتب اسمك الكامل" className={inputClass('name')} />
                                            {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Mail size={16} className="text-orange-500" />
                                                البريد الإلكتروني <span className="text-red-400">*</span>
                                            </label>
                                            <input type="email" value={formData.email} onChange={(e) => handleFieldChange('email', e.target.value)} placeholder="example@email.com" dir="ltr" className={inputClass('email')} />
                                            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Phone size={16} className="text-orange-500" />
                                                رقم الهاتف
                                                <span className="text-xs text-slate-400">(اختياري)</span>
                                            </label>
                                            <input type="tel" value={formData.phone} onChange={(e) => handleFieldChange('phone', e.target.value)} placeholder="01XXXXXXXXX" dir="ltr" className={inputClass('phone')} />
                                            {errors.phone && <p className="text-xs font-medium text-red-500">{errors.phone}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                <Send size={16} className="text-orange-500" />
                                                موضوع الرسالة <span className="text-red-400">*</span>
                                            </label>
                                            <input type="text" value={formData.subject} onChange={(e) => handleFieldChange('subject', e.target.value)} placeholder="مثال: استفسار عن الكورسات" className={inputClass('subject')} />
                                            {errors.subject && <p className="text-xs font-medium text-red-500">{errors.subject}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <MessageSquareText size={16} className="text-orange-500" />
                                            الرسالة <span className="text-red-400">*</span>
                                        </label>
                                        <textarea value={formData.message} onChange={(e) => handleFieldChange('message', e.target.value)} rows={5} placeholder="اكتب رسالتك هنا..." className={inputClass('message')} />
                                        {errors.message && <p className="text-xs font-medium text-red-500">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`group inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-extrabold text-white shadow-lg transition-all duration-300 ${
                                            isSubmitting
                                                ? 'cursor-not-allowed bg-slate-400 shadow-none'
                                                : 'bg-gradient-to-l from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98]'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={22} className="animate-spin" />
                                                جاري الإرسال...
                                            </>
                                        ) : (
                                            <>
                                                إرسال الرسالة
                                                <Send size={20} className="transition-transform duration-300 group-hover:-translate-x-1" />
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-2 text-center text-xs leading-6 text-slate-400">
                                        بالضغط على إرسال، سيتم توجيه رسالتك لفريق الدعم للرد عليك في أقرب وقت.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
