<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/faqs/index', [
            'faqs' => Faq::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (Faq $faq) => $this->adminPayload($faq)),
            'stats' => [
                'total' => Faq::query()->count(),
                'active' => Faq::query()->where('status', true)->count(),
                'video' => Faq::query()->where('answer_type', 'video')->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/faqs/create');
    }

    public function store(StoreFaqRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('video_file')) {
            $payload['video_path'] = $request->file('video_file')->store('faqs/videos', 'public');
            $payload['video_url'] = null;
        }

        if ($request->hasFile('cover_image_file')) {
            $payload['video_cover_image'] = $request->file('cover_image_file')->store('faqs/covers', 'public');
        }

        Faq::create($payload);

        return to_route('admin.faqs.index')->with('success', 'تمت إضافة السؤال الشائع بنجاح.');
    }

    public function edit(Faq $faq): Response
    {
        return Inertia::render('admin/faqs/edit', [
            'faq' => $this->adminPayload($faq),
        ]);
    }

    public function update(UpdateFaqRequest $request, Faq $faq): RedirectResponse
    {
        $payload = $request->validated();
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('video_file')) {
            $this->deleteStoredFile($faq->video_path);
            $payload['video_path'] = $request->file('video_file')->store('faqs/videos', 'public');
            $payload['video_url'] = null;
        } else {
            $payload['video_path'] = $faq->video_path;
        }

        if ($request->hasFile('cover_image_file')) {
            $this->deleteStoredFile($faq->video_cover_image);
            $payload['video_cover_image'] = $request->file('cover_image_file')->store('faqs/covers', 'public');
        } else {
            $payload['video_cover_image'] = $faq->video_cover_image;
        }

        $faq->update($payload);

        return to_route('admin.faqs.index')->with('success', 'تم تحديث السؤال الشائع بنجاح.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $this->deleteStoredFile($faq->video_path);
        $this->deleteStoredFile($faq->video_cover_image);
        $faq->delete();

        return to_route('admin.faqs.index')->with('success', 'تم حذف السؤال الشائع بنجاح.');
    }

    private function adminPayload(Faq $faq): array
    {
        return [
            'id' => $faq->id,
            'question' => $faq->question,
            'answer_type' => $faq->answer_type,
            'answer_text' => $faq->answer_text,
            'video_url' => $faq->video_url,
            'video_path' => $faq->video_path,
            'video_path_url' => $this->resolveMediaUrl($faq->video_path),
            'video_cover_image' => $faq->video_cover_image,
            'video_cover_image_url' => $this->resolveMediaUrl($faq->video_cover_image),
            'status' => $faq->status,
            'sort_order' => $faq->sort_order,
        ];
    }

    private function resolveMediaUrl(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
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
