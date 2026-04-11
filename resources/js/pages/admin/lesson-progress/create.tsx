import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

export default function LessonProgressCreate({
    students,
    lessons,
}: {
    students: { id: number; name: string }[];
    lessons: { id: number; title: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({ student_id: students[0]?.id ? String(students[0].id) : '', lesson_id: lessons[0]?.id ? String(lessons[0].id) : '', progress: 0 });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/lesson-progress');
    };

    return (
        <AdminLayout title="إضافة تقدم درس">
            <div className="mx-auto w-full max-w-4xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">إضافة تقدم درس</h1></div>
                    <Link href="/admin/lesson-progress" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الطالب</label>
                            <select value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select>
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الدرس</label>
                            <select value={data.lesson_id} onChange={(e) => setData('lesson_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">{lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}</select>
                            <InputError message={errors.lesson_id} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">نسبة التقدم</label>
                        <input type="number" min={0} max={100} value={data.progress} onChange={(e) => setData('progress', Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                        <InputError message={errors.progress} className="mt-2" />
                    </div>
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ التقدم</button>
                </form>
            </div>
        </AdminLayout>
    );
}
