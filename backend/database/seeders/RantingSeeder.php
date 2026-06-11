<?php

namespace Database\Seeders;

use App\Models\Ranting;
use Illuminate\Database\Seeder;

class RantingSeeder extends Seeder
{
    public function run(): void
    {
        $rantings = [
            ['nama' => 'Tigaraksa', 'alamat' => 'Tigaraksa, Tangerang', 'ketua' => 'Mas Hajar', 'kontak' => '081234567890'],
            ['nama' => 'Cikupa', 'alamat' => 'Cikupa, Tangerang', 'ketua' => 'Mas Sukowati', 'kontak' => '081234567891'],
            ['nama' => 'Balaraja', 'alamat' => 'Balaraja, Tangerang', 'ketua' => 'Mas Mangun', 'kontak' => '081234567892'],
        ];

        foreach ($rantings as $data) {
            Ranting::updateOrCreate(
                ['nama' => $data['nama']],
                [
                    'alamat' => $data['alamat'],
                    'ketua' => $data['ketua'],
                    'kontak' => $data['kontak'],
                ]
            );
        }
    }
}
