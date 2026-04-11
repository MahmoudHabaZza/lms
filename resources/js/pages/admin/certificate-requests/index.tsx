import { confirmDelete } from '@/lib/confirm';
import { Link, router } from '@inertiajs/react';
import { FileBadge2, Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../layouts/admin-layout';


type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type CertificateRequestRow = {
    id: number;
    student_id: number | null;
    instructor_id: number | null;
    student?: { id: number; name: string } | null;
    instructor?: { id: number; name: string } | null;
    course_title: string;
    status: string;
};

type PaginatedRequests = {
    data: CertificateRequestRow[];
    links: PaginationLink[];
};

const normalizePaginationLabel = (label: string) =>
    label
        .replace('&laquo; Previous', 'السابق')
        .replace('Next &raquo;', 'التالي')
        .replace('&raquo;', '')
        .replace('&laquo;', '');

const statusMap: Record<string, { label: string; className: string }> = {
    pending: { label: 'قيد المراجعة', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'مقبول', className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'مرفوض', className: 'bg-rose-100 text-rose-700' },
};

export default function CertificateRequestsIndex({ requests }: { requests: PaginatedRequests }) {
    const onDelete = async (id: number) => {
        if (!(await confirmDelete())) return;
        router.delete(`/admin/certificate-requests/${id}`);
    };

    return (
        <AdminLayout title="طلبات الشهادات">
            <div className="space-y-6">
                <section className="rounded-[28px] border border-orange-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_52%,#fff1e6_100%)] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-right">
                            <div className="text-xs font-bold tracking-[0.3em] text-orange-500">اعتماد الإنجاز</div>
                            <h1 className="mt-2 text-2xl font-black text-slate-900">إدارة طلبات الشهادات</h1>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                تابع الطلبات المقدمة من الطلاب وحدد حالة كل طلب وربطه بالمدرب المسؤول.
                            </p>
                        </div>
                        <Link
                            href="/admin/certificate-requests/create"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-500"
                        >
                            <FileBadge2 size={18} />
                            إضافة طلب
                        </Link>
                    </div>
                </section>

                <div className="space-y-4">
                    {requests.data.map((request) => {
                        const status = statusMap[request.status] ?? {
                            label: request.status,
                            className: 'bg-slate-100 text-slate-700',
                        };

                        return (
                            <div key={request.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-900">
                                            طلب #{request.id} - {request.course_title}
                                        </div>
                                        <div className="mt-2 text-sm text-slate-500">
                                            الطالب: {request.student?.name ?? `#${request.student_id ?? '-'}`}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500">
                                            المدرب: {request.instructor?.name ?? `#${request.instructor_id ?? '-'}`}
                                        </div>
                                        <div className="mt-3 flex flex-wrap justify-end gap-2 text-xs font-semibold">
                                            <span className={`rounded-full px-3 py-1 ${status.className}`}>{status.label}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/admin/certificate-requests/${request.id}/edit`}
                                            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            <Pencil size={16} />
                                            تعديل
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(request.id)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                        >
                                            <Trash2 size={16} />
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {requests.data.length === 0 && (
                        <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">
                            لا توجد طلبات شهادات مضافة حاليًا.
                        </div>
                    )}
                </div>

                {requests.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {requests.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={`${link.label}-${index}`}
                                    href={link.url}
                                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                        link.active
                                            ? 'border-orange-500 bg-orange-500 text-white'
                                            : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50'
                                    }`}
                                >
                                    {normalizePaginationLabel(link.label)}
                                </Link>
                            ) : (
                                <span
                                    key={`${link.label}-${index}`}
                                    className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-400"
                                >
                                    {normalizePaginationLabel(link.label)}
                                </span>
                            ),
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}


