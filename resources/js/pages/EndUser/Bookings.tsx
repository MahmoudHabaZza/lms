import { Head, usePage } from '@inertiajs/react';
import { Building2, Globe2, Loader2, MapPin, Phone, UserRound } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import MainLayout from './layouts/master';

interface CourseOption {
    id: number;
    title: string;
}

interface CountryOption {
    code: string;
    name: string;
}

interface BookingFormData {
    fullName: string;
    age: string;
    whatsappNumber: string;
    country: string;
    city: string;
    school: string;
    courseId: string;
    isOnline: boolean;
}

const createInitialForm = (preselectedCourseId?: number | null): BookingFormData => ({
    fullName: '',
    age: '',
    whatsappNumber: '',
    country: '',
    city: '',
    school: '',
    courseId: preselectedCourseId ? String(preselectedCourseId) : '',
    isOnline: false,
});

export default function Bookings({
    courses = [],
    countries = [],
    preselectedCourseId = null,
}: {
    courses?: CourseOption[];
    countries?: CountryOption[];
    preselectedCourseId?: number | null;
}) {
    const { settings } = usePage<{ settings?: Record<string, string | null | undefined> }>().props;
    const [formData, setFormData] = useState<BookingFormData>(() => createInitialForm(preselectedCourseId));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const bookingsPageTitle = settings?.bookings_page_title?.trim() || 'تعلم مع المرح';
    const bookingsPageSubtitle = settings?.bookings_page_subtitle?.trim() || 'ابدأ رحلة طفلك في البرمجة مع تجربة تعليمية ممتعة، آمنة، ومصممة بعناية للطفل العربي.';
    const bookingsSubmitButtonLabel = settings?.bookings_submit_button_label?.trim() || 'إرسال طلب الحجز';

    const handleFieldChange = (name: keyof BookingFormData, value: string | boolean) => {
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
        const trimmedName = formData.fullName.trim();
        const trimmedCity = formData.city.trim();
        const trimmedSchool = formData.school.trim();

        if (!trimmedName) {
            newErrors.fullName = 'يرجى إدخال اسم الطفل بالكامل.';
        } else if (trimmedName.length < 3) {
            newErrors.fullName = 'الاسم يجب أن يكون 3 أحرف على الأقل.';
        } else if (!/^[\u0600-\u06FF\s]+$/.test(trimmedName)) {
            newErrors.fullName = 'الرجاء كتابة الاسم باللغة العربية فقط.';
        }

        if (!formData.age) {
            newErrors.age = 'يرجى إدخال سن الطفل.';
        } else {
            const ageNum = Number(formData.age);
            if (Number.isNaN(ageNum) || ageNum < 5 || ageNum > 17) {
                newErrors.age = 'يجب أن يكون السن بين 5 و17 سنة.';
            }
        }

        if (!formData.whatsappNumber) {
            newErrors.whatsappNumber = 'يرجى إدخال رقم واتساب.';
        } else if (!/^\d{10,15}$/.test(formData.whatsappNumber)) {
            newErrors.whatsappNumber = 'رقم الواتساب يجب أن يكون بين 10 و15 رقمًا.';
        }

        if (!formData.country) {
            newErrors.country = 'يرجى اختيار الدولة.';
        }

        if (!trimmedCity) {
            newErrors.city = 'يرجى كتابة اسم المدينة.';
        }

        if (!trimmedSchool) {
            newErrors.school = 'يرجى كتابة اسم المدرسة.';
        }

        if (!formData.courseId) {
            newErrors.courseId = 'يرجى اختيار البرنامج المناسب.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setSubmitMessage({ type: 'error', message: 'يرجى مراجعة البيانات المطلوبة قبل الإرسال.' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch('/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    fullName: formData.fullName.trim(),
                    age: Number(formData.age),
                    whatsappNumber: formData.whatsappNumber,
                    country: formData.country,
                    city: formData.city.trim(),
                    school: formData.school.trim(),
                    courseId: Number(formData.courseId),
                    isOnline: formData.isOnline,
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
                    message: result?.message || 'تعذر إرسال الطلب حاليًا. حاول مرة أخرى.',
                });
                return;
            }

            setSubmitMessage({
                type: 'success',
                message: result?.message || 'تم إرسال طلب الحجز بنجاح، وسنتواصل معك قريبًا.',
            });
            setFormData(createInitialForm(preselectedCourseId));
            setErrors({});
            window.location.assign('/bookings/success');
        } catch {
            setSubmitMessage({
                type: 'error',
                message: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة بعد قليل.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName = (hasError: boolean) =>
        `w-full rounded-xl border px-4 py-4 text-base outline-none transition-all duration-200 focus:ring-4 ${
            hasError
                ? 'border-red-300 bg-red-50 focus:ring-red-200'
                : 'border-slate-200 bg-slate-50 focus:border-orange-400 focus:bg-white focus:ring-orange-100'
        }`;

    return (
        <MainLayout>
            <Head title={bookingsPageTitle} />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 text-right">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--site-primary-color)_20%,transparent),_rgba(255,255,255,0.3)_45%,_rgba(255,255,255,0.7)_100%)]"></div>
                <section className="relative container mx-auto px-4 pt-32 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                            <div className="text-center">
                                <h1 className="font-playpen-arabic text-4xl font-extrabold tracking-tight text-[var(--color-color-primary)] sm:text-5xl md:text-6xl" aria-label={bookingsPageTitle}>
                                    {bookingsPageTitle}
                                </h1>
                                <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                                    {bookingsPageSubtitle}
                                </p>
                            </div>

                            <div className="mt-8 border-t border-slate-200 pt-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {submitMessage && (
                                        <div className={`rounded-2xl border px-5 py-4 text-sm font-semibold sm:text-base lg:text-lg ${submitMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                            {submitMessage.message}
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <UserRound size={18} className="text-orange-600" />
                                                اسم الطفل بالكامل
                                                <span className="text-xs font-medium text-slate-400">/ Full Name</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input type="text" value={formData.fullName} onChange={(e) => handleFieldChange('fullName', e.target.value)} placeholder="اسم الطفل رباعيًا" className={inputClassName(Boolean(errors.fullName))} />
                                            {errors.fullName && <p className="text-sm font-medium text-red-600">{errors.fullName}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <UserRound size={18} className="text-orange-600" />
                                                سن الطفل
                                                <span className="text-xs font-medium text-slate-400">/ Age</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input type="number" value={formData.age} onChange={(e) => handleFieldChange('age', e.target.value)} placeholder="من 5 إلى 17 سنة" min="5" max="17" className={inputClassName(Boolean(errors.age))} />
                                            {errors.age && <p className="text-sm font-medium text-red-600">{errors.age}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <Phone size={18} className="text-orange-600" />
                                                رقم الواتساب
                                                <span className="text-xs font-medium text-slate-400">/ WhatsApp</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-4 text-sm font-bold text-slate-700">+20</div>
                                                <input type="tel" inputMode="numeric" value={formData.whatsappNumber} onChange={(e) => handleFieldChange('whatsappNumber', e.target.value.replace(/\D/g, ''))} placeholder="01XXXXXXXXX" dir="ltr" className={inputClassName(Boolean(errors.whatsappNumber))} />
                                            </div>
                                            {errors.whatsappNumber && <p className="text-sm font-medium text-red-600">{errors.whatsappNumber}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <UserRound size={18} className="text-orange-600" />
                                                البرنامج المهتم به
                                                <span className="text-xs font-medium text-slate-400">/ Course</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <select value={formData.courseId} onChange={(e) => handleFieldChange('courseId', e.target.value)} className={inputClassName(Boolean(errors.courseId))}>
                                                <option value="">اختر البرنامج المناسب</option>
                                                {courses.map((course) => (
                                                    <option key={course.id} value={course.id}>
                                                        {course.title}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.courseId && <p className="text-sm font-medium text-red-600">{errors.courseId}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <MapPin size={18} className="text-orange-600" />
                                                طريقة الحضور
                                                <span className="text-xs font-medium text-slate-400">/ Attendance</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div onClick={() => handleFieldChange('isOnline', false)} className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${!formData.isOnline ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-300'}`}>
                                                    <div className="text-sm font-bold text-slate-700">حضوري</div>
                                                    <p className="mt-1 text-xs text-slate-500">داخل الأكاديمية أو المدرسة</p>
                                                </div>
                                                <div onClick={() => handleFieldChange('isOnline', true)} className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200 ${formData.isOnline ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-300'}`}>
                                                    <div className="text-sm font-bold text-slate-700">أونلاين</div>
                                                    <p className="mt-1 text-xs text-slate-500">من أي مكان</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                    <Globe2 size={18} className="text-orange-600" />
                                                    الدولة
                                                    <span className="text-xs font-medium text-slate-400">/ Country</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <select value={formData.country} onChange={(e) => handleFieldChange('country', e.target.value)} className={inputClassName(Boolean(errors.country))}>
                                                    <option value="">اختر الدولة</option>
                                                    {countries.map((country) => (
                                                        <option key={country.code} value={country.code}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.country && <p className="text-sm font-medium text-red-600">{errors.country}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                    <MapPin size={18} className="text-orange-600" />
                                                    المدينة
                                                    <span className="text-xs font-medium text-slate-400">/ City</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <input type="text" value={formData.city} onChange={(e) => handleFieldChange('city', e.target.value)} placeholder="اكتب اسم المدينة" className={inputClassName(Boolean(errors.city))} />
                                                {errors.city && <p className="text-sm font-medium text-red-600">{errors.city}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 sm:text-base lg:text-lg">
                                                <Building2 size={18} className="text-orange-600" />
                                                المدرسة
                                                <span className="text-xs font-medium text-slate-400">/ School</span>
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input type="text" value={formData.school} onChange={(e) => handleFieldChange('school', e.target.value)} placeholder="اكتب اسم المدرسة" className={inputClassName(Boolean(errors.school))} />
                                            {errors.school && <p className="text-sm font-medium text-red-600">{errors.school}</p>}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button type="submit" disabled={isSubmitting} className={`group inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-extrabold text-white shadow-lg transition-all duration-300 ${isSubmitting ? 'cursor-not-allowed bg-slate-400 shadow-none' : 'hover:shadow-xl hover:shadow-orange-200 active:scale-[0.98]'}`} style={!isSubmitting ? { background: 'linear-gradient(to left, var(--site-primary-color), var(--site-primary-600))' } : undefined}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin" />
                                                    جاري إرسال الطلب...
                                                </>
                                            ) : (
                                                bookingsSubmitButtonLabel
                                            )}
                                        </button>
                                        <p className="mt-4 text-center text-xs leading-6 text-slate-500 sm:text-sm lg:text-base">بالضغط على زر الإرسال، أنت توافق على سياسة الخصوصية وشروط الاستخدام الخاصة بأكاديمية كيد كودر.</p>
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

