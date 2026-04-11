import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { BookOpen, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type Course = {
    id: number;
    thumbnail: string | null;
    title: string;
    short_description: string | null;
    price: number | null;
    total_duration_minutes: number | null;
    duration_months: number | null;
    sessions_count: number | null;
    sessions_per_week: number | null;
    badge?: string | null;
    accent_color: string;
    status: boolean;
    sort_order: number;
    instructor?: { id: number; name: string } | null;
    category?: { id: number; name: string } | null;
};

type Stats = {
    total: number;
    active: number;
    average_sessions: number;
};

const audienceLabel = 'من 5 إلى 17 سنة';

export default function CoursesIndex({ courses, stats }: { courses: PaginatedData<Course>; stats: Stats }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/courses/${id}`);
    };

    return (
        <AdminLayout title="الكورسات">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">التعلم والمحتوى</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة الكورسات</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                هذه الشاشة أصبحت المصدر الوحيد لإدارة كل الكورسات بعد دمج المسارات البرمجية معها في كيان واحد.
                            </p>
                        </div>
                        <Link href="/admin/courses/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500">
                            <BookOpen size={18} />
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

                <div className="grid gap-4 xl:grid-cols-2">
                    {courses.data.map((course) => (
                        <article key={course.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                            <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                                <div className="relative min-h-[220px] bg-slate-100">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">بدون صورة</div>
                                    )}
                                    <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                                        {audienceLabel}
                                    </span>
                                </div>

                                <div className="space-y-4 p-5 text-right">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => onDelete(course.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100">
                                                <Trash2 size={16} />
                                                حذف
                                            </button>
                                            <Link href={`/admin/courses/${course.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100">
                                                <Pencil size={16} />
                                                تعديل
                                            </Link>
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-400">#{course.id}</div>
                                            <h2 className="text-xl font-black text-slate-900">{course.title}</h2>
                                        </div>
                                    </div>

                                    <p className="text-sm leading-7 text-slate-600">{course.short_description || 'لا يوجد وصف مختصر مضاف.'}</p>

                                    <div className="flex flex-wrap justify-end gap-2">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {course.duration_months ?? 0} شهر
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {course.sessions_count ?? 0} جلسة
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {course.sessions_per_week ?? 0} أسبوعيًا
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {course.total_duration_minutes ?? 0} دقيقة
                                        </span>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="text-xs font-semibold text-slate-500">المدرب</div>
                                            <div className="mt-1 font-bold text-slate-900">{course.instructor?.name ?? 'غير محدد'}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="text-xs font-semibold text-slate-500">التصنيف</div>
                                            <div className="mt-1 font-bold text-slate-900">{course.category?.name ?? 'بدون تصنيف'}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-7 w-7 rounded-full border border-slate-200" style={{ backgroundColor: course.accent_color }} />
                                            <span className="text-xs font-semibold text-slate-500">ترتيب الظهور: {course.sort_order}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {course.badge ? (
                                                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">{course.badge}</span>
                                            ) : null}
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {course.status ? 'نشط' : 'مخفي'}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {course.price ?? 0} جنيه
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}

                    {courses.data.length === 0 && (
                        <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm xl:col-span-2">
                            لا توجد كورسات مضافة حاليًا.
                        </div>
                    )}
                </div>

                <PaginationLinks links={courses.links} />
            </div>
        </AdminLayout>
    );
}
