<?php

namespace Database\Seeders;

use App\Models\Artikel;
use App\Models\Keanggotaan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        // Cari atau buat keanggotaan + user Ahadi
        $rantingTigaraksa = \App\Models\Ranting::where('nama', 'Tigaraksa')->first();
        $rantingCikupa    = \App\Models\Ranting::where('nama', 'Cikupa')->first();
        $rantingBalaraja  = \App\Models\Ranting::where('nama', 'Balaraja')->first();

        $roleKontributor = \Spatie\Permission\Models\Role::where('name', 'kontributor')->first();

        // --- Ahadi ---
        $wargaAhadi = Keanggotaan::where('name', 'like', 'Ahadi')->first();
        if (!$wargaAhadi) {
            $wargaAhadi = Keanggotaan::create([
                'member_number'      => 'NIW-2018-021',
                'ranting_id'         => $rantingTigaraksa?->id,
                'citizenship'        => 'WNI',
                'identity_type'      => 'KTP/KK',
                'identity_number'    => '3603010203040021',
                'name'               => 'Ahadi',
                'birth_place'        => 'Tangerang',
                'birth_date'         => '1998-03-15',
                'gender'             => 'Laki-laki',
                'religion'           => 'Islam',
                'address'            => 'Jl. Raya Tigaraksa No. 5',
                'occupation'         => 'Mahasiswa',
                'phone'              => '81299990021',
                'legalized_at'       => '2018-08-17',
                'legalization_place' => 'Cabang Kabupaten Tangerang',
                'status'             => 'active',
            ]);
        }

        $userAhadi = User::where('username', 'ahadi')
            ->orWhere('name', 'like', 'Ahadi')
            ->orWhere('keanggotaan_id', $wargaAhadi->id)
            ->first();

        if (!$userAhadi) {
            $userAhadi = User::create([
                'name'           => 'Ahadi',
                'username'       => 'ahadi',
                'email'          => 'ahadi@pshtkabtangerang.or.id',
                'password'       => bcrypt('password'),
                'keanggotaan_id' => $wargaAhadi->id,
            ]);
        } else {
            $userAhadi->update([
                'keanggotaan_id' => $wargaAhadi->id,
                'email'          => $userAhadi->email ?: 'ahadi@pshtkabtangerang.or.id',
            ]);
        }

        if ($roleKontributor && !$userAhadi->hasRole('kontributor')) {
            $userAhadi->assignRole($roleKontributor);
        }

        // --- Rusdu ---
        $wargaRusdu = Keanggotaan::where('name', 'like', 'Rusdu')->first();
        if (!$wargaRusdu) {
            $wargaRusdu = Keanggotaan::create([
                'member_number'      => 'NIW-2019-033',
                'ranting_id'         => $rantingCikupa?->id,
                'citizenship'        => 'WNI',
                'identity_type'      => 'KTP/KK',
                'identity_number'    => '3603010203040033',
                'name'               => 'Rusdu',
                'birth_place'        => 'Tangerang',
                'birth_date'         => '1997-07-22',
                'gender'             => 'Laki-laki',
                'religion'           => 'Islam',
                'address'            => 'Jl. Cikupa Baru No. 8',
                'occupation'         => 'Pegawai Swasta',
                'phone'              => '81299990033',
                'legalized_at'       => '2019-08-17',
                'legalization_place' => 'Cabang Kabupaten Tangerang',
                'status'             => 'active',
            ]);
        }

        $userRusdu = User::where('username', 'rusdu')
            ->orWhere('name', 'like', 'Rusdu')
            ->orWhere('keanggotaan_id', $wargaRusdu->id)
            ->first();

        if (!$userRusdu) {
            $userRusdu = User::create([
                'name'           => 'Rusdu',
                'username'       => 'rusdu',
                'email'          => 'rusdu@pshtkabtangerang.or.id',
                'password'       => bcrypt('password'),
                'keanggotaan_id' => $wargaRusdu->id,
            ]);
        } else {
            $userRusdu->update([
                'keanggotaan_id' => $wargaRusdu->id,
                'email'          => $userRusdu->email ?: 'rusdu@pshtkabtangerang.or.id',
            ]);
        }

        if ($roleKontributor && !$userRusdu->hasRole('kontributor')) {
            $userRusdu->assignRole($roleKontributor);
        }

        // --- Ahmad Suhardi (sudah ada sebagai admin) ---
        $userAhmad = User::where('username', 'admin')->first();

        // --- 3 Berita ---
        Artikel::firstOrCreate(
            ['slug' => 'latihan-rutin-tigaraksa-sambut-hut-psht-ke-102'],
            [
                'judul'      => 'Latihan Rutin Ranting Tigaraksa Sambut HUT PSHT ke-102',
                'slug'       => 'latihan-rutin-tigaraksa-sambut-hut-psht-ke-102',
                'kategori'   => 'Kegiatan',
                'status'     => 'published',
                'penulis_id' => $userAhadi->id,
                'gambar'     => null,
                'isi'        => <<<HTML
<h2>Latihan Perdana Menyambut Hari Ulang Tahun</h2>
<p>Ranting Tigaraksa menggelar latihan rutin perdana bulan Juni dalam rangka menyambut Hari Ulang Tahun Persaudaraan Setia Hati Terate (PSHT) yang ke-102. Kegiatan yang berlangsung di Lapangan Desa Tigaraksa ini dihadiri oleh puluhan warga aktif dari berbagai kelompok usia.</p>
<h3>Semangat Persaudaraan</h3>
<p>Ketua Ranting Tigaraksa menyampaikan bahwa latihan ini bukan sekadar kegiatan fisik, melainkan juga ajang mempererat tali persaudaraan antar warga. <strong>Persaudaraan adalah pondasi utama dalam PSHT,</strong> dan kegiatan rutin seperti ini menjadi wadah untuk menghidupkan nilai tersebut.</p>
<blockquote>
<p>"Kami berharap semangat latihan ini tidak hanya hadir di bulan HUT, tetapi terus terjaga sepanjang tahun." — Ketua Ranting Tigaraksa</p>
</blockquote>
<p>Latihan dilaksanakan setiap Selasa dan Sabtu malam, pukul 20.00 WIB hingga selesai. Seluruh warga aktif diharapkan hadir dan menjaga konsistensi latihan.</p>
HTML,
            ]
        );

        Artikel::firstOrCreate(
            ['slug' => 'musyawarah-ranting-cikupa-evaluasi-program-semester'],
            [
                'judul'      => 'Musyawarah Ranting Cikupa: Evaluasi Program Semester Pertama',
                'slug'       => 'musyawarah-ranting-cikupa-evaluasi-program-semester',
                'kategori'   => 'Organisasi',
                'status'     => 'published',
                'penulis_id' => $userRusdu->id,
                'gambar'     => null,
                'isi'        => <<<HTML
<h2>Evaluasi Program Kerja Semester I</h2>
<p>Ranting Cikupa mengadakan musyawarah internal untuk mengevaluasi pelaksanaan program kerja semester pertama tahun 2025. Musyawarah berlangsung di Sekretariat Ranting Cikupa dan dihadiri oleh seluruh pengurus serta perwakilan warga.</p>
<h3>Poin-poin Evaluasi</h3>
<ul>
<li>Tingkat kehadiran latihan rutin meningkat 15% dibanding semester sebelumnya.</li>
<li>Program sosial donor darah berhasil mengumpulkan 42 kantong darah.</li>
<li>Kegiatan bakti sosial dilaksanakan 2 kali dan mendapat respons positif dari masyarakat sekitar.</li>
</ul>
<h3>Rencana Semester II</h3>
<p>Untuk semester kedua, Ranting Cikupa merencanakan peningkatan kualitas pelatih melalui program pendampingan senior kepada warga baru. Selain itu, akan diadakan turnamen persahabatan antar ranting di wilayah Kabupaten Tangerang.</p>
<p>Musyawarah ditutup dengan doa bersama dan makan malam yang meriah sebagai bentuk keakraban antar anggota.</p>
HTML,
            ]
        );

        Artikel::firstOrCreate(
            ['slug' => 'warga-psht-raih-prestasi-kejuaraan-pencak-silat-banten'],
            [
                'judul'      => 'Warga PSHT Kabta Raih Prestasi di Kejuaraan Pencak Silat Tingkat Banten',
                'slug'       => 'warga-psht-raih-prestasi-kejuaraan-pencak-silat-banten',
                'kategori'   => 'Prestasi',
                'status'     => 'published',
                'penulis_id' => $userAhmad?->id ?? $userAhadi->id,
                'gambar'     => null,
                'isi'        => <<<HTML
<h2>Kebanggaan PSHT Kabupaten Tangerang</h2>
<p>Sebanyak 7 warga PSHT Cabang Kabupaten Tangerang berhasil meraih medali dalam Kejuaraan Pencak Silat Tingkat Provinsi Banten yang digelar di Serang. Prestasi ini merupakan buah dari latihan yang konsisten dan dedikasi tinggi para warga.</p>
<h3>Daftar Peraih Medali</h3>
<table class="my-4 w-full border-collapse text-sm">
<tbody>
<tr>
<td class="border border-zinc-300 px-3 py-2 align-top"><strong>Nama</strong></td>
<td class="border border-zinc-300 px-3 py-2 align-top"><strong>Kategori</strong></td>
<td class="border border-zinc-300 px-3 py-2 align-top"><strong>Medali</strong></td>
</tr>
<tr>
<td class="border border-zinc-300 px-3 py-2 align-top">Deni Pratama</td>
<td class="border border-zinc-300 px-3 py-2 align-top">Kelas C Putra</td>
<td class="border border-zinc-300 px-3 py-2 align-top">🥇 Emas</td>
</tr>
<tr>
<td class="border border-zinc-300 px-3 py-2 align-top">Siti Rahayu</td>
<td class="border border-zinc-300 px-3 py-2 align-top">Kelas B Putri</td>
<td class="border border-zinc-300 px-3 py-2 align-top">🥈 Perak</td>
</tr>
<tr>
<td class="border border-zinc-300 px-3 py-2 align-top">Riko Ardiansyah</td>
<td class="border border-zinc-300 px-3 py-2 align-top">Kelas D Putra</td>
<td class="border border-zinc-300 px-3 py-2 align-top">🥉 Perunggu</td>
</tr>
</tbody>
</table>
<h3>Pesan dari Ketua Cabang</h3>
<blockquote>
<p>"Prestasi ini adalah cerminan dari kerja keras seluruh warga dan pembina. Kami berharap dapat terus meningkatkan kualitas atlet untuk kejuaraan yang lebih tinggi." — Ketua Cabang PSHT Kabupaten Tangerang</p>
</blockquote>
<p>Selamat kepada seluruh peraih medali! Semoga menjadi inspirasi bagi warga lainnya untuk terus berprestasi.</p>
HTML,
            ]
        );

        // --- 2 Draft Berita ---
        Artikel::firstOrCreate(
            ['slug' => 'rencana-ujian-kenaikan-tingkat-sabuk-hijau'],
            [
                'judul'      => 'Rencana Ujian Kenaikan Tingkat Sabuk Hijau Ranting Tigaraksa',
                'slug'       => 'rencana-ujian-kenaikan-tingkat-sabuk-hijau',
                'kategori'   => 'Kegiatan',
                'status'     => 'draft',
                'penulis_id' => $userAhadi->id,
                'gambar'     => null,
                'isi'        => <<<HTML
<h2>Persiapan Ujian Kenaikan Tingkat (UKT)</h2>
<p>Ini adalah draf artikel mengenai rencana pelaksanaan Ujian Kenaikan Tingkat dari sabuk merah muda ke sabuk hijau yang akan diadakan di Ranting Tigaraksa pada akhir bulan depan. Jadwal dan lokasi detail masih dalam tahap koordinasi dengan dewan pelatih cabang.</p>
HTML,
            ]
        );

        Artikel::firstOrCreate(
            ['slug' => 'persiapan-turnamen-internal-psht-kabta-cup-2026'],
            [
                'judul'      => 'Persiapan Turnamen Internal PSHT Kabta Cup 2026',
                'slug'       => 'persiapan-turnamen-internal-psht-kabta-cup-2026',
                'kategori'   => 'Prestasi',
                'status'     => 'draft',
                'penulis_id' => $userRusdu->id,
                'gambar'     => null,
                'isi'        => <<<HTML
<h2>Turnamen Silat Antar Ranting</h2>
<p>Draf ini membahas persiapan kepanitiaan turnamen silat internal Kabupaten Tangerang yang direncanakan bergulir pada pertengahan tahun 2026. Fokus utama saat ini adalah penyusunan proposal sponsorship dan peminjaman gelanggang olahraga.</p>
HTML,
            ]
        );
    }
}
