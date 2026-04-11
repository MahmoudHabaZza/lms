import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import FeedbackImageForm, { type FeedbackImageFormData } from './feedback-image-form';

export default function StudentFeedbackImagesCreate() {
    const { data, setData, post, processing, errors } = useForm<FeedbackImageFormData>({
        student_name: '',
        caption: '',
        image_path: '',
        image_file: null,
        sort_order: 0,
        status: true,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/student-feedback-images', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="إضافة رأي طالب">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة رأي طالب جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أضف صورة وتجربة قصيرة تمثل تجربة الطالب بصورة إنسانية وواضحة.
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
                    submitLabel="حفظ الرأي"
                />
            </div>
        </AdminLayout>
    );
}
