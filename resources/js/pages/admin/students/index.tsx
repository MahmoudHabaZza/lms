import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { GraduationCap, Search, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '../layouts/admin-layout';

type Course = {
    id: number;
    title: string;
};

type Student = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    phone_number: string | null;
    is_active: boolean;
    created_at: string | null;
    assigned_courses_count: number;
    assigned_courses: Course[];
};

type Filters = {
    search: string;
    status: string;
};

type Stats = {
    total: number;
    active: number;
    inactive: number;
};

export default function StudentsIndex({
    students,
    filters,
    stats,
}: {
    students: PaginatedData<Student>;
    filters: Filters;
    stats: Stats;
}) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);

    const applyFilters = (nextSearch = search, nextStatus = status) => {
        router.get(
            '/admin/students',
            { search: nextSearch, status: nextStatus },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleDelete = async (student: Student) => {
        const confirmed = await confirmDelete({
            title: 'حذف الطالب',
            text: `سيتم حذف حساب ${student.name} وكل البيانات المرتبطة به نهائيًا. لا يمكن التراجع عن هذا الإجراء.`,
            confirmButtonText: 'نعم، احذف الطالب',
        });

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/students/${student.id}`);
    };

    return (
        <AdminLayout title="الطلاب">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">
                                إدارة الحسابات التعليمية
                            </div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">
                                قسم الطلاب
                            </h1>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                من هنا يمكنك إدارة حسابات الطلاب، تفعيلها،
                                وإسناد الكورسات المناسبة لكل طالب.
                            </p>
                        </div>
                        <Link
                            href="/admin/students/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <UserPlus size={18} />
                            إضافة طالب
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">
                            إجمالي الطلاب
                        </div>
                        <div className="mt-3 text-3xl font-black text-slate-900">
                            {stats.total}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">
                            الحسابات المفعلة
                        </div>
                        <div className="mt-3 text-3xl font-black text-emerald-700">
                            {stats.active}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">
                            الحسابات غير المفعلة
                        </div>
                        <div className="mt-3 text-3xl font-black text-rose-700">
                            {stats.inactive}
                        </div>
                    </div>
                </div>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_220px_auto]">
                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="ابحث بالاسم أو البريد أو اسم المستخدم"
                                className="w-full bg-transparent text-right text-sm outline-none"
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        applyFilters();
                                    }
                                }}
                            />
                        </label>

                        <select
                            value={status}
                            onChange={(event) => {
                                const nextStatus = event.target.value;
                                setStatus(nextStatus);
                                applyFilters(search, nextStatus);
                            }}
                            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right text-sm transition outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        >
                            <option value="all">كل الحالات</option>
                            <option value="active">مفعل</option>
                            <option value="inactive">غير مفعل</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => applyFilters()}
                            className="min-h-11 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 md:col-span-2 lg:col-span-1"
                        >
                            تطبيق البحث
                        </button>
                    </div>
                </section>

                <div className="space-y-4">
                    {students.data.map((student) => (
                        <article
                            key={student.id}
                            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                        <h2 className="text-lg font-black text-slate-900">
                                            {student.name}
                                        </h2>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                student.is_active
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}
                                        >
                                            {student.is_active
                                                ? 'مفعل'
                                                : 'غير مفعل'}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-slate-500">
                                        {student.email}
                                        {student.username
                                            ? ` • ${student.username}`
                                            : ''}
                                    </div>
                                    <div className="mt-1 text-sm text-slate-500">
                                        {student.phone_number ||
                                            'لا يوجد رقم هاتف مسجل'}{' '}
                                        • تاريخ الإضافة:{' '}
                                        {student.created_at || '-'}
                                    </div>

                                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                                        {student.assigned_courses.length > 0 ? (
                                            student.assigned_courses.map(
                                                (course) => (
                                                    <span
                                                        key={course.id}
                                                        className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700"
                                                    >
                                                        {course.title}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                بدون كورسات مخصصة
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-end gap-3">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                                        <div className="text-xs font-semibold text-slate-500">
                                            الكورسات
                                        </div>
                                        <div className="mt-1 text-lg font-black text-slate-900">
                                            {student.assigned_courses_count}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/students/${student.id}/edit`}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100"
                                    >
                                        <GraduationCap size={16} />
                                        إدارة الحساب
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(student)}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                                    >
                                        <Trash2 size={16} />
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}

                    {students.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            لا توجد نتائج مطابقة للبحث الحالي.
                        </div>
                    )}
                </div>

                <PaginationLinks links={students.links} />
            </div>
        </AdminLayout>
    );
}
