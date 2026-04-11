import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { CheckCheck, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Answer = {
    id: number;
    attempt?: { id: number } | null;
    student?: { id: number; name: string } | null;
    question?: { id: number; question_text: string } | null;
    selected_option: string | null;
    is_correct: boolean | null;
};

export default function StudentAnswersIndex({ answers }: { answers: PaginatedData<Answer> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/student-answers/${id}`);
    };

    return (
        <AdminLayout title="إجابات الطلاب">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">متابعة التصحيح</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة إجابات الطلاب</h1>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                راجع إجابات الطلاب واربط كل إجابة بالمحاولة والسؤال الصحيحين بشكل واضح.
                            </p>
                        </div>
                        <Link
                            href="/admin/student-answers/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <CheckCheck size={18} />
                            إضافة إجابة
                        </Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {answers.data.map((answer) => (
                        <div key={answer.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">
                                        إجابة #{answer.id} - {answer.student?.name ?? 'طالب غير محدد'}
                                    </div>
                                    <div className="mt-2 text-sm leading-7 text-slate-600">
                                        {answer.question?.question_text ?? 'سؤال غير محدد'}
                                    </div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            المحاولة #{answer.attempt?.id ?? '-'}
                                        </span>
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                                            الاختيار: {answer.selected_option ?? '-'}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 ${
                                                answer.is_correct
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-rose-100 text-rose-700'
                                            }`}
                                        >
                                            {answer.is_correct ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={`/admin/student-answers/${answer.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <Pencil size={16} />
                                        تعديل
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(answer.id)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={16} />
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {answers.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            لا توجد إجابات طلاب مسجلة حاليًا.
                        </div>
                    )}
                </div>
            

                <PaginationLinks links={answers.links} />
            </div>
        </AdminLayout>
    );
}




