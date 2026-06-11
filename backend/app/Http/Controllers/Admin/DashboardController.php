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

        // Tren publikasi media 6 buffer terakhir
        $mediaTrend = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthLabel = $date->format('M');
            $month = $date->month;
            $year = $date->year;

            $artikelCount = Artikel::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();
            $galeriCount = Galeri::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();

            $mediaTrend->push([
                'label' => $monthLabel,
                'value' => $artikelCount + $galeriCount,
            ]);
        }

        // Data komposisi warga tiap ranting
        $rantingWarga = Ranting::withCount('anggota')
            ->orderByDesc('anggota_count')
            ->get()
            ->map(function ($ranting) {
                return [
                    'name' => $ranting->nama,
                    'value' => $ranting->anggota_count,
                ];
            });

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
            'mediaTrend' => $mediaTrend->toArray(),
            'rantingWarga' => $rantingWarga->toArray(),
        ]);
    }
}
