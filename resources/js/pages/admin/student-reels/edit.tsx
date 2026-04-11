import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import StudentReelForm, { type StudentReelFormData } from './reel-form';

type StudentReel = {
    id: number;
    student_name: string;
    student_title: string | null;
    student_age: number | null;
    cover_image: string | null;
    cover_image_url: string | null;
    video_path: string | null;
    video_path_url: string | null;
    quote: string | null;
    status: boolean;
    sort_order: number;
};

export default function StudentReelsEdit({ reel }: { reel: StudentReel }) {
    const { data, setData, post, processing, errors } = useForm<StudentReelFormData & { _method: 'put' }>({
        student_name: reel.student_name,
        student_title: reel.student_title ?? '',
        student_age: reel.student_age ? String(reel.student_age) : '',
        cover_image: reel.cover_image ?? '',
        cover_image_file: null,
        video_file: null,
        quote: reel.quote ?? '',
        sort_order: reel.sort_order,
        status: reel.status,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/student-reels/${reel.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="تعديل ريل طالب">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل ريل الطالب</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع بيانات الطالب والغلاف والاقتباس وملف الفيديو قبل الحفظ.
                        </p>
                    </div>

                    <Link
                        href="/admin/student-reels"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <StudentReelForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                    previewCoverImage={reel.cover_image_url ?? reel.cover_image}
                    currentVideoPath={reel.video_path}
                />
            </div>
        </AdminLayout>
    );
}
