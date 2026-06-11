<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artikel;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Pagination\LengthAwarePaginator;

class DraftController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $isSuperadmin = $user->hasRole('superadmin');
        $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;
        $search = $request->query('search', '');

        // 1. Query Berita Draft
        $beritaQuery = Artikel::with(['penulis.keanggotaan.ranting'])
            ->where('status', 'draft');

        if (!$isSuperadmin && $adminRantingId) {
            $beritaQuery->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                $q->where('ranting_id', $adminRantingId);
            });
        }

        if (!empty($search)) {
            $s = '%' . \Illuminate\Support\Str::lower($search) . '%';
            $beritaQuery->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(judul) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(kategori) LIKE ?', [$s]);
            });
        }

        $beritaDrafts = $beritaQuery->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => 'berita',
                'judul' => $item->judul,
                'keterangan_atau_kategori' => $item->kategori ?? '-',
                'penulis' => $item->penulis?->name ?? '-',
                'ranting' => $item->penulis?->keanggotaan?->ranting?->nama ?? '-',
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        // 2. Query Galeri Draft
        $galeriQuery = Galeri::with(['penulis.keanggotaan.ranting'])
            ->where('status', 'inactive');

        if (!$isSuperadmin && $adminRantingId) {
            $galeriQuery->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                $q->where('ranting_id', $adminRantingId);
            });
        }

        if (!empty($search)) {
            $s = '%' . \Illuminate\Support\Str::lower($search) . '%';
            $galeriQuery->where(function ($q) use ($s) {
                $q->whereRaw('LOWER(judul) LIKE ?', [$s])
                  ->orWhereRaw('LOWER(keterangan) LIKE ?', [$s]);
            });
        }

        $galeriDrafts = $galeriQuery->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'type' => 'galeri',
                'judul' => $item->judul,
                'keterangan_atau_kategori' => $item->keterangan ?? '-',
                'penulis' => $item->penulis?->name ?? '-',
                'ranting' => $item->penulis?->keanggotaan?->ranting?->nama ?? '-',
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        });

        // 3. Gabungkan dan urutkan berdasarkan updated_at terbaru
        $merged = $beritaDrafts->concat($galeriDrafts)->sortByDesc('updated_at')->values();

        // 4. Pagination manual
        $page = max(1, $request->integer('page', 1));
        $perPage = in_array($request->integer('per_page', 10), [10, 20, 50], true) ? $request->integer('per_page', 10) : 10;
        
        $offset = ($page - 1) * $perPage;
        $paginatedItems = $merged->slice($offset, $perPage)->values();
        
        $paginated = new LengthAwarePaginator(
            $paginatedItems,
            $merged->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return Inertia::render('admin/Draft/Index', [
            'drafts' => $paginated,
            'filters' => [
                'page' => $page,
                'per_page' => $perPage,
                'search' => $search,
            ]
        ]);
    }

    public function publish($type, $id)
    {
        if ($type === 'berita') {
            $item = Artikel::findOrFail($id);
            $item->update(['status' => 'published']);
            $title = 'Berita';
        } elseif ($type === 'galeri') {
            $item = Galeri::findOrFail($id);
            $item->update(['status' => 'active']);
            $title = 'Galeri';
        } else {
            return back()->withErrors(['error' => 'Tipe konten tidak valid.']);
        }

        return redirect()->route('admin.draft.index')->with('success', "{$title} berhasil diterbitkan.");
    }

    public function destroy($type, $id)
    {
        if ($type === 'berita') {
            $item = Artikel::findOrFail($id);
            $item->delete();
            $title = 'Berita';
        } elseif ($type === 'galeri') {
            $item = Galeri::findOrFail($id);
            $item->delete();
            $title = 'Galeri';
        } else {
            return back()->withErrors(['error' => 'Tipe konten tidak valid.']);
        }

        return redirect()->route('admin.draft.index')->with('success', "{$title} berhasil dihapus.");
    }
}
