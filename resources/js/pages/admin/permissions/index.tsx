import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';


export default function PermissionsIndex({ permissions }: { permissions: PaginatedData<any> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/permissions/${id}`);
    };

    return (
        <AdminLayout title="Permissions">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Permissions</h1>
                    <Link href="/admin/permissions/create" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Permission</Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-right text-slate-600">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.data.map((p) => (
                                <tr key={p.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">{p.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.slug}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/admin/permissions/${p.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                            <button type="button" onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {permissions.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No permissions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationLinks links={permissions.links} />
            </div>
        </AdminLayout>
    );
}



