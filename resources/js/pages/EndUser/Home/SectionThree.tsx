import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type BannerSlide = {
    id: number;
    title: string;
    sub_title: string | null;
    description: string | null;
    button_link: string | null;
    background_image: string | null;
};

export default function SectionThree({
    slides = [],
    staticSection = null,
}: {
    slides?: BannerSlide[];
    staticSection?: { title?: string; description?: string } | null;
}) {
    const { settings } = usePage<any>().props;
    const fallbackSlides: BannerSlide[] = [
        {
            id: 0,
            title: settings?.home_hero_fallback_title?.trim() || 'أضف أول سلايد من لوحة التحكم',
            sub_title: settings?.home_hero_fallback_subtitle?.trim() || 'ادخل على Admin > Banner Slides',
            description: settings?.home_hero_fallback_description?.trim() || 'تقدر تتحكم في العنوان والوصف والرابط بسهولة من لوحة الإدارة.',
            button_link: '/admin/banner-slides',
            background_image: '/assets/EndUser/images/hero-bg.jpg',
        },
    ];
    const heroCtaLabel = settings?.home_hero_cta_label?.trim() || 'احجز الآن';
    const safeSlides = slides.length > 0 ? slides : fallbackSlides;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
         
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % safeSlides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [safeSlides.length]);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
    };

    const activeSlide = safeSlides[activeIndex];
    const heroSubTitle = staticSection?.title ?? activeSlide.sub_title ?? 'كن جزءًا من رحلة البرمجة الآن';
    const heroDescription = staticSection?.description ?? activeSlide.description ?? 'تعليم منظم مع دعم مباشر من خبراء متخصصين.';

    return (
        <section className="relative overflow-hidden pt-14">
            <div className="pointer-events-none absolute inset-0">
                {safeSlides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 bg-cover bg-top bg-no-repeat transition-all duration-900 ease-in-out ${
                            index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                        }`}
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.52), rgba(3,37,71,0.56)), url('${
                                slide.background_image ?? '/assets/EndUser/images/hero-bg.jpg'
                            }')`,
                        }}
                    />
                ))}

                <div className="fp-banner-glow absolute inset-0" />
            </div>

            <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-16 sm:min-h-[78vh] sm:py-24">
                <div className="fp-banner-fade mx-auto w-full max-w-4xl text-center font-playpen-arabic text-white">
                    <div className="relative min-h-[5.2rem] sm:min-h-[6.5rem] lg:min-h-[7.5rem]">
                        <h1
                            key={activeSlide.id}
                            className="text-3xl font-bold leading-tight transition-all duration-700 ease-out sm:text-4xl lg:text-6xl"
                        >
                            {activeSlide.title}
                        </h1>
                    </div>

                    <h3
                        className="mt-5 text-xl font-medium text-orange-300 transition-all duration-700 ease-out sm:text-2xl lg:text-3xl"
                    >
                        {heroSubTitle}
                    </h3>

                    <p
                        className="mx-auto mt-5 max-w-3xl text-base font-medium leading-8 text-white/90 transition-all duration-700 sm:text-xl"
                    >
                        {heroDescription}
                    </p>

                    {activeSlide.button_link && (
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            <a
                                href={activeSlide.button_link}
                                className="fp-banner-btn inline-flex min-w-52 items-center justify-center rounded-xl bg-orange-500 px-10 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[var(--site-primary-color)] sm:min-w-64 sm:px-14 sm:py-5 sm:text-xl"
                            >
                                {heroCtaLabel}
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <div className="pb-10">
                <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="rounded-full border border-white/40 bg-white/10 p-2 text-white transition hover:bg-orange-500"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {safeSlides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => setActiveIndex(index)}
                            className={`h-2.5 rounded-full transition-all ${
                                index === activeIndex
                                    ? 'w-8 bg-orange-500'
                                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="rounded-full border border-white/40 bg-white/10 p-2 text-white transition hover:bg-orange-500"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
