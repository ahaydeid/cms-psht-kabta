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
