import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import TopStudentForm, { type TopStudentFormData } from './top-student-form';

export default function TopStudentsCreate() {
    const { data, setData, post, processing, errors } = useForm<TopStudentFormData>({
        student_name: '',
        achievement_title: '',
        image_path: '',
        image_file: null,
        sort_order: 0,
        status: true,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/top-students', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="إضافة طالب متفوق">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة طالب متفوق جديد</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            أضف بطاقة جديدة لعرض طالب مميز وإنجازه داخل الصفحة الرئيسية.
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
                    submitLabel="حفظ الطالب"
                />
            </div>
        </AdminLayout>
    );
}
