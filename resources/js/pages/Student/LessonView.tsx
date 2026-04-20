import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    CircleCheckBig,
    Download,
    Lock,
    PlayCircle,
} from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentProgressBar } from '@/components/student/student-progress-bar';
import { StudentShell } from '@/components/student/student-shell';

type LessonPageProps = {
    lessonPage: {
        course: {
            id: number;
            title: string;
            progress: {
                percentage: number;
                completed_lessons: number;
                total_lessons: number;
            };
        };
        lesson: {
            id: number;
            title: string;
            is_completed: boolean;
        };
        content: {
            id: number;
            title: string;
            description: string | null;
            video_source: 'drive' | 'upload' | 'youtube';
            video_url: string | null;
            embed_url: string | null;
            duration_minutes: number;
        };
        resources: { id: number; title: string; download_url: string }[];
        course_resources: { id: number; title: string; download_url: string }[];
        previous_lesson: {
            id: number;
            title: string;
            show_url: string | null;
        } | null;
        next_lesson: {
            id: number;
            title: string;
            show_url: string | null;
        } | null;
        all_lessons: {
            id: number;
            title: string;
            is_completed: boolean;
            is_locked: boolean;
            show_url: string | null;
        }[];
    };
};

export default function LessonView() {
    const { lessonPage } = usePage<LessonPageProps>().props;
    const form = useForm({
        time_spent_minutes: lessonPage.content.duration_minutes,
    });

    return (
        <StudentShell
            title={lessonPage.content.title}
            subtitle="شاهد محتوى الدرس، حمّل موارده، ثم سجّل الإكمال لتحديث تقدمك في الكورس."
        >
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                    <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="aspect-video bg-[linear-gradient(135deg,#fed7aa_0%,#fef3c7_45%,#bae6fd_100%)]">
                            {lessonPage.content.video_source === 'upload' &&
                            lessonPage.content.video_url ? (
                                <video
                                    className="h-full w-full"
                                    src={lessonPage.content.video_url}
                                    controls
                                    controlsList="nodownload"
                                    preload="metadata"
                                />
                            ) : lessonPage.content.embed_url ? (
                                <iframe
                                    title={lessonPage.content.title}
                                    src={lessonPage.content.embed_url}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <div className="rounded-[28px] bg-white/80 p-8 text-center shadow-lg">
                                        <PlayCircle className="mx-auto h-12 w-12 text-orange-600" />
                                        <div className="mt-3 text-lg font-black text-slate-900">
                                            لا يوجد فيديو مرفق
                                        </div>
                                        <div className="mt-2 text-sm text-slate-600">
                                            يمكن متابعة الشرح النصي والموارد
                                            المرفقة لهذا الدرس.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                                    المدة: {lessonPage.content.duration_minutes}{' '}
                                    دقيقة
                                </span>
                                {lessonPage.lesson.is_completed && (
                                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                                        تم إكمال هذا الدرس
                                    </span>
                                )}
                            </div>

                            <p className="mt-5 text-sm leading-8 text-slate-700">
                                {lessonPage.content.description ||
                                    'لا يوجد وصف نصي إضافي لهذا الدرس.'}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                {!lessonPage.lesson.is_completed && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            form.post(
                                                `/student/lessons/${lessonPage.content.id}/complete`,
                                            )
                                        }
                                        disabled={form.processing}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                                    >
                                        <CircleCheckBig size={18} />
                                        تسجيل الإكمال
                                    </button>
                                )}
                                {lessonPage.previous_lesson?.show_url && (
                                    <Link
                                        href={
                                            lessonPage.previous_lesson.show_url
                                        }
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
                                    >
                                        <ChevronRight size={18} />
                                        الدرس السابق
                                    </Link>
                                )}
                                {lessonPage.next_lesson?.show_url && (
                                    <Link
                                        href={lessonPage.next_lesson.show_url}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700"
                                    >
                                        الدرس التالي
                                        <ChevronLeft size={18} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                            موارد الدرس
                        </h3>
                        <div className="mt-4 space-y-3">
                            {lessonPage.resources.length > 0 ? (
                                lessonPage.resources.map((resource) => (
                                    <a
                                        key={resource.id}
                                        href={resource.download_url}
                                        className="flex flex-col gap-3 rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50/60 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <span>{resource.title}</span>
                                        <Download size={16} />
                                    </a>
                                ))
                            ) : (
                                <StudentEmptyState
                                    title="لا توجد موارد للدرس"
                                    description="إذا أضاف المدرّس ملفات لهذا الدرس فستظهر هنا."
                                />
                            )}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                            تقدم الكورس
                        </h3>
                        <div className="mt-4">
                            <StudentProgressBar
                                value={lessonPage.course.progress.percentage}
                                label={`${lessonPage.course.progress.completed_lessons} / ${lessonPage.course.progress.total_lessons} دروس`}
                            />
                        </div>
                        <Link
                            href={`/student/courses/${lessonPage.course.id}`}
                            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:border-orange-300 sm:w-auto"
                        >
                            العودة إلى صفحة الكورس
                        </Link>
                    </section>

                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                            مسار الدروس
                        </h3>
                        <div className="mt-4 space-y-3">
                            {lessonPage.all_lessons.map((lesson, index) => (
                                <article
                                    key={lesson.id}
                                    className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="text-sm font-black text-slate-900">
                                                {index + 1}. {lesson.title}
                                            </div>
                                            <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                                                {lesson.is_completed
                                                    ? 'مكتمل'
                                                    : lesson.is_locked
                                                      ? 'مقفول'
                                                      : 'متاح'}
                                            </div>
                                        </div>
                                        {lesson.show_url ? (
                                            <Link
                                                href={lesson.show_url}
                                                className="inline-flex min-h-10 items-center justify-center self-start rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700"
                                            >
                                                فتح
                                            </Link>
                                        ) : (
                                            <div className="inline-flex min-h-10 items-center gap-1 self-start rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500">
                                                <Lock size={12} />
                                                انتظار
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">
                            موارد الكورس العامة
                        </h3>
                        <div className="mt-4 space-y-3">
                            {lessonPage.course_resources.length > 0 ? (
                                lessonPage.course_resources.map((resource) => (
                                    <a
                                        key={resource.id}
                                        href={resource.download_url}
                                        className="flex flex-col gap-3 rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50/60 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <span>{resource.title}</span>
                                        <Download size={16} />
                                    </a>
                                ))
                            ) : (
                                <StudentEmptyState
                                    title="لا توجد موارد عامة"
                                    description="سيظهر هنا أي ملف عام مرتبط بالكورس."
                                />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </StudentShell>
    );
}
