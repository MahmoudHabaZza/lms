import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import UserForm from './user-form';

type UserRole = {
    id: number;
    name: string;
    slug: string;
};

type UserDetails = {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
};

export default function UserEdit({ user, roles }: { user: UserDetails; roles: UserRole[] }) {
    const initial = { role_ids: user.roles.map((role) => role.id) };
    const { data, setData, put, processing, errors } = useForm(initial);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout title="تعديل المستخدم">
            <div className="mx-auto w-full max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">تعديل المستخدم</h1>
                    <Link href="/admin/users" className="rounded-md border px-4 py-2 text-sm font-medium">رجوع</Link>
                </div>

                <div className="rounded-xl border bg-white p-6">
                    <div className="mb-4 text-right">
                        <div className="text-lg font-medium">
                            {user.name} <span className="text-slate-400">({user.email})</span>
                        </div>
                    </div>

                    <UserForm
                        data={data}
                        setData={setData}
                        roles={roles}
                        errors={errors}
                        processing={processing}
                        onSubmit={onSubmit}
                        submitLabel="حفظ الأدوار"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
