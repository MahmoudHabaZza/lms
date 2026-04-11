import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export type CertificateFormData = {
    attempt_id: number | null;
    student_id: number | null;
    exam_id: number | null;
    certificate_code: string;
    verification_code: string;
    image: string;
    issued_at: string;
};

type NamedOption = {
    id: number;
    name?: string;
    label?: string;
    title?: string;
};

type CertificateFormProps = {
    data: CertificateFormData;
    setData: {
        (key: 'attempt_id', value: number | null): void;
        (key: 'student_id', value: number | null): void;
        (key: 'exam_id', value: number | null): void;
        (key: 'certificate_code', value: string): void;
        (key: 'verification_code', value: string): void;
        (key: 'image', value: string): void;
        (key: 'issued_at', value: string): void;
    };
    errors: Partial<Record<keyof CertificateFormData, string>>;
    students: NamedOption[];
    exams: NamedOption[];
    attempts: NamedOption[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function CertificateForm({
    data,
    setData,
    errors,
    students,
    exams,
    attempts,
    processing,
    submitLabel,
    onSubmit,
}: CertificateFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <section className="rounded-[24px] border border-orange-100 bg-orange-50/70 p-5">
                <div className="text-right">
                    <p className="text-xs font-bold tracking-[0.3em] text-orange-500">الشهادات والاعتماد</p>
                    <h2 className="mt-2 text-xl font-black text-slate-900">بيانات الشهادة</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                        سجّل الشهادة وربطها بالطالب والاختبار والمحاولة مع كود تحقق واضح وسهل التتبع.
                    </p>
                </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-3">
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
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="certificate_code" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        كود الشهادة
                    </label>
                    <input
                        id="certificate_code"
                        value={data.certificate_code}
                        onChange={(event) => setData('certificate_code', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    />
                    <InputError message={errors.certificate_code} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="verification_code" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        كود التحقق
                    </label>
                    <input
                        id="verification_code"
                        value={data.verification_code}
                        onChange={(event) => setData('verification_code', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right"
                    />
                    <InputError message={errors.verification_code} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="image" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        رابط صورة الشهادة
                    </label>
                    <input
                        id="image"
                        type="url"
                        value={data.image}
                        onChange={(event) => setData('image', event.target.value)}
                        placeholder="https://example.com/certificate.png"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left"
                    />
                    <InputError message={errors.image} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="issued_at" className="mb-2 block text-right text-sm font-semibold text-slate-700">
                        تاريخ الإصدار
                    </label>
                    <input
                        id="issued_at"
                        type="datetime-local"
                        value={data.issued_at}
                        onChange={(event) => setData('issued_at', event.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    />
                    <InputError message={errors.issued_at} className="mt-2" />
                </div>
            </div>

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
