import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';

type GaleriRecord = {
    id: number;
    judul: string;
    file_path: string[];
    keterangan?: string | null;
    status: 'active' | 'inactive';
    penulis?: {
        name: string;
    } | null;
    ranting?: string | null;
    created_at: string;
};

type GaleriProps = {
    galeri?: GaleriRecord[];
};

export default function GaleriIndex({ galeri = [] }: GaleriProps) {
    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data client-side
    const filteredData = useMemo(() => {
        return galeri.filter((item) => {
            const judulMatch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
            const keteranganMatch = (item.keterangan || '').toLowerCase().includes(searchTerm.toLowerCase());
            const penulisMatch = (item.penulis?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = item.status.toLowerCase().includes(searchTerm.toLowerCase());

            return judulMatch || keteranganMatch || penulisMatch || statusMatch;
        });
    }, [galeri, searchTerm]);

    // Paginate Data client-side
    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    // Reset to page 1 on filter/size change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    const fromIndex = filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const toIndex = Math.min(currentPage * rowsPerPage, filteredData.length);

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
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
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
                        {paginatedData.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={9} className="p-8 text-center text-zinc-500">
                                    Tidak ada data galeri yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            paginatedData.map((record, index) => {
                                const images = record.file_path || [];

                                return (
                                    <Table.Row key={record.id}>
                                        <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                        <Table.Td className="font-medium text-zinc-900 max-w-xs truncate">{record.judul}</Table.Td>
                                        <Table.Td className="text-zinc-500 max-w-xs truncate">{record.keterangan || '-'}</Table.Td>
                                        <Table.Td>{images.length} Foto</Table.Td>
                                        <Table.Td>{record.penulis?.name || '-'}</Table.Td>
                                        <Table.Td>{record.ranting || '-'}</Table.Td>
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
                        {fromIndex}–{toIndex} dari {filteredData.length} data
                    </p>

                    <Table.Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        setPage={setCurrentPage}
                    />
                </div>
            </Table.Root>
        </AdminLayout>
    );
}
