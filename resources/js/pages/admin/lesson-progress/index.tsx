import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Gauge, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type ProgressItem = {
    id: number;
    student?: { id: number; name: string } | null;
    lesson?: { id: number; title: string } | null;
    progress: number;
    is_completed: boolean;
};

export default function LessonProgressIndex({ progress }: { progress: PaginatedData<ProgressItem> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/lesson-progress/${id}`);
    };

    return (
        <AdminLayout title="???? ??????">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">?????? ???????</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">????? ???? ??????</h1>
                        </div>
                        <Link href="/admin/lesson-progress/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500">
                            <Gauge size={18} />????? ????
                        </Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {progress.data.map((item) => (
                        <div key={item.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">{item.lesson?.title ?? `??? #${item.id}`}</div>
                                    <div className="mt-1 text-sm text-slate-500">{item.student?.name ?? '???? ??? ????'}</div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-700">??????: {item.progress}%</span>
                                        <span className={`rounded-full px-3 py-1 ${item.is_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {item.is_completed ? '?????' : '??? ??????'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-3">
                                    <Link href={`/admin/lesson-progress/${item.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
                                        <Pencil size={16} />?????
                                    </Link>
                                    <button type="button" onClick={() => onDelete(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
                                        <Trash2 size={16} />???
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {progress.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            ?? ???? ????? ???? ????? ??????.
                        </div>
                    )}
                </div>

                <PaginationLinks links={progress.links} />
            </div>
        </AdminLayout>
    );
}
