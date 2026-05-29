import { useForm, usePage } from '@inertiajs/react';
import { CodeXml, Eye, EyeOff, Globe, Save } from 'lucide-react';
import { type FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import InputError from '@/components/input-error';

type Integrations = {
    gtm_container_id: string | null;
};

type PageProps = {
    integrations: Integrations;
    flash?: { success?: string; error?: string; warning?: string };
};

export default function IntegrationsIndex() {
    const { integrations, flash } = usePage<PageProps>().props;

    const { data, setData, errors, processing, post, recentlySuccessful } =
        useForm<Integrations>({
            gtm_container_id: integrations.gtm_container_id || '',
        });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/integrations');
    }

    const hasGtmId = data.gtm_container_id?.startsWith('GTM-');

    return (
        <AdminLayout title="التكاملات">
            <div className="mx-auto max-w-5xl space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        التكاملات
                    </h2>
                    <p className="mt-1 text-slate-500">
                        قم بربط تطبيقك بخدمات الطرف الثالث بسهولة
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-orange-50/60 to-white px-7 py-5">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                                <CodeXml size={26} />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    Google Tag Manager
                                </h3>
                                <p className="text-sm text-slate-500">
                                    قم بإدارة أكواد التتبع والتحليلات بسهولة عبر GTM
                                </p>
                            </div>
                            {hasGtmId && (
                                <span className="mr-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">
                                    <Globe size={14} />
                                    مفعل
                                </span>
                            )}
                        </div>

                        <div className="px-7 py-6">
                            <div className="lg:grid-cols-[1.08fr_0.92fr] lg:grid">
                                <div className="space-y-5">
                                    <div>
                                        <label
                                            htmlFor="gtm_id"
                                            className="mb-1.5 block text-sm font-semibold text-slate-700"
                                        >
                                            GTM Container ID
                                        </label>
                                        <input
                                            id="gtm_id"
                                            type="text"
                                            dir="ltr"
                                            placeholder="GTM-XXXXXXX"
                                            value={data.gtm_container_id}
                                            onChange={(e) =>
                                                setData(
                                                    'gtm_container_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition focus:border-orange-400 focus:outline-none"
                                        />
                                        <InputError
                                            message={errors.gtm_container_id}
                                        />
                                        <p className="mt-2 text-xs text-slate-400">
                                            مثال: GTM-ABC1234
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 px-5 py-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                                             كيف تجد المعرف
                                        </span>
                                        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-amber-800">
                                            <li>توجه إلى{' '}
                                                <a
                                                    href="https://tagmanager.google.com"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-semibold underline underline-offset-2"
                                                >
                                                    Google Tag Manager
                                                </a>
                                            </li>
                                            <li>اختر الحاوية الخاصة بك</li>
                                            <li>انسخ المعرف من لوحة التحكم (GTM-XXXXXXX)</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-5 lg:mr-10 lg:mt-0">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 px-5 py-5">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            المعاينة
                                        </span>

                                        {hasGtmId ? (
                                            <div className="mt-3 space-y-2">
                                                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 font-mono text-xs text-emerald-700">
                                                    &lt;script&gt;
                                                    <br />
                                                    &nbsp;&nbsp;...
                                                    <wbr />
                                                    googletagmanager.com/gtm.js?id=
                                                    <span className="font-bold text-emerald-900">
                                                        {data.gtm_container_id}
                                                    </span>
                                                    <br />
                                                    &lt;/script&gt;
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-emerald-600">
                                                    <Eye size={14} />
                                                    سيتم تحميل GTM تلقائياً في
                                                    جميع صفحات الموقع
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                                                <EyeOff size={18} />
                                                لم يتم إضافة كود التتبع بعد
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-10px_var(--site-primary-color)] transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {processing ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
                                    </button>

                                    {recentlySuccessful && (
                                        <p className="text-center text-sm text-emerald-600">
                                            تم الحفظ بنجاح ✓
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm">
                        <h4 className="text-sm font-bold text-slate-700">
                            التكاملات القادمة
                        </h4>
                        <p className="mt-1 text-xs text-slate-400">
                            سنضيف المزيد من خدمات التكامل قريباً
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            {[
                                { name: 'Google Analytics 4', icon: '📊' },
                                { name: 'Meta Pixel', icon: '👁' },
                                { name: 'TikTok Pixel', icon: '🎵' },
                                { name: 'Hotjar', icon: '🔥' },
                            ].map((item) => (
                                <span
                                    key={item.name}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400"
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
