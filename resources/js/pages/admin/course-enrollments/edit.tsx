import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseEnrollmentForm, { type CourseEnrollmentFormData } from './enrollment-form';

type Props = {
    enrollment: CourseEnrollmentFormData & { id: number };
    students: { id: number; name: string }[];
    courses: { id: number; title: string }[];
};

export default function CourseEnrollmentsEdit({ enrollment, students, courses }: Props) {
    const { data, setData, put, processing, errors } = useForm<CourseEnrollmentFormData>({
        user_id: enrollment.user_id ?? null,
        programming_course_id: enrollment.programming_course_id ?? null,
        enrolled_at: enrollment.enrolled_at ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/course-enrollments/${enrollment.id}`);
    };

    return (
        <AdminLayout title="تعديل اشتراك كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل اشتراك الكورس</h1>
                    </div>
                    <Link href="/admin/course-enrollments" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <CourseEnrollmentForm data={data} setData={setData} errors={errors} students={students} courses={courses} processing={processing} submitLabel="حفظ التعديلات" onSubmit={onSubmit} />
            </div>
        </AdminLayout>
    );
}
