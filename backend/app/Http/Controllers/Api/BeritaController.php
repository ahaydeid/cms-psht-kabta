<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $query = Artikel::with('penulis:id,name')->where('status', 'published');

        if ($request->has('kategori') && $request->kategori !== 'Semua') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->has('search')) {
            $query->where('judul', 'like', '%' . $request->search . '%');
        }

        // Handle pagination
        $perPage = $request->input('per_page', 9);
        $articles = $query->latest()->paginate($perPage);

        return response()->json($articles);
    }

    public function show(string $slug)
    {
        $artikel = Artikel::with('penulis:id,name')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($artikel);
    }
}
