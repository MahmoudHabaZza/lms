import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import SectionForm from './section-form';

export default function AcademySectionsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: 'رحلة في عالم كيد كودر',
        description:
            'أكاديمية متخصصة في تعليم البرمجة والمهارات الرقمية للأطفال واليافعين، عبر مسارات ممتعة وعملية تناسب مختلف المراحل العمرية.',
        sort_order: 0,
        status: true,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/academy-sections');
    };

    return (
        <AdminLayout title="إضافة قسم أكاديمية">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة قسم جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">أضف قسمًا يشرح جانبًا من رحلة الطفل داخل الأكاديمية.</p>
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
                    submitLabel="حفظ القسم"
                />
            </div>
        </AdminLayout>
    );
}
