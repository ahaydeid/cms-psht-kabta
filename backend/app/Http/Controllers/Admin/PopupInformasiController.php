<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PopupInformasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PopupInformasiController extends Controller
{
    public function index()
    {
        $popup = PopupInformasi::first() ?? new PopupInformasi();
        
        return Inertia::render('admin/PopupInformasi/Index', [
            'popup' => $popup
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|string',
            'tanggal' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $popup = PopupInformasi::first();
        if ($popup) {
            $popup->update($validated);
        } else {
            PopupInformasi::create($validated);
        }

        return redirect()->route('admin.popup-informasi.index')->with('success', 'Popup informasi berhasil diperbarui.');
    }
}
