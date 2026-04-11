<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBannerSlideRequest;
use App\Http\Requests\UpdateBannerSlideRequest;
use App\Models\BannerSlide;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerSlideController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/banner-slides/index', [
            'slides' => BannerSlide::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (BannerSlide $slide): array => $this->adminPayload($slide)),
            'stats' => [
                'total' => BannerSlide::query()->count(),
                'active' => BannerSlide::query()->where('status', true)->count(),
                'max_sort_order' => (int) (BannerSlide::query()->max('sort_order') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/banner-slides/create');
    }

    public function store(StoreBannerSlideRequest $request): RedirectResponse
    {
        $payload = $request->safe()->except(['background_image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('background_image_file')) {
            $payload['background_image'] = $request->file('background_image_file')->store('banner/images', 'public');
        }

        BannerSlide::create($payload);

        return to_route('admin.banner-slides.index')->with('success', 'تمت إضافة الشريحة بنجاح');
    }

    public function edit(BannerSlide $bannerSlide): Response
    {
        return Inertia::render('admin/banner-slides/edit', [
            'slide' => $this->adminPayload($bannerSlide),
        ]);
    }

    public function update(
        UpdateBannerSlideRequest $request,
        BannerSlide $bannerSlide
    ): RedirectResponse {
        $payload = $request->safe()->except(['background_image_file']);
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        if ($request->hasFile('background_image_file')) {
            $this->deleteStoredFile($bannerSlide->background_image);
            $payload['background_image'] = $request->file('background_image_file')->store('banner/images', 'public');
        }

        $bannerSlide->update($payload);

        return to_route('admin.banner-slides.index')->with('success', 'تم تحديث الشريحة بنجاح');
    }

    public function destroy(BannerSlide $bannerSlide): RedirectResponse
    {
        $this->deleteStoredFile($bannerSlide->background_image);
        $bannerSlide->delete();

        return to_route('admin.banner-slides.index')->with('success', 'تم حذف الشريحة بنجاح');
    }

    /**
     * @return array<string, mixed>
     */
    private function adminPayload(BannerSlide $slide): array
    {
        return [
            'id' => $slide->id,
            'title' => $slide->title,
            'sub_title' => $slide->sub_title,
            'description' => $slide->description,
            'button_link' => $slide->button_link,
            'background_image' => $slide->background_image,
            'background_image_url' => $this->resolveMediaUrl($slide->background_image),
            'status' => $slide->status,
            'sort_order' => $slide->sort_order,
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

        return \Illuminate\Support\Facades\Storage::disk('public')->url($value);
    }

    private function deleteStoredFile(?string $value): void
    {
        if ($value === null || $value === '') {
            return;
        }

        if (str_starts_with($value, '/') || str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            return;
        }

        \Illuminate\Support\Facades\Storage::disk('public')->delete($value);
    }
}
