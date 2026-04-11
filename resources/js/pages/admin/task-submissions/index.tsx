import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { FileUp, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Submission = {
    id: number;
    student?: { id: number; name: string } | null;
    task?: { id: number; title: string } | null;
    status: string;
    score: number | null;
    feedback: string | null;
    submission_file_url: string | null;
    created_at: string | null;
};

export default function TaskSubmissionsIndex({ submissions }: { submissions: PaginatedData<Submission> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/task-submissions/${id}`);
    };

    return (
        <AdminLayout title="تسليمات المهام">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">متابعة التسليم</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة تسليمات المهام</h1>
                        </div>
                        <Link href="/admin/task-submissions/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"><FileUp size={18} />إضافة تسليم</Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {submissions.data.map((submission) => (
                        <div key={submission.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{submission.task?.title ?? `مهمة #${submission.id}`}</div>
                                    <div className="mt-1 text-sm text-slate-500">{submission.student?.name ?? 'طالب غير محدد'}</div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{submission.status}</span>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">الدرجة: {submission.score ?? '-'}</span>
                                    </div>
                                    <div className="mt-3 text-sm leading-7 text-slate-600">{submission.feedback || 'لا توجد ملاحظات مضافة.'}</div>
                                    {submission.submission_file_url && (
                                        <a href={submission.submission_file_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-blue-600 hover:underline">فتح الملف المرفق</a>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/task-submissions/${submission.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"><Pencil size={16} />تعديل</Link>
                                    <button type="button" onClick={() => onDelete(submission.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"><Trash2 size={16} />حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {submissions.data.length === 0 && <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">لا توجد تسليمات مهام مضافة حاليًا.</div>}
                </div>
            

                <PaginationLinks links={submissions.links} />
            </div>
        </AdminLayout>
    );
}




