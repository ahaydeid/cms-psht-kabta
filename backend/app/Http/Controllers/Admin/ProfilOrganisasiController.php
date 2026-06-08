<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfilOrganisasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilOrganisasiController extends Controller
{
    public function index()
    {
        $keys = ['name', 'eyebrow', 'headline', 'description', 'logo', 'address', 'email', 'phone'];
        $profile = [];
        foreach ($keys as $key) {
            $profile[$key] = ProfilOrganisasi::getValue($key, '');
        }

        return Inertia::render('admin/ProfilOrganisasi/Index', [
            'profile' => $profile
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'eyebrow' => 'nullable|string|max:255',
            'headline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'address' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
        ]);

        foreach ($validated as $key => $value) {
            ProfilOrganisasi::setValue($key, $value ?? '');
        }

        return redirect()->route('admin.profil-organisasi.index')->with('success', 'Profil organisasi berhasil diperbarui.');
    }
}
