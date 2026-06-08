<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama', 'alamat', 'ketua', 'kontak'])]
class Ranting extends Model
{
    use HasFactory;

    public function anggota(): HasMany
    {
        return $this->hasMany(Keanggotaan::class, 'ranting_id');
    }
}
