import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import JourneyPointForm, { type JourneyPointFormData } from './journey-point-form';

type JourneyPoint = {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    bubble_color: string;
    bubble_style: string;
    status: boolean;
    sort_order: number;
};

export default function AcademyJourneyPointsEdit({ journeyPoint }: { journeyPoint: JourneyPoint }) {
    const { data, setData, post, processing, errors } = useForm<JourneyPointFormData & { _method: 'put' }>({
        title: journeyPoint.title,
        subtitle: journeyPoint.subtitle,
        icon: journeyPoint.icon,
        bubble_color: journeyPoint.bubble_color,
        bubble_style: journeyPoint.bubble_style,
        sort_order: journeyPoint.sort_order,
        status: journeyPoint.status,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/academy-journey-points/${journeyPoint.id}`);
    };

    return (
        <AdminLayout title="تعديل نقطة رحلة">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل نقطة الرحلة</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            حدّث محتوى النقطة أو أيقونتها أو ترتيب ظهورها قبل حفظ التعديلات.
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
                    submitLabel="حفظ التعديلات"
                />
            </div>
        </AdminLayout>
    );
}
