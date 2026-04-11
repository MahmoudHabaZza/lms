import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ExploreMoreSection from './ExploreMoreSection';
import StudentFeedbackGallerySection from './StudentFeedbackGallerySection';

type StudentReel = {
    id: number;
    student_name: string;
    student_title: string | null;
    student_age: number | null;
    cover_image: string | null;
    video_source: string;
    video_url: string | null;
    quote: string | null;
};

type StudentFeedbackImage = {
    id: number;
    student_name: string;
    caption: string | null;
    image: string | null;
};

const feedbackTitle = 'تجارب وآراء أهلنا';

export default function FeedbackShowcaseSection({
    studentReels = [],
    studentFeedbackImages = [],
}: {
    studentReels?: StudentReel[];
    studentFeedbackImages?: StudentFeedbackImage[];
}) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = useMemo(
        () => [
            {
                key: 'reels',
                label: 'Reels',
                content: <ExploreMoreSection studentReels={studentReels} className="feedback-showcase-slide" />,
            },
            {
                key: 'gallery',
                label: 'Gallery',
                content: (
                    <StudentFeedbackGallerySection
                        studentFeedbackImages={studentFeedbackImages}
                        className="feedback-showcase-slide"
                    />
                ),
            },
        ],
        [studentReels, studentFeedbackImages],
    );

    useEffect(() => {
        const container = sliderRef.current;
        if (!container) return;
        const slidesNodes = Array.from(container.children) as HTMLElement[];
        const target = slidesNodes[activeIndex];
        if (!target) return;

        container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }, [activeIndex]);

    useEffect(() => {
        if (slides.length < 2) return undefined;
        const interval = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 8000);

        return () => {
            window.clearInterval(interval);
        };
    }, [slides.length]);

    const goTo = (index: number) => {
        setActiveIndex(index);
    };

    const next = () => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section className="feedback-showcase-wrap relative overflow-hidden py-14 sm:py-16" dir="rtl">
            <div className="feedback-showcase-orb feedback-showcase-orb-1" />
            <div className="feedback-showcase-orb feedback-showcase-orb-2" />

            <div className="relative mx-auto max-w-[1500px] px-4 sm:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-slate-900">
                        <span className="academy-bracket academy-bracket-left text-orange-500" style={{fontFamily: "'Fira Code', monospace"}}>{'<'}/</span>
                        <span>{feedbackTitle}</span>
                        <span className="academy-bracket academy-bracket-right text-orange-500" style={{fontFamily: "'Fira Code', monospace"}}>{">"}                        </span>
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">
                        كل السلايدر ده قصص حقيقية - تقدر تتفرج وتقرأ السوشيال بستايل احترافي.
                    </p>
                </div>

                <div className="relative mt-10">
                    <button
                        onClick={prev}
                        className="absolute -left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-orange-50 lg:block"
                        aria-label="Previous slide"
                    >
                        <ChevronRight size={24} className="text-slate-700" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-orange-50 lg:block"
                        aria-label="Next slide"
                    >
                        <ChevronLeft size={24} className="text-slate-700" />
                    </button>

                    <div
                        ref={sliderRef}
                        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6"
                        dir="ltr"
                    >
                        {slides.map((slide) => (
                            <div key={slide.key} className="feedback-showcase-item min-w-full snap-start">
                                {slide.content}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.key}
                                type="button"
                                onClick={() => goTo(index)}
                                className={`h-2.5 w-2.5 rounded-full transition ${
                                    index === activeIndex ? 'bg-orange-500' : 'bg-orange-200'
                                }`}
                                aria-label={`Go to ${slide.label}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
