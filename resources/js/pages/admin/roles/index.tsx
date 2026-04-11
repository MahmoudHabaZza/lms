import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';


type Role = { id: number; name: string; slug: string; permissions: string[] };

export default function RolesIndex({ roles }: { roles: PaginatedData<Role> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/roles/${id}`);
    };

    return (
        <AdminLayout title="Roles">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
                    <Link href="/admin/roles/create" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add Role</Link>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 text-right text-slate-600">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Permissions</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.data.map((r) => (
                                <tr key={r.id} className="border-t border-slate-100">
                                    <td className="px-4 py-3">{r.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{r.slug}</td>
                                    <td className="px-4 py-3 text-slate-600">{r.permissions.join(', ')}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link href={`/admin/roles/${r.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                                            <button type="button" onClick={() => onDelete(r.id)} className="text-red-600 hover:underline">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No roles found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationLinks links={roles.links} />
            </div>
        </AdminLayout>
    );
}



