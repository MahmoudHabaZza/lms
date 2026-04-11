import { Link, useForm, usePage } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Mail, Medal, Phone, Save, UserRound } from 'lucide-react';
import { StudentShell } from '@/components/student/student-shell';
import { StudentStatCard } from '@/components/student/student-stat-card';

type ProfileCourse = {
    id: number | null;
    title: string | null;
    short_description: string | null;
    thumbnail: string | null;
    badge: string | null;
    enrolled_at: string | null;
};

export default function Profile() {
    const { auth, flash, profileData } = usePage<{
        auth: { user?: any };
        flash?: { success?: string; error?: string };
        profileData?: {
            stats?: {
                certificates?: number;
                tasks?: number;
                lessons?: number;
                courses?: number;
            };
            courses?: ProfileCourse[];
        };
    }>().props;

    const user = auth?.user;
    const stats = profileData?.stats ?? {};
    const courses = profileData?.courses ?? [];

    const form = useForm({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        profile_picture: null as File | null,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    return (
        <StudentShell title="الملف الشخصي" subtitle="حدّث بياناتك الأساسية وتابع ملخّص نشاطك الحالي داخل المنصة.">
            <div className="space-y-6">
                {(flash?.success || flash?.error) && (
                    <div className={`rounded-[24px] border px-5 py-4 text-sm font-bold ${flash?.success ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                        {flash?.success || flash?.error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StudentStatCard title="الكورسات" value={stats.courses ?? 0} icon={BookOpen} accent="orange" />
                    <StudentStatCard title="الشهادات" value={stats.certificates ?? 0} icon={Medal} accent="rose" />
                    <StudentStatCard title="المهام المرسلة" value={stats.tasks ?? 0} icon={CheckCircle2} accent="emerald" />
                    <StudentStatCard title="الدروس المكتملة" value={stats.lessons ?? 0} icon={UserRound} accent="sky" />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <section className="space-y-6">
                        <article className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">بيانات الحساب</h2>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                form.post('/student/profile', { forceFormData: true });
                            }} className="mt-5 space-y-4">
                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><UserRound size={16} /> الاسم الكامل</span>
                                    <input value={form.data.name} onChange={(event) => form.setData('name', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                    {form.errors.name && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.name}</div>}
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><UserRound size={16} /> اسم المستخدم</span>
                                    <input value={form.data.username} onChange={(event) => form.setData('username', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                    {form.errors.username && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.username}</div>}
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><Mail size={16} /> البريد الإلكتروني</span>
                                    <input type="email" value={form.data.email} onChange={(event) => form.setData('email', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                    {form.errors.email && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.email}</div>}
                                </label>

                                <label className="block">
                                    <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"><Phone size={16} /> رقم الهاتف</span>
                                    <input value={form.data.phone_number} onChange={(event) => form.setData('phone_number', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                    {form.errors.phone_number && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.phone_number}</div>}
                                </label>

                                <label className="block">
                                    <span className="mb-2 text-sm font-bold text-slate-700">الصورة الشخصية</span>
                                    <input type="file" accept="image/*" onChange={(event) => form.setData('profile_picture', event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3 text-sm text-slate-700" />
                                    {form.errors.profile_picture && <div className="mt-2 text-xs font-bold text-red-600">{form.errors.profile_picture}</div>}
                                </label>

                                <button type="submit" disabled={form.processing} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60">
                                    <Save size={16} />
                                    حفظ التغييرات
                                </button>
                            </form>
                        </article>

                        <article className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">تغيير كلمة المرور</h2>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                passwordForm.post('/student/profile/password');
                            }} className="mt-5 space-y-4">
                                <input type="password" value={passwordForm.data.current_password} onChange={(event) => passwordForm.setData('current_password', event.target.value)} placeholder="كلمة المرور الحالية" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                <input type="password" value={passwordForm.data.password} onChange={(event) => passwordForm.setData('password', event.target.value)} placeholder="كلمة المرور الجديدة" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                <input type="password" value={passwordForm.data.password_confirmation} onChange={(event) => passwordForm.setData('password_confirmation', event.target.value)} placeholder="تأكيد كلمة المرور" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-300" />
                                {passwordForm.errors.current_password && <div className="text-xs font-bold text-red-600">{passwordForm.errors.current_password}</div>}
                                {passwordForm.errors.password && <div className="text-xs font-bold text-red-600">{passwordForm.errors.password}</div>}
                                <button type="submit" disabled={passwordForm.processing} className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:border-orange-300 disabled:opacity-60">
                                    تحديث كلمة المرور
                                </button>
                            </form>
                        </article>
                    </section>

                    <section className="space-y-6">
                        <article className="rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)]">
                            <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">كورساتي الحالية</h2>
                            <div className="mt-4 space-y-3">
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <article key={`${course.id}-${course.enrolled_at ?? ''}`} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-3">
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-sm font-black text-slate-900">{course.title}</div>
                                                    <div className="mt-1 text-xs font-semibold text-slate-500">{course.short_description || 'بدون وصف مختصر'}</div>
                                                    {course.enrolled_at && <div className="mt-2 text-xs font-bold text-orange-700">تاريخ التسجيل: {course.enrolled_at}</div>}
                                                </div>
                                                {course.id && (
                                                    <Link href={`/student/courses/${course.id}`} className="rounded-2xl bg-white px-4 py-2 text-xs font-bold text-slate-700">
                                                        فتح
                                                    </Link>
                                                )}
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="rounded-[24px] border border-dashed border-orange-200 bg-orange-50/70 p-6 text-sm text-slate-600">
                                        لا توجد كورسات مسجلة لهذا الحساب حالياً.
                                    </div>
                                )}
                            </div>
                        </article>
                    </section>
                </div>
            </div>
        </StudentShell>
    );
}
