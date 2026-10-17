<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return Location::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|unique:locations,qr_code',
            'building' => 'required|string',
            'floor' => 'required|string',
            'room' => 'required|string'
        ]);

        $location = new Location();
        $location->qr_code = $request->qr_code;
        $location->building = $request->building;
        $location->floor = $request->floor;
        $location->room = $request->room;
        $location->save();

        return response()->json($location, 201);
    }

    public function showByQr($qrCode)
    {
        $location = Location::where('qr_code', $qrCode)->first();

        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Location not found'], 404);
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }
}
