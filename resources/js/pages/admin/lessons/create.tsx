import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import LessonForm from './lesson-form';

type CourseOption = {
    id: number;
    title: string;
};

export default function LessonCreate({ courses }: { courses: CourseOption[] }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: null as number | null,
        title: '',
        description: '',
        video_url: '',
        duration_minutes: null as number | null,
        order: null as number | null,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/lessons');
    };

    return (
        <AdminLayout title="إضافة درس">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة درس جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">أدخل بيانات الدرس مع رابط فيديو Drive وترتيب ظهوره داخل الكورس.</p>
                    </div>
                    <Link href="/admin/lessons" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
                        رجوع للقائمة
                    </Link>
                </div>

                <LessonForm data={data} setData={setData} errors={errors} courses={courses} processing={processing} onSubmit={onSubmit} submitLabel="حفظ الدرس" />
            </div>
        </AdminLayout>
    );
}
