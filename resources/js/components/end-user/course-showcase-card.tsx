import { Link, router, usePage } from '@inertiajs/react';
import { Calendar, ChevronLeft, Heart, Layers, Repeat } from 'lucide-react';
import type { CSSProperties, MouseEvent } from 'react';
import Swal from 'sweetalert2';
import { cn } from '@/lib/utils';

export type PublicCourseCard = {
    id: number;
    title: string;
    thumbnail: string | null;
    short_description: string;
    learning_outcome: string | null;
    duration_months: number;
    sessions_count: number;
    sessions_per_week: number;
    badge: string | null;
    accent_color: string;
    show_url: string;
    booking_url: string;
    is_favorited?: boolean;
    favorite_url?: string | null;
};

export function CourseShowcaseCard({
    course,
    animationDelay = 0,
    layout = 'slider',
    variant = 'default',
    className,
}: {
    course: PublicCourseCard;
    animationDelay?: number;
    layout?: 'slider' | 'grid';
    variant?: 'default' | 'home-compact';
    className?: string;
}) {
    const accent = course.accent_color || 'var(--site-primary-color)';
    const isGrid = layout === 'grid';
    const isHomeCompact = variant === 'home-compact';
    const { auth, settings } = usePage<{
        auth?: {
            user?: { id: number; role?: string; is_admin?: boolean } | null;
        };
        settings?: Record<string, string | null | undefined>;
    }>().props;
    const audienceLabel =
        settings?.course_card_default_audience_label?.trim() ||
        'من 5 إلى 17 سنة';
    const noImageText =
        settings?.course_card_no_image_text?.trim() || 'لا توجد صورة';
    const showDetailsLabel =
        settings?.course_card_show_details_label?.trim() || 'عرض التفاصيل';

    const onFavoriteClick = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const user = auth?.user;
        if (!user) {
            await Swal.fire({
                icon: 'warning',
                title: 'سجل دخولك أولًا',
                text: 'لازم تسجل دخول كطالب علشان تقدر تضيف الكورس للمفضلة.',
                confirmButtonText: 'تسجيل الدخول',
                showCancelButton: true,
                cancelButtonText: 'إلغاء',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/student/login';
                }
            });
            return;
        }

        if (user.is_admin || user.role !== 'student') {
            await Swal.fire({
                icon: 'info',
                title: 'المفضلة للطلاب فقط',
                text: 'ميزة المفضلة متاحة لحسابات الطلاب فقط.',
                confirmButtonText: 'تمام',
            });
            return;
        }

        if (!course.favorite_url) {
            return;
        }

        router.post(course.favorite_url, {}, { preserveScroll: true });
    };

    return (
        <Link
            href={course.show_url}
            className={cn(
                'group relative block overflow-hidden rounded-[28px] bg-slate-900 text-right transition-transform duration-400 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_color-mix(in_srgb,var(--site-primary-color)_80%,transparent)]',
                isGrid
                    ? 'min-h-[440px] w-full'
                    : 'h-[420px] w-[260px] shrink-0 sm:h-[460px] sm:w-[300px]',
                className,
            )}
            style={
                {
                    '--course-accent': accent,
                    animationDelay: `${animationDelay}s`,
                } as CSSProperties
            }
        >
            <button
                type="button"
                onClick={onFavoriteClick}
                className={cn(
                    'absolute top-3 right-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-slate-900/45 text-white backdrop-blur-md transition hover:scale-105 hover:bg-slate-900/70',
                    course.is_favorited ? 'text-rose-300' : 'text-white',
                )}
                aria-label={
                    course.is_favorited
                        ? 'إزالة من المفضلة'
                        : 'إضافة إلى المفضلة'
                }
            >
                <Heart
                    className={cn(
                        'h-5 w-5',
                        course.is_favorited ? 'fill-current' : '',
                    )}
                />
            </button>

            {course.thumbnail ? (
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-lg font-semibold text-slate-500">
                    {noImageText}
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#020617f2] via-[#0f172abf] to-[#0f172a52]" />

            <span
                className="absolute top-3 left-3 z-20 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: 'var(--site-primary-500)' }}
            >
                {course.badge || audienceLabel}
            </span>

            <div className="absolute inset-x-0 bottom-0 px-4 pt-3 pb-4">
                {isHomeCompact ? (
                    <div className="space-y-3">
                        <h3 className="px-1 font-fredoka text-xl leading-tight font-bold text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.6)]">
                            {course.title}
                        </h3>

                        <div
                            className="rounded-2xl bg-slate-900/75 p-2.5 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.8)] transition-all duration-400 ease-out hover:bg-slate-900/90 hover:shadow-[0_14px_38px_-18px_color-mix(in_srgb,var(--site-primary-color)_80%,transparent)]"
                            style={{
                                border: '1px solid color-mix(in srgb, var(--site-primary-300) 85%, white 15%)',
                            }}
                        >
                            <div className="flex flex-nowrap items-center justify-between gap-2 text-[9px] font-bold text-white/90">
                                <span
                                    className="flex grow basis-0 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-center text-[10px] leading-none whitespace-nowrap text-white"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                        border: '1px solid var(--site-primary-600)',
                                    }}
                                >
                                    <Calendar size={11} className="shrink-0" />
                                    {course.duration_months} شهور
                                </span>
                                <span
                                    className="flex grow basis-0 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-center text-[10px] leading-none whitespace-nowrap text-white"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                        border: '1px solid var(--site-primary-600)',
                                    }}
                                >
                                    <Layers size={11} className="shrink-0" />
                                    {course.sessions_count} جلسة
                                </span>
                                <span
                                    className="flex grow basis-0 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-center text-[10px] leading-none whitespace-nowrap text-white"
                                    style={{
                                        background:
                                            'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                        border: '1px solid var(--site-primary-600)',
                                    }}
                                >
                                    <Repeat size={11} className="shrink-0" />
                                    {course.sessions_per_week} أسبوعيًا
                                </span>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-1 text-sm font-bold text-orange-300 transition group-hover:text-orange-200">
                            {showDetailsLabel}
                            <ChevronLeft className="size-4" />
                        </div>
                    </div>
                ) : (
                    <div
                        className="rounded-2xl bg-slate-900/75 p-3 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.8)] transition-all duration-400 ease-out hover:bg-slate-900/90 hover:shadow-[0_14px_38px_-18px_color-mix(in_srgb,var(--site-primary-color)_80%,transparent)]"
                        style={{
                            border: '1px solid color-mix(in srgb, var(--site-primary-300) 85%, white 15%)',
                        }}
                    >
                        <h3 className="font-fredoka text-lg leading-tight font-bold text-white">
                            {course.title}
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-white/80">
                            {course.short_description}
                        </p>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] font-bold text-white/90">
                            <span
                                className="flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap text-white"
                                style={{
                                    background:
                                        'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                    border: '1px solid var(--site-primary-600)',
                                }}
                            >
                                <Calendar size={12} className="shrink-0" />
                                {course.duration_months} شهور
                            </span>
                            <span
                                className="flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap text-white"
                                style={{
                                    background:
                                        'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                    border: '1px solid var(--site-primary-600)',
                                }}
                            >
                                <Layers size={12} className="shrink-0" />
                                {course.sessions_count} جلسة
                            </span>
                            <span
                                className="flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap text-white"
                                style={{
                                    background:
                                        'linear-gradient(to bottom, var(--site-primary-500), var(--site-primary-400))',
                                    border: '1px solid var(--site-primary-600)',
                                }}
                            >
                                <Repeat size={12} className="shrink-0" />
                                {course.sessions_per_week} أسبوعيًا
                            </span>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition group-hover:text-orange-200">
                            {showDetailsLabel}
                            <ChevronLeft className="size-4" />
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
