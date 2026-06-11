<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isSuperadmin = $user->hasRole('superadmin');
        $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;

        $query = Artikel::with(['penulis.keanggotaan.ranting']);

        if (!$isSuperadmin && $adminRantingId) {
            $query->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                $q->where('ranting_id', $adminRantingId);
            });
        }

        if ($request->filled('search')) {
            $search = '%' . Str::lower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(judul) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(kategori) LIKE ?', [$search])
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
        
        $berita = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('admin/Berita/Index', [
            'berita' => $berita,
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
        return Inertia::render('admin/Berita/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'kategori' => 'required|string',
            'status' => 'required|string|in:draft,published',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = '/storage/' . $path;
        } else {
            $validated['gambar'] = null;
        }

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['judul']) . '-' . time();
        $validated['penulis_id'] = auth()->id();

        Artikel::create($validated);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil dibuat.');
    }

    public function edit(Artikel $beritum)
    {
        return Inertia::render('admin/Berita/Form', [
            'berita' => $beritum
        ]);
    }

    public function update(Request $request, Artikel $beritum)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'kategori' => 'required|string',
            'status' => 'required|string|in:draft,published',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'gambar_existing' => 'nullable|string',
        ]);

        if ($request->hasFile('gambar')) {
            // delete old if exists
            if ($beritum->gambar) {
                $oldPath = str_replace('/storage/', '', $beritum->gambar);
                \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = '/storage/' . $path;
        } elseif ($request->filled('gambar_existing')) {
            // keep existing image path
            $validated['gambar'] = $request->input('gambar_existing');
        } else {
            // explicitly removed
            $validated['gambar'] = null;
        }

        if ($beritum->judul !== $validated['judul']) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['judul']) . '-' . time();
        }

        unset($validated['gambar_existing']);
        $beritum->update($validated);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Artikel $beritum)
    {
        $beritum->delete();
        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil dihapus.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('berita', 'public');
            return response()->json([
                'url' => '/storage/' . $path,
            ]);
        }

        return response()->json(['error' => 'No image uploaded'], 400);
    }
}
