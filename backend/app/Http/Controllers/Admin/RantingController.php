<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ranting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RantingController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Ranting/Index', [
            'ranting' => Ranting::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Ranting/Create');
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

        return redirect()->route('admin.ranting.index')->with('success', 'Ranting berhasil dibuat.');
    }

    public function edit(Ranting $ranting)
    {
        return Inertia::render('admin/Ranting/Edit', [
            'ranting' => $ranting
        ]);
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

        return redirect()->route('admin.ranting.index')->with('success', 'Ranting berhasil diperbarui.');
    }

    public function destroy(Ranting $ranting)
    {
        $ranting->delete();
        return redirect()->route('admin.ranting.index')->with('success', 'Ranting berhasil dihapus.');
    }
}
