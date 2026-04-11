import InputError from '@/components/input-error';
import { useFilePreview } from '@/hooks/use-file-preview';
import type { FormEvent } from 'react';

export type CourseReelFormData = {
    course_id: string;
    title: string;
    cover_image: string;
    cover_image_file: File | null;
    video_file: File | null;
    video_url: string;
    description: string;
    sort_order: number;
    status: boolean;
    _method?: 'put';
};

type CourseReelFormProps = {
    data: CourseReelFormData;
    setData: (key: keyof CourseReelFormData, value: CourseReelFormData[keyof CourseReelFormData]) => void;
    errors: Partial<Record<keyof CourseReelFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    previewCoverImage?: string | null;
    currentVideoPath?: string | null;
    courses: Array<{ id: number; title: string }>;
};

export default function CourseReelForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    previewCoverImage = null,
    currentVideoPath = null,
    courses,
}: CourseReelFormProps) {
    const uploadedCoverPreview = useFilePreview(data.cover_image_file);
    const coverPreview = uploadedCoverPreview || previewCoverImage || (data.cover_image.startsWith('http') || data.cover_image.startsWith('/')
        ? data.cover_image
        : null);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">ربط الكورس</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">تفاصيل ريل الكورس</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">اختر الكورس أو اتركه بدون ربط، ثم أضف عنوانًا ووصفًا مختصرًا مع فيديو مناسب.</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="course_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس المرتبط</label>
                        <select id="course_id" value={data.course_id} onChange={(event) => setData('course_id', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100">
                            <option value="">بدون ربط</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                        <InputError message={errors.course_id} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="sort_order" className="mb-2 block text-right text-sm font-semibold text-slate-700">ترتيب الظهور</label>
                        <input id="sort_order" type="number" min={0} value={data.sort_order} onChange={(event) => setData('sort_order', Number.parseInt(event.target.value || '0', 10))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                        <InputError message={errors.sort_order} className="mt-2" />
                    </div>
                </div>

                <div>
                    <label htmlFor="title" className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان الريل</label>
                    <input id="title" type="text" value={data.title} onChange={(event) => setData('title', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" placeholder="مثال: نظرة سريعة على الكورس" />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف المختصر</label>
                    <textarea id="description" rows={5} value={data.description} onChange={(event) => setData('description', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" placeholder="اكتب وصفًا قصيرًا يوضح الفكرة الأساسية من الكورس أو الريل." />
                    <InputError message={errors.description} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الوسائط والنشر</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">الغلاف والفيديو</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label htmlFor="cover_image" className="mb-2 block text-right text-sm font-semibold text-slate-700">رابط أو مسار صورة الغلاف</label>
                            <input id="cover_image" type="text" dir="ltr" value={data.cover_image} onChange={(event) => setData('cover_image', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" placeholder="/assets/EndUser/images/reels/course-reel-cover.png" />
                            <InputError message={errors.cover_image} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="cover_image_file" className="mb-2 block text-right text-sm font-semibold text-slate-700">رفع صورة الغلاف</label>
                            <input id="cover_image_file" type="file" accept="image/*" onChange={(event) => setData('cover_image_file', event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm" />
                            <InputError message={errors.cover_image_file} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="video_file" className="mb-2 block text-right text-sm font-semibold text-slate-700">رفع ملف الفيديو</label>
                            <input id="video_file" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => setData('video_file', event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm" />
                            {currentVideoPath && <p className="mt-2 text-right text-xs text-slate-500">الملف الحالي: {currentVideoPath}</p>}
                            <InputError message={errors.video_file} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="video_url" className="mb-2 block text-right text-sm font-semibold text-slate-700">رابط فيديو خارجي</label>
                            <input id="video_url" type="text" dir="ltr" value={data.video_url} onChange={(event) => setData('video_url', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" placeholder="https://example.com/course-reel" />
                            <InputError message={errors.video_url} className="mt-2" />
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'الريل منشور للمستخدمين' : 'الريل مخفي حاليًا'}</span>
                            <input type="checkbox" checked={data.status} onChange={(event) => setData('status', event.target.checked)} className="size-4" />
                        </label>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">معاينة الغلاف</h3>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf9_100%)] p-4">
                        {coverPreview ? (
                            <img src={coverPreview} alt={data.title || 'معاينة الغلاف'} className="h-64 w-full rounded-[20px] object-cover" />
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#fb923c_0%,#fdba74_45%,#0f172a_100%)] px-6 text-center text-sm font-semibold text-white/90">
                                أضف صورة غلاف لتظهر هنا
                            </div>
                        )}

                        <div className="mt-4 rounded-2xl bg-white/80 p-4 text-right">
                            <div className="font-bold text-slate-900">{data.title || 'عنوان الريل'}</div>
                            <div className="mt-1 text-sm text-slate-500">{courses.find((course) => String(course.id) === data.course_id)?.title || 'بدون ربط بكورس'}</div>
                            <div className="mt-2 text-sm leading-7 text-slate-600">{data.description || 'الوصف المختصر سيظهر هنا بعد إضافته.'}</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <button type="submit" disabled={processing} className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50">
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
