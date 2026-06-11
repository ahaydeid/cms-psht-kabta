import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/Layouts/AdminLayout';
import PesanTable, { type PesanRecord } from '@/pages/admin/Pesan/components/PesanTable';
import PesanModal from '@/pages/admin/Pesan/components/PesanModal';

type PesanFilters = {
    page: number;
    perPage: number;
    search: string;
    ranting?: string;
};

type PesanIndexProps = {
    items: PesanRecord[];
    meta: {
        currentPage: number;
        lastPage: number;
        perPage: number;
        total: number;
        from: number | null;
        to: number | null;
    };
    filters: PesanFilters;
    rantingOptions: string[];
};

export default function PesanIndex({ items, meta, filters, rantingOptions }: PesanIndexProps) {
    const [selectedPesan, setSelectedPesan] = useState<PesanRecord | null>(null);

    const handleSearch = (search: string) => {
        router.get(
            '/admin/pesan',
            { search, per_page: filters.perPage, ranting: filters.ranting },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/pesan',
            { search: filters.search, page, per_page: filters.perPage, ranting: filters.ranting },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            '/admin/pesan',
            { search: filters.search, per_page: perPage, ranting: filters.ranting },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleRantingChange = (ranting: string) => {
        router.get(
            '/admin/pesan',
            { search: filters.search, per_page: filters.perPage, ranting },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleDetail = (pesan: PesanRecord) => {
        setSelectedPesan(pesan);
    };

    const handleMarkAsRead = (pesan: PesanRecord) => {
        router.put(`/admin/pesan/${pesan.id}`, {
            is_read: true,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/pesan/${id}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (selectedPesan?.id === id) {
                    setSelectedPesan(null);
                }
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Pesan Kontak" />
            
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">Pesan Masuk</h1>
                </div>

                <PesanTable
                    data={items.map((item, index) => ({
                        ...item,
                        no: (meta.currentPage - 1) * meta.perPage + index + 1,
                    }))}
                    meta={meta}
                    filters={filters}
                    rantingOptions={rantingOptions}
                    onSearch={handleSearch}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    onRantingChange={handleRantingChange}
                    onDetail={handleDetail}
                />

                <PesanModal
                    open={selectedPesan !== null}
                    onClose={() => setSelectedPesan(null)}
                    data={selectedPesan}
                    onMarkAsRead={() => {
                        if (selectedPesan) {
                            handleMarkAsRead(selectedPesan);
                            // Optimistically update the selected message so it shows as read
                            setSelectedPesan({ ...selectedPesan, is_read: true });
                        }
                    }}
                    onDelete={handleDelete}
                />
            </div>
        </AdminLayout>
    );
}
