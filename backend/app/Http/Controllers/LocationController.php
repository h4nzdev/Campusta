<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get list of campus locations.
     */
    public function index(): JsonResponse
    {
        $locations = Location::orderBy('building')->orderBy('room')->get()->map(function ($loc) {
            return [
                'id' => $loc->id,
                'code' => $loc->code,
                'building' => $loc->building,
                'floor' => $loc->floor,
                'room' => $loc->room,
                'name' => $loc->name,
                'qrCode' => $loc->qr_code,
            ];
        });

        return response()->json($locations);
    }

    /**
     * Look up location by QR Code.
     */
    public function showByQr(string $qrCode): JsonResponse
    {
        $loc = Location::where('qr_code', $qrCode)
            ->orWhere('code', $qrCode)
            ->firstOrFail();

        return response()->json([
            'id' => $loc->id,
            'code' => $loc->code,
            'building' => $loc->building,
            'floor' => $loc->floor,
            'room' => $loc->room,
            'name' => $loc->name,
            'qrCode' => $loc->qr_code,
        ]);
    }

    /**
     * Create a new campus location and generate its unique QR code.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'building' => 'required|string|max:255',
            'floor' => 'required|string|max:255',
            'room' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'code' => 'nullable|string',
            'qrCode' => 'nullable|string',
            'qr_code' => 'nullable|string',
        ]);

        $buildingSlug = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $request->building), 0, 4));
        $roomSlug = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $request->room));

        // Generate location code
        $code = $request->code ?: "USPF-{$buildingSlug}-{$roomSlug}";
        $baseCode = $code;
        $counter = 1;
        while (Location::where('code', $code)->exists()) {
            $code = "{$baseCode}-{$counter}";
            $counter++;
        }

        // Generate QR code identifier
        $qrInput = $request->qr_code ?: $request->qrCode;
        $qrCode = $qrInput ?: "QR-{$buildingSlug}-{$roomSlug}";
        $baseQr = $qrCode;
        $qrCounter = 1;
        while (Location::where('qr_code', $qrCode)->exists()) {
            $qrCode = "{$baseQr}-{$qrCounter}";
            $qrCounter++;
        }

        $loc = Location::create([
            'building' => $request->building,
            'floor' => $request->floor,
            'room' => $request->room,
            'name' => $request->name,
            'code' => $code,
            'qr_code' => $qrCode,
        ]);

        return response()->json([
            'id' => $loc->id,
            'code' => $loc->code,
            'building' => $loc->building,
            'floor' => $loc->floor,
            'room' => $loc->room,
            'name' => $loc->name,
            'qrCode' => $loc->qr_code,
        ], 201);
    }

    /**
     * Delete a location.
     */
    public function destroy(int $id): JsonResponse
    {
        $loc = Location::findOrFail($id);
        $loc->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }
}
