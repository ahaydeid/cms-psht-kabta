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
    }
}
