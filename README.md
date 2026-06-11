# CMS PSHT Kabta

## Aturan Pengembangan & Seeding Database (PENTING)

> [!IMPORTANT]
> **ATURAN TEGAS SEEDING DATABASE:**
> 1. **Jangan Pernah Menggunakan Reset Global / `migrate:fresh`:** Dilarang keras menjalankan perintah reset database global seperti `php artisan migrate:fresh` atau sejenisnya pada environment aktif karena akan menghancurkan data dinamis yang telah dimasukkan oleh user secara manual.
> 2. **Wajib Seeding Terisolasi/Lokal**: Jika perlu melakukan seeding atau pembaruan data seeder untuk komponen tertentu, jalankan perintah seeding secara terisolasi spesifik pada kelas seeder tujuan saja.
>    * Contoh: `php artisan db:seed --class=JadwalLatihanSeeder`
> 3. **Gunakan `firstOrCreate` / `updateOrCreate`**: Di dalam file seeder, selalu gunakan method `firstOrCreate` atau `updateOrCreate` alih-alih `create` langsung untuk mencegah error duplikasi data (seperti `RoleAlreadyExists`) ketika seeder dijalankan berulang kali.
