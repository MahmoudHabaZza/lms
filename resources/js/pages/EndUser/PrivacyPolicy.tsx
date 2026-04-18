import { Head, usePage } from '@inertiajs/react';
import { FileText, Lock, ShieldCheck, UserCheck } from 'lucide-react';
import { useMemo } from 'react';
import MainLayout from './layouts/master';

const sanitizeRichText = (value: string) =>
    value
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
        .replace(/\son\w+=(?:"[^"]*"|'[^']*')/gi, '')
        .replace(/javascript:/gi, '');

const looksCorruptedText = (value: string) => /[ÃØÙÂ]{2,}/.test(value);

const fallbackSections = [
    {
        icon: FileText,
        iconClassName: 'bg-orange-100 text-orange-600',
        title: 'المعلومات التي نجمعها',
        body: 'قد نجمع البيانات التي تقدمها لنا عند التسجيل أو التواصل معنا أو إرسال طلب حجز، مثل الاسم والبريد الإلكتروني ورقم الهاتف وبعض البيانات التعليمية اللازمة لتقديم الخدمة بشكل صحيح.',
    },
    {
        icon: UserCheck,
        iconClassName: 'bg-sky-100 text-sky-600',
        title: 'كيفية استخدام البيانات',
        body: 'نستخدم هذه المعلومات لإدارة الحسابات، متابعة طلبات الحجز، تحسين تجربة التعلم، إرسال الإشعارات المهمة، والرد على الاستفسارات أو طلبات الدعم الفني عند الحاجة.',
    },
    {
        icon: Lock,
        iconClassName: 'bg-emerald-100 text-emerald-600',
        title: 'حماية المعلومات',
        body: 'نعتمد إجراءات تنظيمية وتقنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح غير المسموح، مع تقييد الوصول للبيانات على من يحتاجها فقط لتشغيل المنصة.',
    },
    {
        icon: ShieldCheck,
        iconClassName: 'bg-violet-100 text-violet-600',
        title: 'حقوقك وتحديثات السياسة',
        body: 'يمكنك طلب تحديث بياناتك أو تصحيحها أو التواصل معنا بشأن أي استفسار متعلق بالخصوصية. وقد نقوم بتحديث هذه السياسة عند الحاجة، ويتم نشر النسخة الأحدث دائمًا على هذه الصفحة.',
    },
] as const;

export default function PrivacyPolicy() {
    const { settings } = usePage<any>().props;

    const settingsTitle = settings?.privacy_policy_title?.trim() || '';
    const settingsContent = settings?.privacy_policy_content?.trim() || '';
    const pageTitle = settingsTitle && !looksCorruptedText(settingsTitle) ? settingsTitle : 'سياسة الخصوصية';
    const pageContent = settingsContent && !looksCorruptedText(settingsContent) ? settingsContent : '';
    const sanitizedPageContent = useMemo(() => sanitizeRichText(pageContent), [pageContent]);
    const hasCustomContent = sanitizedPageContent.trim().length > 0;

    return (
        <MainLayout>
            <Head title={pageTitle} />

            <div dir="rtl" lang="ar" className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-amber-50/30 text-right">
                <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
                <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-100/30 blur-3xl" />

                <section className="relative pb-12 pt-28 sm:pt-32">
                    <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-5 py-2 text-sm font-bold text-orange-700">
                            <ShieldCheck size={16} />
                            نحن نهتم بخصوصيتك
                        </div>
                        <h1 className="mt-5 font-playpen-arabic text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            {pageTitle}
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                            تعرف من هنا كيف نتعامل مع بياناتك الشخصية داخل المنصة، وما الذي نجمعه، ولماذا نستخدمه، وكيف نحافظ عليه.
                        </p>
                    </div>
                </section>

                <section className="relative pb-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div className="rounded-[32px] border border-white/70 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur sm:p-12">
                                {hasCustomContent ? (
                                    <div
                                        className="prose prose-lg max-w-none text-slate-600 prose-headings:mb-4 prose-headings:text-slate-900 prose-p:leading-8 prose-li:leading-8 prose-a:text-orange-600"
                                        dangerouslySetInnerHTML={{ __html: sanitizedPageContent }}
                                    />
                                ) : (
                                    <div className="space-y-6">
                                        <div className="rounded-3xl border border-orange-100 bg-orange-50/70 p-6">
                                            <h2 className="text-2xl font-extrabold text-slate-900">ملخص سريع</h2>
                                            <p className="mt-3 text-base leading-8 text-slate-600">
                                                نلتزم بالتعامل مع بيانات المستخدمين بشكل مسؤول وآمن، ونستخدمها فقط في الحدود المرتبطة بتقديم خدمات المنصة التعليمية وتحسينها.
                                            </p>
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            {fallbackSections.map((section, index) => {
                                                const Icon = section.icon;

                                                return (
                                                    <article
                                                        key={section.title}
                                                        className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${section.iconClassName}`}>
                                                                <Icon size={26} />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-orange-600">0{index + 1}</div>
                                                                <h3 className="mt-1 text-xl font-extrabold text-slate-900">{section.title}</h3>
                                                                <p className="mt-3 text-base leading-8 text-slate-600">{section.body}</p>
                                                            </div>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>

                                        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm leading-7 text-slate-500">
                                            إذا كان لديك أي استفسار بخصوص الخصوصية أو استخدام البيانات، يمكنك التواصل معنا عبر صفحة{' '}
                                            <a href="/contact" className="font-bold text-orange-600 hover:text-orange-700">
                                                تواصل معنا
                                            </a>
                                            .
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
