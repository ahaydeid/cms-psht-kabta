<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KontributorController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSuperadmin = $user->hasRole('superadmin');
        $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;

        $users = User::with('keanggotaan.ranting', 'roles')
            // Hanya tampilkan yang punya minimal 1 berita atau 1 galeri
            ->where(function ($q) {
                $q->whereHas('artikels')
                  ->orWhereHas('galeris');
            })
            // Kecualikan yang rolenya hanya Warga Biasa
            ->whereDoesntHave('roles', function ($q) {
                $q->where('name', 'warga');
            })
            ->when(!$isSuperadmin && $adminRantingId, function ($query) use ($adminRantingId) {
                $query->whereHas('keanggotaan', function ($q) use ($adminRantingId) {
                    $q->where('ranting_id', $adminRantingId);
                });
            })
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id'       => $user->id,
                    'name'     => $user->name,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'ranting'  => $user->keanggotaan?->ranting?->nama,
                    'roles'    => $user->roles->pluck('name'),
                    'kontribusi' => [
                        'tulisan' => \App\Models\Artikel::where('penulis_id', $user->id)->count(),
                        'galeri'  => \App\Models\Galeri::where('penulis_id', $user->id)->count(),
                    ],
                ];
            });

        return Inertia::render('admin/Kontributor/Index', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Kontributor/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:superadmin,admin,kontributor',
            'keanggotaan_id' => 'nullable|exists:keanggotaans,id',
        ]);

        $role = $validated['role'];
        unset($validated['role']);

        $validated['password'] = bcrypt($validated['password']);

        $user = User::create($validated);
        $user->assignRole($role);

        return redirect()->route('admin.kontributor.index')->with('success', 'Kontributor berhasil dibuat.');
    }

    public function edit(User $kontributor)
    {
        $kontributor->load('roles');
        return Inertia::render('admin/Kontributor/Edit', [
            'user' => $kontributor
        ]);
    }

    public function update(Request $request, User $kontributor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $kontributor->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|in:superadmin,admin,kontributor',
            'keanggotaan_id' => 'nullable|exists:keanggotaans,id',
        ]);

        $role = $validated['role'];
        unset($validated['role']);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $kontributor->update($validated);
        $kontributor->syncRoles([$role]);

        return redirect()->route('admin.kontributor.index')->with('success', 'Kontributor berhasil diperbarui.');
    }

    public function destroy(User $kontributor)
    {
        if ($kontributor->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus diri sendiri.']);
        }

        $kontributor->delete();

        return redirect()->route('admin.kontributor.index')->with('success', 'Kontributor berhasil dihapus.');
    }
}
