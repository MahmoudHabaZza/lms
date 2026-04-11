import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseReelForm, { type CourseReelFormData } from './reel-form';

type CourseReel = {
    id: number;
    course_id: number | null;
    title: string | null;
    cover_image: string | null;
    cover_image_url: string | null;
    video_path: string | null;
    video_path_url: string | null;
    video_url: string | null;
    description: string | null;
    status: boolean;
    sort_order: number;
};

export default function CourseReelsEdit({
    reel,
    courses,
}: {
    reel: CourseReel;
    courses: Array<{ id: number; title: string }>;
}) {
    const { data, setData, post, processing, errors } = useForm<CourseReelFormData & { _method: 'put' }>({
        course_id: reel.course_id ? String(reel.course_id) : '',
        title: reel.title ?? '',
        cover_image: reel.cover_image ?? '',
        cover_image_file: null,
        video_file: null,
        video_url: reel.video_url ?? '',
        description: reel.description ?? '',
        sort_order: reel.sort_order,
        status: reel.status,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/course-reels/${reel.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="تعديل ريل كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل ريل الكورس</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            راجع الكورس المرتبط والغلاف ووصف الريل والفيديو قبل الحفظ.
                        </p>
                    </div>

                    <Link
                        href="/admin/course-reels"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <CourseReelForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                    previewCoverImage={reel.cover_image_url ?? reel.cover_image}
                    currentVideoPath={reel.video_path}
                    courses={courses}
                />
            </div>
        </AdminLayout>
    );
}
