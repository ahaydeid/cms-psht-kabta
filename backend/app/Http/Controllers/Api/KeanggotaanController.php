<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keanggotaan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KeanggotaanController extends Controller
{
    public function search(Request $request)
    {
        $niw = trim((string) $request->query('niw'));

        if (empty($niw)) {
            return response()->json([
                'message' => 'NIW tidak boleh kosong.'
            ], 400);
        }

        $normalizedNiw = Str::upper($niw);

        $member = Keanggotaan::with(['ranting'])
            ->where('member_number', $normalizedNiw)
            ->first();

        if (!$member) {
            return response()->json(null);
        }

        return response()->json($member);
    }

    public function show($id)
    {
        $member = Keanggotaan::with(['ranting'])->findOrFail($id);
        return response()->json($member);
    }
}
