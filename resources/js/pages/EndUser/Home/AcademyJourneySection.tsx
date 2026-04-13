import {
    BadgeCheck,
    Laptop,
    Code2,
    Rocket,
    Trophy,
    Users,
    UserRoundCheck,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

type JourneyPoint = {
    title: string;
    subtitle: string;
    icon: typeof Users;
    bubble: string;
    color: string;
};

const journeyPoints: JourneyPoint[] = [
    {
        title: 'سيشن أونلاين تفاعلية',
        subtitle: 'تعلم حي بخطوات عملية',
        icon: Users,
        bubble: 'border-sky-500 bg-white text-sky-600',
        color: '#1d9bf0',
    },
    {
        title: '4 أطفال في الجروب',
        subtitle: 'مجموعات صغيرة بمتابعة أدق',
        icon: UserRoundCheck,
        bubble: 'border-emerald-500 bg-white text-emerald-600',
        color: '#10b981',
    },
    {
        title: 'شهادة معتمدة',
        subtitle: 'إنجاز رسمي بعد كل مستوى',
        icon: BadgeCheck,
        bubble: 'border-orange-500 bg-white text-orange-500',
        color: 'var(--site-primary-color)',
    },
    {
        title: 'حساب خاص لمتابعة أداء الأبناء',
        subtitle: 'لوحة واضحة لولي الأمر',
        icon: Trophy,
        bubble: 'border-rose-600 bg-white text-rose-600',
        color: '#e11d70',
    },
    {
        title: 'مشاريع وتحديات تطبيقية',
        subtitle: 'كل مستوى ينتهي بإنجاز ممتع',
        icon: Code2,
        bubble: 'border-amber-500 bg-white text-amber-600',
        color: 'var(--site-primary-500)',
    },
];

const treeRoot = { x: 640, y: 68 };
const treeBranchStartY = 68;

const desktopTreeLayout = [
    { cardTop: 110, cardLeft: 42, cardWidth: 410, nodeX: 332, nodeY: 168 },
    { cardTop: 110, cardLeft: 828, cardWidth: 410, nodeX: 948, nodeY: 168 },
    { cardTop: 246, cardLeft: 22, cardWidth: 430, nodeX: 252, nodeY: 278 },
    { cardTop: 246, cardLeft: 824, cardWidth: 430, nodeX: 1028, nodeY: 278 },
    { cardTop: 380, cardLeft: 442, cardWidth: 396, nodeX: 640, nodeY: 382 },
];

export default function AcademyJourneySection() {
    const { settings } = usePage<any>().props;
    const [activePoint, setActivePoint] = useState(0);
    const journeyTitle = settings?.home_journey_title?.trim() || 'رحلة في عالم كيد كودر';
    const journeySubtitle = settings?.home_journey_subtitle?.trim() || 'تجربة تعليمية عملية بتصميم متابعة ذكي وممتع';

    return (
        <div className="flex flex-col">
            <section
                className="relative order-1 overflow-hidden bg-gradient-to-b from-[#f4f6fb] via-[#f6f7fb] to-[#ecf2fc] py-10 sm:py-14"
                dir="rtl"
            >
                <div className="pointer-events-none absolute left-16 top-8 hidden h-72 w-72 rounded-full bg-orange-100/40 blur-3xl lg:block" />
                <div className="pointer-events-none absolute right-20 top-12 hidden h-64 w-64 rounded-full bg-sky-100/55 blur-3xl lg:block" />
                <div className="pointer-events-none absolute left-1/2 top-12 hidden h-44 w-44 -translate-x-1/2 rounded-full bg-emerald-100/45 blur-3xl lg:block" />
                <Rocket
                    className="pointer-events-none absolute -left-10 top-16 hidden h-[360px] w-[360px] rotate-[10deg] text-[#f6c9b5] opacity-25 lg:block"
                    strokeWidth={1.2}
                />

                <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
                    <h3 className="academy-title-group flex items-center justify-center gap-4 text-center font-playpen-arabic text-[clamp(1.9rem,4.3vw,3.6rem)] font-bold leading-tight text-slate-900">
                        <span className="inline-flex items-center gap-3" aria-hidden="true">
                            <span className="h-0.5 w-10 rounded-full bg-gradient-to-r from-transparent via-orange-300 to-orange-500 sm:w-16" />
                            <span className="h-4 w-4 rounded-full border-[3px] border-orange-400 bg-white shadow-[0_0_0_6px_color-mix(in_srgb,var(--site-primary-400)_18%,transparent)]" />
                        </span>
                        <span>{journeyTitle}</span>
                        <span className="inline-flex items-center gap-3" aria-hidden="true">
                            <span className="h-4 w-4 rounded-full border-[3px] border-orange-400 bg-white shadow-[0_0_0_6px_color-mix(in_srgb,var(--site-primary-400)_18%,transparent)]" />
                            <span className="h-0.5 w-10 rounded-full bg-gradient-to-l from-transparent via-orange-300 to-orange-500 sm:w-16" />
                        </span>
                    </h3>

                    <div className="mt-3 text-center font-playpen-arabic text-sm text-slate-500">
                        {journeySubtitle}
                    </div>

                    <div className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:hidden">
                        {journeyPoints.map((point, index) => {
                            const Icon = point.icon;
                            const isActive = activePoint === index;
                            const isLastOdd = index === journeyPoints.length - 1 && journeyPoints.length % 2 === 1;

                            return (
                                <button
                                    key={point.title}
                                    type="button"
                                    onMouseEnter={() => setActivePoint(index)}
                                    onFocus={() => setActivePoint(index)}
                                    className={`relative flex w-full items-center justify-between gap-4 rounded-2xl border bg-white/90 px-5 py-4 text-right backdrop-blur-sm transform-gpu transition-transform duration-300 ease-out ${
                                        isActive
                                            ? 'scale-105 border-orange-300 shadow-[0_20px_44px_-28px_color-mix(in_srgb,var(--site-primary-color)_92%,transparent)] z-20'
                                            : 'border-white/70 shadow-[0_14px_28px_-24px_rgba(15,23,42,0.55)]'
                                    } ${index % 2 === 1 ? 'sm:translate-y-4' : ''} ${isLastOdd ? 'sm:col-span-2 sm:mx-auto sm:w-[68%] sm:translate-y-0' : ''}`}
                                onMouseLeave={() => setActivePoint(activePoint === index ? -1 : activePoint)}
                                onBlur={() => setActivePoint(activePoint === index ? -1 : activePoint)}
                                >
                                    
                                    <span className="pr-2">
                                        <span className="block text-[1.02rem] font-bold text-slate-700">{point.title}</span>
                                        <span className="mt-0.5 block text-[0.78rem] text-slate-500">{point.subtitle}</span>
                                    </span>
                                    <span
                                        className={`inline-flex ${isActive ? 'h-12 w-12' : 'h-9 w-9'} shrink-0 items-center justify-center rounded-full border-[4px] ${point.bubble} transform-gpu transition-all duration-300 ease-out`}
                                    >
                                        <Icon size={isActive ? 18 : 15} />
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative mt-1 hidden h-[540px] lg:block" dir="ltr">
                        <svg
                            viewBox="0 0 1280 540"
                            className="pointer-events-none absolute inset-0 h-full w-full"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d={`M${treeRoot.x} ${treeRoot.y - 20} C ${treeRoot.x - 86} ${treeRoot.y - 58} ${treeRoot.x + 86} ${treeRoot.y - 58} ${treeRoot.x} ${treeRoot.y - 20}`}
                                stroke="#9ca3af"
                                strokeWidth="1.6"
                                strokeDasharray="4 7"
                                opacity="0.55"
                            />
                            <ellipse
                                cx="640"
                                cy="280"
                                rx="388"
                                ry="180"
                                stroke="#a7b1c2"
                                strokeDasharray="4 8"
                                strokeWidth="1.25"
                                opacity="0.24"
                            />
                            {journeyPoints.map((point, index) => {
                                const layout = desktopTreeLayout[index];
                                const isActive = activePoint === index;
                                // push lower-left and lower-right branches further out to avoid crossing other branches
                                const baseControl = treeRoot.x + (layout.nodeX - treeRoot.x) * 0.35;
                                const sideOffset = index === 2 ? -80 : index === 3 ? 80 : (index - 2) * 24;
                                const controlX = baseControl + sideOffset;
                                let controlY =
                                    layout.nodeY > treeBranchStartY + 150
                                        ? treeBranchStartY + 66
                                        : treeBranchStartY - 28;
                                // if this is branch 3 or 4 (index 2 or 3), push control point downward
                                if (index === 2 || index === 3) {
                                    controlY = controlY + 140;
                                }
                                const cardAnchorX = layout.cardLeft + layout.cardWidth + 3;
                                const cardAnchorY = layout.cardTop + 38;
                                const cardControlX1 = cardAnchorX - 42;
                                const cardControlX2 = layout.nodeX + 44;
                                const cardControlY =
                                    (cardAnchorY + layout.nodeY) / 2 +
                                    (layout.nodeY > cardAnchorY ? 13 : -13);

                                return (
                                    <g key={`tree-path-${point.title}`}>
                                        <path
                                            d={`M${cardAnchorX} ${cardAnchorY} C ${cardControlX1} ${cardAnchorY} ${cardControlX2} ${cardControlY} ${layout.nodeX} ${layout.nodeY}`}
                                            stroke={point.color}
                                            strokeWidth={isActive ? 2 : 1.5}
                                            opacity={isActive ? 0.72 : 0.4}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-width 220ms ease, opacity 220ms ease' }}
                                        />
                                        <path
                                            d={`M${treeRoot.x} ${treeBranchStartY} Q ${controlX} ${controlY} ${layout.nodeX} ${layout.nodeY}`}
                                            stroke={point.color}
                                            strokeWidth={isActive ? 3.1 : 2.2}
                                            opacity={isActive ? 0.96 : 0.76}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-width 220ms ease, opacity 220ms ease' }}
                                        />
                                        <circle
                                            cx={layout.nodeX}
                                            cy={layout.nodeY}
                                            r={isActive ? 7.4 : 6.3}
                                            fill={point.color}
                                            opacity={0.95}
                                            style={{ transition: 'r 180ms ease' }}
                                        />
                                        <circle
                                            cx={layout.nodeX}
                                            cy={layout.nodeY}
                                            r={isActive ? 12.8 : 10.8}
                                            stroke={point.color}
                                            strokeWidth="1.4"
                                            opacity={isActive ? 0.35 : 0.22}
                                            style={{ transition: 'r 180ms ease, opacity 180ms ease' }}
                                        />
                                    </g>
                                );
                            })}

                            <circle cx={treeRoot.x} cy={treeRoot.y} r="10" fill="#16a34a" opacity="0.25" />
                            <circle cx={treeRoot.x} cy={treeRoot.y} r="18" stroke="#16a34a" strokeWidth="1.3" opacity="0.28" />
                        </svg>

                        <div className="absolute left-0 top-0 h-full w-full">
                            <div
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: `${treeRoot.x}px`, top: `${treeRoot.y - 12}px` }}
                            >
                                <div className="relative">
                                    <span className="absolute inset-0 rounded-full bg-emerald-200/70 blur-md" />
                                        <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-300 bg-white/95 text-emerald-600 shadow-[0_18px_32px_-18px_rgba(16,185,129,0.9)]">
                                                <Laptop size={30} />
                                            </span>
                                </div>
                            </div>

                            {journeyPoints.map((point, index) => {
                                const Icon = point.icon;
                                const isActive = activePoint === index;
                                const layout = desktopTreeLayout[index];

                                return (
                                        <button
                                        key={point.title}
                                        type="button"
                                        onMouseEnter={() => setActivePoint(index)}
                                        onFocus={() => setActivePoint(index)}
                                        className={`absolute h-[76px] rounded-[20px] border bg-white/90 text-center backdrop-blur-sm transform-gpu transition-all duration-300 ease-out ${
                                            isActive
                                                ? 'scale-105 border-orange-300 shadow-[0_26px_48px_-30px_color-mix(in_srgb,var(--site-primary-color)_85%,transparent)] z-30'
                                                : 'border-white/70 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.6)]'
                                        }`}
                                        style={{
                                            top: `${layout.cardTop}px`,
                                            left: `${layout.cardLeft}px`,
                                            width: `${layout.cardWidth}px`,
                                        }}
                                        dir="rtl"
                                    >
                                        
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-bold tracking-[0.18em] text-slate-400">
                                            {`0${index + 1}`}
                                        </span>
                                        <span className="block px-13 pt-[9px] text-[1.08rem] font-bold text-slate-700">
                                            {point.title}
                                        </span>
                                        <span className="block px-13 text-[0.78rem] text-slate-500">
                                            {point.subtitle}
                                        </span>

                                        <span
                                            className={`absolute ${isActive ? '-right-10' : '-right-8'} top-1/2 inline-flex ${isActive ? 'h-[64px] w-[64px]' : 'h-[46px] w-[46px]'} -translate-y-1/2 items-center justify-center rounded-full border-[6px] ${point.bubble} transform-gpu transition-all duration-300 ease-out`}
                                            style={{
                                                boxShadow: isActive
                                                    ? '0 16px 36px -20px rgba(15,23,42,0.88)'
                                                    : '0 8px 20px -19px rgba(15,23,42,0.55)',
                                            }}
                                        >
                                            <Icon size={isActive ? 20 : 16} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

