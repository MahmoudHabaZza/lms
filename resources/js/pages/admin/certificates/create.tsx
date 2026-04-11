import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CertificateForm, { type CertificateFormData } from './certificate-form';

type StudentOption = { id: number; name: string };
type ExamOption = { id: number; title: string };
type AttemptOption = { id: number; label: string };

export default function CertificateCreate({
    students,
    exams,
    attempts,
}: {
    students: StudentOption[];
    exams: ExamOption[];
    attempts: AttemptOption[];
}) {
    const { data, setData, post, processing, errors } = useForm<CertificateFormData>({
        attempt_id: null,
        student_id: null,
        exam_id: null,
        certificate_code: '',
        verification_code: '',
        image: '',
        issued_at: '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/certificates');
    };

    return (
        <AdminLayout title="إضافة شهادة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/certificates"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة شهادة جديدة</h1>
                        <p className="mt-2 text-sm text-slate-500">أدخل بيانات الشهادة بشكل كامل مع أكواد التحقق وربطها بالطالب.</p>
                    </div>
                </div>

                <CertificateForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    students={students}
                    exams={exams}
                    attempts={attempts}
                    processing={processing}
                    submitLabel="حفظ الشهادة"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
