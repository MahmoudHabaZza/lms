import { useForm, usePage } from '@inertiajs/react';
import { CalendarClock, CheckCircle2, FileText, FileUp, UploadCloud } from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';

type TaskItem = {
    id: number;
    title: string;
    description: string | null;
    course: { id: number; title: string } | null;
    due_date_label: string | null;
    allow_resubmission: boolean;
    task_file_url: string | null;
    submission: {
        status: string;
        score: string | number | null;
        feedback: string | null;
        submitted_at_label: string | null;
        file_url: string | null;
        submission_text: string | null;
        revisions: { id: number; submitted_at_label: string | null; file_url: string | null; submission_text: string | null }[];
    } | null;
};

type TasksPageProps = {
    tasksPage: {
        tasks: TaskItem[];
    };
};

function TaskUploadForm({ taskId, allowResubmission, hasSubmission }: { taskId: number; allowResubmission: boolean; hasSubmission: boolean }) {
    const form = useForm<{ file: File | null; submission_text: string }>({ file: null, submission_text: '' });
    const disabled = hasSubmission && !allowResubmission;

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                form.post(`/student/tasks/${taskId}/submit`, { forceFormData: true });
            }}
            className="space-y-3"
        >
            <label className="flex cursor-pointer items-center gap-3 rounded-[22px] border border-dashed border-orange-200 bg-orange-50/60 px-4 py-4 text-sm font-bold text-orange-700">
                <UploadCloud size={18} />
                <span>{form.data.file ? form.data.file.name : 'اختر ملفًا لرفعه'}</span>
                <input
                    type="file"
                    className="hidden"
                    disabled={disabled || form.processing}
                    onChange={(event) => form.setData('file', event.target.files?.[0] ?? null)}
                />
            </label>
            {form.errors.file && <div className="text-xs font-bold text-red-600">{form.errors.file}</div>}

            <div>
                <textarea
                    value={form.data.submission_text}
                    onChange={(event) => form.setData('submission_text', event.target.value)}
                    rows={4}
                    disabled={disabled || form.processing}
                    placeholder="اكتب وصف الحل أو رابط التنفيذ أو أي ملاحظات تراها مهمة مع التسليم..."
                    className="w-full rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-orange-300"
                />
                {form.errors.submission_text && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.submission_text}</div>}
            </div>

            <button
                type="submit"
                disabled={disabled || form.processing || (!form.data.file && !form.data.submission_text.trim())}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <FileUp size={18} />
                {form.processing ? 'جارٍ الإرسال...' : hasSubmission ? 'رفع نسخة جديدة' : 'تسليم المهمة'}
            </button>
            {disabled && <div className="text-xs font-bold text-slate-500">إعادة التسليم غير مسموحة لهذه المهمة.</div>}
        </form>
    );
}

export default function Tasks() {
    const { tasksPage } = usePage<TasksPageProps>().props;

    return (
        <StudentShell title="المهام" subtitle="تابع مواعيد التسليم، ارفع الملفات المطلوبة أو اكتب الحل نصيًا، وراجع سجل تسليماتك السابقة لكل مهمة.">
            {tasksPage.tasks.length > 0 ? (
                <div className="grid gap-5 xl:grid-cols-2">
                    {tasksPage.tasks.map((task) => (
                        <article key={task.id} className="rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-xs font-semibold tracking-[0.25em] text-orange-500">{task.course?.title || 'TASK'}</div>
                                    <h2 className="mt-3 text-xl font-black text-slate-900">{task.title}</h2>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">{task.description || 'لا يوجد وصف إضافي لهذه المهمة.'}</p>
                                </div>
                                <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                                    <CalendarClock size={18} />
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">الموعد: {task.due_date_label || 'بدون موعد نهائي'}</div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3">الحالة: {task.submission ? task.submission.status : 'لم يتم التسليم'}</div>
                            </div>

                            {task.task_file_url && (
                                <a href={task.task_file_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-bold text-sky-700 transition hover:border-sky-300">
                                    <FileText size={16} />
                                    فتح ملف المهمة
                                </a>
                            )}

                            <div className="mt-5">
                                <TaskUploadForm taskId={task.id} allowResubmission={task.allow_resubmission} hasSubmission={Boolean(task.submission)} />
                            </div>

                            {task.submission && (
                                <div className="mt-5 space-y-4 rounded-[24px] border border-emerald-100 bg-emerald-50/60 p-4">
                                    <div className="flex items-center gap-2 text-sm font-black text-emerald-700">
                                        <CheckCircle2 size={18} />
                                        آخر تسليم
                                    </div>
                                    <div className="text-sm text-slate-700">تاريخ التسليم: {task.submission.submitted_at_label || 'غير محدد'}</div>
                                    {task.submission.feedback && <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">ملاحظات المدرّس: {task.submission.feedback}</div>}
                                    {task.submission.submission_text && <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-7 text-slate-700">نص التسليم: {task.submission.submission_text}</div>}
                                    {task.submission.file_url && (
                                        <a href={task.submission.file_url} target="_blank" rel="noreferrer" className="inline-flex rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700">
                                            فتح الملف المرفوع
                                        </a>
                                    )}

                                    {task.submission.revisions.length > 0 && (
                                        <div className="space-y-2">
                                            <div className="text-xs font-bold text-slate-500">سجل التسليمات</div>
                                            {task.submission.revisions.map((revision) => (
                                                <div key={revision.id} className="space-y-2 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span>{revision.submitted_at_label || 'نسخة محفوظة'}</span>
                                                        {revision.file_url && (
                                                            <a href={revision.file_url} target="_blank" rel="noreferrer" className="font-bold text-orange-700">
                                                                فتح الملف
                                                            </a>
                                                        )}
                                                    </div>
                                                    {revision.submission_text && <div className="text-sm leading-7 text-slate-600">{revision.submission_text}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <StudentEmptyState title="لا توجد مهام حاليًا" description="عندما يضيف المدرّس مهمة جديدة إلى أحد كورساتك ستظهر هنا مباشرة." />
            )}
        </StudentShell>
    );
}