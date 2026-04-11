import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Clock3,
    FileText,
    GraduationCap,
    Layers3,
    PlayCircle,
    Sparkles,
    Target,
} from 'lucide-react';
import { CourseCurriculum } from '@/components/end-user/course-curriculum';
import { CourseDetailSection } from '@/components/end-user/course-detail-section';
import { CourseShowcaseCard } from '@/components/end-user/course-showcase-card';
import type { PublicCourseCard } from '@/components/end-user/course-showcase-card';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
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
        instructor: {
            name: string | null;
            image: string | null;
            bio: string | null;
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

const buildInfoCards = (course: CourseDetailsPageProps['course']) => [
    {
        label: 'مدة الكورس',
        value: course.duration_label,
        icon: <Clock3 className="size-5" />,
    },
    {
        label: 'عدد الدروس',
        value: `${course.lessons_count} درس`,
        icon: <PlayCircle className="size-5" />,
    },
    {
        label: 'المستوى',
        value: course.level || 'مناسب للجميع',
        icon: <Layers3 className="size-5" />,
    },
    {
        label: 'المدرب',
        value: course.instructor.name || 'فريق Kid Coder',
        icon: <GraduationCap className="size-5" />,
    },
];

const totalCurriculumLessons = (course: CourseDetailsPageProps['course']) =>
    course.curriculum_sections.reduce((sum, section) => sum + section.lessons.length, 0);

export default function CourseDetails({ course }: CourseDetailsPageProps) {
    const infoCards = buildInfoCards(course);
    const descriptionPoints = course.description_points.length > 0
        ? course.description_points
        : (course.short_description ? [course.short_description] : []);
    const learningPoints = course.what_you_will_learn.filter(Boolean);
    const curriculumLessons = totalCurriculumLessons(course);

    return (
        <MainLayout>
            <Head title={course.title} />

            <div dir="rtl" lang="ar" className="relative overflow-hidden bg-[linear-gradient(180deg,#fff8ef_0%,#ffffff_42%,#f8fbff_100%)] text-right">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_26%)]" />

                <section className="relative pb-10 pt-8 sm:pb-14">
                    <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
                        <div className="rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.35)] backdrop-blur-sm">
                            <Breadcrumb>
                                <BreadcrumbList className="justify-start text-slate-500">
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild className="hover:text-orange-600">
                                            <Link href="/">الرئيسية</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="text-slate-300" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild className="hover:text-orange-600">
                                            <Link href="/#programming-courses">الكورسات</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="text-slate-300" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="font-bold text-slate-900">{course.title}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_430px]">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    {course.category ? (
                                        <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                                            {course.category}
                                        </span>
                                    ) : null}

                                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                                        {course.level || 'مناسب للجميع'}
                                    </span>
                                </div>

                                <div>
                                    <h1 className="font-playpen-arabic text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl lg:text-[3rem]">
                                        {course.title}
                                    </h1>
                                    {course.short_description ? (
                                        <p className="mt-4 max-w-2xl overflow-hidden text-base leading-8 text-slate-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] sm:text-lg">
                                            {course.short_description}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                        asChild
                                        className="h-12 rounded-2xl bg-orange-600 px-6 text-base font-black text-white shadow-[0_18px_30px_-18px_rgba(249,115,22,0.9)] hover:bg-orange-700"
                                    >
                                        <Link href={course.cta.url}>احجز الآن</Link>
                                    </Button>

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="h-12 rounded-2xl border-orange-200 bg-white px-6 text-base font-bold text-orange-700 hover:bg-orange-50"
                                    >
                                        <a href="#course-content">
                                            عرض المحتوى
                                            <ArrowLeft className="ms-2 size-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -right-4 -top-4 h-28 w-28 rounded-full bg-orange-200/40 blur-3xl" />
                                <div className="absolute -bottom-6 -left-2 h-24 w-24 rounded-full bg-sky-200/50 blur-3xl" />

                                <div className="relative overflow-hidden rounded-[34px] border border-orange-100 bg-white p-3 shadow-[0_28px_70px_-34px_rgba(15,23,42,0.34)]">
                                    <div className="aspect-[4/3] overflow-hidden rounded-[26px] bg-slate-100">
                                        {course.thumbnail ? (
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center p-6 text-center font-playpen-arabic text-2xl font-black text-slate-500">
                                                {course.title}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
                                            <div className="text-xs font-bold text-orange-700">المدة</div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{course.duration_label}</div>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <div className="text-xs font-bold text-slate-500">عدد الدروس</div>
                                            <div className="mt-1 text-sm font-black text-slate-900">{course.lessons_count} درس</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {infoCards.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[26px] border border-white/80 bg-white/90 px-5 py-5 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.28)] backdrop-blur-sm"
                                >
                                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                                        {item.icon}
                                    </div>
                                    <div className="mt-4 text-sm font-bold text-slate-500">{item.label}</div>
                                    <div className="mt-2 text-base font-black text-slate-950">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative pb-20">
                    <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-6 xl:grid-cols-2">
                            {descriptionPoints.length > 0 ? (
                                <CourseDetailSection
                                    title="وصف الكورس"
                                    subtitle="نظرة سريعة وواضحة على فكرة الكورس وما يقدمه."
                                    icon={<FileText className="size-5" />}
                                >
                                    <div className="grid gap-3">
                                        {descriptionPoints.map((point) => (
                                            <div
                                                key={point}
                                                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                                            >
                                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                                                <p className="text-sm leading-7 text-slate-700">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CourseDetailSection>
                            ) : null}

                            {learningPoints.length > 0 ? (
                                <CourseDetailSection
                                    title="ماذا سيتعلم الطفل؟"
                                    subtitle="أهم المهارات والنواتج التي يخرج بها من الكورس."
                                    icon={<Target className="size-5" />}
                                >
                                    <div className="grid gap-3">
                                        {learningPoints.map((point) => (
                                            <div
                                                key={point}
                                                className="flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3"
                                            >
                                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                                                    <Sparkles className="size-4" />
                                                </div>
                                                <p className="text-sm leading-7 text-slate-700">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CourseDetailSection>
                            ) : null}
                        </div>

                        <div id="course-content" className="mt-6">
                            <CourseDetailSection
                                title="محتوى الكورس"
                                subtitle={`${course.curriculum_sections.length} قسم • ${curriculumLessons} درس • ${course.duration_label}`}
                                icon={<BookOpen className="size-5" />}
                            >
                                <CourseCurriculum sections={course.curriculum_sections} />
                            </CourseDetailSection>
                        </div>

                        <div className="mt-6 rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-100 text-xl font-black text-orange-700">
                                        {course.instructor.image ? (
                                            <img
                                                src={course.instructor.image}
                                                alt={course.instructor.name || 'Instructor'}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            (course.instructor.name || 'ك').slice(0, 1)
                                        )}
                                    </div>

                                    <div>
                                        <div className="text-sm font-bold text-slate-500">المدرب</div>
                                        <div className="mt-1 text-lg font-black text-slate-950">
                                            {course.instructor.name || 'فريق Kid Coder'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                                        {course.level || 'مناسب للجميع'}
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                                        {course.lessons_count} درس
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700">
                                        {course.duration_label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <CourseDetailSection
                                title="كورسات أخرى"
                                subtitle="كورسـات مرتبطة قد تناسب نفس المستوى أو الاهتمام."
                                icon={<Layers3 className="size-5" />}
                            >
                                {course.related_courses.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                                        {course.related_courses.map((relatedCourse, index) => (
                                            <CourseShowcaseCard
                                                key={relatedCourse.id}
                                                course={relatedCourse}
                                                layout="grid"
                                                animationDelay={index * 0.08}
                                                className="min-h-[390px]"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50 px-5 py-8 text-center text-sm font-semibold text-slate-600">
                                        لا توجد كورسات مرتبطة متاحة الآن.
                                    </div>
                                )}
                            </CourseDetailSection>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
