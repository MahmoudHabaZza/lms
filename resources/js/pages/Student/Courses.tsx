import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Heart, Search, Sparkles } from 'lucide-react';
import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import { StudentCourseCard } from '@/components/student/student-course-card';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';
import { StudentStatCard } from '@/components/student/student-stat-card';
import type { StudentCourseDirectory, StudentCourseFilter } from '@/services/student/course-service';
import { studentCourseService } from '@/services/student/course-service';

const filters: { key: StudentCourseFilter; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'enrolled', label: 'المسجل' },
    { key: 'favorites', label: 'المفضلة' },
    { key: 'available', label: 'المتاح' },
];

type CoursesPageProps = {
    coursesPage: StudentCourseDirectory;
};

export default function Courses() {
    const { coursesPage } = usePage<CoursesPageProps>().props;
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<StudentCourseFilter>('all');
    const deferredQuery = useDeferredValue(query);

    const visibleCourses = useMemo(
        () => studentCourseService.filterCourses(coursesPage, activeFilter, deferredQuery),
        [activeFilter, coursesPage, deferredQuery],
    );

    return (
        <StudentShell title="الكورسات" subtitle="استعرض الكورسات المسجل بها والكورسات المتاحة لك، وأدر المفضلة والاشتراك من مكان واحد.">
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StudentStatCard title="كورساتي الحالية" value={coursesPage.stats.enrolled_count} icon={BookOpen} accent="orange" />
                    <StudentStatCard title="كورسات متاحة" value={coursesPage.stats.available_count} icon={Sparkles} accent="sky" />
                    <StudentStatCard title="في المفضلة" value={coursesPage.stats.favorites_count} icon={Heart} accent="rose" />
                    <StudentStatCard title="دروس مكتملة" value={coursesPage.stats.completed_lessons} icon={BookOpen} accent="emerald" />
                </div>

                <div className="flex flex-col gap-4 rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="text-[11px] font-semibold tracking-[0.35em] text-orange-500">COURSES</div>
                            <div className="mt-3 text-sm leading-7 text-slate-600">
                                بدّل بين الكورسات المسجل بها، المفضلة، أو الكورسات المتاحة ثم افتح صفحة كل كورس للاطلاع على المحتوى أو بدء الاشتراك.
                            </div>
                        </div>

                        <div className="flex w-full max-w-md items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                            <Search size={18} className="text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    startTransition(() => setQuery(value));
                                }}
                                placeholder="ابحث باسم الكورس أو المدرّب"
                                className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                type="button"
                                onClick={() => setActiveFilter(filter.key)}
                                className={`rounded-2xl px-4 py-2.5 text-sm font-bold transition ${
                                    activeFilter === filter.key
                                        ? 'bg-slate-900 text-white'
                                        : 'border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}

                        <Link href="/student/favorites" className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:border-rose-300">
                            صفحة المفضلة
                        </Link>
                    </div>
                </div>

                {visibleCourses.length > 0 ? (
                    <div className="grid gap-5 xl:grid-cols-2">
                        {visibleCourses.map((course) => (
                            <StudentCourseCard key={`${activeFilter}-${course.id}`} course={course} />
                        ))}
                    </div>
                ) : (
                    <StudentEmptyState
                        title="لا توجد نتائج مطابقة"
                        description="جرّب تغيير الفلتر الحالي أو استخدام كلمة بحث مختلفة. إذا لم تكن مشتركاً بعد، افتح قسم الكورسات المتاحة وابدأ أول اشتراك."
                    />
                )}
            </div>
        </StudentShell>
    );
}
