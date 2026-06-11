import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';
import { GaleriDetailModal } from './GaleriDetailModal';

type GaleriRecord = {
    id: number;
    judul: string;
    file_path: string[];
    keterangan?: string | null;
    status: 'active' | 'inactive';
    penulis?: {
        name: string;
        keanggotaan?: {
            ranting?: {
                id: number;
                nama: string;
            } | null;
        } | null;
    } | null;
    created_at: string;
};

type RantingRecord = {
    id: number;
    nama: string;
};

type GaleriPagination = {
    current_page: number;
    data: GaleriRecord[];
    per_page: number;
    total: number;
    last_page: number;
};

type GaleriFilters = {
    page: number;
    per_page: number;
    search: string;
    ranting: string;
};

type GaleriProps = {
    galeri: GaleriPagination;
    filters: GaleriFilters;
    rantings?: RantingRecord[];
};

export default function GaleriIndex({ galeri, filters, rantings = [] }: GaleriProps) {
    const { props } = usePage<any>();
    const isAdmin = props.auth?.user?.role === 'admin';

    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedRanting, setSelectedRanting] = useState(filters.ranting);
    const [rowsPerPage, setRowsPerPage] = useState(filters.per_page);
    const [detailGaleri, setDetailGaleri] = useState<GaleriRecord | null>(null);

    const applyFilters = (nextFilters: Partial<GaleriFilters>) => {
        router.get(
            '/admin/galeri',
            {
                page: nextFilters.page ?? filters.page,
                per_page: nextFilters.per_page ?? rowsPerPage,
                search: nextFilters.search ?? searchTerm,
                ranting: nextFilters.ranting ?? selectedRanting,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (searchTerm === filters.search) {
                return;
            }

            applyFilters({ page: 1, search: searchTerm });
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [filters.search, searchTerm]);

    const fromIndex = galeri.data.length === 0 ? 0 : (galeri.current_page - 1) * galeri.per_page + 1;
    const toIndex = Math.min(galeri.current_page * galeri.per_page, galeri.total);

    const handleDelete = async (id: number, judul: string) => {
        const result = await confirmAction({
            title: 'Hapus Galeri?',
            text: `Apakah Anda yakin ingin menghapus galeri "${judul}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.delete(`/admin/galeri/${id}`, {
                onSuccess: () => {
                    showToast({
                        title: 'Galeri berhasil dihapus.',
                    });
                },
                onError: () => {
                    showToast({
                        title: 'Gagal menghapus galeri.',
                        icon: 'error',
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Daftar Galeri" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Daftar Galeri</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Link href="/admin/galeri/create">
                            <Button
                                icon={<Plus className="size-4" />}
                                variant="primary"
                            >
                                Buat Galeri
                            </Button>
                        </Link>

                        <Table.Controls
                            controlsEnd={
                                !isAdmin && (
                                    <select
                                        className="rounded border border-zinc-200 bg-white px-3 py-2 text-zinc-700 outline-none focus:border-sky-400"
                                        value={selectedRanting}
                                        onChange={(e) => {
                                            const nextRanting = e.target.value;
                                            setSelectedRanting(nextRanting);
                                            applyFilters({ page: 1, ranting: nextRanting });
                                        }}
                                    >
                                        <option value="">Semua</option>
                                        {rantings.map((r) => (
                                            <option key={r.id} value={r.id.toString()}>
                                                {r.nama}
                                            </option>
                                        ))}
                                    </select>
                                )
                            }
                            isServerSide
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={(value) => {
                                setRowsPerPage(value);
                                applyFilters({ page: 1, per_page: value });
                            }}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari judul, keterangan, status..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Judul Galeri</Table.Th>
                        <Table.Th>Deskripsi</Table.Th>
                        <Table.Th>Jumlah Foto</Table.Th>
                        <Table.Th>Kontributor</Table.Th>
                        <Table.Th>Ranting</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Tanggal</Table.Th>
                        <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {galeri.data.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={9} className="p-8 text-center text-zinc-500">
                                    Tidak ada data galeri yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            galeri.data.map((record, index) => {
                                const images = record.file_path || [];

                                return (
                                    <Table.Row key={record.id}>
                                        <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                        <Table.Td className="font-medium text-zinc-900 max-w-xs truncate">{record.judul}</Table.Td>
                                        <Table.Td className="text-zinc-500 max-w-xs truncate">{record.keterangan || '-'}</Table.Td>
                                        <Table.Td>{images.length} Foto</Table.Td>
                                        <Table.Td>{record.penulis?.name || '-'}</Table.Td>
                                        <Table.Td>{record.penulis?.keanggotaan?.ranting?.nama || '-'}</Table.Td>
                                        <Table.Td>
                                            {record.status === 'active' ? (
                                                <Badge variant="success" size="sm">
                                                    Diterbitkan
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" size="sm">
                                                    Draf
                                                </Badge>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            {new Date(record.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </Table.Td>
                                        <Table.Td stickyRight>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    icon={<Eye className="size-3.5" />}
                                                    onClick={() => setDetailGaleri(record)}
                                                >
                                                    Detail
                                                </Button>
                                                <Link href={`/admin/galeri/${record.id}/edit`}>
                                                    <Button
                                                        size="sm"
                                                        variant="warning"
                                                        icon={<Pencil className="size-3.5" />}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    icon={<Trash2 className="size-3.5" />}
                                                    onClick={() => handleDelete(record.id, record.judul)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </Table.Td>
                                    </Table.Row>
                                );
                            })
                        )}
                    </Table.Body>
                </Table.Container>

                <div className="flex flex-row items-center justify-between text-sm text-zinc-500 w-full">
                    <p className="text-left">
                        {fromIndex}–{toIndex} dari {galeri.total} data
                    </p>

                    <Table.Pagination
                        isServerSide
                        page={galeri.current_page}
                        totalPages={galeri.last_page}
                        setPage={() => {}}
                        onPageChange={(page) => applyFilters({ page })}
                    />
                </div>
            </Table.Root>

            <GaleriDetailModal
                galeri={detailGaleri}
                onClose={() => setDetailGaleri(null)}
            />
        </AdminLayout>
    );
}
