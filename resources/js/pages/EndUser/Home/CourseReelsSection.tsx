import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type CourseReel = {
    id: number;
    course_title: string;
    course_badge: string | null;
    course_description: string;
    course_thumbnail: string | null;
    course_accent_color: string;
    reel_cover_image: string | null;
    reel_instructor_image: string | null;
    reel_title: string;
    reel_track: string | null;
    video_url: string | null;
};

export default function CourseReelsSection({
    courseReels = [],
    className = '',
}: {
    courseReels?: CourseReel[];
    className?: string;
}) {
    const { settings } = usePage<{ settings?: Record<string, string | null> }>().props;
    const sectionTitle = settings?.home_course_reels_title || 'شرح التراكات والكورسات';
    const sectionSubtitle = settings?.home_course_reels_subtitle || 'شوف فيديو لكل كورس مع نبذة سريعة وتراك المسار.';

    const [activeReel, setActiveReel] = useState<CourseReel | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const normalizedReels = useMemo(() => courseReels.filter((reel) => reel.video_url), [courseReels]);

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
        if (normalizedReels.length === 0) return;
        const nextIndex =
            direction === 'left'
                ? (activeIndex - 1 + normalizedReels.length) % normalizedReels.length
                : (activeIndex + 1) % normalizedReels.length;
        goTo(nextIndex);
    };

    useEffect(() => {
        if (normalizedReels.length <= 1 || isPaused) return undefined;

        const interval = window.setInterval(() => {
            const nextIndex = (activeIndex + 1) % normalizedReels.length;
            goTo(nextIndex);
        }, 4500);

        return () => window.clearInterval(interval);
    }, [activeIndex, isPaused, normalizedReels.length]);

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveReel(null);
            }
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, []);

    return (
        <section id="course-reels" className={`course-reels-wrap relative overflow-hidden py-16 sm:py-20 ${className}`.trim()} dir="rtl">
            <div className="course-reels-deco course-reels-deco-1" />
            <div className="course-reels-deco course-reels-deco-2" />

            <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
                        <span className="academy-bracket academy-bracket-left text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>{'<'} /</span>
                        <span>{sectionTitle}</span>
                        <span className="academy-bracket academy-bracket-right text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>{'>'}</span>
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">{sectionSubtitle}</p>
                </div>

                {normalizedReels.length > 0 ? (
                    <div
                        className="relative mt-10"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <button
                            onClick={() => scroll('left')}
                            className="course-reels-nav-btn course-reels-nav-btn-left absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll left"
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="course-reels-nav-btn course-reels-nav-btn-right absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll right"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>

                        <div ref={scrollContainerRef} className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-4" dir="ltr">
                            {normalizedReels.map((reel, index) => (
                                <button
                                    key={reel.id}
                                    type="button"
                                    onClick={() => setActiveReel(reel)}
                                    className="course-reel-card group relative shrink-0 text-right"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <div
                                        className="relative h-[360px] w-[270px] overflow-hidden rounded-[28px] border border-orange-200/40 shadow-[0_20px_40px_-18px_rgba(15,23,42,0.8)] transition hover:shadow-[0_25px_45px_-15px_rgba(15,23,42,0.9)]"
                                        style={{ backgroundImage: `url('${reel.reel_instructor_image || reel.reel_cover_image || ''}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e192dce] via-[#0f172a9f] to-transparent" />

                                        <div className="absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                        <div className="absolute inset-0 flex items-center justify-center px-4">
                                            <div
                                                className="relative rounded-2xl p-4 text-center backdrop-blur-sm shadow-lg transition duration-400 ease-out group-hover:scale-105"
                                                style={{ backgroundColor: 'color-mix(in srgb, var(--site-primary-500) 35%, transparent)' }}
                                            >
                                                <h3 className="text-lg font-black uppercase tracking-wide text-white drop-shadow-lg md:text-xl">
                                                    {reel.course_title}
                                                </h3>

                                                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2">
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110"
                                                        style={{ backgroundColor: 'var(--site-primary-500)' }}
                                                        onClick={(e) => { e.stopPropagation(); setActiveReel(reel); }}
                                                        aria-label="Play course reel"
                                                    >
                                                        <Play size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </button>
                            ))}
                        </div>

                        {normalizedReels.length > 1 && (
                            <div className="mt-5 flex items-center justify-center gap-2">
                                {normalizedReels.map((reel, index) => (
                                    <button
                                        key={reel.id}
                                        type="button"
                                        onClick={() => goTo(index)}
                                        className={`course-reels-dot ${activeIndex === index ? 'course-reels-dot-active' : ''}`}
                                        aria-label={`Go to course reel ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-orange-300 bg-white/80 p-8 text-center text-slate-700">
                        لا توجد فيديوهات كورس مفعلة حاليًا.
                    </div>
                )}
            </div>

            {activeReel && activeReel.video_url && (
                <div className="fixed inset-0 z-[1200] flex items-center justify-center explore-modal-overlay bg-[#020617d9] px-4 py-8" onClick={() => setActiveReel(null)}>
                    <div
                        className="explore-modal-card relative overflow-hidden"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveReel(null)}
                            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                            aria-label="Close video"
                        >
                            <X size={18} />
                        </button>

                        <div className="explore-modal-video-wrap">
                            <video
                                key={activeReel.video_url}
                                src={activeReel.video_url}
                                controls
                                autoPlay
                                muted={false}
                                loop
                                preload="metadata"
                                playsInline
                                className="h-full w-full object-cover"
                                ref={(el) => {
                                    if (el) {
                                        el.muted = false;
                                        el.volume = 0.8;
                                        const playPromise = el.play();
                                        if (playPromise !== undefined) {
                                            playPromise.catch(() => {
                                                el.muted = true;
                                            });
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="explore-modal-info">
                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">شرح الكورس</p>
                            <h3 className="mt-1 font-bold text-lg text-white">{activeReel.course_title}</h3>
                            {activeReel.course_badge && <p className="text-sm text-slate-300">{activeReel.course_badge}</p>}
                            {activeReel.course_description && <p className="mt-2 text-sm text-slate-300">{activeReel.course_description}</p>}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
