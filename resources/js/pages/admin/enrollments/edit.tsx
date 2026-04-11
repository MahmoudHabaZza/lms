import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';

export default function EnrollmentEdit({
    enrollment,
    students,
    courses,
}: {
    enrollment: { id: number; student_id: number | null; course_id: number | null; enrolled_at: string | null };
    students: { id: number; name: string }[];
    courses: { id: number; title: string }[];
}) {
    const { data, setData, put, processing } = useForm({
        student_id: enrollment.student_id ? String(enrollment.student_id) : '',
        course_id: enrollment.course_id ? String(enrollment.course_id) : '',
        enrolled_at: enrollment.enrolled_at ?? '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/enrollments/${enrollment.id}`);
    };

    return (
        <AdminLayout title="تعديل طلب تسجيل">
            <div className="mx-auto w-full max-w-4xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل طلب التسجيل</h1>
                        <p className="mt-1 text-sm text-slate-500">راجع الطالب والكورس وموعد التسجيل قبل الحفظ.</p>
                    </div>
                    <Link href="/admin/enrollments" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>

                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الطالب</label>
                            <select value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                <option value="">اختر الطالب</option>
                                {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس</label>
                            <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                <option value="">اختر الكورس</option>
                                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">تاريخ التسجيل</label>
                        <input type="datetime-local" value={data.enrolled_at} onChange={(e) => setData('enrolled_at', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                    </div>
                    <button type="submit" disabled={processing} className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50">حفظ التعديلات</button>
                </form>
            </div>
        </AdminLayout>
    );
}
