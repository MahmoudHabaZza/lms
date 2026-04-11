import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

export default function AdminLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/login', {
            onFinish: () => setData('password', ''),
        });
    };

    return (
        <>
            <Head title="دخول الإدارة" />

            <div
                dir="rtl"
                lang="ar"
                className="admin-login-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10"
            >
                <div className="admin-login-orb admin-login-orb-1" />
                <div className="admin-login-orb admin-login-orb-2" />

                <div className="admin-login-card w-full max-w-md rounded-3xl border border-white/20 bg-white/85 p-7 shadow-2xl backdrop-blur-md sm:p-9">
                    <div className="mb-7 text-center">
                        <h1 className="text-3xl font-bold text-slate-900">لوحة الإدارة</h1>
                        <p className="mt-2 text-sm text-slate-600">سجّل الدخول لإدارة محتوى الأكاديمية والإعدادات</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-right text-sm font-medium text-slate-700">
                                البريد الإلكتروني
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                dir="ltr"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                placeholder="admin@example.com"
                                required
                                autoFocus
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-right text-sm font-medium text-slate-700">
                                كلمة المرور
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                dir="ltr"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                                placeholder="••••••••"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="size-4"
                            />
                            تذكرني
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="admin-login-btn w-full rounded-xl px-5 py-3.5 text-base font-semibold text-white transition disabled:opacity-60"
                        >
                            {processing ? 'جارٍ تسجيل الدخول...' : 'دخول لوحة الإدارة'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
