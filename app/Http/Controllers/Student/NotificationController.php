<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = Notification::query()
            ->where('user_id', $request->user()->id)
            ->latest('created_at')
            ->get()
            ->map(fn (Notification $notification) => [
                'id' => $notification->id,
                'title' => $notification->title,
                'message' => $notification->message,
                'type' => $notification->type,
                'is_read' => $notification->is_read,
                'created_at' => $notification->created_at?->toIso8601String(),
                'created_at_label' => $notification->created_at?->translatedFormat('d M Y - h:i A'),
            ])
            ->values()
            ->all();

        return Inertia::render('Student/Notifications', [
            'notificationsPage' => [
                'items' => $notifications,
                'unread_count' => collect($notifications)->where('is_read', false)->count(),
            ],
        ]);
    }

    public function markAllRead(Request $request): RedirectResponse
    {
        Notification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return back()->with('success', 'تم تعليم جميع الإشعارات كمقروءة.');
    }

    public function markRead(Request $request, Notification $notification): RedirectResponse
    {
        abort_unless((int) $notification->user_id === (int) $request->user()->id, 404);

        if (! $notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        return back()->with('success', 'تم تحديث حالة الإشعار.');
    }
}
