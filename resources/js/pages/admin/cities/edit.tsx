import { confirmDelete } from '@/lib/confirm';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../layouts/admin-layout';


export default function CityEdit() {
    const page = usePage();
    const city = page.props.city as any;
    const [name, setName] = useState(city?.name ?? '');
    const [slug, setSlug] = useState(city?.slug ?? '');

    const submit = (e: any) => {
        e.preventDefault();
        router.post(`/admin/cities/${city.id}`, { _method: 'PUT', name, slug });
    };

    const remove = async () => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/cities/${city.id}`);
    };

    return (
        <AdminLayout title="تعديل المدينة">
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">اسم المدينة</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium">slug (اختياري)</label>
                    <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                </div>

                <div className="flex gap-2">
                    <button type="submit" className="rounded bg-orange-600 px-4 py-2 text-white">حفظ</button>
                    <button type="button" onClick={remove} className="rounded bg-red-600 px-4 py-2 text-white">حذف</button>
                </div>
            </form>
        </AdminLayout>
    );
}


