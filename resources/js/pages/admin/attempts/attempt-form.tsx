import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export type AttemptFormData = {
    student_id: number | null;
    exam_id: number | null;
    score: string;
    started_at: string;
    finished_at: string;
    is_passed: boolean;
};

type Option = {
    id: number;
    name?: string;
    title?: string;
};

type AttemptFormProps = {
    data: AttemptFormData;
    setData: {
        (key: 'student_id', value: number | null): void;
        (key: 'exam_id', value: number | null): void;
        (key: 'score', value: string): void;
        (key: 'started_at', value: string): void;
        (key: 'finished_at', value: string): void;
        (key: 'is_passed', value: boolean): void;
    };
    errors: Partial<Record<keyof AttemptFormData, string>>;
    students: Option[];
    exams: Option[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AttemptForm({ data, setData, errors, students, exams, processing, submitLabel, onSubmit }: AttemptFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <section className="rounded-[24px] border border-orange-100 bg-orange-50/70 p-5">
                <div className="text-right">
                    <p className="text-xs font-bold tracking-[0.3em] text-orange-500">متابعة التقييم</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات محاولة الاختبار</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        اختر الطالب والاختبار ثم سجّل نتيجة المحاولة ووقت البداية والنهاية بشكل واضح.
                    </p>
                </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="student_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الطالب
                    </label>
                    <select
                        id="student_id"
                        value={data.student_id ?? ''}
                        onChange={(event) => setData('student_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر الطالب</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.student_id} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="exam_id" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الاختبار
                    </label>
                    <select
                        id="exam_id"
                        value={data.exam_id ?? ''}
                        onChange={(event) => setData('exam_id', event.target.value ? Number(event.target.value) : null)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    >
                        <option value="">اختر الاختبار</option>
                        {exams.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                                {exam.title}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.exam_id} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="score" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        الدرجة
                    </label>
                    <input
                        id="score"
                        type="number"
                        min="0"
                        value={data.score}
                        onChange={(event) => setData('score', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    />
                    <InputError message={errors.score} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="started_at" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        وقت البداية
                    </label>
                    <input
                        id="started_at"
                        type="datetime-local"
                        value={data.started_at}
                        onChange={(event) => setData('started_at', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                    <InputError message={errors.started_at} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="finished_at" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        وقت الانتهاء
                    </label>
                    <input
                        id="finished_at"
                        type="datetime-local"
                        value={data.finished_at}
                        onChange={(event) => setData('finished_at', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                    <InputError message={errors.finished_at} className="mt-2" />
                </div>
            </div>

            <label className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <span>تم اجتياز الاختبار</span>
                <input
                    type="checkbox"
                    checked={data.is_passed}
                    onChange={(event) => setData('is_passed', event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                />
            </label>
            <InputError message={errors.is_passed} className="mt-2" />

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
