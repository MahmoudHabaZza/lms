import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { CourseShowcaseCard } from '@/components/end-user/course-showcase-card';
import type { PublicCourseCard } from '@/components/end-user/course-showcase-card';

export default function ProgrammingTrackSection({
    courses = [],
}: {
    courses?: PublicCourseCard[];
}) {
    const { settings } = usePage<{ settings?: Record<string, string | null> }>().props;
    const sectionTitle = settings?.home_programming_title || 'كورسات البرمجة';
    const sectionDescription = settings?.home_programming_description || 'جميع كورسات البرمجة متاحة الآن ضمن فئة موحدة من 5 إلى 17 سنة، مع عرض كل الكورسات في مكان واحد بدون تقسيمات فرعية.';
    const audienceLabel = settings?.home_programming_audience_label || 'من 5 إلى 17 سنة';

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goTo = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const cards = Array.from(container.children) as HTMLElement[];
        const target = cards[index];
        if (!target) return;

        const centeredLeft = target.offsetLeft - (container.clientWidth - target.clientWidth) / 2;
        container.scrollTo({ left: Math.max(centeredLeft, 0), behavior: 'smooth' });
        setActiveIndex(index);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (courses.length === 0) return;
        const nextIndex =
            direction === 'left'
                ? (activeIndex - 1 + courses.length) % courses.length
                : (activeIndex + 1) % courses.length;
        goTo(nextIndex);
    };

    return (
        <section id="programming-courses" className="course-track-wrap relative overflow-hidden py-16 sm:py-20" dir="rtl">
            <div className="course-track-deco course-track-deco-1" />
            <div className="course-track-deco course-track-deco-2" />

            <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
                        <span className="academy-bracket academy-bracket-left text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                            {'<'}/
                        </span>
                        <span>{sectionTitle}</span>
                        <span className="academy-bracket academy-bracket-right text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                            {'>'}
                        </span>
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">{sectionDescription}</p>
                    <div className="mt-5 inline-flex rounded-full border border-orange-200 bg-orange-50 px-5 py-2 text-sm font-bold text-orange-700">
                        {audienceLabel}
                    </div>
                </div>

                {courses.length > 0 ? (
                    <div className="relative mt-10">
                        <button
                            onClick={() => scroll('left')}
                            className="course-slider-nav-btn course-slider-nav-btn-left absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll left"
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="course-slider-nav-btn course-slider-nav-btn-right absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll right"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>

                        <div
                            ref={scrollContainerRef}
                            className="scrollbar-hide flex flex-nowrap gap-5 overflow-x-auto scroll-smooth pb-5 pt-1"
                            dir="ltr"
                        >
                            {courses.map((course, index) => (
                                <CourseShowcaseCard key={course.id} course={course} animationDelay={index * 0.08} variant="home-compact" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-orange-300 bg-white/80 p-8 text-center text-slate-700">
                        لا يوجد كورسات برمجة مفعلة حاليًا.
                    </div>
                )}
            </div>
        </section>
    );
}
