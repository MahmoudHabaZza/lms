import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ClipboardCheck, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Attempt = {
    id: number;
    student?: { id: number; name: string } | null;
    exam?: { id: number; title: string } | null;
    score: number | null;
    started_at?: string | null;
    finished_at?: string | null;
    is_passed?: boolean | null;
    created_at?: string | null;
};

const formatDateTime = (value?: string | null) => (value ? value.replace('T', ' ') : 'غير محدد');

export default function AttemptsIndex({ attempts }: { attempts: PaginatedData<Attempt> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/attempts/${id}`);
    };

    return (
        <AdminLayout title="محاولات الاختبار">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">نتائج التقييم</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة محاولات الاختبار</h1>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                راقب محاولات الطلاب ودرجاتهم وحالة النجاح من مكان واحد.
                            </p>
                        </div>
                        <Link
                            href="/admin/attempts/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <ClipboardCheck size={18} />
                            إضافة محاولة
                        </Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {attempts.data.map((attempt) => (
                        <div key={attempt.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">
                                        المحاولة #{attempt.id} - {attempt.exam?.title ?? 'اختبار غير محدد'}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">{attempt.student?.name ?? 'طالب غير محدد'}</div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                                            الدرجة: {attempt.score ?? 0}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 ${
                                                attempt.is_passed
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}
                                        >
                                            {attempt.is_passed ? 'ناجح' : 'لم يجتز'}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            البداية: {formatDateTime(attempt.started_at)}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            النهاية: {formatDateTime(attempt.finished_at)}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-xs text-slate-400">
                                        تاريخ الإضافة: {attempt.created_at ?? 'غير متوفر'}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={`/admin/attempts/${attempt.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <Pencil size={16} />
                                        تعديل
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(attempt.id)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={16} />
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {attempts.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            لا توجد محاولات اختبار مضافة حاليًا.
                        </div>
                    )}
                </div>
            

                <PaginationLinks links={attempts.links} />
            </div>
        </AdminLayout>
    );
}




