import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';

export default function PermissionCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', slug: '' });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/permissions');
    };

    return (
        <AdminLayout title="Create Permission">
            <div className="mx-auto w-full max-w-3xl space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-900">Create Permission</h1>
                    <Link href="/admin/permissions" className="rounded-md border px-4 py-2 text-sm font-medium">Back</Link>
                </div>

                <form onSubmit={onSubmit} className="space-y-5 rounded-xl border p-6 bg-white">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Name</label>
                        <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input value={data.slug} onChange={(e) => setData('slug', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                    </div>

                    <div>
                        <button type="submit" disabled={processing} className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">Create</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
