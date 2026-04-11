import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import FaqForm, { type FaqFormData } from './faq-form';

export default function FaqCreate() {
    const { data, setData, post, processing, errors } = useForm<FaqFormData>({
        question: '',
        answer_type: 'text',
        answer_text: '',
        video_url: '',
        video_path: '',
        video_file: null,
        video_cover_image: '',
        cover_image_file: null,
        status: true,
        sort_order: 0,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/faqs', { forceFormData: true });
    };

    return (
        <AdminLayout title="إضافة سؤال شائع">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة سؤال شائع جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أضف سؤالًا متكررًا مع إجابة نصية أو فيديو توضيحي مناسب لواجهة الأطفال وأولياء الأمور.
                        </p>
                    </div>

                    <Link
                        href="/admin/faqs"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <FaqForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    submitLabel="حفظ السؤال"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
