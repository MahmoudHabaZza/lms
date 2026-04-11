import { Head, usePage } from '@inertiajs/react';
import { Clock3, ShieldAlert, Trophy } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';

type QuestionOption = {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
};

type QuizPageProps = {
    quizPage: {
        exam: {
            id: number;
            title: string;
            description: string | null;
            course: { id: number; title: string } | null;
            time_limit: number | null;
            total_marks: number;
            pass_percentage: number;
            allowed_tab_switches: number;
            attempts_allowed: number;
            attempts_used: number;
            attempts_remaining: number;
            is_published: boolean;
            is_available: boolean;
            question_count: number;
        };
        attempt: {
            id: number;
            status: string;
            attempt_number: number;
            started_at: string | null;
            deadline_at: string | null;
            time_remaining_seconds: number | null;
            tab_switch_count: number;
            submit_url: string;
            security_event_url: string;
            questions: {
                id: number;
                question_text: string;
                mark: number;
                options: QuestionOption[];
            }[];
        } | null;
        latest_result: {
            id: number;
            status: string;
            status_label: string;
            score: number | null;
            is_passed: boolean;
            attempt_number: number;
            finished_at_label: string | null;
            termination_reason_label: string | null;
        } | null;
        history: {
            id: number;
            status: string;
            status_label: string;
            score: number | null;
            is_passed: boolean;
            attempt_number: number;
            termination_reason: string | null;
            termination_reason_label: string | null;
            finished_at_label: string | null;
        }[];
        certificate: {
            download_url: string;
        } | null;
    };
};

function formatTime(totalSeconds: number | null) {
    if (totalSeconds === null) {
        return 'بدون مؤقت';
    }

    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function QuizInterface() {
    const { quizPage } = usePage<QuizPageProps>().props;
    const attempt = quizPage.attempt;
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeRemaining, setTimeRemaining] = useState<number | null>(attempt?.time_remaining_seconds ?? null);
    const [tabSwitches, setTabSwitches] = useState(attempt?.tab_switch_count ?? 0);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const submittedRef = useRef(false);
    const securityRequestInFlight = useRef(false);

    const csrfToken =
        typeof document !== 'undefined'
            ? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''
            : '';

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const submitAttempt = useCallback(async (autoSubmitted = false, reason?: string) => {
        if (!attempt || submittedRef.current || submitting) {
            return;
        }

        submittedRef.current = true;
        setSubmitting(true);
        setMessage(autoSubmitted ? 'جارٍ إرسال الاختبار تلقائيًا...' : 'جارٍ إرسال الإجابات...');

        const payload = {
            auto_submitted: autoSubmitted,
            reason,
            answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
                question_id: Number(questionId),
                selected_option: selectedOption,
            })),
        };

        const response = await fetch(attempt.submit_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            submittedRef.current = false;
            setSubmitting(false);
            setMessage('تعذر إرسال الاختبار. حاول مرة أخرى.');
            return;
        }

        window.location.href = data.redirect_url;
    }, [answers, attempt, csrfToken, submitting]);

    const reportSecurityEvent = useCallback(async (eventName: 'visibility_hidden' | 'window_blur' | 'devtools_detected') => {
        if (!attempt || submittedRef.current || securityRequestInFlight.current) {
            return;
        }

        securityRequestInFlight.current = true;

        try {
            const response = await fetch(attempt.security_event_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ event: eventName }),
            });

            const data = await response.json();
            setTabSwitches(data.tab_switch_count ?? tabSwitches);

            if (data.terminated) {
                setMessage('تم إنهاء الاختبار تلقائيًا بسبب تجاوز عدد مرات مغادرة الصفحة.');
                await submitAttempt(true, 'security_violation');
            }
        } finally {
            securityRequestInFlight.current = false;
        }
    }, [attempt, csrfToken, submitAttempt, tabSwitches]);

    useEffect(() => {
        if (!attempt || timeRemaining === null || submittedRef.current) {
            return;
        }

        if (timeRemaining <= 0) {
            submitAttempt(true, 'time_limit_exceeded');
            return;
        }

        const timer = window.setInterval(() => {
            setTimeRemaining((current) => {
                if (current === null) {
                    return current;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [attempt, timeRemaining, submitAttempt]);

    useEffect(() => {
        if (!attempt) {
            return;
        }

        const onVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                reportSecurityEvent('visibility_hidden');
            }
        };

        const onWindowBlur = () => reportSecurityEvent('window_blur');
        const onContextMenu = (event: MouseEvent) => event.preventDefault();
        const onClipboardAction = (event: ClipboardEvent) => event.preventDefault();
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            const isDevToolsShortcut =
                key === 'f12' ||
                (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
                (event.ctrlKey && key === 'u');

            if (isDevToolsShortcut) {
                event.preventDefault();
                reportSecurityEvent('devtools_detected');
            }
        };

        let lastDevtoolsCheck = 0;
        const devtoolsInterval = window.setInterval(() => {
            const widthGap = window.outerWidth - window.innerWidth;
            const heightGap = window.outerHeight - window.innerHeight;
            const now = Date.now();

            if ((widthGap > 160 || heightGap > 160) && now - lastDevtoolsCheck > 10000) {
                lastDevtoolsCheck = now;
                reportSecurityEvent('devtools_detected');
            }
        }, 3000);

        document.addEventListener('visibilitychange', onVisibilityChange);
        window.addEventListener('blur', onWindowBlur);
        window.addEventListener('contextmenu', onContextMenu);
        window.addEventListener('copy', onClipboardAction);
        window.addEventListener('cut', onClipboardAction);
        window.addEventListener('paste', onClipboardAction);
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', onVisibilityChange);
            window.removeEventListener('blur', onWindowBlur);
            window.removeEventListener('contextmenu', onContextMenu);
            window.removeEventListener('copy', onClipboardAction);
            window.removeEventListener('cut', onClipboardAction);
            window.removeEventListener('paste', onClipboardAction);
            window.removeEventListener('keydown', onKeyDown);
            window.clearInterval(devtoolsInterval);
        };
    }, [attempt, reportSecurityEvent]);

    if (!attempt) {
        return (
            <StudentShell title={quizPage.exam.title} subtitle="ملخّص الاختبار، نتائجك الأخيرة، وحالة المحاولات الخاصة بك.">
                <div className="space-y-6">
                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">عدد الأسئلة: {quizPage.exam.question_count}</div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">الدرجة الكلية: {quizPage.exam.total_marks}</div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">نسبة النجاح: {quizPage.exam.pass_percentage}%</div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-bold text-slate-700">المتبقي من المحاولات: {quizPage.exam.attempts_remaining}</div>
                        </div>
                    </section>

                    {quizPage.latest_result ? (
                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">آخر نتيجة</h2>
                                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">المحاولة رقم: {quizPage.latest_result.attempt_number}</div>
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">الحالة: {quizPage.latest_result.status_label}</div>
                                        <div className="rounded-2xl bg-slate-50 px-4 py-3">النتيجة: {quizPage.latest_result.score ?? 0}</div>
                                        <div className={`rounded-2xl px-4 py-3 ${quizPage.latest_result.is_passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {quizPage.latest_result.is_passed ? 'ناجح' : 'غير ناجح'}
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm leading-7 text-slate-600">تاريخ الإنهاء: {quizPage.latest_result.finished_at_label || 'غير محدد'}</div>
                                    {quizPage.latest_result.termination_reason_label && (
                                        <div className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                                            سبب الإنهاء: {quizPage.latest_result.termination_reason_label}
                                        </div>
                                    )}
                                </div>

                                {quizPage.certificate && (
                                    <a href={quizPage.certificate.download_url} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700">
                                        <Trophy size={18} />
                                        تنزيل الشهادة
                                    </a>
                                )}
                            </div>
                        </section>
                    ) : quizPage.exam.is_available ? (
                        <StudentEmptyState title="لا توجد محاولة نشطة" description="إذا كانت لديك محاولات متبقية فقم بتحديث الصفحة لبدء محاولة جديدة. وإذا انتهت محاولاتك فسيظهر سجل النتائج فقط." />
                    ) : (
                        <StudentEmptyState title="الاختبار غير متاح الآن" description="إما أن الاختبار لم يُنشر بعد أو لا يحتوي أسئلة منشورة حاليًا." />
                    )}

                    {quizPage.history.length > 0 && (
                        <section className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">سجل المحاولات</h2>
                            <div className="mt-4 space-y-3">
                                {quizPage.history.map((item) => (
                                    <article key={item.id} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="text-sm font-black text-slate-900">المحاولة رقم {item.attempt_number}</div>
                                                <div className="mt-1 text-xs font-semibold text-slate-500">{item.finished_at_label || item.status_label}</div>
                                                {item.termination_reason_label && (
                                                    <div className="mt-2 text-xs font-bold text-amber-700">{item.termination_reason_label}</div>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{item.status_label}</div>
                                                <div className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {item.score ?? 0} درجة
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </StudentShell>
        );
    }

    return (
        <StudentShell title={quizPage.exam.title} subtitle="وضع الاختبار الآمن مفعّل. تجنب مغادرة الصفحة أو استخدام اختصارات النسخ وأدوات المطور.">
            <Head title={quizPage.exam.title} />
            <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <aside className="space-y-6">
                    <section className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-bold text-slate-500">المؤقت</div>
                                <div className={`mt-2 text-4xl font-black ${timeRemaining !== null && timeRemaining <= 60 ? 'text-rose-600' : 'text-slate-900'}`}>
                                    {formatTime(timeRemaining)}
                                </div>
                            </div>
                            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                                <Clock3 size={20} />
                            </div>
                        </div>

                        <div className="mt-5 grid gap-3 text-sm font-bold text-slate-600">
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">المحاولة رقم: {attempt.attempt_number}</div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">عدد المجاوبات: {answeredCount} / {attempt.questions.length}</div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-3">مغادرة الصفحة: {tabSwitches} / {quizPage.exam.allowed_tab_switches}</div>
                        </div>

                        <button
                            type="button"
                            onClick={() => submitAttempt(false)}
                            disabled={submitting}
                            className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {submitting ? 'جارٍ الإرسال...' : 'إنهاء الاختبار'}
                        </button>

                        {message && <div className="mt-4 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</div>}
                    </section>

                    <section className="rounded-[30px] border border-white/70 bg-rose-50/80 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-rose-100 p-3 text-rose-700">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">تنبيه أمني</h2>
                                <p className="text-sm leading-7 text-slate-600">يتم منع النسخ واللصق والزر الأيمن، ومراقبة مغادرة التبويب واختصارات أدوات المطور.</p>
                            </div>
                        </div>
                        <div className="mt-4 rounded-[22px] bg-white/80 px-4 py-4 text-sm leading-7 text-slate-700">
                            عند تجاوز عدد مرات مغادرة الصفحة المسموح به سيتم إنهاء الاختبار تلقائيًا وإرسال إجاباتك الحالية.
                        </div>
                    </section>
                </aside>

                <section className="space-y-4">
                    {attempt.questions.map((question, index) => (
                        <article key={question.id} className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-xs font-semibold tracking-[0.3em] text-orange-500">QUESTION {index + 1}</div>
                                    <h2 className="mt-3 text-lg font-black leading-8 text-slate-900">{question.question_text}</h2>
                                </div>
                                <div className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">{question.mark} درجات</div>
                            </div>

                            <div className="mt-5 grid gap-3">
                                {question.options.map((option) => {
                                    const selected = answers[question.id] === option.key;

                                    return (
                                        <button
                                            key={option.key}
                                            type="button"
                                            onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.key }))}
                                            className={`rounded-[24px] border px-4 py-4 text-right text-sm font-bold transition ${
                                                selected
                                                    ? 'border-orange-300 bg-orange-50 text-orange-800'
                                                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-200 hover:bg-orange-50/50'
                                            }`}
                                        >
                                            <span className="inline-flex items-center gap-3">
                                                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${selected ? 'bg-orange-600 text-white' : 'bg-white text-slate-500'}`}>{option.key}</span>
                                                <span>{option.text}</span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </article>
                    ))}

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => submitAttempt(false)}
                            disabled={submitting}
                            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            إرسال الإجابات الآن
                        </button>
                    </div>
                </section>
            </div>
        </StudentShell>
    );
}