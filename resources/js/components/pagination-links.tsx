import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types';

type Props = {
    links: PaginationLink[];
    className?: string;
};

const normalizeLabel = (label: string) =>
    label
        .replace('&laquo; Previous', '\u0627\u0644\u0633\u0627\u0628\u0642')
        .replace('Previous', '\u0627\u0644\u0633\u0627\u0628\u0642')
        .replace('Next &raquo;', '\u0627\u0644\u062a\u0627\u0644\u064a')
        .replace('Next', '\u0627\u0644\u062a\u0627\u0644\u064a')
        .replace('&raquo;', '')
        .replace('&laquo;', '')
        .trim();

export default function PaginationLinks({ links, className = '' }: Props) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className={`flex flex-wrap justify-center gap-2 ${className}`.trim()}>
            {links.map((link, index) => {
                const label = normalizeLabel(link.label);

                if (!link.url) {
                    return (
                        <span
                            key={`${label}-${index}`}
                            className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-400"
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${label}-${index}`}
                        href={link.url}
                        className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                            link.active
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
