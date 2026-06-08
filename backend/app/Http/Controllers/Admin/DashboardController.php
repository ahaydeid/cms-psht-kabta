<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Galeri;
use App\Models\JadwalLatihan;
use App\Models\Keanggotaan;
use App\Models\PesanKontak;
use App\Models\Ranting;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'artikels_count' => Artikel::count(),
            'galeris_count' => Galeri::count(),
            'jadwals_count' => JadwalLatihan::count(),
            'rantings_count' => Ranting::count(),
            'anggota_count' => Keanggotaan::count(),
            'pesan_unread_count' => PesanKontak::where('is_read', false)->count(),
        ];

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
