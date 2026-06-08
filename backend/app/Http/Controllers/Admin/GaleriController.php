<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Galeri/Index', [
            'galeri' => Galeri::with('penulis')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Galeri/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'file_path' => 'required|string',
            'keterangan' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $validated['penulis_id'] = auth()->id();

        Galeri::create($validated);

        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil ditambahkan.');
    }

    public function edit(Galeri $galeri)
    {
        return Inertia::render('admin/Galeri/Edit', [
            'galeri' => $galeri
        ]);
    }

    public function update(Request $request, Galeri $galeri)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'file_path' => 'required|string',
            'keterangan' => 'nullable|string',
            'status' => 'required|string|in:active,inactive',
        ]);

        $galeri->update($validated);

        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        $galeri->delete();
        return redirect()->route('admin.galeri.index')->with('success', 'Galeri berhasil dihapus.');
    }
}
