<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jadwal_latihans', function (Blueprint $table) {
            $table->text('alamat')->nullable()->after('tempat');
            $table->string('kontak')->nullable()->after('alamat');
            $table->double('latitude')->nullable()->after('kontak');
            $table->double('longitude')->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('jadwal_latihans', function (Blueprint $table) {
            $table->dropColumn(['alamat', 'kontak', 'latitude', 'longitude']);
        });
    }
};
