<?php

namespace Database\Seeders;

use App\Models\JadwalLatihan;
use Illuminate\Database\Seeder;

class JadwalLatihanSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan data lama jika ada
        JadwalLatihan::truncate();

        // 1. Cabang (Senin, Rabu, Jumat) - 19:30 - 21:30
        $cabangDays = ['Senin', 'Rabu', 'Jumat'];
        foreach ($cabangDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Cabang',
                'alamat' => 'Jl. Raya PSHT No. 12, Kabupaten Tangerang, Banten',
                'kontak' => '0812-3456-7890',
                'hari' => $hari,
                'waktu' => '19:30 - 21:30',
                'latitude' => -6.1782,
                'longitude' => 106.6319,
                'is_active' => true,
            ]);
        }

        // 2. Ranting Balaraja (Selasa, Kamis) - 20:00 - 22:00
        $balarajaDays = ['Selasa', 'Kamis'];
        foreach ($balarajaDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Balaraja',
                'alamat' => 'Jl. Raya Balaraja Barat No. 8, Balaraja, Kabupaten Tangerang',
                'kontak' => '0812-1020-3344',
                'hari' => $hari,
                'waktu' => '20:00 - 22:00',
                'latitude' => -6.2476,
                'longitude' => 106.4477,
                'is_active' => true,
            ]);
        }

        // 3. Ranting Cikupa (Senin, Kamis) - 19:30 - 21:30
        $cikupaDays = ['Senin', 'Kamis'];
        foreach ($cikupaDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Cikupa',
                'alamat' => 'Jl. Citra Raya Utama Blok D, Cikupa, Kabupaten Tangerang',
                'kontak' => '0813-5580-1120',
                'hari' => $hari,
                'waktu' => '19:30 - 21:30',
                'latitude' => -6.2256,
                'longitude' => 106.5234,
                'is_active' => true,
            ]);
        }

        // 4. Ranting Curug (Rabu, Sabtu) - 19:30 - 21:30
        $curugDays = ['Rabu', 'Sabtu'];
        foreach ($curugDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Curug',
                'alamat' => 'Jl. Raya STPI Curug No. 21, Curug, Kabupaten Tangerang',
                'kontak' => '0821-7654-9001',
                'hari' => $hari,
                'waktu' => '19:30 - 21:30',
                'latitude' => -6.2547,
                'longitude' => 106.5677,
                'is_active' => true,
            ]);
        }

        // 5. Ranting Kresek (Selasa, Jumat) - 19:30 - 21:30
        $kresekDays = ['Selasa', 'Jumat'];
        foreach ($kresekDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Kresek',
                'alamat' => 'Jl. Raya Kresek No. 5, Kresek, Kabupaten Tangerang',
                'kontak' => '0812-7744-2201',
                'hari' => $hari,
                'waktu' => '19:30 - 21:30',
                'latitude' => -6.1313,
                'longitude' => 106.4511,
                'is_active' => true,
            ]);
        }

        // 6. Ranting Pasar Kemis (Senin, Jumat) - 20:00 - 22:00
        $pasarKemisDays = ['Senin', 'Jumat'];
        foreach ($pasarKemisDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Pasar Kemis',
                'alamat' => 'Jl. Raya Pasar Kemis No. 17, Pasar Kemis, Kabupaten Tangerang',
                'kontak' => '0813-7760-9912',
                'hari' => $hari,
                'waktu' => '20:00 - 22:00',
                'latitude' => -6.1769,
                'longitude' => 106.5799,
                'is_active' => true,
            ]);
        }

        // 7. Ranting Tigaraksa (Rabu, Minggu) - 19:30 - 21:30
        $tigaraksaDays = ['Rabu', 'Minggu'];
        foreach ($tigaraksaDays as $hari) {
            JadwalLatihan::create([
                'tempat' => 'Ranting Tigaraksa',
                'alamat' => 'Jl. Aria Wangsakara No. 10, Tigaraksa, Kabupaten Tangerang',
                'kontak' => '0812-9910-4002',
                'hari' => $hari,
                'waktu' => '19:30 - 21:30',
                'latitude' => -6.2248,
                'longitude' => 106.5086,
                'is_active' => true,
            ]);
        }
    }
}
