import { usePage } from '@inertiajs/react';
import { StudentCourseCard } from '@/components/student/student-course-card';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';
import type { StudentCourse } from '@/services/student/course-service';

export default function Favorites() {
    const { favorites = [] } = usePage<{ favorites?: StudentCourse[] }>().props;

    return (
        <StudentShell title="المفضلة" subtitle="الكورسات التي حفظتها للرجوع إليها سريعاً أو للاشتراك فيها لاحقاً.">
            {favorites.length > 0 ? (
                <div className="grid gap-5 xl:grid-cols-2">
                    {favorites.map((course) => (
                        <StudentCourseCard key={course.id} course={course} compact />
                    ))}
                </div>
            ) : (
                <StudentEmptyState
                    title="لا توجد كورسات في المفضلة"
                    description="أضف أي كورس إلى المفضلة من صفحة الكورسات أو من صفحة تفاصيل الكورس ليظهر هنا مباشرة."
                />
            )}
        </StudentShell>
    );
}
