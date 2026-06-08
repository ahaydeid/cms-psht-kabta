<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StrukturOrganisasiController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/StrukturOrganisasi/Index', [
            'struktur' => StrukturOrganisasi::orderBy('urutan')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/StrukturOrganisasi/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'foto' => 'nullable|string',
            'urutan' => 'required|integer',
        ]);

        StrukturOrganisasi::create($validated);

        return redirect()->route('admin.struktur-organisasi.index')->with('success', 'Anggota struktur berhasil ditambahkan.');
    }

    public function edit(StrukturOrganisasi $strukturOrganisasi)
    {
        return Inertia::render('admin/StrukturOrganisasi/Edit', [
            'struktur' => $strukturOrganisasi
        ]);
    }

    public function update(Request $request, StrukturOrganisasi $strukturOrganisasi)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'foto' => 'nullable|string',
            'urutan' => 'required|integer',
        ]);

        $strukturOrganisasi->update($validated);

        return redirect()->route('admin.struktur-organisasi.index')->with('success', 'Anggota struktur berhasil diperbarui.');
    }

    public function destroy(StrukturOrganisasi $strukturOrganisasi)
    {
        $strukturOrganisasi->delete();
        return redirect()->route('admin.struktur-organisasi.index')->with('success', 'Anggota struktur berhasil dihapus.');
    }
}
