import { Head, usePage } from '@inertiajs/react';
import { BriefcaseBusiness, FileText, Loader2, Mail, MessageSquareText, Phone, UserRound } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import MainLayout from './layouts/master';

type PositionOption = {
    value: string;
    label: string;
};

type JoinUsFormData = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    position: string;
    cv: File | null;
    notes: string;
};

const initialForm: JoinUsFormData = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    cv: null,
    notes: '',
};

export default function JoinUs({ positions = [] }: { positions?: PositionOption[] }) {
    const { settings } = usePage<{ settings?: Record<string, string | null | undefined> }>().props;
    const [formData, setFormData] = useState<JoinUsFormData>(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [fileInputKey, setFileInputKey] = useState(0);
    const joinUsBadge = settings?.join_us_badge?.trim() || 'فرصة للانضمام إلى فريقنا';
    const joinUsTitle = settings?.join_us_title?.trim() || 'انضم لنا وشارك الأطفال رحلة تعلم البرمجة';
    const joinUsSubtitle = settings?.join_us_subtitle?.trim() || 'إذا كنت تمتلك شغف التعليم وصناعة تجربة عربية ممتعة للأطفال، يمكنك إرسال طلبك الآن وسنراجع بياناتك بعناية.';
    const joinUsFormTitle = settings?.join_us_form_title?.trim() || 'أرسل طلب الانضمام';

    const clearFieldError = (field: keyof JoinUsFormData) => {
        if (!errors[field]) {
            return;
        }

        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    const handleFieldChange = (field: keyof JoinUsFormData, value: string | File | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        clearFieldError(field);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleFieldChange('cv', event.target.files?.[0] ?? null);
    };

    const validateForm = (): boolean => {
        const nextErrors: Record<string, string> = {};

        if (!formData.first_name.trim()) {
            nextErrors.first_name = 'يرجى إدخال الاسم الأول.';
        }

        if (!formData.last_name.trim()) {
            nextErrors.last_name = 'يرجى إدخال الاسم الأخير.';
        }

        if (!formData.email.trim()) {
            nextErrors.email = 'يرجى إدخال البريد الإلكتروني.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = 'يرجى إدخال بريد إلكتروني صحيح.';
        }

        if (formData.phone.trim() && !/^[0-9+\s().-]{8,20}$/.test(formData.phone.trim())) {
            nextErrors.phone = 'يرجى إدخال رقم هاتف صحيح.';
        }

        if (!formData.position) {
            nextErrors.position = 'يرجى اختيار الوظيفة المتاحة.';
        }

        if (!formData.cv) {
            nextErrors.cv = 'يرجى رفع السيرة الذاتية.';
        } else {
            const allowedExtensions = ['pdf', 'doc', 'docx'];
            const extension = formData.cv.name.split('.').pop()?.toLowerCase() ?? '';

            if (!allowedExtensions.includes(extension)) {
                nextErrors.cv = 'يجب أن تكون السيرة الذاتية بصيغة PDF أو DOC أو DOCX.';
            } else if (formData.cv.size > 5 * 1024 * 1024) {
                nextErrors.cv = 'حجم ملف السيرة الذاتية يجب ألا يتجاوز 5 ميجابايت.';
            }
        }

        if (formData.notes.trim().length > 2000) {
            nextErrors.notes = 'الملاحظات الإضافية طويلة جدًا.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialForm);
        setErrors({});
        setFileInputKey((prev) => prev + 1);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setSubmitMessage({
                type: 'error',
                message: 'يرجى مراجعة البيانات المطلوبة قبل إرسال الطلب.',
            });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        const payload = new FormData();
        payload.append('first_name', formData.first_name.trim());
        payload.append('last_name', formData.last_name.trim());
        payload.append('email', formData.email.trim());
        payload.append('position', formData.position);
        payload.append('cv', formData.cv as File);

        if (formData.phone.trim()) {
            payload.append('phone', formData.phone.trim());
        }

        if (formData.notes.trim()) {
            payload.append('notes', formData.notes.trim());
        }

        try {
            const response = await fetch('/join-us', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: payload,
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
                    message: result?.message || 'تعذر إرسال الطلب حاليًا. حاول مرة أخرى.',
                });
                return;
            }

            setSubmitMessage({
                type: 'success',
                message: result?.message || 'تم إرسال طلبك بنجاح، سيتم التواصل معك قريبًا',
            });
            resetForm();
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
            <Head title={joinUsTitle} />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_45%,#fff1e6_100%)] text-right">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--site-primary-color)_18%,transparent),transparent_42%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--site-primary-400)_14%,transparent),transparent_38%)]" />

                <section className="relative container mx-auto px-4 pb-16 pt-32 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-6">
                            <div className="rounded-[32px] border border-orange-100 bg-white/90 p-7 shadow-[0_25px_60px_color-mix(in_srgb,var(--site-primary-color)_14%,transparent)] backdrop-blur">
                                <span className="inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">{joinUsBadge}</span>
                                <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">{joinUsTitle}</h1>
                                <p className="mt-4 text-base leading-8 text-slate-600">{joinUsSubtitle}</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                                <div className="rounded-[28px] border border-orange-100 bg-white/85 p-5 shadow-sm">
                                    <BriefcaseBusiness className="h-8 w-8 text-orange-600" />
                                    <h2 className="mt-3 text-lg font-black text-slate-900">وظائف واضحة</h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">اختر الدور المناسب لك من بين وظائف التدريس أو المساندة أو صناعة المحتوى.</p>
                                </div>
                                <div className="rounded-[28px] border border-orange-100 bg-white/85 p-5 shadow-sm">
                                    <FileText className="h-8 w-8 text-orange-600" />
                                    <h2 className="mt-3 text-lg font-black text-slate-900">رفع سهل للسيرة الذاتية</h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">ارفع ملف السيرة الذاتية مباشرة بصيغ PDF أو DOC أو DOCX حتى يسهل مراجعته بسرعة.</p>
                                </div>
                                <div className="rounded-[28px] border border-orange-100 bg-white/85 p-5 shadow-sm">
                                    <Mail className="h-8 w-8 text-orange-600" />
                                    <h2 className="mt-3 text-lg font-black text-slate-900">متابعة مباشرة</h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">يصل طلبك فورًا إلى الإدارة مع جميع البيانات ورابط تحميل السيرة الذاتية.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[32px] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-8">
                            <div className="mb-8">
                                <h2 className="text-2xl font-black text-slate-900">{joinUsFormTitle}</h2>
                                <p className="mt-2 text-sm leading-7 text-slate-500">املأ البيانات التالية بدقة، وسنقوم بالتواصل معك إذا كان هناك تطابق مع احتياجات الفريق.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {submitMessage && (
                                    <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${submitMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                        {submitMessage.message}
                                    </div>
                                )}

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <UserRound size={18} className="text-orange-600" />
                                            الاسم الأول
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.first_name}
                                            onChange={(event) => handleFieldChange('first_name', event.target.value)}
                                            className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.first_name ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                        />
                                        {errors.first_name && <p className="mt-2 text-sm font-medium text-red-600">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <UserRound size={18} className="text-orange-600" />
                                            الاسم الأخير
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.last_name}
                                            onChange={(event) => handleFieldChange('last_name', event.target.value)}
                                            className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.last_name ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                        />
                                        {errors.last_name && <p className="mt-2 text-sm font-medium text-red-600">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <Mail size={18} className="text-orange-600" />
                                            البريد الإلكتروني
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(event) => handleFieldChange('email', event.target.value)}
                                            className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.email ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                        />
                                        {errors.email && <p className="mt-2 text-sm font-medium text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <Phone size={18} className="text-orange-600" />
                                            رقم الهاتف <span className="text-xs font-semibold text-slate-500">(اختياري)</span>
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(event) => handleFieldChange('phone', event.target.value)}
                                            className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.phone ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                        />
                                        {errors.phone && <p className="mt-2 text-sm font-medium text-red-600">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <BriefcaseBusiness size={18} className="text-orange-600" />
                                        الوظيفة المتاحة
                                    </label>
                                    <select
                                        value={formData.position}
                                        onChange={(event) => handleFieldChange('position', event.target.value)}
                                        className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.position ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                    >
                                        <option value="">اختر الوظيفة المناسبة</option>
                                        {positions.map((position) => (
                                            <option key={position.value} value={position.value}>
                                                {position.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.position && <p className="mt-2 text-sm font-medium text-red-600">{errors.position}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <FileText size={18} className="text-orange-600" />
                                        السيرة الذاتية
                                    </label>
                                    <div className={`rounded-[24px] border-2 border-dashed p-4 transition ${errors.cv ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50/40 hover:border-orange-300'}`}>
                                        <input
                                            key={fileInputKey}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="w-full text-sm text-slate-700 file:ml-3 file:rounded-xl file:border-0 file:bg-orange-600 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-orange-500"
                                        />
                                        <p className="mt-3 text-xs leading-6 text-slate-500">الصيغ المسموحة: PDF / DOC / DOCX بحد أقصى 5 ميجابايت.</p>
                                        {formData.cv && <p className="mt-2 text-sm font-semibold text-slate-700">الملف المختار: {formData.cv.name}</p>}
                                    </div>
                                    {errors.cv && <p className="mt-2 text-sm font-medium text-red-600">{errors.cv}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <MessageSquareText size={18} className="text-orange-600" />
                                        ملاحظات إضافية
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(event) => handleFieldChange('notes', event.target.value)}
                                        rows={5}
                                        className={`w-full rounded-2xl border px-4 py-3 text-right outline-none transition focus:ring-4 ${errors.notes ? 'border-red-300 bg-red-50 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'}`}
                                        placeholder="اكتب نبذة قصيرة عن خبراتك أو المجالات التي تفضل تدريسها."
                                    />
                                    {errors.notes && <p className="mt-2 text-sm font-medium text-red-600">{errors.notes}</p>}
                                </div>

                                <div className="pt-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-black text-white transition ${isSubmitting ? 'cursor-not-allowed bg-slate-400' : 'bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg hover:from-orange-700 hover:to-orange-800 hover:shadow-xl'}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                جاري إرسال الطلب...
                                            </>
                                        ) : (
                                            'إرسال طلب الانضمام'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}

