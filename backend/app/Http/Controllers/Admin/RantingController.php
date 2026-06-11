<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ranting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RantingController extends Controller
{
    public function index(Request $request)
    {
        $query = Ranting::query();

        if ($request->filled('search')) {
            $search = '%' . Str::lower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(nama) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(alamat) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(ketua) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(kontak) LIKE ?', [$search]);
            });
        }

        $perPage = in_array($request->integer('per_page', 10), [10, 20, 50], true) ? $request->integer('per_page', 10) : 10;
        
        $ranting = $query->orderBy('nama')->paginate($perPage)->withQueryString();

        return Inertia::render('admin/Ranting/Index', [
            'ranting' => $ranting,
            'filters' => [
                'page' => max(1, (int) $request->integer('page', 1)),
                'per_page' => $perPage,
                'search' => trim((string) $request->query('search', '')),
            ]
        ]);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'ketua' => 'nullable|string|max:255',
            'kontak' => 'nullable|string|max:255',
        ]);

        Ranting::create($validated);

        return back()->with('success', 'Ranting berhasil dibuat.');
    }



    public function update(Request $request, Ranting $ranting)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'ketua' => 'nullable|string|max:255',
            'kontak' => 'nullable|string|max:255',
        ]);

        $ranting->update($validated);

        return back()->with('success', 'Ranting berhasil diperbarui.');
    }

    public function destroy(Ranting $ranting)
    {
        $ranting->delete();
        return back()->with('success', 'Ranting berhasil dihapus.');
    }
}
