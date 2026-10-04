<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get notifications for authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notif) {
                return [
                    'id' => (string) $notif->id,
                    'userId' => (string) $notif->user_id,
                    'title' => $notif->title,
                    'message' => $notif->message,
                    'read' => (bool) $notif->read,
                    'timestamp' => $notif->created_at->toISOString(),
                ];
            });

        return response()->json($notifications);
    }

    /**
     * Mark all notifications as read for authenticated user.
     */
    public function markAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)->update(['read' => true]);

        return response()->json(['message' => 'Notifications marked as read']);
    }
}
