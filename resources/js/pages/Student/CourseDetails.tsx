import { Link, useForm, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardList, Download, Heart, Lock, PlayCircle, Star, Trophy } from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentProgressBar } from '@/components/student/student-progress-bar';
import { StudentShell } from '@/components/student/student-shell';

type ResourceItem = {
    id: number;
    title: string;
    download_url: string;
};

type ReviewItem = {
    id: number;
    rating: number;
    comment: string;
    created_at_label: string | null;
    student: {
        id: number | null;
        name: string | null;
        profile_picture: string | null;
    };
};

type CourseDetailsPageProps = {
    course: {
        id: number;
        title: string;
        description: string | null;
        thumbnail_url: string | null;
        category: string | null;
        instructor: string | null;
        lessons_count: number;
        tasks_count: number;
        quizzes_count: number;
        resources_count: number;
        show_url: string;
        enroll_url: string | null;
        favorite_url: string;
        progress: {
            completed_lessons: number;
            total_lessons: number;
            percentage: number;
        };
        access_state: {
            is_enrolled: boolean;
            is_favorited: boolean;
            locked_message: string | null;
        };
        lessons: {
            id: number;
            title: string;
            description: string | null;
            duration_minutes: number;
            is_locked: boolean;
            is_completed: boolean;
            show_url: string | null;
            resources: ResourceItem[];
        }[];
        course_resources: ResourceItem[];
        tasks: {
            id: number;
            title: string;
            due_date_label: string | null;
            submission: { status: string } | null;
        }[];
        quizzes: {
            id: number;
            title: string;
            publish_date_label: string | null;
            attempts_remaining: number;
            is_published: boolean;
            show_url: string;
            latest_attempt?: {
                score: number | null;
                status_label: string;
                finished_at_label: string | null;
            } | null;
        }[];
        reviews: {
            count: number;
            average_rating: number;
            can_review: boolean;
            store_url: string;
            student_review: ReviewItem | null;
            items: ReviewItem[];
        };
    };
};

export default function CourseDetails() {
    const { course } = usePage<CourseDetailsPageProps>().props;
    const reviewForm = useForm({
        rating: course.reviews.student_review?.rating ?? 5,
        comment: course.reviews.student_review?.comment ?? '',
    });

    return (
        <StudentShell title={course.title} subtitle="تصفّح خطة الكورس والدروس والموارد، ثم ابدأ الاشتراك أو تابع التقدّم إذا كنت مسجلًا بالفعل.">
            <div className="space-y-6">
                <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                    <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="p-6">
                            <div className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                                {course.category || 'كورس تعليمي'}
                            </div>
                            <h2 className="mt-4 font-playpen-arabic text-3xl font-extrabold text-slate-900">{course.title}</h2>
                            <p className="mt-3 max-w-3xl text-sm leading-8 text-slate-600">{course.description || 'سيظهر وصف الكورس هنا عند توفره.'}</p>

                            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">المدرّب: {course.instructor || 'غير محدد'}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">الدروس: {course.lessons_count}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">الموارد: {course.resources_count}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">المهام: {course.tasks_count}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">الاختبارات: {course.quizzes_count}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">التقييم: {course.reviews.average_rating.toFixed(1)} / 5</div>
                            </div>

                            <div className="mt-6">
                                <StudentProgressBar
                                    value={course.progress.percentage}
                                    label={
                                        course.access_state.is_enrolled
                                            ? `${course.progress.completed_lessons} من ${course.progress.total_lessons} دروس`
                                            : 'سيتتبع التقدّم هنا بعد الاشتراك'
                                    }
                                />
                            </div>

                            {course.access_state.locked_message && (
                                <div className="mt-5 rounded-[24px] border border-orange-100 bg-orange-50/70 px-4 py-4 text-sm leading-7 text-slate-700">
                                    {course.access_state.locked_message}
                                </div>
                            )}

                            <div className="mt-5 flex flex-wrap gap-3">
                                {course.enroll_url && (
                                    <Link
                                        href={course.enroll_url}
                                        method="post"
                                        as="button"
                                        className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                                    >
                                        الاشتراك في الكورس
                                    </Link>
                                )}

                                <Link
                                    href={course.favorite_url}
                                    method="post"
                                    as="button"
                                    preserveScroll
                                    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                                        course.access_state.is_favorited
                                            ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300'
                                            : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50'
                                    }`}
                                >
                                    <Heart size={16} className={course.access_state.is_favorited ? 'fill-current' : ''} />
                                    {course.access_state.is_favorited ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
                                </Link>
                            </div>
                        </div>

                        <div className="min-h-[280px] bg-[linear-gradient(135deg,#fed7aa_0%,#fef3c7_50%,#bae6fd_100%)]">
                            {course.thumbnail_url ? (
                                <img src={course.thumbnail_url} alt={course.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full min-h-[280px] items-center justify-center text-6xl font-black text-slate-700">{course.title.slice(0, 2)}</div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                    <section className="space-y-6 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">خطة الدروس</h3>
                                <p className="text-sm text-slate-600">
                                    {course.access_state.is_enrolled
                                        ? 'الدروس التالية تُفتح بالترتيب بعد إكمال السابقة.'
                                        : 'يمكنك استعراض عناوين الدروس الآن، لكن فتح المحتوى يتطلب الاشتراك.'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {course.lessons.map((lesson, index) => (
                                <article key={lesson.id} className="rounded-[26px] border border-slate-100 bg-slate-50/70 p-4">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-black ${lesson.is_completed ? 'bg-emerald-100 text-emerald-700' : lesson.is_locked ? 'bg-slate-200 text-slate-500' : 'bg-orange-100 text-orange-700'}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h4 className="text-lg font-black text-slate-900">{lesson.title}</h4>
                                                    {lesson.is_completed && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">مكتمل</span>}
                                                    {lesson.is_locked && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                                                            <Lock size={12} />
                                                            مقفول
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-sm leading-7 text-slate-600">{lesson.description || 'لا يوجد وصف لهذا الدرس.'}</p>
                                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                                    <span className="rounded-full bg-white px-3 py-1">المدة: {lesson.duration_minutes} دقيقة</span>
                                                    <span className="rounded-full bg-white px-3 py-1">الموارد: {lesson.resources.length}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {lesson.show_url ? (
                                                <Link href={lesson.show_url} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
                                                    <PlayCircle size={18} />
                                                    فتح الدرس
                                                </Link>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-500">
                                                    <Lock size={18} />
                                                    {course.access_state.is_enrolled ? 'غير متاح بعد' : 'يتطلب الاشتراك'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                                    <Download size={20} />
                                </div>
                                <div>
                                    <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">الموارد</h3>
                                    <p className="text-sm text-slate-600">ملفات الكورس العامة والموارد القابلة للتحميل.</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {course.course_resources.length > 0 ? (
                                    course.course_resources.map((resource) => (
                                        <a key={resource.id} href={resource.download_url} className="flex items-center justify-between rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50/60">
                                            <span>{resource.title}</span>
                                            <Download size={16} />
                                        </a>
                                    ))
                                ) : (
                                    <StudentEmptyState
                                        title={course.access_state.is_enrolled ? 'لا توجد موارد عامة' : 'الموارد ستظهر بعد الاشتراك'}
                                        description={
                                            course.access_state.is_enrolled
                                                ? 'ستظهر ملفات الكورس هنا عندما يضيفها المدرّس.'
                                                : 'اشترك في الكورس أولًا للوصول إلى ملفات الدروس والموارد العامة.'
                                        }
                                    />
                                )}
                            </div>
                        </section>

                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                                    <ClipboardList size={20} />
                                </div>
                                <div>
                                    <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">المهام</h3>
                                    <p className="text-sm text-slate-600">ملخّص حالة التسليمات المرتبطة بهذا الكورس.</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {course.tasks.length > 0 ? (
                                    course.tasks.map((task) => (
                                        <article key={task.id} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="text-sm font-black text-slate-900">{task.title}</div>
                                            <div className="mt-2 text-xs font-semibold text-slate-500">{task.due_date_label || 'بدون موعد نهائي'}</div>
                                            <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-orange-700">
                                                {task.submission?.status ? `الحالة: ${task.submission.status}` : 'لم يتم التسليم بعد'}
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <StudentEmptyState
                                        title={course.access_state.is_enrolled ? 'لا توجد مهام' : 'المهام غير متاحة بعد'}
                                        description={
                                            course.access_state.is_enrolled
                                                ? 'لا توجد مهام مرتبطة بهذا الكورس حاليًا.'
                                                : 'عند الاشتراك ستظهر هنا المهام المطلوبة وحالة تسليماتك.'
                                        }
                                    />
                                )}
                            </div>
                        </section>

                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">الاختبارات</h3>
                                    <p className="text-sm text-slate-600">ابدأ الاختبار عند نشره، وراجع آخر نتيجة مباشرة من هنا.</p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                {course.quizzes.length > 0 ? (
                                    course.quizzes.map((quiz) => (
                                        <Link key={quiz.id} href={quiz.show_url} className="block rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-rose-200 hover:bg-rose-50/60">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-sm font-black text-slate-900">{quiz.title}</div>
                                                    <div className="mt-1 text-xs font-semibold text-slate-500">{quiz.publish_date_label || 'متاح الآن'}</div>
                                                    {quiz.latest_attempt && (
                                                        <div className="mt-2 text-xs font-bold text-orange-700">
                                                            آخر نتيجة: {quiz.latest_attempt.score ?? 0} - {quiz.latest_attempt.status_label}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-700">
                                                    {quiz.is_published ? `المتبقي ${quiz.attempts_remaining} محاولة` : 'قريبًا'}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <StudentEmptyState
                                        title={course.access_state.is_enrolled ? 'لا توجد اختبارات' : 'الاختبارات غير متاحة بعد'}
                                        description={
                                            course.access_state.is_enrolled
                                                ? 'سيظهر أي اختبار جديد لهذا الكورس هنا تلقائيًا.'
                                                : 'بعد الاشتراك ستظهر الاختبارات ومحاولاتك ونتائجك داخل هذه المساحة.'
                                        }
                                    />
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h3 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">التقييمات والمراجعات</h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">راجع آراء الطلاب المسجلين، وأضف تقييمك الخاص بعد تجربتك للكورس.</p>
                            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">متوسط التقييم: {course.reviews.average_rating.toFixed(1)} / 5</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">عدد المراجعات: {course.reviews.count}</div>
                            </div>
                        </div>

                        {course.reviews.can_review && (
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    reviewForm.post(course.reviews.store_url, { preserveScroll: true });
                                }}
                                className="w-full max-w-xl space-y-4 rounded-[28px] border border-orange-100 bg-orange-50/70 p-5"
                            >
                                <div>
                                    <div className="mb-2 text-sm font-black text-slate-900">تقييمك للكورس</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => reviewForm.setData('rating', value)}
                                                className={`inline-flex items-center gap-1 rounded-2xl px-4 py-2 text-sm font-bold transition ${
                                                    reviewForm.data.rating >= value
                                                        ? 'bg-amber-400 text-slate-950'
                                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-200'
                                                }`}
                                            >
                                                <Star size={16} className={reviewForm.data.rating >= value ? 'fill-current' : ''} />
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                    {reviewForm.errors.rating && <div className="mt-2 text-xs font-bold text-red-600">{reviewForm.errors.rating}</div>}
                                </div>

                                <div>
                                    <textarea
                                        value={reviewForm.data.comment}
                                        onChange={(event) => reviewForm.setData('comment', event.target.value)}
                                        rows={4}
                                        placeholder="اكتب تجربة حقيقية: ما الذي أعجبك؟ وما الذي يحتاج تحسينًا؟"
                                        className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-orange-300"
                                    />
                                    {reviewForm.errors.comment && <div className="mt-2 text-xs font-bold text-red-600">{reviewForm.errors.comment}</div>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {reviewForm.processing ? 'جارٍ الحفظ...' : course.reviews.student_review ? 'تحديث التقييم' : 'إضافة التقييم'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-2">
                        {course.reviews.items.length > 0 ? (
                            course.reviews.items.map((review) => (
                                <article key={review.id} className="rounded-[26px] border border-slate-100 bg-slate-50/70 p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-2xl bg-orange-100">
                                                {review.student.profile_picture ? (
                                                    <img src={review.student.profile_picture} alt={review.student.name || 'student'} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-sm font-black text-orange-700">
                                                        {(review.student.name || 'ط').slice(0, 1)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">{review.student.name || 'طالب'}</div>
                                                <div className="mt-1 text-xs font-semibold text-slate-500">{review.created_at_label || 'حديثًا'}</div>
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                                            <Star size={12} className="fill-current" />
                                            {review.rating}/5
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm leading-7 text-slate-700">{review.comment}</p>
                                </article>
                            ))
                        ) : (
                            <StudentEmptyState title="لا توجد مراجعات بعد" description="كن أول من يشارك تجربته مع هذا الكورس بعد الاشتراك فيه." />
                        )}
                    </div>
                </section>
            </div>
        </StudentShell>
    );
}