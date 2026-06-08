import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

type UserRecord = {
    id: number;
    name: string;
    ranting?: string | null;
    kontribusi?: {
        tulisan: number;
        galeri: number;
    } | null;
};

type KontributorProps = {
    users?: UserRecord[];
};

const fallbackUsers: UserRecord[] = [
    {
        id: 1,
        name: 'Adi Hidayat',
        ranting: 'Ranting Ciputat',
        kontribusi: { tulisan: 12, galeri: 5 },
    },
    {
        id: 2,
        name: 'Slamet Riyadi',
        ranting: 'Ranting Pamulang',
        kontribusi: { tulisan: 8, galeri: 3 },
    },
    {
        id: 3,
        name: 'Ki Hajar Dewantara',
        ranting: 'Ranting Serpong',
        kontribusi: { tulisan: 25, galeri: 0 },
    },
    {
        id: 4,
        name: 'Raden Ajeng Kartini',
        ranting: 'Ranting Cisauk',
        kontribusi: { tulisan: 14, galeri: 9 },
    },
    {
        id: 5,
        name: 'Cut Nyak Dhien',
        ranting: 'Ranting Tigaraksa',
        kontribusi: { tulisan: 19, galeri: 2 },
    },
];

export default function KontributorIndex({ users = [] }: KontributorProps) {
    const initialData = useMemo(() => {
        return users.length > 0 ? users : fallbackUsers;
    }, [users]);

    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data client-side
    const filteredData = useMemo(() => {
        return initialData.filter((item) => {
            const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const rantingMatch = (item.ranting ?? '').toLowerCase().includes(searchTerm.toLowerCase());

            return nameMatch || rantingMatch;
        });
    }, [initialData, searchTerm]);

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

    return (
        <AdminLayout>
            <Head title="Data Kontributor" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Data Kontributor</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Button
                            icon={<Plus className="size-4" />}
                            variant="primary"
                        >
                            Tambah Kontributor
                        </Button>

                        <Table.Controls
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari nama, ranting..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Nama Kontributor</Table.Th>
                        <Table.Th>Ranting</Table.Th>
                        <Table.Th>Jumlah Kontribusi</Table.Th>
                        <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {paginatedData.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={5} className="p-8 text-center text-zinc-500">
                                    Tidak ada data kontributor yang sesuai.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            paginatedData.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td>{record.name}</Table.Td>
                                    <Table.Td>{record.ranting ?? '-'}</Table.Td>
                                    <Table.Td>
                                        {record.kontribusi?.tulisan ?? 0} Tulisan, {record.kontribusi?.galeri ?? 0} Galeri
                                    </Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="warning"
                                                icon={<Pencil className="size-3.5" />}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                icon={<Trash2 className="size-3.5" />}
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
