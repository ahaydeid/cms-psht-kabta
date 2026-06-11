import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Modal } from '@/Components/Base';
import { Button, Input, Textarea } from '@/Components/ui';
import { Combobox } from '@/Components/ui/Combobox';
import { confirmAction } from '@/lib/alert';

type Ranting = {
    id: number;
    nama: string;
};

type JadwalRecord = {
    id: number | null;
    hari: string;
    tempat: string;
    waktu: string;
    jam_mulai?: string;
    jam_selesai?: string;
    alamat?: string | null;
    kontak?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    keterangan?: string | null;
    is_active: boolean;
};

type JadwalFormModalProps = {
    open: boolean;
    onClose: () => void;
    rantings: Ranting[];
    jadwals: JadwalRecord[];
    selectedRantingName?: string; // Jika edit, ranting mana yang sedang diedit
    auth: any;
    readOnly?: boolean;
};

const HARI_LIST = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function JadwalFormModal({
    open,
    onClose,
    rantings,
    jadwals,
    selectedRantingName = '',
    auth,
    readOnly = false,
}: JadwalFormModalProps) {
    const isRantingAdmin = auth.user?.role === 'admin';
    const adminRantingName = auth.user?.keanggotaan?.ranting?.nama || '';

    // Ranting yang sedang aktif dipilih di combobox
    const [activeRanting, setActiveRanting] = useState('');
    // Hari yang sedang aktif di-edit (default: Minggu)
    const [activeHari, setActiveHari] = useState('Minggu');

    // Local state untuk menyimpan data form untuk 7 hari
    const [localJadwals, setLocalJadwals] = useState<Record<string, JadwalRecord>>({});

    // 1. Inisialisasi ranting terpilih saat modal dibuka
    useEffect(() => {
        if (open) {
            if (isRantingAdmin) {
                setActiveRanting(adminRantingName);
            } else if (selectedRantingName) {
                setActiveRanting(selectedRantingName);
            } else if (rantings.length > 0) {
                setActiveRanting(rantings[0].nama);
            } else {
                setActiveRanting('');
            }
            setActiveHari('Minggu');
        }
    }, [open, selectedRantingName, isRantingAdmin, adminRantingName, rantings]);

    // 2. Muat data jadwal dari database untuk ranting terpilih ke local state
    useEffect(() => {
        if (!open || !activeRanting) return;

        // Cari jadwal yang cocok dengan activeRanting
        const matches = jadwals.filter((j) => {
            const places = [activeRanting.toLowerCase(), `ranting ${activeRanting.toLowerCase()}`];
            const tempatLower = j.tempat.toLowerCase();
            return places.some((p) => tempatLower.includes(p) || p.includes(tempatLower));
        });

        // Bentuk state untuk 7 hari
        const newLocalJadwals: Record<string, JadwalRecord> = {};
        HARI_LIST.forEach((hari) => {
            const match = matches.find((m) => m.hari.toLowerCase() === hari.toLowerCase());
            if (match) {
                let jamMulai = '';
                let jamSelesai = '';
                if (match.waktu && match.waktu.includes('-')) {
                    const parts = match.waktu.split('-');
                    jamMulai = parts[0].trim().replace('.', ':').substring(0, 5);
                    jamSelesai = parts[1].trim().replace('.', ':').substring(0, 5);
                }

                newLocalJadwals[hari] = {
                    id: match.id,
                    hari: match.hari,
                    tempat: match.tempat,
                    waktu: match.waktu,
                    jam_mulai: jamMulai,
                    jam_selesai: jamSelesai,
                    alamat: match.alamat || '',
                    kontak: match.kontak || '',
                    latitude: match.latitude || '',
                    longitude: match.longitude || '',
                    keterangan: match.keterangan || '',
                    is_active: match.is_active,
                };
            } else {
                // Default value jika hari tersebut belum ada jadwalnya
                newLocalJadwals[hari] = {
                    id: null,
                    hari: hari,
                    tempat: '',
                    waktu: '',
                    jam_mulai: '',
                    jam_selesai: '',
                    alamat: '',
                    kontak: '',
                    latitude: '',
                    longitude: '',
                    keterangan: '',
                    is_active: false,
                };
            }
        });

        setLocalJadwals(newLocalJadwals);
    }, [open, activeRanting, jadwals, isRantingAdmin, adminRantingName]);

    // Handler untuk mengubah field pada hari yang sedang aktif
    const handleFieldChange = (field: keyof JadwalRecord, value: any) => {
        setLocalJadwals((prev) => {
            const updated = { ...prev };
            updated[activeHari] = {
                ...updated[activeHari],
                [field]: value,
            };

            return updated;
        });
    };

    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: any) => {
        if (e) e.preventDefault();

        // Siapkan payload array jadwals untuk dikirim ke backend
        const payloadJadwals = HARI_LIST.map((hari) => {
            const data = localJadwals[hari];
            const waktuString = (data.jam_mulai && data.jam_selesai)
                ? `${data.jam_mulai} - ${data.jam_selesai}`
                : (data.waktu || '-');

            return {
                id: data.id,
                hari: data.hari,
                tempat: data.tempat || activeRanting,
                waktu: waktuString,
                alamat: data.alamat || null,
                kontak: data.kontak || null,
                latitude: data.latitude ? Number(data.latitude) : null,
                longitude: data.longitude ? Number(data.longitude) : null,
                keterangan: data.keterangan || null,
                is_active: data.is_active,
            };
        });

        const result = await confirmAction({
            title: 'Simpan Jadwal Latihan?',
            text: `Apakah Anda yakin ingin menyimpan seluruh konfigurasi jadwal latihan untuk Ranting ${activeRanting}?`,
            confirmButtonText: 'Ya, Simpan',
            variant: 'info',
        });

        if (result.isConfirmed) {
            setProcessing(true);
            router.post('/admin/jadwal-latihan', {
                jadwals: payloadJadwals,
            }, {
                onSuccess: () => {
                    onClose();
                },
                onFinish: () => {
                    setProcessing(false);
                },
                preserveScroll: true
            });
        }
    };

    // Data hari yang sedang diedit saat ini
    const currentDayData = localJadwals[activeHari] || {
        tempat: '',
        waktu: '',
        alamat: '',
        kontak: '',
        latitude: '',
        longitude: '',
        is_active: false,
        keterangan: '',
    };

    const lat = Number(currentDayData.latitude);
    const lng = Number(currentDayData.longitude);
    const hasValidCoordinates = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

    return (
        <Modal
            onClose={onClose}
            open={open}
            size="3xl"
            title={readOnly ? 'Detail Jadwal Latihan' : (selectedRantingName ? 'Edit Jadwal Latihan' : 'Tambah Jadwal Latihan')}
            footer={
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={onClose} type="button">
                        {readOnly ? 'Tutup' : 'Batal'}
                    </Button>
                    {!readOnly && (
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={processing}
                            icon={<Save className="size-4" />}
                        >
                            Simpan
                        </Button>
                    )}
                </div>
            }
        >
            <div className="space-y-6">
                {readOnly || !!selectedRantingName ? (
                    <div className="max-w-md px-1">
                        <span className="text-2xl font-bold text-sky-700">{isRantingAdmin ? adminRantingName : activeRanting}</span>
                    </div>
                ) : (
                    !isRantingAdmin ? (
                        <div className="space-y-1 max-w-md">
                            <label className="text-sm font-semibold text-zinc-950">Pilih Ranting</label>
                            <Combobox
                                options={rantings.map((r) => ({ value: r.nama, label: r.nama }))}
                                value={activeRanting}
                                onChange={(val) => setActiveRanting(val)}
                                className="w-full"
                            />
                        </div>
                    ) : (
                        <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg flex items-center justify-between max-w-md">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tingkat Ranting</span>
                            <span className="text-sm font-bold text-zinc-900">{adminRantingName}</span>
                        </div>
                    )
                )}

                {/* 2. Tombol 7 Hari Latihan (Rounded Full, Rata Tengah) */}
                <div className="space-y-2">
                    <label className="block text-center text-xs font-semibold text-zinc-500 uppercase ">
                        Hari Latihan
                    </label>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {HARI_LIST.map((hari) => {
                            const isActiveDay = activeHari === hari;
                            const hasSchedule = localJadwals[hari]?.is_active;

                            return (
                                <button
                                    key={hari}
                                    type="button"
                                    onClick={() => setActiveHari(hari)}
                                    className={`relative px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                                        isActiveDay
                                            ? 'bg-brand-yellow text-zinc-950'
                                            : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                                    }`}
                                >
                                    {hari}
                                    {/* Indikator Titik Aktif di Pojok Tombol Hari */}
                                    {hasSchedule && (
                                        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white text-[7px] text-white items-center justify-center font-bold">✓</span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Form Input untuk Hari Terpilih */}
                <div className="border border-zinc-200 rounded-xl p-4 bg-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-zinc-900">Jadwal Hari {activeHari}</h4>
                        </div>
                        <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5">
                            <button
                                type="button"
                                onClick={() => !readOnly && handleFieldChange('is_active', false)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                                    !currentDayData.is_active
                                        ? 'bg-zinc-400 text-white'
                                        : 'text-zinc-400 hover:text-zinc-600 cursor-pointer'
                                } ${readOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                            >
                                Libur
                            </button>
                            <button
                                type="button"
                                onClick={() => !readOnly && handleFieldChange('is_active', true)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                                    currentDayData.is_active
                                        ? 'bg-emerald-500 text-white'
                                        : 'text-zinc-400 hover:text-zinc-600 cursor-pointer'
                                } ${readOnly ? 'cursor-not-allowed opacity-80' : ''}`}
                            >
                                Aktif
                            </button>
                        </div>
                    </div>

                    {currentDayData.is_active ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <Input
                                    label="Tempat Latihan"
                                    value={currentDayData.tempat}
                                    onChange={(e) => handleFieldChange('tempat', e.target.value)}
                                    placeholder={`Misal: Ranting ${activeRanting}`}
                                    required
                                    disabled={readOnly}
                                />

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-zinc-950">Waktu Latihan</label>
                                    <div className="grid grid-cols-2 gap-3 items-center">
                                        <Input
                                            type="time"
                                            value={currentDayData.jam_mulai || ''}
                                            onChange={(e) => handleFieldChange('jam_mulai', e.target.value)}
                                            placeholder="Dari"
                                            required
                                            disabled={readOnly}
                                        />
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-zinc-400 font-semibold select-none">s/d</span>
                                            <Input
                                                type="time"
                                                className="w-full"
                                                value={currentDayData.jam_selesai || ''}
                                                onChange={(e) => handleFieldChange('jam_selesai', e.target.value)}
                                                placeholder="Sampai"
                                                required
                                                disabled={readOnly}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Input
                                    label="Kontak Penanggung Jawab"
                                    value={currentDayData.kontak || ''}
                                    onChange={(e) => handleFieldChange('kontak', e.target.value)}
                                    placeholder="Misal: 0812-xxxx-xxxx"
                                    disabled={readOnly}
                                />

                                <Textarea
                                    label="Alamat Lengkap"
                                    value={currentDayData.alamat || ''}
                                    onChange={(e) => handleFieldChange('alamat', e.target.value)}
                                    placeholder="Masukkan alamat lengkap lokasi latihan..."
                                    rows={3}
                                    disabled={readOnly}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="Latitude"
                                        value={currentDayData.latitude || ''}
                                        onChange={(e) => handleFieldChange('latitude', e.target.value)}
                                        placeholder="Contoh: -6.2248"
                                        disabled={readOnly}
                                    />
                                    <Input
                                        label="Longitude"
                                        value={currentDayData.longitude || ''}
                                        onChange={(e) => handleFieldChange('longitude', e.target.value)}
                                        placeholder="Contoh: 106.5086"
                                        disabled={readOnly}
                                    />
                                </div>

                                <Textarea
                                    label="Keterangan Tambahan"
                                    value={currentDayData.keterangan || ''}
                                    onChange={(e) => handleFieldChange('keterangan', e.target.value)}
                                    placeholder="Keterangan tambahan (opsional)..."
                                    rows={2}
                                    disabled={readOnly}
                                />

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Preview Peta</label>
                                    <div className="h-32 border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50 flex items-center justify-center">
                                        {hasValidCoordinates ? (
                                            <iframe
                                                title="Peta Preview"
                                                src={`https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`}
                                                className="w-full h-full border-0"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-xs text-zinc-400">Isi latitude & longitude untuk melihat peta preview</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-50 rounded-lg border border-dashed border-zinc-200">
                            <p className="text-sm text-zinc-500">Tidak ada jadwal latihan pada hari {activeHari}.</p>
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => handleFieldChange('is_active', true)}
                                    className="mt-2 text-xs font-semibold text-blue-500 hover:underline"
                                >
                                    + Aktifkan Jadwal Latihan untuk Hari Ini
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
