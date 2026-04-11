import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export type StudentAnswerFormData = {
    attempt_id: number | null;
    question_id: number | null;
    selected_option: string;
    is_correct: boolean;
};

type LabeledOption = {
    id: number;
    label: string;
};

type StudentAnswerFormProps = {
    data: StudentAnswerFormData;
    setData: {
        (key: 'attempt_id', value: number | null): void;
        (key: 'question_id', value: number | null): void;
        (key: 'selected_option', value: string): void;
        (key: 'is_correct', value: boolean): void;
    };
    errors: Partial<Record<keyof StudentAnswerFormData, string>>;
    attempts: LabeledOption[];
    questions: LabeledOption[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AnswerForm({ data, setData, errors, attempts, questions, processing, submitLabel, onSubmit }: StudentAnswerFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <section className="rounded-[24px] border border-orange-100 bg-orange-50/70 p-5">
                <div className="text-right">
                    <p className="text-xs font-bold tracking-[0.3em] text-orange-500">متابعة الإجابات</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات إجابة الطالب</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        اربط الإجابة بالمحاولة والسؤال الصحيحين ثم حدد الاختيار الذي أجابه الطالب وحالة التصحيح.
                    </p>
                </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="attempt_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        المحاولة
                    </label>
                    <select
                        id="attempt_id"
                        value={data.attempt_id ?? ''}
                        onChange={(event) => setData('attempt_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر المحاولة</option>
                        {attempts.map((attempt) => (
                            <option key={attempt.id} value={attempt.id}>
                                {attempt.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.attempt_id} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="question_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        السؤال
                    </label>
                    <select
                        id="question_id"
                        value={data.question_id ?? ''}
                        onChange={(event) => setData('question_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر السؤال</option>
                        {questions.map((question) => (
                            <option key={question.id} value={question.id}>
                                {question.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.question_id} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="selected_option" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الاختيار المحدد
                    </label>
                    <select
                        id="selected_option"
                        value={data.selected_option}
                        onChange={(event) => setData('selected_option', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر الإجابة</option>
                        {['A', 'B', 'C', 'D'].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.selected_option} className="mt-2" />
                </div>

                <label className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 sm:self-end">
                    <span>الإجابة صحيحة</span>
                    <input
                        type="checkbox"
                        checked={data.is_correct}
                        onChange={(event) => setData('is_correct', event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                    />
                </label>
            </div>
            <InputError message={errors.is_correct} className="mt-2" />

            <button
                type="submit"
                disabled={processing}
                className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
