<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Admin Authentication
Route::get('/admin/login', [LoginController::class, 'showLoginForm'])->name('admin.login');
Route::post('/admin/login', [LoginController::class, 'login']);
Route::post('/admin/logout', [LoginController::class, 'logout'])->name('admin.logout');

// Admin Panel - Public for frontend development preview
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
});

// Admin Panel (Protected by Auth)
Route::prefix('admin')->middleware(['auth'])->group(function () {

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
