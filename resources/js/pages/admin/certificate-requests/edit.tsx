import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import RequestForm, { type CertificateRequestFormData } from './request-form';

type CertificateRequestModel = {
    id: number;
    student_id: number | null;
    instructor_id: number | null;
    course_title: string | null;
    status: string | null;
};

type UserOption = {
    id: number;
    name: string;
};

export default function CertificateRequestEdit({
    request,
    students,
    instructors,
}: {
    request: CertificateRequestModel;
    students: UserOption[];
    instructors: UserOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<CertificateRequestFormData>({
        student_id: request.student_id,
        instructor_id: request.instructor_id,
        course_title: request.course_title ?? '',
        status: request.status ?? 'pending',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/certificate-requests/${request.id}`);
    };

    return (
        <AdminLayout title="تعديل طلب الشهادة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/certificate-requests"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل طلب الشهادة</h1>
                        <p className="mt-2 text-sm text-slate-500">حدّث اسم الكورس أو المدرب أو حالة الطلب حسب سير المراجعة.</p>
                    </div>
                </div>

                <RequestForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    students={students}
                    instructors={instructors}
                    processing={processing}
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
