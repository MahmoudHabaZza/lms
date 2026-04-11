import PaginationLinks from '@/components/pagination-links';
import type { PaginatedData } from '@/types';
import { Link } from '@inertiajs/react';
import AdminLayout from '../layouts/admin-layout';

type NotificationItem = {
    id: number;
    title: string;
    body: string | null;
};

export default function NotificationsIndex({ notifications }: { notifications: PaginatedData<NotificationItem> }) {
    return (
        <AdminLayout title="Notifications">
            <div className="mx-auto w-full max-w-4xl space-y-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <Link href="/admin/notifications/create" className="rounded-md border px-3 py-1 text-sm">
                        New
                    </Link>
                </div>

                <div className="space-y-2">
                    {notifications.data.map((n) => (
                        <div key={n.id} className="rounded-md border bg-white p-3">
                            <div className="font-medium">{n.title}</div>
                            <div className="text-sm text-slate-500">{n.body}</div>
                        </div>
                    ))}

                    {notifications.data.length === 0 && (
                        <div className="rounded-md border bg-white px-6 py-10 text-center text-slate-500">No notifications found.</div>
                    )}
                </div>

                <PaginationLinks links={notifications.links} />
            </div>
        </AdminLayout>
    );
}
