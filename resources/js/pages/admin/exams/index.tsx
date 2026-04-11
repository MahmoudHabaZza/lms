import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ClipboardPenLine, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Exam = {
    id: number;
    title: string;
    course_title?: string | null;
    description?: string | null;
    time_limit?: number | null;
    total_marks?: number | null;
    publish_date?: string | null;
};

export default function ExamsIndex({ exams }: { exams: PaginatedData<Exam> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/exams/${id}`);
    };

    return (
        <AdminLayout title="الاختبارات">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">التقييم والاختبار</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة الاختبارات</h1>
                        </div>
                        <Link href="/admin/exams/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"><ClipboardPenLine size={18} />إضافة اختبار</Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {exams.data.map((exam) => (
                        <div key={exam.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{exam.title}</div>
                                    <div className="mt-1 text-sm text-slate-500">{exam.course_title ?? 'بدون كورس مرتبط'}</div>
                                    <div className="mt-2 text-sm leading-7 text-slate-600">{exam.description || 'لا يوجد وصف للاختبار.'}</div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">المدة: {exam.time_limit ?? 0} دقيقة</span>
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">الدرجة الكلية: {exam.total_marks ?? 0}</span>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{exam.publish_date || 'بدون تاريخ نشر'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/exams/${exam.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"><Pencil size={16} />تعديل</Link>
                                    <button type="button" onClick={() => onDelete(exam.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"><Trash2 size={16} />حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {exams.data.length === 0 && <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">لا توجد اختبارات مضافة حاليًا.</div>}
                </div>
            

                <PaginationLinks links={exams.links} />
            </div>
        </AdminLayout>
    );
}




