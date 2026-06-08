<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value'])]
class ProfilOrganisasi extends Model
{
    use HasFactory;

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $record = self::where('key', $key)->first();
        return $record ? $record->value : $default;
    }

    public static function setValue(string $key, mixed $value): self
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
