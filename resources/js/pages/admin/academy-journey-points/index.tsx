import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Map, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type JourneyPoint = {
    id: number;
    title: string;
    icon: string;
    bubble_color: string;
    bubble_style: string;
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    max_sort_order: number;
};

export default function AcademyJourneyPointsIndex({ journeyPoints, stats }: { journeyPoints: PaginatedData<JourneyPoint>; stats: Stats }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/academy-journey-points/${id}`);
    };

    return (
        <AdminLayout title="نقاط رحلة الأكاديمية">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_52%,#e0f2fe_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-sky-600">رحلة كيد كودر</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة نقاط الرحلة</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                تحكم في نقاط رحلة الأكاديمية التي تظهر في الصفحة الرئيسية: العناوين، الأيقونات، الألوان، وترتيب الظهور.
                            </p>
                        </div>

                        <Link
                            href="/admin/academy-journey-points/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
                        >
                            <Plus size={18} />
                            إضافة نقطة جديدة
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي النقاط</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">النقاط المنشورة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">{stats.active}</div>
                    </div>
                    <div className="rounded-3xl border border-sky-100 bg-sky-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-sky-700">أعلى ترتيب</div>
                        <div className="mt-2 text-3xl font-black text-sky-800">{stats.max_sort_order}</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة نقاط الرحلة</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            يمكنك تعديل المحتوى والأيقونات وترتيب الظهور وحالة النشر من هنا.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">الأيقونة</th>
                                    <th className="px-4 py-3">العنوان</th>
                                    <th className="px-4 py-3">اللون</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {journeyPoints.data.map((point) => (
                                    <tr key={point.id} className="border-t border-slate-100 align-top">
                                        <td className="px-4 py-4 text-slate-500">{point.id}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px]" style={{ borderColor: point.bubble_color, color: point.bubble_color }}>
                                                <Map size={16} />
                                            </div>
                                        </td>
                                        <td className="max-w-xs px-4 py-4 font-semibold text-slate-900">
                                            <div className="line-clamp-2">{point.title}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="h-4 w-4 rounded-full" style={{ backgroundColor: point.bubble_color }} />
                                                <span className="text-xs text-slate-500">{point.bubble_color}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    point.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {point.status ? 'منشور' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-700">{point.sort_order}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link
                                                    href={`/admin/academy-journey-points/${point.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <Pencil size={16} />
                                                    تعديل
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(point.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {journeyPoints.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد نقاط رحلة مضافة حالياً.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PaginationLinks links={journeyPoints.links} />
            </div>
        </AdminLayout>
    );
}
