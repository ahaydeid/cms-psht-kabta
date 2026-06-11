<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;

class GaleriController extends Controller
{
    public function index(Request $request)
    {
        $query = Galeri::with([
            'penulis:id,name,keanggotaan_id',
            'penulis.keanggotaan:id,ranting_id',
            'penulis.keanggotaan.ranting:id,nama'
        ])->where('status', 'active');

        $perPage = $request->input('per_page', 12);
        $galeri = $query->latest()->paginate($perPage);

        return response()->json($galeri);
    }
}
