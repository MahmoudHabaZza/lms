import { Link, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseForm, { type CourseFormData } from './course-form';

type Props = {
    instructors: { id: number; name: string }[];
    categories: { id: number; name: string }[];
};

export default function CoursesCreate({ instructors, categories }: Props) {
    const page = usePage<{ settings?: { primary_color?: string } }>();
    const primaryColor = page.props.settings?.primary_color?.trim() ?? '';

    const { data, setData, post, processing, errors } = useForm<CourseFormData>({
        title: '',
        description: '',
        short_description: '',
        learning_outcome: '',
        thumbnail: '',
        price: 0,
        total_duration_minutes: 0,
        duration_months: 3,
        sessions_count: 12,
        sessions_per_week: 1,
        badge: '',
        accent_color: primaryColor,
        sort_order: 0,
        status: true,
        instructor_id: instructors[0]?.id ?? null,
        category_id: null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/courses');
    };

    return (
        <AdminLayout title="إضافة كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة كورس جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">من هنا تدير كل الكورسات في مكان واحد بدل فصل المسارات البرمجية عن باقي الكورسات.</p>
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
                    submitLabel="حفظ الكورس"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}

