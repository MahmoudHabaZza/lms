import type { FormEvent } from 'react';
import InputError from '@/components/input-error';

type UserRole = {
    id: number;
    name: string;
    slug: string;
};

type Props = {
    data: { role_ids: number[] };
    setData: (key: 'role_ids', value: number[]) => void;
    roles: UserRole[];
    errors: Record<string, string | undefined>;
    processing: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
};

export default function UserForm({ data, setData, roles, errors, processing, onSubmit, submitLabel }: Props) {
    const toggleRole = (id: number) => {
        const next = data.role_ids.includes(id) ? data.role_ids.filter((r) => r !== id) : [...data.role_ids, id];
        setData('role_ids', next);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border bg-white p-6">
            <div className="text-right">
                <label className="mb-2 block text-sm font-medium text-slate-800">الأدوار</label>
                <div className="grid gap-3">
                    {roles.map((role) => (
                        <label
                            key={role.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
                        >
                            <span className="text-sm text-slate-700">
                                {role.name} <span className="text-slate-400">({role.slug})</span>
                            </span>
                            <input
                                type="checkbox"
                                checked={data.role_ids.includes(role.id)}
                                onChange={() => toggleRole(role.id)}
                            />
                        </label>
                    ))}
                </div>
                <InputError message={errors.role_ids} className="mt-2" />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
