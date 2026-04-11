import { confirmDelete } from '@/lib/confirm';
import { router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import AdminLayout from '../layouts/admin-layout';


type City = {
    id: number;
    name: string;
};

type School = {
    id: number;
    name: string;
    address: string | null;
    city_id: number;
    city?: City | null;
};

type SchoolEditPageProps = {
    school: School;
    cities: City[];
};

export default function SchoolEdit() {
    const page = usePage<SchoolEditPageProps>();
    const school = page.props.school;
    const cities = page.props.cities ?? [];

    const [name, setName] = useState(school?.name ?? '');
    const [cityId, setCityId] = useState(String(school?.city_id ?? school?.city?.id ?? ''));
    const [address, setAddress] = useState(school?.address ?? '');

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.post(`/admin/schools/${school.id}`, { _method: 'PUT', name, city_id: cityId, address });
    };

    const remove = async () => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/schools/${school.id}`);
    };

    return (
        <AdminLayout title="تعديل المدرسة">
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

                <div className="flex gap-2">
                    <button type="submit" className="rounded-2xl bg-orange-600 px-4 py-2 text-white">
                        حفظ
                    </button>
                    <button type="button" onClick={remove} className="rounded-2xl bg-red-600 px-4 py-2 text-white">
                        حذف
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}


