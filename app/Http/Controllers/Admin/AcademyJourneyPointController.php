<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAcademyJourneyPointRequest;
use App\Http\Requests\UpdateAcademyJourneyPointRequest;
use App\Models\AcademyJourneyPoint;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AcademyJourneyPointController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/academy-journey-points/index', [
            'journeyPoints' => AcademyJourneyPoint::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (AcademyJourneyPoint $point): array => [
                    'id' => $point->id,
                    'title' => $point->title,
                    'icon' => $point->icon,
                    'bubble_color' => $point->bubble_color,
                    'bubble_style' => $point->bubble_style,
                    'status' => $point->status,
                    'sort_order' => $point->sort_order,
                ]),
            'stats' => [
                'total' => AcademyJourneyPoint::query()->count(),
                'active' => AcademyJourneyPoint::query()->where('status', true)->count(),
                'max_sort_order' => (int) (AcademyJourneyPoint::query()->max('sort_order') ?? 0),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/academy-journey-points/create');
    }

    public function store(StoreAcademyJourneyPointRequest $request): RedirectResponse
    {
        $payload = $request->safe()->all();
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        AcademyJourneyPoint::create($payload);

        return to_route('admin.academy-journey-points.index')->with('success', 'تمت إضافة نقطة الرحلة بنجاح.');
    }

    public function edit(AcademyJourneyPoint $academyJourneyPoint): Response
    {
        return Inertia::render('admin/academy-journey-points/edit', [
            'journeyPoint' => [
                'id' => $academyJourneyPoint->id,
                'title' => $academyJourneyPoint->title,
                'icon' => $academyJourneyPoint->icon,
                'bubble_color' => $academyJourneyPoint->bubble_color,
                'bubble_style' => $academyJourneyPoint->bubble_style,
                'status' => $academyJourneyPoint->status,
                'sort_order' => $academyJourneyPoint->sort_order,
            ],
        ]);
    }

    public function update(UpdateAcademyJourneyPointRequest $request, AcademyJourneyPoint $academyJourneyPoint): RedirectResponse
    {
        $payload = $request->safe()->all();
        $payload['status'] = (bool) ($payload['status'] ?? false);
        $payload['sort_order'] = (int) ($payload['sort_order'] ?? 0);

        $academyJourneyPoint->update($payload);

        return to_route('admin.academy-journey-points.index')->with('success', 'تم تحديث نقطة الرحلة بنجاح.');
    }

    public function destroy(AcademyJourneyPoint $academyJourneyPoint): RedirectResponse
    {
        $academyJourneyPoint->delete();

        return to_route('admin.academy-journey-points.index')->with('success', 'تم حذف نقطة الرحلة بنجاح.');
    }
}
