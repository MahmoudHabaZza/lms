import InputError from '@/components/input-error';
import type { FormEvent } from 'react';

type ResourceFormData = {
    course_id: number | null;
    title: string;
    file: File | null;
    file_url?: string | null;
};

type CourseOption = {
    id: number;
    title: string;
};

type Props = {
    data: ResourceFormData;
    setData: (key: keyof ResourceFormData, value: ResourceFormData[keyof ResourceFormData]) => void;
    errors: Partial<Record<keyof ResourceFormData, string>>;
    courses: CourseOption[];
    processing: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
};

export default function ResourceForm({ data, setData, errors, courses, processing, onSubmit, submitLabel }: Props) {
    const hasCourses = courses.length > 0;

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-right">
                    <div className="text-xs font-bold tracking-[0.3em] text-orange-500">المعلومات الأساسية</div>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات المورد</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">اربط المورد بالكورس المناسب من القائمة حتى يظهر بشكل صحيح داخل المحتوى التعليمي.</p>
                </div>

                <div>
                    <label className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان المورد</label>
                    <input
                        value={data.title}
                        onChange={(event) => setData('title', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس المرتبط</label>
                    <select
                        value={data.course_id ?? ''}
                        onChange={(event) => setData('course_id', event.target.value ? Number(event.target.value) : null)}
                        disabled={!hasCourses}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">{hasCourses ? 'اختر الكورس من القائمة' : 'لا توجد كورسات متاحة حاليًا'}</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    <p className="mt-2 text-right text-xs text-slate-500">لن تحتاج إلى إدخال رقم الكورس يدويًا. اختر الاسم مباشرة من القائمة.</p>
                    <InputError message={errors.course_id} className="mt-2" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الملف</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">رفع المورد</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">ملف المورد</label>
                            <input
                                type="file"
                                onChange={(event) => setData('file', event.target.files?.[0] ?? null)}
                                className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm"
                            />
                            <InputError message={errors.file} className="mt-2" />
                            {data.file_url && (
                                <div className="mt-3 text-right text-sm text-slate-600">
                                    الملف الحالي:{' '}
                                    <a href={data.file_url} target="_blank" rel="noreferrer" className="font-semibold text-blue-600">
                                        فتح الملف
                                    </a>
                                </div>
                            )}
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
