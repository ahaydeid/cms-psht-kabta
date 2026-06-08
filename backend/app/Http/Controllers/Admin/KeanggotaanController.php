<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keanggotaan;
use App\Models\Ranting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KeanggotaanController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/Warga/Index', [
            'anggota' => Keanggotaan::with('ranting')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Warga/Create', [
            'rantings' => Ranting::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkatan' => 'required|string',
            'ranting_id' => 'nullable|exists:rantings,id',
            'foto' => 'nullable|string',
        ]);

        Keanggotaan::create($validated);

        return redirect()->route('admin.warga.index')->with('success', 'Anggota berhasil ditambahkan.');
    }

    public function edit(Keanggotaan $keanggotaan)
    {
        return Inertia::render('admin/Warga/Edit', [
            'anggota' => $keanggotaan,
            'rantings' => Ranting::all()
        ]);
    }

    public function update(Request $request, Keanggotaan $keanggotaan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tingkatan' => 'required|string',
            'ranting_id' => 'nullable|exists:rantings,id',
            'foto' => 'nullable|string',
        ]);

        $keanggotaan->update($validated);

        return redirect()->route('admin.warga.index')->with('success', 'Anggota berhasil diperbarui.');
    }

    public function destroy(Keanggotaan $keanggotaan)
    {
        $keanggotaan->delete();
        return redirect()->route('admin.warga.index')->with('success', 'Anggota berhasil dihapus.');
    }
}
