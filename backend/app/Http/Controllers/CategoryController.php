<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get list of issue categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::all()->map(function ($cat) {
            return [
                'id' => $cat->id,
                'name' => $cat->name,
                'description' => $cat->description,
                'department' => $cat->department,
            ];
        });

        return response()->json($categories);
    }
}
