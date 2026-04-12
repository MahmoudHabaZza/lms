import InputError from '@/components/input-error';
import MainLayout from '@/pages/EndUser/layouts/master';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, UserRound } from 'lucide-react';
import React from 'react';

type Props = {
    status?: string;
};

export default function StudentLogin({ status }: Props) {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/student/login');
    };

    return (
        <>
            <Head title="تسجيل دخول الطالب" />

            <MainLayout>
                <div
                    dir="rtl"
                    className="min-h-[calc(100vh-160px)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--site-primary-color)_92%,transparent),color-mix(in_srgb,var(--site-primary-400)_88%,transparent)),url('/assets/EndUser/images/hero-bg.jpg')] bg-cover bg-center py-24"
                >
                    <div className="mx-auto max-w-3xl px-4 pt-14">
                        <section className="rounded-[32px] border border-orange-100 bg-white p-8 shadow-2xl sm:p-10">
                                <div className="text-right">
                                    <p className="text-xs font-bold tracking-[0.35em] text-orange-500">تسجيل الدخول</p>
                                    <h2 className="mt-3 text-3xl font-black text-slate-900">مرحبًا بعودتك</h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-500">
                                        أدخل بيانات الحساب التي أرسلتها لك الإدارة عبر البريد الإلكتروني.
                                    </p>
                                </div>

                                {(status || errors.login) && (
                                    <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                                        {status || errors.login}
                                    </div>
                                )}

                                <form onSubmit={submit} className="mt-8 space-y-5">
                                    <div>
                                        <label htmlFor="login" className="mb-2 flex items-center justify-end gap-2 text-sm font-bold text-slate-700">
                                            <span>اسم المستخدم أو البريد الإلكتروني</span>
                                            <UserRound className="h-4 w-4 text-orange-500" />
                                        </label>
                                        <input
                                            id="login"
                                            type="text"
                                            value={data.login}
                                            onChange={(event) => setData('login', event.target.value)}
                                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                            placeholder="student@example.com"
                                            autoComplete="username"
                                        />
                                        <InputError message={errors.login} className="mt-2" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="mb-2 flex items-center justify-end gap-2 text-sm font-bold text-slate-700">
                                            <span>كلمة المرور</span>
                                            <Lock className="h-4 w-4 text-orange-500" />
                                        </label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setPasswordVisible((value) => !value)}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                                aria-label={passwordVisible ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                                            >
                                                {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                            <input
                                                id="password"
                                                type={passwordVisible ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(event) => setData('password', event.target.value)}
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-14 text-right outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    <label className="flex items-center justify-end gap-3 text-sm font-medium text-slate-600">
                                        <span>تذكرني في هذا الجهاز</span>
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(event) => setData('remember', event.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500 disabled:opacity-60"
                                    >
                                        {processing ? 'جارٍ التحقق...' : 'دخول إلى حساب الطالب'}
                                    </button>
                                </form>
                        </section>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}

