<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesanKontak;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesanKontakController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/PesanKontak/Index', [
            'pesans' => PesanKontak::latest()->get()
        ]);
    }

    public function show(PesanKontak $pesanKontak)
    {
        $pesanKontak->update(['is_read' => true]);

        return Inertia::render('admin/PesanKontak/Show', [
            'pesan' => $pesanKontak
        ]);
    }

    public function destroy(PesanKontak $pesanKontak)
    {
        $pesanKontak->delete();

        return redirect()->route('admin.pesan-kontak.index')->with('success', 'Pesan berhasil dihapus.');
    }
}
