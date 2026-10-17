<?php

namespace App\Http\Controllers;

use App\Models\Tickets;
use Illuminate\Http\Request;

class TicketsController extends Controller
{
    public function index()
    {
        return Tickets::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'reporter_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
            'category_name' => 'required|string',
            'description' => 'required|string',
            'priority' => 'required|string',
            'status' => 'required|string',
        ]);

        $ticket = new Tickets();
        $ticket->reporter_id = $request->reporter_id;
        $ticket->location_id = $request->location_id;
        $ticket->category_name = $request->category_name;
        $ticket->description = $request->description;
        $ticket->priority = $request->priority;
        $ticket->status = $request->status;
        $ticket->assigned_personnel_id = $request->assigned_personnel_id;
        $ticket->photo_url = $request->photo_url;
        $ticket->work_notes = $request->work_notes;
        $ticket->completion_photo_url = $request->completion_photo_url;
        $ticket->save();

        return response()->json($ticket, 201);
    }

    public function show($id)
    {
        $ticket = Tickets::find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        return response()->json($ticket);
    }

    public function update(Request $request, $id)
    {
        $ticket = Tickets::find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $request->validate([
            'reporter_id' => 'sometimes|required|exists:users,id',
            'location_id' => 'sometimes|required|exists:locations,id',
            'category_name' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'priority' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
        ]);

        $ticket->update($request->all());
        return response()->json($ticket);
    }

    public function destroy($id)
    {
        $ticket = Tickets::find($id);

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found'], 404);
        }

        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
