import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import FeedbackImageForm, { type FeedbackImageFormData } from './feedback-image-form';

type FeedbackImage = {
    id: number;
    student_name: string;
    caption: string | null;
    image_path: string;
    image_url: string | null;
    status: boolean;
    sort_order: number;
};

export default function StudentFeedbackImagesEdit({ feedbackImage }: { feedbackImage: FeedbackImage }) {
    const { data, setData, post, processing, errors } = useForm<FeedbackImageFormData & { _method: 'put' }>({
        student_name: feedbackImage.student_name,
        caption: feedbackImage.caption ?? '',
        image_path: feedbackImage.image_path ?? '',
        image_file: null,
        sort_order: feedbackImage.sort_order,
        status: feedbackImage.status,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/student-feedback-images/${feedbackImage.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="تعديل رأي طالب">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل رأي الطالب</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع الاسم والصورة والعبارة القصيرة قبل حفظ التعديلات.
                        </p>
                    </div>

                    <Link
                        href="/admin/student-feedback-images"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <FeedbackImageForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                    previewImage={feedbackImage.image_url ?? feedbackImage.image_path}
                />
            </div>
        </AdminLayout>
    );
}
