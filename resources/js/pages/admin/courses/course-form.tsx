import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export type CourseFormData = {
    title: string;
    description: string;
    short_description: string;
    learning_outcome: string;
    thumbnail: string;
    price: number | null;
    total_duration_minutes: number | null;
    duration_months: number;
    sessions_count: number;
    sessions_per_week: number;
    badge: string;
    accent_color: string;
    sort_order: number;
    status: boolean;
    instructor_id: number | null;
    category_id: number | null;
};

type CourseFormProps = {
    data: CourseFormData;
    setData: <K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) => void;
    errors: Partial<Record<keyof CourseFormData, string>>;
    instructors: { id: number; name: string }[];
    categories: { id: number; name: string }[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const audienceLabel = 'من 5 إلى 17 سنة';

export default function CourseForm({
    data,
    setData,
    errors,
    instructors,
    categories,
    processing,
    submitLabel,
    onSubmit,
}: CourseFormProps) {
    const thumbnailPreview = data.thumbnail.startsWith('http') || data.thumbnail.startsWith('/') ? data.thumbnail : null;

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الهوية التعليمية</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات الكورس</h2>
                </div>

                <div>
                    <label htmlFor="title" className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان الكورس</label>
                    <input id="title" type="text" value={data.title} onChange={(event) => setData('title', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4 text-right">
                    <div className="text-sm font-bold text-slate-900">الفئة المستهدفة</div>
                    <div className="mt-2 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
                        {audienceLabel}
                    </div>
                </div>

                <div>
                    <label htmlFor="short_description" className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف المختصر</label>
                    <textarea id="short_description" rows={4} value={data.short_description} onChange={(event) => setData('short_description', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.short_description} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف التفصيلي</label>
                    <textarea id="description" rows={5} value={data.description} onChange={(event) => setData('description', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="learning_outcome" className="mb-2 block text-right text-sm font-semibold text-slate-700">ناتج التعلم</label>
                    <input id="learning_outcome" type="text" value={data.learning_outcome} onChange={(event) => setData('learning_outcome', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.learning_outcome} className="mt-2" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="instructor_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">المدرب</label>
                        <select id="instructor_id" value={data.instructor_id ?? ''} onChange={(event) => setData('instructor_id', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100">
                            <option value="">بدون مدرب</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.instructor_id} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="category_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">التصنيف</label>
                        <select id="category_id" value={data.category_id ?? ''} onChange={(event) => setData('category_id', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100">
                            <option value="">بدون تصنيف</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الخطة والعرض</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">إعدادات الكورس</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label htmlFor="thumbnail" className="mb-2 block text-right text-sm font-semibold text-slate-700">رابط أو مسار الصورة</label>
                            <input id="thumbnail" type="text" dir="ltr" value={data.thumbnail} onChange={(event) => setData('thumbnail', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="price" className="mb-2 block text-right text-sm font-semibold text-slate-700">السعر</label>
                                <input id="price" type="number" step="0.01" min={0} value={data.price ?? 0} onChange={(event) => setData('price', Number(event.target.value || '0'))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.price} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="total_duration_minutes" className="mb-2 block text-right text-sm font-semibold text-slate-700">إجمالي المدة بالدقائق</label>
                                <input id="total_duration_minutes" type="number" min={0} value={data.total_duration_minutes ?? 0} onChange={(event) => setData('total_duration_minutes', Number(event.target.value || '0'))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.total_duration_minutes} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label htmlFor="duration_months" className="mb-2 block text-right text-sm font-semibold text-slate-700">المدة بالشهور</label>
                                <input id="duration_months" type="number" min={1} value={data.duration_months} onChange={(event) => setData('duration_months', Number.parseInt(event.target.value || '1', 10))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.duration_months} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="sessions_count" className="mb-2 block text-right text-sm font-semibold text-slate-700">عدد الجلسات</label>
                                <input id="sessions_count" type="number" min={1} value={data.sessions_count} onChange={(event) => setData('sessions_count', Number.parseInt(event.target.value || '1', 10))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.sessions_count} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="sessions_per_week" className="mb-2 block text-right text-sm font-semibold text-slate-700">الجلسات أسبوعيًا</label>
                                <input id="sessions_per_week" type="number" min={1} value={data.sessions_per_week} onChange={(event) => setData('sessions_per_week', Number.parseInt(event.target.value || '1', 10))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.sessions_per_week} className="mt-2" />
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-3">
                            <div>
                                <label htmlFor="badge" className="mb-2 block text-right text-sm font-semibold text-slate-700">الشارة</label>
                                <input id="badge" type="text" value={data.badge} onChange={(event) => setData('badge', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.badge} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="accent_color" className="mb-2 block text-right text-sm font-semibold text-slate-700">اللون الرئيسي</label>
                                <input id="accent_color" type="text" value={data.accent_color} onChange={(event) => setData('accent_color', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.accent_color} className="mt-2" />
                            </div>
                            <div>
                                <label htmlFor="sort_order" className="mb-2 block text-right text-sm font-semibold text-slate-700">ترتيب الظهور</label>
                                <input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(event) => setData('sort_order', Number.parseInt(event.target.value || '0', 10))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.sort_order} className="mt-2" />
                            </div>
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'الكورس منشور للمستخدمين' : 'الكورس مخفي حاليًا'}</span>
                            <input type="checkbox" checked={data.status} onChange={(event) => setData('status', event.target.checked)} className="size-4" />
                        </label>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">معاينة سريعة</h3>
                    </div>
                    <div className="mt-5 rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf9_100%)] p-4">
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt={data.title || 'معاينة الصورة'} className="h-56 w-full rounded-[20px] object-cover" />
                        ) : (
                            <div className="flex h-56 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,var(--site-primary-400)_0%,#fdba74_45%,#0f172a_100%)] px-6 text-center text-sm font-semibold text-white/90">
                                أضف صورة مصغرة لتظهر هنا
                            </div>
                        )}
                        <div className="mt-4 rounded-2xl bg-white/80 p-4 text-right">
                            <div className="font-bold text-slate-900">{data.title || 'عنوان الكورس'}</div>
                            <div className="mt-1 text-sm text-slate-500">{audienceLabel} • {data.duration_months} شهر • {data.sessions_count} جلسة</div>
                            <div className="mt-2 text-sm leading-7 text-slate-600">{data.short_description || 'الوصف المختصر للكورس سيظهر هنا.'}</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <button type="submit" disabled={processing} className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50">
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}

