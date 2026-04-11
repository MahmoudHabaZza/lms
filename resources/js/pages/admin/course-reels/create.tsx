import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CourseReelForm, { type CourseReelFormData } from './reel-form';

export default function CourseReelsCreate({ courses }: { courses: Array<{ id: number; title: string }> }) {
    const { data, setData, post, processing, errors } = useForm<CourseReelFormData>({
        course_id: '',
        title: '',
        cover_image: '',
        cover_image_file: null,
        video_file: null,
        video_url: '',
        description: '',
        sort_order: 0,
        status: true,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/course-reels', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="إضافة ريل كورس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة ريل كورس جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أضف فيديو تعريفي قصير لكورس مع وصف مناسب وصورة غلاف واضحة.
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
                    submitLabel="حفظ الريل"
                    courses={courses}
                />
            </div>
        </AdminLayout>
    );
}
