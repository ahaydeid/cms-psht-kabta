<?php

namespace Database\Seeders;

use App\Models\Agenda;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AgendaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;

        $agendas = [
            [
                'judul' => 'Latihan Gabungan Cabang',
                'keterangan' => 'Latihan bersama seluruh ranting se-Kabupaten Tangerang di Padepokan Cabang.',
                'tanggal' => Carbon::create($year, $month, 5)->format('Y-m-d'),
                'waktu_mulai' => '08:00:00',
                'waktu_selesai' => '12:00:00',
                'kategori' => 'Semua',
                'tipe_hari' => 'KEGIATAN',
                'status' => 'active',
            ],
            [
                'judul' => 'Rapat Pleno Pengurus Ranting',
                'keterangan' => 'Koordinasi bulanan agenda latihan dan administrasi keanggotaan.',
                'tanggal' => Carbon::create($year, $month, 12)->format('Y-m-d'),
                'waktu_mulai' => '19:30:00',
                'waktu_selesai' => '22:00:00',
                'kategori' => 'Pengurus',
                'tipe_hari' => 'PENTING',
                'status' => 'active',
            ],
            [
                'judul' => 'Ujian Kenaikan Sabuk (Hijau ke Putih)',
                'keterangan' => 'Ujian fisik, teknik, dan ke-SH-an bagi calon sabuk putih.',
                'tanggal' => Carbon::create($year, $month, 17)->format('Y-m-d'),
                'waktu_mulai' => '07:30:00',
                'waktu_selesai' => '13:00:00',
                'kategori' => 'Semua',
                'tipe_hari' => 'KEGIATAN',
                'status' => 'active',
            ],
            [
                'judul' => 'Syukuran Warga Baru',
                'keterangan' => 'Acara doa bersama dan syukuran warga baru angkatan tahun ini.',
                'tanggal' => Carbon::create($year, $month, 25)->format('Y-m-d'),
                'waktu_mulai' => '20:00:00',
                'waktu_selesai' => '23:00:00',
                'kategori' => 'Semua',
                'tipe_hari' => 'PENTING',
                'status' => 'active',
            ],
            [
                'judul' => 'Libur Nasional',
                'keterangan' => 'Tidak ada jadwal latihan di semua tempat latihan.',
                'tanggal' => Carbon::create($year, $month, 28)->format('Y-m-d'),
                'waktu_mulai' => '00:00:00',
                'waktu_selesai' => '23:59:00',
                'kategori' => 'Semua',
                'tipe_hari' => 'LIBUR',
                'status' => 'active',
            ],
        ];

        foreach ($agendas as $agenda) {
            Agenda::create($agenda);
        }
    }
}
