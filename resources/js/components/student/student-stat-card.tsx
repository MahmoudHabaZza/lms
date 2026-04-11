import type { LucideIcon } from 'lucide-react';

type StudentStatCardProps = {
    title: string;
    value: string | number;
    hint?: string;
    icon: LucideIcon;
    accent?: 'orange' | 'sky' | 'emerald' | 'rose';
};

const accentStyles = {
    orange: 'bg-orange-100 text-orange-700',
    sky: 'bg-sky-100 text-sky-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
};

export function StudentStatCard({ title, value, hint, icon: Icon, accent = 'orange' }: StudentStatCardProps) {
    return (
        <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold text-slate-500">{title}</div>
                    <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
                    {hint && <div className="mt-2 text-xs font-semibold text-slate-500">{hint}</div>}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentStyles[accent]}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
}
