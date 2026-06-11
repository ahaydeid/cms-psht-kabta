import Modal from '@/Components/Base/Modal';
import { Button, Badge } from '@/Components/ui';
import { Check, Trash2 } from 'lucide-react';
import type { PesanRecord } from './PesanTable';

type PesanModalProps = {
    open: boolean;
    onClose: () => void;
    data: PesanRecord | null;
    onMarkAsRead: () => void;
    onDelete: (id: number) => void;
};

export default function PesanModal({
    open,
    onClose,
    data,
    onMarkAsRead,
    onDelete,
}: PesanModalProps) {
    if (!data) return null;

    const isUnread = !data.is_read;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const datePart = d.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
        const timePart = d.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${datePart}, pukul ${timePart.replace(':', '.')}`;
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-zinc-900">Detail Pesan</span>
                    {isUnread ? (
                        <Badge variant="success" size="sm" className="rounded-full px-2.5 py-0.5 lowercase">
                            baru
                        </Badge>
                    ) : (
                        <Badge variant="outline" size="sm" className="rounded-full px-2.5 py-0.5 lowercase">
                            dibaca
                        </Badge>
                    )}
                </div>
            }
            subtitle={formatDate(data.created_at)}
            size="lg"
            footer={
                <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                                if (confirm(`Hapus pesan dari ${data.nama}?`)) {
                                    onDelete(data.id);
                                }
                            }}
                            icon={<Trash2 className="h-4 w-4" />}
                        >
                            Hapus
                        </Button>
                        
                        {isUnread && (
                            <Button 
                                type="button" 
                                variant="primary" 
                                onClick={() => {
                                    if (confirm('Tandai pesan ini sebagai sudah dibaca?')) {
                                        onMarkAsRead();
                                    }
                                }} 
                                icon={<Check className="h-4 w-4" />}
                                className="text-zinc-950!"
                            >
                                Tandai Dibaca
                            </Button>
                        )}
                    </div>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 text-sm text-zinc-700">
                <div className="grid grid-cols-[140px_10px_1fr] gap-y-3.5 text-sm">
                    <span className="font-semibold text-zinc-500">Pengirim</span>
                    <span className="text-zinc-400">:</span>
                    <span className="text-zinc-800">{data.nama}</span>

                    <span className="font-semibold text-zinc-500">Email / Telpon</span>
                    <span className="text-zinc-400">:</span>
                    <span className="text-zinc-800">{data.email}</span>

                    <span className="font-semibold text-zinc-500">Subjek</span>
                    <span className="text-zinc-400">:</span>
                    <span className="text-zinc-800">{data.subjek || '-'}</span>

                    <span className="font-semibold text-zinc-500">Source</span>
                    <span className="text-zinc-400">:</span>
                    <span className="text-zinc-800">{data.ranting || 'Web Official'}</span>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                    <p className="whitespace-pre-wrap leading-relaxed text-zinc-800 text-sm">
                        {data.pesan}
                    </p>
                </div>
            </div>
        </Modal>
    );
}
