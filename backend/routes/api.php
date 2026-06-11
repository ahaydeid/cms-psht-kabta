<?php

use Illuminate\Support\Facades\Route;

// Public read-only API (v1)
Route::prefix('v1')->group(function () {
    Route::get('/berita', [\App\Http\Controllers\Api\BeritaController::class, 'index']);
    Route::get('/berita/{slug}', [\App\Http\Controllers\Api\BeritaController::class, 'show']);
    Route::get('/galeri', [\App\Http\Controllers\Api\GaleriController::class, 'index']);
    Route::get('/agenda', [\App\Http\Controllers\Api\AgendaController::class, 'index']);
    Route::get('/jadwal', [\App\Http\Controllers\Api\JadwalController::class, 'index']);
    Route::get('/profil', [\App\Http\Controllers\Api\ProfilController::class, 'show']);
    Route::get('/ranting', [\App\Http\Controllers\Api\RantingController::class, 'index']);
    Route::get('/struktur-organisasi', [\App\Http\Controllers\Api\StrukturOrganisasiController::class, 'index']);
    Route::get('/keanggotaan/cari', [\App\Http\Controllers\Api\KeanggotaanController::class, 'search']);
    Route::get('/keanggotaan/{id}', [\App\Http\Controllers\Api\KeanggotaanController::class, 'show']);
    Route::post('/kontak', [\App\Http\Controllers\Api\KontakController::class, 'store']);
    Route::get('/popup', [\App\Http\Controllers\Api\PopupController::class, 'show']);
});
