import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';

export default function WishlistEdit({
    item,
    students,
    courses,
}: {
    item: { id: number; student_id: number | null; course_id: number | null };
    students: { id: number; name: string }[];
    courses: { id: number; title: string }[];
}) {
    const { data, setData, put, processing } = useForm({
        student_id: item.student_id ? String(item.student_id) : '',
        course_id: item.course_id ? String(item.course_id) : '',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/wishlist-items/${item.id}`);
    };

    return (
        <AdminLayout title="تعديل عنصر المفضلة">
            <div className="mx-auto w-full max-w-4xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل عنصر المفضلة</h1>
                    </div>
                    <Link href="/admin/wishlist-items" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
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
                    <button type="submit" disabled={processing} className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50">حفظ التعديلات</button>
                </form>
            </div>
        </AdminLayout>
    );
}
