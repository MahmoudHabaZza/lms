<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAcademySectionRequest;
use App\Http\Requests\UpdateAcademySectionRequest;
use App\Models\AcademySection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AcademySectionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/academy-sections/index', [
            'sections' => AcademySection::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(15)
                ->withQueryString(),
            'stats' => [
                'total' => AcademySection::query()->count(),
                'active' => AcademySection::query()->where('status', true)->count(),
                'average_sort_order' => (int) round((float) (AcademySection::query()->avg('sort_order') ?? 0)),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academy-sections/create');
    }

    public function store(StoreAcademySectionRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        $payload['status'] = (bool) ($payload['status'] ?? false);

        AcademySection::create($payload);

        return to_route('admin.academy-sections.index')->with('success', 'تمت إضافة القسم بنجاح');
    }

    public function edit(AcademySection $academySection): Response
    {
        return Inertia::render('admin/academy-sections/edit', [
            'section' => $academySection,
        ]);
    }

    public function update(
        UpdateAcademySectionRequest $request,
        AcademySection $academySection
    ): RedirectResponse {
        $payload = $request->validated();
        $payload['status'] = (bool) ($payload['status'] ?? false);

        $academySection->update($payload);

        return to_route('admin.academy-sections.index')->with('success', 'تم تحديث القسم بنجاح');
    }

    public function destroy(AcademySection $academySection): RedirectResponse
    {
        $academySection->delete();

        return to_route('admin.academy-sections.index')->with('success', 'تم حذف القسم بنجاح');
    }
}

