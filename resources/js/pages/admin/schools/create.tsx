import { router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AdminLayout from '../layouts/admin-layout';

type City = {
    id: number;
    name: string;
};

type SchoolCreatePageProps = {
    cities: City[];
};

export default function SchoolCreate() {
    const page = usePage<SchoolCreatePageProps>();
    const cities = page.props.cities ?? [];

    const [name, setName] = useState('');
    const [cityId, setCityId] = useState('');
    const [address, setAddress] = useState('');

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post('/admin/schools', { name, city_id: cityId, address });
    };

    return (
        <AdminLayout title="إضافة مدرسة">
            <form onSubmit={submit} className="space-y-4 rounded-3xl border border-orange-200/60 bg-white p-6 shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-slate-700">اسم المدرسة</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">المدينة</label>
                    <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-2">
                        <option value="">اختر المدينة</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">العنوان (اختياري)</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-2xl border px-3 py-2" />
                </div>

                <div>
                    <button type="submit" className="rounded-2xl bg-orange-600 px-4 py-2 text-white">
                        حفظ
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
