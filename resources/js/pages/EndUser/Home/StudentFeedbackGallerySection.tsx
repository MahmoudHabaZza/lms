import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type StudentFeedbackImage = {
    id: number;
    student_name: string;
    caption: string | null;
    image: string | null;
};

export default function StudentFeedbackGallerySection({
    studentFeedbackImages = [],
    className = '',
}: {
    studentFeedbackImages?: StudentFeedbackImage[];
    className?: string;
}) {
    const { settings } = usePage<any>().props;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedImage, setSelectedImage] = useState<StudentFeedbackImage | null>(null);
    const galleryTitle = settings?.home_feedback_gallery_title?.trim() || 'كلمات نفتخر بها';
    const galleryDescription = settings?.home_feedback_gallery_subtitle?.trim() || 'لقطات حقيقية من آراء أولياء الأمور والطلاب عن تجربتهم داخل الأكاديمية.';
    const emptyText = settings?.home_feedback_gallery_empty_text?.trim() || 'لا توجد صور آراء مفعلة حاليًا.';

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
        if (studentFeedbackImages.length === 0) return;
        const nextIndex =
            direction === 'left'
                ? (activeIndex - 1 + studentFeedbackImages.length) % studentFeedbackImages.length
                : (activeIndex + 1) % studentFeedbackImages.length;
        goTo(nextIndex);
    };

    useEffect(() => {
        if (studentFeedbackImages.length <= 1 || isPaused) return undefined;

        const interval = window.setInterval(() => {
            const nextIndex = (activeIndex + 1) % studentFeedbackImages.length;
            goTo(nextIndex);
        }, 5000);

        return () => window.clearInterval(interval);
    }, [activeIndex, isPaused, studentFeedbackImages.length]);

    useEffect(() => {
        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSelectedImage(null);
            }
        };

        window.addEventListener('keydown', onEscape);

        return () => window.removeEventListener('keydown', onEscape);
    }, []);

    return (
        <>
            <section className={`feedback-gallery-wrap relative overflow-hidden py-16 sm:py-20 ${className}`.trim()} dir="rtl">
                <div className="feedback-gallery-deco feedback-gallery-deco-1" />
                <div className="feedback-gallery-deco feedback-gallery-deco-2" />

                <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
                            <span className="academy-bracket academy-bracket-left text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                                {'<'}/
                            </span>
                            <span>{galleryTitle}</span>
                            <span className="academy-bracket academy-bracket-right text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                                {'>'}
                            </span>
                        </h2>
                        <p className="mt-3 text-sm text-slate-600 sm:text-base">{galleryDescription}</p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
                            <span className="rounded-full border border-orange-200 bg-white/80 px-3 py-1.5 font-semibold text-slate-700">
                                صور موثقة
                            </span>
                            <span className="rounded-full border border-teal-200 bg-white/80 px-3 py-1.5 font-semibold text-slate-700">
                                نتائج حقيقية
                            </span>
                            <span className="rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 font-semibold text-slate-700">
                                تحديث مستمر
                            </span>
                        </div>
                    </div>

                    {studentFeedbackImages.length > 0 ? (
                        <div
                            className="relative mt-10"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            <button
                                onClick={() => scroll('left')}
                                className="feedback-gallery-nav-btn feedback-gallery-nav-btn-left absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                                aria-label="Scroll left"
                            >
                                <ChevronRight size={24} className="text-slate-700" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="feedback-gallery-nav-btn feedback-gallery-nav-btn-right absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 lg:inline-flex"
                                aria-label="Scroll right"
                            >
                                <ChevronLeft size={24} className="text-slate-700" />
                            </button>

                            <div ref={scrollContainerRef} className="scrollbar-hide flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-1" dir="ltr">
                                {studentFeedbackImages.map((feedbackImage, index) => (
                                    <article
                                        key={feedbackImage.id}
                                        className="feedback-gallery-card group relative shrink-0 overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_40px_-30px_rgba(15,23,42,.9)]"
                                        style={{ animationDelay: `${index * 0.08}s` }}
                                    >
                                        {feedbackImage.image ? (
                                            <button
                                                type="button"
                                                onClick={() => setSelectedImage(feedbackImage)}
                                                className="feedback-gallery-media relative flex h-[430px] w-[300px] items-center justify-center bg-slate-100 sm:h-[470px] sm:w-[330px] lg:h-[520px] lg:w-[360px]"
                                                aria-label={`تكبير صورة ${feedbackImage.student_name}`}
                                            >
                                                <img
                                                    src={feedbackImage.image}
                                                    alt={feedbackImage.student_name}
                                                    className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                                                />
                                            </button>
                                        ) : (
                                            <div className="feedback-gallery-media flex h-[430px] w-[300px] items-center justify-center bg-slate-100 font-semibold text-slate-500 sm:h-[470px] sm:w-[330px] lg:h-[520px] lg:w-[360px]">
                                                لا توجد صورة
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617cc] via-transparent via-40% to-[#02061799]" />

                                        <div className="absolute right-3 top-3 max-w-[92%] rounded-full border border-white/35 bg-black/55 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
                                            {feedbackImage.student_name}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {studentFeedbackImages.length > 1 && (
                                <div className="mt-5 flex items-center justify-center gap-2">
                                    {studentFeedbackImages.map((feedbackImage, index) => (
                                        <button
                                            key={feedbackImage.id}
                                            type="button"
                                            onClick={() => goTo(index)}
                                            className={`feedback-gallery-dot ${
                                                activeIndex === index ? 'feedback-gallery-dot-active' : 'feedback-gallery-dot-idle'
                                            }`}
                                            aria-label={`Go to feedback ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-orange-300 bg-white/80 p-8 text-center text-slate-700">
                            {emptyText}
                        </div>
                    )}
                </div>
            </section>

            {selectedImage?.image && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/88 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedImage(null)}
                            className="absolute left-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition hover:bg-black/70"
                            aria-label="إغلاق المعاينة"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex max-h-[92vh] items-center justify-center bg-[radial-gradient(circle_at_top,rgba(30,41,59,.95),rgba(2,6,23,1))] p-3 sm:p-5">
                            <img
                                src={selectedImage.image}
                                alt={selectedImage.student_name}
                                className="max-h-[74vh] w-auto max-w-full rounded-2xl object-contain"
                            />
                        </div>

                        <div className="border-t border-white/10 bg-slate-950/95 px-5 py-4 text-right text-white">
                            <p className="text-base font-bold sm:text-lg">{selectedImage.student_name}</p>
                            {selectedImage.caption && (
                                <p className="mt-2 text-sm leading-7 text-slate-200 sm:text-base">
                                    {selectedImage.caption}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
