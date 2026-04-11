import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';

type SchoolRow = {
    id: number;
    name: string;
    city?: {
        name?: string;
    };
};

export default function SchoolsIndex({ schools }: { schools: PaginatedData<SchoolRow> }) {
    const remove = async (id: number) => {
        if (!(await confirmDelete())) {
            return;
        }

        router.delete(`/admin/schools/${id}`);
    };

    return (
        <AdminLayout title="???????">
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">????? ???????</h2>
                    <Link href="/admin/schools/create" className="rounded-2xl bg-orange-600 px-4 py-2 text-white shadow-sm">
                        ????? ?????
                    </Link>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 text-right text-sm font-semibold text-slate-600">
                            <tr>
                                <th className="px-4 py-3">?????</th>
                                <th className="px-4 py-3">???????</th>
                                <th className="px-4 py-3">????????</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-right text-sm text-slate-700">
                            {schools.data.map((school) => (
                                <tr key={school.id}>
                                    <td className="px-4 py-3">{school.name}</td>
                                    <td className="px-4 py-3">{school.city?.name ?? ''}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-start gap-3">
                                            <Link href={`/admin/schools/${school.id}/edit`} className="font-semibold text-blue-600">
                                                ?????
                                            </Link>
                                            <button type="button" onClick={() => remove(school.id)} className="font-semibold text-red-600">
                                                ???
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {schools.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                        ?? ???? ????? ????? ??????.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationLinks links={schools.links} />
            </div>
        </AdminLayout>
    );
}
