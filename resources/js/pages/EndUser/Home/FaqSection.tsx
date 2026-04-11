import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

type FaqItem = {
    id: number;
    question: string;
    answer_type: 'text' | 'video';
    answer_text: string | null;
    video_url: string | null;
    video_cover_image: string | null;
};

const sectionTitle = 'الأسئلة الشائعة';
const sectionSubtitle = 'كل إجابة بصياغة واضحة وسريعة تساعدك في اتخاذ القرار.';

export default function FaqSection({ faqs = [] }: { faqs?: FaqItem[] }) {
    const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

    const normalizedFaqs = useMemo(() => faqs.filter((faq) => faq.question), [faqs]);

    const toggle = (id: number) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-orange-50/60 py-16 sm:py-20" dir="rtl">
            <div className="pointer-events-none absolute -left-16 top-10 h-44 w-44 rounded-full bg-orange-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -right-12 bottom-12 h-40 w-40 rounded-full bg-sky-200/40 blur-2xl" />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                }}
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="academy-title-group inline-flex items-center gap-1 font-playpen-arabic text-[clamp(1.8rem,4vw,3.4rem)] font-bold text-slate-900">
                        <span className="academy-bracket academy-bracket-left text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                            {'<'}/
                        </span>
                        <span>{sectionTitle}</span>
                        <span className="academy-bracket academy-bracket-right text-orange-500" style={{ fontFamily: "'Fira Code', monospace" }}>
                            {'>'}
                        </span>
                    </h2>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">{sectionSubtitle}</p>
                </div>

                {normalizedFaqs.length > 0 ? (
                    <div className="mx-auto mt-10 max-w-4xl space-y-4">
                        {normalizedFaqs.map((faq, index) => {
                            const isOpen = openId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className={`rounded-2xl border bg-white/90 shadow-sm transition ${
                                        isOpen ? 'border-orange-200' : 'border-slate-200'
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggle(faq.id)}
                                        className="flex w-full items-center justify-between gap-4 p-5 text-right"
                                        aria-expanded={isOpen}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-sm font-bold text-orange-600">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-base font-semibold text-slate-900 sm:text-lg">
                                                {faq.question}
                                            </span>
                                        </div>
                                        <span
                                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-slate-600 transition ${
                                                isOpen ? 'rotate-180 border-sky-200 bg-sky-50' : 'border-slate-200 bg-white'
                                            }`}
                                        >
                                            <ChevronDown size={18} />
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="px-5 pb-5">
                                            {faq.answer_type === 'video' ? (
                                                faq.video_url ? (
                                                    <div className="faq-inline-video-frame">
                                                        <div className="explore-modal-card relative mx-auto overflow-hidden">
                                                            <div className="explore-modal-video-wrap">
                                                                <video
                                                                    key={faq.video_url}
                                                                    src={faq.video_url}
                                                                    poster={faq.video_cover_image ?? undefined}
                                                                    controls
                                                                    preload="metadata"
                                                                    playsInline
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="explore-modal-info">
                                                                <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">Ù…Ù‚Ø·Ø¹ Ø§Ù„Ø³Ø¤Ø§Ù„</p>
                                                                <h3 className="mt-1 text-lg font-bold text-white">{faq.question}</h3>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/70 p-4 text-sm text-slate-600">
                                                        ÙÙŠØ¯ÙŠÙˆ Ø§Ù„Ø¥Ø¬Ø§Ø¨Ø© ØºÙŠØ± Ù…ØªØ§Ø­ Ø­Ø§Ù„ÙŠØ§.
                                                    </div>
                                                )
                                            ) : (
                                                <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                                                    {faq.answer_text}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dashed border-orange-200 bg-white/80 p-8 text-center text-slate-600">
                        Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£Ø³Ø¦Ù„Ø© Ø´Ø§Ø¦Ø¹Ø© Ù…ÙØ¹Ù„Ø© Ø­Ø§Ù„ÙŠØ§.
                    </div>
                )}
            </div>
        </section>
    );
}
