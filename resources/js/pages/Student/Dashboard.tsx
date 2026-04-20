import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    BookOpen,
    CheckCircle2,
    Clock3,
    Sparkles,
} from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentProgressBar } from '@/components/student/student-progress-bar';
import { StudentShell } from '@/components/student/student-shell';
import { StudentStatCard } from '@/components/student/student-stat-card';

type DashboardCourse = {
    id: number;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    progress: {
        completed_lessons: number;
        total_lessons: number;
        percentage: number;
    };
    next_lesson_id: number | null;
};

type ActivityItem = {
    id: string;
    title: string;
    description: string | null;
    meta: string | null;
};

type NotificationItem = {
    id: number;
    title: string;
    message: string | null;
    type: string;
    is_read: boolean;
    created_at_label: string | null;
    mark_read_url: string;
};

type DashboardPageProps = {
    dashboard: {
        courses: DashboardCourse[];
        stats: {
            completed_lessons: number;
            pending_tasks: number;
            upcoming_quizzes: number;
            certificates: number;
        };
        recent_activity: ActivityItem[];
        upcoming_quiz_items: {
            id: number;
            title: string;
            course: string | null;
            publish_date_label: string | null;
            show_url: string;
        }[];
        notifications: {
            items: NotificationItem[];
            unread_count: number;
            index_url: string;
        };
    };
};

export default function Dashboard() {
    const { dashboard } = usePage<DashboardPageProps>().props;

    return (
        <StudentShell
            title="لوحة الطالب"
            subtitle="تابع تقدمك في الكورسات، المهام، الاختبارات، والإشعارات من لوحة واحدة سريعة وواضحة."
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StudentStatCard
                        title="الدروس المكتملة"
                        value={dashboard.stats.completed_lessons}
                        icon={CheckCircle2}
                        accent="emerald"
                    />
                    <StudentStatCard
                        title="المهام المعلّقة"
                        value={dashboard.stats.pending_tasks}
                        icon={Clock3}
                        accent="orange"
                    />
                    <StudentStatCard
                        title="الاختبارات القادمة"
                        value={dashboard.stats.upcoming_quizzes}
                        icon={Sparkles}
                        accent="sky"
                    />
                    <StudentStatCard
                        title="الشهادات المكتسبة"
                        value={dashboard.stats.certificates}
                        icon={Award}
                        accent="rose"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                    <section className="space-y-4 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                                    الكورسات النشطة
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    كل كورس مع نسبة التقدّم والرابط السريع للدرس
                                    التالي.
                                </p>
                            </div>
                            <Link
                                href="/student/courses"
                                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-orange-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-700"
                            >
                                عرض الكل
                            </Link>
                        </div>

                        {dashboard.courses.length > 0 ? (
                            <div className="grid gap-4">
                                {dashboard.courses.map((course) => (
                                    <article
                                        key={course.id}
                                        className="rounded-[26px] border border-slate-100 bg-slate-50/70 p-4"
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="h-20 w-20 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100 to-sky-100">
                                                    {course.thumbnail_url ? (
                                                        <img
                                                            src={
                                                                course.thumbnail_url
                                                            }
                                                            alt={course.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-lg font-black text-slate-700">
                                                            {course.title.slice(
                                                                0,
                                                                2,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black text-slate-900">
                                                        {course.title}
                                                    </h3>
                                                    <p className="mt-1 max-w-xl text-sm leading-7 text-slate-600">
                                                        {course.description ||
                                                            'وصف الكورس سيظهر هنا عند توفره.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-full space-y-3 md:mr-auto md:max-w-sm">
                                                <StudentProgressBar
                                                    value={
                                                        course.progress
                                                            .percentage
                                                    }
                                                    label={`${course.progress.completed_lessons} من ${course.progress.total_lessons} دروس`}
                                                />
                                                <div className="flex flex-wrap gap-3">
                                                    <Link
                                                        href={`/student/courses/${course.id}`}
                                                        className="rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                                                    >
                                                        تفاصيل الكورس
                                                    </Link>
                                                    {course.next_lesson_id && (
                                                        <Link
                                                            href={`/student/lessons/${course.next_lesson_id}`}
                                                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                                                        >
                                                            متابعة الدرس التالي
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <StudentEmptyState
                                title="لا توجد كورسات نشطة"
                                description="بمجرد تفعيل تسجيلك في أي كورس سيظهر هنا مع تقدّمك الحالي."
                            />
                        )}
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                                        الإشعارات
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        آخر التنبيهات المرتبطة بحسابك ونشاطك
                                        الدراسي.
                                    </p>
                                </div>
                                <Link
                                    href={dashboard.notifications.index_url}
                                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 transition hover:border-orange-300"
                                >
                                    كل الإشعارات
                                </Link>
                            </div>

                            <div className="mt-4 space-y-3">
                                {dashboard.notifications.items.length > 0 ? (
                                    dashboard.notifications.items.map(
                                        (notification) => (
                                            <article
                                                key={notification.id}
                                                className={`rounded-[24px] border p-4 ${notification.is_read ? 'border-slate-100 bg-slate-50/70' : 'border-orange-100 bg-orange-50/70'}`}
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`rounded-2xl p-3 ${notification.is_read ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-700'}`}
                                                        >
                                                            <Bell size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-slate-900">
                                                                {
                                                                    notification.title
                                                                }
                                                            </div>
                                                            <div className="mt-1 text-sm leading-7 text-slate-600">
                                                                {notification.message ||
                                                                    'لا يوجد وصف إضافي.'}
                                                            </div>
                                                            <div className="mt-2 text-xs font-semibold text-slate-500">
                                                                {notification.created_at_label ||
                                                                    'الآن'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <Link
                                                            href={
                                                                notification.mark_read_url
                                                            }
                                                            method="post"
                                                            as="button"
                                                            className="inline-flex min-h-10 items-center justify-center self-start rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50"
                                                        >
                                                            تعليم كمقروء
                                                        </Link>
                                                    )}
                                                </div>
                                            </article>
                                        ),
                                    )
                                ) : (
                                    <StudentEmptyState
                                        title="لا توجد إشعارات جديدة"
                                        description="أي تحديثات تخص المهام أو الشهادات أو التقدّم ستظهر هنا."
                                    />
                                )}
                            </div>
                        </section>

                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                                اختبارات قادمة
                            </h2>
                            <div className="mt-4 space-y-3">
                                {dashboard.upcoming_quiz_items.length > 0 ? (
                                    dashboard.upcoming_quiz_items.map(
                                        (quiz) => (
                                            <Link
                                                key={quiz.id}
                                                href={quiz.show_url}
                                                className="block rounded-[24px] border border-sky-100 bg-sky-50/60 p-4 transition hover:border-sky-200 hover:bg-sky-50"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900">
                                                            {quiz.title}
                                                        </div>
                                                        <div className="mt-1 text-xs font-semibold text-slate-500">
                                                            {quiz.course}
                                                        </div>
                                                    </div>
                                                    <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-700">
                                                        {quiz.publish_date_label ||
                                                            'قريبًا'}
                                                    </div>
                                                </div>
                                            </Link>
                                        ),
                                    )
                                ) : (
                                    <StudentEmptyState
                                        title="لا توجد اختبارات قريبة"
                                        description="عندما يحدد المدرّس موعد اختبار جديد سيظهر هنا مباشرة."
                                    />
                                )}
                            </div>
                        </section>

                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                                آخر الأنشطة
                            </h2>
                            <div className="mt-4 space-y-3">
                                {dashboard.recent_activity.length > 0 ? (
                                    dashboard.recent_activity.map(
                                        (activity) => (
                                            <article
                                                key={activity.id}
                                                className="rounded-[24px] border border-slate-100 bg-slate-50/70 p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <div className="text-sm font-black text-slate-900">
                                                            {activity.title}
                                                        </div>
                                                        <div className="mt-1 text-sm text-slate-600">
                                                            {
                                                                activity.description
                                                            }
                                                        </div>
                                                        {activity.meta && (
                                                            <div className="mt-2 text-xs font-semibold text-orange-600">
                                                                {activity.meta}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                                                        <BookOpen size={18} />
                                                    </div>
                                                </div>
                                            </article>
                                        ),
                                    )
                                ) : (
                                    <StudentEmptyState
                                        title="لا يوجد نشاط حديث"
                                        description="ابدأ بأول درس أو مهمة وسيظهر سجل نشاطك هنا."
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </StudentShell>
    );
}
