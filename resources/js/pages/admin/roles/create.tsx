import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import RoleForm from './role-form';

export default function RoleCreate({ permissions }: { permissions: any[] }) {
    const { data, setData, post, processing, errors } = useForm({ name: '', slug: '', permission_ids: [] as number[] });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/roles');
    };

    return (
        <AdminLayout title="Create Role">
            <div className="mx-auto w-full max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Create Role</h1>
                    <Link href="/admin/roles" className="rounded-md border px-4 py-2 text-sm font-medium">Back</Link>
                </div>

                <RoleForm data={data} setData={setData} permissions={permissions} errors={errors} processing={processing} onSubmit={onSubmit} submitLabel="Create Role" />
            </div>
        </AdminLayout>
    );
}
