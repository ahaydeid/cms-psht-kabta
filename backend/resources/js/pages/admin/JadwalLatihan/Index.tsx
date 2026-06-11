import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';
import { JadwalFormModal } from './JadwalFormModal';

type Ranting = {
    id: number;
    nama: string;
};

type JadwalRecord = {
    id: number;
    tempat: string;
    hari: string;
    waktu: string;
    alamat?: string | null;
    kontak?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    keterangan?: string | null;
    is_active: boolean;
};

type JadwalProps = {
    jadwals: JadwalRecord[];
    rantings: Ranting[];
    auth: any;
};

export default function JadwalIndex({ jadwals, rantings, auth }: JadwalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRantingName, setSelectedRantingName] = useState('');
    const [isReadOnly, setIsReadOnly] = useState(false);

    const HARI_ORDER = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const filteredJadwals = jadwals.filter((j) => {
        const search = searchTerm.toLowerCase();
        return (
            j.tempat.toLowerCase().includes(search) ||
            j.hari.toLowerCase().includes(search) ||
            (j.alamat && j.alamat.toLowerCase().includes(search)) ||
            (j.kontak && j.kontak.toLowerCase().includes(search))
        );
    });

    // Grouping jadwals by tempat
    const groupedMap: Record<string, {
        tempat: string;
        records: JadwalRecord[];
    }> = {};

    filteredJadwals.forEach((j) => {
        const key = j.tempat.trim().toLowerCase();
        if (!groupedMap[key]) {
            groupedMap[key] = {
                tempat: j.tempat.trim(),
                records: [],
            };
        }
        groupedMap[key].records.push(j);
    });

    const groupedJadwals = Object.values(groupedMap).map((group) => {
        const activeRecords = group.records.filter((r) => r.is_active);
        const recordsToUse = activeRecords.length > 0 ? activeRecords : group.records;

        // Urutkan recordsToUse berdasarkan hari order
        recordsToUse.sort((a, b) => {
            return HARI_ORDER.indexOf(a.hari) - HARI_ORDER.indexOf(b.hari);
        });

        // 1. Gabungkan hari dengan rapi (e.g. Senin dan Jumat, atau Senin, Rabu, dan Jumat)
        const haris = recordsToUse.map((r) => r.hari.trim());
        let hariString = '';
        if (haris.length === 1) {
            hariString = haris[0];
        } else if (haris.length === 2) {
            hariString = `${haris[0]} dan ${haris[1]}`;
        } else if (haris.length > 2) {
            hariString = haris.slice(0, -1).join(', ') + ', dan ' + haris[haris.length - 1];
        }

        // 2. Gabungkan waktu secara unik dengan rapi
        const waktus = Array.from(new Set(recordsToUse.map((r) => (r.waktu || '').trim()).filter(Boolean)));
        let waktuString = '';
        if (waktus.length === 1) {
            waktuString = waktus[0];
        } else if (waktus.length === 2) {
            waktuString = `${waktus[0]} dan ${waktus[1]}`;
        } else if (waktus.length > 2) {
            waktuString = waktus.slice(0, -1).join(', ') + ', dan ' + waktus[waktus.length - 1];
        } else {
            waktuString = '-';
        }

        // 3. Gabungkan kontak secara unik dengan rapi
        const kontaks = Array.from(new Set(recordsToUse.map((r) => (r.kontak || '').trim()).filter(Boolean)));
        let kontakString = '';
        if (kontaks.length === 1) {
            kontakString = kontaks[0];
        } else if (kontaks.length === 2) {
            kontakString = `${kontaks[0]} dan ${kontaks[1]}`;
        } else if (kontaks.length > 2) {
            kontakString = kontaks.slice(0, -1).join(', ') + ', dan ' + kontaks[kontaks.length - 1];
        } else {
            kontakString = '-';
        }

        // 4. Gabungkan alamat secara unik dengan rapi
        const alamats = Array.from(new Set(recordsToUse.map((r) => (r.alamat || '').trim()).filter(Boolean)));
        let alamatString = '';
        if (alamats.length === 1) {
            alamatString = alamats[0];
        } else if (alamats.length === 2) {
            alamatString = `${alamats[0]} dan ${alamats[1]}`;
        } else if (alamats.length > 2) {
            alamatString = alamats.slice(0, -1).join(', ') + ', dan ' + alamats[alamats.length - 1];
        } else {
            alamatString = '-';
        }

        const isAnyActive = recordsToUse.some((r) => r.is_active);
        const firstId = recordsToUse[0]?.id || 0;

        return {
            id: firstId,
            tempat: group.tempat,
            hari: hariString,
            waktu: waktuString,
            kontak: kontakString,
            alamat: alamatString,
            is_active: isAnyActive,
        };
    });

    const handleCreate = () => {
        setSelectedRantingName('');
        setIsReadOnly(false);
        setModalOpen(true);
    };

    const handleEdit = (tempat: string) => {
        // Ekstrak nama ranting asli dari teks tempat (misal "Ranting Tigaraksa" -> "Tigaraksa")
        let cleanName = tempat;
        rantings.forEach((r) => {
            if (tempat.toLowerCase().includes(r.nama.toLowerCase())) {
                cleanName = r.nama;
            }
        });
        setSelectedRantingName(cleanName);
        setIsReadOnly(false);
        setModalOpen(true);
    };

    const handleDetail = (tempat: string) => {
        let cleanName = tempat;
        rantings.forEach((r) => {
            if (tempat.toLowerCase().includes(r.nama.toLowerCase())) {
                cleanName = r.nama;
            }
        });
        setSelectedRantingName(cleanName);
        setIsReadOnly(true);
        setModalOpen(true);
    };

    const handleDelete = async (id: number, tempat: string, hari: string) => {
        const result = await confirmAction({
            title: 'Hapus Jadwal?',
            text: `Apakah Anda yakin ingin menghapus seluruh jadwal latihan (${hari}) di "${tempat}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.delete(`/admin/jadwal-latihan/${id}`, {
                onSuccess: () => {
                    showToast({
                        title: 'Jadwal latihan berhasil dihapus.',
                    });
                },
                onError: () => {
                    showToast({
                        title: 'Gagal menghapus jadwal latihan.',
                        icon: 'error',
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Daftar Jadwal Latihan" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Jadwal Latihan</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Button
                            icon={<Plus className="size-4" />}
                            variant="primary"
                            onClick={handleCreate}
                        >
                            Tambah Jadwal
                        </Button>

                        <Table.Controls
                            isServerSide={false}
                            rowsPerPage={10}
                            setRowsPerPage={() => {}}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari tempat, hari, alamat, kontak..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Tempat / Ranting</Table.Th>
                        <Table.Th>Hari</Table.Th>
                        <Table.Th>Waktu</Table.Th>
                        <Table.Th>Kontak</Table.Th>
                        <Table.Th>Alamat</Table.Th>
                        <Table.Th className="w-24 text-center">Status</Table.Th>
                        <Table.Th stickyRight className="w-72 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {groupedJadwals.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={8} className="p-8 text-center text-zinc-500">
                                    Tidak ada data jadwal latihan yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            groupedJadwals.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{index + 1}</Table.Td>
                                    <Table.Td>{record.tempat.trim()}</Table.Td>
                                    <Table.Td>{record.hari.trim()}</Table.Td>
                                    <Table.Td>{record.waktu.trim()}</Table.Td>
                                    <Table.Td>{record.kontak.trim() || '-'}</Table.Td>
                                    <Table.Td>
                                        <div className="max-w-[250px] truncate" title={record.alamat.trim() || ''}>
                                            {record.alamat.trim() || '-'}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <Badge variant={record.is_active ? 'success' : 'secondary'}>
                                            {record.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                icon={<Eye className="size-3.5" />}
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleDetail(record.tempat)}
                                            >
                                                Detail
                                            </Button>
                                            <Button
                                                icon={<Pencil className="size-3.5" />}
                                                size="sm"
                                                variant="primary"
                                                onClick={() => handleEdit(record.tempat)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                icon={<Trash2 className="size-3.5" />}
                                                size="sm"
                                                variant="danger"
                                                onClick={() => handleDelete(record.id, record.tempat, record.hari)}
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    </Table.Td>
                                </Table.Row>
                            ))
                        )}
                    </Table.Body>
                </Table.Container>
            </Table.Root>

            {/* Modal Form Jadwal Latihan */}
            <JadwalFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                rantings={rantings}
                jadwals={jadwals as any}
                selectedRantingName={selectedRantingName}
                auth={auth}
                readOnly={isReadOnly}
            />
        </AdminLayout>
    );
}
