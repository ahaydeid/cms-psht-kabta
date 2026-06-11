import { useState, useEffect } from 'react';
import { Lock, LockOpen, KeyRound } from 'lucide-react';
import { Modal } from '@/Components/Base';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Select } from '@/Components/ui';

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
    name: string;
    member_number: string;
    ranting?: RantingRecord;
};

export type UserRecordDetail = {
    id: number;
    name: string;
    username: string;
    email?: string | null;
    roles?: RoleRecord[];
    keanggotaan_id?: number | null;
    keanggotaan?: KeanggotaanRecord;
    is_active: boolean;
};

type AkunDetailModalProps = {
    open: boolean;
    account: UserRecordDetail | null;
    onClose: () => void;
    onUpdateRole: (account: UserRecordDetail, role: string) => void;
    onToggleActive: (account: UserRecordDetail) => void;
    onResetPassword: (account: UserRecordDetail) => void;
};

export function AkunDetailModal({
    open,
    account,
    onClose,
    onUpdateRole,
    onToggleActive,
    onResetPassword,
}: AkunDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('warga');

    useEffect(() => {
        if (open && account) {
            setIsEditing(false);
            setSelectedRole(account.roles?.[0]?.name || 'warga');
        }
    }, [open, account]);

    if (!account) {
        return null;
    }

    const roleName = account.roles?.[0]?.name;

    const roleLabel = roleName === 'superadmin' ? 'Super Admin' 
        : roleName === 'admin' ? 'Admin' 
        : roleName === 'kontributor' ? 'Kontributor' 
        : roleName === 'warga' ? 'Warga Biasa' : '-';

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEditing ? 'Edit Akun' : 'Detail Akun'}
            size="2xl"
            footer={
                isEditing ? (
                    <div className="flex w-full items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedRole(account.roles?.[0]?.name || 'warga');
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => onUpdateRole(account, selectedRole)}
                        >
                            Simpan
                        </Button>
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant={account.is_active ? 'secondary' : 'success'}
                                icon={account.is_active ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
                                onClick={() => onToggleActive(account)}
                            >
                                {account.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                icon={<KeyRound className="size-3.5" />}
                                onClick={() => onResetPassword(account)}
                            >
                                Reset Password
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                className="bg-rose-600! text-white! hover:bg-rose-700!"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Tutup
                            </Button>
                        </div>
                    </div>
                )
            }
        >
            <div className="space-y-6 pt-2">
                {account.keanggotaan ? (
                    <div className="rounded border border-zinc-100 bg-zinc-50 p-4">
                        <h4 className="mb-3 text-xs uppercase tracking-wider text-zinc-600">
                            Informasi Warga Tertaut
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <InfoItem label="Nama Lengkap" value={account.keanggotaan.name} />
                            <InfoItem label="Nomor Induk Warga" value={account.keanggotaan.member_number} />
                            <InfoItem label="Ranting" value={account.keanggotaan.ranting?.nama || '-'} />
                        </div>
                    </div>
                ) : (
                    <div className="rounded border border-zinc-100 bg-zinc-50 p-4 text-sm text-zinc-500 text-center">
                        Akun ini tidak tertaut dengan profil Warga manapun.
                    </div>
                )}

                <div className="w-full rounded border border-zinc-100 bg-zinc-50 p-4">
                    <h4 className="mb-3 text-xs uppercase tracking-wider text-zinc-600">
                        Informasi Akun
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-4">
                        <InfoItem label="Nama Akun" value={account.name} />
                        <InfoItem label="Username" value={account.username} />
                        <InfoItem label="Email" value={account.email || '-'} />
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-zinc-400">
                                Status Akun
                            </div>
                            <div className="mt-1">
                                <Badge variant={account.is_active ? 'success' : 'secondary'}>
                                    {account.is_active ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-zinc-400">
                                Role Akses
                            </div>
                            <div className="mt-1">
                                {isEditing ? (
                                    <Select
                                        className="h-8 py-0 text-xs"
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >
                                        <option value="superadmin">Super Admin</option>
                                        <option value="admin">Admin</option>
                                        <option value="kontributor">Kontributor</option>
                                        <option value="warga">Warga Biasa</option>
                                    </Select>
                                ) : (
                                    <Badge variant="outline" className="font-normal text-zinc-600">{roleLabel}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-zinc-400 truncate">{label}</div>
            <div className="mt-1 text-sm font-medium text-zinc-800 truncate" title={value}>{value || '-'}</div>
        </div>
    );
}
