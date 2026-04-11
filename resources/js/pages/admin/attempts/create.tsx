import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import AttemptForm, { type AttemptFormData } from './attempt-form';

type Option = {
    id: number;
    name?: string;
    title?: string;
};

export default function AttemptCreate({ students, exams }: { students: Option[]; exams: Option[] }) {
    const { data, setData, post, processing, errors } = useForm<AttemptFormData>({
        student_id: null,
        exam_id: null,
        score: '',
        started_at: '',
        finished_at: '',
        is_passed: false,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/attempts');
    };

    return (
        <AdminLayout title="إضافة محاولة اختبار">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/attempts"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة محاولة اختبار جديدة</h1>
                        <p className="mt-2 text-sm text-slate-500">أنشئ سجلًا جديدًا لمحاولة الطالب مع الدرجة والتوقيت.</p>
                    </div>
                </div>

                <AttemptForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    students={students}
                    exams={exams}
                    processing={processing}
                    submitLabel="حفظ المحاولة"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
