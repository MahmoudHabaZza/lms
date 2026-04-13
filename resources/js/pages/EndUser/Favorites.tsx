import { Head, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { CourseShowcaseCard } from '@/components/end-user/course-showcase-card';
import type { PublicCourseCard } from '@/components/end-user/course-showcase-card';
import MainLayout from './layouts/master';

export default function Favorites({ favorites = [] }: { favorites: PublicCourseCard[] }) {
    const { settings } = usePage<{ settings?: Record<string, string | null | undefined> }>().props;
    const favoritesTitle = settings?.favorites_title?.trim() || 'كورساتي المفضلة';
    const favoritesSubtitle = settings?.favorites_subtitle?.trim() || 'كل الكورسات اللي ضفتها بالقلب هتظهر هنا علشان ترجع لها بسرعة.';
    const favoritesEmptyText = settings?.favorites_empty_text?.trim() || 'لا توجد كورسات في المفضلة حاليًا. اضغط على أيقونة القلب من صفحة الكورسات لإضافة ما يعجبك.';
    return (
        <MainLayout>
            <Head title="المفضلة" />
            <div dir="rtl" className="bg-slate-50 pb-16 pt-8">
                <section className="mx-auto max-w-[1500px] px-4 sm:px-8">
                    <div className="rounded-[28px] border border-rose-100 bg-[linear-gradient(135deg,#fff1f2_0%,#ffffff_52%,#fff7ed_100%)] p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-right">
                                <div className="text-xs font-bold tracking-[0.3em] text-rose-500">قائمة شخصية</div>
                                <h1 className="mt-2 text-2xl font-black text-slate-900">{favoritesTitle}</h1>
                                <p className="mt-2 text-sm text-slate-600">{favoritesSubtitle}</p>
                            </div>
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                                <Heart className="h-6 w-6 fill-current" />
                            </div>
                        </div>
                    </div>

                    {favorites.length > 0 ? (
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {favorites.map((course, index) => (
                                <CourseShowcaseCard
                                    key={course.id}
                                    course={course}
                                    animationDelay={index * 0.05}
                                    layout="grid"
                                    variant="home-compact"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                            {favoritesEmptyText}
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
