<?php

namespace App\Http\Controllers;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Enums\UserRole;
use App\Models\Location;
use App\Models\Notification;
use App\Models\Ticket;
use App\Models\TicketHistory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    /**
     * Format a Ticket model instance to the standard JSON API response structure.
     */
    private function formatTicket(Ticket $ticket): array
    {
        $location = $ticket->location;
        $reporter = $ticket->reporter;
        $personnel = $ticket->assignedPersonnel;

        // Build absolute or relative photo URLs
        $photoUrl = $ticket->photo_url;
        if ($photoUrl && !str_starts_with($photoUrl, 'http') && !str_starts_with($photoUrl, 'data:')) {
            $photoUrl = url($photoUrl);
        }

        $completionPhotoUrl = $ticket->completion_photo_url;
        if ($completionPhotoUrl && !str_starts_with($completionPhotoUrl, 'http') && !str_starts_with($completionPhotoUrl, 'data:')) {
            $completionPhotoUrl = url($completionPhotoUrl);
        }

        return [
            'id' => 'TK-' . (1000 + $ticket->id),
            'rawId' => $ticket->id,
            'reporterId' => (string) $ticket->reporter_id,
            'reporterName' => $reporter?->name ?? 'Anonymous',
            'reporterRole' => $reporter?->role instanceof UserRole ? $reporter->role->value : ($reporter?->role ?? 'student'),
            'locationCode' => $location?->code ?? 'UNKNOWN',
            'locationName' => $location?->name ?? '',
            'building' => $location?->building ?? '',
            'floor' => $location?->floor ?? '',
            'room' => $location?->room ?? '',
            'categoryName' => $ticket->category_name,
            'description' => $ticket->description,
            'priority' => $ticket->priority instanceof TicketPriority ? $ticket->priority->value : $ticket->priority,
            'status' => $ticket->status instanceof TicketStatus ? $ticket->status->value : $ticket->status,
            'assignedPersonnelId' => $ticket->assigned_personnel_id ? (string) $ticket->assigned_personnel_id : null,
            'assignedPersonnelName' => $personnel?->name,
            'createdAt' => $ticket->created_at->toISOString(),
            'updatedAt' => $ticket->updated_at->toISOString(),
            'photoUrl' => $photoUrl,
            'workNotes' => $ticket->work_notes ?? '',
            'completionPhotoUrl' => $completionPhotoUrl,
            'history' => $ticket->history->map(function ($h) {
                return [
                    'status' => $h->status,
                    'note' => $h->note,
                    'timestamp' => $h->timestamp ? Carbon::parse($h->timestamp)->toISOString() : Carbon::now()->toISOString(),
                ];
            })->values()->toArray(),
        ];
    }

    /**
     * Helper to decode and store base64 image strings.
     */
    private function storeBase64Image(string $base64String, string $folder): ?string
    {
        if (empty($base64String)) {
            return null;
        }

        // If it is already a remote URL, return as-is
        if (str_starts_with($base64String, 'http://') || str_starts_with($base64String, 'https://')) {
            return $base64String;
        }

        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif, webp

            $data = base64_decode($data);
            if ($data === false) {
                return null;
            }

            $fileName = $folder . '/' . uniqid() . '.' . $type;
            Storage::disk('public')->put($fileName, $data);

            return Storage::url($fileName);
        }

        return null;
    }

    /**
     * Display a listing of tickets based on user role and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history']);

        $userRole = $user->role instanceof UserRole ? $user->role->value : $user->role;

        // Role-based scoping
        if ($userRole === 'student' || $userRole === 'faculty') {
            $query->where('reporter_id', $user->id);
        } elseif ($userRole === 'maintenance') {
            $query->where('assigned_personnel_id', $user->id);
        }

        // Optional filters for admin / dashboard
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get()->map(function ($ticket) {
            return $this->formatTicket($ticket);
        });

        return response()->json($tickets);
    }

    /**
     * Store a newly created ticket.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'location_code' => 'required_without:locationCode|string',
            'locationCode' => 'nullable|string',
            'category_name' => 'required_without:categoryName|string',
            'categoryName' => 'nullable|string',
            'description' => 'required|string|min:5',
            'photoUrl' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        $locCode = $request->input('location_code') ?? $request->input('locationCode');
        $catName = $request->input('category_name') ?? $request->input('categoryName');
        $photoData = $request->input('photoUrl') ?? $request->input('photo');

        $location = Location::where('code', $locCode)->first();
        if (!$location) {
            // Auto-create or fallback location if not found
            $location = Location::firstOrCreate(
                ['code' => $locCode],
                ['building' => 'Main Campus', 'floor' => '1st Floor', 'room' => $locCode, 'name' => $locCode, 'qr_code' => 'QR-' . $locCode]
            );
        }

        $user = $request->user();
        $storedPhotoUrl = $photoData ? $this->storeBase64Image($photoData, 'tickets') : null;

        $ticket = Ticket::create([
            'reporter_id' => $user->id,
            'location_id' => $location->id,
            'category_name' => $catName,
            'description' => $request->description,
            'priority' => TicketPriority::MEDIUM,
            'status' => TicketStatus::PENDING,
            'photo_url' => $storedPhotoUrl ?? $photoData,
        ]);

        // Create initial history log
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'status' => TicketStatus::PENDING->value,
            'note' => 'Ticket created by ' . $user->name,
            'timestamp' => Carbon::now(),
        ]);

        // Send notification to Administrators
        $admins = User::where('role', UserRole::ADMIN->value)->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title' => 'New Ticket Submitted',
                'message' => "A new ticket (TK-" . (1000 + $ticket->id) . ") was filed for {$location->code} regarding {$ticket->category_name}.",
                'read' => false,
            ]);
        }

        return response()->json($this->formatTicket($ticket->fresh(['reporter', 'location', 'assignedPersonnel', 'history'])), 201);
    }

    /**
     * Display the specified ticket.
     */
    public function show(string $id): JsonResponse
    {
        $rawId = str_starts_with($id, 'TK-') ? (int) substr($id, 3) - 1000 : (int) $id;
        $ticket = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history'])->findOrFail($rawId);

        return response()->json($this->formatTicket($ticket));
    }

    /**
     * Update ticket for Maintenance Personnel (Start Work, Resolve).
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $rawId = str_starts_with($id, 'TK-') ? (int) substr($id, 3) - 1000 : (int) $id;
        $ticket = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history'])->findOrFail($rawId);
        $user = $request->user();

        $request->validate([
            'status' => 'required|string',
            'work_notes' => 'nullable|string',
            'workNotes' => 'nullable|string',
            'completion_photo' => 'nullable|string',
            'completionPhotoUrl' => 'nullable|string',
            'history_note' => 'nullable|string',
            'historyNote' => 'nullable|string',
        ]);

        $status = $request->input('status');
        $workNotes = $request->input('work_notes') ?? $request->input('workNotes');
        $completionPhoto = $request->input('completion_photo') ?? $request->input('completionPhotoUrl');
        $historyNote = $request->input('history_note') ?? $request->input('historyNote');

        if ($completionPhoto) {
            $storedUrl = $this->storeBase64Image($completionPhoto, 'resolutions');
            $ticket->completion_photo_url = $storedUrl ?? $completionPhoto;
        }

        $ticket->status = $status;
        if ($workNotes !== null) {
            $ticket->work_notes = $workNotes;
        }
        $ticket->save();

        // Add history log
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'status' => $ticket->status instanceof TicketStatus ? $ticket->status->value : $ticket->status,
            'note' => $historyNote ?? ($user->name . ' updated status to ' . $status),
            'timestamp' => Carbon::now(),
        ]);

        // Notify reporter on resolution
        if ($status === TicketStatus::RESOLVED->value && $ticket->reporter_id) {
            Notification::create([
                'user_id' => $ticket->reporter_id,
                'title' => 'Ticket Resolved',
                'message' => "Your report TK-" . (1000 + $ticket->id) . " has been marked as resolved by {$user->name}. Please verify the resolution.",
                'read' => false,
            ]);
        }

        return response()->json($this->formatTicket($ticket->fresh(['reporter', 'location', 'assignedPersonnel', 'history'])));
    }

    /**
     * Reporter verification: Confirm & Close, or Reopen.
     */
    public function verifyResolution(Request $request, string $id): JsonResponse
    {
        $rawId = str_starts_with($id, 'TK-') ? (int) substr($id, 3) - 1000 : (int) $id;
        $ticket = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history'])->findOrFail($rawId);
        $user = $request->user();

        $request->validate([
            'action' => 'required|in:confirm,reopen',
            'reason' => 'nullable|string',
            'historyNote' => 'nullable|string',
        ]);

        $action = $request->input('action');
        $reason = $request->input('reason');
        $historyNote = $request->input('historyNote');

        if ($action === 'confirm') {
            $ticket->status = TicketStatus::CLOSED;
            $ticket->save();

            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'status' => TicketStatus::CLOSED->value,
                'note' => $historyNote ?? ("Reporter {$user->name} confirmed the resolution and closed the ticket."),
                'timestamp' => Carbon::now(),
            ]);

            // Notify assigned technician
            if ($ticket->assigned_personnel_id) {
                Notification::create([
                    'user_id' => $ticket->assigned_personnel_id,
                    'title' => 'Ticket Closed',
                    'message' => "Ticket TK-" . (1000 + $ticket->id) . " has been confirmed and closed by the reporter.",
                    'read' => false,
                ]);
            }
        } else {
            // Reopen ticket -> reset to Assigned
            $ticket->status = TicketStatus::ASSIGNED;
            $ticket->work_notes = null;
            $ticket->completion_photo_url = null;
            $ticket->save();

            TicketHistory::create([
                'ticket_id' => $ticket->id,
                'status' => TicketStatus::ASSIGNED->value,
                'note' => $historyNote ?? ("Reporter {$user->name} reopened the ticket. Reason: \"" . ($reason ?? 'Not fixed') . "\""),
                'timestamp' => Carbon::now(),
            ]);

            // Notify assigned technician
            if ($ticket->assigned_personnel_id) {
                Notification::create([
                    'user_id' => $ticket->assigned_personnel_id,
                    'title' => 'Ticket Reopened',
                    'message' => "Ticket TK-" . (1000 + $ticket->id) . " was reopened by {$user->name}: " . ($reason ?? 'Needs attention'),
                    'read' => false,
                ]);
            }
        }

        return response()->json($this->formatTicket($ticket->fresh(['reporter', 'location', 'assignedPersonnel', 'history'])));
    }

    /**
     * Full update for Administrator (Set priority, assign staff, verify & close).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $rawId = str_starts_with($id, 'TK-') ? (int) substr($id, 3) - 1000 : (int) $id;
        $ticket = Ticket::with(['reporter', 'location', 'assignedPersonnel', 'history'])->findOrFail($rawId);
        $user = $request->user();

        $oldPersonnelId = $ticket->assigned_personnel_id;

        if ($request->has('priority')) {
            $ticket->priority = $request->priority;
        }

        if ($request->has('assigned_personnel_id') || $request->has('assignedPersonnelId')) {
            $personnelId = $request->input('assigned_personnel_id') ?? $request->input('assignedPersonnelId');
            $ticket->assigned_personnel_id = $personnelId ?: null;

            // If it was Pending and now assigned, transition to Assigned
            $statusVal = $ticket->status instanceof TicketStatus ? $ticket->status->value : $ticket->status;
            if ($statusVal === TicketStatus::PENDING->value && $personnelId) {
                $ticket->status = TicketStatus::ASSIGNED;
            }
        }

        if ($request->has('status')) {
            $ticket->status = $request->status;
        }

        if ($request->has('work_notes') || $request->has('workNotes')) {
            $ticket->work_notes = $request->input('work_notes') ?? $request->input('workNotes');
        }

        $ticket->save();

        // Write history log
        $historyNote = $request->input('history_note') ?? $request->input('historyNote') ?? ('Ticket updated by Administrator ' . $user->name);
        TicketHistory::create([
            'ticket_id' => $ticket->id,
            'status' => $ticket->status instanceof TicketStatus ? $ticket->status->value : $ticket->status,
            'note' => $historyNote,
            'timestamp' => Carbon::now(),
        ]);

        // Dispatch notification if assigned personnel changed
        if ($ticket->assigned_personnel_id && $ticket->assigned_personnel_id !== $oldPersonnelId) {
            Notification::create([
                'user_id' => $ticket->assigned_personnel_id,
                'title' => 'New Task Assigned',
                'message' => "You have been assigned to maintenance ticket TK-" . (1000 + $ticket->id) . ".",
                'read' => false,
            ]);
        }

        return response()->json($this->formatTicket($ticket->fresh(['reporter', 'location', 'assignedPersonnel', 'history'])));
    }

    /**
     * Provide statistics and 7-day progression analytics for the dashboard.
     */
    public function stats(): JsonResponse
    {
        $allTickets = Ticket::with(['history'])->get();

        $totalCount = $allTickets->count();
        $pendingCount = $allTickets->where('status', TicketStatus::PENDING)->count();
        $activeCount = $allTickets->whereIn('status', [TicketStatus::ASSIGNED, TicketStatus::IN_PROGRESS])->count();
        $resolvedCount = $allTickets->where('status', TicketStatus::RESOLVED)->count();
        $closedCount = $allTickets->where('status', TicketStatus::CLOSED)->count();

        // 7-day progression for Recharts
        $progressionData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayKey = $date->toDateString();
            $dateLabel = $date->format('M j');

            $filed = $allTickets->filter(function ($t) use ($dayKey) {
                return $t->created_at->toDateString() === $dayKey;
            })->count();

            $resolved = $allTickets->filter(function ($t) use ($dayKey) {
                return $t->history->contains(function ($h) use ($dayKey) {
                    return $h->status === TicketStatus::RESOLVED->value &&
                        Carbon::parse($h->timestamp)->toDateString() === $dayKey;
                });
            })->count();

            $progressionData[] = [
                'name' => $dateLabel,
                'Filed' => $filed,
                'Resolved' => $resolved,
            ];
        }

        return response()->json([
            'totalCount' => $totalCount,
            'pendingCount' => $pendingCount,
            'activeCount' => $activeCount,
            'resolvedCount' => $resolvedCount,
            'closedCount' => $closedCount,
            'progressionData' => $progressionData,
        ]);
    }
}
