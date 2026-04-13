import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

type ProgrammingCourseFormData = {
    title: string;
    age_group: string;
    thumbnail: string;
    short_description: string;
    learning_outcome: string;
    duration_months: number;
    sessions_count: number;
    sessions_per_week: number;
    badge: string;
    accent_color: string;
    sort_order: number;
    status: boolean;
    instructor_id?: number | null;
    category_id?: number | null;
    price?: number | null;
    total_duration_minutes?: number | null;
};

type ProgrammingCourseFormProps = {
    data: ProgrammingCourseFormData;
    setData: {
        (key: 'title', value: string): void;
        (key: 'age_group', value: string): void;
        (key: 'thumbnail', value: string): void;
        (key: 'short_description', value: string): void;
        (key: 'learning_outcome', value: string): void;
        (key: 'duration_months', value: number): void;
        (key: 'sessions_count', value: number): void;
        (key: 'sessions_per_week', value: number): void;
        (key: 'badge', value: string): void;
        (key: 'accent_color', value: string): void;
        (key: 'sort_order', value: number): void;
        (key: 'status', value: boolean): void;
    };
    ageGroups: string[];
    instructors?: { id: number; name: string }[];
    categories?: { id: number; name: string }[];
    errors: Partial<Record<keyof ProgrammingCourseFormData, string>>;
    processing: boolean;
    submitLabel: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function CourseForm({
    data,
    setData,
    ageGroups,
    errors,
    processing,
    submitLabel,
    onSubmit,
    instructors,
    categories,
}: ProgrammingCourseFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border p-6">
            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Course Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.title} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="age_group" className="mb-2 block text-sm font-medium">
                        Age Group
                    </label>
                    <select
                        id="age_group"
                        value={data.age_group}
                        onChange={(e) => setData('age_group', e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    >
                        {ageGroups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.age_group} className="mt-2" />
                </div>
                <div>
                    <label htmlFor="category_id" className="mb-2 block text-sm font-medium">
                        Category
                    </label>
                    <select
                        id="category_id"
                        value={data.category_id ?? ''}
                        onChange={(e) => setData('category_id', e.target.value ? Number(e.target.value) : null)}
                        className="w-full rounded-md border px-3 py-2"
                    >
                        <option value="">— None —</option>
                        {categories?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.category_id as any} className="mt-2" />
                </div>
            </div>

            <div>
                <label htmlFor="thumbnail" className="mb-2 block text-sm font-medium">
                    Thumbnail URL / Path
                </label>
                <input
                    id="thumbnail"
                    type="text"
                    placeholder="/assets/EndUser/images/course-card.jpg"
                    value={data.thumbnail}
                    onChange={(e) => setData('thumbnail', e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />
                <InputError message={errors.thumbnail} className="mt-2" />
            </div>

            <div>
                <label htmlFor="instructor_id" className="mb-2 block text-sm font-medium">
                    Instructor
                </label>
                <select
                    id="instructor_id"
                    value={data.instructor_id ?? ''}
                    onChange={(e) => setData('instructor_id', e.target.value ? Number(e.target.value) : null)}
                    className="w-full rounded-md border px-3 py-2"
                >
                    <option value="">— None —</option>
                    {instructors?.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.instructor_id as any} className="mt-2" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="price" className="mb-2 block text-sm font-medium">
                        Price
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        min={0}
                        value={data.price ?? 0}
                        onChange={(e) => setData('price', Number(e.target.value || '0'))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.price as any} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="total_duration_minutes" className="mb-2 block text-sm font-medium">
                        Total Duration (Minutes)
                    </label>
                    <input
                        id="total_duration_minutes"
                        type="number"
                        min={0}
                        value={data.total_duration_minutes ?? 0}
                        onChange={(e) => setData('total_duration_minutes', Number(e.target.value || '0'))}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.total_duration_minutes as any} className="mt-2" />
                </div>
            </div>

            <div>
                <label htmlFor="short_description" className="mb-2 block text-sm font-medium">
                    Course Description
                </label>
                <textarea
                    id="short_description"
                    rows={4}
                    value={data.short_description}
                    onChange={(e) => setData('short_description', e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />
                <InputError message={errors.short_description} className="mt-2" />
            </div>

            <div>
                <label htmlFor="learning_outcome" className="mb-2 block text-sm font-medium">
                    Learning Outcome
                </label>
                <input
                    id="learning_outcome"
                    type="text"
                    value={data.learning_outcome}
                    onChange={(e) => setData('learning_outcome', e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                />
                <InputError message={errors.learning_outcome} className="mt-2" />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="duration_months" className="mb-2 block text-sm font-medium">
                        Duration (Months)
                    </label>
                    <input
                        id="duration_months"
                        type="number"
                        min={1}
                        value={data.duration_months}
                        onChange={(e) =>
                            setData('duration_months', Number.parseInt(e.target.value || '1', 10))
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.duration_months} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="sessions_count" className="mb-2 block text-sm font-medium">
                        Sessions
                    </label>
                    <input
                        id="sessions_count"
                        type="number"
                        min={1}
                        value={data.sessions_count}
                        onChange={(e) =>
                            setData('sessions_count', Number.parseInt(e.target.value || '1', 10))
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.sessions_count} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="sessions_per_week" className="mb-2 block text-sm font-medium">
                        Sessions / Week
                    </label>
                    <input
                        id="sessions_per_week"
                        type="number"
                        min={1}
                        value={data.sessions_per_week}
                        onChange={(e) =>
                            setData('sessions_per_week', Number.parseInt(e.target.value || '1', 10))
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.sessions_per_week} className="mt-2" />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
                <div>
                    <label htmlFor="badge" className="mb-2 block text-sm font-medium">
                        Badge Label (Optional)
                    </label>
                    <input
                        id="badge"
                        type="text"
                        value={data.badge}
                        onChange={(e) => setData('badge', e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.badge} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="accent_color" className="mb-2 block text-sm font-medium">
                        Accent Color
                    </label>
                    <input
                        id="accent_color"
                        type="text"
                        value={data.accent_color}
                        onChange={(e) => setData('accent_color', e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.accent_color} className="mt-2" />
                </div>

                <div>
                    <label htmlFor="sort_order" className="mb-2 block text-sm font-medium">
                        Sort Order
                    </label>
                    <input
                        id="sort_order"
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(e) =>
                            setData('sort_order', Number.parseInt(e.target.value || '0', 10))
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />
                    <InputError message={errors.sort_order} className="mt-2" />
                </div>
            </div>

            <div className="flex items-end pb-2">
                <label className="inline-flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={data.status}
                        onChange={(e) => setData('status', e.target.checked)}
                        className="size-4"
                    />
                    Active
                </label>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
            >
                {submitLabel}
            </button>
        </form>
    );
}
