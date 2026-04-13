import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import MainLayout from './layouts/master';

export default function BookingSuccess() {
    const { settings } = usePage<{ settings?: Record<string, string | null | undefined> }>().props;
    const successTitle = settings?.booking_success_title?.trim() || 'تم إرسال طلب الحجز بنجاح';
    const successDescription = settings?.booking_success_description?.trim() || 'شكرًا لك! تم استلام طلبك وسيقوم فريقنا بالتواصل معك قريبًا لتأكيد البيانات.';
    const homeButtonLabel = settings?.booking_success_home_button?.trim() || 'العودة للرئيسية';
    return (
        <MainLayout>
            <Head title={successTitle} />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50 text-right">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--site-primary-color)_20%,transparent),_rgba(255,255,255,0.3)_45%,_rgba(255,255,255,0.7)_100%)]"></div>
                <section className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                    <div className="mx-auto max-w-3xl">
                        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            </div>

                            <h1 className="mt-6 font-playpen-arabic text-3xl font-extrabold text-slate-800 sm:text-4xl">
                                {successTitle}
                            </h1>
                            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
                                {successDescription}
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link href="/" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 sm:w-auto">
                                    <ArrowLeft className="h-4 w-4" />
                                    {homeButtonLabel}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}

