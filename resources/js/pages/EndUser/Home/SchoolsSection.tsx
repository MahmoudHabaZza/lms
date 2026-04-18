export default function SchoolsSection() {
    return (
        <section
            className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-20"
            dir="rtl"
        >
            <div className="relative mx-auto max-w-[1500px] overflow-hidden rounded-[34px] border border-slate-200/70 bg-slate-950 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.7)]">
                <img
                    src="/images/schools-bg.png"
                    alt="طلاب يتعلمون البرمجة داخل معمل حاسب في المدرسة مع مدرس يشرح أمام الصف"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.45)_55%,rgba(2,6,23,0.72)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.2),transparent_32%)]" />

                <div className="absolute top-12 -right-8 h-32 w-32 rounded-full bg-sky-300/20 blur-3xl motion-safe:animate-pulse" />
                <div className="absolute bottom-10 -left-8 h-36 w-36 rounded-full bg-orange-300/20 blur-3xl [animation-delay:1200ms] motion-safe:animate-pulse" />

                <div className="relative z-10 flex min-h-[420px] items-end justify-center p-5 sm:min-h-[500px] sm:p-8 lg:p-12">
                    <div className="max-w-3xl rounded-[28px] border border-white/16 bg-slate-950/28 px-6 py-6 text-center shadow-[0_24px_60px_-36px_rgba(15,23,42,0.95)] backdrop-blur-sm [animation-duration:6s] motion-safe:animate-pulse sm:px-8 sm:py-8">
                        <h2 className="font-playpen-arabic text-[clamp(1.8rem,4vw,3.4rem)] leading-[1.55] font-bold text-white drop-shadow-[0_10px_24px_rgba(15,23,42,0.45)]">
                            نقدّم برامج برمجة تفاعلية داخل المدارس بالشراكة مع
                            المؤسسات التعليمية
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-white/88 sm:text-base sm:leading-8 lg:text-lg lg:leading-9">
                            تجربة تعليمية عملية داخل البيئة المدرسية تساعد
                            الطلاب على بناء المهارات الرقمية والاستعداد لعالم
                            المستقبل.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
