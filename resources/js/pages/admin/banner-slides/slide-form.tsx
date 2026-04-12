import InputError from '@/components/input-error';
import { useFilePreview } from '@/hooks/use-file-preview';
import type { FormEvent } from 'react';

type BannerSlideFormData = {
    title: string;
    sub_title: string;
    description: string;
    button_link: string;
    background_image: string;
    background_image_file: File | null;
    sort_order: number;
    status: boolean;
};

type BannerSlideFormProps = {
    data: BannerSlideFormData;
    setData: {
        (key: 'title', value: string): void;
        (key: 'sub_title', value: string): void;
        (key: 'description', value: string): void;
        (key: 'button_link', value: string): void;
        (key: 'background_image', value: string): void;
        (key: 'background_image_file', value: File | null): void;
        (key: 'sort_order', value: number): void;
        (key: 'status', value: boolean): void;
    };
    errors: Partial<Record<keyof BannerSlideFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    previewBackgroundImage?: string | null;
};

export default function SlideForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
    previewBackgroundImage = null,
}: BannerSlideFormProps) {
    const uploadedImagePreview = useFilePreview(data.background_image_file);
    const livePreview = uploadedImagePreview || previewBackgroundImage || (data.background_image.startsWith('http') || data.background_image.startsWith('/')
        ? data.background_image
        : null);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">محتوى الشريحة</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">البيانات الأساسية</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        اكتب النصوص الأساسية التي تظهر فوق صورة الخلفية في الشريحة الرئيسية.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label htmlFor="title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            العنوان الرئيسي
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="مثال: ابدأ رحلة البرمجة مع كيد كودر"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="sub_title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            العنوان الفرعي
                        </label>
                        <input
                            id="sub_title"
                            type="text"
                            value={data.sub_title}
                            onChange={(e) => setData('sub_title', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="نص قصير داعم تحت العنوان"
                        />
                        <InputError message={errors.sub_title} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            الوصف
                        </label>
                        <textarea
                            id="description"
                            rows={5}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="اكتب وصفًا واضحًا ومناسبًا للأطفال يشرح قيمة هذه الشريحة."
                        />
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="button_link" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            رابط الزر
                        </label>
                        <input
                            id="button_link"
                            type="text"
                            dir="ltr"
                            value={data.button_link}
                            onChange={(e) => setData('button_link', e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="https://example.com أو /bookings"
                        />
                        <InputError message={errors.button_link} className="mt-2" />
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="sort_order" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                ترتيب الظهور
                            </label>
                            <input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', Number.parseInt(e.target.value || '0', 10))}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                            />
                            <InputError message={errors.sort_order} className="mt-2" />
                        </div>

                        <div className="flex items-end justify-end">
                            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                                <span>{data.status ? 'الشريحة نشطة' : 'الشريحة غير نشطة'}</span>
                                <input
                                    type="checkbox"
                                    checked={data.status}
                                    onChange={(e) => setData('status', e.target.checked)}
                                    className="size-4"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الخلفية والمعاينة</div>
                        <h2 className="mt-2 text-xl font-black text-slate-900">صورة الشريحة</h2>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label htmlFor="background_image" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                                رابط أو مسار الصورة
                            </label>
                            <input
                                id="background_image"
                                type="text"
                                dir="ltr"
                                value={data.background_image}
                                onChange={(e) => setData('background_image', e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                placeholder="/assets/EndUser/images/hero-bg-01.jpg"
                            />
                            <InputError message={errors.background_image} className="mt-2" />
                        </div>

                        <div>
                            <label
                                htmlFor="background_image_file"
                                className="mb-2 block text-right text-sm font-semibold text-slate-700"
                            >
                                رفع صورة من الجهاز
                            </label>
                            <input
                                id="background_image_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('background_image_file', e.target.files?.[0] ?? null)}
                                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                            />
                            <InputError message={errors.background_image_file} className="mt-2" />
                        </div>

                        <div className="rounded-[24px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#fffdf9_100%)] p-4">
                            <div className="mb-3 text-right text-sm font-semibold text-slate-700">معاينة سريعة</div>
                            <div className="relative overflow-hidden rounded-[22px] bg-slate-900">
                                {livePreview ? (
                                    <img
                                        src={livePreview}
                                        alt="معاينة الخلفية"
                                        className="h-64 w-full object-cover opacity-70"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center bg-[linear-gradient(135deg,var(--site-primary-400)_0%,#fdba74_35%,#0f172a_100%)] text-sm font-semibold text-white/90">
                                        أضف صورة خلفية لتظهر المعاينة هنا
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/75 via-slate-900/45 to-transparent" />
                                <div className="absolute inset-0 flex flex-col items-end justify-end p-6 text-right text-white">
                                    <div className="max-w-[85%]">
                                        <div className="text-xl font-black leading-8">
                                            {data.title || 'عنوان الشريحة سيظهر هنا'}
                                        </div>
                                        <div className="mt-2 text-sm font-medium text-orange-100">
                                            {data.sub_title || 'العنوان الفرعي'}
                                        </div>
                                        <div className="mt-3 line-clamp-3 text-sm leading-7 text-white/85">
                                            {data.description || 'الوصف المختصر للشريحة سيظهر هنا بمجرد كتابته.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">حفظ التغييرات</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            راجع المحتوى والصورة والترتيب قبل الحفظ، خاصة إذا كانت الشريحة ستظهر أولًا في الواجهة.
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

