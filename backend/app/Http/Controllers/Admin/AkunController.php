<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AkunController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $isSuperadmin = $user->hasRole('superadmin');
        $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;

        $usersQuery = User::with(['roles', 'keanggotaan.ranting'])
            ->when(!$isSuperadmin && $adminRantingId, function($query) use ($adminRantingId) {
                $query->whereHas('keanggotaan', function($q) use ($adminRantingId) {
                    $q->where('ranting_id', $adminRantingId);
                })->orWhere('id', auth()->id());
            })
            ->latest();

        $keanggotaansQuery = \App\Models\Keanggotaan::with('ranting:id,nama')
            ->select('id', 'name', 'member_number', 'ranting_id')
            ->withExists('user')
            ->when(!$isSuperadmin && $adminRantingId, function($query) use ($adminRantingId) {
                $query->where('ranting_id', $adminRantingId);
            })
            ->orderBy('name');

        return Inertia::render('admin/Akun/Index', [
            'users' => $usersQuery->get(),
            'keanggotaans' => $keanggotaansQuery->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'nullable|string|email|max:255|unique:users',
            'role' => 'required|string|in:superadmin,admin,kontributor,warga',
            'keanggotaan_id' => 'required|exists:keanggotaans,id',
        ]);

        $keanggotaan = \App\Models\Keanggotaan::findOrFail($validated['keanggotaan_id']);
        
        $authUser = auth()->user();
        if (!$authUser->hasRole('superadmin') && $keanggotaan->ranting_id !== $authUser->keanggotaan?->ranting_id) {
            abort(403, 'Unauthorized action.');
        }
        
        $validated['name'] = $keanggotaan->name;
        $validated['username'] = $keanggotaan->member_number;
        $validated['password'] = bcrypt('password@123!');

        $role = $validated['role'];
        unset($validated['role']);

        // Prevent creating multiple accounts for the same Warga if username must be unique
        // Laravel unique validation doesn't catch it unless we add username validation, but we generate it here
        if (User::where('username', $validated['username'])->exists()) {
            return back()->withErrors(['keanggotaan_id' => 'Akun untuk Warga ini sudah ada (Username/NIW sudah terdaftar).'])->withInput();
        }

        $user = User::create($validated);
        $user->assignRole($role);

        return redirect()->route('admin.akun.index')->with('success', 'Akun berhasil dibuat dengan password default.');
    }

    public function update(Request $request, User $akun)
    {
        $validated = $request->validate([
            'role' => 'required|string|in:superadmin,admin,kontributor,warga',
        ]);

        $akun->syncRoles([$validated['role']]);

        return redirect()->route('admin.akun.index')->with('success', 'Role akun berhasil diperbarui.');
    }

    public function destroy(User $akun)
    {
        if ($akun->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menghapus diri sendiri.']);
        }

        $authUser = auth()->user();
        if (!$authUser->hasRole('superadmin') && $akun->keanggotaan?->ranting_id !== $authUser->keanggotaan?->ranting_id) {
            abort(403, 'Unauthorized action.');
        }

        $akun->delete();

        return redirect()->route('admin.akun.index')->with('success', 'Akun berhasil dihapus.');
    }

    public function updateStatus(Request $request, User $akun)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        if ($akun->id === auth()->id() && !$validated['is_active']) {
            return back()->withErrors(['error' => 'Anda tidak bisa menonaktifkan akun Anda sendiri.']);
        }

        $authUser = auth()->user();
        if (!$authUser->hasRole('superadmin') && $akun->keanggotaan?->ranting_id !== $authUser->keanggotaan?->ranting_id) {
            abort(403, 'Unauthorized action.');
        }

        $akun->update(['is_active' => $validated['is_active']]);

        return back()->with('success', $validated['is_active'] ? 'Akun berhasil diaktifkan.' : 'Akun berhasil dinonaktifkan.');
    }

    public function resetPassword(User $akun)
    {
        $akun->update([
            'password' => bcrypt('password@123!')
        ]);

        return back()->with('success', 'Password berhasil direset ke "password@123!".');
    }
}
