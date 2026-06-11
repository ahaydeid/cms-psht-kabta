import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import { Modal } from '@/Components/Base';
import { Button, Input, Select, Combobox } from '@/Components/ui';
import { confirmAction } from '@/lib/alert';

type Keanggotaan = {
    id: number;
    name: string;
    member_number: string;
    user_exists?: boolean;
    ranting?: {
        nama: string;
    };
};

type RoleOption = 'superadmin' | 'admin' | 'kontributor' | 'warga';

export type AkunFormData = {
    username: string;
    email: string;
    role: RoleOption;
    keanggotaan_id: string;
};

type AkunFormModalProps = {
    initialData?: Partial<AkunFormData>;
    keanggotaans: Keanggotaan[];
    mode: 'create' | 'edit';
    onClose: () => void;
    open: boolean;
    submitUrl: string;
};

export function AkunFormModal({
    initialData,
    keanggotaans,
    mode,
    onClose,
    open,
    submitUrl,
}: AkunFormModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<AkunFormData>({
        username: initialData?.username ?? '',
        email: initialData?.email ?? '',
        role: initialData?.role ?? 'warga',
        keanggotaan_id: initialData?.keanggotaan_id ?? '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            setData({
                username: initialData?.username ?? '',
                email: initialData?.email ?? '',
                role: initialData?.role ?? 'warga',
                keanggotaan_id: initialData?.keanggotaan_id ?? '',
            });
        } else {
            reset();
            clearErrors();
        }
    }, [open, initialData]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        
        const options = {
            onSuccess: () => {
                onClose();
                reset();
            },
            preserveScroll: true,
        };

        if (mode === 'edit') {
            put(submitUrl, options);
        } else {
            const result = await confirmAction({
                title: 'Simpan Akun?',
                text: 'Apakah Anda yakin ingin membuat akun untuk warga ini?',
                confirmButtonText: 'Ya, Simpan',
                variant: 'info'
            });
            if (result.isConfirmed) {
                post(submitUrl, options);
            }
        }
    };

    return (
        <Modal
            onClose={onClose}
            open={open}
            size="md"
            title={mode === 'create' ? 'Tambah Akun' : 'Edit Akun'}
            footer={
                <>
                    <Button onClick={onClose} variant="secondary" disabled={processing}>
                        Batal
                    </Button>
                    <Button
                        onClick={submit as unknown as () => void}
                        variant="primary"
                        icon={<Save className="h-4 w-4" />}
                        isLoading={processing}
                        disabled={processing}
                    >
                        Simpan Data
                    </Button>
                </>
            }
        >
            <form id="akun-form" onSubmit={submit} className="space-y-4 pt-2">
                {mode === 'create' && (
                    <>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">Warga</label>
                            <Combobox
                                options={keanggotaans.map(k => ({ 
                                    label: `${k.name} (${k.ranting?.nama || k.member_number})${k.user_exists ? ' - Sudah Terdaftar' : ''}`, 
                                    value: k.id.toString(),
                                    disabled: k.user_exists 
                                }))}
                                value={data.keanggotaan_id}
                                onChange={(val) => {
                                    const selected = keanggotaans.find((k) => k.id.toString() === val);
                                    setData((prev) => ({
                                        ...prev,
                                        keanggotaan_id: val,
                                        username: selected ? selected.member_number : '',
                                    }));
                                }}
                                placeholder="Pilih Warga"
                                error={errors.keanggotaan_id}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">Username</label>
                            <div className="text-sm text-zinc-800 py-3 bg-slate-50 flex items-center justify-center w-full rounded">
                                {data.username ? (
                                    <span className="font-medium">{data.username}</span>
                                ) : (
                                    <span className="italic text-zinc-400">-</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700">
                                Email <span className="font-normal italic text-zinc-400">(opsional)</span>
                            </label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Masukkan email valid jika ada"
                                error={errors.email}
                            />
                        </div>
                    </>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-zinc-700">Role</label>
                    <Select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value as RoleOption)}
                        error={errors.role}
                    >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="kontributor">Kontributor</option>
                        <option value="warga">Warga Biasa</option>
                    </Select>
                </div>
            </form>
        </Modal>
    );
}
