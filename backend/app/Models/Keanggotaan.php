<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'ranting_id',
    'citizenship',
    'identity_type',
    'identity_number',
    'member_number',
    'name',
    'birth_place',
    'birth_date',
    'gender',
    'religion',
    'address',
    'occupation',
    'phone',
    'legalized_at',
    'legalization_place',
    'status',
    'photo_path'
])]
class Keanggotaan extends Model
{
    use HasFactory;

    protected $casts = [
        'birth_date' => 'date',
        'legalized_at' => 'date',
    ];

    protected $appends = ['photo_url'];

    public function ranting(): BelongsTo
    {
        return $this->belongsTo(Ranting::class, 'ranting_id');
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return $this->photo_path ? \Illuminate\Support\Facades\Storage::disk('public')->url($this->photo_path) : null;
    }
}
