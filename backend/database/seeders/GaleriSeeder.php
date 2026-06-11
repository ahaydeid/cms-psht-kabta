<?php

namespace Database\Seeders;

use App\Models\Galeri;
use App\Models\User;
use Illuminate\Database\Seeder;

class GaleriSeeder extends Seeder
{
    public function run(): void
    {
        $userAhadi  = User::where('username', 'ahadi')->first();
        $userRusdu  = User::where('username', 'rusdu')->first();
        $userAhmad  = User::where('username', 'admin')->first();

        // Fallback ke user pertama jika belum ada
        $fallback = User::first();

        $penulisAhadi = $userAhadi ?? $fallback;
        $penulisRusdu = $userRusdu ?? $fallback;
        $penulisAhmad = $userAhmad ?? $fallback;

        Galeri::firstOrCreate(
            ['judul' => 'Dokumentasi Latihan Rutin Ranting Tigaraksa'],
            [
                'judul'      => 'Dokumentasi Latihan Rutin Ranting Tigaraksa',
                'keterangan' => 'Momen-momen latihan rutin warga PSHT Ranting Tigaraksa dalam rangka persiapan pengesahan dan peningkatan kualitas silat.',
                'status'     => 'active',
                'penulis_id' => $penulisAhadi->id,
                'file_path'  => [
                    '/storage/galeri/galeri-latihan-01.jpg',
                    '/storage/galeri/galeri-latihan-02.jpg',
                    '/storage/galeri/galeri-latihan-03.jpg',
                ],
            ]
        );

        Galeri::firstOrCreate(
            ['judul' => 'Kegiatan Bakti Sosial PSHT Kabupaten Tangerang'],
            [
                'judul'      => 'Kegiatan Bakti Sosial PSHT Kabupaten Tangerang',
                'keterangan' => 'Dokumentasi kegiatan bakti sosial yang dilaksanakan oleh warga PSHT Cabang Kabupaten Tangerang di lingkungan sekitar ranting.',
                'status'     => 'active',
                'penulis_id' => $penulisRusdu->id,
                'file_path'  => [
                    '/storage/galeri/galeri-kegiatan-01.jpg',
                    '/storage/galeri/galeri-kegiatan-02.jpg',
                    '/storage/galeri/galeri-kegiatan-03.jpg',
                ],
            ]
        );

        Galeri::firstOrCreate(
            ['judul' => 'Kejuaraan Pencak Silat Tingkat Banten'],
            [
                'judul'      => 'Kejuaraan Pencak Silat Tingkat Banten',
                'keterangan' => 'Foto-foto dokumentasi keikutsertaan warga PSHT Kabupaten Tangerang dalam Kejuaraan Pencak Silat Tingkat Provinsi Banten yang berlangsung di Kota Serang.',
                'status'     => 'active',
                'penulis_id' => $penulisAhmad->id,
                'file_path'  => [
                    '/storage/galeri/galeri-prestasi-01.jpg',
                    '/storage/galeri/galeri-prestasi-02.jpg',
                    '/storage/galeri/galeri-prestasi-03.jpg',
                ],
            ]
        );
    }
}
