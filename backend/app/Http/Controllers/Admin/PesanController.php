<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PesanKontak;
use App\Models\Ranting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PesanController extends Controller
{
    public function index(Request $request)
    {
        $query = PesanKontak::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('subjek', 'like', '%' . $search . '%')
                  ->orWhere('pesan', 'like', '%' . $search . '%');
            });
        }

        if ($request->filled('ranting') && $request->ranting !== 'all') {
            $query->where('ranting', $request->ranting);
        }

        $perPage = $request->input('per_page', 10);
        $pesans = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $rantings = Ranting::orderBy('nama', 'asc')->get()->map(function ($r) {
            return 'Ranting ' . $r->nama;
        })->prepend('Cabang');

        return Inertia::render('admin/Pesan/Index', [
            'items' => $pesans->items(),
            'meta' => [
                'currentPage' => $pesans->currentPage(),
                'lastPage' => $pesans->lastPage(),
                'perPage' => $pesans->perPage(),
                'total' => $pesans->total(),
                'from' => $pesans->firstItem(),
                'to' => $pesans->lastItem(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'perPage' => (int) $perPage,
                'ranting' => $request->input('ranting', 'all'),
            ],
            'rantingOptions' => $rantings->toArray(),
        ]);
    }

    public function update(Request $request, PesanKontak $pesan)
    {
        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $pesan->update($validated);

        return redirect()->route('admin.pesan.index')->with('success', 'Status pesan berhasil diperbarui.');
    }

    public function destroy(PesanKontak $pesan)
    {
        $pesan->delete();

        return redirect()->route('admin.pesan.index')->with('success', 'Pesan berhasil dihapus.');
    }
}
