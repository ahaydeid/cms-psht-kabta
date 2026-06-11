import { Head, router } from '@inertiajs/react';
import { Plus, Eye } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Table } from '@/Components/Base/Table';
import { Button, Badge } from '@/Components/ui';
import { AdminLayout } from '@/Layouts/AdminLayout';
import { confirmAction, showToast } from '@/lib/alert';
import { AkunFormModal } from './AkunFormModal';
import { AkunDetailModal, type UserRecordDetail } from './AkunDetailModal';

type RoleRecord = {
    id: number;
    name: string;
};

type RantingRecord = {
    id: number;
    nama: string;
};

type KeanggotaanRecord = {
    id: number;
    ranting?: RantingRecord;
};

type UserRecord = {
    id: number;
    name: string;
    username: string;
    email?: string | null;
    roles?: RoleRecord[];
    keanggotaan_id?: number | null;
    keanggotaan?: KeanggotaanRecord;
    is_active: boolean;
};

type Keanggotaan = {
    id: number;
    name: string;
    member_number: string;
};

type AkunProps = {
    users?: UserRecord[];
    keanggotaans?: Keanggotaan[];
};

const roleLabels: Record<string, string> = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    kontributor: 'Kontributor',
    warga: 'Warga Biasa',
};

export default function AkunIndex({ users = [], keanggotaans = [] }: AkunProps) {
    const initialData = users;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    // Search and Pagination States
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter Data client-side
    const filteredData = useMemo(() => {
        return initialData.filter((item) => {
            const roleName = item.roles?.[0]?.name || '';
            const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const emailMatch = (item.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            const roleMatch = (roleLabels[roleName] || roleName).toLowerCase().includes(searchTerm.toLowerCase());
            const rantingMatch = (item.keanggotaan?.ranting?.nama || '').toLowerCase().includes(searchTerm.toLowerCase());

            return nameMatch || emailMatch || roleMatch || rantingMatch;
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

    const handleToggleActive = async (account: UserRecordDetail) => {
        const isActive = !account.is_active;
        const confirmation = await confirmAction({
            title: isActive ? 'Aktifkan akun ini?' : 'Nonaktifkan akun ini?',
            text: isActive
                ? 'Akun akan diaktifkan kembali dan bisa digunakan untuk masuk ke aplikasi.'
                : 'Akun akan dinonaktifkan dan tidak bisa digunakan untuk masuk ke aplikasi.',
            confirmButtonText: isActive ? 'Ya, aktifkan' : 'Ya, nonaktifkan',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        router.patch(`/admin/akun/${account.id}/status`, { is_active: isActive }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast({
                    title: isActive ? 'Akun berhasil diaktifkan' : 'Akun berhasil dinonaktifkan',
                    icon: 'success',
                });
                setIsDetailOpen(false);
                setTimeout(() => setSelectedUser(null), 300);
            },
        });
    };

    const handleResetPassword = async (account: UserRecordDetail) => {
        const confirmation = await confirmAction({
            title: 'Reset password akun ini?',
            text: 'Password akun akan direset ke password awal baru.',
            variant: 'warning',
            confirmButtonText: 'Ya, reset',
        });

        if (!confirmation.isConfirmed) {
            return;
        }

        const generatedPassword = 'password@123!';
        const copyText = `Nama Akun: ${account.name}\nUsername/NIW: ${account.username}\nPassword Baru: ${generatedPassword}`;
        const copyButtonId = `copy-reset-password-${account.id}`;

        router.post(`/admin/akun/${account.id}/reset-password`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                import('sweetalert2').then(({ default: Swal }) => {
                    Swal.fire({
                        title: 'Password berhasil direset',
                        html: `
                            <div class="space-y-3 text-left">
                                <p class="text-sm text-gray-500">Gunakan password awal baru berikut untuk login berikutnya.</p>
                                <div class="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Password Awal Baru</p>
                                    <p class="mt-1 text-lg font-bold text-slate-900">${generatedPassword}</p>
                                </div>
                                <button
                                    id="${copyButtonId}"
                                    type="button"
                                    class="mt-2 inline-flex items-center justify-center rounded border border-slate-200 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Salin
                                </button>
                            </div>
                        `,
                        icon: 'success',
                        didOpen: () => {
                            const copyButton = document.getElementById(copyButtonId);
                            if (!copyButton) {
                                return;
                            }

                            copyButton.addEventListener('click', async () => {
                                await navigator.clipboard.writeText(copyText);
                                copyButton.textContent = 'Tersalin';
                            });
                        },
                    });
                });
                setIsDetailOpen(false);
                setTimeout(() => setSelectedUser(null), 300);
            },
        });
    };

    const handleUpdateRole = (account: UserRecordDetail, role: string) => {
        router.put(`/admin/akun/${account.id}`, { role }, {
            preserveScroll: true,
            onSuccess: () => {
                showToast({
                    title: 'Role akun berhasil diperbarui',
                    icon: 'success',
                });
                setIsDetailOpen(false);
                setTimeout(() => setSelectedUser(null), 300);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Data Akun" />

            <Table.Root>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900">Data Akun</h1>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <Button
                            icon={<Plus className="size-4" />}
                            variant="primary"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Tambah Akun
                        </Button>

                        <Table.Controls
                            rowsPerPage={rowsPerPage}
                            setRowsPerPage={setRowsPerPage}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Cari nama, ranting, email, role..."
                        />
                    </div>
                </div>

                <Table.Container>
                    <Table.Header>
                        <Table.Th className="w-16 text-center">No</Table.Th>
                        <Table.Th>Nama Akun</Table.Th>
                        <Table.Th>Ranting</Table.Th>
                        <Table.Th>Username</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Role</Table.Th>
                        <Table.Th className="w-24 text-center">Status</Table.Th>
                        <Table.Th stickyRight className="w-36 text-center">Aksi</Table.Th>
                    </Table.Header>

                    <Table.Body>
                        {paginatedData.length === 0 ? (
                            <Table.Row>
                                <Table.Td colSpan={8} className="p-8 text-center text-zinc-500">
                                    Tidak ada data akun yang sesuai.
                                </Table.Td>
                            </Table.Row>
                        ) : (
                            paginatedData.map((record, index) => (
                                <Table.Row key={record.id}>
                                    <Table.Td className="text-center">{fromIndex + index}</Table.Td>
                                    <Table.Td>{record.name}</Table.Td>
                                    <Table.Td>{record.keanggotaan?.ranting?.nama || '-'}</Table.Td>
                                    <Table.Td>{record.username}</Table.Td>
                                    <Table.Td>{record.email || '-'}</Table.Td>
                                    <Table.Td className="capitalize">
                                        {record.roles?.[0]?.name 
                                            ? (roleLabels[record.roles[0].name] || record.roles[0].name) 
                                            : '-'}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <Badge variant={record.is_active ? 'success' : 'secondary'}>
                                            {record.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td stickyRight>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                icon={<Eye className="size-3.5" />}
                                                onClick={() => {
                                                    setSelectedUser(record);
                                                    setIsDetailOpen(true);
                                                }}
                                            >
                                                Detail
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

            <AkunFormModal
                mode="create"
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                submitUrl="/admin/akun"
                keanggotaans={keanggotaans}
            />

            <AkunDetailModal
                open={isDetailOpen}
                account={selectedUser as unknown as UserRecordDetail}
                onClose={() => {
                    setIsDetailOpen(false);
                    setTimeout(() => setSelectedUser(null), 300);
                }}
                onUpdateRole={handleUpdateRole}
                onToggleActive={handleToggleActive}
                onResetPassword={handleResetPassword}
            />
        </AdminLayout>
    );
}
