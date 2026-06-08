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
        return Inertia::render('admin/Kontributor/Index', [
            'users' => User::where('role', 'penulis')->latest()->get()
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
            'role' => 'required|string|in:superadmin,admin,penulis',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);

        return redirect()->route('admin.kontributor.index')->with('success', 'Kontributor berhasil dibuat.');
    }

    public function edit(User $kontributor)
    {
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
            'role' => 'required|string|in:superadmin,admin,penulis',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $kontributor->update($validated);

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
