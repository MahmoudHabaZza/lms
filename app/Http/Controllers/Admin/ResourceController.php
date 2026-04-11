<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Course;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/resources/index', [
            'resources' => Resource::query()
                ->with('course')
                ->orderBy('title')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Resource $resource) => $this->adminPayload($resource)),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/resources/create', [
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreResourceRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['file']);

        if ($request->hasFile('file')) {
            $payload['file'] = $request->file('file')->store('resources/files', 'public');
        }

        Resource::create($payload);

        return to_route('admin.resources.index')->with('success', 'تمت إضافة المورد بنجاح.');
    }

    public function edit(Resource $resource): Response
    {
        $resource->load('course');

        return Inertia::render('admin/resources/edit', [
            'resource' => $this->adminPayload($resource),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $payload = $request->safe()->except(['file']);

        if ($request->hasFile('file')) {
            $this->deleteStoredFile($resource->file);
            $payload['file'] = $request->file('file')->store('resources/files', 'public');
        }

        $resource->update($payload);

        return to_route('admin.resources.index')->with('success', 'تم تحديث المورد بنجاح.');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        $this->deleteStoredFile($resource->file);
        $resource->delete();

        return to_route('admin.resources.index')->with('success', 'تم حذف المورد بنجاح.');
    }

    private function adminPayload(Resource $resource): array
    {
        return [
            'id' => $resource->id,
            'course_id' => $resource->course_id,
            'course_title' => $resource->course?->title,
            'title' => $resource->title,
            'file' => $resource->file,
            'file_url' => $this->resolveMediaUrl($resource->file),
        ];
    }

    private function courses(): array
    {
        return Course::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }

    private function resolveMediaUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return '/storage/'.ltrim($value, '/');
    }

    private function deleteStoredFile(?string $value): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (str_starts_with($value, '/') || str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return;
        }

        Storage::disk('public')->delete($value);
    }
}
