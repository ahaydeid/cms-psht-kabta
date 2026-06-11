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
            'jadwals' => JadwalLatihan::orderBy('tempat')->orderBy('hari')->get(),
            'rantings' => \App\Models\Ranting::orderBy('nama')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jadwals' => 'required|array',
            'jadwals.*.id' => 'nullable|integer',
            'jadwals.*.hari' => 'required|string|max:255',
            'jadwals.*.tempat' => 'required|string|max:255',
            'jadwals.*.waktu' => 'nullable|string|max:255',
            'jadwals.*.alamat' => 'nullable|string',
            'jadwals.*.kontak' => 'nullable|string|max:255',
            'jadwals.*.latitude' => 'nullable|numeric',
            'jadwals.*.longitude' => 'nullable|numeric',
            'jadwals.*.keterangan' => 'nullable|string',
            'jadwals.*.is_active' => 'required|boolean',
        ]);

        $jadwalsInput = $request->input('jadwals');

        foreach ($jadwalsInput as $j) {
            $isActive = $j['is_active'];
            $id = $j['id'] ?? null;

            if (!$isActive) {
                if ($id) {
                    JadwalLatihan::destroy($id);
                }
            } else {
                $data = [
                    'hari' => $j['hari'],
                    'tempat' => $j['tempat'],
                    'waktu' => $j['waktu'] ?: '-',
                    'alamat' => $j['alamat'] ?? null,
                    'kontak' => $j['kontak'] ?? null,
                    'latitude' => $j['latitude'] ?? null,
                    'longitude' => $j['longitude'] ?? null,
                    'keterangan' => $j['keterangan'] ?? null,
                    'is_active' => true,
                ];

                if ($id) {
                    $jadwal = JadwalLatihan::find($id);
                    if ($jadwal) {
                        $jadwal->update($data);
                    }
                } else {
                    JadwalLatihan::create($data);
                }
            }
        }

        return redirect()->route('admin.jadwal-latihan.index')->with('success', 'Jadwal latihan berhasil disimpan.');
    }

    public function destroy(JadwalLatihan $jadwalLatihan)
    {
        JadwalLatihan::where('tempat', $jadwalLatihan->tempat)->delete();
        return redirect()->route('admin.jadwal-latihan.index')->with('success', 'Jadwal latihan tempat tersebut berhasil dihapus.');
    }
}
