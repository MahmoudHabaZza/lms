import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpenCheck,
    Braces,
    Layers3,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';

type DashboardStats = {
    totalSlides: number;
    activeSlides: number;
    totalAcademySections: number;
    activeAcademySections: number;
    totalCourses: number;
    activeCourses: number;
    admins: number;
    users: number;
};

type QuickLink = {
    title: string;
    href: string;
};

export default function AdminDashboard({
    stats,
    quickLinks,
}: {
    stats: DashboardStats;
    quickLinks: QuickLink[];
}) {
    const cards = [
        {
            title: 'إجمالي الشرائح',
            value: stats.totalSlides,
            icon: Layers3,
            accent: 'from-amber-500 via-orange-500 to-pink-500',
        },
        {
            title: 'الشرائح النشطة',
            value: stats.activeSlides,
            icon: Activity,
            accent: 'from-emerald-400 via-green-500 to-lime-400',
        },
        {
            title: 'أقسام الأكاديمية',
            value: stats.totalAcademySections,
            icon: Braces,
            accent: 'from-blue-500 via-indigo-500 to-cyan-400',
        },
        {
            title: 'الأقسام النشطة',
            value: stats.activeAcademySections,
            icon: Activity,
            accent: 'from-sky-500 via-cyan-500 to-teal-400',
        },
        {
            title: 'الكورسات',
            value: stats.totalCourses,
            icon: BookOpenCheck,
            accent: 'from-fuchsia-500 via-purple-500 to-violet-400',
        },
        {
            title: 'الكورسات النشطة',
            value: stats.activeCourses,
            icon: Activity,
            accent: 'from-rose-500 via-pink-500 to-red-400',
        },
        {
            title: 'المشرفون',
            value: stats.admins,
            icon: ShieldCheck,
            accent: 'from-slate-700 via-slate-600 to-slate-500',
        },
        {
            title: 'المستخدمون',
            value: stats.users,
            icon: Users,
            accent: 'from-lime-400 via-emerald-500 to-teal-400',
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
                        <h2 className="mt-4 text-3xl font-black sm:text-4xl">تابع المحتوى والكورسات من مكان واحد.</h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                            هذه المساحة تمنحك نظرة سريعة على المحتوى النشط، أعداد المستخدمين، وأقصر طريق للوصول إلى أدوات الإدارة اليومية.
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

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                className="admin-card group rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-lg backdrop-blur"
                                style={{ animationDelay: `${index * 70}ms` }}
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-md`}
                                >
                                    <Icon size={20} />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-slate-500">{card.title}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
                                <div className="mt-4 h-1 w-full rounded-full bg-slate-100">
                                    <div className={`h-1 w-2/3 rounded-full bg-gradient-to-r ${card.accent}`} />
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div className="text-right">
                                <h3 className="text-xl font-semibold text-slate-900">إجراءات سريعة</h3>
                                <p className="mt-1 text-sm text-slate-500">انتقل مباشرة إلى الصفحات الأكثر استخدامًا.</p>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            {quickLinks.map((link, index) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="admin-action-card rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-white"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {link.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-right shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-900">ملاحظات تشغيلية</h3>
                        <ul className="mt-4 space-y-3 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                                محتوى الصفحة الرئيسية يظهر للمستخدمين فقط عندما تكون الحالة نشطة.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                                استخدم حقل `sort_order` للحفاظ على ترتيب ثابت بين العناصر.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                                تأكد من أن كل كورس يحتوي على الصورة والخطة والوصف المختصر قبل نشره.
                            </li>
                        </ul>
                        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                            تلميح: الشريط الجانبي الجديد يجمع التسجيلات والشهادات والإعدادات في مكان واحد لتسريع العمل اليومي.
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
