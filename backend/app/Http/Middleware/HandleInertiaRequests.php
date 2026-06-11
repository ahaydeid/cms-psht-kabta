<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->roles->first()?->name,
                    'photo' => $user->keanggotaan?->photo_url,
                ] : null,
                'organizationUnit' => [
                    'name' => 'PSHT Kabta',
                ],
                'roles' => $user ? $user->roles->pluck('name')->toArray() : [],
                'drafts_count' => $user ? (function () use ($user) {
                    $isSuperadmin = $user->hasRole('superadmin');
                    $adminRantingId = $isSuperadmin ? null : $user->keanggotaan?->ranting_id;

                    $beritaQuery = \App\Models\Artikel::where('status', 'draft');
                    $galeriQuery = \App\Models\Galeri::where('status', 'inactive');

                    if (!$isSuperadmin && $adminRantingId) {
                        $beritaQuery->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                            $q->where('ranting_id', $adminRantingId);
                        });
                        $galeriQuery->whereHas('penulis.keanggotaan', function ($q) use ($adminRantingId) {
                            $q->where('ranting_id', $adminRantingId);
                        });
                    }

                    return $beritaQuery->count() + $galeriQuery->count();
                })() : 0,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
