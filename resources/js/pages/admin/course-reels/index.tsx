import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ExternalLink, Film, Pencil, PlayCircle, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type CourseReel = {
    id: number;
    course_id: number | null;
    course_title: string | null;
    title: string | null;
    cover_image: string | null;
    cover_image_url: string | null;
    video_path: string | null;
    video_path_url: string | null;
    video_url: string | null;
    description: string | null;
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    linked_courses: number;
};

export default function CourseReelsIndex({ reels, stats }: { reels: PaginatedData<CourseReel>; stats: Stats }) {

    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/course-reels/${id}`);
    };

    return (
        <AdminLayout title="ريلز الكورسات">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">عرض البرامج</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة ريلز الكورسات</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                استخدم هذه الريلز لعرض نبذة بصرية سريعة عن الكورسات بطريقة جاذبة وسهلة المشاركة.
                            </p>
                        </div>

                        <Link
                            href="/admin/course-reels/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <Film size={18} />
                            إضافة ريل جديد
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي الريلز</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">الريلز المنشورة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">{stats.active}</div>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-orange-700">مرتبطة بكورسات</div>
                        <div className="mt-2 text-3xl font-black text-orange-800">
                            {stats.linked_courses}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة ريلز الكورسات</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع الكورس المرتبط، الغلاف، نوع الفيديو، والوصف المختصر لكل ريل.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">الكورس</th>
                                    <th className="px-4 py-3">الغلاف</th>
                                    <th className="px-4 py-3">الفيديو</th>
                                    <th className="px-4 py-3">الوصف</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reels.data.map((reel) => {
                                    const videoLink = reel.video_path_url ?? reel.video_url;

                                    return (
                                        <tr key={reel.id} className="border-t border-slate-100 align-top">
                                            <td className="px-4 py-4 text-slate-500">{reel.id}</td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="font-semibold text-slate-900">
                                                    {reel.course_title ?? 'غير مرتبط بكورس'}
                                                </div>
                                                {reel.title && <div className="mt-1 text-xs text-slate-500">{reel.title}</div>}
                                            </td>
                                            <td className="px-4 py-4">
                                                {reel.cover_image_url ? (
                                                    <img
                                                        src={reel.cover_image_url}
                                                        alt={reel.title ?? reel.course_title ?? 'غلاف الريل'}
                                                        className="h-14 w-20 rounded-2xl border border-slate-200 object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <span className="text-slate-400">بدون غلاف</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {videoLink ? (
                                                    <a
                                                        href={videoLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        <PlayCircle size={14} />
                                                        مشاهدة
                                                        <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">لا يوجد فيديو</span>
                                                )}
                                            </td>
                                            <td className="max-w-sm px-4 py-4 text-slate-600">
                                                <span className="line-clamp-3 leading-7">
                                                    {reel.description || 'لا يوجد وصف مضاف.'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        reel.status
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-rose-100 text-rose-700'
                                                    }`}
                                                >
                                                    {reel.status ? 'منشور' : 'مخفي'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-slate-700">{reel.sort_order}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-start gap-3">
                                                    <Link
                                                        href={`/admin/course-reels/${reel.id}/edit`}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        <Pencil size={16} />
                                                        تعديل
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(reel.id)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                                                    >
                                                        <Trash2 size={16} />
                                                        حذف
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {reels.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد ريلز كورسات مضافة حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

                <PaginationLinks links={reels.links} />
            </div>
        </AdminLayout>
    );
}











