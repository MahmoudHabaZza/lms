import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LayoutTemplate, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type AcademySection = {
    id: number;
    title: string;
    description: string;
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    average_sort_order: number;
};

export default function AcademySectionsIndex({ sections, stats }: { sections: PaginatedData<AcademySection>; stats: Stats }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/academy-sections/${id}`);
    };

    return (
        <AdminLayout title="أقسام الأكاديمية">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">المحتوى الرئيسي</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة أقسام الأكاديمية</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                هذه الأقسام تعرض هوية الأكاديمية ورسالتها في الصفحة الرئيسية. حافظ على نص واضح وترتيب منطقي.
                            </p>
                        </div>
                        <Link
                            href="/admin/academy-sections/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <LayoutTemplate size={18} />
                            إضافة قسم جديد
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي الأقسام</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">الأقسام النشطة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">
                            {stats.active}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-orange-700">متوسط الترتيب</div>
                        <div className="mt-2 text-3xl font-black text-orange-800">
                            {stats.average_sort_order}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة الأقسام</h2>
                        <p className="mt-1 text-sm text-slate-500">يمكنك تعديل النص أو تغيير الحالة أو إعادة ترتيب الأقسام.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">العنوان</th>
                                    <th className="px-4 py-3">الوصف</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.data.map((section) => (
                                    <tr key={section.id} className="border-t border-slate-100 align-top">
                                        <td className="px-4 py-4 text-slate-500">{section.id}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">{section.title}</td>
                                        <td className="max-w-xl px-4 py-4 text-slate-600">
                                            <p className="line-clamp-3 leading-7">{section.description}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    section.status
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {section.status ? 'نشط' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-700">{section.sort_order}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link
                                                    href={`/admin/academy-sections/${section.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <Pencil size={16} />
                                                    تعديل
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(section.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {sections.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد أقسام مضافة حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

                <PaginationLinks links={sections.links} />
            </div>
        </AdminLayout>
    );
}










