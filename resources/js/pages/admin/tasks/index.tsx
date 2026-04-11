import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ClipboardList, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Task = { id: number; title: string; description: string | null; course_id: number | null; course_title?: string | null; due_date?: string | null };

export default function TasksIndex({ tasks }: { tasks: PaginatedData<Task> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/tasks/${id}`);
    };

    return (
        <AdminLayout title="المهام">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الواجبات والتطبيق</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة المهام</h1>
                        </div>
                        <Link href="/admin/tasks/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"><ClipboardList size={18} />إضافة مهمة</Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {tasks.data.map((task) => (
                        <div key={task.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">{task.title}</div>
                                    <div className="mt-2 text-sm leading-7 text-slate-600">{task.description || 'لا يوجد وصف للمهمة.'}</div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{task.course_title || `الكورس #${task.course_id ?? '-'}`}</span>
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">{task.due_date || 'بدون موعد تسليم'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/tasks/${task.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"><Pencil size={16} />تعديل</Link>
                                    <button type="button" onClick={() => onDelete(task.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"><Trash2 size={16} />حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">لا توجد مهام مضافة حاليًا.</div>
                    )}
                </div>
            

                <PaginationLinks links={tasks.links} />
            </div>
        </AdminLayout>
    );
}




