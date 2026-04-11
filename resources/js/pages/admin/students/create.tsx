import { Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AdminLayout from '../layouts/admin-layout';
import StudentForm, { type StudentFormData } from './student-form';

type CourseOption = {
    id: number;
    title: string;
};

export default function StudentCreate({ courses }: { courses: CourseOption[] }) {
    const { data, setData, post, processing, errors } = useForm<StudentFormData>({
        name: '',
        email: '',
        username: '',
        phone_number: '',
        is_active: true,
        password_mode: 'auto',
        password_action: 'keep',
        password: '',
        course_ids: [],
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/admin/students');
    };

    return (
        <AdminLayout title="إضافة طالب">
            <div className="mx-auto w-full max-w-6xl space-y-5">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/admin/students" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-orange-300 hover:bg-orange-50">
                        رجوع للقائمة
                    </Link>
                    <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">إضافة طالب جديد</h1>
                        <p className="mt-2 text-sm text-slate-500">أنشئ الحساب، اسند الكورسات المناسبة، واحتفظ بكلمة المرور لتسليمها للطالب بالطريقة المناسبة لك.</p>
                    </div>
                </div>

                <StudentForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    courses={courses}
                    processing={processing}
                    submitLabel="إنشاء حساب الطالب"
                    onSubmit={onSubmit}
                    mode="create"
                />
            </div>
        </AdminLayout>
    );
}
