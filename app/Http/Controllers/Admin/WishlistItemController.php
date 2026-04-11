<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWishlistItemRequest;
use App\Http\Requests\UpdateWishlistItemRequest;
use App\Models\Course;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WishlistItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/wishlist-items/index', [
            'items' => WishlistItem::with(['student', 'course'])
                ->orderBy('created_at', 'desc')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (WishlistItem $i) => [
                    'id' => $i->id,
                    'student' => $i->student ? ['id' => $i->student->id, 'name' => $i->student->name] : null,
                    'course' => $i->course ? ['id' => $i->course->id, 'title' => $i->course->title] : null,
                    'created_at' => $i->created_at,
                ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/wishlist-items/create', [
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function store(StoreWishlistItemRequest $request): RedirectResponse
    {
        $payload = $request->validated();
        WishlistItem::create($payload);

        return to_route('admin.wishlist-items.index')->with('success', 'تمت إضافة العنصر إلى المفضلة بنجاح.');
    }

    public function edit(WishlistItem $wishlistItem): Response
    {
        return Inertia::render('admin/wishlist-items/edit', [
            'item' => [
                'id' => $wishlistItem->id,
                'student_id' => $wishlistItem->student_id,
                'course_id' => $wishlistItem->course_id,
            ],
            'students' => $this->students(),
            'courses' => $this->courses(),
        ]);
    }

    public function update(UpdateWishlistItemRequest $request, WishlistItem $wishlistItem): RedirectResponse
    {
        $payload = $request->validated();
        $wishlistItem->update($payload);

        return to_route('admin.wishlist-items.index')->with('success', 'تم تحديث عنصر المفضلة بنجاح.');
    }

    public function destroy(WishlistItem $wishlistItem): RedirectResponse
    {
        $wishlistItem->delete();

        return to_route('admin.wishlist-items.index')->with('success', 'تم حذف عنصر المفضلة بنجاح.');
    }

    private function students(): array
    {
        return User::query()
            ->where('role', 'student')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->toArray();
    }

    private function courses(): array
    {
        return Course::query()
            ->orderBy('title')
            ->get(['id', 'title'])
            ->toArray();
    }
}
