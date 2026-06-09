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

// Admin Panel (Bypassed auth/role middlewares for frontend development)
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::resource('/kontributor', \App\Http\Controllers\Admin\KontributorController::class)->names('admin.kontributor');
    Route::resource('/pengguna', \App\Http\Controllers\Admin\PenggunaController::class)->names('admin.pengguna');
    Route::resource('/popup-informasi', \App\Http\Controllers\Admin\PopupInformasiController::class)->names('admin.popup-informasi');

    Route::resource('/ranting', \App\Http\Controllers\Admin\RantingController::class)->names('admin.ranting');
    Route::resource('/profil-organisasi', \App\Http\Controllers\Admin\ProfilOrganisasiController::class)->names('admin.profil-organisasi');
    Route::resource('/struktur-organisasi', \App\Http\Controllers\Admin\StrukturOrganisasiController::class)->names('admin.struktur-organisasi');
    Route::resource('/pesan-kontak', \App\Http\Controllers\Admin\PesanKontakController::class)->names('admin.pesan-kontak');

    Route::post('/berita/upload-image', [\App\Http\Controllers\Admin\BeritaController::class, 'uploadImage'])->name('admin.berita.upload-image');
    Route::resource('/berita', \App\Http\Controllers\Admin\BeritaController::class)->names('admin.berita');
    Route::resource('/galeri', \App\Http\Controllers\Admin\GaleriController::class)->names('admin.galeri');
    Route::resource('/jadwal-latihan', \App\Http\Controllers\Admin\JadwalLatihanController::class)->names('admin.jadwal-latihan');
    Route::resource('/warga', \App\Http\Controllers\Admin\KeanggotaanController::class)->names('admin.warga');
});
