import { Head, Link } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock3, GraduationCap, Layers3, PlayCircle, Rocket, Star, Target } from 'lucide-react';
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
        instructor: {
            name: string | null;
            image: string | null;
            bio: string | null;
        };
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
    const targetAudience = course.target_audience.filter(Boolean);

    return (
        <MainLayout>
            <Head title={course.title} />

            <div dir="rtl" lang="ar" className="bg-slate-50 text-right">

                {/* ─── Hero ─── */}
                <section
                    className="relative overflow-hidden pb-20 pt-14"
                    style={{ background: 'linear-gradient(to bottom left, var(--site-primary-400), var(--site-primary-600), var(--site-primary-700))' }}
                >
                    {/* Decorative elements */}
                    <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/[0.07]" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/[0.07]" />
                    <div className="pointer-events-none absolute left-1/4 top-12 h-24 w-24 rounded-full bg-white/[0.05]" />
                    <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-16 w-16 rounded-full bg-white/[0.04]" />

                    <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 lg:flex-row lg:items-start">
                        {/* Thumbnail */}
                        <div className="w-full max-w-md shrink-0 lg:order-2">
                            <div className="overflow-hidden rounded-3xl border-4 border-white/30 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                                {course.thumbnail ? (
                                    <img src={course.thumbnail} alt={course.title} className="aspect-[4/3] w-full object-cover" />
                                ) : (
                                    <div
                                        className="flex aspect-[4/3] items-center justify-center text-2xl font-black text-white"
                                        style={{ background: 'linear-gradient(135deg, var(--site-primary-300), var(--site-primary-500))' }}
                                    >
                                        <BookOpen className="size-16 opacity-40" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6 text-center lg:order-1 lg:text-right">
                            {course.category && (
                                <span className="inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur-sm">
                                    {course.category}
                                </span>
                            )}

                            <h1 className="font-playpen-arabic text-3xl font-extrabold leading-snug text-white drop-shadow-md sm:text-4xl lg:text-5xl">
                                {course.title}
                            </h1>

                            {course.short_description && (
                                <p className="mx-auto max-w-xl text-base leading-8 text-white/90 sm:text-lg lg:mx-0">
                                    {course.short_description}
                                </p>
                            )}

                            {/* Stats row */}
                            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
                                <StatBadge icon={<Clock3 className="size-4" />} label={course.duration_label} />
                                <StatBadge icon={<PlayCircle className="size-4" />} label={`${course.lessons_count} درس`} />
                                <StatBadge icon={<Layers3 className="size-4" />} label={course.level || 'مناسب للجميع'} />
                                {course.rating.count > 0 && (
                                    <StatBadge
                                        icon={<Star className="size-4 fill-yellow-300 text-yellow-300" />}
                                        label={`${course.rating.average} (${course.rating.count})`}
                                    />
                                )}
                            </div>

                            {/* Instructor mini */}
                            {course.instructor?.name && (
                                <div className="flex items-center justify-center gap-3 lg:justify-start">
                                    {course.instructor.image ? (
                                        <img
                                            src={course.instructor.image}
                                            alt={course.instructor.name}
                                            className="h-10 w-10 rounded-full border-2 border-white/50 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                                            <GraduationCap className="size-5" />
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-white/90">المدرب: {course.instructor.name}</span>
                                </div>
                            )}

                            {/* Price + CTA */}
                            <div className="flex flex-wrap items-center justify-center gap-5 pt-3 lg:justify-start">
                                <div className="flex flex-col items-center lg:items-start">
                                    <span className="text-sm font-semibold text-white/70">السعر</span>
                                    <span className="text-3xl font-black text-white drop-shadow">
                                        {course.pricing.label}
                                    </span>
                                </div>
                                <Button
                                    asChild
                                    className="h-14 rounded-full bg-white px-10 text-lg font-black shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                    style={{ color: 'var(--site-primary-600)' }}
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

                {/* ─── Quick Info Cards ─── */}
                <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-5">
                    <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
                        <InfoCard icon={<PlayCircle className="size-6" />} label="عدد الدروس" value={`${course.lessons_count} درس`} />
                        <InfoCard icon={<Clock3 className="size-6" />} label="المدة" value={course.duration_label} />
                        <InfoCard icon={<Layers3 className="size-6" />} label="المستوى" value={course.level || 'مناسب للجميع'} />
                        <InfoCard
                            icon={<Star className="size-6" />}
                            label="التقييم"
                            value={course.rating.count > 0 ? `${course.rating.average} / 5` : 'جديد'}
                        />
                    </div>
                </section>

                {/* ─── Description ─── */}
                {course.description && (
                    <section className="mx-auto max-w-5xl px-5 py-14">
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
                            <h2 className="mb-6 text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                📖 عن الكورس
                            </h2>
                            <p className="text-base leading-8 text-slate-600">
                                {course.description}
                            </p>
                            {course.description_points.length > 0 && (
                                <ul className="mt-6 space-y-3">
                                    {course.description_points.map((point) => (
                                        <li key={point} className="flex items-start gap-3">
                                            <CheckCircle2 className="mt-0.5 size-5 shrink-0" style={{ color: 'var(--site-primary-500)' }} />
                                            <span className="text-sm leading-7 text-slate-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                )}

                {/* ─── What you'll learn ─── */}
                {learningPoints.length > 0 && (
                    <section className="py-14" style={{ background: 'linear-gradient(to bottom, var(--site-primary-50), white)' }}>
                        <div className="mx-auto max-w-5xl px-5">
                            <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                                🎯 ماذا سيتعلم طفلك؟
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {learningPoints.map((point, index) => (
                                    <div
                                        key={point}
                                        className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
                                            style={{ background: 'linear-gradient(135deg, var(--site-primary-400), var(--site-primary-600))' }}
                                        >
                                            {index + 1}
                                        </span>
                                        <p className="text-sm leading-7 text-slate-700">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── Target Audience ─── */}
                {targetAudience.length > 0 && (
                    <section className="mx-auto max-w-5xl px-5 py-14">
                        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            👨‍👩‍👧‍👦 الكورس ده مناسب لمين؟
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {targetAudience.map((audience) => (
                                <div
                                    key={audience}
                                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-6 py-4 shadow-sm"
                                >
                                    <Target className="size-5 shrink-0" style={{ color: 'var(--site-primary-500)' }} />
                                    <span className="text-sm font-semibold text-slate-700">{audience}</span>
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

                {/* ─── Instructor ─── */}
                {course.instructor?.name && (
                    <section className="mx-auto max-w-5xl px-5 py-14">
                        <h2 className="mb-8 text-center text-2xl font-extrabold text-slate-800 sm:text-3xl">
                            👨‍🏫 المدرب
                        </h2>
                        <div className="flex flex-col items-center gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:flex-row sm:items-start sm:p-10">
                            {course.instructor.image ? (
                                <img
                                    src={course.instructor.image}
                                    alt={course.instructor.name}
                                    className="h-24 w-24 shrink-0 rounded-2xl border-4 object-cover shadow-md"
                                    style={{ borderColor: 'var(--site-primary-200)' }}
                                />
                            ) : (
                                <div
                                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-white shadow-md"
                                    style={{ background: 'linear-gradient(135deg, var(--site-primary-400), var(--site-primary-600))' }}
                                >
                                    <GraduationCap className="size-10" />
                                </div>
                            )}
                            <div className="text-center sm:text-right">
                                <h3 className="text-xl font-extrabold text-slate-800">{course.instructor.name}</h3>
                                {course.instructor.bio && (
                                    <p className="mt-2 text-sm leading-7 text-slate-600">{course.instructor.bio}</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ─── CTA Banner ─── */}
                <section className="py-14">
                    <div className="mx-auto max-w-3xl px-5">
                        <div
                            className="flex flex-col items-center gap-6 rounded-3xl p-10 text-center shadow-xl sm:p-12"
                            style={{ background: 'linear-gradient(to left, var(--site-primary-500), var(--site-primary-600), var(--site-primary-700))' }}
                        >
                            <span className="text-5xl">🚀</span>
                            <h3 className="text-2xl font-extrabold text-white sm:text-3xl">جاهز تبدأ رحلة التعلم؟</h3>
                            <p className="max-w-md text-base leading-7 text-white/90">
                                سجّل ابنك دلوقتي وخليه يبدأ يتعلم البرمجة بطريقة ممتعة وتفاعلية!
                            </p>
                            <Button
                                asChild
                                className="h-14 rounded-full bg-white px-10 text-lg font-black shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                style={{ color: 'var(--site-primary-600)' }}
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

function StatBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm">
            {icon} {label}
        </span>
    );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex h-full min-h-[154px] flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-md">
            <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, var(--site-primary-400), var(--site-primary-600))' }}
            >
                {icon}
            </div>
            <span className="text-xs font-semibold leading-6 text-slate-500">{label}</span>
            <span className="text-sm font-extrabold leading-6 text-slate-800">{value}</span>
        </div>
    );
}
