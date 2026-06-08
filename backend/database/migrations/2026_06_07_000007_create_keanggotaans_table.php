<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('keanggotaans', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('tingkatan'); // e.g. Polos, Jambon, Hijau, Putih, Warga
            $table->foreignId('ranting_id')->nullable()->constrained('rantings')->onDelete('set null');
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('keanggotaans');
    }
};
