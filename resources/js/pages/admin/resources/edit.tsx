import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import ResourceForm from './resource-form';

type Resource = {
    id: number;
    course_id: number | null;
    course_title?: string | null;
    title: string;
    file_url: string | null;
    file: string | null;
};

type CourseOption = {
    id: number;
    title: string;
};

export default function ResourceEdit({ resource, courses }: { resource: Resource; courses: CourseOption[] }) {
    const { data, setData, put, processing, errors } = useForm({
        course_id: resource.course_id ?? null,
        title: resource.title ?? '',
        file: null as File | null,
        file_url: resource.file_url ?? resource.file ?? null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/resources/${resource.id}`);
    };

    return (
        <AdminLayout title="تعديل مورد">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل المورد</h1>
                        <p className="mt-1 text-sm text-slate-500">راجع عنوان المورد والكورس والملف المرتبط به قبل حفظ التعديلات.</p>
                    </div>
                    <Link href="/admin/resources" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>

                <ResourceForm data={data} setData={setData} errors={errors} courses={courses} processing={processing} onSubmit={onSubmit} submitLabel="حفظ التعديلات" />
            </div>
        </AdminLayout>
    );
}
