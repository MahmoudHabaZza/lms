import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function CourseDetailSection({
    title,
    subtitle,
    icon,
    className,
    children,
}: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={cn(
                'rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.28)] backdrop-blur-sm sm:p-6',
                className,
            )}
        >
            <div className="flex items-start gap-4">
                {icon ? (
                    <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                        {icon}
                    </div>
                ) : null}

                <div className="min-w-0">
                    <h2 className="font-playpen-arabic text-2xl font-extrabold text-slate-900">{title}</h2>
                    {subtitle ? <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p> : null}
                </div>
            </div>

            <div className="mt-6">{children}</div>
        </section>
    );
}
