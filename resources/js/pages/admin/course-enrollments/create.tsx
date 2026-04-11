import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseEnrollmentForm, { type CourseEnrollmentFormData } from './enrollment-form';

type Props = {
    students: { id: number; name: string }[];
    courses: { id: number; title: string }[];
};

export default function CourseEnrollmentsCreate({ students, courses }: Props) {
    const { data, setData, post, processing, errors } = useForm<CourseEnrollmentFormData>({
        user_id: students[0]?.id ?? null,
        programming_course_id: courses[0]?.id ?? null,
        enrolled_at: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/course-enrollments');
    };

    return (
        <AdminLayout title="إضافة اشتراك كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة اشتراك كورس</h1>
                    </div>
                    <Link href="/admin/course-enrollments" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <CourseEnrollmentForm data={data} setData={setData} errors={errors} students={students} courses={courses} processing={processing} submitLabel="حفظ الاشتراك" onSubmit={onSubmit} />
            </div>
        </AdminLayout>
    );
}
