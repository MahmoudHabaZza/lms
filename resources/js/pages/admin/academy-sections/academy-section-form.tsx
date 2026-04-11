import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

type AcademySectionFormData = {
    title: string;
    description: string;
    status: boolean;
    sort_order: number;
};

type AcademySectionFormProps = {
    data: AcademySectionFormData;
    setData: {
        (key: 'title', value: string): void;
        (key: 'description', value: string): void;
        (key: 'status', value: boolean): void;
        (key: 'sort_order', value: number): void;
    };
    errors: Partial<Record<keyof AcademySectionFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AcademySectionForm({
    data,
    setData,
    errors,
    processing,
    submitLabel,
    onSubmit,
}: AcademySectionFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border p-6">
            <div>
                <label htmlFor="title" className="mb-2 block text-sm font-medium">
                    العنوان
                </label>
                <input
                    id="title"
                    type="text"
                    value={data.title}
                    placeholder="أدخل عنوان القسم الأكاديمي"
                    onChange={(e) => setData('title', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.title && <InputError message={errors.title} />}
            </div>

            <div>
                <label htmlFor="description" className="mb-2 block text-sm font-medium">
                    الوصف
                </label>
                <textarea
                    id="description"
                    value={data.description}
                    placeholder="أدخل وصف القسم الأكاديمي"
                    onChange={(e) => setData('description', e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.description && <InputError message={errors.description} />}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sort_order" className="mb-2 block text-sm font-medium">
                        ترتيب الظهور
                    </label>
                    <input
                        id="sort_order"
                        type="number"
                        min="0"
                        value={data.sort_order}
                        onChange={(e) => setData('sort_order', parseInt(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                    />
                    {errors.sort_order && <InputError message={errors.sort_order} />}
                </div>

                <div className="flex items-end">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.status}
                            onChange={(e) => setData('status', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-orange-500"
                        />
                        <span className="text-sm font-medium">تفعيل</span>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-lg bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
            >
                {processing ? 'جاري الحفظ...' : submitLabel}
            </button>
        </form>
    );
}
