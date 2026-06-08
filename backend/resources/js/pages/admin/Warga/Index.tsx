import { Head } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';

type WargaRecord = {
    id: number;
    nama: string;
    tingkatan: string;
    ranting?: {
        id?: number;
        nama?: string;
    } | null;
    foto?: string | null;
};

type WargaProps = {
    anggota?: WargaRecord[];
};

const fallbackAnggota: WargaRecord[] = [
    { id: 1, nama: 'Budi Santoso', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Ciputat' }, foto: null },
    { id: 2, nama: 'Siti Rahmawati', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Pamulang' }, foto: null },
    { id: 3, nama: 'Joko Widodo', tingkatan: 'Warga Tingkat II', ranting: { nama: 'Ranting Serpong' }, foto: null },
    { id: 4, nama: 'Ahmad Dahlan', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Cisauk' }, foto: null },
    { id: 5, nama: 'Dewi Sartika', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Tigaraksa' }, foto: null },
    { id: 6, nama: 'Heri Prasetyo', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Cikupa' }, foto: null },
    { id: 7, nama: 'Rina Wijayanti', tingkatan: 'Warga Tingkat II', ranting: { nama: 'Ranting Balaraja' }, foto: null },
    { id: 8, nama: 'Prabowo Subianto', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Curug' }, foto: null },
    { id: 9, nama: 'Megawati Soekarnoputri', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Kosambi' }, foto: null },
    { id: 10, nama: 'Abdurrahman Wahid', tingkatan: 'Warga Tingkat II', ranting: { nama: 'Ranting Legok' }, foto: null },
    { id: 11, nama: 'Susilo Bambang Yudhoyono', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Kronjo' }, foto: null },
    { id: 12, nama: 'Mochammad Ridwan', tingkatan: 'Warga Tingkat I', ranting: { nama: 'Ranting Panongan' }, foto: null },
];

export default function WargaIndex({ anggota = [] }: WargaProps) {
    const initialData = useMemo(() => {
        return anggota.length > 0 ? anggota : fallbackAnggota;
    }, [anggota]);

    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data client-side
    const filteredData = useMemo(() => {
        return initialData.filter((item) => {
            const namaMatch = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
            const tingkatanMatch = item.tingkatan.toLowerCase().includes(searchTerm.toLowerCase());
            const rantingMatch = (item.ranting?.nama ?? '').toLowerCase().includes(searchTerm.toLowerCase());

            return namaMatch || tingkatanMatch || rantingMatch;
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
            <Head title="Data Warga" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Data Warga</h1>
                        <p className="text-sm text-zinc-500">Kelola informasi keanggotaan warga PSHT Kabupaten Tangerang.</p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Button
                            icon={<Plus className="size-4" />}
                            variant="primary"
                        >
                            Tambah Warga
                        </Button>

                        <Table.Controls
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari nama, tingkatan, ranting..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Nama Warga</Table.Th>
                        <Table.Th>Tingkatan</Table.Th>
                        <Table.Th>Ranting</Table.Th>
                        <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {paginatedData.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={5} className="p-8 text-center text-zinc-500">
                                    Tidak ada data warga yang sesuai.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            paginatedData.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td className="font-semibold text-zinc-800">{record.nama}</Table.Td>
                                    <Table.Td>{record.tingkatan}</Table.Td>
                                    <Table.Td>{record.ranting?.nama ?? '-'}</Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
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
                        Menampilkan {fromIndex} sampai {toIndex} dari {filteredData.length} data
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
