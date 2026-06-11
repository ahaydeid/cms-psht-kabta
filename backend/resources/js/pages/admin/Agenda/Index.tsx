import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';
import AgendaTable, { type AgendaRecord } from './components/AgendaTable';
import AgendaModal from './components/AgendaModal';

type AgendaFormPayload = Omit<AgendaRecord, 'id'>;
type AgendaModalMode = 'create' | 'detail' | 'edit';

type AgendaFilters = {
    page: number;
    per_page: number;
    search: string;
};

type AgendaIndexProps = {
    items: AgendaRecord[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: {
        search: string;
        perPage: number;
    };
};

export default function AgendaIndex({ items, meta, filters }: AgendaIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [rowsPerPage, setRowsPerPage] = useState(filters.perPage);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState<AgendaRecord | null>(null);
    const [modalMode, setModalMode] = useState<AgendaModalMode>('create');
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const applyFilters = (nextFilters: Partial<AgendaFilters>) => {
        router.get(
            '/admin/agenda',
            {
                page: nextFilters.page ?? 1,
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

    const handleDetail = (item: AgendaRecord) => {
        setEditData(item);
        setModalMode('detail');
        setValidationErrors({});
        setModalOpen(true);
    };

    const handleEdit = (item: AgendaRecord) => {
        setEditData(item);
        setModalMode('edit');
        setValidationErrors({});
        setModalOpen(true);
    };

    const handleSave = async (payload: AgendaFormPayload) => {
        const actionText = editData ? 'memperbarui' : 'menyimpan';
        const result = await confirmAction({
            title: editData ? 'Konfirmasi perubahan agenda' : 'Konfirmasi simpan agenda',
            text: `Apakah Anda yakin ingin ${actionText} agenda kegiatan ini?`,
            confirmButtonText: editData ? 'Ya, perbarui' : 'Ya, simpan',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        return new Promise<void>((resolve, reject) => {
            const options = {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditData(null);
                    setValidationErrors({});
                    showToast({
                        title: editData ? 'Agenda kegiatan berhasil diperbarui.' : 'Agenda kegiatan berhasil ditambahkan.',
                    });
                    resolve();
                },
                onError: (err: any) => {
                    setValidationErrors(err);
                    reject(new Error(Object.values(err)[0] as string || 'Gagal menyimpan agenda.'));
                },
            };

            if (editData) {
                router.put(`/admin/agenda/${editData.id}`, payload, options);
            } else {
                router.post('/admin/agenda', payload, options);
            }
        });
    };

    const handleDelete = async (id: number, judul?: string) => {
        const targetTitle = judul || items.find((item) => item.id === id)?.judul || 'ini';
        const result = await confirmAction({
            title: 'Hapus agenda kegiatan?',
            text: `Apakah Anda yakin ingin menghapus agenda "${targetTitle}"? Tindakan ini tidak dapat dibatalkan.`,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            variant: 'danger',
        });

        if (!result.isConfirmed) return;

        return new Promise<void>((resolve, reject) => {
            router.delete(`/admin/agenda/${id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setModalOpen(false);
                    setEditData(null);
                    showToast({
                        title: 'Agenda kegiatan telah dihapus.',
                    });
                    resolve();
                },
                onError: (err) => {
                    reject(new Error(Object.values(err)[0] || 'Gagal menghapus agenda kegiatan.'));
                },
            });
        });
    };

    const fromIndex = meta.total === 0 ? 0 : meta.from;
    const toIndex = meta.total === 0 ? 0 : meta.to;

    return (
        <AdminLayout>
            <Head title="Agenda Kegiatan" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Agenda Kegiatan</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <div>
                            <Button
                                onClick={() => {
                                    setEditData(null);
                                    setModalMode('create');
                                    setValidationErrors({});
                                    setModalOpen(true);
                                }}
                                icon={<Plus className="size-4" />}
                                variant="primary"
                                className="text-zinc-950!"
                            >
                                Tambah Agenda
                            </Button>
                        </div>

                        <Table.Controls
                            isServerSide
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={(value) => {
                                setRowsPerPage(value);
                                applyFilters({ page: 1, per_page: value });
                            }}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari agenda / kategori / detail..."
                        />
                    </div>
                </div>

                <AgendaTable
                    data={items.map((record, index) => ({
                        ...record,
                        no: (meta.from ?? 1) + index,
                    }))}
                    onDetail={handleDetail}
                    onEdit={handleEdit}
                    onDelete={(id, judul) => void handleDelete(id, judul)}
                />

                <div className="flex flex-row items-center justify-between text-sm text-zinc-500 w-full">
                    <p className="text-left">
                        {fromIndex}–{toIndex} dari {meta.total} data
                    </p>

                    <Table.Pagination
                        isServerSide
                        page={meta.currentPage}
                        totalPages={meta.lastPage}
                        setPage={() => {}}
                        onPageChange={(page) => applyFilters({ page })}
                    />
                </div>
            </Table.Root>

            <AgendaModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditData(null);
                }}
                data={editData}
                mode={modalMode}
                onRequestEdit={() => setModalMode('edit')}
                onSave={handleSave}
                onDelete={(id) => handleDelete(id)}
                errors={validationErrors}
            />
        </AdminLayout>
    );
}
