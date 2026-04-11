import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Code2, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type ProgrammingCourse = {
    id: number;
    title: string;
    duration_months: number;
    sessions_count: number;
    sessions_per_week: number;
    badge: string | null;
    accent_color: string;
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    average_sessions: number;
};

const audienceLabel = 'من 5 إلى 17 سنة';

export default function ProgrammingCoursesIndex({ courses, stats }: { courses: PaginatedData<ProgrammingCourse>; stats: Stats }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/programming-courses/${id}`);
    };

    return (
        <AdminLayout title="المسارات البرمجية">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">التعلم والرحلات</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة كورسات البرمجة</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                تم إلغاء التقسيمات القديمة. جميع الكورسات تظهر الآن ضمن مسار موحد للفئة العمرية من 5 إلى 17 سنة.
                            </p>
                        </div>

                        <Link
                            href="/admin/programming-courses/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <Code2 size={18} />
                            إضافة كورس جديد
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي الكورسات</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">الكورسات النشطة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">{stats.active}</div>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-orange-700">متوسط الجلسات</div>
                        <div className="mt-2 text-3xl font-black text-orange-800">{stats.average_sessions}</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة الكورسات</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">الكورس</th>
                                    <th className="px-4 py-3">الفئة</th>
                                    <th className="px-4 py-3">الخطة</th>
                                    <th className="px-4 py-3">الشارة</th>
                                    <th className="px-4 py-3">اللون</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.data.map((course) => (
                                    <tr key={course.id} className="border-t border-slate-100">
                                        <td className="px-4 py-4 text-slate-500">{course.id}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">{course.title}</td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                                {audienceLabel}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">
                                            {course.duration_months} شهر / {course.sessions_count} جلسة / {course.sessions_per_week} أسبوعيًا
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{course.badge ?? 'بدون شارة'}</td>
                                        <td className="px-4 py-4">
                                            <span
                                                className="inline-flex h-7 w-7 rounded-full border border-slate-200"
                                                style={{ backgroundColor: course.accent_color }}
                                                title={course.accent_color}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {course.status ? 'نشط' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-700">{course.sort_order}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link href={`/admin/programming-courses/${course.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100">
                                                    <Pencil size={16} />
                                                    تعديل
                                                </Link>
                                                <button type="button" onClick={() => onDelete(course.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100">
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {courses.data.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد كورسات برمجة مضافة حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <PaginationLinks links={courses.links} />
            </div>
        </AdminLayout>
    );
}
