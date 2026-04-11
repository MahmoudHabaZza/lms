import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import { FormEvent } from 'react';

export default function NotificationEdit({ notification }: { notification: any }) {
    const { data, setData, put, processing, errors } = useForm({ title: notification.title ?? '', body: notification.body ?? '', user_id: notification.user_id ?? '' });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/notifications/${notification.id}`);
    };

    return (
        <AdminLayout title="Edit Notification">
            <div className="mx-auto w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Edit Notification</h1>
                <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-md border">
                    <div>
                        <label className="block mb-1">Title</label>
                        <input value={data.title} onChange={(e) => setData('title', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                        <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div>
                        <label className="block mb-1">Body</label>
                        <textarea value={data.body} onChange={(e) => setData('body', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                        <InputError message={errors.body} className="mt-2" />
                    </div>
                    <div>
                        <label className="block mb-1">User ID (optional)</label>
                        <input value={data.user_id} onChange={(e) => setData('user_id', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                        <InputError message={errors.user_id} className="mt-2" />
                    </div>
                    <div>
                        <button disabled={processing} className="rounded-md bg-black text-white px-4 py-2">Update</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
