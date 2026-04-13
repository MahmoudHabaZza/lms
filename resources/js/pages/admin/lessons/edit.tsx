import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import LessonForm from './lesson-form';

type Lesson = {
    id: number;
    course_id: number | null;
    course_title?: string | null;
    title: string;
    description: string | null;
    video_source: 'drive' | 'upload' | 'youtube';
    video_url: string | null;
    video_path?: string | null;
    video_path_url?: string | null;
    duration_minutes: number | null;
    order: number | null;
};

type CourseOption = {
    id: number;
    title: string;
};

export default function LessonEdit({ lesson, courses }: { lesson: Lesson; courses: CourseOption[] }) {
    const { data, setData, put, processing, errors } = useForm({
        course_id: lesson.course_id ?? null,
        title: lesson.title ?? '',
        description: lesson.description ?? '',
        video_source: lesson.video_source ?? 'drive',
        video_url: lesson.video_url ?? '',
        video_file: null as File | null,
        duration_minutes: lesson.duration_minutes ?? null,
        order: lesson.order ?? null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/lessons/${lesson.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout title="تعديل درس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل الدرس</h1>
                        <p className="mt-1 text-sm text-slate-500">راجع عنوان الدرس والوصف ومصدر الفيديو (Drive أو رفع ملف أو YouTube) وترتيب الظهور قبل الحفظ.</p>
                    </div>
                    <Link href="/admin/lessons" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
                        رجوع للقائمة
                    </Link>
                </div>

                <LessonForm data={data} setData={setData} errors={errors} courses={courses} processing={processing} onSubmit={onSubmit} submitLabel="حفظ التعديلات" currentVideoPath={lesson.video_path_url ?? lesson.video_path ?? null} />
            </div>
        </AdminLayout>
    );
}
