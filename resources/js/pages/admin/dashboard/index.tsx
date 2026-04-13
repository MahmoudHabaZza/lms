import { Link } from '@inertiajs/react';
import {
    ArrowUpLeft,
    BookOpen,
    ChevronLeft,
    GraduationCap,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type DashboardHighlights = {
    users: number;
    students: number;
    courses: number;
    enrollments: number;
};

type SectionItem = {
    label: string;
    total: number;
    active?: number | null;
    href: string;
};

type DashboardSection = {
    title: string;
    items: SectionItem[];
};

type QuickLink = {
    title: string;
    href: string;
};

export default function AdminDashboard({
    highlights,
    sections,
    quickLinks,
}: {
    highlights: DashboardHighlights;
    sections: DashboardSection[];
    quickLinks: QuickLink[];
}) {
    const cards = [
        {
            title: 'إجمالي المستخدمين',
            value: highlights.users,
            icon: Users,
            accent: 'from-sky-500 via-blue-500 to-indigo-500',
        },
        {
            title: 'الطلاب',
            value: highlights.students,
            icon: GraduationCap,
            accent: 'from-emerald-500 via-green-500 to-lime-500',
        },
        {
            title: 'الكورسات',
            value: highlights.courses,
            icon: BookOpen,
            accent: 'from-fuchsia-500 via-purple-500 to-violet-500',
        },
        {
            title: 'طلبات التسجيل',
            value: highlights.enrollments,
            icon: LayoutGrid,
            accent: 'from-amber-500 via-orange-500 to-rose-500',
        },
    ];

    return (
        <AdminLayout title="لوحة التحكم">
            <div className="admin-dashboard space-y-8">
                <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-[linear-gradient(135deg,#7c2d12_0%,#c2410c_40%,#0f172a_100%)] px-6 py-10 text-white shadow-xl">
                    <div className="admin-orb admin-orb-1" />
                    <div className="admin-orb admin-orb-2" />
                    <div className="relative z-10 text-right">
                        <p className="text-xs font-bold tracking-[0.3em] text-orange-100/80">مركز التحكم</p>
                        <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">تقرير شامل لكل أقسام الموقع.</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                            هنا ستجد أرقام كل العناصر بالموقع: المحتوى، التعلم، التقييمات، المستخدمين، والصلاحيات مع روابط مباشرة للإدارة.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-start gap-3">
                            {quickLinks.slice(0, 3).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="admin-cta inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-xs font-semibold tracking-wide text-white transition hover:bg-white/20"
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                className="admin-card group relative min-h-[210px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(15,23,42,0.14)]"
                                style={{ animationDelay: `${index * 70}ms` }}
                            >
                                <div className={`pointer-events-none absolute inset-y-0 right-0 w-2 bg-gradient-to-b ${card.accent}`} />
                                <div className={`absolute inset-0 bg-gradient-to-b ${card.accent} opacity-[0.08]`} />
                                <div className="relative flex h-full flex-col">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-md`}>
                                        <Icon size={20} />
                                    </div>
                                    <p className="mt-5 text-sm font-bold tracking-wide text-slate-600">{card.title}</p>
                                    <p className="mt-3 text-4xl font-black text-slate-900">{card.value}</p>
                                    <div className="mt-auto pt-5">
                                        <div className="h-1.5 w-full rounded-full bg-white/80">
                                            <div className={`h-1.5 w-2/3 rounded-full bg-gradient-to-r ${card.accent}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                    {section.items.length} عناصر
                                </span>
                            </div>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item) => (
                                    <Link
                                        key={`${section.title}-${item.label}`}
                                        href={item.href}
                                        className="group rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="text-right">
                                                <p className="text-sm font-extrabold text-slate-800">{item.label}</p>
                                                <p className="mt-2 text-xs font-semibold text-slate-500">
                                                    الإجمالي: <span className="font-black text-slate-800">{item.total}</span>
                                                    {typeof item.active === 'number' ? (
                                                        <span className="mr-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                                                            النشط: <span className="mr-1 font-black">{item.active}</span>
                                                        </span>
                                                    ) : null}
                                                </p>
                                            </div>
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 transition group-hover:text-orange-500 group-hover:ring-orange-200">
                                                <ArrowUpLeft className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-900">إجراءات سريعة</h3>
                        <p className="mt-1 text-sm text-slate-500">انتقل مباشرة إلى الصفحات الأكثر استخدامًا.</p>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="admin-action-card group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-white"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span>{link.title}</span>
                                    <ChevronLeft className="h-4 w-4 text-slate-400 transition group-hover:text-orange-500" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
