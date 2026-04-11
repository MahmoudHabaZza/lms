import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

export default function TaskSubmissionCreate({
    students,
    tasks,
}: {
    students: { id: number; name: string }[];
    tasks: { id: number; title: string }[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        task_id: tasks[0]?.id ? String(tasks[0].id) : '',
        student_id: students[0]?.id ? String(students[0].id) : '',
        file: null as File | null,
        feedback: '',
        score: '',
        status: 'pending',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/task-submissions', { forceFormData: true });
    };

    return (
        <AdminLayout title="إضافة تسليم مهمة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">إضافة تسليم مهمة</h1></div>
                    <Link href="/admin/task-submissions" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">المهمة</label>
                            <select value={data.task_id} onChange={(e) => setData('task_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">{tasks.map((task) => <option key={task.id} value={task.id}>{task.title}</option>)}</select>
                            <InputError message={errors.task_id} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الطالب</label>
                            <select value={data.student_id} onChange={(e) => setData('student_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select>
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">ملف التسليم</label>
                        <input type="file" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm" />
                        <InputError message={errors.file} className="mt-2" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الدرجة</label>
                            <input value={data.score} onChange={(e) => setData('score', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                            <InputError message={errors.score} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الحالة</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                <option value="pending">قيد المراجعة</option>
                                <option value="graded">تم التقييم</option>
                                <option value="rejected">مرفوض</option>
                            </select>
                            <InputError message={errors.status} className="mt-2" />
                        </div>
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">ملاحظات التقييم</label>
                        <textarea value={data.feedback} onChange={(e) => setData('feedback', e.target.value)} rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7" />
                        <InputError message={errors.feedback} className="mt-2" />
                    </div>
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ التسليم</button>
                </form>
            </div>
        </AdminLayout>
    );
}
