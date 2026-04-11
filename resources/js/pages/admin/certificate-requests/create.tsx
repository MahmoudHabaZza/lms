import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import RequestForm, { type CertificateRequestFormData } from './request-form';

type UserOption = {
    id: number;
    name: string;
};

export default function CertificateRequestCreate({
    students,
    instructors,
}: {
    students: UserOption[];
    instructors: UserOption[];
}) {
    const { data, setData, post, processing, errors } = useForm<CertificateRequestFormData>({
        student_id: null,
        instructor_id: null,
        course_title: '',
        status: 'pending',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/certificate-requests');
    };

    return (
        <AdminLayout title="إضافة طلب شهادة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/certificate-requests"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة طلب شهادة جديد</h1>
                        <p className="mt-2 text-sm text-slate-500">أنشئ طلبًا جديدًا وحدد الطالب والمدرب والحالة الحالية.</p>
                    </div>
                </div>

                <RequestForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    students={students}
                    instructors={instructors}
                    processing={processing}
                    submitLabel="حفظ الطلب"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
