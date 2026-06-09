<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Berita/Index', [
            'berita' => Artikel::with('penulis')->latest()->get()
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
            'gambar' => 'nullable',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = '/storage/' . $path;
        } else if (is_string($request->input('gambar'))) {
            $validated['gambar'] = $request->input('gambar');
        } else {
            $validated['gambar'] = $beritum->gambar;
        }

        if ($beritum->judul !== $validated['judul']) {
            $validated['slug'] = \Illuminate\Support\Str::slug($validated['judul']) . '-' . time();
        }

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
