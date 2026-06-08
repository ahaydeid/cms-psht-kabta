<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JadwalLatihan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalLatihanController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/JadwalLatihan/Index', [
            'jadwals' => JadwalLatihan::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/JadwalLatihan/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hari' => 'required|string|max:255',
            'tempat' => 'required|string|max:255',
            'waktu' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        JadwalLatihan::create($validated);

        return redirect()->route('admin.jadwal-latihan.index')->with('success', 'Jadwal latihan berhasil dibuat.');
    }

    public function edit(JadwalLatihan $jadwalLatihan)
    {
        return Inertia::render('admin/JadwalLatihan/Edit', [
            'jadwal' => $jadwalLatihan
        ]);
    }

    public function update(Request $request, JadwalLatihan $jadwalLatihan)
    {
        $validated = $request->validate([
            'hari' => 'required|string|max:255',
            'tempat' => 'required|string|max:255',
            'waktu' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $jadwalLatihan->update($validated);

        return redirect()->route('admin.jadwal-latihan.index')->with('success', 'Jadwal latihan berhasil diperbarui.');
    }

    public function destroy(JadwalLatihan $jadwalLatihan)
    {
        $jadwalLatihan->delete();
        return redirect()->route('admin.jadwal-latihan.index')->with('success', 'Jadwal latihan berhasil dihapus.');
    }
}
