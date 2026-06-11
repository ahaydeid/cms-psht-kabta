import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Modal from '@/Components/Base/Modal';
import { Button, Badge, Input } from '@/Components/ui';
import type { AgendaRecord } from './AgendaTable';

type AgendaFormPayload = Omit<AgendaRecord, 'id'>;

type AgendaModalProps = {
    open: boolean;
    onClose: () => void;
    data?: AgendaRecord | null;
    mode: 'create' | 'detail' | 'edit';
    onRequestEdit: () => void;
    onSave: (data: AgendaFormPayload) => Promise<void>;
    onDelete?: (id: number) => Promise<void>;
    errors?: Record<string, string>;
};

function createInitialForm(): AgendaFormPayload {
    return {
        judul: '',
        keterangan: '',
        tanggal: '',
        waktu_mulai: '',
        waktu_selesai: '',
        kategori: 'Semua',
        tipe_hari: 'KEGIATAN',
        status: 'active',
    };
}

export default function AgendaModal({
    open,
    onClose,
    data,
    mode,
    onRequestEdit,
    onSave,
    onDelete,
    errors = {},
}: AgendaModalProps) {
    const [form, setForm] = useState<AgendaFormPayload>(createInitialForm());
    const [processing, setProcessing] = useState(false);
    const isReadOnly = mode === 'detail';

    useEffect(() => {
        if (data) {
            setForm({
                judul: data.judul,
                keterangan: data.keterangan || '',
                tanggal: data.tanggal || '',
                waktu_mulai: data.waktu_mulai ? data.waktu_mulai.substring(0, 5) : '',
                waktu_selesai: data.waktu_selesai ? data.waktu_selesai.substring(0, 5) : '',
                kategori: data.kategori || 'Semua',
                tipe_hari: data.tipe_hari || 'KEGIATAN',
                status: data.status || 'active',
            });
            return;
        }

        if (open) {
            setForm(createInitialForm());
        }
    }, [data, open]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setProcessing(true);
        try {
            await onSave(form);
        } catch (error) {
            // Error handled outside in Index.tsx or inside here
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!data || !onDelete) return;
        setProcessing(true);
        try {
            await onDelete(data.id);
        } catch (error) {
            // Handled outside
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={mode === 'detail' ? 'Detail Agenda Kegiatan' : mode === 'edit' ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan'}
            size="xl"
            footer={isReadOnly ? (
                <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {data && onDelete ? (
                            <Button
                                type="button"
                                variant="danger"
                                onClick={handleDelete}
                                icon={<Trash2 className="h-4 w-4" />}
                                disabled={processing}
                            >
                                Hapus
                            </Button>
                        ) : null}
                        <Button 
                            type="button" 
                            variant="warning" 
                            onClick={onRequestEdit} 
                            icon={<Pencil className="h-4 w-4" />}
                            className="text-zinc-950!"
                        >
                            Edit
                        </Button>
                    </div>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            ) : (
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={processing}>
                        Batal
                    </Button>
                    <Button 
                        type="submit" 
                        form="agenda-kegiatan-form" 
                        disabled={processing}
                        variant="primary"
                        className="text-zinc-950!"
                    >
                        Simpan
                    </Button>
                </>
            )}
        >
            {isReadOnly ? (
                <div className="space-y-5 text-sm text-zinc-700">
                    <DetailField label="Nama Agenda" value={form.judul} />
                    <DetailBlock label="Detail Agenda" value={form.keterangan || ''} />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <DetailField label="Tanggal" value={formatDate(form.tanggal)} />
                        <DetailField label="Jam Mulai" value={form.waktu_mulai || '-'} />
                        <DetailField label="Jam Selesai" value={form.waktu_selesai || '-'} />
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Tipe Hari</div>
                            <div className="mt-1">
                                {form.tipe_hari === 'LIBUR' ? (
                                    <Badge variant="outline">Libur</Badge>
                                ) : form.tipe_hari === 'PENTING' ? (
                                    <Badge variant="outline">Penting</Badge>
                                ) : (
                                    <Badge variant="outline">Kegiatan</Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <DetailField label="Kategori" value={form.kategori} />
                        <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Status</div>
                            <div className="mt-1">
                                <Badge variant={form.status === 'active' ? 'success' : 'secondary'}>
                                    {form.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form id="agenda-kegiatan-form" onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Nama Agenda"
                        placeholder="Tulis nama agenda..."
                        value={form.judul}
                        onChange={(e) => setForm((prev) => ({ ...prev, judul: e.target.value }))}
                        error={errors.judul}
                        required
                    />

                    <div className="flex flex-col space-y-1.5">
                        <label className="block text-xs font-semibold text-zinc-700">
                            Detail Agenda
                        </label>
                        <textarea
                            className="w-full resize-none rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 min-h-[8rem]"
                            placeholder="Tulis keterangan/detail agenda..."
                            value={form.keterangan || ''}
                            onChange={(e) => setForm((prev) => ({ ...prev, keterangan: e.target.value }))}
                        />
                        {errors.keterangan && <p className="text-xs text-red-600 mt-1">{errors.keterangan}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                            label="Tanggal"
                            type="date"
                            value={form.tanggal}
                            onChange={(e) => setForm((prev) => ({ ...prev, tanggal: e.target.value }))}
                            error={errors.tanggal}
                            required
                        />
                        <div />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Input
                            label="Jam Mulai"
                            type="time"
                            value={form.waktu_mulai || ''}
                            onChange={(e) => setForm((prev) => ({ ...prev, waktu_mulai: e.target.value }))}
                            error={errors.waktu_mulai}
                        />

                        <Input
                            label="Jam Selesai"
                            type="time"
                            value={form.waktu_selesai || ''}
                            onChange={(e) => setForm((prev) => ({ ...prev, waktu_selesai: e.target.value }))}
                            error={errors.waktu_selesai}
                        />

                        <div className="flex flex-col space-y-1.5">
                            <label className="block text-xs font-semibold text-zinc-700">
                                Tipe Hari
                            </label>
                            <select
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                value={form.tipe_hari}
                                onChange={(e) => setForm((prev) => ({ ...prev, tipe_hari: e.target.value as any }))}
                            >
                                <option value="KEGIATAN">Kegiatan</option>
                                <option value="PENTING">Penting</option>
                                <option value="LIBUR">Libur</option>
                            </select>
                            {errors.tipe_hari && <p className="text-xs text-red-600 mt-1">{errors.tipe_hari}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col space-y-1.5">
                            <label className="block text-xs font-semibold text-zinc-700">
                                Kategori / Peruntukan
                            </label>
                            <select
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                value={form.kategori}
                                onChange={(e) => setForm((prev) => ({ ...prev, kategori: e.target.value }))}
                            >
                                <option value="Semua">Semua</option>
                                <option value="Warga">Warga</option>
                                <option value="Pengurus">Pengurus</option>
                            </select>
                            {errors.kategori && <p className="text-xs text-red-600 mt-1">{errors.kategori}</p>}
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label className="block text-xs font-semibold text-zinc-700">
                                Status
                            </label>
                            <select
                                className="w-full rounded border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-950 outline-none transition-all focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30"
                                value={form.status}
                                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as any }))}
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Nonaktif</option>
                            </select>
                            {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
                        </div>
                    </div>
                </form>
            )}
        </Modal>
    );
}

function DetailField({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">{value || '-'}</div>
        </div>
    );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
    return (
        <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</h2>
            <div className="mt-1 rounded bg-zinc-50 border border-zinc-100 px-4 py-3">
                <p className="whitespace-pre-line text-sm leading-6 text-zinc-700">{value || '-'}</p>
            </div>
        </section>
    );
}

function formatDate(value: string) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}
