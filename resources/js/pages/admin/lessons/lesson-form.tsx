import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

type LessonFormData = {
    course_id: number | null;
    title: string;
    description: string;
    video_url: string;
    duration_minutes: number | null;
    order: number | null;
};

type CourseOption = {
    id: number;
    title: string;
};

type Props = {
    data: LessonFormData;
    setData: (key: keyof LessonFormData, value: LessonFormData[keyof LessonFormData]) => void;
    errors: Partial<Record<keyof LessonFormData, string>>;
    courses: CourseOption[];
    processing: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
};

export default function LessonForm({ data, setData, errors, courses, processing, onSubmit, submitLabel }: Props) {
    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">البيانات الأساسية</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">تفاصيل الدرس</h2>
                </div>

                <div>
                    <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس</label>
                    <select value={data.course_id ?? ''} onChange={(event) => setData('course_id', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100">
                        <option value="">اختر الكورس</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.course_id} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان الدرس</label>
                    <input value={data.title} onChange={(event) => setData('title', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف</label>
                    <textarea rows={5} value={data.description} onChange={(event) => setData('description', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                    <InputError message={errors.description} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الإعدادات</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">رابط وترتيب</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">رابط الفيديو (Drive)</label>
                            <input dir="ltr" value={data.video_url} onChange={(event) => setData('video_url', event.target.value)} placeholder="https://drive.google.com/..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.video_url} className="mt-2" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-right text-sm font-semibold text-slate-700">المدة بالدقائق</label>
                                <input type="number" value={data.duration_minutes ?? ''} onChange={(event) => setData('duration_minutes', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.duration_minutes} className="mt-2" />
                            </div>

                            <div>
                                <label className="mb-2 block text-right text-sm font-semibold text-slate-700">ترتيب الظهور</label>
                                <input type="number" value={data.order ?? ''} onChange={(event) => setData('order', event.target.value ? Number(event.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <p className="mt-2 text-right text-xs text-slate-500">يجب أن يكون رقمًا فريدًا داخل نفس الكورس.</p>
                                <InputError message={errors.order} className="mt-2" />
                            </div>
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
