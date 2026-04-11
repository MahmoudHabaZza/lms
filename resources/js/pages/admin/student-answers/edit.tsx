import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import AnswerForm, { type StudentAnswerFormData } from './answer-form';

type Answer = {
    id: number;
    attempt_id: number | null;
    question_id: number | null;
    selected_option: string | null;
    is_correct: boolean | null;
};

type LabeledOption = {
    id: number;
    label: string;
};

export default function StudentAnswerEdit({
    answer,
    attempts,
    questions,
}: {
    answer: Answer;
    attempts: LabeledOption[];
    questions: LabeledOption[];
}) {
    const { data, setData, put, processing, errors } = useForm<StudentAnswerFormData>({
        attempt_id: answer.attempt_id,
        question_id: answer.question_id,
        selected_option: answer.selected_option ?? '',
        is_correct: Boolean(answer.is_correct),
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/student-answers/${answer.id}`);
    };

    return (
        <AdminLayout title="تعديل إجابة الطالب">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/student-answers"
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل إجابة الطالب</h1>
                        <p className="mt-2 text-sm text-slate-500">حدّث الاختيار أو حالة التصحيح عند مراجعة النتائج.</p>
                    </div>
                </div>

                <AnswerForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    attempts={attempts}
                    questions={questions}
                    processing={processing}
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                />
            </div>
        </AdminLayout>
    );
}
