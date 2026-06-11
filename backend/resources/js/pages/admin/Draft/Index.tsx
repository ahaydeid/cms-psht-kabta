import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';

type DraftRecord = {
    id: number;
    type: 'berita' | 'galeri';
    judul: string;
    keterangan_atau_kategori: string;
    penulis: string;
    ranting: string;
    created_at: string;
    updated_at: string;
};

type DraftPagination = {
    current_page: number;
    data: DraftRecord[];
    per_page: number;
    total: number;
    last_page: number;
};

type DraftFilters = {
    page: number;
    per_page: number;
    search: string;
};

type DraftProps = {
    drafts: DraftPagination;
    filters: DraftFilters;
};

export default function DraftIndex({ drafts, filters }: DraftProps) {
    const [rowsPerPage, setRowsPerPage] = useState(filters.per_page);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const applyFilters = (nextFilters: Partial<DraftFilters>) => {
        router.get(
            '/admin/draft',
            {
                page: nextFilters.page ?? filters.page,
                per_page: nextFilters.per_page ?? rowsPerPage,
                search: nextFilters.hasOwnProperty('search') ? nextFilters.search : searchTerm,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== filters.search) {
                applyFilters({ page: 1, search: searchTerm });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fromIndex = drafts.data.length === 0 ? 0 : (drafts.current_page - 1) * drafts.per_page + 1;
    const toIndex = Math.min(drafts.current_page * drafts.per_page, drafts.total);

    const handlePublish = async (record: DraftRecord) => {
        const result = await confirmAction({
            title: `Terbitkan ${record.type === 'berita' ? 'Berita' : 'Galeri'}?`,
            text: `Apakah Anda yakin ingin menerbitkan "${record.judul}" sekarang? Konten akan langsung terlihat oleh publik.`,
            confirmButtonText: 'Ya, Terbitkan',
            cancelButtonText: 'Batal',
            variant: 'primary',
        });

        if (result.isConfirmed) {
            router.post(`/admin/draft/${record.type}/${record.id}/publish`, {}, {
                onSuccess: () => {
                    showToast({
                        title: `${record.type === 'berita' ? 'Berita' : 'Galeri'} berhasil diterbitkan.`,
                    });
                },
                onError: () => {
                    showToast({
                        title: `Gagal menerbitkan ${record.type}.`,
                        icon: 'error',
                    });
                }
            });
        }
    };

    const handleDelete = async (record: DraftRecord) => {
        const result = await confirmAction({
            title: `Hapus Draft ${record.type === 'berita' ? 'Berita' : 'Galeri'}?`,
            text: `Apakah Anda yakin ingin menghapus draft "${record.judul}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.delete(`/admin/draft/${record.type}/${record.id}`, {
                onSuccess: () => {
                    showToast({
                        title: `Draft ${record.type === 'berita' ? 'Berita' : 'Galeri'} berhasil dihapus.`,
                    });
                },
                onError: () => {
                    showToast({
                        title: `Gagal menghapus draft.`,
                        icon: 'error',
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Draft Konten" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Draft Konten</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end w-full">
                        <Table.Controls
                            isServerSide
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={(value) => {
                                setRowsPerPage(value);
                                applyFilters({ page: 1, per_page: value });
                            }}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari draft..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Judul Konten</Table.Th>
                        <Table.Th className="w-28 text-center">Tipe</Table.Th>
                        <Table.Th>Kategori / Keterangan</Table.Th>
                        <Table.Th>Penulis</Table.Th>
                        <Table.Th>Ranting</Table.Th>
                        <Table.Th>Terakhir Diubah</Table.Th>
                        <Table.Th stickyRight className="w-64 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {drafts.data.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={8} className="p-8 text-center text-zinc-500">
                                    Tidak ada draft konten saat ini.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            drafts.data.map((record, index) => (
                                <Table.Row key={`${record.type}-${record.id}`}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td className="font-medium text-zinc-900 max-w-xs truncate" title={record.judul}>
                                        {record.judul}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <Badge variant="outline" size="sm">
                                            {record.type === 'berita' ? 'Berita' : 'Galeri'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td className="text-zinc-500 max-w-xs truncate" title={record.keterangan_atau_kategori}>
                                        {record.keterangan_atau_kategori}
                                    </Table.Td>
                                    <Table.Td className="text-zinc-700">{record.penulis}</Table.Td>
                                    <Table.Td className="text-zinc-600">{record.ranting}</Table.Td>
                                    <Table.Td className="text-zinc-500">
                                        {new Date(record.updated_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex justify-center gap-2">
                                            <Link href={`/admin/${record.type}/${record.id}/edit`}>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    icon={<Eye className="size-3.5" />}
                                                >
                                                    Tinjau
                                                </Button>
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                icon={<Send className="size-3.5" />}
                                                onClick={() => handlePublish(record)}
                                            >
                                                Terbitkan
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                icon={<Trash2 className="size-3.5" />}
                                                onClick={() => handleDelete(record)}
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

                <div className="flex flex-row items-center justify-between text-sm text-zinc-500 w-full mt-4">
                    <p className="text-left">
                        {fromIndex}–{toIndex} dari {drafts.total} data
                    </p>

                    <Table.Pagination
                        isServerSide
                        page={drafts.current_page}
                        totalPages={drafts.last_page}
                        setPage={() => {}}
                        onPageChange={(page) => applyFilters({ page })}
                    />
                </div>
            </Table.Root>
        </AdminLayout>
    );
}
