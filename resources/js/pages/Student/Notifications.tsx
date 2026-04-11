import { Link, usePage } from '@inertiajs/react';
import { Bell, CheckCheck, CircleAlert, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';

type NotificationItem = {
    id: number;
    title: string;
    message: string | null;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    created_at_label: string | null;
};

type NotificationsPageProps = {
    notificationsPage: {
        items: NotificationItem[];
        unread_count: number;
    };
};

const typeStyles = {
    info: {
        icon: Info,
        card: 'border-sky-100 bg-sky-50/70',
        iconWrap: 'bg-sky-100 text-sky-700',
    },
    success: {
        icon: ShieldCheck,
        card: 'border-emerald-100 bg-emerald-50/70',
        iconWrap: 'bg-emerald-100 text-emerald-700',
    },
    warning: {
        icon: TriangleAlert,
        card: 'border-amber-100 bg-amber-50/80',
        iconWrap: 'bg-amber-100 text-amber-700',
    },
    error: {
        icon: CircleAlert,
        card: 'border-rose-100 bg-rose-50/80',
        iconWrap: 'bg-rose-100 text-rose-700',
    },
} as const;

export default function Notifications() {
    const { notificationsPage } = usePage<NotificationsPageProps>().props;

    return (
        <StudentShell title="الإشعارات" subtitle="تابع تنبيهات المنصة، ملاحظات التقدم، وتنبيهات المهام والاختبارات من مكان واحد.">
            <div className="space-y-6">
                <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-3xl bg-orange-100 p-4 text-orange-700">
                                <Bell size={22} />
                            </div>
                            <div>
                                <div className="text-lg font-black text-slate-900">الإشعارات غير المقروءة</div>
                                <div className="mt-1 text-sm text-slate-600">لديك الآن {notificationsPage.unread_count} إشعارًا غير مقروء.</div>
                            </div>
                        </div>

                        {notificationsPage.unread_count > 0 && (
                            <Link
                                href="/student/notifications/read-all"
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                                <CheckCheck size={18} />
                                تعليم الكل كمقروء
                            </Link>
                        )}
                    </div>
                </section>

                {notificationsPage.items.length > 0 ? (
                    <div className="space-y-4">
                        {notificationsPage.items.map((item) => {
                            const style = typeStyles[item.type] ?? typeStyles.info;
                            const Icon = style.icon;

                            return (
                                <article key={item.id} className={`rounded-[28px] border p-5 shadow-sm ${style.card}`}>
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`rounded-2xl p-3 ${style.iconWrap}`}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="text-lg font-black text-slate-900">{item.title}</h2>
                                                    {!item.is_read && <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">جديد</span>}
                                                </div>
                                                <p className="mt-2 text-sm leading-7 text-slate-700">{item.message || 'لا يوجد وصف إضافي لهذا الإشعار.'}</p>
                                                <div className="mt-3 text-xs font-semibold text-slate-500">{item.created_at_label || 'الآن'}</div>
                                            </div>
                                        </div>

                                        {!item.is_read && (
                                            <Link
                                                href={`/student/notifications/${item.id}/read`}
                                                method="post"
                                                as="button"
                                                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                                            >
                                                تعليم كمقروء
                                            </Link>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <StudentEmptyState title="لا توجد إشعارات" description="عند وجود أي تنبيه جديد متعلق بتقدمك أو مهامك أو اختباراتك سيظهر هنا مباشرة." />
                )}
            </div>
        </StudentShell>
    );
}