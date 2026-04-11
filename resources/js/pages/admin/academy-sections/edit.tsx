import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import SectionForm from './section-form';

type AcademySection = {
    id: number;
    title: string;
    description: string;
    status: boolean;
    sort_order: number;
};

export default function AcademySectionsEdit({ section }: { section: AcademySection }) {
    const { data, setData, put, processing, errors } = useForm({
        title: section.title,
        description: section.description,
        sort_order: section.sort_order,
        status: section.status,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/academy-sections/${section.id}`);
    };

    return (
        <AdminLayout title="تعديل قسم الأكاديمية">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل بيانات القسم</h1>
                        <p className="mt-1 text-sm text-slate-500">راجع النصوص والترتيب والحالة قبل الحفظ.</p>
                    </div>
                    <Link
                        href="/admin/academy-sections"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <SectionForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                />
            </div>
        </AdminLayout>
    );
}
