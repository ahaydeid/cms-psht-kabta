<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'keterangan',
        'tanggal',
        'waktu_mulai',
        'waktu_selesai',
        'kategori',
        'tipe_hari',
        'status',
    ];

    protected $casts = [
        'tanggal' => 'date:Y-m-d',
    ];
}
