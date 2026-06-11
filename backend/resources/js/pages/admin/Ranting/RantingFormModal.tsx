import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import { Modal } from '@/Components/Base';
import { Button, Input, Textarea } from '@/Components/ui';
import { confirmAction, showToast } from '@/lib/alert';

export type RantingFormData = {
    nama: string;
    alamat: string | null;
    ketua: string | null;
    kontak: string | null;
};

type RantingFormModalProps = {
    initialData?: Partial<RantingFormData>;
    mode: 'create' | 'edit';
    onClose: () => void;
    open: boolean;
    submitUrl: string;
};

export function RantingFormModal({
    initialData,
    mode,
    onClose,
    open,
    submitUrl,
}: RantingFormModalProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<RantingFormData>({
        nama: initialData?.nama ?? '',
        alamat: initialData?.alamat ?? '',
        ketua: initialData?.ketua ?? '',
        kontak: initialData?.kontak ?? '',
    });

    useEffect(() => {
        if (open) {
            setData({
                nama: initialData?.nama ?? '',
                alamat: initialData?.alamat ?? '',
                ketua: initialData?.ketua ?? '',
                kontak: initialData?.kontak ?? '',
            });
            clearErrors();
        } else {
            reset();
            clearErrors();
        }
    }, [open, initialData]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const result = await confirmAction({
            title: mode === 'create' ? 'Tambah Ranting Baru?' : 'Simpan Perubahan?',
            text: mode === 'create' 
                ? 'Apakah Anda yakin ingin menambahkan data ranting ini ke dalam sistem?'
                : 'Apakah Anda yakin ingin menyimpan perubahan pada data ranting ini?',
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
            variant: 'info'
        });

        if (!result.isConfirmed) {
            return;
        }

        if (mode === 'create') {
            post(submitUrl, {
                onSuccess: () => {
                    showToast({
                        title: 'Data ranting berhasil ditambahkan.',
                    });
                    onClose();
                },
            });
        } else {
            put(submitUrl, {
                onSuccess: () => {
                    showToast({
                        title: 'Data ranting berhasil diperbarui.',
                    });
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            subtitle={mode === 'create' ? 'Tambahkan data ranting baru ke sistem.' : 'Perbarui informasi data ranting.'}
            onClose={onClose}
            open={open}
            title={mode === 'create' ? 'Tambah Ranting' : 'Edit Ranting'}
            size="lg"
        >
            <form onSubmit={submit} className="space-y-4">
                <Input
                    id="nama"
                    label="Nama Ranting *"
                    placeholder="Contoh: Ranting Suka Makmur"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    error={errors.nama}
                    required
                />
                
                <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                        id="ketua"
                        label="Ketua Ranting"
                        placeholder="Nama ketua ranting"
                        value={data.ketua ?? ''}
                        onChange={(e) => setData('ketua', e.target.value)}
                        error={errors.ketua}
                    />
                    <Input
                        id="kontak"
                        label="Nomor Kontak"
                        placeholder="08123456789"
                        value={data.kontak ?? ''}
                        onChange={(e) => setData('kontak', e.target.value)}
                        error={errors.kontak}
                    />
                </div>

                <Textarea
                    id="alamat"
                    label="Sekretariat / Alamat"
                    placeholder="Alamat lengkap sekretariat ranting..."
                    value={data.alamat ?? ''}
                    onChange={(e) => setData('alamat', e.target.value)}
                    error={errors.alamat}
                    rows={3}
                />

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" icon={<Save className="h-4 w-4" />} isLoading={processing}>
                        Simpan
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
