import {
    BadgeCheck,
    Code2,
    Laptop,
    Rocket,
    Trophy,
    Users,
    UserRoundCheck,
    GraduationCap,
    BookOpen,
    Award,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useState, type ElementType } from 'react';

type JourneyPoint = {
    id: number;
    title: string;
    icon: string;
    bubble_color: string;
    bubble_style: string;
};

const iconMap: Record<string, ElementType> = {
    Users,
    UserRoundCheck,
    BadgeCheck,
    Trophy,
    Code2,
    Rocket,
    Laptop,
    GraduationCap,
    BookOpen,
    Award,
};

function resolveIcon(iconName: string): ElementType {
    return iconMap[iconName] || Rocket;
}

function parseBubbleStyle(bubbleStyle: string): { border: string; bg: string; text: string } {
    const parts = bubbleStyle.split(' ');
    return {
        border: parts.find((p) => p.startsWith('border-')) || 'border-sky-500',
        bg: parts.find((p) => p.startsWith('bg-')) || 'bg-white',
        text: parts.find((p) => p.startsWith('text-')) || 'text-sky-600',
    };
}

type AcademyJourneySectionProps = {
    journeyPoints: JourneyPoint[];
};

const treeRoot = { x: 640, y: 68 };
const treeBranchStartY = 68;

export default function AcademyJourneySection({ journeyPoints = [] }: AcademyJourneySectionProps) {
    const { settings } = usePage<any>().props;
    const [activePoint, setActivePoint] = useState(0);
    const journeyTitle = settings?.home_journey_title?.trim() || 'رحلة في عالم كيد كودر';
    const journeySubtitle = settings?.home_journey_subtitle?.trim() || 'تجربة تعليمية عملية بتصميم متابعة ذكي وممتع';

    if (journeyPoints.length === 0) {
        return null;
    }

    const n = journeyPoints.length;
    const numRows = Math.ceil(n / 2);
    const rowHeight = 134;
    const svgViewBoxHeight = Math.max(500, 110 + numRows * rowHeight + 60);

    const desktopTreeLayout = journeyPoints.map((_, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const isLastCentered = index === n - 1 && n % 2 === 1;

        const cardWidth = isLastCentered ? 396 : 410;
        const cardTop = 110 + row * rowHeight;

        let cardLeft;
        if (isLastCentered) {
            cardLeft = (1280 - cardWidth) / 2;
        } else {
            const spread = Math.min(row, 2) * 16;
            cardLeft = col === 0
                ? Math.max(6, 42 - spread)
                : Math.min(864, 828 + spread);
        }

        const nodeX = cardLeft + cardWidth / 2 + (col === 0 ? 24 : -24);
        const nodeY = cardTop + 38;

        return { cardTop, cardLeft, cardWidth, nodeX, nodeY };
    });

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

                    <div className="relative mt-8 lg:hidden" dir="ltr">
                        <div className="pointer-events-none absolute left-1/2 top-10 bottom-8 w-[2px] -translate-x-1/2 bg-gradient-to-b from-emerald-300/80 via-slate-300 to-orange-200" />

                        <div className="relative mb-6 flex justify-center">
                            <div className="relative">
                                <span className="absolute inset-0 rounded-full bg-emerald-200/70 blur-md" />
                                <span className="relative inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-emerald-300 bg-white/95 text-emerald-600 shadow-[0_18px_32px_-18px_rgba(16,185,129,0.9)]">
                                    <Laptop size={28} />
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                        {journeyPoints.map((point, index) => {
                            const Icon = resolveIcon(point.icon);
                            const isActive = activePoint === index;
                            const branchLeft = index % 2 === 0;

                            return (
                                <div key={point.id} className="relative min-h-[110px]">
                                    <div
                                        className={`pointer-events-none absolute top-1/2 h-[2px] -translate-y-1/2 ${
                                            branchLeft
                                                ? 'left-1/2 right-[22%]'
                                                : 'left-[22%] right-1/2'
                                        }`}
                                        style={{
                                            backgroundColor: point.bubble_color,
                                            opacity: isActive ? 0.55 : 0.28,
                                        }}
                                    />

                                    <span
                                        className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_6px_rgba(255,255,255,0.45)]"
                                        style={{ backgroundColor: point.bubble_color }}
                                    />

                                    <button
                                        type="button"
                                        dir="rtl"
                                        onClick={() =>
                                            setActivePoint(
                                                isActive ? -1 : index,
                                            )
                                        }
                                        onMouseEnter={() =>
                                            setActivePoint(index)
                                        }
                                        onFocus={() => setActivePoint(index)}
                                        className={`relative flex w-[78%] max-w-[18rem] items-center justify-between gap-4 rounded-[24px] border bg-white/92 px-5 py-4 text-right backdrop-blur-sm transform-gpu transition-all duration-300 ease-out ${
                                            branchLeft
                                                ? 'mr-auto'
                                                : 'ml-auto'
                                        } ${
                                            isActive
                                                ? 'scale-[1.03] border-orange-300 shadow-[0_24px_48px_-30px_color-mix(in_srgb,var(--site-primary-color)_88%,transparent)]'
                                                : 'border-white/75 shadow-[0_16px_30px_-26px_rgba(15,23,42,0.55)]'
                                        }`}
                                    >
                                        <span className="min-w-0 pr-1">
                                            <span className="block text-[1rem] leading-6 font-bold text-slate-700">
                                                {point.title}
                                            </span>
                                        </span>
                                        <span
                                            className={`absolute top-1/2 inline-flex shrink-0 items-center justify-center rounded-full border-[4px] ${point.bubble_style} -translate-y-1/2 transform-gpu transition-all duration-300 ease-out ${
                                                isActive
                                                    ? 'h-12 w-12'
                                                    : 'h-10 w-10'
                                            } ${
                                                branchLeft
                                                    ? '-right-5'
                                                    : '-left-5'
                                            }`}
                                        >
                                            <Icon
                                                size={isActive ? 18 : 16}
                                            />
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                        </div>
                    </div>

                    <div className="relative mt-1 hidden lg:block" dir="ltr" style={{ height: svgViewBoxHeight }}>
                        <svg
                            viewBox={`0 0 1280 ${svgViewBoxHeight}`}
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
                                cy={svgViewBoxHeight * 0.52}
                                rx="388"
                                ry={Math.min(180, svgViewBoxHeight * 0.35)}
                                stroke="#a7b1c2"
                                strokeDasharray="4 8"
                                strokeWidth="1.25"
                                opacity="0.24"
                            />
                            {journeyPoints.map((point, index) => {
                                const layout = desktopTreeLayout[index];
                                const isActive = activePoint === index;
                                const row = Math.floor(index / 2);
                                const col = index % 2;
                                const dx = layout.nodeX - treeRoot.x;
                                const dy = layout.nodeY - treeBranchStartY;
                                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                                let px, py;
                                if (dx < 0) {
                                    px = -dy / len;
                                    py = dx / len;
                                } else if (dx > 0) {
                                    px = dy / len;
                                    py = -dx / len;
                                } else {
                                    px = 0;
                                    py = 1;
                                }
                                const push = 30 + row * 24;
                                const mx = (treeRoot.x + layout.nodeX) / 2;
                                const my = (treeBranchStartY + layout.nodeY) / 2;
                                const controlX = mx + px * push;
                                const controlY = my + py * push;
                                const cardAnchorX = layout.cardLeft + layout.cardWidth + 3;
                                const cardAnchorY = layout.cardTop + 38;
                                const cardControlX1 = cardAnchorX - 42;
                                const cardControlX2 = layout.nodeX + 44;
                                const cardControlY =
                                    (cardAnchorY + layout.nodeY) / 2 +
                                    (layout.nodeY > cardAnchorY ? 13 : -13);

                                return (
                                    <g key={`tree-path-${point.id}`}>
                                        <path
                                            d={`M${cardAnchorX} ${cardAnchorY} C ${cardControlX1} ${cardAnchorY} ${cardControlX2} ${cardControlY} ${layout.nodeX} ${layout.nodeY}`}
                                            stroke={point.bubble_color}
                                            strokeWidth={isActive ? 2 : 1.5}
                                            opacity={isActive ? 0.72 : 0.4}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-width 220ms ease, opacity 220ms ease' }}
                                        />
                                        <path
                                            d={`M${treeRoot.x} ${treeBranchStartY} Q ${controlX} ${controlY} ${layout.nodeX} ${layout.nodeY}`}
                                            stroke={point.bubble_color}
                                            strokeWidth={isActive ? 3.1 : 2.2}
                                            opacity={isActive ? 0.96 : 0.76}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-width 220ms ease, opacity 220ms ease' }}
                                        />
                                        <circle
                                            cx={layout.nodeX}
                                            cy={layout.nodeY}
                                            r={isActive ? 7.4 : 6.3}
                                            fill={point.bubble_color}
                                            opacity={0.95}
                                            style={{ transition: 'r 180ms ease' }}
                                        />
                                        <circle
                                            cx={layout.nodeX}
                                            cy={layout.nodeY}
                                            r={isActive ? 12.8 : 10.8}
                                            stroke={point.bubble_color}
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
                                const Icon = resolveIcon(point.icon);
                                const isActive = activePoint === index;
                                const layout = desktopTreeLayout[index];

                                return (
                                        <button
                                        key={point.id}
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

                                        <span
                                            className={`absolute ${isActive ? '-right-10' : '-right-8'} top-1/2 inline-flex ${isActive ? 'h-[64px] w-[64px]' : 'h-[46px] w-[46px]'} -translate-y-1/2 items-center justify-center rounded-full border-[6px] ${point.bubble_style} transform-gpu transition-all duration-300 ease-out`}
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
