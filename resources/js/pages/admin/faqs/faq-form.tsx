import InputError from '@/components/input-error';
import { useFilePreview } from '@/hooks/use-file-preview';
import type { FormEvent } from 'react';

export type FaqFormData = {
    question: string;
    answer_type: 'text' | 'video';
    answer_text: string;
    video_url: string;
    video_path: string;
    video_file: File | null;
    video_cover_image: string;
    cover_image_file: File | null;
    status: boolean;
    sort_order: number;
    _method?: 'put';
};

type FaqFormProps = {
    data: FaqFormData;
    setData: {
        (key: 'question', value: string): void;
        (key: 'answer_type', value: 'text' | 'video'): void;
        (key: 'answer_text', value: string): void;
        (key: 'video_url', value: string): void;
        (key: 'video_path', value: string): void;
        (key: 'video_file', value: File | null): void;
        (key: 'video_cover_image', value: string): void;
        (key: 'cover_image_file', value: File | null): void;
        (key: 'status', value: boolean): void;
        (key: 'sort_order', value: number): void;
        (key: '_method', value: 'put'): void;
    };
    errors: Partial<Record<keyof FaqFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    previewVideoCoverImage?: string | null;
};

export default function FaqForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    previewVideoCoverImage = null,
}: FaqFormProps) {
    const uploadedCoverPreview = useFilePreview(data.cover_image_file);
    const coverPreview = uploadedCoverPreview || previewVideoCoverImage || (data.video_cover_image.startsWith('http') || data.video_cover_image.startsWith('/')
        ? data.video_cover_image
        : null);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">صياغة المحتوى</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات السؤال والإجابة</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        اكتب السؤال بلغة بسيطة وواضحة، ثم اختر ما إذا كانت الإجابة نصية أو فيديو قصير.
                    </p>
                </div>

                <div>
                    <label htmlFor="question" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        السؤال
                    </label>
                    <input
                        id="question"
                        type="text"
                        value={data.question}
                        onChange={(event) => setData('question', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        placeholder="مثال: كيف أبدأ أول حصة برمجة لطفلي؟"
                    />
                    <InputError message={errors.question} className="mt-2" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="answer_type" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            نوع الإجابة
                        </label>
                        <select
                            id="answer_type"
                            value={data.answer_type}
                            onChange={(event) => setData('answer_type', event.target.value as 'text' | 'video')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="text">إجابة نصية</option>
                            <option value="video">فيديو قصير</option>
                        </select>
                        <InputError message={errors.answer_type} className="mt-2" />
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

                {data.answer_type === 'text' ? (
                    <div>
                        <label htmlFor="answer_text" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            نص الإجابة
                        </label>
                        <textarea
                            id="answer_text"
                            rows={8}
                            value={data.answer_text}
                            onChange={(event) => setData('answer_text', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="اكتب الإجابة بصياغة مفهومة ومطمئنة ومباشرة."
                        />
                        <InputError message={errors.answer_text} className="mt-2" />
                    </div>
                ) : (
                    <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="text-right">
                            <h3 className="text-base font-bold text-slate-900">إعدادات فيديو الإجابة</h3>
                            <p className="mt-1 text-sm leading-7 text-slate-500">
                                يمكنك رفع فيديو مباشر أو إضافة رابط فيديو خارجي، مع صورة غلاف اختيارية.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="video_file" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                    رفع ملف الفيديو
                                </label>
                                <input
                                    id="video_file"
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime"
                                    onChange={(event) => setData('video_file', event.target.files?.[0] ?? null)}
                                    className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
                                />
                                {data.video_path && (
                                    <p className="mt-2 text-right text-xs text-slate-500">الملف الحالي: {data.video_path}</p>
                                )}
                                <InputError message={errors.video_file as string} className="mt-2" />
                            </div>

                            <div>
                                <label htmlFor="cover_image_file" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                    رفع صورة الغلاف
                                </label>
                                <input
                                    id="cover_image_file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => setData('cover_image_file', event.target.files?.[0] ?? null)}
                                    className="w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm"
                                />
                                <InputError message={errors.cover_image_file as string} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="video_url" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                رابط فيديو خارجي
                            </label>
                            <input
                                id="video_url"
                                type="text"
                                dir="ltr"
                                value={data.video_url}
                                onChange={(event) => setData('video_url', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                placeholder="https://example.com/video"
                            />
                            <InputError message={errors.video_url} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="video_cover_image" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                رابط صورة الغلاف
                            </label>
                            <input
                                id="video_cover_image"
                                type="text"
                                dir="ltr"
                                value={data.video_cover_image}
                                onChange={(event) => setData('video_cover_image', event.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                placeholder="/assets/enduser/images/faq-cover.jpg"
                            />
                            <InputError message={errors.video_cover_image} className="mt-2" />
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">النشر والمعاينة</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">خيارات الظهور</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'السؤال منشور للمستخدمين' : 'السؤال مخفي حاليًا'}</span>
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={(event) => setData('status', event.target.checked)}
                                className="size-4"
                            />
                        </label>
                    </div>
                </div>

                {data.answer_type === 'video' && (
                    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-right">
                            <h3 className="text-lg font-bold text-slate-900">معاينة الغلاف</h3>
                            <p className="mt-1 text-sm leading-7 text-slate-500">
                                استخدم غلافًا واضحًا وودودًا ليعكس طبيعة الإجابة قبل تشغيل الفيديو.
                            </p>
                        </div>

                        <div className="mt-5 overflow-hidden rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf9_100%)] p-4">
                            {coverPreview ? (
                                <img
                                    src={coverPreview}
                                    alt="معاينة غلاف الفيديو"
                                    className="h-56 w-full rounded-[20px] object-cover"
                                />
                            ) : (
                                <div className="flex h-56 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,var(--site-primary-400)_0%,#fdba74_45%,#0f172a_100%)] px-6 text-center text-sm font-semibold text-white/90">
                                    أضف صورة غلاف ليتم عرضها هنا
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">حفظ</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            راجع السؤال ونوع الإجابة قبل الحفظ حتى تظهر الأسئلة بترتيب واضح للمستخدمين.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-5 w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}

