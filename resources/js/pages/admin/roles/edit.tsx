import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import RoleForm from './role-form';

export default function RoleEdit({ role, permissions }: { role: any; permissions: any[] }) {
    const { data, setData, put, processing, errors } = useForm({ name: role.name ?? '', slug: role.slug ?? '', permission_ids: role.permissions ?? [] });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    return (
        <AdminLayout title="Edit Role">
            <div className="mx-auto w-full max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Edit Role</h1>
                    <Link href="/admin/roles" className="rounded-md border px-4 py-2 text-sm font-medium">Back</Link>
                </div>

                <RoleForm data={data} setData={setData} permissions={permissions} errors={errors} processing={processing} onSubmit={onSubmit} submitLabel="Update Role" />
            </div>
        </AdminLayout>
    );
}
