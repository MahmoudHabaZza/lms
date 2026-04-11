import { Link } from '@inertiajs/react';
import { BookOpen, Heart, PlayCircle, Sparkles } from 'lucide-react';
import { StudentProgressBar } from '@/components/student/student-progress-bar';
import type { StudentCourse } from '@/services/student/course-service';

type StudentCourseCardProps = {
    course: StudentCourse;
    compact?: boolean;
};

export function StudentCourseCard({ course, compact = false }: StudentCourseCardProps) {
    return (
        <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
            <div className="flex h-full flex-col">
                <div className={`relative overflow-hidden bg-[linear-gradient(135deg,#fed7aa_0%,#fef3c7_45%,#bae6fd_100%)] ${compact ? 'h-44' : 'h-52'}`}>
                    {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-5xl font-black text-slate-700">{course.title.slice(0, 2)}</div>
                    )}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-700">
                            {course.category || 'كورس تعليمي'}
                        </div>
                        {course.is_favorited && (
                            <div className="rounded-full bg-rose-100/95 px-3 py-1 text-xs font-bold text-rose-700">
                                في المفضلة
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-900">{course.title}</h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">{course.description || 'سيظهر وصف الكورس هنا عند توفره.'}</p>
                        </div>
                        <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                            <BookOpen size={18} />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold text-slate-600">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">الدروس: {course.lessons_count}</div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">الموارد: {course.resources_count}</div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">المهام: {course.tasks_count}</div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">الاختبارات: {course.quizzes_count}</div>
                    </div>

                    {course.is_enrolled ? (
                        <div className="mt-5">
                            <StudentProgressBar value={course.progress.percentage} label={`${course.progress.completed_lessons} / ${course.progress.total_lessons} دروس`} />
                        </div>
                    ) : (
                        <div className="mt-5 rounded-[24px] border border-orange-100 bg-orange-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
                            هذا الكورس متاح لك للاستكشاف. بعد الاشتراك ستظهر الدروس والمهام والاختبارات كاملة داخل مساحة الطالب.
                        </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href={course.show_url} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
                            {course.is_enrolled ? 'فتح الكورس' : 'استعراض الكورس'}
                        </Link>

                        {course.is_enrolled && course.next_lesson_id ? (
                            <Link href={`/student/lessons/${course.next_lesson_id}`} className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 transition hover:border-orange-300">
                                <PlayCircle size={16} />
                                متابعة الدرس التالي
                            </Link>
                        ) : (
                            course.enroll_url && (
                                <Link
                                    href={course.enroll_url}
                                    method="post"
                                    as="button"
                                    preserveScroll
                                    className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:border-emerald-300"
                                >
                                    الاشتراك الآن
                                </Link>
                            )
                        )}

                        <Link
                            href={course.favorite_url}
                            method="post"
                            as="button"
                            preserveScroll
                            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                                course.is_favorited
                                    ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300'
                                    : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50'
                            }`}
                        >
                            <Heart size={16} className={course.is_favorited ? 'fill-current' : ''} />
                            {course.is_favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                        </Link>

                        {course.instructor && (
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-700">
                                <Sparkles size={16} />
                                {course.instructor}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
