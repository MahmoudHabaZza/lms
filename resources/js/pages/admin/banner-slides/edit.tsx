import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import SlideForm from './slide-form';

type BannerSlide = {
    id: number;
    title: string;
    sub_title: string | null;
    description: string | null;
    button_link: string | null;
    background_image: string | null;
    background_image_url: string | null;
    status: boolean;
    sort_order: number;
};

export default function BannerSlidesEdit({ slide }: { slide: BannerSlide }) {
    const { data, setData, put, processing, errors } = useForm({
        title: slide.title,
        sub_title: slide.sub_title ?? '',
        description: slide.description ?? '',
        button_link: slide.button_link ?? '',
        background_image: slide.background_image ?? '',
        background_image_file: null,
        sort_order: slide.sort_order,
        status: slide.status,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/banner-slides/${slide.id}`);
    };

    return (
        <AdminLayout title="تعديل الشريحة">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل بيانات الشريحة</h1>
                        <p className="mt-1 text-sm text-slate-500">حدّث النصوص أو الصورة أو الترتيب ثم احفظ التغييرات.</p>
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
                    submitLabel="حفظ التعديلات"
                    previewBackgroundImage={slide.background_image_url ?? null}
                />
            </div>
        </AdminLayout>
    );
}
