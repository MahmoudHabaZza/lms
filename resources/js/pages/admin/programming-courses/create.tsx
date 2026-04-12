import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseForm from './course-form';

export default function ProgrammingCoursesCreate({
    instructors,
}: {
    instructors: { id: number; name: string }[];
}) {
    const page = usePage<{ settings?: { primary_color?: string } }>();
    const primaryColor = page.props.settings?.primary_color?.trim() ?? '';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        thumbnail: '',
        short_description: '',
        learning_outcome: '',
        duration_months: 3,
        sessions_count: 12,
        sessions_per_week: 1,
        badge: '',
        accent_color: primaryColor,
        sort_order: 0,
        status: true,
        instructor_id: null as number | null,
        price: 0,
        total_duration_minutes: 0,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/programming-courses');
    };

    return (
        <AdminLayout title="إضافة مسار برمجي">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة كورس برمجة جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">كل كورسات البرمجة تعرض الآن ضمن فئة موحدة من 5 إلى 17 سنة.</p>
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
                    submitLabel="حفظ الكورس"
                />
            </div>
        </AdminLayout>
    );
}

