import { usePage } from '@inertiajs/react';
import { Download, ShieldCheck } from 'lucide-react';
import { StudentEmptyState } from '@/components/student/student-empty-state';
import { StudentShell } from '@/components/student/student-shell';

type CertificateItem = {
    id: number;
    course_name: string | null;
    exam_title: string | null;
    issued_at_label: string | null;
    certificate_code: string;
    verification_code: string;
    image_url: string | null;
    download_url: string;
};

export default function Certificates() {
    const { certificates = [] } = usePage<{ certificates?: CertificateItem[] }>().props;

    return (
        <StudentShell title="الشهادات" subtitle="اعرض شهاداتك المكتسبة ونزّل نسخة محفوظة من كل شهادة صادرة من المنصة.">
            {certificates.length > 0 ? (
                <div className="grid gap-5 xl:grid-cols-2">
                    {certificates.map((certificate) => (
                        <article key={certificate.id} className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            {certificate.image_url ? (
                                <img src={certificate.image_url} alt={certificate.course_name || 'certificate'} className="h-72 w-full object-cover" />
                            ) : (
                                <div className="flex h-72 items-center justify-center bg-[linear-gradient(135deg,#fed7aa_0%,#fef3c7_45%,#bae6fd_100%)] text-2xl font-black text-slate-700">
                                    شهادة
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900">{certificate.course_name || certificate.exam_title || 'شهادة مكتسبة'}</h2>
                                        <p className="mt-2 text-sm text-slate-600">تاريخ الإصدار: {certificate.issued_at_label || 'غير محدد'}</p>
                                    </div>
                                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                                        <ShieldCheck size={18} />
                                    </div>
                                </div>

                                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">رمز الشهادة: {certificate.certificate_code}</div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">رمز التحقق: {certificate.verification_code}</div>
                                </div>

                                <a href={certificate.download_url} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
                                    <Download size={18} />
                                    تنزيل الشهادة
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <StudentEmptyState title="لا توجد شهادات بعد" description="عند اجتيازك الاختبارات المؤهلة ستظهر شهاداتك هنا مع إمكانية التنزيل المباشر." />
            )}
        </StudentShell>
    );
}
