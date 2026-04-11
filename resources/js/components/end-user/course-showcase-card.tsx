import { Link } from '@inertiajs/react';
import { Calendar, ChevronLeft, Layers, Repeat } from 'lucide-react';
import type { CSSProperties } from 'react';
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
};

const audienceLabel = 'من 5 إلى 17 سنة';

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
    const accent = course.accent_color || '#f97316';
    const isGrid = layout === 'grid';
    const isHomeCompact = variant === 'home-compact';

    return (
        <Link
            href={course.show_url}
            className={cn(
                'group relative block overflow-hidden rounded-[28px] bg-slate-900 text-right transition-transform duration-400 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(249,115,22,0.8)]',
                isGrid ? 'min-h-[440px] w-full' : 'h-[460px] w-[300px] shrink-0',
                className,
            )}
            style={{ '--course-accent': accent, animationDelay: `${animationDelay}s` } as CSSProperties}
        >
            {course.thumbnail ? (
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-lg font-semibold text-slate-500">
                    لا توجد صورة
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#020617f2] via-[#0f172abf] to-[#0f172a52]" />

            <span className="absolute left-3 top-3 z-20 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                {course.badge || audienceLabel}
            </span>

            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-3">
                {isHomeCompact ? (
                    <div className="space-y-3">
                        <h3 className="px-1 font-fredoka text-xl font-bold leading-tight text-white drop-shadow-[0_2px_12px_rgba(15,23,42,0.6)]">
                            {course.title}
                        </h3>

                        <div className="rounded-2xl border border-orange-300 bg-slate-900/75 p-2.5 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.8)] transition-all duration-400 ease-out hover:bg-slate-900/90 hover:shadow-[0_14px_38px_-18px_rgba(249,115,22,0.8)]">
                            <div className="grid grid-cols-3 gap-1 text-[9px] font-bold text-white/90">
                                <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-2 py-1 text-center text-[10px] font-bold whitespace-nowrap text-white">
                                    <Calendar size={12} className="me-1 inline-block" />
                                    {course.duration_months} شهور
                                </span>
                                <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-2 py-1 text-center text-[10px] font-bold whitespace-nowrap text-white">
                                    <Layers size={12} className="me-1 inline-block" />
                                    {course.sessions_count} جلسة
                                </span>
                                <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-2 py-1 text-center text-[10px] font-bold whitespace-nowrap text-white">
                                    <Repeat size={12} className="me-1 inline-block" />
                                    {course.sessions_per_week} أسبوعيًا
                                </span>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-1 text-sm font-bold text-orange-300 transition group-hover:text-orange-200">
                            عرض التفاصيل
                            <ChevronLeft className="size-4" />
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-orange-300 bg-slate-900/75 p-3 shadow-[0_10px_26px_-18px_rgba(15,23,42,0.8)] transition-all duration-400 ease-out hover:bg-slate-900/90 hover:shadow-[0_14px_38px_-18px_rgba(249,115,22,0.8)]">
                        <h3 className="font-fredoka text-lg font-bold leading-tight text-white">{course.title}</h3>
                        <p className="mt-2 text-xs leading-6 text-white/80">{course.short_description}</p>

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-white/90">
                            <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                                <Calendar size={12} className="me-1 inline-block" />
                                {course.duration_months} شهور
                            </span>
                            <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                                <Layers size={12} className="me-1 inline-block" />
                                {course.sessions_count} جلسة
                            </span>
                            <span className="rounded-full border border-orange-600 bg-gradient-to-b from-orange-500 to-orange-400 px-3 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                                <Repeat size={12} className="me-1 inline-block" />
                                {course.sessions_per_week} أسبوعيًا
                            </span>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition group-hover:text-orange-200">
                            عرض التفاصيل
                            <ChevronLeft className="size-4" />
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
}
