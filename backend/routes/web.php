<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('public.home');
});

Route::get('/publik', function () {
    return view('public.home', [
        'organizationProfile' => [
            'name' => 'PSHT Cabang Kabupaten Tangerang',
            'eyebrow' => 'Persaudaraan Setia Hati Terate',
            'headline' => 'Membangun persaudaraan, kedisiplinan, dan budi luhur.',
            'description' => 'Website public resmi untuk menampilkan profil organisasi, berita, jadwal latihan, galeri, dan kontak PSHT Cabang Kabupaten Tangerang.',
            'address' => 'Kabupaten Tangerang, Banten',
            'email' => 'info@pshtkabtangerang.or.id',
            'phone' => '+62 812-0000-0000',
        ],
        'stats' => [
            ['label' => 'Ranting', 'value' => '29+'],
            ['label' => 'Rayon', 'value' => '120+'],
            ['label' => 'Warga Terdata', 'value' => '3.500+'],
            ['label' => 'Kegiatan Tahunan', 'value' => '40+'],
        ],
        'news' => [
            [
                'category' => 'Kegiatan',
                'date' => '12 Mei 2026',
                'title' => 'Konsolidasi Pengurus Cabang dan Ranting',
                'excerpt' => 'Koordinasi cabang dan ranting diarahkan agar informasi kegiatan tersampaikan lebih rapi kepada warga dan siswa.',
            ],
            [
                'category' => 'Latihan',
                'date' => '8 Mei 2026',
                'title' => 'Pembinaan Latihan Rutin Rayon',
                'excerpt' => 'Pembinaan latihan menjaga kedisiplinan, teknik dasar, dan nilai persaudaraan.',
            ],
            [
                'category' => 'Pengumuman',
                'date' => '4 Mei 2026',
                'title' => 'Validasi Data Warga Organisasi',
                'excerpt' => 'Informasi awal agenda pendataan dan validasi data warga pada tingkat ranting dan rayon.',
            ],
        ],
        'schedules' => [
            ['day' => 'Selasa', 'place' => 'Ranting Balaraja', 'time' => '19.30 WIB'],
            ['day' => 'Kamis', 'place' => 'Ranting Cikupa', 'time' => '19.30 WIB'],
            ['day' => 'Minggu', 'place' => 'Latihan Gabungan Cabang', 'time' => '07.00 WIB'],
        ],
        'gallery' => [
            'Latihan Bersama',
            'Kegiatan Cabang',
            'Pembinaan Rayon',
            'Silaturahmi Warga',
        ],
    ]);
})->name('public.home');

// Admin Authentication
Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [LoginController::class, 'login']);
Route::post('/admin/logout', [LoginController::class, 'logout'])->name('admin.logout');

// Admin Panel (Protected by Auth)
Route::prefix('admin')->middleware(['auth'])->group(function () {
    
    // Dashboard (Accessible by all roles)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Superadmin Only
    Route::middleware('role:superadmin')->group(function () {
        Route::resource('/pengguna', \App\Http\Controllers\Admin\PenggunaController::class)->names('admin.pengguna');
        Route::resource('/popup-informasi', \App\Http\Controllers\Admin\PopupInformasiController::class)->names('admin.popup-informasi');
    });

    // Admin + Superadmin Only
    Route::middleware('role:admin,superadmin')->group(function () {
        Route::resource('/ranting', \App\Http\Controllers\Admin\RantingController::class)->names('admin.ranting');
        Route::resource('/profil-organisasi', \App\Http\Controllers\Admin\ProfilOrganisasiController::class)->names('admin.profil-organisasi');
        Route::resource('/struktur-organisasi', \App\Http\Controllers\Admin\StrukturOrganisasiController::class)->names('admin.struktur-organisasi');
        Route::resource('/pesan-kontak', \App\Http\Controllers\Admin\PesanKontakController::class)->names('admin.pesan-kontak');
    });

    // All Roles (Penulis, Admin, Superadmin)
    // Note: In Controller, we can restrict writers (penulis) to only edit/delete their own articles/galeri.
    Route::resource('/berita', \App\Http\Controllers\Admin\BeritaController::class)->names('admin.berita');
    Route::resource('/galeri', \App\Http\Controllers\Admin\GaleriController::class)->names('admin.galeri');
    Route::resource('/jadwal-latihan', \App\Http\Controllers\Admin\JadwalLatihanController::class)->names('admin.jadwal-latihan');
    Route::resource('/keanggotaan', \App\Http\Controllers\Admin\KeanggotaanController::class)->names('admin.keanggotaan');
});
