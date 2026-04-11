import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseForm, { type CourseFormData } from './course-form';

type Props = {
    course: CourseFormData & { id: number };
    instructors: { id: number; name: string }[];
    categories: { id: number; name: string }[];
};

export default function CoursesEdit({ course, instructors, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm<CourseFormData>({
        title: course.title ?? '',
        description: course.description ?? '',
        short_description: course.short_description ?? '',
        learning_outcome: course.learning_outcome ?? '',
        thumbnail: course.thumbnail ?? '',
        price: course.price ?? 0,
        total_duration_minutes: course.total_duration_minutes ?? 0,
        duration_months: course.duration_months ?? 3,
        sessions_count: course.sessions_count ?? 12,
        sessions_per_week: course.sessions_per_week ?? 1,
        badge: course.badge ?? '',
        accent_color: course.accent_color ?? '#f97316',
        sort_order: course.sort_order ?? 0,
        status: course.status ?? true,
        instructor_id: course.instructor_id ?? null,
        category_id: course.category_id ?? null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/courses/${course.id}`);
    };

    return (
        <AdminLayout title="تعديل كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل الكورس</h1>
                        <p className="mt-1 text-sm text-slate-500">كل بيانات الكورس الأساسية وخطة الجلسات والعرض أصبحت مجمعة في نفس الشاشة.</p>
                    </div>
                    <Link href="/admin/courses" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
                        رجوع للقائمة
                    </Link>
                </div>

                <CourseForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    instructors={instructors}
                    categories={categories}
                    processing={processing}
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
