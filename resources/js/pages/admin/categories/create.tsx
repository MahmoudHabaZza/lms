import { router } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';
import { useState } from 'react';

export default function CategoryCreate() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/categories', { name, slug });
    };

    return (
        <AdminLayout title="إضافة تصنيف">
            <div className="mx-auto w-full max-w-4xl">
                <form onSubmit={submit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة تصنيف جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">أضف اسمًا واضحًا ومعرّفًا نصيًا بسيطًا عند الحاجة.</p>
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
                            حفظ التصنيف
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
