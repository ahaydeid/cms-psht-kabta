<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nama', 'jabatan', 'foto', 'urutan'])]
class StrukturOrganisasi extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }
}
