import { Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import AdminLayout from '../layouts/admin-layout';
import type { FormEvent } from 'react';

export default function QuestionCreate({ exams }: { exams: { id: number; title: string }[] }) {
    const { data, setData, post, processing, errors } = useForm({
        exam_id: exams[0]?.id ? String(exams[0].id) : '',
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        mark: '1',
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/questions');
    };

    return (
        <AdminLayout title="إضافة سؤال">
            <div className="mx-auto w-full max-w-5xl space-y-5">
                <div className="flex items-center justify-between">
                    <div className="text-right"><h1 className="text-2xl font-black text-slate-900">إضافة سؤال جديد</h1></div>
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
                    <button disabled={processing} className="w-full rounded-2xl bg-orange-600 text-white px-4 py-3 text-sm font-semibold">حفظ السؤال</button>
                </form>
            </div>
        </AdminLayout>
    );
}
