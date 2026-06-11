import { Pencil, Trash2, Eye } from 'lucide-react';
import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';

export type AgendaRecord = {
    id: number;
    judul: string;
    keterangan?: string | null;
    tanggal: string;
    waktu_mulai?: string | null;
    waktu_selesai?: string | null;
    kategori: string;
    tipe_hari: 'KEGIATAN' | 'PENTING' | 'LIBUR';
    status: 'active' | 'inactive';
};

type AgendaTableProps = {
    data: (AgendaRecord & { no: number })[];
    onDetail: (item: AgendaRecord) => void;
    onEdit: (item: AgendaRecord) => void;
    onDelete: (id: number, judul: string) => void;
};

export default function AgendaTable({ data, onDetail, onEdit, onDelete }: AgendaTableProps) {
    return (
        <Table.Container>
            <Table.Header>
                <Table.Th className="w-16 text-center">No</Table.Th>
                <Table.Th>Nama Agenda</Table.Th>
                <Table.Th>Kategori</Table.Th>
                <Table.Th>Tanggal</Table.Th>
                <Table.Th>Waktu</Table.Th>
                <Table.Th>Tipe Hari</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
            </Table.Header>

            <Table.Body>
                {data.length === 0 ? (
                    <Table.Row>
                        <Table.Td colSpan={8} className="p-8 text-center text-zinc-500">
                            Tidak ada data agenda yang ditemukan.
                        </Table.Td>
                    </Table.Row>
                ) : (
                    data.map((record) => {
                        const formattedDate = new Date(record.tanggal).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        });

                        const timeRange = record.waktu_mulai 
                            ? `${record.waktu_mulai.substring(0, 5)}${record.waktu_selesai ? ' - ' + record.waktu_selesai.substring(0, 5) : ''}`
                            : '-';

                        return (
                            <Table.Row key={record.id}>
                                <Table.Td className="text-center">{record.no}</Table.Td>
                                <Table.Td className="font-medium text-zinc-900 max-w-xs truncate">{record.judul}</Table.Td>
                                <Table.Td>{record.kategori}</Table.Td>
                                <Table.Td>{formattedDate}</Table.Td>
                                <Table.Td>{timeRange}</Table.Td>
                                <Table.Td>
                                    {record.tipe_hari === 'LIBUR' ? (
                                        <Badge variant="outline" size="sm">
                                            Libur
                                        </Badge>
                                    ) : record.tipe_hari === 'PENTING' ? (
                                        <Badge variant="outline" size="sm">
                                            Penting
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" size="sm">
                                            Kegiatan
                                        </Badge>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    {record.status === 'active' ? (
                                        <Badge variant="success" size="sm">
                                            Aktif
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" size="sm">
                                            Nonaktif
                                        </Badge>
                                    )}
                                </Table.Td>
                                <Table.Td stickyRight>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            icon={<Eye className="size-3.5" />}
                                            onClick={() => onDetail(record)}
                                        >
                                            Detail
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="warning"
                                            icon={<Pencil className="size-3.5" />}
                                            onClick={() => onEdit(record)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            icon={<Trash2 className="size-3.5" />}
                                            onClick={() => onDelete(record.id, record.judul)}
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
    );
}
