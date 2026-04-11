import { confirmDelete } from '@/lib/confirm';
import { Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import StudentForm, { type StudentFormData } from './student-form';

type CourseOption = {
    id: number;
    title: string;
};

type StudentDetails = {
    id: number;
    name: string;
    email: string;
    username: string | null;
    phone_number: string | null;
    is_active: boolean;
    course_ids: number[] | null;
};

export default function StudentEdit({ student, courses }: { student: StudentDetails; courses: CourseOption[] }) {
    const { data, setData, put, processing, errors } = useForm<StudentFormData>({
        name: student.name,
        email: student.email,
        username: student.username ?? '',
        phone_number: student.phone_number ?? '',
        is_active: student.is_active,
        password_mode: 'auto',
        password_action: 'keep',
        password: '',
        course_ids: student.course_ids ?? [],
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/admin/students/${student.id}`);
    };

    const handleDelete = async () => {
        const confirmed = await confirmDelete({
            title: 'حذف الطالب',
            text: `سيتم حذف حساب ${student.name} وكل البيانات المرتبطة به نهائيًا. لا يمكن التراجع عن هذا الإجراء.`,
            confirmButtonText: 'نعم، احذف الطالب',
        });

        if (!confirmed) {
            return;
        }

        router.delete(`/admin/students/${student.id}`);
    };

    return (
        <AdminLayout title="تعديل الطالب">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
                        >
                            حذف الطالب
                        </button>
                        <Link
                            href="/admin/students"
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                        >
                            رجوع للقائمة
                        </Link>
                    </div>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">تعديل بيانات الطالب</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            يمكنك تحديث الحالة، إعادة ضبط كلمة المرور، أو تعديل الكورسات المخصصة.
                        </p>
                    </div>
                </div>

                <StudentForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    courses={courses}
                    processing={processing}
                    submitLabel="حفظ التعديلات"
                    onSubmit={onSubmit}
                    mode="edit"
                />
            </div>
        </AdminLayout>
    );
}
