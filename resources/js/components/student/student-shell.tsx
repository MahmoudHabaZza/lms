import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    BookOpen,
    Heart,
    LayoutDashboard,
    LogOut,
    Menu,
    ScrollText,
    UserRound,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type StudentShellProps = {
    title: string;
    subtitle?: string;
    children: ReactNode;
};

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
    { label: 'لوحة الطالب', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'الكورسات', href: '/student/courses', icon: BookOpen },
    { label: 'المفضلة', href: '/student/favorites', icon: Heart },
    { label: 'المهام', href: '/student/tasks', icon: ScrollText },
    { label: 'الإشعارات', href: '/student/notifications', icon: Bell },
    { label: 'الشهادات', href: '/student/certificates', icon: Award },
    { label: 'الملف الشخصي', href: '/student/profile', icon: UserRound },
];

export function StudentShell({ title, subtitle, children }: StudentShellProps) {
    const page = usePage<{
        auth: { user?: { name?: string } };
        flash?: { success?: string; error?: string };
        student_meta?: { unread_notifications_count?: number } | null;
    }>();
    const [mobileOpen, setMobileOpen] = useState(false);
    const unreadNotificationsCount =
        page.props.student_meta?.unread_notifications_count ?? 0;

    useEffect(() => {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.lang = 'ar';
        document.documentElement.classList.remove('js-loading');
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <div
            dir="rtl"
            className="min-h-screen bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--site-primary-400)_18%,transparent),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,#fff8ee_0%,#fffdf8_48%,#f7fbff_100%)]"
        >
            <Head title={title} />

            <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col overflow-x-hidden lg:flex-row">
                <aside
                    className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-80 shrink-0 transform flex-col border-l border-white/15 bg-[linear-gradient(180deg,#122038_0%,#132b43_52%,#0d182a_100%)] p-4 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.9)] transition-transform duration-300 sm:p-5 lg:static lg:translate-x-0 ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-[11px] font-semibold tracking-[0.35em] text-orange-200/90">
                                    KID CODER
                                </div>
                                <div className="mt-3 font-playpen-arabic text-2xl font-extrabold text-white">
                                    مساحة التعلّم
                                </div>
                                <div className="mt-2 text-sm text-slate-300">
                                    كل محتوى الطالب في مكان واحد وبواجهة عربية
                                    كاملة.
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white lg:hidden"
                                aria-label="إغلاق القائمة"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-6 rounded-3xl bg-white/10 p-4">
                            <div className="text-xs text-slate-300">مرحبًا</div>
                            <div className="mt-2 text-lg font-bold text-white">
                                {page.props.auth?.user?.name ?? 'طالب'}
                            </div>
                            <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-slate-200">
                                <span>الإشعارات غير المقروءة</span>
                                <span className="rounded-full bg-orange-400 px-3 py-1 text-xs font-black text-slate-950">
                                    {unreadNotificationsCount}
                                </span>
                            </div>
                        </div>
                    </div>

                    <nav className="mt-6 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-1 pl-1">
                        {navItems.map((item) => {
                            const isActive = page.url.startsWith(item.href);
                            const Icon = item.icon;
                            const showBadge =
                                item.href === '/student/notifications' &&
                                unreadNotificationsCount > 0;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between rounded-[22px] px-4 py-3.5 text-sm font-bold transition ${
                                        isActive
                                            ? 'bg-white text-slate-900 shadow-[0_12px_24px_-18px_rgba(255,255,255,0.75)]'
                                            : 'text-slate-100 hover:bg-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {showBadge && (
                                            <span className="rounded-full bg-orange-400 px-2.5 py-1 text-[11px] font-black text-slate-950">
                                                {unreadNotificationsCount}
                                            </span>
                                        )}
                                        <span>{item.label}</span>
                                    </div>
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                                            isActive
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-white/10 text-white'
                                        }`}
                                    >
                                        <Icon size={18} />
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-6 border-t border-white/10 pt-5">
                        <Link
                            href="/student/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-between rounded-[22px] bg-white/10 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-white/15"
                        >
                            <span>تسجيل الخروج</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                                <LogOut size={18} />
                            </span>
                        </Link>
                    </div>
                </aside>

                {mobileOpen && (
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
                        aria-label="إغلاق الخلفية"
                    />
                )}

                <main className="flex-1 px-3 py-4 sm:px-6 lg:px-8">
                    <div className="mb-5 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
                        >
                            <Menu size={18} />
                            القائمة
                        </button>
                    </div>

                    <div className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
                        <div className="text-[11px] font-semibold tracking-[0.35em] text-orange-500">
                            منصة الطالب
                        </div>
                        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <h1 className="font-playpen-arabic text-2xl font-extrabold text-slate-900 sm:text-4xl">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {(page.props.flash?.success || page.props.flash?.error) && (
                        <div
                            className={`mt-5 rounded-[26px] border px-5 py-4 text-sm font-bold ${
                                page.props.flash?.success
                                    ? 'border-emerald-200 bg-emerald-50/90 text-emerald-700'
                                    : 'border-rose-200 bg-rose-50/90 text-rose-700'
                            }`}
                        >
                            {page.props.flash?.success ||
                                page.props.flash?.error}
                        </div>
                    )}

                    <div className="mt-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
