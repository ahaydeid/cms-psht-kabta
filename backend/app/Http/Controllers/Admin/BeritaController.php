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
        return Inertia::render('admin/Berita/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'kategori' => 'required|string',
            'status' => 'required|string|in:draft,published',
            'gambar' => 'nullable|string',
        ]);

        $validated['slug'] = \Illuminate\Support\Str::slug($validated['judul']) . '-' . time();
        $validated['penulis_id'] = auth()->id();

        Artikel::create($validated);

        return redirect()->route('admin.berita.index')->with('success', 'Berita berhasil dibuat.');
    }

    public function edit(Artikel $beritum)
    {
        return Inertia::render('admin/Berita/Edit', [
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
            'gambar' => 'nullable|string',
        ]);

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
}
