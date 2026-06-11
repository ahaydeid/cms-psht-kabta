<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isSuperadmin = $user->hasRole('superadmin');
        $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;

        $query = Galeri::with(['penulis.keanggotaan.ranting']);

        if (!$isSuperadmin && $adminRantingId) {
            $query->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                $q->where('ranting_id', $adminRantingId);
            });
        }

        if ($request->filled('search')) {
            $search = '%' . Str::lower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(judul) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(keterangan) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(status) LIKE ?', [$search])
                  ->orWhereHas('penulis', function ($q) use ($search) {
                      $q->whereRaw('LOWER(name) LIKE ?', [$search]);
                  });
            });
        }

        if ($isSuperadmin && $request->filled('ranting') && $request->ranting !== 'all') {
            $query->whereHas('penulis.keanggotaan', function ($q) use ($request) {
                $q->where('ranting_id', $request->ranting);
            });
        }

        $perPage = in_array($request->integer('per_page', 10), [10, 20, 50], true) ? $request->integer('per_page', 10) : 10;
        
        $galeri = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/Galeri/Index', [
            'galeri' => $galeri,
            'filters' => [
                'page' => max(1, (int) $request->integer('page', 1)),
                'per_page' => $perPage,
                'search' => trim((string) $request->query('search', '')),
                'ranting' => $request->filled('ranting') ? (string) $request->query('ranting') : '',
            ],
            'rantings' => \App\Models\Ranting::select('id', 'nama')->orderBy('nama')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Galeri/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        $uploadedPaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('galeri', 'public');
                $uploadedPaths[] = '/storage/' . $path;
            }
        }

        $galeri = new Galeri();
        $galeri->judul = $validated['judul'];
        $galeri->keterangan = $validated['keterangan'] ?? null;
        $galeri->status = $validated['status'];
        $galeri->file_path = $uploadedPaths;
        $galeri->penulis_id = auth()->id();
        $galeri->save();

        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil ditambahkan.');
    }

    public function edit(Galeri $galeri)
    {
        return Inertia::render('admin/Galeri/Form', [
            'galeri' => $galeri
        ]);
    }

    public function update(Request $request, Galeri $galeri)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'existing_images' => 'nullable|array',
        ]);

        $finalPaths = $validated['existing_images'] ?? [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('galeri', 'public');
                $finalPaths[] = '/storage/' . $path;
            }
        }

        $galeri->update([
            'judul' => $validated['judul'],
            'keterangan' => $validated['keterangan'] ?? null,
            'status' => $validated['status'],
            'file_path' => $finalPaths,
        ]);

        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        $galeri->delete();
        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil dihapus.');
    }
}
