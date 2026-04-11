import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import SlideForm from './slide-form';

export default function BannerSlidesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        sub_title: '',
        description: '',
        button_link: '',
        background_image: '',
        background_image_file: null,
        sort_order: 0,
        status: true,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/banner-slides');
    };

    return (
        <AdminLayout title="إضافة شريحة">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة شريحة جديدة</h1>
                        <p className="mt-1 text-sm text-slate-500">أدخل بيانات الشريحة كما ستظهر في الصفحة الرئيسية.</p>
                    </div>
                    <Link
                        href="/admin/banner-slides"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <SlideForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ الشريحة"
                />
            </div>
        </AdminLayout>
    );
}
