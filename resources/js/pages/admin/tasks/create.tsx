import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

export default function TaskCreate({ courses }: { courses: { id: number; title: string }[] }) {
    const { data, setData, post, processing, errors } = useForm({ title: '', description: '', course_id: '', due_date: '' });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/tasks');
    };

    return (
        <AdminLayout title="إضافة مهمة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">إضافة مهمة جديدة</h1></div>
                    <Link href="/admin/tasks" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">عنوان المهمة</label>
                        <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الوصف</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7" rows={6} />
                        <InputError message={errors.description} className="mt-2" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الكورس</label>
                            <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                <option value="">اختر الكورس</option>
                                {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                            </select>
                            <InputError message={errors.course_id} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">موعد التسليم</label>
                            <input type="datetime-local" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
                            <InputError message={errors.due_date} className="mt-2" />
                        </div>
                    </div>
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ المهمة</button>
                </form>
            </div>
        </AdminLayout>
    );
}
