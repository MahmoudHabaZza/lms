import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import JourneyPointForm, { type JourneyPointFormData } from './journey-point-form';

export default function AcademyJourneyPointsCreate() {
    const { data, setData, post, processing, errors } = useForm<JourneyPointFormData>({
        title: '',
        icon: '',
        bubble_color: '',
        bubble_style: '',
        sort_order: 0,
        status: true,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/academy-journey-points');
    };

    return (
        <AdminLayout title="إضافة نقطة رحلة">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة نقطة رحلة جديدة</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أضف نقطة جديدة لرحلة الأكاديمية لتظهر داخل الصفحة الرئيسية.
                        </p>
                    </div>

                    <Link
                        href="/admin/academy-journey-points"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <JourneyPointForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ النقطة"
                />
            </div>
        </AdminLayout>
    );
}
