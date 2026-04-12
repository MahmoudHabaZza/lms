import InputError from '@/components/input-error';
import { useFilePreview } from '@/hooks/use-file-preview';
import type { FormEvent } from 'react';

export type FeedbackImageFormData = {
    student_name: string;
    caption: string;
    image_path: string;
    image_file: File | null;
    sort_order: number;
    status: boolean;
    _method?: 'put';
};

type FeedbackImageFormProps = {
    data: FeedbackImageFormData;
    setData: (key: keyof FeedbackImageFormData, value: FeedbackImageFormData[keyof FeedbackImageFormData]) => void;
    errors: Partial<Record<keyof FeedbackImageFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    previewImage?: string | null;
};

export default function FeedbackImageForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    previewImage = null,
}: FeedbackImageFormProps) {
    const uploadedImagePreview = useFilePreview(data.image_file);
    const imagePreview = uploadedImagePreview || previewImage || (data.image_path.startsWith('http') || data.image_path.startsWith('/')
        ? data.image_path
        : null);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">محتوى الرأي</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">البيانات الأساسية</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        اكتب اسم الطالب وأضف عبارة قصيرة تعبّر عن التجربة بشكل صادق ومختصر.
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
                            placeholder="مثال: آدم محمد"
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
                    <label htmlFor="caption" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        العبارة المختصرة
                    </label>
                    <textarea
                        id="caption"
                        rows={5}
                        value={data.caption}
                        onChange={(event) => setData('caption', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        placeholder="مثال: أحببت طريقة الشرح والألعاب داخل الدرس."
                    />
                    <InputError message={errors.caption} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الصورة والظهور</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">صورة الطالب</h3>
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
                                placeholder="/assets/EndUser/images/feedback/feedback-01.png"
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
                            <span>{data.status ? 'الرأي منشور للمستخدمين' : 'الرأي مخفي حاليًا'}</span>
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
                        <h3 className="text-lg font-bold text-slate-900">معاينة</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            تأكد من وضوح الصورة وملاءمة النص قبل الحفظ.
                        </p>
                    </div>

                    <div className="mt-5 rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf9_100%)] p-4">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt={data.student_name || 'معاينة الرأي'}
                                className="h-64 w-full rounded-[20px] object-cover"
                            />
                        ) : (
                            <div className="flex h-64 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,var(--site-primary-400)_0%,#fdba74_45%,#0f172a_100%)] px-6 text-center text-sm font-semibold text-white/90">
                                أضف صورة ليتم عرضها هنا
                            </div>
                        )}

                        <div className="mt-4 rounded-2xl bg-white/80 p-4 text-right">
                            <div className="font-bold text-slate-900">{data.student_name || 'اسم الطالب'}</div>
                            <div className="mt-2 text-sm leading-7 text-slate-600">
                                {data.caption || 'العبارة المختصرة ستظهر هنا بعد إضافتها.'}
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

