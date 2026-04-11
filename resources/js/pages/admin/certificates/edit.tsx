import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import CertificateForm, { type CertificateFormData } from './certificate-form';

type Certificate = {
    id: number;
    attempt_id: number | null;
    student_id: number | null;
    exam_id: number | null;
    certificate_code: string | null;
    verification_code: string | null;
    image: string | null;
    issued_at: string | null;
};

type StudentOption = { id: number; name: string };
type ExamOption = { id: number; title: string };
type AttemptOption = { id: number; label: string };

export default function CertificateEdit({
    certificate,
    students,
    exams,
    attempts,
}: {
    certificate: Certificate;
    students: StudentOption[];
    exams: ExamOption[];
    attempts: AttemptOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<CertificateFormData>({
        attempt_id: certificate.attempt_id,
        student_id: certificate.student_id,
        exam_id: certificate.exam_id,
        certificate_code: certificate.certificate_code ?? '',
        verification_code: certificate.verification_code ?? '',
        image: certificate.image ?? '',
        issued_at: certificate.issued_at ?? '',
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/certificates/${certificate.id}`);
    };

    return (
        <AdminLayout title="تعديل الشهادة">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/certificates"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل الشهادة</h1>
                        <p className="mt-2 text-sm text-slate-500">حدّث بيانات الشهادة أو أكواد التحقق أو وقت الإصدار.</p>
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
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
