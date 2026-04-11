type StudentProgressBarProps = {
    value: number;
    label?: string;
};

export function StudentProgressBar({ value, label }: StudentProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, value));

    return (
        <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{label ?? 'التقدم'}</span>
                <span>{clamped}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f97316_0%,#fb923c_45%,#38bdf8_100%)] transition-[width] duration-700"
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
