import AdminLayout from '../layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CityCreate() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    const submit = (e: any) => {
        e.preventDefault();
        router.post('/admin/cities', { name, slug });
    };

    return (
        <AdminLayout title="إضافة مدينة">
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">اسم المدينة</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium">slug (اختياري)</label>
                    <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
                </div>

                <div>
                    <button type="submit" className="rounded bg-orange-600 px-4 py-2 text-white">حفظ</button>
                </div>
            </form>
        </AdminLayout>
    );
}
