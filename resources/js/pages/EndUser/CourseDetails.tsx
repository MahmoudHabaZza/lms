import { Head, Link } from '@inertiajs/react';
import { BookOpen, Clock3, Layers3, PlayCircle, Rocket } from 'lucide-react';
import { CourseCurriculum } from '@/components/end-user/course-curriculum';
import { CourseShowcaseCard } from '@/components/end-user/course-showcase-card';
import type { PublicCourseCard } from '@/components/end-user/course-showcase-card';
import { Button } from '@/components/ui/button';
import MainLayout from './layouts/master';

type CourseDetailsPageProps = {
    course: {
        id: number;
        title: string;
        thumbnail: string | null;
        short_description: string;
        description: string | null;
        description_points: string[];
        category: string | null;
        show_url: string;
        booking_url: string;
        level: string | null;
        duration_label: string;
        lessons_count: number;
        rating: {
            average: number;
            count: number;
        };
        pricing: {
            amount: number | null;
            is_free: boolean;
            label: string;
        };
        what_you_will_learn: string[];
        requirements: string[];
        target_audience: string[];
        curriculum_sections: {
            id: string;
            title: string;
            summary: string | null;
            lessons: {
                id: number;
                title: string;
                description: string | null;
                duration_minutes: number;
                order: number;
            }[];
        }[];
        cta: {
            label: string;
            url: string;
        };
        related_courses: PublicCourseCard[];
    };
};

export default function CourseDetails({ course }: CourseDetailsPageProps) {
    const learningPoints = course.what_you_will_learn.filter(Boolean);
    const totalLessons = course.curriculum_sections.reduce((sum, s) => sum + s.lessons.length, 0);

    return (
        <MainLayout>
            <Head title={course.title} />

            <div dir="rtl" lang="ar" className="bg-[#fffbf5] text-right">

                {/* ─── Hero ─── */}
                <section className="relative overflow-hidden bg-gradient-to-bl from-orange-400 via-orange-500 to-yellow-400 pb-16 pt-12">
                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute right-1/3 top-8 h-20 w-20 rounded-full bg-yellow-300/30" />

                    <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 text-center lg:flex-row lg:text-right">
                        {/* Thumbnail */}
                        <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-3xl border-4 border-white/40 shadow-2xl lg:order-2">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="aspect-[4/3] w-full object-cover" />
                            ) : (
                                <div className="flex aspect-[4/3] items-center justify-center bg-white/20 text-2xl font-black text-white">
                                    {course.title}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-5 lg:order-1">
                            {course.category && (
                                <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                                    {course.category}
                                </span>
                            )}

                            <h1 className="font-playpen-arabic text-3xl font-extrabold leading-snug text-white drop-shadow-md sm:text-4xl lg:text-5xl">
                                {course.title}
                            </h1>

                            {course.short_description && (
                                <p className="max-w-lg text-base leading-8 text-white/90 sm:text-lg">
                                    {course.short_description}
                                </p>
                            )}

                            {/* Mini stats */}
                            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                                    <Clock3 className="size-4" /> {course.duration_label}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                                    <PlayCircle className="size-4" /> {course.lessons_count} درس
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                                    <Layers3 className="size-4" /> {course.level || 'مناسب للجميع'}
                                </span>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                                <span className="text-2xl font-black text-white drop-shadow">
                                    {course.pricing.label}
                                </span>
                                <Button
                                    asChild
                                    className="h-14 rounded-full bg-white px-10 text-lg font-black text-orange-600 shadow-xl transition-transform hover:scale-105 hover:bg-orange-50"
                                >
                                    <Link href={course.cta.url}>
                                        <Rocket className="me-2 size-5" />
                                        احجز مقعدك الآن
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── What you'll learn ─── */}
                {learningPoints.length > 0 && (
                    <section className="mx-auto max-w-5xl px-5 py-14">
                        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            🎯 ماذا سيتعلم طفلك؟
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {learningPoints.map((point) => (
                                <div
                                    key={point}
                                    className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-4 shadow-sm"
                                >
                                    <span className="mt-1 text-xl">✅</span>
                                    <p className="text-sm leading-7 text-slate-700">{point}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ─── Curriculum ─── */}
                {course.curriculum_sections.length > 0 && (
                    <section id="course-content" className="bg-white py-14">
                        <div className="mx-auto max-w-5xl px-5">
                            <h2 className="mb-2 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                📚 محتوى الكورس
                            </h2>
                            <p className="mb-8 text-center text-sm text-slate-500">
                                {course.curriculum_sections.length} قسم • {totalLessons} درس • {course.duration_label}
                            </p>
                            <CourseCurriculum sections={course.curriculum_sections} />
                        </div>
                    </section>
                )}

                {/* ─── CTA Banner ─── */}
                <section className="py-14">
                    <div className="mx-auto max-w-3xl px-5">
                        <div className="flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-l from-orange-500 to-yellow-400 p-8 text-center shadow-xl sm:p-10">
                            <span className="text-5xl">🚀</span>
                            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">جاهز تبدأ رحلة التعلم؟</h3>
                            <p className="max-w-md text-base text-white/90">
                                سجّل ابنك دلوقتي وخليه يبدأ يتعلم البرمجة بطريقة ممتعة وتفاعلية!
                            </p>
                            <Button
                                asChild
                                className="h-14 rounded-full bg-white px-10 text-lg font-black text-orange-600 shadow-lg transition-transform hover:scale-105 hover:bg-orange-50"
                            >
                                <Link href={course.cta.url}>
                                    <Rocket className="me-2 size-5" />
                                    احجز مقعدك الآن
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ─── Related Courses ─── */}
                {course.related_courses.length > 0 && (
                    <section className="bg-white py-14">
                        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
                            <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                🌟 كورسات تانية ممكن تعجبك
                            </h2>
                            <div
                                className="scrollbar-hide flex flex-nowrap gap-5 overflow-x-auto scroll-smooth pb-5 pt-1"
                                dir="ltr"
                            >
                                {course.related_courses.map((relatedCourse, index) => (
                                    <div key={relatedCourse.id} className="w-[300px] shrink-0">
                                        <CourseShowcaseCard
                                            course={relatedCourse}
                                            animationDelay={index * 0.08}
                                            variant="home-compact"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
