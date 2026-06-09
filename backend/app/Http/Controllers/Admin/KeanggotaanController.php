<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Keanggotaan;
use App\Models\Ranting;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class KeanggotaanController extends Controller
{
    public function index(Request $request): Response
    {

        $filters = [
            'page' => max(1, (int) $request->integer('page', 1)),
            'per_page' => in_array($request->integer('per_page', 10), [10, 20, 50], true) ? $request->integer('per_page', 10) : 10,
            'search' => trim((string) $request->query('search', '')),
            'status' => in_array($request->query('status'), ['active', 'inactive', 'transferred', 'deceased'], true) ? $request->query('status') : 'all',
            'unit' => $request->filled('unit') ? (string) $request->query('unit') : 'all',
        ];

        $members = Keanggotaan::query()
            ->with(['ranting'])
            ->when(
                $filters['status'] !== 'all',
                fn ($query) => $query->where('status', $filters['status']),
            )
            ->when(
                $filters['unit'] !== 'all',
                fn ($query) => $query->where('ranting_id', (int) $filters['unit']),
            )
            ->when($filters['search'] !== '', function ($query) use ($filters) {
                $keyword = '%'.Str::lower($filters['search']).'%';

                $query->where(function ($nestedQuery) use ($keyword) {
                    $nestedQuery
                        ->whereRaw('LOWER(name) LIKE ?', [$keyword])
                        ->orWhereRaw('LOWER(member_number) LIKE ?', [$keyword])
                        ->orWhereRaw('LOWER(identity_number) LIKE ?', [$keyword])
                        ->orWhereHas('ranting', fn ($rantingQuery) => $rantingQuery->whereRaw('LOWER(nama) LIKE ?', [$keyword]));
                });
            })
            ->orderBy('name')
            ->paginate($filters['per_page'])
            ->withQueryString();

        return Inertia::render('admin/Warga/Index', [
            'defaultOrganizationUnitId' => null,
            'filters' => $filters,
            'members' => [
                'currentPage' => $members->currentPage(),
                'data' => $members->getCollection()->map(fn (Keanggotaan $member) => [
                    'address' => $member->address,
                    'birthDate' => $this->formatDate($member->birth_date),
                    'birthDateValue' => $member->birth_date?->format('Y-m-d') ?? '',
                    'birthPlace' => $member->birth_place,
                    'citizenship' => $member->citizenship,
                    'gender' => $member->gender,
                    'id' => $member->id,
                    'identityNumber' => $member->identity_number,
                    'identityType' => $member->identity_type,
                    'legalizationPlace' => $member->legalization_place,
                    'legalizedAt' => $this->formatDate($member->legalized_at),
                    'legalizedAtValue' => $member->legalized_at?->format('Y-m-d') ?? '',
                    'memberNumber' => $member->member_number,
                    'name' => $member->name,
                    'occupation' => $member->occupation,
                    'organizationUnit' => $member->ranting?->nama ?? '-',
                    'phone' => $member->phone,
                    'photoUrl' => $member->photo_url,
                    'ranting' => $member->ranting?->nama ?? '-',
                    'religion' => $member->religion,
                    'status' => $member->status,
                ])->values(),
                'perPage' => $members->perPage(),
                'total' => $members->total(),
                'totalPages' => $members->lastPage(),
            ],
            'organizationUnitOptions' => $this->organizationUnitOptions(),
        ]);
    }

    public function show(Request $request, $id): Response
    {

        $member = Keanggotaan::with(['ranting'])->findOrFail($id);

        return Inertia::render('admin/Warga/Show', [
            'member' => [
                'address' => $member->address,
                'birthDate' => $this->formatDate($member->birth_date),
                'birthDateValue' => $member->birth_date?->format('Y-m-d') ?? '',
                'birthPlace' => $member->birth_place,
                'citizenship' => $member->citizenship,
                'gender' => $member->gender,
                'id' => $member->id,
                'identityNumber' => $member->identity_number,
                'identityType' => $member->identity_type,
                'legalizationPlace' => $member->legalization_place,
                'legalizedAt' => $this->formatDate($member->legalized_at),
                'legalizedAtValue' => $member->legalized_at?->format('Y-m-d') ?? '',
                'memberNumber' => $member->member_number,
                'name' => $member->name,
                'occupation' => $member->occupation,
                'organizationUnit' => $member->ranting?->nama ?? '-',
                'organizationUnitId' => $member->ranting_id,
                'phone' => $member->phone,
                'photoUrl' => $member->photo_url,
                'ranting' => $member->ranting?->nama ?? '-',
                'religion' => $member->religion,
                'status' => $member->status,
            ],
            'organizationUnitOptions' => $this->organizationUnitOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        $this->normalizeRequest($request);

        $validated = $this->validatedMemberData($request);

        $ranting = Ranting::query()->findOrFail($validated['organization_unit_id']);
        $photoPath = $request->hasFile('photo') ? $this->storeCompressedPhoto($request, $validated['member_number']) : null;

        Keanggotaan::query()->create($this->memberAttributes($validated, $ranting, $photoPath));

        return back()->with('success', 'Data warga berhasil ditambahkan.');
    }

    public function update(Request $request, $id): RedirectResponse
    {

        $member = Keanggotaan::findOrFail($id);

        $this->normalizeRequest($request);

        $validated = $this->validatedMemberData($request, $member);

        $ranting = Ranting::query()->findOrFail($validated['organization_unit_id']);
        $photoPath = $member->photo_path;

        if ($request->hasFile('photo')) {
            $photoPath = $this->storeCompressedPhoto($request, $validated['member_number']);

            if ($member->photo_path) {
                Storage::disk('public')->delete($member->photo_path);
            }
        }

        $member->update($this->memberAttributes($validated, $ranting, $photoPath));

        return back()->with('success', 'Data warga berhasil diperbarui.');
    }

    public function destroy(Request $request, $id): RedirectResponse
    {

        $member = Keanggotaan::findOrFail($id);

        if ($member->photo_path) {
            Storage::disk('public')->delete($member->photo_path);
        }

        $member->delete();

        return redirect()->route('admin.warga.index')->with('success', 'Data warga berhasil dihapus.');
    }

    private function formatDate(?CarbonInterface $date): string
    {
        if (! $date) {
            return '-';
        }

        $months = [
            1 => 'Jan',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Apr',
            5 => 'Mei',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Agu',
            9 => 'Sep',
            10 => 'Okt',
            11 => 'Nov',
            12 => 'Des',
        ];

        return $date->format('d').' '.$months[(int) $date->format('n')].' '.$date->format('Y');
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    private function organizationUnitOptions(): array
    {
        return Ranting::query()
            ->orderBy('nama')
            ->get(['id', 'nama'])
            ->map(fn (Ranting $ranting) => [
                'id' => $ranting->id,
                'name' => $ranting->nama,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function validatedMemberData(Request $request, ?Keanggotaan $member = null): array
    {
        $memberNumberRule = Rule::unique('keanggotaans', 'member_number');
        $identityNumberRule = Rule::unique('keanggotaans', 'identity_number');

        if ($member) {
            $memberNumberRule->ignore($member->id);
            $identityNumberRule->ignore($member->id);
        }

        return $request->validate(
            [
                'organization_unit_id' => ['required', 'integer', 'exists:rantings,id'],
                'citizenship' => ['required', 'in:WNI,WNA'],
                'identity_number' => ['nullable', 'digits:16', $identityNumberRule],
                'member_number' => ['required', 'string', 'max:64', $memberNumberRule],
                'name' => ['required', 'string', 'max:255'],
                'birth_place' => ['nullable', 'string', 'max:255'],
                'birth_date' => ['nullable', 'date'],
                'gender' => ['required', 'in:Laki-laki,Perempuan'],
                'religion' => ['nullable', 'string', 'max:50'],
                'address' => ['nullable', 'string'],
                'occupation' => ['nullable', 'string', 'max:255'],
                'phone' => ['nullable', 'digits_between:8,15'],
                'legalized_at' => ['nullable', 'date'],
                'legalization_place' => ['nullable', 'string', 'max:255'],
                'status' => ['required', 'in:active,inactive,transferred,deceased'],
                'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif,webp', 'max:5120'],
            ],
            [
                'member_number.required' => 'NIW wajib diisi.',
                'member_number.unique' => 'NIW sudah terdaftar.',
                'identity_number.digits' => 'NIK harus terdiri dari 16 digit.',
                'identity_number.unique' => 'NIK sudah terdaftar.',
                'name.required' => 'Nama lengkap wajib diisi.',
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function memberAttributes(array $validated, Ranting $ranting, ?string $photoPath): array
    {
        return [
            'ranting_id' => $ranting->id,
            'citizenship' => $validated['citizenship'],
            'identity_type' => 'KTP/KK',
            'identity_number' => $validated['identity_number'] ?? null,
            'member_number' => $validated['member_number'],
            'name' => $validated['name'],
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'],
            'religion' => $validated['religion'] ?? null,
            'address' => $validated['address'] ?? null,
            'occupation' => $validated['occupation'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'legalized_at' => $validated['legalized_at'] ?? null,
            'legalization_place' => $validated['legalization_place'] ?? null,
            'status' => $validated['status'],
            'photo_path' => $photoPath,
        ];
    }

    private function normalizeRequest(Request $request): void
    {
        $identityNumber = preg_replace('/\D/', '', (string) $request->input('identity_number', ''));
        $phone = preg_replace('/\D/', '', (string) $request->input('phone', ''));

        $request->merge([
            'identity_number' => $identityNumber !== '' ? $identityNumber : null,
            'member_number' => Str::upper(trim((string) $request->input('member_number', ''))),
            'phone' => $phone !== '' ? $phone : null,
        ]);
    }

    /**
     * @throws ValidationException
     */
    private function storeCompressedPhoto(Request $request, string $memberNumber): string
    {
        $file = $request->file('photo');

        if (! $file) {
            throw ValidationException::withMessages([
                'photo' => 'Foto warga wajib berupa gambar yang valid.',
            ]);
        }

        $source = $this->imageResourceFromPath($file->getRealPath(), $file->getMimeType());

        if (! $source) {
            throw ValidationException::withMessages([
                'photo' => 'Foto warga tidak dapat diproses.',
            ]);
        }

        if ($file->getMimeType() === 'image/jpeg') {
            $orientedSource = $this->applyJpegOrientation($source, $file->getRealPath());

            if ($orientedSource !== $source) {
                imagedestroy($source);
                $source = $orientedSource;
            }
        }

        $contents = $this->compressedJpegContents($source);
        imagedestroy($source);

        if (! $contents) {
            throw ValidationException::withMessages([
                'photo' => 'Foto warga gagal dikompres di bawah 300KB.',
            ]);
        }

        $path = 'members/'.Str::slug($memberNumber).'-'.Str::random(8).'.jpg';
        Storage::disk('public')->put($path, $contents);

        return $path;
    }

    private function imageResourceFromPath(string $path, string $mimeType): \GdImage|false
    {
        return match ($mimeType) {
            'image/jpeg' => imagecreatefromjpeg($path),
            'image/png' => imagecreatefrompng($path),
            'image/gif' => imagecreatefromgif($path),
            'image/webp' => imagecreatefromwebp($path),
            default => false,
        };
    }

    private function compressedJpegContents(\GdImage $source): string|false
    {
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);
        $maxBytes = 300 * 1024;
        $maxSize = 1200;
        $minSize = 360;

        while ($maxSize >= $minSize) {
            $scale = min(1, $maxSize / max($sourceWidth, $sourceHeight));
            $targetWidth = max(1, (int) round($sourceWidth * $scale));
            $targetHeight = max(1, (int) round($sourceHeight * $scale));
            $canvas = imagecreatetruecolor($targetWidth, $targetHeight);

            imagefill($canvas, 0, 0, imagecolorallocate($canvas, 255, 255, 255));
            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $sourceWidth, $sourceHeight);

            foreach ([82, 76, 70, 64, 58, 52] as $quality) {
                ob_start();
                imagejpeg($canvas, null, $quality);
                $contents = ob_get_clean();

                if ($contents && strlen($contents) <= $maxBytes) {
                    imagedestroy($canvas);

                    return $contents;
                }
            }

            imagedestroy($canvas);
            $maxSize = (int) floor($maxSize * 0.8);
        }

        return false;
    }

    private function applyJpegOrientation(\GdImage $source, string $path): \GdImage
    {
        $exif = function_exists('exif_read_data') ? @exif_read_data($path) : false;
        $orientation = is_array($exif) ? ($exif['Orientation'] ?? null) : null;

        return match ($orientation) {
            3 => imagerotate($source, 180, 0),
            6 => imagerotate($source, -90, 0),
            8 => imagerotate($source, 90, 0),
            default => $source,
        };
    }
}
