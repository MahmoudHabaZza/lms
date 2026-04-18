import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseForm, { type ProgrammingCourseFormData } from './course-form';

type ProgrammingCourse = ProgrammingCourseFormData & {
    id: number;
};

export default function ProgrammingCoursesEdit({
    course,
    instructors,
}: {
    course: ProgrammingCourse;
    instructors: { id: number; name: string }[];
}) {
    const { data, setData, put, processing, errors } = useForm<ProgrammingCourseFormData>({
        title: course.title,
        age_group: course.age_group ?? '5-17',
        thumbnail: course.thumbnail ?? '',
        short_description: course.short_description,
        learning_outcome: course.learning_outcome ?? '',
        duration_months: course.duration_months,
        sessions_count: course.sessions_count,
        sessions_per_week: course.sessions_per_week,
        badge: course.badge ?? '',
        accent_color: course.accent_color,
        sort_order: course.sort_order,
        status: course.status,
        instructor_id: course.instructor_id ?? null,
        price: course.price ?? 0,
        total_duration_minutes: course.total_duration_minutes ?? 0,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/programming-courses/${course.id}`);
    };

    return (
        <AdminLayout title="تعديل مسار برمجي">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل كورس البرمجة</h1>
                        <p className="mt-1 text-sm text-slate-500">تم توحيد كل كورسات البرمجة تحت فئة واحدة من 5 إلى 17 سنة.</p>
                    </div>
                    <Link href="/admin/programming-courses" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
                        رجوع للقائمة
                    </Link>
                </div>

                <CourseForm
                    data={data}
                    setData={setData}
                    instructors={instructors}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                />
            </div>
        </AdminLayout>
    );
}
