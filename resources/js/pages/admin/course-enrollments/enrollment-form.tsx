import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export type CourseEnrollmentFormData = {
    user_id: number | null;
    programming_course_id: number | null;
    enrolled_at: string;
};

type CourseEnrollmentFormProps = {
    data: CourseEnrollmentFormData;
    setData: {
        (key: 'user_id', value: number | null): void;
        (key: 'programming_course_id', value: number | null): void;
        (key: 'enrolled_at', value: string): void;
    };
    errors: Partial<Record<keyof CourseEnrollmentFormData, string>>;
    students: { id: number; name: string }[];
    courses: { id: number; title: string }[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function CourseEnrollmentForm({ data, setData, errors, students, courses, processing, submitLabel, onSubmit }: CourseEnrollmentFormProps) {
    return (
        <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="user_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">الطالب</label>
                    <select id="user_id" value={data.user_id ?? ''} onChange={(e) => setData('user_id', e.target.value ? Number(e.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                        <option value="">اختر الطالب</option>
                        {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
                    </select>
                    <InputError message={errors.user_id} className="mt-2" />
                </div>
                <div>
                    <label htmlFor="programming_course_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">المسار البرمجي</label>
                    <select id="programming_course_id" value={data.programming_course_id ?? ''} onChange={(e) => setData('programming_course_id', e.target.value ? Number(e.target.value) : null)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                        <option value="">اختر المسار</option>
                        {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                    </select>
                    <InputError message={errors.programming_course_id} className="mt-2" />
                </div>
            </div>
            <div>
                <label htmlFor="enrolled_at" className="mb-2 block text-right text-sm font-semibold text-slate-700">تاريخ الاشتراك</label>
                <input id="enrolled_at" type="datetime-local" value={data.enrolled_at} onChange={(e) => setData('enrolled_at', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                <InputError message={errors.enrolled_at} className="mt-2" />
            </div>
            <button type="submit" disabled={processing} className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50">{submitLabel}</button>
        </form>
    );
}
