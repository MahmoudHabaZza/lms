import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export type CertificateRequestFormData = {
    student_id: number | null;
    instructor_id: number | null;
    course_title: string;
    status: string;
};

type UserOption = {
    id: number;
    name: string;
};

type CertificateRequestFormProps = {
    data: CertificateRequestFormData;
    setData: {
        (key: 'student_id', value: number | null): void;
        (key: 'instructor_id', value: number | null): void;
        (key: 'course_title', value: string): void;
        (key: 'status', value: string): void;
    };
    errors: Partial<Record<keyof CertificateRequestFormData, string>>;
    students: UserOption[];
    instructors: UserOption[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const statusOptions = [
    { value: 'pending', label: 'قيد المراجعة' },
    { value: 'approved', label: 'مقبول' },
    { value: 'rejected', label: 'مرفوض' },
];

export default function RequestForm({
    data,
    setData,
    errors,
    students,
    instructors,
    processing,
    submitLabel,
    onSubmit,
}: CertificateRequestFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <section className="rounded-[24px] border border-orange-100 bg-orange-50/70 p-5">
                <div className="text-right">
                    <p className="text-xs font-bold tracking-[0.3em] text-orange-500">متابعة الشهادات</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات طلب الشهادة</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        استخدم هذه الصفحة لإدارة الطلبات القادمة من الطلاب وربطها بالمدرب المناسب وحالة المعالجة.
                    </p>
                </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="student_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الطالب
                    </label>
                    <select
                        id="student_id"
                        value={data.student_id ?? ''}
                        onChange={(event) => setData('student_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر الطالب</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.student_id} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="instructor_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        المدرب
                    </label>
                    <select
                        id="instructor_id"
                        value={data.instructor_id ?? ''}
                        onChange={(event) => setData('instructor_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر المدرب</option>
                        {instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.instructor_id} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="course_title" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        اسم الكورس
                    </label>
                    <input
                        id="course_title"
                        value={data.course_title}
                        onChange={(event) => setData('course_title', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    />
                    <InputError message={errors.course_title} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="status" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الحالة
                    </label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(event) => setData('status', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.status} className="mt-2" />
                </div>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
