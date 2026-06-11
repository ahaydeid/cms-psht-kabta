import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';
import { RantingFormModal } from './RantingFormModal';

type RantingRecord = {
    id: number;
    nama: string;
    alamat: string | null;
    ketua: string | null;
    kontak: string | null;
    created_at: string;
    updated_at: string;
};

type RantingPagination = {
    current_page: number;
    data: RantingRecord[];
    per_page: number;
    total: number;
    last_page: number;
};

type RantingFilters = {
    page: number;
    per_page: number;
    search: string;
};

type RantingProps = {
    ranting: RantingPagination;
    filters: RantingFilters;
};

export default function RantingIndex({ ranting, filters }: RantingProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [rowsPerPage, setRowsPerPage] = useState(filters.per_page);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedRanting, setSelectedRanting] = useState<RantingRecord | undefined>();

    const applyFilters = (nextFilters: Partial<RantingFilters>) => {
        router.get(
            '/admin/ranting',
            {
                page: nextFilters.page ?? filters.page,
                per_page: nextFilters.per_page ?? rowsPerPage,
                search: nextFilters.search ?? searchTerm,
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

    const fromIndex = ranting.data.length === 0 ? 0 : (ranting.current_page - 1) * ranting.per_page + 1;
    const toIndex = Math.min(ranting.current_page * ranting.per_page, ranting.total);

    const handleDelete = async (id: number, nama: string) => {
        const result = await confirmAction({
            title: 'Hapus Ranting?',
            text: `Apakah Anda yakin ingin menghapus Ranting "${nama}"? Data warga yang terkait dengan ranting ini mungkin akan terpengaruh.`,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.delete(`/admin/ranting/${id}`, {
                onSuccess: () => {
                    showToast({
                        title: 'Ranting berhasil dihapus.',
                    });
                },
                onError: () => {
                    showToast({
                        title: 'Gagal menghapus ranting.',
                        icon: 'error',
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Master Ranting" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Master Ranting</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Button
                            icon={<Plus className="size-4" />}
                            variant="primary"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Tambah Ranting
                        </Button>

                        <Table.Controls
                            isServerSide
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={(value) => {
                                setRowsPerPage(value);
                                applyFilters({ page: 1, per_page: value });
                            }}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari nama ranting, ketua..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Nama Ranting</Table.Th>
                        <Table.Th>Ketua Ranting</Table.Th>
                        <Table.Th>Sekretariat</Table.Th>
                        <Table.Th>Kontak</Table.Th>
                        <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {ranting.data.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={6} className="p-8 text-center text-zinc-500">
                                    Tidak ada data ranting yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            ranting.data.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td className="text-zinc-900">{record.nama}</Table.Td>
                                    <Table.Td>{record.ketua || '-'}</Table.Td>
                                    <Table.Td className="max-w-xs truncate">{record.alamat || '-'}</Table.Td>
                                    <Table.Td>{record.kontak || '-'}</Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                icon={<Pencil className="size-3.5" />}
                                                onClick={() => setSelectedRanting(record)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                icon={<Trash2 className="size-3.5" />}
                                                onClick={() => handleDelete(record.id, record.nama)}
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

                <div className="flex flex-row items-center justify-between text-sm text-zinc-500 w-full">
                    <p className="text-left">
                        {fromIndex}–{toIndex} dari {ranting.total} data
                    </p>

                    <Table.Pagination
                        isServerSide
                        page={ranting.current_page}
                        totalPages={ranting.last_page}
                        setPage={() => {}}
                        onPageChange={(page) => applyFilters({ page })}
                    />
                </div>
            </Table.Root>

            <RantingFormModal
                mode="create"
                onClose={() => setIsCreateOpen(false)}
                open={isCreateOpen}
                submitUrl="/admin/ranting"
            />

            {selectedRanting && (
                <RantingFormModal
                    initialData={selectedRanting}
                    mode="edit"
                    onClose={() => setSelectedRanting(undefined)}
                    open={!!selectedRanting}
                    submitUrl={`/admin/ranting/${selectedRanting.id}`}
                />
            )}
        </AdminLayout>
    );
}
