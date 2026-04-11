import { FormEvent } from 'react';
import InputError from '@/components/input-error';

type Props = {
    data: { name: string; slug: string; permission_ids: number[] };
    setData: (k: string, v: any) => void;
    permissions: { id: number; name: string; slug: string }[];
    errors: any;
    processing: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
};

export default function RoleForm({ data, setData, permissions, errors, processing, onSubmit, submitLabel }: Props) {
    const togglePermission = (id: number) => {
        const next = data.permission_ids.includes(id) ? data.permission_ids.filter((p) => p !== id) : [...data.permission_ids, id];
        setData('permission_ids', next);
    };

    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-xl border p-6 bg-white">
            <div>
                <label className="mb-2 block text-sm font-medium">Name</label>
                <input value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Slug</label>
                <input value={data.slug} onChange={(e) => setData('slug', e.target.value)} className="w-full rounded-md border px-3 py-2" />
                <InputError message={errors.slug} className="mt-2" />
            </div>

            <div>
                <label className="mb-2 block text-sm font-medium">Permissions</label>
                <div className="grid gap-2">
                    {permissions.map((p) => (
                        <label key={p.id} className="inline-flex items-center gap-2">
                            <input type="checkbox" checked={data.permission_ids.includes(p.id)} onChange={() => togglePermission(p.id)} />
                            <span className="text-sm">{p.name} ({p.slug})</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <button type="submit" disabled={processing} className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">{submitLabel}</button>
            </div>
        </form>
    );
}
