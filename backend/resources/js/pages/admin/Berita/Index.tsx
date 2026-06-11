import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Image } from 'lucide-react';
import { useEffect, useState } from 'react';

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

type BeritaPagination = {
    current_page: number;
    data: BeritaRecord[];
    per_page: number;
    total: number;
    last_page: number;
};

type BeritaFilters = {
    page: number;
    per_page: number;
    search: string;
    ranting: string;
};

type BeritaProps = {
    berita: BeritaPagination;
    filters: BeritaFilters;
    rantings?: RantingRecord[];
};

export default function BeritaIndex({ berita, filters, rantings = [] }: BeritaProps) {
    const { props } = usePage<any>();
    const isAdmin = props.auth?.user?.role === 'admin';

    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [selectedRanting, setSelectedRanting] = useState(filters.ranting);
    const [rowsPerPage, setRowsPerPage] = useState(filters.per_page);

    const applyFilters = (nextFilters: Partial<BeritaFilters>) => {
        router.get(
            '/admin/berita',
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

    const fromIndex = berita.data.length === 0 ? 0 : (berita.current_page - 1) * berita.per_page + 1;
    const toIndex = Math.min(berita.current_page * berita.per_page, berita.total);

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
                        {berita.data.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={9} className="p-8 text-center text-zinc-500">
                                    Tidak ada data berita yang ditemukan.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            berita.data.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td className="font-medium text-zinc-900 max-w-xs truncate">{record.judul}</Table.Td>
                                    <Table.Td className="text-center">
                                        <div className="flex justify-center">
                                            {record.gambar ? (
                                                <img
                                                    src={record.gambar}
                                                    alt={record.judul}
                                                    className="size-10 rounded object-cover border border-zinc-200"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center text-zinc-400">
                                                    <Image className="size-10" />
                                                </div>
                                            )}
                                        </div>
                                    </Table.Td>
                                    <Table.Td>{record.kategori || '-'}</Table.Td>
                                    <Table.Td>{record.penulis?.name || '-'}</Table.Td>
                                    <Table.Td>{record.penulis?.keanggotaan?.ranting?.nama || '-'}</Table.Td>
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
                        {fromIndex}–{toIndex} dari {berita.total} data
                    </p>

                    <Table.Pagination
                        isServerSide
                        page={berita.current_page}
                        totalPages={berita.last_page}
                        setPage={() => {}}
                        onPageChange={(page) => applyFilters({ page })}
                    />
                </div>
            </Table.Root>
        </AdminLayout>
    );
}
