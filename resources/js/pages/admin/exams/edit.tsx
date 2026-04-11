import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

type Exam = {
    id: number;
    title: string;
    course_id: number | null;
    description: string | null;
    time_limit: number | null;
    total_marks: number | null;
    publish_date: string | null;
};

export default function ExamEdit({ exam, courses }: { exam: Exam; courses: { id: number; title: string }[] }) {
    const { data, setData, put, processing, errors } = useForm({
        title: exam.title ?? '',
        course_id: exam.course_id ? String(exam.course_id) : '',
        description: exam.description ?? '',
        time_limit: exam.time_limit ? String(exam.time_limit) : '',
        total_marks: exam.total_marks ? String(exam.total_marks) : '0',
        publish_date: exam.publish_date ?? '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/exams/${exam.id}`);
    };

    return (
        <AdminLayout title="تعديل اختبار">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">تعديل الاختبار</h1></div>
                    <Link href="/admin/exams" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان الاختبار</label>
                        <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس</label>
                        <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                            {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                        </select>
                        <InputError message={errors.course_id} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7" />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">المدة بالدقائق</label>
                            <input value={data.time_limit} onChange={(e) => setData('time_limit', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                            <InputError message={errors.time_limit} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الدرجة الكلية</label>
                            <input value={data.total_marks} onChange={(e) => setData('total_marks', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                            <InputError message={errors.total_marks} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">تاريخ النشر</label>
                            <input type="date" value={data.publish_date} onChange={(e) => setData('publish_date', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                            <InputError message={errors.publish_date} className="mt-2" />
                        </div>
                    </div>
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ التعديلات</button>
                </form>
            </div>
        </AdminLayout>
    );
}
