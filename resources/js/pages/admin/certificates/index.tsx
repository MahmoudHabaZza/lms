import PaginationLinks from '@/components/pagination-links';
import { confirmDelete } from '@/lib/confirm';
import type { PaginatedData } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Award, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type Certificate = {
    id: number;
    student?: { id: number; name: string } | null;
    exam?: { id: number; title: string } | null;
    attempt?: { id: number } | null;
    certificate_code: string;
    verification_code: string | null;
    image: string | null;
    issued_at: string | null;
};

const formatDateTime = (value?: string | null) => (value ? value.replace('T', ' ') : 'غير محدد');

export default function CertificatesIndex({ certificates }: { certificates: PaginatedData<Certificate> }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/certificates/${id}`);
    };

    return (
        <AdminLayout title="الشهادات">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">الإنجاز والاعتماد</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة الشهادات</h1>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                أنشئ شهادات الطلاب واحتفظ برموز التحقق وبيانات الإصدار في سجل واحد منظم.
                            </p>
                        </div>
                        <Link
                            href="/admin/certificates/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <Award size={18} />
                            إضافة شهادة
                        </Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {certificates.data.map((certificate) => (
                        <div key={certificate.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="text-right">
                                    <div className="text-lg font-bold text-slate-900">
                                        {certificate.student?.name ?? 'طالب غير محدد'} - {certificate.exam?.title ?? 'اختبار غير محدد'}
                                    </div>
                                    <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                                            كود الشهادة: {certificate.certificate_code}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            كود التحقق: {certificate.verification_code ?? '-'}
                                        </span>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                            المحاولة #{certificate.attempt?.id ?? '-'}
                                        </span>
                                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                                            الإصدار: {formatDateTime(certificate.issued_at)}
                                        </span>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-500">
                                        {certificate.image ? (
                                            <a href={certificate.image} target="_blank" className="font-medium text-orange-600 hover:text-orange-500" rel="noreferrer">
                                                عرض صورة الشهادة
                                            </a>
                                        ) : (
                                            'لا يوجد رابط صورة للشهادة'
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={`/admin/certificates/${certificate.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <Pencil size={16} />
                                        تعديل
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(certificate.id)}
                                        className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={16} />
                                        حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {certificates.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            لا توجد شهادات مسجلة حاليًا.
                        </div>
                    )}
                </div>
            

                <PaginationLinks links={certificates.links} />
            </div>
        </AdminLayout>
    );
}




