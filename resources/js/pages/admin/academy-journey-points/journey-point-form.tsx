import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

export const ICON_OPTIONS = [
    { value: 'Users', label: 'Users' },
    { value: 'UserRoundCheck', label: 'UserRoundCheck' },
    { value: 'BadgeCheck', label: 'BadgeCheck' },
    { value: 'Trophy', label: 'Trophy' },
    { value: 'Code2', label: 'Code2' },
    { value: 'Rocket', label: 'Rocket' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'GraduationCap', label: 'GraduationCap' },
    { value: 'BookOpen', label: 'BookOpen' },
    { value: 'Award', label: 'Award' },
] as const;

export const BUBBLE_STYLE_OPTIONS = [
    { value: 'border-sky-500 bg-white text-sky-600', label: 'سماءي (Sky)' },
    { value: 'border-emerald-500 bg-white text-emerald-600', label: 'زمردي (Emerald)' },
    { value: 'border-orange-500 bg-white text-orange-500', label: 'برتقالي (Orange)' },
    { value: 'border-rose-600 bg-white text-rose-600', label: 'وردي (Rose)' },
    { value: 'border-amber-500 bg-white text-amber-600', label: 'عنبري (Amber)' },
    { value: 'border-violet-500 bg-white text-violet-600', label: 'بنفسجي (Violet)' },
    { value: 'border-blue-600 bg-white text-blue-600', label: 'أزرق (Blue)' },
    { value: 'border-teal-500 bg-white text-teal-600', label: 'فيروزي (Teal)' },
] as const;

export type JourneyPointFormData = {
    title: string;
    icon: string;
    bubble_color: string;
    bubble_style: string;
    sort_order: number;
    status: boolean;
    _method?: 'put';
};

type JourneyPointFormProps = {
    data: JourneyPointFormData;
    setData: (key: keyof JourneyPointFormData, value: JourneyPointFormData[keyof JourneyPointFormData]) => void;
    errors: Partial<Record<keyof JourneyPointFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function JourneyPointForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
}: JourneyPointFormProps) {
    const iconPreview = ICON_OPTIONS.find((opt) => opt.value === data.icon);

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">بيانات النقطة</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">محتوى نقطة الرحلة</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                        أضف عنوان لكل نقطة في رحلة الأكاديمية.
                    </p>
                </div>

                <div>
                    <label htmlFor="title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        العنوان
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        placeholder="مثال: سيشن أونلاين تفاعلية"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="icon" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            الأيقونة
                        </label>
                        <select
                            id="icon"
                            value={data.icon}
                            onChange={(event) => setData('icon', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="">اختر أيقونة</option>
                            {ICON_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.icon} className="mt-2" />
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

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label htmlFor="bubble_color" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            لون الفقاعة (Hex أو CSS var)
                        </label>
                        <input
                            id="bubble_color"
                            type="text"
                            value={data.bubble_color}
                            onChange={(event) => setData('bubble_color', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            placeholder="مثال: #1d9bf0"
                        />
                        <InputError message={errors.bubble_color} className="mt-2" />
                    </div>

                    <div>
                        <label htmlFor="bubble_style" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                            نمط الفقاعة (Tailwind)
                        </label>
                        <select
                            id="bubble_style"
                            value={data.bubble_style}
                            onChange={(event) => setData('bubble_style', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="">اختر نمطاً</option>
                            {BUBBLE_STYLE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.bubble_style} className="mt-2" />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الحالة</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">حالة النشر</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'النقطة منشورة للمستخدمين' : 'النقطة مخفية حالياً'}</span>
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
                        <h3 className="text-lg font-bold text-slate-900">معاينة النقطة</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            راجع الشكل العام للنقطة قبل الحفظ.
                        </p>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[28px] border border-orange-100 bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] p-4">
                        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[4px] border-slate-300 bg-white text-slate-600">
                                <span className="text-xs font-bold">{data.icon ? iconPreview?.label?.slice(0, 2) : '?'}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900">{data.title || 'عنوان النقطة'}</div>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: data.bubble_color || '#ccc' }} />
                                {data.bubble_color || 'لون غير محدد'}
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="truncate">{data.bubble_style || 'نمط غير محدد'}</span>
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
