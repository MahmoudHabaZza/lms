import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    BookOpen,
    BookOpenCheck,
    Braces,
    Building2,
    ClipboardCheck,
    Clapperboard,
    CircleHelp,
    FileText,
    GraduationCap,
    Images,
    LayoutDashboard,
    Layers3,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Rocket,
    Settings,
    Shield,
    ShieldCheck,
    Users,
    Wand2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useSidebarActiveScroll } from '@/hooks/use-sidebar-active-scroll';

type AdminLayoutProps = {
    title: string;
    children: ReactNode;
};

type AuthUser = {
    name?: string;
    email?: string;
};

type NavItem = {
    title: string;
    href: string;
    icon: typeof LayoutDashboard;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

type SharedProps = {
    auth?: {
        user?: AuthUser;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
        warning?: string | null;
    };
    settings?: {
        app_name?: string;
        primary_color?: string;
    };
};

const navSections: NavSection[] = [
    {
        title: 'نظرة عامة',
        items: [{ title: 'الرئيسية', href: '/admin', icon: LayoutDashboard }],
    },
    {
        title: 'المحتوى',
        items: [
            { title: 'شرائح الواجهة', href: '/admin/banner-slides', icon: Layers3 },
            { title: 'أقسام الأكاديمية', href: '/admin/academy-sections', icon: Braces },
            { title: 'التصنيفات', href: '/admin/categories', icon: Layers3 },
            { title: 'ريلز الطلاب', href: '/admin/student-reels', icon: Clapperboard },
            { title: 'ريلز الكورسات', href: '/admin/course-reels', icon: Clapperboard },
            { title: 'الطلاب المتفوقون', href: '/admin/top-students', icon: Award },
            { title: 'آراء الطلاب', href: '/admin/student-feedback-images', icon: Images },
            { title: 'الأسئلة الشائعة', href: '/admin/faqs', icon: CircleHelp },
        ],
    },
    {
        title: 'الفروع والمواقع',
        items: [
            { title: 'المدن', href: '/admin/cities', icon: MapPin },
            { title: 'المدارس', href: '/admin/schools', icon: Building2 },
        ],
    },
    {
        title: 'التعلم',
        items: [
            { title: 'الكورسات', href: '/admin/courses', icon: BookOpen },
            { title: 'الدروس', href: '/admin/lessons', icon: BookOpenCheck },
            { title: 'الموارد', href: '/admin/resources', icon: FileText },
            { title: 'طلبات التسجيل', href: '/admin/enrollments', icon: ClipboardCheck },
            { title: 'المفضلة', href: '/admin/wishlist-items', icon: Wand2 },
            { title: 'المهام', href: '/admin/tasks', icon: BookOpenCheck },
            { title: 'تسليمات المهام', href: '/admin/task-submissions', icon: BookOpenCheck },
            { title: 'تقدم الدروس', href: '/admin/lesson-progress', icon: BookOpenCheck },
        ],
    },
    {
        title: 'التقييمات والشهادات',
        items: [
            { title: 'الاختبارات', href: '/admin/exams', icon: BookOpenCheck },
            { title: 'الأسئلة', href: '/admin/questions', icon: BookOpenCheck },
            { title: 'محاولات الاختبار', href: '/admin/attempts', icon: BookOpenCheck },
            { title: 'إجابات الطلاب', href: '/admin/student-answers', icon: BookOpenCheck },
            { title: 'الشهادات', href: '/admin/certificates', icon: ShieldCheck },
            { title: 'طلبات الشهادات', href: '/admin/certificate-requests', icon: ShieldCheck },
        ],
    },
    {
        title: 'الصلاحيات والتنبيهات',
        items: [
            { title: 'الطلاب', href: '/admin/students', icon: GraduationCap },
            { title: 'المستخدمون', href: '/admin/users', icon: Users },
            { title: 'الأدوار', href: '/admin/roles', icon: Shield },
            { title: 'الصلاحيات', href: '/admin/permissions', icon: Shield },
            { title: 'الإشعارات', href: '/admin/notifications', icon: Bell },
        ],
    },
    {
        title: 'النظام',
        items: [
            { title: 'الإعدادات', href: '/admin/settings', icon: Settings },
            { title: 'إعدادات البريد', href: '/admin/settings?group=mail', icon: Mail },
            { title: 'عرض الموقع', href: '/', icon: Rocket },
        ],
    },
];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const page = usePage<SharedProps>();
    const currentUrl = page.url;
    const [mobileOpen, setMobileOpen] = useState(false);
    const navScrollRef = useRef<HTMLDivElement | null>(null);

    const authUser = page.props.auth?.user;
    const flash = page.props.flash;
    const appName = page.props.settings?.app_name?.trim() || 'Kid Coder';
    const primaryColor = page.props.settings?.primary_color?.trim() || 'var(--site-primary-color)';
    const shellStyle = { ['--admin-brand' as '--admin-brand']: primaryColor } as CSSProperties;

    useEffect(() => {
        setMobileOpen(false);
    }, [currentUrl]);

    useSidebarActiveScroll({
        containerRef: navScrollRef,
        dependencyKey: currentUrl,
    });

    const isActive = (href: string) => {
        if (href === '/admin') {
            return currentUrl === '/admin';
        }

        if (href.includes('?')) {
            return currentUrl === href;
        }

        return currentUrl.startsWith(href);
    };

    const logout = () => {
        router.post('/admin/logout');
    };

    return (
        <>
            <Head title={title} />

            <div
                dir="rtl"
                lang="ar"
                className="admin-shell min-h-screen bg-[radial-gradient(circle_at_top,#fff1dd_0%,#fff9f2_32%,#f8fafc_70%)] text-slate-900"
                style={shellStyle}
            >
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <aside
                        className={`fixed inset-y-0 right-0 z-50 flex w-[308px] flex-col border-l border-white/20 bg-[linear-gradient(180deg,#141b2d_0%,#10223b_42%,#0f172a_100%)] px-5 py-5 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
                            mobileOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, var(--site-primary-400))` }}
                                >
                                    KC
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-semibold tracking-[0.3em] text-white/60">
                                        لوحة الإدارة
                                    </div>
                                    <div className="mt-1 text-lg font-bold text-white">{appName}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white/80 lg:hidden"
                                aria-label="إغلاق القائمة"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4 text-right shadow-lg backdrop-blur-sm">
                            <div className="text-[11px] font-semibold tracking-[0.25em] text-white/55">
                                الحساب النشط
                            </div>
                            <div className="mt-3 text-base font-bold text-white">{authUser?.name ?? 'المدير'}</div>
                            <div className="mt-1 text-sm text-white/65">
                                {authUser?.email ?? 'admin@kidcoder.local'}
                            </div>
                        </div>

                        <div ref={navScrollRef} className="mt-5 flex-1 space-y-5 overflow-y-auto pl-1">
                            {navSections.map((section) => (
                                <section key={section.title}>
                                    <div className="mb-3 px-2 text-[11px] font-semibold tracking-[0.3em] text-white/45">
                                        {section.title}
                                    </div>
                                    <div className="space-y-2">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            const active = isActive(item.href);

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    data-sidebar-active={active || undefined}
                                                    className={`group flex items-center justify-between gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                                                        active
                                                            ? 'bg-white/14 text-white shadow-lg'
                                                            : 'text-white/80 hover:bg-white/8 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="text-right leading-6">{item.title}</span>
                                                    <span
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${
                                                            active ? 'bg-white/18 text-white' : 'bg-white/8 text-white/85'
                                                        }`}
                                                    >
                                                        <Icon size={18} />
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                            <LogOut size={18} />
                            تسجيل الخروج
                        </button>
                    </aside>

                    {mobileOpen && (
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
                            aria-label="إغلاق خلفية القائمة"
                        />
                    )}

                    <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                        <div className="mb-5 flex items-center justify-between gap-4 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(true)}
                                className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
                            >
                                <Menu size={18} />
                                القائمة
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-2xl border border-orange-200/80 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-700"
                            >
                                <Rocket size={16} />
                                عرض الموقع
                            </Link>
                        </div>

                        <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div
                                        className="text-[11px] font-bold tracking-[0.35em] uppercase"
                                        style={{ color: primaryColor }}
                                    >
                                        مساحة الإدارة
                                    </div>
                                    <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{title}</h1>
                                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                                        إدارة المحتوى والكورسات والإعدادات من مساحة موحدة ومهيأة بالكامل للعرض العربي.
                                    </p>
                                </div>
                                <div className="grid gap-3 text-right sm:min-w-[240px]">
                                    <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                                        <div className="text-xs font-semibold text-orange-600">الاتجاه</div>
                                        <div className="mt-1 text-sm font-bold text-slate-800">RTL مفعل على الواجهة</div>
                                    </div>
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-xs font-semibold text-slate-500">اسم المشرف</div>
                                        <div className="mt-1 text-sm font-bold text-slate-800">
                                            {authUser?.name ?? 'المدير'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(flash?.success || flash?.warning || flash?.error) && (
                            <div className="mt-6 space-y-3">
                                {flash.success && (
                                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-right text-sm font-semibold text-emerald-700">
                                        {flash.success}
                                    </div>
                                )}
                                {flash.warning && (
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-right text-sm font-semibold text-amber-700">
                                        {flash.warning}
                                    </div>
                                )}
                                {flash.error && (
                                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-right text-sm font-semibold text-rose-700">
                                        {flash.error}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6">{children}</div>
                    </main>
                </div>

                <style>{`
                    .admin-shell thead.text-left,
                    .admin-shell th.text-left,
                    .admin-shell td.text-left,
                    .admin-shell .text-left {
                        text-align: right;
                    }
                `}</style>
            </div>
        </>
    );
}

