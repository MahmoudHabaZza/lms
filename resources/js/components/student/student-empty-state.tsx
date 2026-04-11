type StudentEmptyStateProps = {
    title: string;
    description: string;
};

export function StudentEmptyState({ title, description }: StudentEmptyStateProps) {
    return (
        <div className="rounded-[28px] border border-dashed border-orange-200 bg-orange-50/70 p-10 text-center shadow-[0_18px_34px_-30px_rgba(249,115,22,0.5)]">
            <div className="font-playpen-arabic text-2xl font-extrabold text-slate-900">{title}</div>
            <div className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">{description}</div>
        </div>
    );
}
