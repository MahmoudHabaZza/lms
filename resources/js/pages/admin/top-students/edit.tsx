import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import TopStudentForm, { type TopStudentFormData } from './top-student-form';

type TopStudent = {
    id: number;
    student_name: string;
    achievement_title: string | null;
    image_path: string;
    image_url: string | null;
    status: boolean;
    sort_order: number;
};

export default function TopStudentsEdit({ topStudent }: { topStudent: TopStudent }) {
    const { data, setData, post, processing, errors } = useForm<TopStudentFormData & { _method: 'put' }>({
        student_name: topStudent.student_name,
        achievement_title: topStudent.achievement_title ?? '',
        image_path: topStudent.image_path ?? '',
        image_file: null,
        sort_order: topStudent.sort_order,
        status: topStudent.status,
        _method: 'put',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`/admin/top-students/${topStudent.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="تعديل طالب متفوق">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل بطاقة الطالب المتفوق</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            حدّث الصورة أو اللقب أو ترتيب الظهور قبل حفظ التعديلات.
                        </p>
                    </div>

                    <Link
                        href="/admin/top-students"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                </div>

                <TopStudentForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={onSubmit}
                    submitLabel="حفظ التعديلات"
                    previewImage={topStudent.image_url ?? topStudent.image_path}
                />
            </div>
        </AdminLayout>
    );
}
