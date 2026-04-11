import { Link } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';

type UserRole = {
    id: number;
    name: string;
    slug: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type UserRow = {
    id: number;
    name: string;
    email: string;
    roles: UserRole[];
};

type PaginatedUsers = {
    data: UserRow[];
    links: PaginationLink[];
};

export default function UsersIndex({ users }: { users: PaginatedUsers }) {
    return (
        <AdminLayout title="المستخدمون">
            <div className="mx-auto w-full max-w-4xl">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">المستخدمون</h1>
                </div>

                <div className="space-y-2">
                    {users.data.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="text-right">
                                <div className="font-semibold text-slate-900">
                                    {user.name} <span className="text-slate-400">({user.email})</span>
                                </div>
                                <div className="mt-2 flex flex-wrap justify-start gap-2 text-sm text-slate-500">
                                    {user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <span
                                                key={role.id}
                                                className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                            >
                                                {role.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">بدون أدوار مخصصة</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Link
                                    href={`/admin/users/${user.id}/edit`}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                                >
                                    تعديل
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {users.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {users.links.map((link, index) => {
                            const label = link.label
                                .replace('&laquo; Previous', 'السابق')
                                .replace('Next &raquo;', 'التالي')
                                .replace('&raquo;', '')
                                .replace('&laquo;', '');

                            if (!link.url) {
                                return (
                                    <span
                                        key={`${label}-${index}`}
                                        className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-400"
                                    >
                                        {label}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={`${label}-${index}`}
                                    href={link.url}
                                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                        link.active
                                            ? 'border-orange-500 bg-orange-500 text-white'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
