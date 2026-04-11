import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import AnswerForm, { type StudentAnswerFormData } from './answer-form';

type LabeledOption = {
    id: number;
    label: string;
};

export default function StudentAnswerCreate({ attempts, questions }: { attempts: LabeledOption[]; questions: LabeledOption[] }) {
    const { data, setData, post, processing, errors } = useForm<StudentAnswerFormData>({
        attempt_id: null,
        question_id: null,
        selected_option: '',
        is_correct: false,
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/student-answers');
    };

    return (
        <AdminLayout title="إضافة إجابة طالب">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/student-answers"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة إجابة طالب جديدة</h1>
                        <p className="mt-2 text-sm text-slate-500">أدخل الإجابة وربطها بالمحاولة والسؤال المناسبين.</p>
                    </div>
                </div>

                <AnswerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    attempts={attempts}
                    questions={questions}
                    processing={processing}
                    submitLabel="حفظ الإجابة"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
