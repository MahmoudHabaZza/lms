import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

type AcademySectionFormData = {
    title: string;
    description: string;
    sort_order: number;
    status: boolean;
};

type AcademySectionFormProps = {
    data: AcademySectionFormData;
    setData: {
        (key: 'title', value: string): void;
        (key: 'description', value: string): void;
        (key: 'sort_order', value: number): void;
        (key: 'status', value: boolean): void;
    };
    errors: Partial<Record<keyof AcademySectionFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function SectionForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
}: AcademySectionFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">المحتوى النصي</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">تفاصيل القسم</h2>
                </div>

                <div>
                    <label htmlFor="title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        العنوان
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الوصف
                    </label>
                    <textarea
                        id="description"
                        rows={8}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">خيارات الظهور</h3>
                    </div>

                    <div className="mt-5 space-y-5">
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
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                            />
                            <InputError message={errors.sort_order} className="mt-2" />
                        </div>

                        <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700">
                            <span>{data.status ? 'القسم ظاهر للمستخدمين' : 'القسم مخفي حاليًا'}</span>
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={(e) => setData('status', e.target.checked)}
                                className="size-4"
                            />
                        </label>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h3 className="text-lg font-bold text-slate-900">حفظ</h3>
                        <p className="mt-1 text-sm leading-7 text-slate-500">
                            تأكد من أن الوصف مختصر وواضح لأنه يظهر ضمن تجربة الواجهة الرئيسية.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-5 w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </form>
    );
}
