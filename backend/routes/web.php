<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('admin.dashboard');
});

// Admin Authentication (Guest only)
Route::prefix('admin')->middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [LoginController::class, 'login']);
});

// Admin Panel (Authenticated only)
Route::prefix('admin')->middleware(['auth'])->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('admin.logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::resource('/kontributor', \App\Http\Controllers\Admin\KontributorController::class)->names('admin.kontributor');
    
    Route::patch('/akun/{akun}/status', [\App\Http\Controllers\Admin\AkunController::class, 'updateStatus'])->name('admin.akun.status');
    Route::post('/akun/{akun}/reset-password', [\App\Http\Controllers\Admin\AkunController::class, 'resetPassword'])->name('admin.akun.reset-password');
    Route::resource('/akun', \App\Http\Controllers\Admin\AkunController::class)->names('admin.akun');
    Route::resource('/popup-informasi', \App\Http\Controllers\Admin\PopupInformasiController::class)->names('admin.popup-informasi');

    Route::resource('/ranting', \App\Http\Controllers\Admin\RantingController::class)->names('admin.ranting');
    Route::resource('/profil-organisasi', \App\Http\Controllers\Admin\ProfilOrganisasiController::class)->names('admin.profil-organisasi');
    Route::resource('/struktur-organisasi', \App\Http\Controllers\Admin\StrukturOrganisasiController::class)->names('admin.struktur-organisasi');
    Route::resource('/pesan', \App\Http\Controllers\Admin\PesanController::class)->only(['index', 'update', 'destroy'])->names('admin.pesan');

    Route::post('/berita/upload-image', [\App\Http\Controllers\Admin\BeritaController::class, 'uploadImage'])->name('admin.berita.upload-image');
    Route::resource('/berita', \App\Http\Controllers\Admin\BeritaController::class)->names('admin.berita');
    Route::resource('/galeri', \App\Http\Controllers\Admin\GaleriController::class)->names('admin.galeri');
    Route::resource('/agenda', \App\Http\Controllers\Admin\AgendaController::class)->names('admin.agenda');
    
    Route::get('/draft', [\App\Http\Controllers\Admin\DraftController::class, 'index'])->name('admin.draft.index');
    Route::post('/draft/{type}/{id}/publish', [\App\Http\Controllers\Admin\DraftController::class, 'publish'])->name('admin.draft.publish');
    Route::delete('/draft/{type}/{id}', [\App\Http\Controllers\Admin\DraftController::class, 'destroy'])->name('admin.draft.destroy');
    
    Route::resource('/jadwal-latihan', \App\Http\Controllers\Admin\JadwalLatihanController::class)->names('admin.jadwal-latihan');
    Route::resource('/warga', \App\Http\Controllers\Admin\KeanggotaanController::class)->names('admin.warga');
});
