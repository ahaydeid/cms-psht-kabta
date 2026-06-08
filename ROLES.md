# Aturan Peran & Akses CMS PSHT Kabta

Dokumen ini mendefinisikan struktur peran (role) dan aturan akses pada sistem CMS PSHT Kabang Kabupaten Tangerang.

---

## Hierarki Peran

```
Superadmin (Cabang)
    └── Admin (Cabang / Ranting)
            └── Kontributor (Ranting / Rayon / Sub-Rayon)
```

---

## Definisi Peran

### 1. Superadmin
- Hanya ada **1 Superadmin**, bertempat di tingkat **Cabang**.
- Memiliki akses penuh ke seluruh fitur sistem, termasuk:
  - Manajemen semua pengguna (Admin & Kontributor)
  - Manajemen seluruh konten (Berita, Galeri, Popup, dll.)
  - Pengaturan profil organisasi
  - Melihat semua pesan kontak

### 2. Admin
- Merupakan **pengurus organisasi**, baik di tingkat **Cabang** maupun **Ranting**.
- **Cabang** dapat memiliki **lebih dari 1 Admin**.
- Setiap **Ranting** hanya boleh memiliki **tepat 1 Admin**.
- Memiliki akses ke:
  - Manajemen konten (Berita, Galeri, Jadwal, Ranting, Struktur Organisasi, Keanggotaan)
  - Melihat dan mengelola pesan kontak
  - Melihat dan mengelola profil organisasi
  - **Tidak** dapat mengelola data pengguna (hanya Superadmin)

### 3. Kontributor
- Berada di bawah Admin.
- Setiap **Ranting** dapat memiliki **lebih dari 1 Kontributor**.
- Pengurus tingkat **Rayon** dan **Sub-Rayon** dikategorikan sebagai **Kontributor dari Ranting** terkait.
- Memiliki akses terbatas, yaitu:
  - Membuat dan mengedit konten **milik sendiri** (Blog/Berita & Galeri)
  - **Tidak** dapat menghapus konten milik pengguna lain
  - **Tidak** dapat mengakses manajemen pengguna, ranting, struktur, dll.

---

## Ringkasan Matriks Akses

| Fitur                    | Kontributor | Admin | Superadmin |
|--------------------------|:-----------:|:-----:|:----------:|
| Buat Berita/Galeri       | ✅          | ✅    | ✅         |
| Edit Berita/Galeri Sendiri | ✅        | ✅    | ✅         |
| Edit Berita/Galeri Semua | ❌          | ✅    | ✅         |
| Hapus Berita/Galeri      | ❌          | ✅    | ✅         |
| Jadwal Latihan           | ❌          | ✅    | ✅         |
| Ranting                  | ❌          | ✅    | ✅         |
| Struktur Organisasi      | ❌          | ✅    | ✅         |
| Keanggotaan              | ❌          | ✅    | ✅         |
| Profil Organisasi        | ❌          | ✅    | ✅         |
| Pesan Kontak             | ❌          | ✅    | ✅         |
| Manajemen Pengguna       | ❌          | ❌    | ✅         |
| Popup Informasi          | ❌          | ❌    | ✅         |

---

## Catatan Implementasi

- Role disimpan sebagai string pada kolom `role` di tabel `users` dengan nilai: `superadmin`, `admin`, `kontributor`.
- Middleware `EnsureRole` digunakan untuk membatasi akses route berdasarkan role.
- Kepemilikan konten (ownership) diverifikasi di level Controller untuk memastikan Kontributor hanya bisa mengubah kontennya sendiri.
- Relasi Kontributor ke Ranting dikelola melalui kolom `ranting_id` pada tabel `users` (perlu ditambahkan jika belum ada).
