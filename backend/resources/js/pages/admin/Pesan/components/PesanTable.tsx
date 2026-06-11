import { Eye } from 'lucide-react';
import { Table } from '@/Components/Base/Table';
import { Button, Select } from '@/Components/ui';
import { useEffect, useState } from 'react';

export type PesanRecord = {
    id: number;
    nama: string;
    email: string;
    ranting?: string | null;
    subjek?: string | null;
    pesan: string;
    is_read: boolean;
    created_at: string;
};

type PesanTableProps = {
    data: (PesanRecord & { no: number })[];
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
        ranting?: string;
    };
    rantingOptions: string[];
    onSearch: (search: string) => void;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    onRantingChange: (ranting: string) => void;
    onDetail: (item: PesanRecord) => void;
};

export default function PesanTable({
    data,
    meta,
    filters,
    rantingOptions,
    onSearch,
    onPageChange,
    onPerPageChange,
    onRantingChange,
    onDetail
}: PesanTableProps) {
    const [searchValue, setSearchValue] = useState(filters.search);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== filters.search) {
                onSearch(searchValue);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchValue, filters.search, onSearch]);

    return (
        <Table.Root>
            <Table.Controls
                isServerSide
                rowsPerPage={filters.perPage}
                setRowsPerPage={onPerPageChange}
                searchTerm={searchValue}
                setSearchTerm={setSearchValue}
                placeholder="Cari nama, email, subjek..."
            />

            <Table.Container>
                <Table.Header>
                    <Table.Th className="w-16 text-center">No</Table.Th>
                    <Table.Th className="w-48">Pengirim</Table.Th>
                    <Table.Th className="w-52">Email</Table.Th>
                    <Table.Th className="w-40">Ranting</Table.Th>
                    <Table.Th className="w-40">Subjek</Table.Th>
                    <Table.Th className="min-w-[12rem]">Pesan</Table.Th>
                    <Table.Th stickyRight className="w-24 text-center">Aksi</Table.Th>
                </Table.Header>

                <Table.Body>
                    {data.length === 0 ? (
                        <Table.Row>
                            <Table.Td colSpan={7} className="p-8 text-center text-zinc-500">
                                Tidak ada pesan yang ditemukan.
                            </Table.Td>
                        </Table.Row>
                    ) : (
                        data.map((record) => {
                            const isUnread = !record.is_read;
                            const rowStyle = isUnread ? { backgroundColor: '#0ea5e9', color: '#ffffff' } : undefined;
                            const textClass = isUnread ? "" : "text-zinc-600";

                            return (
                                <Table.Row key={record.id}>
                                    <Table.Td style={rowStyle} className={`text-center ${textClass}`}>{record.no}</Table.Td>
                                    <Table.Td style={rowStyle} className={textClass}>{record.nama}</Table.Td>
                                    <Table.Td style={rowStyle} className={textClass}>{record.email}</Table.Td>
                                    <Table.Td style={rowStyle} className={textClass}>{record.ranting || '-'}</Table.Td>
                                    <Table.Td style={rowStyle} className={textClass}>{record.subjek || '-'}</Table.Td>
                                    <Table.Td style={rowStyle} className={textClass}>
                                        <div className="truncate max-w-[16rem] sm:max-w-xs">
                                            {record.pesan}
                                        </div>
                                    </Table.Td>
                                    <Table.Td stickyRight style={rowStyle} className={textClass}>
                                        <div className="flex justify-center">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                icon={<Eye className="size-3.5" />}
                                                onClick={() => onDetail(record)}
                                                title="Detail"
                                            />
                                        </div>
                                    </Table.Td>
                                </Table.Row>
                            );
                        })
                    )}
                </Table.Body>
            </Table.Container>

            <div className="flex flex-row items-center justify-between text-sm text-zinc-500 w-full border-t border-zinc-100 pt-4">
                <p className="text-left">
                    {meta.total === 0 ? '0–0' : `${meta.from ?? 0}–${meta.to ?? 0}`} dari {meta.total} data
                </p>

                <div className="flex items-center gap-3">
                    <Select
                        className="h-9 py-1 px-3 min-w-[12rem] bg-white border-zinc-200 text-xs"
                        containerClassName="w-auto"
                        value={filters.ranting || 'all'}
                        onChange={(e) => onRantingChange(e.target.value)}
                    >
                        <option value="all">Semua Ranting</option>
                        {rantingOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Select>

                    <Table.Pagination
                        isServerSide
                        page={meta.currentPage}
                        totalPages={meta.lastPage || 1}
                        setPage={() => {}}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
        </Table.Root>
    );
}
