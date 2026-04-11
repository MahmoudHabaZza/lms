import { router } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';
import { useState } from 'react';

export default function CategoryEdit({ category }: { category: { id: number; name: string; slug: string | null } }) {
    const [name, setName] = useState(category.name);
    const [slug, setSlug] = useState(category.slug ?? '');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/admin/categories/${category.id}`, { name, slug });
    };

    return (
        <AdminLayout title="تعديل التصنيف">
            <div className="mx-auto w-full max-w-4xl">
                <form onSubmit={submit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل بيانات التصنيف</h1>
                    </div>

                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">اسم التصنيف</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">المعرّف النصي</label>
                        <input
                            dir="ltr"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                        />
                    </div>

                    <div className="flex justify-start">
                        <button type="submit" className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white">
                            حفظ التعديلات
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
