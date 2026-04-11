import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import AttemptForm, { type AttemptFormData } from './attempt-form';

type Attempt = {
    id: number;
    student_id: number | null;
    exam_id: number | null;
    score: number | null;
    started_at: string | null;
    finished_at: string | null;
    is_passed: boolean | null;
};

type Option = {
    id: number;
    name?: string;
    title?: string;
};

export default function AttemptEdit({ attempt, students, exams }: { attempt: Attempt; students: Option[]; exams: Option[] }) {
    const { data, setData, put, processing, errors } = useForm<AttemptFormData>({
        student_id: attempt.student_id,
        exam_id: attempt.exam_id,
        score: attempt.score !== null ? String(attempt.score) : '',
        started_at: attempt.started_at ?? '',
        finished_at: attempt.finished_at ?? '',
        is_passed: Boolean(attempt.is_passed),
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/attempts/${attempt.id}`);
    };

    return (
        <AdminLayout title="تعديل محاولة الاختبار">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/attempts"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل محاولة الاختبار</h1>
                        <p className="mt-2 text-sm text-slate-500">حدّث بيانات الطالب أو الدرجة أو التوقيتات عند الحاجة.</p>
                    </div>
                </div>

                <AttemptForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    students={students}
                    exams={exams}
                    processing={processing}
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
