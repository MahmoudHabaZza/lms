import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { CircleHelp, Pencil, Trash2, Video } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Faq = {
    id: number;
    question: string;
    answer_type: 'text' | 'video';
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    video: number;
};

export default function FaqIndex({ faqs, stats }: { faqs: PaginatedData<Faq>; stats: Stats }) {

    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/faqs/${id}`);
    };

    return (
        <AdminLayout title="الأسئلة الشائعة">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الدعم والمحتوى</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة الأسئلة الشائعة</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                أنشئ إجابات واضحة وسريعة تساعد أولياء الأمور والطلاب على فهم المنصة والخدمات
                                بدون تشتت، مع إمكانية استخدام إجابات نصية أو فيديوهات قصيرة.
                            </p>
                        </div>

                        <Link
                            href="/admin/faqs/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <CircleHelp size={18} />
                            إضافة سؤال جديد
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي الأسئلة</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">الأسئلة النشطة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">{stats.active}</div>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-orange-700">إجابات فيديو</div>
                        <div className="mt-2 text-3xl font-black text-orange-800">{stats.video}</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة الأسئلة</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع ترتيب الظهور ونوع الإجابة وحالة النشر لكل سؤال من هنا.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">السؤال</th>
                                    <th className="px-4 py-3">نوع الإجابة</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {faqs.data.map((faq) => (
                                    <tr key={faq.id} className="border-t border-slate-100 align-top">
                                        <td className="px-4 py-4 text-slate-500">{faq.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="text-right">
                                                <div className="font-semibold text-slate-900">{faq.question}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {faq.answer_type === 'video' && <Video size={14} />}
                                                {faq.answer_type === 'video' ? 'فيديو قصير' : 'نص مكتوب'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    faq.status
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {faq.status ? 'منشور' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-700">{faq.sort_order}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link
                                                    href={`/admin/faqs/${faq.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <Pencil size={16} />
                                                    تعديل
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(faq.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {faqs.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد أسئلة شائعة مضافة حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

                <PaginationLinks links={faqs.links} />
            </div>
        </AdminLayout>
    );
}












