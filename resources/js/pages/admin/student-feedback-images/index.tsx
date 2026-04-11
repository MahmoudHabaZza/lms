import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { ImagePlus, MessageSquareQuote, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type FeedbackImage = {
    id: number;
    student_name: string;
    caption: string | null;
    image_path: string;
    image_url: string | null;
    status: boolean;
    sort_order: number;
};

type Stats = {
    total: number;
    active: number;
    max_sort_order: number;
};

export default function StudentFeedbackImagesIndex({ feedbackImages, stats }: { feedbackImages: PaginatedData<FeedbackImage>; stats: Stats }) {

    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/student-feedback-images/${id}`);
    };

    return (
        <AdminLayout title="آراء الطلاب">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الثقة والانطباع</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة آراء الطلاب</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                اعرض صور وتجارب الطلاب بشكل منظم وموثوق، مع عبارات قصيرة تساعد في إبراز الأثر
                                الإيجابي للمنصة على الأطفال وأولياء الأمور.
                            </p>
                        </div>

                        <Link
                            href="/admin/student-feedback-images/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <ImagePlus size={18} />
                            إضافة رأي جديد
                        </Link>
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-slate-500">إجمالي الآراء</div>
                        <div className="mt-2 text-3xl font-black text-slate-900">{stats.total}</div>
                    </div>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-emerald-700">الآراء المنشورة</div>
                        <div className="mt-2 text-3xl font-black text-emerald-800">{stats.active}</div>
                    </div>
                    <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5 text-right shadow-sm">
                        <div className="text-sm font-semibold text-orange-700">أعلى ترتيب</div>
                        <div className="mt-2 text-3xl font-black text-orange-800">
                            {stats.max_sort_order}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4 text-right">
                        <h2 className="text-lg font-bold text-slate-900">قائمة الآراء</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            يمكنك تعديل اسم الطالب والصورة والنص المختصر وحالة النشر من هنا.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">المعاينة</th>
                                    <th className="px-4 py-3">اسم الطالب</th>
                                    <th className="px-4 py-3">العبارة</th>
                                    <th className="px-4 py-3">الحالة</th>
                                    <th className="px-4 py-3">الترتيب</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbackImages.data.map((feedbackImage) => (
                                    <tr key={feedbackImage.id} className="border-t border-slate-100 align-top">
                                        <td className="px-4 py-4 text-slate-500">{feedbackImage.id}</td>
                                        <td className="px-4 py-4">
                                            <img
                                                src={feedbackImage.image_url ?? feedbackImage.image_path}
                                                alt={feedbackImage.student_name}
                                                className="h-16 w-24 rounded-2xl border border-slate-200 object-cover shadow-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">{feedbackImage.student_name}</td>
                                        <td className="max-w-sm px-4 py-4 text-slate-600">
                                            {feedbackImage.caption ? (
                                                <div className="flex items-start gap-2 text-right">
                                                    <MessageSquareQuote size={16} className="mt-1 shrink-0 text-orange-500" />
                                                    <span className="line-clamp-3 leading-7">{feedbackImage.caption}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">لا توجد عبارة مضافة</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                    feedbackImage.status
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {feedbackImage.status ? 'منشور' : 'مخفي'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold text-slate-700">{feedbackImage.sort_order}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link
                                                    href={`/admin/student-feedback-images/${feedbackImage.id}/edit`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                                                >
                                                    <Pencil size={16} />
                                                    تعديل
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete(feedbackImage.id)}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                                                >
                                                    <Trash2 size={16} />
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {feedbackImages.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                                            لا توجد آراء طلاب مضافة حاليًا.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

                <PaginationLinks links={feedbackImages.links} />
            </div>
        </AdminLayout>
    );
}











