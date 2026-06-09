import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Newspaper } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';

type BeritaRecord = {
    id: number;
    judul: string;
    slug: string;
    isi: string;
    gambar?: string | null;
    kategori?: string | null;
    status: 'draft' | 'published';
    penulis?: {
        name: string;
    } | null;
    ranting?: string | null;
    created_at: string;
};

type BeritaProps = {
    berita?: BeritaRecord[];
};

export default function BeritaIndex({ berita = [] }: BeritaProps) {
    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data client-side
    const filteredData = useMemo(() => {
        return berita.filter((item) => {
            const judulMatch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
            const kategoriMatch = (item.kategori || '').toLowerCase().includes(searchTerm.toLowerCase());
            const penulisMatch = (item.penulis?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = item.status.toLowerCase().includes(searchTerm.toLowerCase());

            return judulMatch || kategoriMatch || penulisMatch || statusMatch;
        });
    }, [berita, searchTerm]);

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
            title: 'Hapus Berita?',
            text: `Apakah Anda yakin ingin menghapus berita "${judul}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (result.isConfirmed) {
            router.delete(`/admin/berita/${id}`, {
                onSuccess: () => {
                    showToast({
                        title: 'Berita berhasil dihapus.',
                    });
                },
                onError: () => {
                    showToast({
                        title: 'Gagal menghapus berita.',
                        icon: 'error',
                    });
                }
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Daftar Berita" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Daftar Berita</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Link href="/admin/berita/create">
                            <Button
                                icon={<Plus className="size-4" />}
                                variant="primary"
                            >
                                Buat Berita
                            </Button>
                        </Link>

                        <Table.Controls
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari judul, kategori, status..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Judul Berita</Table.Th>
                        <Table.Th className="w-20 text-center">Sampul</Table.Th>
                        <Table.Th>Kategori</Table.Th>
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
                                    Tidak ada data berita yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            paginatedData.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td className="font-medium text-zinc-900 max-w-xs truncate">{record.judul}</Table.Td>
                                    <Table.Td className="text-center">
                                        <div className="flex justify-center">
                                            {record.gambar ? (
                                                <img
                                                    src={record.gambar}
                                                    alt={record.judul}
                                                    className="size-10 rounded-md object-cover border border-zinc-200"
                                                />
                                            ) : (
                                                <div className="size-10 rounded-md bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-400">
                                                    <Newspaper className="size-5" />
                                                </div>
                                            )}
                                        </div>
                                    </Table.Td>
                                    <Table.Td>{record.kategori || '-'}</Table.Td>
                                    <Table.Td>{record.penulis?.name || '-'}</Table.Td>
                                    <Table.Td>{record.ranting || '-'}</Table.Td>
                                    <Table.Td>
                                        {record.status === 'published' ? (
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
                                            <Link href={`/admin/berita/${record.id}/edit`}>
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
                            ))
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
