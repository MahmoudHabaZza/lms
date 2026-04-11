import InputError from '@/components/input-error';
import { generateStudentPassword } from '@/lib/password';
import { Copy, RefreshCw } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

export type StudentFormData = {
    name: string;
    email: string;
    username: string;
    phone_number: string;
    is_active: boolean;
    password_mode: 'manual' | 'auto';
    password_action: 'keep' | 'manual' | 'auto';
    password: string;
    course_ids: number[];
};

type CourseOption = {
    id: number;
    title: string;
};

type StudentFormProps = {
    data: StudentFormData;
    setData: {
        (key: 'name', value: string): void;
        (key: 'email', value: string): void;
        (key: 'username', value: string): void;
        (key: 'phone_number', value: string): void;
        (key: 'is_active', value: boolean): void;
        (key: 'password_mode', value: 'manual' | 'auto'): void;
        (key: 'password_action', value: 'keep' | 'manual' | 'auto'): void;
        (key: 'password', value: string): void;
        (key: 'course_ids', value: number[]): void;
    };
    errors: Partial<Record<keyof StudentFormData, string>>;
    courses: CourseOption[];
    processing: boolean;
    submitLabel: string;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    mode: 'create' | 'edit';
};

export default function StudentForm({
    data,
    setData,
    errors,
    courses,
    processing,
    submitLabel,
    onSubmit,
    mode,
}: StudentFormProps) {
    const usesManualPassword = mode === 'create' ? data.password_mode === 'manual' : data.password_action === 'manual';
    const showPasswordSection = mode === 'create' || data.password_action !== 'keep';
    const usesAutoPassword = showPasswordSection && !usesManualPassword;
    const [copyFeedback, setCopyFeedback] = useState('');

    useEffect(() => {
        if (!usesAutoPassword || data.password.trim() !== '') {
            return;
        }

        setData('password', generateStudentPassword());
    }, [data.password, setData, usesAutoPassword]);

    const toggleCourse = (id: number) => {
        const next = data.course_ids.includes(id)
            ? data.course_ids.filter((courseId) => courseId !== id)
            : [...data.course_ids, id];

        setData('course_ids', next);
    };

    const regeneratePassword = () => {
        setData('password', generateStudentPassword());
        setCopyFeedback('');
    };

    const copyPassword = async () => {
        if (!data.password) {
            return;
        }

        try {
            await navigator.clipboard.writeText(data.password);
            setCopyFeedback('تم نسخ كلمة المرور.');
            window.setTimeout(() => setCopyFeedback(''), 2000);
        } catch {
            setCopyFeedback('تعذر نسخ كلمة المرور.');
            window.setTimeout(() => setCopyFeedback(''), 2000);
        }
    };

    const setCreatePasswordMode = (value: 'manual' | 'auto') => {
        setData('password_mode', value);
        setCopyFeedback('');

        if (value === 'auto') {
            setData('password', generateStudentPassword());
            return;
        }

        setData('password', '');
    };

    const setEditPasswordAction = (value: 'keep' | 'manual' | 'auto') => {
        setData('password_action', value);
        setCopyFeedback('');

        if (value === 'auto') {
            setData('password', generateStudentPassword());
            return;
        }

        setData('password', '');
    };

    return (
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">بيانات الطالب</div>
                        <h2 className="mt-2 text-xl font-black text-slate-900">الملف الأساسي</h2>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">الاسم الكامل</label>
                            <input value={data.name} onChange={(event) => setData('name', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">البريد الإلكتروني</label>
                            <input type="email" value={data.email} onChange={(event) => setData('email', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">اسم المستخدم</label>
                            <input value={data.username} onChange={(event) => setData('username', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div>
                            <label className="mb-2 block text-right text-sm font-semibold text-slate-700">رقم الهاتف</label>
                            <input value={data.phone_number} onChange={(event) => setData('phone_number', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>

                        <label className="flex items-center justify-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 sm:self-end">
                            <span>الحساب مفعل</span>
                            <input type="checkbox" checked={data.is_active} onChange={(event) => setData('is_active', event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                        </label>
                    </div>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">إسناد الكورسات</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">الكورسات المخصصة</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-500">هذه هي الكورسات التي يستطيع الطالب الوصول إليها من حسابه.</p>
                    </div>

                    <div className="mt-5 grid gap-3">
                        {courses.map((course) => (
                            <label key={course.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
                                <span>{course.title}</span>
                                <input type="checkbox" checked={data.course_ids.includes(course.id)} onChange={() => toggleCourse(course.id)} className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
                            </label>
                        ))}
                    </div>
                    <InputError message={errors.course_ids} className="mt-2" />
                </section>
            </div>

            <div className="space-y-6">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-right">
                        <div className="text-xs font-bold tracking-[0.3em] text-orange-500">بيانات الدخول</div>
                        <h3 className="mt-2 text-lg font-bold text-slate-900">{mode === 'create' ? 'اختيار كلمة المرور' : 'إدارة كلمة المرور'}</h3>
                    </div>

                    <div className="mt-5 space-y-5">
                        {mode === 'create' ? (
                            <div className="grid gap-3">
                                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">توليد كلمة مرور تلقائيًا</span>
                                    <input type="radio" checked={data.password_mode === 'auto'} onChange={() => setCreatePasswordMode('auto')} />
                                </label>
                                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">إدخال كلمة مرور يدويًا</span>
                                    <input type="radio" checked={data.password_mode === 'manual'} onChange={() => setCreatePasswordMode('manual')} />
                                </label>
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">الإبقاء على كلمة المرور الحالية</span>
                                    <input type="radio" checked={data.password_action === 'keep'} onChange={() => setEditPasswordAction('keep')} />
                                </label>
                                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">توليد كلمة مرور جديدة تلقائيًا</span>
                                    <input type="radio" checked={data.password_action === 'auto'} onChange={() => setEditPasswordAction('auto')} />
                                </label>
                                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                                    <span className="text-sm font-medium text-slate-700">إدخال كلمة مرور جديدة يدويًا</span>
                                    <input type="radio" checked={data.password_action === 'manual'} onChange={() => setEditPasswordAction('manual')} />
                                </label>
                            </div>
                        )}

                        {showPasswordSection && usesManualPassword && (
                            <div>
                                <label className="mb-2 block text-right text-sm font-semibold text-slate-700">كلمة المرور</label>
                                <input type="text" value={data.password} onChange={(event) => setData('password', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100" />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                        )}

                        {usesAutoPassword && (
                            <div className="space-y-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4 text-right">
                                <div className="text-sm font-semibold text-slate-800">كلمة المرور المولدة تلقائيًا</div>
                                <input type="text" readOnly value={data.password} className="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-left font-mono text-sm outline-none" />
                                <div className="flex flex-wrap items-center justify-end gap-3">
                                    <button type="button" onClick={regeneratePassword} className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-300 hover:bg-orange-100">
                                        <RefreshCw size={16} />
                                        توليد كلمة جديدة
                                    </button>
                                    <button type="button" onClick={copyPassword} className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-500">
                                        <Copy size={16} />
                                        نسخ كلمة المرور
                                    </button>
                                </div>
                                <div className="text-sm leading-7 text-slate-600">سيتم حفظ هذه الكلمة كما هي. احتفظ بها إذا كنت تريد مشاركتها مع الطالب يدويًا.</div>
                                {copyFeedback ? <div className="text-sm font-semibold text-emerald-700">{copyFeedback}</div> : null}
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="rounded-[24px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_60%,#fff1e6_100%)] p-5 text-right">
                        <div className="text-sm font-bold text-slate-900">ماذا يجب الانتباه له؟</div>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li>لن يتم إرسال كلمة المرور إلى الطالب تلقائيًا.</li>
                            <li>إذا استخدمت توليدًا تلقائيًا، انسخ الكلمة قبل المتابعة.</li>
                            <li>يمكنك دائمًا تغيير كلمة المرور لاحقًا من صفحة التعديل.</li>
                        </ul>
                    </div>

                    <button type="submit" disabled={processing} className="mt-5 w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50">
                        {submitLabel}
                    </button>
                </section>
            </div>
        </form>
    );
}
