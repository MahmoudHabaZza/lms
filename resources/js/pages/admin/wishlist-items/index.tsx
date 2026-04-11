import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Item = { id: number; student: { name: string } | null; course: { title: string } | null; created_at: string | null };

export default function WishlistIndex({ items }: { items: PaginatedData<Item> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/wishlist-items/${id}`);
    };

    return (
        <AdminLayout title="المفضلة">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">اهتمامات الطلاب</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة المفضلة</h1>
                        </div>
                        <Link href="/admin/wishlist-items/create" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"><Heart size={18} />إضافة عنصر</Link>
                    </div>
                </section>

                <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-right text-slate-600">
                                <tr>
                                    <th className="px-4 py-3">المعرف</th>
                                    <th className="px-4 py-3">الطالب</th>
                                    <th className="px-4 py-3">الكورس</th>
                                    <th className="px-4 py-3">تاريخ الإضافة</th>
                                    <th className="px-4 py-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.data.map((item) => (
                                    <tr key={item.id} className="border-t border-slate-100">
                                        <td className="px-4 py-4 text-slate-500">{item.id}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">{item.student?.name ?? 'غير محدد'}</td>
                                        <td className="px-4 py-4 text-slate-600">{item.course?.title ?? 'غير محدد'}</td>
                                        <td className="px-4 py-4 text-slate-600">{item.created_at ?? '-'}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-start gap-3">
                                                <Link href={`/admin/wishlist-items/${item.id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"><Pencil size={16} />تعديل</Link>
                                                <button type="button" onClick={() => onDelete(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"><Trash2 size={16} />حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {items.data.length === 0 && (
                                    <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">لا توجد عناصر مفضلة مضافة حاليًا.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            

                <PaginationLinks links={items.links} />
            </div>
        </AdminLayout>
    );
}




