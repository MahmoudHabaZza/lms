import { ChevronDown, Clock3, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type CurriculumLesson = {
    id: number;
    title: string;
    description: string | null;
    duration_minutes: number;
    order: number;
};

type CurriculumSection = {
    id: string;
    title: string;
    summary: string | null;
    lessons: CurriculumLesson[];
};

export function CourseCurriculum({
    sections,
}: {
    sections: CurriculumSection[];
}) {
    const [openSections, setOpenSections] = useState<string[]>(sections[0] ? [sections[0].id] : []);

    const toggleSection = (sectionId: string) => {
        setOpenSections((current) =>
            current.includes(sectionId)
                ? current.filter((item) => item !== sectionId)
                : [...current, sectionId],
        );
    };

    return (
        <div className="space-y-4">
            {sections.map((section, sectionIndex) => {
                const isOpen = openSections.includes(section.id);

                return (
                    <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                        <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_20px_45px_-32px_rgba(15,23,42,0.28)]">
                            <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-orange-50 via-white to-white px-5 py-5 text-right transition hover:from-orange-100 hover:via-orange-50/40 sm:px-6">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-sm font-black text-orange-700">
                                            {sectionIndex + 1}
                                        </span>
                                        <h3 className="text-base font-black text-slate-900 sm:text-lg">{section.title}</h3>
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 sm:text-sm">
                                        <span>{section.summary || `${section.lessons.length} درس`}</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                        <span>{section.lessons.length} درس</span>
                                    </div>
                                </div>

                                <div
                                    className={cn(
                                        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-white text-slate-700 transition-transform duration-200',
                                        isOpen && 'rotate-180',
                                    )}
                                >
                                    <ChevronDown className="size-5" />
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="bg-white">
                                <div className="divide-y divide-slate-100">
                                    {section.lessons.map((lesson) => (
                                        <article
                                            key={lesson.id}
                                            className="px-5 py-4 transition hover:bg-orange-50/40 sm:px-6"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                                        <PlayCircle className="size-4" />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-xs font-bold text-orange-600">#{lesson.order || lesson.id}</span>
                                                            <h4 className="text-sm font-bold text-slate-900 sm:text-base">{lesson.title}</h4>
                                                        </div>

                                                        {lesson.description ? (
                                                            <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.description}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="inline-flex items-center gap-2 self-start rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
                                                    <Clock3 className="size-3.5" />
                                                    {lesson.duration_minutes > 0 ? `${lesson.duration_minutes} دقيقة` : 'المدة تحدد لاحقًا'}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </div>
                    </Collapsible>
                );
            })}
        </div>
    );
}
