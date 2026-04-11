import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CourseRatingStars({
    rating,
    className,
    iconClassName,
}: {
    rating: number;
    className?: string;
    iconClassName?: string;
}) {
    return (
        <div className={cn('flex items-center gap-1', className)} aria-label={`تقييم ${rating} من 5`}>
            {Array.from({ length: 5 }).map((_, index) => {
                const active = rating >= index + 1 || rating >= index + 0.5;

                return (
                    <Star
                        key={index}
                        className={cn(
                            'size-4 transition-colors',
                            active ? 'fill-amber-400 text-amber-400' : 'text-slate-300',
                            iconClassName,
                        )}
                    />
                );
            })}
        </div>
    );
}
