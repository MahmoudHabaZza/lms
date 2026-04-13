import { Head, usePage } from '@inertiajs/react';
import type { PublicCourseCard } from '@/components/end-user/course-showcase-card';
import MainLayout from '../layouts/master';
import AcademyJourneySection from './AcademyJourneySection';
import CourseReelsSection from './CourseReelsSection';
import ExploreMoreSection from './ExploreMoreSection';
import FaqSection from './FaqSection';
import ProgrammingTrackSection from './ProgrammingTrackSection';
import SectionThree from './SectionThree';
import StudentFeedbackGallerySection from './StudentFeedbackGallerySection';
import TopStudentsSection from './TopStudentsSection';

type BannerSlide = {
    id: number;
    title: string;
    sub_title: string | null;
    description: string | null;
    button_link: string | null;
    background_image: string | null;
};

type AcademySection = {
    id: number;
    title: string;
    description: string;
};

type StudentReel = {
    id: number;
    student_name: string;
    student_title: string | null;
    student_age: number | null;
    cover_image: string | null;
    video_url: string | null;
    quote: string | null;
};

type StudentFeedbackImage = {
    id: number;
    student_name: string;
    caption: string | null;
    image: string | null;
};

type TopStudent = {
    id: number;
    student_name: string;
    achievement: string | null;
    image: string | null;
};

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

type FaqItem = {
    id: number;
    question: string;
    answer_type: 'text' | 'video';
    answer_text: string | null;
    video_url: string | null;
    video_cover_image: string | null;
};

type HomeProps = {
    bannerSlides?: BannerSlide[];
    academySection?: AcademySection | null;
    courses?: PublicCourseCard[];
    studentReels?: StudentReel[];
    courseReels?: CourseReel[];
    topStudents?: TopStudent[];
    studentFeedbackImages?: StudentFeedbackImage[];
    faqs?: FaqItem[];
};

export default function Home({
    bannerSlides = [],
    academySection = null,
    courses = [],
    studentReels = [],
    courseReels = [],
    topStudents = [],
    studentFeedbackImages = [],
    faqs = [],
}: HomeProps) {
    const { settings } = usePage<{ settings?: Record<string, string | null> }>().props;
    const homeIntroSubtitle = settings?.home_intro_subtitle || 'أكاديمية برمجة للأطفال والناشئين';

    return (
        <MainLayout>
            <Head title="كيد كودر | برمجة الأطفال" />

            <div>
                <SectionThree slides={bannerSlides} staticSection={academySection} />
                <AcademyJourneySection />
                <ProgrammingTrackSection courses={courses} />
                <CourseReelsSection courseReels={courseReels} />

                {academySection && (
                    <section className="relative overflow-hidden bg-gradient-to-b from-[#fff6ea] via-white to-[#f8fbff] py-16 sm:py-20" dir="rtl">
                        <div className="academy-intro-orb academy-intro-orb-1" />
                        <div className="academy-intro-orb academy-intro-orb-2" />
                        <div className="academy-intro-grid" />

                        <div className="relative mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-12">
                            <div className="academy-intro-card w-full text-center">
                                <h2 className="academy-title-group inline-flex w-full items-center justify-center gap-4 font-playpen-arabic text-[clamp(1.8rem,4.9vw,4rem)] font-bold leading-tight text-slate-900">
                                    <span className="inline-flex items-center gap-3" aria-hidden="true">
                                        <span className="h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent via-orange-300 to-orange-500 sm:w-16" />
                                        <span className="h-4 w-4 rounded-full border-[3px] border-orange-400 bg-white shadow-[0_0_0_6px_color-mix(in_srgb,var(--site-primary-400)_18%,transparent)]" />
                                    </span>
                                    <span>{academySection.title}</span>
                                    <span className="inline-flex items-center gap-3" aria-hidden="true">
                                        <span className="h-4 w-4 rounded-full border-[3px] border-orange-400 bg-white shadow-[0_0_0_6px_color-mix(in_srgb,var(--site-primary-400)_18%,transparent)]" />
                                        <span className="h-0.5 w-10 rounded-full bg-gradient-to-l from-transparent via-orange-300 to-orange-500 sm:w-16" />
                                    </span>
                                </h2>

                                <p className="mt-4 font-playpen-arabic text-base font-semibold text-orange-600 sm:text-lg">
                                    {homeIntroSubtitle}
                                </p>

                                <p className="mx-auto mt-5 max-w-6xl text-sm leading-8 text-slate-700 sm:text-base sm:leading-8 lg:text-xl lg:leading-10">
                                    {academySection.description}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <TopStudentsSection topStudents={topStudents} />
                <ExploreMoreSection studentReels={studentReels} />
                <StudentFeedbackGallerySection studentFeedbackImages={studentFeedbackImages} />
                <FaqSection faqs={faqs} />
            </div>
        </MainLayout>
    );
}

