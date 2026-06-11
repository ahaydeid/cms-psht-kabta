<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('name');
            $table->string('email')->nullable()->change();
        });

        // Populate existing usernames based on email prefix or random string
        $users = \App\Models\User::all();
        foreach ($users as $user) {
            $baseUsername = explode('@', $user->email)[0] ?? 'admin';
            $user->username = $baseUsername . '_' . rand(100, 999);
            $user->save();
        }

        // Now make it not nullable if you want, but nullable is fine for unique string
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->string('email')->nullable(false)->change();
        });
    }
};
