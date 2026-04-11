import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

type Question = {
    id: number;
    exam_id: number | null;
    question_text: string;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
    correct_option: string | null;
    mark: number | null;
};

export default function QuestionEdit({ question, exams }: { question: Question; exams: { id: number; title: string }[] }) {
    const { data, setData, put, processing, errors } = useForm({
        exam_id: question.exam_id ? String(question.exam_id) : '',
        question_text: question.question_text ?? '',
        option_a: question.option_a ?? '',
        option_b: question.option_b ?? '',
        option_c: question.option_c ?? '',
        option_d: question.option_d ?? '',
        correct_option: question.correct_option ?? 'A',
        mark: question.mark ? String(question.mark) : '1',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(`/admin/questions/${question.id}`);
    };

    return (
        <AdminLayout title="تعديل سؤال">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">تعديل السؤال</h1></div>
                    <Link href="/admin/questions" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">رجوع للقائمة</Link>
                </div>
                <form onSubmit={onSubmit} className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الاختبار</label>
                        <select value={data.exam_id} onChange={(e) => setData('exam_id', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">{exams.map((exam) => <option key={exam.id} value={exam.id}>{exam.title}</option>)}</select>
                        <InputError message={errors.exam_id} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-right text-sm font-semibold text-slate-700">نص السؤال</label>
                        <textarea value={data.question_text} onChange={(e) => setData('question_text', e.target.value)} rows={5} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right leading-7" />
                        <InputError message={errors.question_text} className="mt-2" />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div><label className="mb-2 block text-right text-sm font-semibold text-slate-700">الخيار A</label><input value={data.option_a} onChange={(e) => setData('option_a', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" /></div>
                        <div><label className="mb-2 block text-right text-sm font-semibold text-slate-700">الخيار B</label><input value={data.option_b} onChange={(e) => setData('option_b', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" /></div>
                        <div><label className="mb-2 block text-right text-sm font-semibold text-slate-700">الخيار C</label><input value={data.option_c} onChange={(e) => setData('option_c', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" /></div>
                        <div><label className="mb-2 block text-right text-sm font-semibold text-slate-700">الخيار D</label><input value={data.option_d} onChange={(e) => setData('option_d', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" /></div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الإجابة الصحيحة</label>
                            <select value={data.correct_option} onChange={(e) => setData('correct_option', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                                {['A', 'B', 'C', 'D'].map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                            <InputError message={errors.correct_option} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الدرجة</label>
                            <input value={data.mark} onChange={(e) => setData('mark', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right" />
                            <InputError message={errors.mark} className="mt-2" />
                        </div>
                    </div>
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ التعديلات</button>
                </form>
            </div>
        </AdminLayout>
    );
}
