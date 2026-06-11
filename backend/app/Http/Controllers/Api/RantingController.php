<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ranting;
use Illuminate\Http\Request;

class RantingController extends Controller
{
    public function index(Request $request)
    {
        $query = Ranting::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('nama', 'like', "%{$search}%");
        }

        // Urutkan berdasarkan nama agar rapi
        $query->orderBy('nama', 'asc');

        $perPage = $request->input('per_page', 10);
        $ranting = $query->paginate($perPage);

        return response()->json($ranting);
    }
}
