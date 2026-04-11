<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNotificationRequest;
use App\Http\Requests\UpdateNotificationRequest;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $items = Notification::orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('admin/notifications/index', ['notifications' => $items]);
    }

    public function create()
    {
        return Inertia::render('admin/notifications/create');
    }

    public function store(StoreNotificationRequest $request): RedirectResponse
    {
        Notification::create($request->validated());

        return redirect()->route('admin.notifications.index')->with('success', 'Notification created');
    }

    public function edit(Notification $notification)
    {
        return Inertia::render('admin/notifications/edit', ['notification' => $notification]);
    }

    public function update(UpdateNotificationRequest $request, Notification $notification): RedirectResponse
    {
        $notification->update($request->validated());

        return redirect()->route('admin.notifications.index')->with('success', 'Notification updated');
    }

    public function destroy(Notification $notification): RedirectResponse
    {
        $notification->delete();

        return redirect()->route('admin.notifications.index')->with('success', 'Notification deleted');
    }
}
