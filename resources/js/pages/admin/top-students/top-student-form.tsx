import InputError from '@/components/input-error';
import { useFilePreview } from '@/hooks/use-file-preview';
import type { FormEvent } from 'react';

export type TopStudentFormData = {
    student_name: string;
    achievement_title: string;
    image_path: string;
    image_file: File | null;
    sort_order: number;
    status: boolean;
    _method?: 'put';
};

type TopStudentFormProps = {
    data: TopStudentFormData;
    setData: (key: keyof TopStudentFormData, value: TopStudentFormData[keyof TopStudentFormData]) => void;
    errors: Partial<Record<keyof TopStudentFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    previewImage?: string | null;
};

export default function TopStudentForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    previewImage = null,
}: TopStudentFormProps) {
    const uploadedImagePreview = useFilePreview(data.image_file);
    const imagePreview =
        uploadedImagePreview ||
        previewImage ||
        (data.image_path.startsWith('http://') || data.image_path.startsWith('https://') || data.image_path.startsWith('/')
            ? data.image_path
            : null);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">بيانات الطالب</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">محتوى بطاقة التفوق</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        أضف اسم الطالب وصورة واضحة مع إنجاز قصير يبرز سبب ظهوره في القسم.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="student_name" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            اسم الطالب
                        </label>
                        <input
                            id="student_name"
                            type="text"
                            value={data.student_name}
                            onChange={(event) => setData('student_name', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="مثال: سارة أحمد"
                        />
                        <InputError message={errors.student_name} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="sort_order" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            ترتيب الظهور
                        </label>
                        <input
                            id="sort_order"
                            type="number"
                            min={0}
                            value={data.sort_order}
                            onChange={(event) => setData('sort_order', Number.parseInt(event.target.value || '0', 10))}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        />
                        <InputError message={errors.sort_order} className="mt-2" />
                    </div>
                </div>

                <div>
                    <label htmlFor="achievement_title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الإنجاز أو اللقب
                    </label>
                    <textarea
                        id="achievement_title"
                        rows={4}
                        value={data.achievement_title}
                        onChange={(event) => setData('achievement_title', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        placeholder="مثال: أبدعت في بناء مشروع لعبة تعليمية كاملة"
                    />
                    <InputError message={errors.achievement_title} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الصورة والنشر</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">صورة الشهادة</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label htmlFor="image_path" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                رابط أو مسار الصورة
                            </label>
                            <input
                                id="image_path"
                                type="text"
                                dir="ltr"
                                value={data.image_path}
                                onChange={(event) => setData('image_path', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                placeholder="/storage/top-students/student-01.jpg"
                            />
                            <InputError message={errors.image_path} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="image_file" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                رفع صورة من الجهاز
                            </label>
                            <input
                                id="image_file"
                                type="file"
                                accept="image/*"
                                onChange={(event) => setData('image_file', event.target.files?.[0] ?? null)}
                                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                            />
                            <InputError message={errors.image_file} className="mt-2" />
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'البطاقة منشورة للمستخدمين' : 'البطاقة مخفية حالياً'}</span>
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={(event) => setData('status', event.target.checked)}
                                className="size-4"
                            />
                        </label>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">معاينة البطاقة</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            راجع الشكل العام قبل الحفظ، خاصة وضوح الصورة ومساحة النص القصير.
                        </p>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[28px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-4">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt={data.student_name || 'معاينة الطالب المتفوق'}
                                className="aspect-[4/5] w-full rounded-[22px] object-cover"
                            />
                        ) : (
                            <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#fdba74_0%,#f97316_45%,#0f172a_100%)] px-6 text-center text-sm font-semibold text-white/90">
                                أضف صورة للطالب ممسكاً بالشهادة لتظهر هنا
                            </div>
                        )}

                        <div className="mt-4 rounded-[22px] bg-slate-950 px-5 py-4 text-right text-white shadow-lg">
                            <div className="text-xs font-semibold tracking-[0.22em] text-orange-300">TOP STUDENT</div>
                            <div className="mt-2 text-lg font-bold">{data.student_name || 'اسم الطالب'}</div>
                            <div className="mt-2 text-sm leading-7 text-slate-300">
                                {data.achievement_title || 'سيظهر الإنجاز القصير هنا بعد إضافته.'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
