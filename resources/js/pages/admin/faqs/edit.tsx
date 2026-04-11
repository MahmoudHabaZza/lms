import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import FaqForm, { type FaqFormData } from './faq-form';

type Faq = {
    id: number;
    question: string;
    answer_type: 'text' | 'video';
    answer_text: string | null;
    video_url: string | null;
    video_path: string | null;
    video_path_url?: string | null;
    video_cover_image: string | null;
    video_cover_image_url?: string | null;
    status: boolean;
    sort_order: number;
};

export default function FaqEdit({ faq }: { faq: Faq }) {
    const { data, setData, post, processing, errors } = useForm<FaqFormData & { _method: 'put' }>({
        question: faq.question ?? '',
        answer_type: faq.answer_type ?? 'text',
        answer_text: faq.answer_text ?? '',
        video_url: faq.video_url ?? '',
        video_path: faq.video_path ?? '',
        video_file: null,
        video_cover_image: faq.video_cover_image ?? '',
        cover_image_file: null,
        status: faq.status ?? false,
        sort_order: faq.sort_order ?? 0,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/faqs/${faq.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout title="تعديل سؤال شائع">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل السؤال الشائع</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع نص السؤال وطريقة الإجابة ووسائط العرض قبل حفظ التعديلات.
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
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                    previewVideoCoverImage={faq.video_cover_image_url}
                />
            </div>
        </AdminLayout>
    );
}
