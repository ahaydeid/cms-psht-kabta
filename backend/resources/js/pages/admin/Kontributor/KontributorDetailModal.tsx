import { Modal } from '@/Components/Base';
import { Button } from '@/Components/ui/Button';

type UserRecordDetail = {
    id: number;
    name: string;
    username?: string | null;
    email?: string | null;
    ranting?: string | null;
    kontribusi?: {
        tulisan: number;
        galeri: number;
    } | null;
};

type KontributorDetailModalProps = {
    open: boolean;
    user: UserRecordDetail | null;
    onClose: () => void;
};

export function KontributorDetailModal({
    open,
    user,
    onClose,
}: KontributorDetailModalProps) {
    if (!user) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Detail Kontributor"
            size="xl"
            footer={
                <div className="flex w-full items-center justify-end">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </div>
            }
        >
            <div className="space-y-6 pt-2">
                <div className="w-full rounded border border-zinc-100 bg-zinc-50 p-4">
                    <h4 className="mb-3 text-xs uppercase tracking-wider text-zinc-600">
                        Informasi Kontributor
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InfoItem label="Nama Lengkap" value={user.name} />
                        <InfoItem label="Ranting" value={user.ranting || '-'} />
                        <InfoItem label="Username" value={user.username || '-'} />
                        <InfoItem label="Email" value={user.email || '-'} />
                    </div>
                </div>

                <div className="w-full rounded border border-zinc-100 bg-zinc-50 p-4">
                    <h4 className="mb-3 text-xs uppercase tracking-wider text-zinc-600">
                        Statistik Kontribusi
                    </h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded border border-zinc-200 bg-white p-3 text-center">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Total Tulisan</span>
                            <p className="mt-1 text-2xl font-bold text-zinc-800">{user.kontribusi?.tulisan ?? 0}</p>
                        </div>
                        <div className="rounded border border-zinc-200 bg-white p-3 text-center">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400">Total Galeri</span>
                            <p className="mt-1 text-2xl font-bold text-zinc-800">{user.kontribusi?.galeri ?? 0}</p>
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
