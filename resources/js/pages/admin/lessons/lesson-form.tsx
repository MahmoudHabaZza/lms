import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

type LessonFormData = {
    course_id: number | null;
    title: string;
    description: string;
    video_source: 'drive' | 'upload' | 'youtube';
    video_url: string;
    video_file: File | null;
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
    currentVideoPath?: string | null;
};

export default function LessonForm({ data, setData, errors, courses, processing, onSubmit, submitLabel, currentVideoPath }: Props) {
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
                        <h3 className="mt-2 text-lg font-bold text-slate-900">مصدر الفيديو والترتيب</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">مصدر الفيديو</label>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300">
                                    <input type="radio" name="video_source" checked={data.video_source === 'drive'} onChange={() => setData('video_source', 'drive')} />
                                    Google Drive
                                </label>
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300">
                                    <input type="radio" name="video_source" checked={data.video_source === 'upload'} onChange={() => setData('video_source', 'upload')} />
                                    رفع فيديو
                                </label>
                                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300">
                                    <input type="radio" name="video_source" checked={data.video_source === 'youtube'} onChange={() => setData('video_source', 'youtube')} />
                                    YouTube
                                </label>
                            </div>
                            <InputError message={errors.video_source} className="mt-2" />
                        </div>

                        {data.video_source === 'upload' ? (
                            <div>
                                <label className="mb-2 block text-right text-sm font-semibold text-slate-700">ملف الفيديو</label>
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime"
                                    onChange={(event) => setData('video_file', event.target.files?.[0] ?? null)}
                                    className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                                />
                                {currentVideoPath && !data.video_file && (
                                    <p className="mt-2 text-right text-xs text-slate-500">الملف الحالي متوفر على السيرفر.</p>
                                )}
                                <InputError message={errors.video_file} className="mt-2" />
                            </div>
                        ) : (
                            <div>
                                <label className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                    {data.video_source === 'youtube' ? 'رابط YouTube' : 'رابط Google Drive'}
                                </label>
                                <input
                                    dir="ltr"
                                    value={data.video_url}
                                    onChange={(event) => setData('video_url', event.target.value)}
                                    placeholder={data.video_source === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://drive.google.com/...'}
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                />
                                <InputError message={errors.video_url} className="mt-2" />
                            </div>
                        )}

                        <div>
                            <p className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-right text-xs leading-6 text-orange-800">
                                اختر المصدر المناسب لكل عميل: Drive لروابط الملفات، Upload لرفع الفيديو مباشرة، YouTube للروابط الخارجية.
                            </p>
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
