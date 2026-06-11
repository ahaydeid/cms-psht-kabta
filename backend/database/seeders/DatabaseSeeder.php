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
            'ketua' => 'Mas Hajar',
            'kontak' => '081234567890',
        ]);

        $ranting2 = \App\Models\Ranting::create([
            'nama' => 'Cikupa',
            'alamat' => 'Cikupa, Tangerang',
            'ketua' => 'Mas Sukowati',
            'kontak' => '081234567891',
        ]);

        $ranting3 = \App\Models\Ranting::create([
            'nama' => 'Balaraja',
            'alamat' => 'Balaraja, Tangerang',
            'ketua' => 'Mas Mangun',
            'kontak' => '081234567892',
        ]);

        // Seed some Keanggotaan (Warga)
        $warga1 = \App\Models\Keanggotaan::create([
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

        $warga2 = \App\Models\Keanggotaan::create([
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

        // Seed Roles
        $roleSuperadmin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'superadmin']);
        $roleAdmin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);
        $roleKontributor = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'kontributor']);
        $roleWarga = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'warga']);

        // Seed Users
        $superadmin = User::factory()->create([
            'name' => 'Superadmin PSHT',
            'username' => 'superadmin',
            'email' => 'superadmin@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'keanggotaan_id' => null, // Superadmin tidak perlu tertaut warga
        ]);
        $superadmin->assignRole($roleSuperadmin);

        $admin = User::factory()->create([
            'name' => $warga1->name,
            'username' => 'admin',
            'email' => 'admin@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'keanggotaan_id' => $warga1->id,
        ]);
        $admin->assignRole($roleAdmin);

        $kontributor = User::factory()->create([
            'name' => $warga2->name,
            'username' => 'kontributor',
            'email' => 'kontributor@pshtkabtangerang.or.id',
            'password' => bcrypt('password'),
            'keanggotaan_id' => $warga2->id,
        ]);
        $kontributor->assignRole($roleKontributor);

        // Seed default JadwalLatihan, Berita, dan Galeri menggunakan seeder terstandar
        $this->call([
            JadwalLatihanSeeder::class,
            BeritaSeeder::class,
            GaleriSeeder::class,
            AgendaSeeder::class,
        ]);
    }
}
