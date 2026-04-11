import { Head, Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSidebarActiveScroll } from '@/hooks/use-sidebar-active-scroll';

type SidebarLayoutProps = {
    title: string;
    children: React.ReactNode;
};

type NavItem = {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
};

export default function StudentSidebarLayout({ title, children }: SidebarLayoutProps) {
    const page = usePage();
    const currentUrl = page.url;
    const [mobileOpen, setMobileOpen] = useState(false);
    const navScrollRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        document.documentElement.classList.remove('js-loading');
    }, []);

    useSidebarActiveScroll({
        containerRef: navScrollRef,
        dependencyKey: currentUrl,
    });

    const navItems: NavItem[] = [
        { label: 'لوحة الطالب', href: '/student/profile', icon: LayoutDashboard },
        { label: 'كورساتي', href: '/student/courses', icon: BookOpen },
    ];

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div dir="rtl" lang="ar" className="min-h-screen bg-orange-50/40">
            <Head title={title} />

            <div className="flex min-h-screen flex-col lg:flex-row">
                <aside
                    className={`fixed inset-y-0 right-0 z-50 flex w-72 shrink-0 flex-col transform bg-[linear-gradient(135deg,#0c1424_0%,#0c1e31_60%,#0a1422_100%)] text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
                        mobileOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between border-b border-white/12 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-sm font-black text-white">
                                KC
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold tracking-[0.3em] text-white/70">طالب</div>
                                <div className="text-lg font-bold text-white">مساحة التعلم</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/80 lg:hidden"
                            aria-label="إغلاق القائمة"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <nav ref={navScrollRef} className="flex-1 overflow-y-auto px-4 py-6">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        data-sidebar-active={active || undefined}
                                        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                            active ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="text-right">{item.label}</span>
                                        <span
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                                active ? 'bg-white/15 text-white' : 'bg-white/10 text-white'
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-6 border-t border-white/12 pt-4">
                            <Link
                                href="/student/logout"
                                method="post"
                                as="button"
                                className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                            >
                                <span className="text-right">تسجيل الخروج</span>
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
                                    <LogOut size={18} />
                                </span>
                            </Link>
                        </div>
                    </nav>
                </aside>

                {mobileOpen && (
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
                        aria-label="إغلاق خلفية القائمة"
                    />
                )}

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                    <div className="mb-6 flex items-center justify-between lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(true)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-orange-200/60 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                        >
                            <Menu size={18} />
                            القائمة
                        </button>
                        <span className="text-sm font-semibold text-slate-500">{title}</span>
                    </div>

                    <div className="rounded-3xl border border-orange-200/60 bg-white px-6 py-5 shadow-sm">
                        <div className="text-[11px] font-semibold tracking-[0.3em] text-orange-500">مساحة الطالب</div>
                        <div className="mt-2 text-2xl font-bold text-slate-900">{title}</div>
                    </div>

                    <div className="mt-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
