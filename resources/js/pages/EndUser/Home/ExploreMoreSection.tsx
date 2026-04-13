import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type StudentReel = {
    id: number;
    student_name: string;
    student_title: string | null;
    student_age: number | null;
    cover_image: string | null;
    video_url: string | null;
    quote: string | null;
};

export default function ExploreMoreSection({
    studentReels = [],
    className = '',
}: {
    studentReels?: StudentReel[];
    className?: string;
}) {
    const { settings } = usePage<{ settings?: Record<string, string | null> }>().props;
    const exploreTitle = settings?.home_explore_title || 'آراء الطلاب وأولياء الأمور';
    const exploreSubtitle = settings?.home_explore_subtitle || 'قصص حقيقية من طلابنا. اضغط على أي بطاقة لمشاهدة الفيديو.';

    const [activeReel, setActiveReel] = useState<StudentReel | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveReel(null);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () => {
            window.removeEventListener('keydown', closeOnEscape);
        };
    }, []);

    const normalizedReels = useMemo(() => {
        return studentReels.filter((reel) => reel.video_url);
    }, [studentReels]);

    const isUploadedVideo = true;

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

    return (
        <section className={`explore-wrap relative overflow-hidden py-16 sm:py-20 ${className}`.trim()} dir="rtl">
            <div className="explore-deco explore-deco-1" />
            <div className="explore-deco explore-deco-2" />

            <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
                        <span className="academy-bracket academy-bracket-left text-orange-500" style={{fontFamily: "'Fira Code', monospace"}}>{'<'}/</span>
                        <span>{exploreTitle}</span>
                        <span className="academy-bracket academy-bracket-right text-orange-500" style={{fontFamily: "'Fira Code', monospace"}}>{">"}                        </span>
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">{exploreSubtitle}</p>
                </div>

                {normalizedReels.length > 0 ? (
                    <div
                        className="relative mt-10"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <button
                            onClick={() => scroll('left')}
                            className="explore-slider-nav-btn explore-slider-nav-btn-left absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll left"
                        >
                            <ChevronRight size={24} className="text-slate-700" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="explore-slider-nav-btn explore-slider-nav-btn-right absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                            aria-label="Scroll right"
                        >
                            <ChevronLeft size={24} className="text-slate-700" />
                        </button>

                        <div
                            ref={scrollContainerRef}
                            className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-4"
                            dir="ltr"
                        >
                            {normalizedReels.map((reel, index) => (
                                <button
                                    key={reel.id}
                                    type="button"
                                    onClick={() => setActiveReel(reel)}
                                    className="explore-reel-card group relative shrink-0 text-right"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    <div className="relative h-[350px] w-[280px] overflow-hidden rounded-[28px] border border-white/60 bg-slate-900 shadow-[0_24px_45px_-34px_rgba(15,23,42,.95)]">
                                        {reel.cover_image ? (
                                            <img
                                                src={reel.cover_image}
                                                alt={reel.student_name}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-700 to-slate-900 text-4xl font-bold text-white">
                                                {reel.student_name.slice(0, 1)}
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172ad9] via-[#0f172a7a] to-transparent" />

                                        <span className="explore-play-btn absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-orange-500 shadow-lg transition group-hover:scale-110">
                                            <Play size={18} className="mr-[2px]" />
                                        </span>

                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200/90">Student Reel</p>
                                            <h3 className="mt-1 font-fredoka text-xl font-semibold leading-tight">{reel.student_name}</h3>
                                            {(reel.student_title || reel.student_age) && (
                                                <p className="mt-1 text-sm text-white/80">
                                                    {reel.student_title ? `${reel.student_title}` : ''}
                                                    {reel.student_title && reel.student_age ? ' • ' : ''}
                                                    {reel.student_age ? `${reel.student_age} years` : ''}
                                                </p>
                                            )}
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
                                        className={`explore-slider-dot ${activeIndex === index ? 'explore-slider-dot-active' : ''}`}
                                        aria-label={`Go to reel ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-orange-300 bg-white/80 p-8 text-center text-slate-700">
                        لا توجد فيديوهات آراء مفعلة حاليًا.
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
                                                // fallback: browser blocks autoplay with sound, keep muted until user interacts
                                                el.muted = true;
                                            });
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="explore-modal-info">
                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">Student Reel</p>
                            <h3 className="mt-1 font-bold text-lg text-white">{activeReel.student_name}</h3>
                            {activeReel.student_title && <p className="text-sm text-slate-300">{activeReel.student_title}</p>}
                            {activeReel.student_age && <p className="text-xs text-slate-400">{activeReel.student_age} years</p>}
                            {activeReel.quote && <p className="mt-2 text-sm text-slate-300">{activeReel.quote}</p>}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

