<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgendaController extends Controller
{
    public function index(Request $request)
    {
        $query = Agenda::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                  ->orWhere('keterangan', 'like', '%' . $search . '%')
                  ->orWhere('kategori', 'like', '%' . $search . '%')
                  ->orWhere('tipe_hari', 'like', '%' . $search . '%');
            });
        }

        $perPage = $request->input('per_page', 10);
        $agendas = $query->orderBy('tanggal', 'desc')->paginate($perPage);

        return Inertia::render('admin/Agenda/Index', [
            'items' => $agendas->items(),
            'meta' => [
                'currentPage' => $agendas->currentPage(),
                'lastPage' => $agendas->lastPage(),
                'perPage' => $agendas->perPage(),
                'total' => $agendas->total(),
                'from' => $agendas->firstItem(),
                'to' => $agendas->lastItem(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'perPage' => (int) $perPage,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'nullable|string',
            'waktu_selesai' => 'nullable|string',
            'kategori' => 'required|string|max:255',
            'tipe_hari' => 'required|string|in:KEGIATAN,PENTING,LIBUR',
            'status' => 'required|string|in:active,inactive',
        ]);

        Agenda::create($validated);

        return redirect()->route('admin.agenda.index')->with('success', 'Agenda kegiatan berhasil ditambahkan.');
    }

    public function update(Request $request, Agenda $agenda)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'keterangan' => 'nullable|string',
            'tanggal' => 'required|date',
            'waktu_mulai' => 'nullable|string',
            'waktu_selesai' => 'nullable|string',
            'kategori' => 'required|string|max:255',
            'tipe_hari' => 'required|string|in:KEGIATAN,PENTING,LIBUR',
            'status' => 'required|string|in:active,inactive',
        ]);

        $agenda->update($validated);

        return redirect()->route('admin.agenda.index')->with('success', 'Agenda kegiatan berhasil diperbarui.');
    }

    public function destroy(Agenda $agenda)
    {
        $agenda->delete();

        return redirect()->route('admin.agenda.index')->with('success', 'Agenda kegiatan berhasil dihapus.');
    }
}
