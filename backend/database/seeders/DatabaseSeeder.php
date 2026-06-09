<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed multi-role users
        User::factory()->create([
            'name' => 'Superadmin PSHT',
            'email' => 'superadmin@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'role' => 'superadmin',
        ]);

        User::factory()->create([
            'name' => 'Admin PSHT',
            'email' => 'admin@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Penulis Konten',
            'email' => 'penulis@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'role' => 'penulis',
        ]);

        // Seed default organization profile
        \App\Models\ProfilOrganisasi::setValue('name', 'PSHT Kabta');
        \App\Models\ProfilOrganisasi::setValue('eyebrow', 'Persaudaraan Setia Hati Terate');
        \App\Models\ProfilOrganisasi::setValue('headline', 'Membangun persaudaraan, kedisiplinan, dan budi luhur.');
        \App\Models\ProfilOrganisasi::setValue('description', 'Website profil resmi untuk menampilkan informasi organisasi, kegiatan, berita, dan layanan publik PSHT Cabang Kabupaten Tangerang.');
        \App\Models\ProfilOrganisasi::setValue('logo', '/img/logo-psht.webp');
        \App\Models\ProfilOrganisasi::setValue('address', 'Kabupaten Tangerang, Banten');
        \App\Models\ProfilOrganisasi::setValue('email', 'info@pshtkabtangerang.or.id');
        \App\Models\ProfilOrganisasi::setValue('phone', '+62 812-0000-0000');

        // Seed Rantings
        $ranting1 = \App\Models\Ranting::create([
            'nama' => 'Tigaraksa',
            'alamat' => 'Tigaraksa, Tangerang',
            'ketua' => 'Ki Hajar',
            'kontak' => '081234567890',
        ]);

        $ranting2 = \App\Models\Ranting::create([
            'nama' => 'Cikupa',
            'alamat' => 'Cikupa, Tangerang',
            'ketua' => 'Ki Sukowati',
            'kontak' => '081234567891',
        ]);

        $ranting3 = \App\Models\Ranting::create([
            'nama' => 'Balaraja',
            'alamat' => 'Balaraja, Tangerang',
            'ketua' => 'Ki Mangun',
            'kontak' => '081234567892',
        ]);

        // Seed some Keanggotaan (Warga)
        \App\Models\Keanggotaan::create([
            'ranting_id' => $ranting1->id,
            'citizenship' => 'WNI',
            'identity_type' => 'KTP/KK',
            'identity_number' => '3603010203040001',
            'member_number' => 'NIW-2015-001',
            'name' => 'Ahmad Suhardi',
            'birth_place' => 'Tangerang',
            'birth_date' => '1995-04-12',
            'gender' => 'Laki-laki',
            'religion' => 'Islam',
            'address' => 'Jl. Pemda No. 12, Tigaraksa',
            'occupation' => 'Karyawan Swasta',
            'phone' => '81299990001',
            'legalized_at' => '2015-08-20',
            'legalization_place' => 'Cabang Kabupaten Tangerang',
            'status' => 'active',
        ]);

        \App\Models\Keanggotaan::create([
            'ranting_id' => $ranting2->id,
            'citizenship' => 'WNI',
            'identity_type' => 'KTP/KK',
            'identity_number' => '3603010203040002',
            'member_number' => 'NIW-2016-005',
            'name' => 'Budi Santoso',
            'birth_place' => 'Tangerang',
            'birth_date' => '1996-08-24',
            'gender' => 'Laki-laki',
            'religion' => 'Islam',
            'address' => 'Kawasan Industri Cikupa Mas',
            'occupation' => 'Wiraswasta',
            'phone' => '81299990002',
            'legalized_at' => '2016-08-18',
            'legalization_place' => 'Cabang Kabupaten Tangerang',
            'status' => 'active',
        ]);

        \App\Models\Keanggotaan::create([
            'ranting_id' => $ranting3->id,
            'citizenship' => 'WNI',
            'identity_type' => 'KTP/KK',
            'identity_number' => '3603010203040003',
            'member_number' => 'NIW-2017-012',
            'name' => 'Dewi Lestari',
            'birth_place' => 'Tangerang',
            'birth_date' => '1997-11-05',
            'gender' => 'Perempuan',
            'religion' => 'Islam',
            'address' => 'Perumahan Balaraja Elok',
            'occupation' => 'Guru',
            'phone' => '81299990003',
            'legalized_at' => '2017-08-15',
            'legalization_place' => 'Cabang Kabupaten Tangerang',
            'status' => 'active',
        ]);
    }
}
